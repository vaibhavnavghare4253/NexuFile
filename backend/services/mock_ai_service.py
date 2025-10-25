"""
Mock AI Service for local development without Google Vertex AI.
Provides deterministic, lightweight analysis results.
"""

from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class AIService:
    """Mock AI service returning basic analysis structures."""

    def __init__(self):
        self.confidence_threshold = 0.8
        self.sensitive_data_threshold = 0.7

    def analyze_file_content(self, file):
        try:
            content_type = (getattr(file, 'content_type', '') or '').lower()
            file_type = self._detect_file_type(content_type)
            analysis_results = {
                'sensitive_data_detected': [],
                'content_classification': {'category': 'general', 'confidence': 0.9},
                'entities_identified': [],
                'sentiment_analysis': {'sentiment': 'neutral', 'confidence': 0.8}
            }
            security_analysis = {
                'threat_level': 'low',
                'malware_indicators': [],
                'suspicious_patterns': [],
                'encryption_status': 'none',
                'data_classification': 'public',
                'compliance_issues': []
            }
            return {
                'file_type': file_type,
                'content_analysis': analysis_results,
                'security_analysis': security_analysis,
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'confidence_score': 0.9,
                'recommendations': [
                    'File appears safe for storage',
                    'Consider enabling encryption for sensitive files'
                ]
            }
        except Exception as e:
            logger.error(f"Mock AI analysis error: {str(e)}")
            raise

    def reanalyze_file(self, file_id, user_id):
        # For mock, just return a new timestamp
        analysis = {
            'message': 'File re-analyzed successfully',
            'file_id': file_id,
            'new_analysis': {
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'confidence_score': 0.9
            }
        }
        return analysis

    def get_user_insights(self, user_id):
        return {
            'file_statistics': {'total_files': 0, 'total_size': '0B', 'file_types': {}},
            'security_summary': {'safe_files': 0, 'flagged_files': 0, 'risk_level': 'low'},
            'content_trends': {},
            'recommendations': ['Organize files into folders'],
            'risk_assessment': {'risk_level': 'low', 'risk_factors': [], 'mitigation_suggestions': []}
        }

    def _detect_file_type(self, content_type):
        if content_type.startswith('text/'):
            return 'text'
        if content_type.startswith('image/'):
            return 'image'
        if content_type.startswith('video/'):
            return 'video'
        if content_type.startswith('audio/'):
            return 'audio'
        if content_type in ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            return 'document'
        return 'unknown'


