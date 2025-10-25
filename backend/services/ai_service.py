"""
AI Service for Secure AI File Management System
Handles AI-powered content analysis, threat detection, and intelligent insights
"""

import os
import json
import base64
from datetime import datetime
from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict
from google.cloud import storage
import tensorflow as tf
import logging

logger = logging.getLogger(__name__)

class AIService:
    """AI service for content analysis and threat detection"""
    
    def __init__(self):
        """Initialize AI service with Google Vertex AI"""
        self.project_id = os.environ.get('VERTEX_AI_PROJECT')
        self.location = os.environ.get('VERTEX_AI_LOCATION', 'us-central1')
        self.model_endpoint = os.environ.get('AI_MODEL_ENDPOINT')
        
        # Initialize Vertex AI
        aiplatform.init(project=self.project_id, location=self.location)
        
        # Initialize storage client for file access
        self.storage_client = storage.Client()
        
        # AI model configurations
        self.confidence_threshold = 0.8
        self.sensitive_data_threshold = 0.7
        
        # Pre-trained model configurations
        self.models = {
            'text_analysis': 'text-bison@001',
            'image_analysis': 'imagenet-classification',
            'document_analysis': 'document-ai',
            'threat_detection': 'security-analysis'
        }
    
    def analyze_file_content(self, file):
        """Analyze file content for sensitive information and threats"""
        try:
            file_type = self._detect_file_type(file)
            analysis_results = {}
            
            # Perform type-specific analysis
            if file_type in ['text', 'document']:
                analysis_results = self._analyze_text_content(file)
            elif file_type in ['image']:
                analysis_results = self._analyze_image_content(file)
            elif file_type in ['video', 'audio']:
                analysis_results = self._analyze_media_content(file)
            
            # Perform general security analysis
            security_analysis = self._perform_security_analysis(file, analysis_results)
            
            # Combine all analysis results
            comprehensive_analysis = {
                'file_type': file_type,
                'content_analysis': analysis_results,
                'security_analysis': security_analysis,
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'confidence_score': self._calculate_confidence_score(analysis_results, security_analysis),
                'recommendations': self._generate_recommendations(analysis_results, security_analysis)
            }
            
            return comprehensive_analysis
            
        except Exception as e:
            logger.error(f"File content analysis error: {str(e)}")
            raise
    
    def _analyze_text_content(self, file):
        """Analyze text content for sensitive information"""
        try:
            # Read file content
            file.seek(0)
            content = file.read().decode('utf-8', errors='ignore')
            
            # Use Vertex AI Text Analysis
            analysis_results = {
                'sensitive_data_detected': [],
                'content_classification': {},
                'entities_identified': [],
                'sentiment_analysis': {},
                'language_detection': 'en'
            }
            
            # Detect PII (Personally Identifiable Information)
            pii_patterns = [
                r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
                r'\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b',  # Credit Card
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email
                r'\b\d{3}-\d{3}-\d{4}\b'  # Phone
            ]
            
            import re
            for pattern in pii_patterns:
                matches = re.findall(pattern, content)
                if matches:
                    analysis_results['sensitive_data_detected'].extend(matches)
            
            # Content classification using AI
            classification = self._classify_content(content)
            analysis_results['content_classification'] = classification
            
            # Entity recognition
            entities = self._extract_entities(content)
            analysis_results['entities_identified'] = entities
            
            # Sentiment analysis
            sentiment = self._analyze_sentiment(content)
            analysis_results['sentiment_analysis'] = sentiment
            
            return analysis_results
            
        except Exception as e:
            logger.error(f"Text content analysis error: {str(e)}")
            return {'error': str(e)}
    
    def _analyze_image_content(self, file):
        """Analyze image content for inappropriate or sensitive content"""
        try:
            # Use Vertex AI Vision API for image analysis
            analysis_results = {
                'object_detection': [],
                'text_extraction': '',
                'inappropriate_content': False,
                'confidence_scores': {},
                'image_metadata': {}
            }
            
            # Convert image to base64 for API
            file.seek(0)
            image_data = base64.b64encode(file.read()).decode('utf-8')
            
            # Object detection
            objects = self._detect_objects(image_data)
            analysis_results['object_detection'] = objects
            
            # Text extraction (OCR)
            extracted_text = self._extract_text_from_image(image_data)
            analysis_results['text_extraction'] = extracted_text
            
            # Inappropriate content detection
            inappropriate = self._detect_inappropriate_content(image_data)
            analysis_results['inappropriate_content'] = inappropriate
            
            return analysis_results
            
        except Exception as e:
            logger.error(f"Image content analysis error: {str(e)}")
            return {'error': str(e)}
    
    def _analyze_media_content(self, file):
        """Analyze video/audio content for threats and sensitive information"""
        try:
            analysis_results = {
                'media_type': 'video' if file.content_type.startswith('video') else 'audio',
                'duration': 0,
                'content_analysis': {},
                'threat_indicators': [],
                'metadata_extraction': {}
            }
            
            # Basic metadata extraction
            metadata = self._extract_media_metadata(file)
            analysis_results['metadata_extraction'] = metadata
            
            # Content analysis (simplified for demo)
            content_analysis = self._analyze_media_content_basic(file)
            analysis_results['content_analysis'] = content_analysis
            
            return analysis_results
            
        except Exception as e:
            logger.error(f"Media content analysis error: {str(e)}")
            return {'error': str(e)}
    
    def _perform_security_analysis(self, file, content_analysis):
        """Perform comprehensive security analysis"""
        try:
            security_results = {
                'threat_level': 'low',
                'malware_indicators': [],
                'suspicious_patterns': [],
                'encryption_status': 'none',
                'data_classification': 'public',
                'compliance_issues': []
            }
            
            # Check for malware indicators
            malware_indicators = self._scan_for_malware(file)
            security_results['malware_indicators'] = malware_indicators
            
            # Analyze suspicious patterns
            suspicious_patterns = self._detect_suspicious_patterns(file, content_analysis)
            security_results['suspicious_patterns'] = suspicious_patterns
            
            # Determine data classification
            data_classification = self._classify_data_sensitivity(content_analysis)
            security_results['data_classification'] = data_classification
            
            # Check compliance issues
            compliance_issues = self._check_compliance(content_analysis)
            security_results['compliance_issues'] = compliance_issues
            
            # Calculate overall threat level
            threat_level = self._calculate_threat_level(security_results)
            security_results['threat_level'] = threat_level
            
            return security_results
            
        except Exception as e:
            logger.error(f"Security analysis error: {str(e)}")
            return {'error': str(e)}
    
    def reanalyze_file(self, file_id, user_id):
        """Re-analyze an existing file with updated AI models"""
        try:
            # Get file from storage
            file_data = self._get_file_from_storage(file_id, user_id)
            
            # Perform fresh analysis
            new_analysis = self.analyze_file_content(file_data)
            
            # Update file metadata with new analysis
            self._update_file_analysis(file_id, user_id, new_analysis)
            
            return {
                'message': 'File re-analyzed successfully',
                'file_id': file_id,
                'new_analysis': new_analysis,
                'analysis_timestamp': new_analysis['analysis_timestamp']
            }
            
        except Exception as e:
            logger.error(f"File re-analysis error: {str(e)}")
            raise
    
    def get_user_insights(self, user_id):
        """Get AI-powered insights for user's files"""
        try:
            insights = {
                'file_statistics': {},
                'security_summary': {},
                'content_trends': {},
                'recommendations': [],
                'risk_assessment': {}
            }
            
            # Get user's file statistics
            file_stats = self._get_user_file_statistics(user_id)
            insights['file_statistics'] = file_stats
            
            # Security summary
            security_summary = self._get_security_summary(user_id)
            insights['security_summary'] = security_summary
            
            # Content trends analysis
            content_trends = self._analyze_content_trends(user_id)
            insights['content_trends'] = content_trends
            
            # Generate recommendations
            recommendations = self._generate_user_recommendations(user_id)
            insights['recommendations'] = recommendations
            
            # Risk assessment
            risk_assessment = self._assess_user_risk(user_id)
            insights['risk_assessment'] = risk_assessment
            
            return insights
            
        except Exception as e:
            logger.error(f"User insights error: {str(e)}")
            raise
    
    def _detect_file_type(self, file):
        """Detect file type based on content and extension"""
        content_type = file.content_type.lower()
        
        if content_type.startswith('text/'):
            return 'text'
        elif content_type.startswith('image/'):
            return 'image'
        elif content_type.startswith('video/'):
            return 'video'
        elif content_type.startswith('audio/'):
            return 'audio'
        elif content_type in ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            return 'document'
        else:
            return 'unknown'
    
    def _classify_content(self, content):
        """Classify content using AI model"""
        # Simplified classification for demo
        return {
            'category': 'general',
            'confidence': 0.85,
            'subcategories': ['text', 'document']
        }
    
    def _extract_entities(self, content):
        """Extract named entities from content"""
        # Simplified entity extraction for demo
        return [
            {'text': 'sample entity', 'type': 'PERSON', 'confidence': 0.9}
        ]
    
    def _analyze_sentiment(self, content):
        """Analyze sentiment of content"""
        # Simplified sentiment analysis for demo
        return {
            'sentiment': 'neutral',
            'confidence': 0.75,
            'scores': {'positive': 0.3, 'negative': 0.2, 'neutral': 0.5}
        }
    
    def _detect_objects(self, image_data):
        """Detect objects in image"""
        # Simplified object detection for demo
        return [
            {'object': 'person', 'confidence': 0.95, 'bounding_box': [100, 100, 200, 200]}
        ]
    
    def _extract_text_from_image(self, image_data):
        """Extract text from image using OCR"""
        # Simplified OCR for demo
        return "Sample extracted text from image"
    
    def _detect_inappropriate_content(self, image_data):
        """Detect inappropriate content in image"""
        # Simplified inappropriate content detection for demo
        return False
    
    def _extract_media_metadata(self, file):
        """Extract metadata from media files"""
        return {
            'duration': 120,
            'format': 'mp4',
            'resolution': '1920x1080'
        }
    
    def _analyze_media_content_basic(self, file):
        """Basic media content analysis"""
        return {
            'has_audio': True,
            'has_video': True,
            'content_rating': 'general'
        }
    
    def _scan_for_malware(self, file):
        """Scan file for malware indicators"""
        # Simplified malware scanning for demo
        return []
    
    def _detect_suspicious_patterns(self, file, content_analysis):
        """Detect suspicious patterns in file"""
        # Simplified suspicious pattern detection for demo
        return []
    
    def _classify_data_sensitivity(self, content_analysis):
        """Classify data sensitivity level"""
        # Simplified data classification for demo
        return 'public'
    
    def _check_compliance(self, content_analysis):
        """Check for compliance issues"""
        # Simplified compliance checking for demo
        return []
    
    def _calculate_threat_level(self, security_results):
        """Calculate overall threat level"""
        # Simplified threat level calculation for demo
        return 'low'
    
    def _calculate_confidence_score(self, content_analysis, security_analysis):
        """Calculate overall confidence score for analysis"""
        # Simplified confidence calculation for demo
        return 0.85
    
    def _generate_recommendations(self, content_analysis, security_analysis):
        """Generate recommendations based on analysis"""
        # Simplified recommendations for demo
        return [
            "File appears safe for storage",
            "Consider adding encryption for sensitive data"
        ]
    
    def _get_file_from_storage(self, file_id, user_id):
        """Get file from storage for re-analysis"""
        # This would retrieve file from Google Cloud Storage
        pass
    
    def _update_file_analysis(self, file_id, user_id, analysis):
        """Update file analysis in database"""
        logger.info(f"Updating analysis for file: {file_id}")
    
    def _get_user_file_statistics(self, user_id):
        """Get statistics about user's files"""
        # Simplified statistics for demo
        return {
            'total_files': 10,
            'total_size': '50MB',
            'file_types': {'pdf': 5, 'jpg': 3, 'txt': 2}
        }
    
    def _get_security_summary(self, user_id):
        """Get security summary for user's files"""
        # Simplified security summary for demo
        return {
            'safe_files': 8,
            'flagged_files': 2,
            'risk_level': 'low'
        }
    
    def _analyze_content_trends(self, user_id):
        """Analyze content trends for user's files"""
        # Simplified content trends for demo
        return {
            'most_common_type': 'pdf',
            'upload_frequency': 'daily',
            'content_themes': ['work', 'personal']
        }
    
    def _generate_user_recommendations(self, user_id):
        """Generate recommendations for user"""
        # Simplified recommendations for demo
        return [
            "Consider organizing files into folders",
            "Enable automatic backup for important files"
        ]
    
    def _assess_user_risk(self, user_id):
        """Assess overall risk for user's account"""
        # Simplified risk assessment for demo
        return {
            'risk_level': 'low',
            'risk_factors': [],
            'mitigation_suggestions': []
        }
