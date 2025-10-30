import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Key, 
  Activity,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Settings,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

const SecurityCenter = () => {
  const [securityStats, setSecurityStats] = useState({
    overallScore: 95,
    threatsBlocked: 1247,
    filesScanned: 5420,
    lastScan: '2024-01-15 10:30:00'
  });

  const [threats, setThreats] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSecurityData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setThreats([
        {
          id: 1,
          type: 'malware',
          severity: 'high',
          description: 'Potential malware detected in uploaded file',
          file: 'suspicious_file.exe',
          timestamp: '2024-01-15 10:30:00',
          status: 'blocked',
          action: 'File quarantined and access denied'
        },
        {
          id: 2,
          type: 'sensitive_data',
          severity: 'medium',
          description: 'Personal information detected in document',
          file: 'customer_data.pdf',
          timestamp: '2024-01-14 15:22:00',
          status: 'flagged',
          action: 'File flagged for review'
        },
        {
          id: 3,
          type: 'unusual_access',
          severity: 'low',
          description: 'Unusual access pattern detected',
          file: 'multiple_files',
          timestamp: '2024-01-13 09:15:00',
          status: 'monitoring',
          action: 'Enhanced monitoring enabled'
        }
      ]);

      setAuditLogs([
        {
          id: 1,
          user: 'john.doe@example.com',
          action: 'File Upload',
          resource: 'project_proposal.pdf',
          timestamp: '2024-01-15 10:30:00',
          ip: '192.168.1.100',
          status: 'success'
        },
        {
          id: 2,
          user: 'jane.smith@example.com',
          action: 'File Download',
          resource: 'presentation.pptx',
          timestamp: '2024-01-15 09:45:00',
          ip: '192.168.1.101',
          status: 'success'
        },
        {
          id: 3,
          user: 'admin@example.com',
          action: 'Security Scan',
          resource: 'all_files',
          timestamp: '2024-01-15 09:00:00',
          ip: '192.168.1.1',
          status: 'success'
        },
        {
          id: 4,
          user: 'unknown@example.com',
          action: 'Login Attempt',
          resource: 'user_account',
          timestamp: '2024-01-14 23:15:00',
          ip: '203.0.113.1',
          status: 'failed'
        }
      ]);

      setLoading(false);
    };

    loadSecurityData();
  }, []);

  const getThreatIcon = (type) => {
    switch (type) {
      case 'malware': return <XCircle size={20} className="text-red-500" />;
      case 'sensitive_data': return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'unusual_access': return <Eye size={20} className="text-blue-500" />;
      default: return <Shield size={20} className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      case 'blocked': return <Lock size={16} className="text-red-500" />;
      case 'flagged': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'monitoring': return <Eye size={16} className="text-blue-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="security-center-loading">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-spinner" />
          <p>Loading security dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="security-center">
      {/* Header */}
      <motion.div
        className="security-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-icon">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="page-title">Security Center</h1>
            <p className="page-subtitle">Monitor and manage your file security</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="action-button">
            <RefreshCw size={20} />
            Refresh
          </button>
          <button className="action-button primary">
            <Download size={20} />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Security Stats */}
      <motion.div
        className="security-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{securityStats.overallScore}%</h3>
            <p className="stat-label">Security Score</p>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${securityStats.overallScore}%` }}
              />
            </div>
          </div>
        </div>

        <div negatives="stat-card">
          <div className="stat-icon">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{securityStats.threatsBlocked.toLocaleString()}</h3>
            <p className="stat-label">Threats Blocked</p>
            <div className="stat-trend">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-500">+12% this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{securityStats.filesScanned.toLocaleString()}</h3>
            <p className="stat-label">Files Scanned</p>
            <div className="stat-trend">
              <Activity size={16} className="text-blue-500" />
              <span className="text-blue-500">Active monitoring</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">Last Scan</h3>
            <p className="stat-label">{securityStats.lastScan}</p>
            <div className="stat-trend">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-green-500">System healthy</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="security-content">
        {/* Threats Section */}
        <motion.div
          className="threats-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2 className="section-title">Recent Threats</h2>
            <div className="section-actions">
              <button className="filter-button">
                <Filter size={16} />
                Filter
              </button>
              <button className="settings-button">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>

          <div className="threats-list">
            <AnimatePresence>
              {threats.map((threat, index) => (
                <motion.div
                  key={threat.id}
                  className={`threat-item ${getSeverityColor(threat.severity)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="threat-icon">
                    {getThreatIcon(threat.type)}
                  </div>
                  
                  <div className="threat-content">
                    <div className="threat-header">
                      <h3 className="threat-title">{threat.description}</h3>
                      <span className={`severity-badge ${threat.severity}`}>
                        {threat.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="threat-details">
                      <strong>File:</strong> {threat.file}
                    </p>
                    <p className="threat-details">
                      <strong>Action:</strong> {threat.action}
                    </p>
                    <p className="threat-timestamp">
                      {threat.timestamp}
                    </p>
                  </div>

                  <div className="threat-status">
                    {getStatusIcon(threat.status)}
                    <span className="status-text">{threat.status}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Audit Log Section */}
        <motion.div
          className="audit-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Audit Log</h2>
            <div className="section-actions">
              <button className="filter-button">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="audit-table">
            <div className="table-header">
              <span>User</span>
              <span>Action</span>
              <span>Resource</span>
              <span>Timestamp</span>
              <span>IP Address</span>
              <span>Status</span>
            </div>

            <AnimatePresence>
              {auditLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  className="table-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <span className="user-cell">
                    <Users size={16} />
                    {log.user}
                  </span>
                  <span className="action-cell">{log.action}</span>
                  <span className="resource-cell">{log.resource}</span>
                  <span className="timestamp-cell">{log.timestamp}</span>
                  <span className="ip-cell">{log.ip}</span>
                  <span className="status-cell">
                    {getStatusIcon(log.status)}
                    {log.status}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .security-center {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .security-center-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .security-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.75rem;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #e5e7eb;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .security-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .stat-progress {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          transition: width 0.3s ease;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .security-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .threats-section,
        .audit-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .section-actions {
          display: flex;
          gap: 0.5rem;
        }

        .filter-button,
        .settings-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          color: #374151;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .threats-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .threat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 2px solid;
        }

        .threat-content {
          flex: 1;
        }

        .threat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .threat-title {
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .severity-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .severity-badge.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .severity-badge.medium {
          background: #fef3c7;
          color: #d97706;
        }

        .severity-badge.low {
          background: #dbeafe;
          color: #2563eb;
        }

        .threat-details {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0.25rem 0;
        }

        .threat-timestamp {
          color: #9ca3af;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }

        .threat-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .audit-table {
          display: flex;
          flex-direction: column;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f3f4f6;
          align-items: center;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 1024px) {
          .security-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .security-center {
            padding: 1rem;
          }

          .security-header {
            flex-direction: column;
            gap: 1rem;
          }

          .security-stats {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .table-header span,
          .table-row span {
            padding: 0.5rem;
            background: #f8fafc;
            border-radius: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SecurityCenter;
