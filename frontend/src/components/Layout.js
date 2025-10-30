import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="layout">
      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <Shield size={32} />
            <span>Secure AI</span>
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
              <motion.a
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </motion.a>
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
      </motion.aside>

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

            <button className="nav-button">
              <HelpCircle size={20} />
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
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}
        initial={{ x: '-100%' }}
        animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <Shield size={24} />
            <span>Secure AI</span>
          </div>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              <User size={20} />
            </div>
            <div>
              <div className="mobile-user-name">{user?.display_name || 'User'}</div>
              <div className="mobile-user-email">{user?.email}</div>
            </div>
          </div>
          <button
            className="mobile-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* Sidebar */
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

        .sidebar-toggle:hover {
          background: #f3f4f6;
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

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Top Navigation */
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
          display: none;
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
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
          transition: all 0.2s ease;
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
          transition: all 0.2s ease;
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

        /* Page Content */
        .page-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Mobile Menu */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: white;
          z-index: 999;
          display: flex;
          flex-direction: column;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .mobile-menu-close {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .mobile-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .mobile-nav-item:hover {
          background: #f8fafc;
          color: #667eea;
        }

        .mobile-nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .mobile-menu-footer {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }

        .mobile-user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .mobile-user-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .mobile-user-email {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .mobile-logout-button {
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

        .mobile-logout-button:hover {
          background: #fef2f2;
          border-color: #fecaca;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .search-input {
            width: 300px;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }

          .menu-button {
            display: block;
          }

          .search-input {
            width: 250px;
          }

          .user-info {
            display: none;
          }

          .nav-right .nav-button:not(.user-menu) {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .top-nav {
            padding: 1rem;
          }

          .search-input {
            width: 200px;
          }

          .page-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
