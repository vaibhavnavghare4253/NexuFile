import React from 'react';
import { FolderOpen, Upload } from 'lucide-react';

const FileManager = () => {
  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h1>File Manager</h1>
        <p>Manage your secure files</p>
        <button className="upload-button">
          <Upload size={20} />
          Upload Files
        </button>
      </div>
      
      <div className="file-manager-content">
        <div className="empty-state">
          <FolderOpen size={64} />
          <h2>No files yet</h2>
          <p>Upload your first file to get started</p>
        </div>
      </div>

      <style jsx>{`
        .file-manager {
          padding: 2rem;
        }

        .file-manager-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .file-manager-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .file-manager-header p {
          color: #6b7280;
          margin-bottom: 2rem;
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
          margin: 0 auto;
        }

        .file-manager-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          color: #6b7280;
        }

        .empty-state h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default FileManager;
