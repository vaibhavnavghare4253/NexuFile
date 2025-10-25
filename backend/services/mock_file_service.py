"""
Mock File Service for local development without Google Cloud Storage.
Stores files on local disk under the uploads directory and keeps metadata in-memory.
"""

import os
import uuid
import hashlib
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import logging

logger = logging.getLogger(__name__)


class FileService:
    """Mock file management service saving files to local disk."""

    def __init__(self):
        self.base_upload_dir = os.environ.get('UPLOAD_DIR', 'uploads')
        os.makedirs(self.base_upload_dir, exist_ok=True)
        self.max_file_size = 100 * 1024 * 1024  # 100MB
        self.allowed_extensions = {
            'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
            'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'mp3', 'wav'
        }
        # simple in-memory metadata store: {user_id: {file_id: metadata}}
        self._metadata = {}

    def upload_file(self, file, user_id, ai_analysis=None):
        try:
            if not self._validate_file(file):
                raise ValueError("Invalid file format or size")

            file_id = str(uuid.uuid4())
            original_filename = secure_filename(file.filename)
            ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''

            user_dir = os.path.join(self.base_upload_dir, user_id)
            os.makedirs(user_dir, exist_ok=True)
            stored_name = f"{file_id}.{ext}" if ext else file_id
            file_path = os.path.join(user_dir, stored_name)

            # write file to disk
            file.seek(0)
            with open(file_path, 'wb') as f:
                while True:
                    chunk = file.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)

            # compute size and hash
            file_size = os.path.getsize(file_path)
            file_hash = self._calculate_file_hash(file_path)

            metadata = {
                'file_id': file_id,
                'user_id': user_id,
                'original_filename': original_filename,
                'stored_filename': stored_name,
                'file_path': file_path,
                'file_size': file_size,
                'content_type': getattr(file, 'content_type', 'application/octet-stream'),
                'file_hash': file_hash,
                'upload_date': datetime.utcnow().isoformat(),
                'ai_analysis': ai_analysis or {},
                'security_status': 'safe' if not ai_analysis else ai_analysis.get('security_status', 'pending'),
                'access_count': 0,
                'last_accessed': None
            }

            self._store_file_metadata(metadata)

            return {
                'message': 'File uploaded successfully',
                'file_id': file_id,
                'filename': original_filename,
                'size': file_size,
                'upload_date': metadata['upload_date'],
                'ai_analysis': ai_analysis,
                'security_status': metadata['security_status']
            }
        except Exception as e:
            logger.error(f"Mock file upload error: {str(e)}")
            raise

    def get_user_files(self, user_id):
        user_files = self._metadata.get(user_id, {})
        result = []
        for file_id, m in user_files.items():
            result.append({
                'file_id': file_id,
                'filename': m['original_filename'],
                'size': m['file_size'],
                'upload_date': m['upload_date'],
                'security_status': m['security_status'],
                'access_count': m['access_count']
            })
        return result

    def get_file_details(self, file_id, user_id):
        m = self._get_file_metadata(file_id, user_id)
        if not m:
            raise ValueError("File not found")
        return {
            'file_id': file_id,
            'filename': m['original_filename'],
            'size': m['file_size'],
            'content_type': m['content_type'],
            'upload_date': m['upload_date'],
            'last_accessed': m['last_accessed'],
            'access_count': m['access_count'],
            'security_status': m['security_status'],
            'ai_analysis': m['ai_analysis'],
            'file_hash': m['file_hash']
        }

    def generate_download_url(self, file_id, user_id):
        m = self._get_file_metadata(file_id, user_id)
        if not m:
            raise ValueError("File not found")
        # For mock, return absolute path. Frontend can handle as needed in dev.
        return os.path.abspath(m['file_path'])

    def delete_file(self, file_id, user_id):
        m = self._get_file_metadata(file_id, user_id)
        if not m:
            raise ValueError("File not found")
        try:
            if os.path.exists(m['file_path']):
                os.remove(m['file_path'])
        except Exception as e:
            logger.warning(f"Failed deleting local file: {e}")
        self._delete_file_metadata(file_id, user_id)
        return {'message': 'File deleted successfully', 'file_id': file_id}

    def _validate_file(self, file):
        if not file or not file.filename:
            return False
        if '.' not in file.filename:
            return False
        ext = file.filename.rsplit('.', 1)[1].lower()
        if ext not in self.allowed_extensions:
            return False
        # determine size without consuming stream permanently
        pos = file.tell()
        file.seek(0, 2)
        size = file.tell()
        file.seek(pos)
        if size > self.max_file_size:
            return False
        return True

    def _calculate_file_hash(self, file_path):
        h = hashlib.sha256()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return h.hexdigest()

    def _store_file_metadata(self, metadata):
        user_id = metadata['user_id']
        file_id = metadata['file_id']
        self._metadata.setdefault(user_id, {})[file_id] = metadata

    def _get_file_metadata(self, file_id, user_id):
        return self._metadata.get(user_id, {}).get(file_id)

    def _delete_file_metadata(self, file_id, user_id):
        user_files = self._metadata.get(user_id, {})
        user_files.pop(file_id, None)


