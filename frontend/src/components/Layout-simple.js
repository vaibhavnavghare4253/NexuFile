import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Shield, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Files', href: '/files', icon: FolderOpen },
    { name: 'Security', href: '/security', icon: Shield },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Shield size={32} />
            <span>NexuFile</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="nav-left">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search files, users, or settings..."
                className="search-input"
              />
            </div>
          </div>

          <div className="nav-right">
            <button className="nav-button">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>

            <button className="nav-button">
              <Settings size={20} />
            </button>

            <div className="user-menu">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.display_name || 'User'}</span>
                <span className="user-role">{user?.role || 'user'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 280px;
          height: 100vh;
          background: white;
          border-right: 1px solid #e2e8f0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateX(-280px);
          transition: transform 0.3s ease;
        }

        .sidebar.sidebar-open {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .sidebar-toggle {
          display: none;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #667eea;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: white;
        }

        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          color: #ef4444;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-button {
          display: block;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .menu-button:hover {
          background: #f3f4f6;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-bar svg {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
        }

        .search-input {
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          background: #f9fafb;
          width: 400px;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-button {
          position: relative;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .nav-button:hover {
          background: #f3f4f6;
          color: #667eea;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 0.75rem;
          cursor: pointer;
        }

        .user-menu:hover {
          background: #f8fafc;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: capitalize;
        }

        .page-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .search-input {
            width: 200px;
          }

          .user-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
