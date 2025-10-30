import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  return (
    <div className="loading-container">
      <div className="loading-spinner-wrapper">
        <div className={`loading-spinner ${sizeClasses[size]}`} />
        {message && (
          <p className="loading-message">{message}</p>
        )}
      </div>
      
      <style jsx>{`
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(102, 126, 234, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .loading-spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(102, 126, 234, 0.3);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .loading-message {
          margin-top: 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
          text-align: center;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          .loading-spinner {
            width: 40px;
            height: 40px;
          }
          
          .loading-message {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
