import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Upload, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Download,
  Share2,
  Eye,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: '0 MB',
    securityScore: 95,
    recentActivity: 0
  });
  
  const [recentFiles, setRecentFiles] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalFiles: 1247,
        totalSize: '2.4 GB',
        securityScore: 95,
        recentActivity: 23
      });
      
      setRecentFiles([
        { id: 1, name: 'Project Proposal.pdf', type: 'document', size: '2.4 MB', date: '2024-01-15', status: 'safe' },
        { id: 2, name: 'Team Photo.jpg', type: 'image', size: '1.8 MB', date: '2024-01-14', status: 'safe' },
        { id: 3, name: 'Presentation.mp4', type: 'video', size: '45.2 MB', date: '2024-01-13', status: 'safe' },
        { id: 4, name: 'Meeting Notes.docx', type: 'document', size: '856 KB', date: '2024-01-12', status: 'safe' },
        { id: 5, name: 'Background Music.mp3', type: 'audio', size: '3.2 MB', date: '2024-01-11', status: 'safe' }
      ]);
      
      setSecurityAlerts([
        { id: 1, type: 'info', message: 'All files are secure and up to date', timestamp: '2024-01-15 10:30' },
        { id: 2, type: 'success', message: 'AI analysis completed for 5 new files', timestamp: '2024-01-15 09:15' },
        { id: 3, type: 'warning', message: 'Large file detected: Presentation.mp4', timestamp: '2024-01-13 14:22' }
      ]);
      
      setLoading(false);
    };
    
    loadDashboardData();
  }, []);

  const getFileIcon = (type) => {
    switch (type) {
      case 'document': return <FileText size={20} />;
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      case 'audio': return <Music size={20} />;
      default: return <Archive size={20} />;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <Shield size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Shield size={16} className="text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Loading your secure file management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome back, {user?.display_name || 'User'}! 👋
          </h1>
          <p className="welcome-subtitle">
            Your files are secure and protected with AI-powered security
          </p>
        </div>
        
        <button className="upload-button">
          <Upload size={20} />
          Upload Files
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FolderOpen size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalFiles.toLocaleString()}</h3>
            <p className="stat-label">Total Files</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Archive size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalSize}</h3>
            <p className="stat-label">Total Size</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.securityScore}%</h3>
            <p className="stat-label">Security Score</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.recentActivity}</h3>
            <p className="stat-label">Recent Activity</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Files */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Files</h2>
            <button className="card-action">
              View All
            </button>
          </div>
          
          <div className="files-list">
            {recentFiles.map((file, index) => (
              <div key={file.id} className="file-item">
                <div className="file-icon">
                  {getFileIcon(file.type)}
                </div>
                <div className="file-info">
                  <h4 className="file-name">{file.name}</h4>
                  <p className="file-meta">{file.size} • {file.date}</p>
                </div>
                <div className="file-actions">
                  <button className="action-button">
                    <Eye size={16} />
                  </button>
                  <button className="action-button">
                    <Download size={16} />
                  </button>
                  <button className="action-button">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Center */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Security Center</h2>
            <div className="security-score">
              <Shield size={20} className="text-green-500" />
              <span>{stats.securityScore}% Secure</span>
            </div>
          </div>
          
          <div className="security-alerts">
            {securityAlerts.map((alert, index) => (
              <div key={alert.id} className="security-alert">
                <div className="alert-icon">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="alert-content">
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-time">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="quick-action-button">
            <Upload size={24} />
            <span>Upload Files</span>
          </button>
          
          <button className="quick-action-button">
            <FolderOpen size={24} />
            <span>Browse Files</span>
          </button>
          
          <button className="quick-action-button">
            <Shield size={24} />
            <span>Security Scan</span>
          </button>
          
          <button className="quick-action-button">
            <Share2 size={24} />
            <span>Share Files</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-loading {
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

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3rem;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .upload-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .stats-grid {
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
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6b7280;
          margin: 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .card-action {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
        }

        .security-score {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #059669;
          font-weight: 600;
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          background: #f8fafc;
          transition: all 0.3s ease;
        }

        .file-item:hover {
          background: #e2e8f0;
          transform: translateX(5px);
        }

        .file-icon {
          width: 40px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
        }

        .file-info {
          flex: 1;
        }

        .file-name {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .file-meta {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .file-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #e2e8f0;
          color: #667eea;
        }

        .security-alerts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .security-alert {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          background: #f8fafc;
        }

        .alert-content {
          flex: 1;
        }

        .alert-message {
          font-weight: 500;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .alert-time {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .quick-actions {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .quick-action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem 1rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-action-button:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
          transform: translateY(-5px);
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .actions-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
