import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-fallback">
      <div className="error-container">
        <div className="error-icon">
          <AlertTriangle size={64} color="#f56565" />
        </div>
        
        <div className="error-content">
          <h1 className="error-title">Oops! Something went wrong</h1>
          <p className="error-message">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Error Details (Development Mode)</summary>
              <pre className="error-stack">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="error-actions">
            <button 
              className="btn btn-primary"
              onClick={resetErrorBoundary}
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .error-fallback {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }
        
        .error-container {
          background: white;
          border-radius: 1rem;
          padding: 3rem;
          max-width: 600px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .error-icon {
          margin-bottom: 2rem;
        }
        
        .error-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        
        .error-message {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .error-details {
          text-align: left;
          margin-bottom: 2rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .error-details summary {
          cursor: pointer;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .error-stack {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          color: #dc2626;
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        @media (max-width: 640px) {
          .error-container {
            padding: 2rem;
            margin: 1rem;
          }
          
          .error-title {
            font-size: 1.5rem;
          }
          
          .error-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorFallback;
