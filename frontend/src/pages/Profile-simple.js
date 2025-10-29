import React from 'react';
import { User } from 'lucide-react';

const Profile = () => {
  return (
    <div className="profile">
      <div className="profile-header">
        <User size={48} />
        <h1>Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <style jsx>{`
        .profile {
          padding: 2rem;
          text-align: center;
        }

        .profile-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 1rem 0 0.5rem 0;
        }

        .profile-header p {
          color: #6b7280;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;
