"""
Mock Authentication Service for local development without Firebase.
Implements the same interface used by the real AuthService so routes don't change.
"""

import os
import jwt
import uuid
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Mock authentication service using in-memory store and JWT."""

    def __init__(self):
        self.jwt_secret = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
        self.users_by_id = {}
        self.users_by_email = {}

    def register_user(self, user_data):
        try:
            email = user_data.get('email')
            password = user_data.get('password')
            display_name = user_data.get('display_name', '')
            role = user_data.get('role', 'user')

            if not email or not password:
                raise ValueError("Email and password are required")

            if email in self.users_by_email:
                raise ValueError("User already exists")

            user_id = f"mock-{uuid.uuid4().hex}"
            user_record = {
                'uid': user_id,
                'email': email,
                'display_name': display_name,
                'role': role,
                'password': password,
                'created_at': datetime.utcnow().isoformat(),
                'email_verified': False,
                'last_sign_in': None
            }

            self.users_by_id[user_id] = user_record
            self.users_by_email[email] = user_record

            tokens = self._generate_tokens(user_id, role)

            return {
                'message': 'User registered successfully',
                'user': {
                    'uid': user_id,
                    'email': email,
                    'display_name': display_name,
                    'role': role
                },
                'tokens': tokens
            }
        except Exception as e:
            logger.error(f"Mock registration error: {str(e)}")
            raise

    def authenticate_user(self, credentials):
        try:
            email = credentials.get('email')
            password = credentials.get('password')

            if not email or not password:
                raise ValueError("Email and password are required")

            user = self.users_by_email.get(email)
            if not user or user.get('password') != password:
                raise ValueError("Invalid credentials")

            user['last_sign_in'] = datetime.utcnow().isoformat()
            tokens = self._generate_tokens(user['uid'], user.get('role', 'user'))

            return {
                'message': 'Authentication successful',
                'user': {
                    'uid': user['uid'],
                    'email': user['email'],
                    'display_name': user.get('display_name'),
                    'role': user.get('role', 'user')
                },
                'tokens': tokens
            }
        except Exception as e:
            logger.error(f"Mock authentication error: {str(e)}")
            raise

    def _generate_tokens(self, user_id, role):
        now = datetime.utcnow()
        access_payload = {
            'user_id': user_id,
            'role': role,
            'type': 'access',
            'iat': now,
            'exp': now + timedelta(hours=24)
        }
        refresh_payload = {
            'user_id': user_id,
            'type': 'refresh',
            'iat': now,
            'exp': now + timedelta(days=30)
        }
        access_token = jwt.encode(access_payload, self.jwt_secret, algorithm='HS256')
        refresh_token = jwt.encode(refresh_payload, self.jwt_secret, algorithm='HS256')
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'expires_in': 86400
        }

    def verify_token(self, token):
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            if payload.get('type') != 'access':
                raise ValueError("Invalid token type")
            return {
                'user_id': payload.get('user_id'),
                'role': payload.get('role', 'user'),
                'valid': True
            }
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
        except Exception as e:
            logger.error(f"Mock token verification error: {str(e)}")
            raise

    def refresh_user_token(self):
        try:
            refresh_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not refresh_token:
                raise ValueError("Refresh token required")
            payload = jwt.decode(refresh_token, self.jwt_secret, algorithms=['HS256'])
            if payload.get('type') != 'refresh':
                raise ValueError("Invalid refresh token type")
            user_id = payload.get('user_id')
            user = self.users_by_id.get(user_id)
            role = (user or {}).get('role', 'user')
            tokens = self._generate_tokens(user_id, role)
            return {
                'message': 'Token refreshed successfully',
                'tokens': tokens
            }
        except Exception as e:
            logger.error(f"Mock token refresh error: {str(e)}")
            raise

    def get_user_profile(self, user_id):
        user = self.users_by_id.get(user_id)
        if not user:
            raise ValueError("User not found")
        return {
            'uid': user['uid'],
            'email': user['email'],
            'display_name': user.get('display_name'),
            'role': user.get('role', 'user'),
            'created_at': user.get('created_at'),
            'last_sign_in': user.get('last_sign_in'),
            'email_verified': user.get('email_verified', False)
        }

    def update_user_profile(self, user_id, profile_data):
        user = self.users_by_id.get(user_id)
        if not user:
            raise ValueError("User not found")
        if 'display_name' in profile_data:
            user['display_name'] = profile_data['display_name']
        if 'email' in profile_data:
            # naive update for mock
            old_email = user['email']
            new_email = profile_data['email']
            if new_email != old_email and new_email in self.users_by_email:
                raise ValueError("Email already in use")
            user['email'] = new_email
            del self.users_by_email[old_email]
            self.users_by_email[new_email] = user
        if 'role' in profile_data:
            user['role'] = profile_data['role']
        return {
            'message': 'Profile updated successfully',
            'user': self.get_user_profile(user_id)
        }

    def require_auth(self, f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                auth_header = request.headers.get('Authorization')
                if not auth_header:
                    return jsonify({'error': 'Authorization header required'}), 401
                token = auth_header.replace('Bearer ', '')
                token_data = self.verify_token(token)
                request.user_id = token_data['user_id']
                request.user_role = token_data.get('role', 'user')
                return f(*args, **kwargs)
            except ValueError as e:
                return jsonify({'error': str(e)}), 401
            except Exception as e:
                logger.error(f"Mock auth decorator error: {str(e)}")
                return jsonify({'error': 'Authentication failed'}), 401
        return decorated_function

    def require_role(self, required_role):
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                try:
                    user_role = getattr(request, 'user_role', None)
                    if user_role != required_role:
                        return jsonify({'error': 'Insufficient permissions'}), 403
                    return f(*args, **kwargs)
                except Exception as e:
                    logger.error(f"Mock role decorator error: {str(e)}")
                    return jsonify({'error': 'Authorization failed'}), 403
            return decorated_function
        return decorator


