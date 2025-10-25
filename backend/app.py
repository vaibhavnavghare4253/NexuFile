"""
Secure AI-Based File Management System - Main Application
Flask backend with Google Cloud integration and AI-powered security features
"""

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from datetime import timedelta

# Import custom modules
USE_MOCK = os.environ.get('USE_MOCK_SERVICES', 'false').lower() in ('1', 'true', 'yes')
if USE_MOCK:
    from services.mock_auth_service import AuthService
    from services.mock_file_service import FileService
    from services.mock_ai_service import AIService
else:
    from services.auth_service import AuthService
    from services.file_service import FileService
    from services.ai_service import AIService
from services.security_service import SecurityService
from utils.database import init_db
from utils.config import Config

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app, origins=["http://localhost:3000", "https://yourdomain.com"])

# Initialize JWT Manager
jwt = JWTManager(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize services
auth_service = AuthService()
file_service = FileService()
ai_service = AIService()
security_service = SecurityService()

# Initialize database
with app.app_context():
    init_db()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request', 'message': str(error)}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({'error': 'Forbidden', 'message': 'Access denied'}), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'message': 'Something went wrong'}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'Secure AI File Management System',
        'version': '1.0.0'
    })

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        result = auth_service.register_user(data)
        return jsonify(result), 201
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed', 'message': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        result = auth_service.authenticate_user(data)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed', 'message': str(e)}), 401

@app.route('/api/auth/refresh', methods=['POST'])
@auth_service.require_auth
def refresh_token():
    """Token refresh endpoint"""
    try:
        result = auth_service.refresh_user_token()
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return jsonify({'error': 'Token refresh failed', 'message': str(e)}), 401

# File management endpoints
@app.route('/api/files/upload', methods=['POST'])
@auth_service.require_auth
def upload_file():
    """File upload endpoint with AI analysis"""
    try:
        user_id = request.user_id
        file = request.files.get('file')
        
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # AI content analysis
        ai_analysis = ai_service.analyze_file_content(file)
        
        # Security check
        security_result = security_service.check_file_security(file, ai_analysis)
        
        if not security_result['safe']:
            return jsonify({
                'error': 'File flagged by security analysis',
                'details': security_result['details'],
                'recommendations': security_result['recommendations']
            }), 403
        
        # Upload file to cloud storage
        upload_result = file_service.upload_file(file, user_id, ai_analysis)
        
        return jsonify(upload_result), 201
        
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        return jsonify({'error': 'File upload failed', 'message': str(e)}), 500

@app.route('/api/files', methods=['GET'])
@auth_service.require_auth
def list_files():
    """List user files endpoint"""
    try:
        user_id = request.user_id
        files = file_service.get_user_files(user_id)
        return jsonify({'files': files}), 200
    except Exception as e:
        logger.error(f"File listing error: {str(e)}")
        return jsonify({'error': 'Failed to list files', 'message': str(e)}), 500

@app.route('/api/files/<file_id>', methods=['GET'])
@auth_service.require_auth
def get_file(file_id):
    """Get file details endpoint"""
    try:
        user_id = request.user_id
        file_details = file_service.get_file_details(file_id, user_id)
        return jsonify(file_details), 200
    except Exception as e:
        logger.error(f"File retrieval error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve file', 'message': str(e)}), 500

@app.route('/api/files/<file_id>/download', methods=['GET'])
@auth_service.require_auth
def download_file(file_id):
    """File download endpoint"""
    try:
        user_id = request.user_id
        download_url = file_service.generate_download_url(file_id, user_id)
        return jsonify({'download_url': download_url}), 200
    except Exception as e:
        logger.error(f"File download error: {str(e)}")
        return jsonify({'error': 'Failed to generate download URL', 'message': str(e)}), 500

@app.route('/api/files/<file_id>', methods=['DELETE'])
@auth_service.require_auth
def delete_file(file_id):
    """File deletion endpoint"""
    try:
        user_id = request.user_id
        result = file_service.delete_file(file_id, user_id)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"File deletion error: {str(e)}")
        return jsonify({'error': 'Failed to delete file', 'message': str(e)}), 500

# AI analysis endpoints
@app.route('/api/ai/analyze/<file_id>', methods=['POST'])
@auth_service.require_auth
def analyze_file(file_id):
    """Re-analyze file with AI"""
    try:
        user_id = request.user_id
        analysis_result = ai_service.reanalyze_file(file_id, user_id)
        return jsonify(analysis_result), 200
    except Exception as e:
        logger.error(f"AI analysis error: {str(e)}")
        return jsonify({'error': 'AI analysis failed', 'message': str(e)}), 500

@app.route('/api/ai/insights', methods=['GET'])
@auth_service.require_auth
def get_ai_insights():
    """Get AI insights for user files"""
    try:
        user_id = request.user_id
        insights = ai_service.get_user_insights(user_id)
        return jsonify({'insights': insights}), 200
    except Exception as e:
        logger.error(f"AI insights error: {str(e)}")
        return jsonify({'error': 'Failed to get AI insights', 'message': str(e)}), 500

# Security endpoints
@app.route('/api/security/threats', methods=['GET'])
@auth_service.require_auth
def get_threats():
    """Get security threats and alerts"""
    try:
        user_id = request.user_id
        threats = security_service.get_user_threats(user_id)
        return jsonify({'threats': threats}), 200
    except Exception as e:
        logger.error(f"Security threats error: {str(e)}")
        return jsonify({'error': 'Failed to get security threats', 'message': str(e)}), 500

@app.route('/api/security/audit', methods=['GET'])
@auth_service.require_auth
def get_audit_log():
    """Get audit log for user"""
    try:
        user_id = request.user_id
        audit_log = security_service.get_user_audit_log(user_id)
        return jsonify({'audit_log': audit_log}), 200
    except Exception as e:
        logger.error(f"Audit log error: {str(e)}")
        return jsonify({'error': 'Failed to get audit log', 'message': str(e)}), 500

# User management endpoints
@app.route('/api/user/profile', methods=['GET'])
@auth_service.require_auth
def get_user_profile():
    """Get user profile"""
    try:
        user_id = request.user_id
        profile = auth_service.get_user_profile(user_id)
        return jsonify(profile), 200
    except Exception as e:
        logger.error(f"User profile error: {str(e)}")
        return jsonify({'error': 'Failed to get user profile', 'message': str(e)}), 500

@app.route('/api/user/profile', methods=['PUT'])
@auth_service.require_auth
def update_user_profile():
    """Update user profile"""
    try:
        user_id = request.user_id
        data = request.get_json()
        result = auth_service.update_user_profile(user_id, data)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Failed to update profile', 'message': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask application
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=os.environ.get('FLASK_ENV') == 'development'
    )
