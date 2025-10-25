"""
Security Service for Secure AI File Management System
Handles security monitoring, threat detection, and access control
"""

import os
import json
import hashlib
from datetime import datetime, timedelta
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class SecurityService:
    """Security service for threat detection and monitoring"""
    
    def __init__(self):
        """Initialize security service"""
        self.threat_database = {}
        self.access_logs = defaultdict(list)
        self.security_rules = self._load_security_rules()
        self.anomaly_detection_enabled = True
        
        # Security thresholds
        self.max_login_attempts = 5
        self.suspicious_activity_threshold = 3
        self.file_access_limit = 100  # per hour
        
    def check_file_security(self, file, ai_analysis):
        """Check file security based on AI analysis and security rules"""
        try:
            security_result = {
                'safe': True,
                'risk_score': 0.0,
                'threats_detected': [],
                'details': {},
                'recommendations': []
            }
            
            # Check AI analysis results
            if ai_analysis:
                ai_security = ai_analysis.get('security_analysis', {})
                
                # Check threat level
                threat_level = ai_security.get('threat_level', 'low')
                if threat_level in ['high', 'critical']:
                    security_result['safe'] = False
                    security_result['risk_score'] = 0.9
                    security_result['threats_detected'].append(f"High threat level detected: {threat_level}")
                
                # Check for sensitive data
                sensitive_data = ai_analysis.get('content_analysis', {}).get('sensitive_data_detected', [])
                if sensitive_data:
                    security_result['risk_score'] += 0.3
                    security_result['threats_detected'].append(f"Sensitive data detected: {len(sensitive_data)} items")
                    security_result['recommendations'].append("Consider encrypting this file")
                
                # Check malware indicators
                malware_indicators = ai_security.get('malware_indicators', [])
                if malware_indicators:
                    security_result['safe'] = False
                    security_result['risk_score'] = 1.0
                    security_result['threats_detected'].append("Malware indicators detected")
                
                # Check compliance issues
                compliance_issues = ai_security.get('compliance_issues', [])
                if compliance_issues:
                    security_result['risk_score'] += 0.2
                    security_result['threats_detected'].append(f"Compliance issues: {compliance_issues}")
            
            # Check file characteristics
            file_checks = self._perform_file_security_checks(file)
            security_result['details'].update(file_checks)
            
            if file_checks.get('suspicious'):
                security_result['risk_score'] += 0.4
                security_result['threats_detected'].append("Suspicious file characteristics detected")
            
            # Determine final security status
            if security_result['risk_score'] >= 0.7:
                security_result['safe'] = False
            
            # Generate recommendations
            if not security_result['safe']:
                security_result['recommendations'].extend([
                    "File flagged for manual review",
                    "Consider scanning with additional security tools",
                    "Restrict access to authorized personnel only"
                ])
            
            return security_result
            
        except Exception as e:
            logger.error(f"File security check error: {str(e)}")
            return {
                'safe': False,
                'risk_score': 1.0,
                'threats_detected': ['Security check failed'],
                'details': {'error': str(e)},
                'recommendations': ['Manual review required']
            }
    
    def monitor_user_activity(self, user_id, activity_type, details):
        """Monitor user activity for suspicious behavior"""
        try:
            current_time = datetime.utcnow()
            
            # Log activity
            activity_log = {
                'user_id': user_id,
                'activity_type': activity_type,
                'timestamp': current_time.isoformat(),
                'details': details,
                'ip_address': details.get('ip_address'),
                'user_agent': details.get('user_agent')
            }
            
            self.access_logs[user_id].append(activity_log)
            
            # Check for suspicious patterns
            suspicious_activities = self._detect_suspicious_patterns(user_id, activity_log)
            
            if suspicious_activities:
                self._handle_suspicious_activity(user_id, suspicious_activities)
            
            # Clean old logs (keep last 1000 entries per user)
            if len(self.access_logs[user_id]) > 1000:
                self.access_logs[user_id] = self.access_logs[user_id][-1000:]
            
            return {
                'monitored': True,
                'suspicious_activities': suspicious_activities
            }
            
        except Exception as e:
            logger.error(f"Activity monitoring error: {str(e)}")
            return {'monitored': False, 'error': str(e)}
    
    def check_access_permissions(self, user_id, resource_id, action):
        """Check if user has permission to perform action on resource"""
        try:
            # Get user role and permissions
            user_permissions = self._get_user_permissions(user_id)
            
            # Check resource-specific permissions
            resource_permissions = self._get_resource_permissions(resource_id)
            
            # Check if action is allowed
            allowed = self._check_action_permission(user_permissions, resource_permissions, action)
            
            if not allowed:
                # Log denied access attempt
                self._log_access_denial(user_id, resource_id, action)
            
            return {
                'allowed': allowed,
                'reason': 'Permission granted' if allowed else 'Access denied',
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Access permission check error: {str(e)}")
            return {'allowed': False, 'reason': 'Permission check failed', 'error': str(e)}
    
    def get_user_threats(self, user_id):
        """Get security threats and alerts for user"""
        try:
            threats = []
            
            # Check for recent suspicious activities
            recent_activities = self._get_recent_activities(user_id, hours=24)
            suspicious_count = len([a for a in recent_activities if a.get('suspicious', False)])
            
            if suspicious_count > 0:
                threats.append({
                    'type': 'suspicious_activity',
                    'severity': 'medium',
                    'description': f'{suspicious_count} suspicious activities detected in last 24 hours',
                    'timestamp': datetime.utcnow().isoformat(),
                    'recommendations': ['Review recent account activity', 'Change password if necessary']
                })
            
            # Check for failed login attempts
            failed_logins = self._get_failed_login_attempts(user_id, hours=1)
            if len(failed_logins) >= self.max_login_attempts:
                threats.append({
                    'type': 'brute_force_attempt',
                    'severity': 'high',
                    'description': f'{len(failed_logins)} failed login attempts in last hour',
                    'timestamp': datetime.utcnow().isoformat(),
                    'recommendations': ['Account temporarily locked', 'Contact administrator if this was not you']
                })
            
            # Check for unusual access patterns
            unusual_patterns = self._detect_unusual_access_patterns(user_id)
            if unusual_patterns:
                threats.extend(unusual_patterns)
            
            return threats
            
        except Exception as e:
            logger.error(f"Get user threats error: {str(e)}")
            return []
    
    def get_user_audit_log(self, user_id):
        """Get audit log for user's activities"""
        try:
            # Get user's activity logs
            user_logs = self.access_logs.get(user_id, [])
            
            # Sort by timestamp (most recent first)
            user_logs.sort(key=lambda x: x['timestamp'], reverse=True)
            
            # Format audit log
            audit_log = []
            for log_entry in user_logs:
                audit_entry = {
                    'timestamp': log_entry['timestamp'],
                    'activity_type': log_entry['activity_type'],
                    'ip_address': log_entry.get('ip_address'),
                    'user_agent': log_entry.get('user_agent'),
                    'details': log_entry.get('details', {}),
                    'suspicious': log_entry.get('suspicious', False)
                }
                audit_log.append(audit_entry)
            
            return audit_log
            
        except Exception as e:
            logger.error(f"Get audit log error: {str(e)}")
            return []
    
    def _perform_file_security_checks(self, file):
        """Perform security checks on file characteristics"""
        try:
            checks = {
                'suspicious': False,
                'file_size_ok': True,
                'extension_valid': True,
                'content_type_matches': True
            }
            
            # Check file size
            file.seek(0, 2)  # Seek to end
            file_size = file.tell()
            file.seek(0)  # Reset to beginning
            
            if file_size > 100 * 1024 * 1024:  # 100MB limit
                checks['file_size_ok'] = False
                checks['suspicious'] = True
            
            # Check file extension
            if not file.filename or '.' not in file.filename:
                checks['extension_valid'] = False
                checks['suspicious'] = True
            
            # Check content type matches extension
            content_type = file.content_type
            filename = file.filename.lower()
            
            if 'exe' in filename and 'application/octet-stream' not in content_type:
                checks['content_type_matches'] = False
                checks['suspicious'] = True
            
            return checks
            
        except Exception as e:
            logger.error(f"File security checks error: {str(e)}")
            return {'suspicious': True, 'error': str(e)}
    
    def _detect_suspicious_patterns(self, user_id, activity_log):
        """Detect suspicious patterns in user activity"""
        try:
            suspicious_activities = []
            
            # Check for rapid file access
            recent_activities = self._get_recent_activities(user_id, minutes=10)
            file_access_activities = [a for a in recent_activities if a['activity_type'] == 'file_access']
            
            if len(file_access_activities) > 20:  # More than 20 file accesses in 10 minutes
                suspicious_activities.append({
                    'type': 'rapid_file_access',
                    'severity': 'medium',
                    'description': 'Unusually high number of file access attempts',
                    'count': len(file_access_activities)
                })
            
            # Check for multiple IP addresses
            recent_ips = set(a.get('ip_address') for a in recent_activities if a.get('ip_address'))
            if len(recent_ips) > 3:  # More than 3 different IPs in recent activities
                suspicious_activities.append({
                    'type': 'multiple_ips',
                    'severity': 'high',
                    'description': 'Account accessed from multiple IP addresses',
                    'ip_count': len(recent_ips)
                })
            
            # Check for unusual time access
            current_hour = datetime.utcnow().hour
            if current_hour < 6 or current_hour > 23:  # Access outside normal hours
                suspicious_activities.append({
                    'type': 'unusual_time_access',
                    'severity': 'low',
                    'description': 'Account accessed during unusual hours',
                    'hour': current_hour
                })
            
            return suspicious_activities
            
        except Exception as e:
            logger.error(f"Suspicious pattern detection error: {str(e)}")
            return []
    
    def _handle_suspicious_activity(self, user_id, suspicious_activities):
        """Handle detected suspicious activities"""
        try:
            for activity in suspicious_activities:
                # Log suspicious activity
                logger.warning(f"Suspicious activity detected for user {user_id}: {activity}")
                
                # Store in threat database
                threat_id = hashlib.md5(f"{user_id}_{activity['type']}_{datetime.utcnow()}".encode()).hexdigest()
                self.threat_database[threat_id] = {
                    'user_id': user_id,
                    'activity': activity,
                    'timestamp': datetime.utcnow().isoformat(),
                    'status': 'active'
                }
                
                # Send alert if high severity
                if activity['severity'] == 'high':
                    self._send_security_alert(user_id, activity)
            
        except Exception as e:
            logger.error(f"Handle suspicious activity error: {str(e)}")
    
    def _get_user_permissions(self, user_id):
        """Get user permissions based on role"""
        # Simplified permission system for demo
        return {
            'role': 'user',
            'permissions': ['read', 'write', 'delete_own_files']
        }
    
    def _get_resource_permissions(self, resource_id):
        """Get resource-specific permissions"""
        # Simplified resource permissions for demo
        return {
            'owner_id': resource_id.split('_')[0] if '_' in resource_id else resource_id,
            'permissions': ['read', 'write']
        }
    
    def _check_action_permission(self, user_permissions, resource_permissions, action):
        """Check if action is allowed based on permissions"""
        # Simplified permission checking for demo
        user_role = user_permissions.get('role', 'user')
        user_actions = user_permissions.get('permissions', [])
        
        if user_role == 'admin':
            return True
        
        if action in user_actions:
            return True
        
        return False
    
    def _log_access_denial(self, user_id, resource_id, action):
        """Log access denial attempt"""
        logger.warning(f"Access denied: User {user_id} attempted {action} on resource {resource_id}")
    
    def _get_recent_activities(self, user_id, minutes=None, hours=None):
        """Get recent activities for user"""
        try:
            user_logs = self.access_logs.get(user_id, [])
            
            if minutes:
                cutoff_time = datetime.utcnow() - timedelta(minutes=minutes)
            elif hours:
                cutoff_time = datetime.utcnow() - timedelta(hours=hours)
            else:
                cutoff_time = datetime.utcnow() - timedelta(hours=24)
            
            recent_activities = []
            for log in user_logs:
                log_time = datetime.fromisoformat(log['timestamp'].replace('Z', '+00:00'))
                if log_time >= cutoff_time:
                    recent_activities.append(log)
            
            return recent_activities
            
        except Exception as e:
            logger.error(f"Get recent activities error: {str(e)}")
            return []
    
    def _get_failed_login_attempts(self, user_id, hours):
        """Get failed login attempts for user"""
        try:
            recent_activities = self._get_recent_activities(user_id, hours=hours)
            failed_logins = [a for a in recent_activities if a['activity_type'] == 'login_failed']
            return failed_logins
        except Exception as e:
            logger.error(f"Get failed login attempts error: {str(e)}")
            return []
    
    def _detect_unusual_access_patterns(self, user_id):
        """Detect unusual access patterns"""
        # Simplified unusual pattern detection for demo
        return []
    
    def _send_security_alert(self, user_id, activity):
        """Send security alert for high-severity activities"""
        logger.critical(f"SECURITY ALERT: User {user_id} - {activity}")
    
    def _load_security_rules(self):
        """Load security rules configuration"""
        # Simplified security rules for demo
        return {
            'max_file_size': 100 * 1024 * 1024,
            'allowed_extensions': ['txt', 'pdf', 'jpg', 'png'],
            'blocked_extensions': ['exe', 'bat', 'cmd'],
            'max_login_attempts': 5,
            'session_timeout': 3600  # 1 hour
        }
