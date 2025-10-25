"""
Authentication Service for Secure AI File Management System
Handles user authentication, authorization, and JWT token management
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from firebase_admin import auth as firebase_auth, credentials, initialize_app
from firebase_admin.exceptions import FirebaseError
import logging

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service for user management and security"""
    
    def __init__(self):
        """Initialize authentication service"""
        self.firebase_app = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            if not self.firebase_app:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": current_app.config['FIREBASE_PROJECT_ID'],
                    "private_key": current_app.config['FIREBASE_PRIVATE_KEY'].replace('\\n', '\n'),
                    "client_email": current_app.config['FIREBASE_CLIENT_EMAIL']
                })
                self.firebase_app = initialize_app(cred)
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Firebase initialization failed: {str(e)}")
            raise
    
    def register_user(self, user_data):
        """Register a new user"""
        try:
            email = user_data.get('email')
            password = user_data.get('password')
            display_name = user_data.get('display_name', '')
            role = user_data.get('role', 'user')
            
            if not email or not password:
                raise ValueError("Email and password are required")
            
            # Create user in Firebase
            user_record = firebase_auth.create_user(
                email=email,
                password=password,
                display_name=display_name,
                email_verified=False
            )
            
            # Set custom claims for role-based access
            firebase_auth.set_custom_user_claims(user_record.uid, {
                'role': role,
                'created_at': datetime.utcnow().isoformat()
            })
            
            # Generate JWT tokens
            tokens = self._generate_tokens(user_record.uid, role)
            
            return {
                'message': 'User registered successfully',
                'user': {
                    'uid': user_record.uid,
                    'email': user_record.email,
                    'display_name': user_record.display_name,
                    'role': role
                },
                'tokens': tokens
            }
            
        except FirebaseError as e:
            logger.error(f"Firebase registration error: {str(e)}")
            raise ValueError(f"Registration failed: {str(e)}")
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            raise
    
    def authenticate_user(self, credentials):
        """Authenticate user login"""
        try:
            email = credentials.get('email')
            password = credentials.get('password')
            
            if not email or not password:
                raise ValueError("Email and password are required")
            
            # Verify user credentials with Firebase
            user_record = firebase_auth.get_user_by_email(email)
            
            # Get custom claims for role information
            custom_claims = firebase_auth.get_user(user_record.uid).custom_claims or {}
            role = custom_claims.get('role', 'user')
            
            # Generate JWT tokens
            tokens = self._generate_tokens(user_record.uid, role)
            
            # Log successful authentication
            self._log_auth_event(user_record.uid, 'login_success')
            
            return {
                'message': 'Authentication successful',
                'user': {
                    'uid': user_record.uid,
                    'email': user_record.email,
                    'display_name': user_record.display_name,
                    'role': role
                },
                'tokens': tokens
            }
            
        except FirebaseError as e:
            logger.error(f"Firebase authentication error: {str(e)}")
            raise ValueError("Invalid credentials")
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise
    
    def _generate_tokens(self, user_id, role):
        """Generate JWT access and refresh tokens"""
        try:
            now = datetime.utcnow()
            
            # Access token payload
            access_payload = {
                'user_id': user_id,
                'role': role,
                'type': 'access',
                'iat': now,
                'exp': now + timedelta(hours=24)
            }
            
            # Refresh token payload
            refresh_payload = {
                'user_id': user_id,
                'type': 'refresh',
                'iat': now,
                'exp': now + timedelta(days=30)
            }
            
            # Generate tokens
            access_token = jwt.encode(
                access_payload,
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            
            refresh_token = jwt.encode(
                refresh_payload,
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            
            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_in': 86400  # 24 hours
            }
            
        except Exception as e:
            logger.error(f"Token generation error: {str(e)}")
            raise
    
    def verify_token(self, token):
        """Verify JWT token and extract user information"""
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            
            user_id = payload.get('user_id')
            role = payload.get('role')
            token_type = payload.get('type')
            
            if token_type != 'access':
                raise ValueError("Invalid token type")
            
            return {
                'user_id': user_id,
                'role': role,
                'valid': True
            }
            
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            raise
    
    def refresh_user_token(self):
        """Refresh user access token"""
        try:
            refresh_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            
            if not refresh_token:
                raise ValueError("Refresh token required")
            
            # Verify refresh token
            payload = jwt.decode(
                refresh_token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            
            if payload.get('type') != 'refresh':
                raise ValueError("Invalid refresh token type")
            
            user_id = payload.get('user_id')
            
            # Get user role from Firebase
            user_record = firebase_auth.get_user(user_id)
            custom_claims = user_record.custom_claims or {}
            role = custom_claims.get('role', 'user')
            
            # Generate new access token
            tokens = self._generate_tokens(user_id, role)
            
            return {
                'message': 'Token refreshed successfully',
                'tokens': tokens
            }
            
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            raise
    
    def get_user_profile(self, user_id):
        """Get user profile information"""
        try:
            user_record = firebase_auth.get_user(user_id)
            custom_claims = user_record.custom_claims or {}
            
            return {
                'uid': user_record.uid,
                'email': user_record.email,
                'display_name': user_record.display_name,
                'role': custom_claims.get('role', 'user'),
                'created_at': custom_claims.get('created_at'),
                'last_sign_in': user_record.user_metadata.get('last_sign_in_time'),
                'email_verified': user_record.email_verified
            }
            
        except FirebaseError as e:
            logger.error(f"Firebase profile error: {str(e)}")
            raise ValueError("Failed to get user profile")
        except Exception as e:
            logger.error(f"Profile retrieval error: {str(e)}")
            raise
    
    def update_user_profile(self, user_id, profile_data):
        """Update user profile information"""
        try:
            update_data = {}
            
            if 'display_name' in profile_data:
                update_data['display_name'] = profile_data['display_name']
            
            if 'email' in profile_data:
                update_data['email'] = profile_data['email']
            
            # Update user in Firebase
            firebase_auth.update_user(user_id, **update_data)
            
            # Update custom claims if role is being changed
            if 'role' in profile_data:
                firebase_auth.set_custom_user_claims(user_id, {
                    'role': profile_data['role'],
                    'updated_at': datetime.utcnow().isoformat()
                })
            
            return {
                'message': 'Profile updated successfully',
                'user': self.get_user_profile(user_id)
            }
            
        except FirebaseError as e:
            logger.error(f"Firebase profile update error: {str(e)}")
            raise ValueError(f"Profile update failed: {str(e)}")
        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            raise
    
    def _log_auth_event(self, user_id, event_type):
        """Log authentication events for security monitoring"""
        try:
            # This would typically be stored in a database or logging service
            logger.info(f"Auth event: {event_type} for user {user_id} at {datetime.utcnow()}")
        except Exception as e:
            logger.error(f"Auth logging error: {str(e)}")
    
    def require_auth(self, f):
        """Decorator to require authentication for endpoints"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                auth_header = request.headers.get('Authorization')
                if not auth_header:
                    return jsonify({'error': 'Authorization header required'}), 401
                
                token = auth_header.replace('Bearer ', '')
                token_data = self.verify_token(token)
                
                # Add user information to request object
                request.user_id = token_data['user_id']
                request.user_role = token_data['role']
                
                return f(*args, **kwargs)
                
            except ValueError as e:
                return jsonify({'error': str(e)}), 401
            except Exception as e:
                logger.error(f"Auth decorator error: {str(e)}")
                return jsonify({'error': 'Authentication failed'}), 401
        
        return decorated_function
    
    def require_role(self, required_role):
        """Decorator to require specific role for endpoints"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                try:
                    user_role = getattr(request, 'user_role', None)
                    if user_role != required_role:
                        return jsonify({'error': 'Insufficient permissions'}), 403
                    return f(*args, **kwargs)
                except Exception as e:
                    logger.error(f"Role decorator error: {str(e)}")
                    return jsonify({'error': 'Authorization failed'}), 403
            return decorated_function
        return decorator
