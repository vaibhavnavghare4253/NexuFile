"""
File Service for Secure AI File Management System
Handles file upload, download, storage, and management with Google Cloud Storage
"""

import os
import uuid
import hashlib
from datetime import datetime, timedelta
from google.cloud import storage
from google.cloud.exceptions import NotFound
from werkzeug.utils import secure_filename
import logging

logger = logging.getLogger(__name__)

class FileService:
    """File management service for cloud storage operations"""
    
    def __init__(self):
        """Initialize file service with Google Cloud Storage"""
        self.client = storage.Client()
        self.bucket_name = os.environ.get('GCS_BUCKET_NAME', 'secure-file-storage')
        self.bucket = self.client.bucket(self.bucket_name)
        self.max_file_size = 100 * 1024 * 1024  # 100MB
        self.allowed_extensions = {
            'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
            'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'mp3', 'wav'
        }
    
    def upload_file(self, file, user_id, ai_analysis=None):
        """Upload file to Google Cloud Storage with metadata"""
        try:
            # Validate file
            if not self._validate_file(file):
                raise ValueError("Invalid file format or size")
            
            # Generate unique file ID and secure filename
            file_id = str(uuid.uuid4())
            original_filename = secure_filename(file.filename)
            file_extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
            
            # Create blob name with user organization
            blob_name = f"users/{user_id}/files/{file_id}.{file_extension}"
            
            # Upload file to GCS
            blob = self.bucket.blob(blob_name)
            blob.upload_from_file(file, content_type=file.content_type)
            
            # Calculate file hash for integrity
            file_hash = self._calculate_file_hash(file)
            
            # Store file metadata
            file_metadata = {
                'file_id': file_id,
                'user_id': user_id,
                'original_filename': original_filename,
                'blob_name': blob_name,
                'file_size': file.content_length,
                'content_type': file.content_type,
                'file_hash': file_hash,
                'upload_date': datetime.utcnow().isoformat(),
                'ai_analysis': ai_analysis or {},
                'security_status': 'safe' if not ai_analysis else ai_analysis.get('security_status', 'pending'),
                'access_count': 0,
                'last_accessed': None
            }
            
            # Store metadata in database (would be implemented with actual database)
            self._store_file_metadata(file_metadata)
            
            logger.info(f"File uploaded successfully: {file_id} by user {user_id}")
            
            return {
                'message': 'File uploaded successfully',
                'file_id': file_id,
                'filename': original_filename,
                'size': file.content_length,
                'upload_date': file_metadata['upload_date'],
                'ai_analysis': ai_analysis,
                'security_status': file_metadata['security_status']
            }
            
        except Exception as e:
            logger.error(f"File upload error: {str(e)}")
            raise
    
    def download_file(self, file_id, user_id):
        """Download file from Google Cloud Storage"""
        try:
            # Get file metadata
            file_metadata = self._get_file_metadata(file_id, user_id)
            if not file_metadata:
                raise ValueError("File not found")
            
            # Update access statistics
            self._update_access_stats(file_id, user_id)
            
            # Generate signed URL for download
            blob_name = file_metadata['blob_name']
            blob = self.bucket.blob(blob_name)
            
            # Create signed URL with expiration
            download_url = blob.generate_signed_url(
                expiration=datetime.utcnow() + timedelta(hours=1),
                method='GET'
            )
            
            return {
                'download_url': download_url,
                'filename': file_metadata['original_filename'],
                'content_type': file_metadata['content_type'],
                'size': file_metadata['file_size']
            }
            
        except Exception as e:
            logger.error(f"File download error: {str(e)}")
            raise
    
    def get_user_files(self, user_id):
        """Get list of files for a user"""
        try:
            # This would typically query a database
            # For now, we'll simulate with file listing from GCS
            files = []
            blobs = self.bucket.list_blobs(prefix=f"users/{user_id}/files/")
            
            for blob in blobs:
                if blob.name.endswith('/'):
                    continue
                
                # Extract file ID from blob name
                file_id = blob.name.split('/')[-1].split('.')[0]
                
                # Get metadata (would be from database in real implementation)
                metadata = self._get_file_metadata(file_id, user_id)
                if metadata:
                    files.append({
                        'file_id': file_id,
                        'filename': metadata['original_filename'],
                        'size': metadata['file_size'],
                        'upload_date': metadata['upload_date'],
                        'security_status': metadata['security_status'],
                        'access_count': metadata['access_count']
                    })
            
            return files
            
        except Exception as e:
            logger.error(f"File listing error: {str(e)}")
            raise
    
    def get_file_details(self, file_id, user_id):
        """Get detailed information about a specific file"""
        try:
            file_metadata = self._get_file_metadata(file_id, user_id)
            if not file_metadata:
                raise ValueError("File not found")
            
            return {
                'file_id': file_id,
                'filename': file_metadata['original_filename'],
                'size': file_metadata['file_size'],
                'content_type': file_metadata['content_type'],
                'upload_date': file_metadata['upload_date'],
                'last_accessed': file_metadata['last_accessed'],
                'access_count': file_metadata['access_count'],
                'security_status': file_metadata['security_status'],
                'ai_analysis': file_metadata['ai_analysis'],
                'file_hash': file_metadata['file_hash']
            }
            
        except Exception as e:
            logger.error(f"File details error: {str(e)}")
            raise
    
    def delete_file(self, file_id, user_id):
        """Delete file from storage and metadata"""
        try:
            # Get file metadata
            file_metadata = self._get_file_metadata(file_id, user_id)
            if not file_metadata:
                raise ValueError("File not found")
            
            # Delete file from GCS
            blob_name = file_metadata['blob_name']
            blob = self.bucket.blob(blob_name)
            blob.delete()
            
            # Delete metadata from database
            self._delete_file_metadata(file_id, user_id)
            
            logger.info(f"File deleted successfully: {file_id} by user {user_id}")
            
            return {
                'message': 'File deleted successfully',
                'file_id': file_id
            }
            
        except Exception as e:
            logger.error(f"File deletion error: {str(e)}")
            raise
    
    def generate_download_url(self, file_id, user_id):
        """Generate a secure download URL for a file"""
        try:
            file_metadata = self._get_file_metadata(file_id, user_id)
            if not file_metadata:
                raise ValueError("File not found")
            
            blob_name = file_metadata['blob_name']
            blob = self.bucket.blob(blob_name)
            
            # Generate signed URL with 1-hour expiration
            download_url = blob.generate_signed_url(
                expiration=datetime.utcnow() + timedelta(hours=1),
                method='GET'
            )
            
            return download_url
            
        except Exception as e:
            logger.error(f"Download URL generation error: {str(e)}")
            raise
    
    def share_file(self, file_id, user_id, share_with_user_id, permissions):
        """Share file with another user"""
        try:
            file_metadata = self._get_file_metadata(file_id, user_id)
            if not file_metadata:
                raise ValueError("File not found")
            
            # Create share record
            share_data = {
                'file_id': file_id,
                'owner_id': user_id,
                'shared_with': share_with_user_id,
                'permissions': permissions,
                'shared_date': datetime.utcnow().isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat()
            }
            
            # Store share information
            self._store_share_metadata(share_data)
            
            return {
                'message': 'File shared successfully',
                'share_id': share_data['share_id'],
                'permissions': permissions,
                'expires_at': share_data['expires_at']
            }
            
        except Exception as e:
            logger.error(f"File sharing error: {str(e)}")
            raise
    
    def _validate_file(self, file):
        """Validate file format and size"""
        if not file or not file.filename:
            return False
        
        # Check file extension
        if '.' not in file.filename:
            return False
        
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        if file_extension not in self.allowed_extensions:
            return False
        
        # Check file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > self.max_file_size:
            return False
        
        return True
    
    def _calculate_file_hash(self, file):
        """Calculate SHA-256 hash of file for integrity checking"""
        file.seek(0)
        hash_sha256 = hashlib.sha256()
        for chunk in iter(lambda: file.read(4096), b""):
            hash_sha256.update(chunk)
        file.seek(0)  # Reset to beginning
        return hash_sha256.hexdigest()
    
    def _store_file_metadata(self, metadata):
        """Store file metadata in database"""
        # This would typically store in a database like Firestore or SQL
        # For now, we'll simulate storage
        logger.info(f"Storing file metadata: {metadata['file_id']}")
    
    def _get_file_metadata(self, file_id, user_id):
        """Retrieve file metadata from database"""
        # This would typically query a database
        # For now, we'll simulate retrieval
        return {
            'file_id': file_id,
            'user_id': user_id,
            'original_filename': 'sample_file.txt',
            'blob_name': f"users/{user_id}/files/{file_id}.txt",
            'file_size': 1024,
            'content_type': 'text/plain',
            'file_hash': 'sample_hash',
            'upload_date': datetime.utcnow().isoformat(),
            'ai_analysis': {},
            'security_status': 'safe',
            'access_count': 0,
            'last_accessed': None
        }
    
    def _delete_file_metadata(self, file_id, user_id):
        """Delete file metadata from database"""
        logger.info(f"Deleting file metadata: {file_id}")
    
    def _update_access_stats(self, file_id, user_id):
        """Update file access statistics"""
        logger.info(f"Updating access stats for file: {file_id}")
    
    def _store_share_metadata(self, share_data):
        """Store file sharing metadata"""
        logger.info(f"Storing share metadata: {share_data}")
