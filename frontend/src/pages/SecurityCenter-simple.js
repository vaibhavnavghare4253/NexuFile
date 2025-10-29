import React from 'react';
import { Shield } from 'lucide-react';

const SecurityCenter = () => {
  return (
    <div className="security-center">
      <div className="security-header">
        <Shield size={48} />
        <h1>Security Center</h1>
        <p>Monitor your file security and threats</p>
      </div>

      <style jsx>{`
        .security-center {
          padding: 2rem;
          text-align: center;
        }

        .security-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 1rem 0 0.5rem 0;
        }

        .security-header p {
          color: #6b7280;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
};

export default SecurityCenter;
