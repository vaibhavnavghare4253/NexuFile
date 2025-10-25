"""
Database utilities for Secure AI File Management System
Handles database initialization and configuration
"""

import os
from flask_sqlalchemy import SQLAlchemy
from flask import current_app
import logging

logger = logging.getLogger(__name__)

# Initialize SQLAlchemy
db = SQLAlchemy()

def init_db():
    """Initialize database with Flask app"""
    try:
        db.init_app(current_app)
        
        # Create all tables
        with current_app.app_context():
            db.create_all()
        
        logger.info("Database initialized successfully")
        
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise

def get_db_connection():
    """Get database connection"""
    try:
        return db.session
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise

def close_db_connection():
    """Close database connection"""
    try:
        db.session.close()
    except Exception as e:
        logger.error(f"Database close error: {str(e)}")

# Database Models
class User(db.Model):
    """User model for authentication and profile management"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    display_name = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), default='user')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    files = db.relationship('File', backref='owner', lazy=True)
    access_logs = db.relationship('AccessLog', backref='user', lazy=True)

class File(db.Model):
    """File model for file metadata and storage information"""
    __tablename__ = 'files'
    
    id = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id'), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    blob_name = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.BigInteger, nullable=False)
    content_type = db.Column(db.String(100), nullable=False)
    file_hash = db.Column(db.String(64), nullable=False)
    upload_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    last_accessed = db.Column(db.DateTime)
    access_count = db.Column(db.Integer, default=0)
    security_status = db.Column(db.String(50), default='pending')
    ai_analysis = db.Column(db.Text)  # JSON string
    
    # Relationships
    shares = db.relationship('FileShare', backref='file', lazy=True)

class FileShare(db.Model):
    """File sharing model for managing file access permissions"""
    __tablename__ = 'file_shares'
    
    id = db.Column(db.String(255), primary_key=True)
    file_id = db.Column(db.String(255), db.ForeignKey('files.id'), nullable=False)
    owner_id = db.Column(db.String(255), db.ForeignKey('users.id'), nullable=False)
    shared_with_user_id = db.Column(db.String(255), db.ForeignKey('users.id'), nullable=False)
    permissions = db.Column(db.String(100), nullable=False)  # JSON string
    shared_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    expires_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

class AccessLog(db.Model):
    """Access log model for security monitoring and audit trails"""
    __tablename__ = 'access_logs'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id'), nullable=False)
    activity_type = db.Column(db.String(100), nullable=False)
    resource_id = db.Column(db.String(255), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    details = db.Column(db.Text)  # JSON string
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    suspicious = db.Column(db.Boolean, default=False)

class SecurityThreat(db.Model):
    """Security threat model for storing detected threats and alerts"""
    __tablename__ = 'security_threats'
    
    id = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id'), nullable=False)
    threat_type = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    details = db.Column(db.Text)  # JSON string
    detected_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(50), default='active')  # active, resolved, false_positive
    resolved_at = db.Column(db.DateTime)

class AIAnalysis(db.Model):
    """AI analysis model for storing file analysis results"""
    __tablename__ = 'ai_analyses'
    
    id = db.Column(db.String(255), primary_key=True)
    file_id = db.Column(db.String(255), db.ForeignKey('files.id'), nullable=False)
    analysis_type = db.Column(db.String(100), nullable=False)  # content, security, threat
    model_version = db.Column(db.String(50), nullable=False)
    results = db.Column(db.Text, nullable=False)  # JSON string
    confidence_score = db.Column(db.Float, nullable=False)
    analysis_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    processing_time = db.Column(db.Float)  # seconds

class SystemConfig(db.Model):
    """System configuration model for storing application settings"""
    __tablename__ = 'system_configs'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    config_key = db.Column(db.String(100), unique=True, nullable=False)
    config_value = db.Column(db.Text, nullable=False)
    config_type = db.Column(db.String(50), default='string')  # string, int, float, boolean, json
    description = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

# Database utility functions
def create_user(user_data):
    """Create a new user in the database"""
    try:
        user = User(
            id=user_data['id'],
            email=user_data['email'],
            display_name=user_data.get('display_name'),
            role=user_data.get('role', 'user')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return user
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create user error: {str(e)}")
        raise

def get_user_by_id(user_id):
    """Get user by ID"""
    try:
        return User.query.filter_by(id=user_id).first()
    except Exception as e:
        logger.error(f"Get user by ID error: {str(e)}")
        raise

def get_user_by_email(email):
    """Get user by email"""
    try:
        return User.query.filter_by(email=email).first()
    except Exception as e:
        logger.error(f"Get user by email error: {str(e)}")
        raise

def create_file_record(file_data):
    """Create a new file record in the database"""
    try:
        file_record = File(
            id=file_data['id'],
            user_id=file_data['user_id'],
            original_filename=file_data['original_filename'],
            blob_name=file_data['blob_name'],
            file_size=file_data['file_size'],
            content_type=file_data['content_type'],
            file_hash=file_data['file_hash'],
            security_status=file_data.get('security_status', 'pending'),
            ai_analysis=file_data.get('ai_analysis', '{}')
        )
        
        db.session.add(file_record)
        db.session.commit()
        
        return file_record
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create file record error: {str(e)}")
        raise

def get_file_by_id(file_id):
    """Get file by ID"""
    try:
        return File.query.filter_by(id=file_id).first()
    except Exception as e:
        logger.error(f"Get file by ID error: {str(e)}")
        raise

def get_user_files(user_id):
    """Get all files for a user"""
    try:
        return File.query.filter_by(user_id=user_id).all()
    except Exception as e:
        logger.error(f"Get user files error: {str(e)}")
        raise

def create_access_log(log_data):
    """Create access log entry"""
    try:
        access_log = AccessLog(
            user_id=log_data['user_id'],
            activity_type=log_data['activity_type'],
            resource_id=log_data.get('resource_id'),
            ip_address=log_data.get('ip_address'),
            user_agent=log_data.get('user_agent'),
            details=log_data.get('details', '{}'),
            suspicious=log_data.get('suspicious', False)
        )
        
        db.session.add(access_log)
        db.session.commit()
        
        return access_log
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create access log error: {str(e)}")
        raise

def create_security_threat(threat_data):
    """Create security threat record"""
    try:
        threat = SecurityThreat(
            id=threat_data['id'],
            user_id=threat_data['user_id'],
            threat_type=threat_data['threat_type'],
            severity=threat_data['severity'],
            description=threat_data['description'],
            details=threat_data.get('details', '{}'),
            status=threat_data.get('status', 'active')
        )
        
        db.session.add(threat)
        db.session.commit()
        
        return threat
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create security threat error: {str(e)}")
        raise

def create_ai_analysis(analysis_data):
    """Create AI analysis record"""
    try:
        analysis = AIAnalysis(
            id=analysis_data['id'],
            file_id=analysis_data['file_id'],
            analysis_type=analysis_data['analysis_type'],
            model_version=analysis_data['model_version'],
            results=analysis_data['results'],
            confidence_score=analysis_data['confidence_score'],
            processing_time=analysis_data.get('processing_time')
        )
        
        db.session.add(analysis)
        db.session.commit()
        
        return analysis
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Create AI analysis error: {str(e)}")
        raise
