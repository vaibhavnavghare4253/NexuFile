import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Upload, 
  Brain,
  Zap,
  Users,
  Globe
} from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    display_name: '',
    role: 'user'
  });
  
  const { login, register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } else {
      const result = await register(formData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const featureVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      className="login-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="login-container">
        {/* Left Side - Features */}
        <motion.div 
          className="login-features"
          variants={featureVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="features-content">
            <motion.div
              className="logo-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="logo-icon">
                <Shield size={48} />
              </div>
              <h1 className="logo-title">Secure AI</h1>
              <p className="logo-subtitle">File Management System</p>
            </motion.div>

            <div className="features-list">
              <motion.div 
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Brain size={24} />
                <div>
                  <h3>AI-Powered Security</h3>
                  <p>Advanced threat detection and content analysis</p>
                </div>
              </motion.div>

              <motion.div 
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Zap size={24} />
                <div>
                  <h3>Lightning Fast</h3>
                  <p>Optimized performance with cloud infrastructure</p>
                </div>
              </motion.div>

              <motion.div 
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Users size={24} />
                <div>
                  <h3>Team Collaboration</h3>
                  <p>Secure sharing and role-based access control</p>
                </div>
              </motion.div>

              <motion.div 
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Globe size={24} />
                <div>
                  <h3>Global Access</h3>
                  <p>Access your files from anywhere, anytime</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          className="login-form-container"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <div className="login-form-card">
            <div className="form-header">
              <h2 className="form-title">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="form-subtitle">
                {isLogin 
                  ? 'Sign in to your secure file management account' 
                  : 'Join thousands of users securing their files with AI'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <motion.div 
                  className="form-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="form-label">Display Name</label>
                  <div className="input-group">
                    <Users size={20} />
                    <input
                      type="text"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your display name"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-group">
                  <Mail size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <Lock size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <motion.div 
                  className="form-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="form-label">Role</label>
                  <div className="input-group">
                    <Users size={20} />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    {isLogin ? <Upload size={20} /> : <Shield size={20} />}
                  </>
                )}
              </motion.button>
            </form>

            <div className="form-footer">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="toggle-button"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .login-features {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 3rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .features-content {
          color: white;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .logo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .logo-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-subtitle {
          font-size: 1.125rem;
          opacity: 0.8;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .feature-item h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .feature-item p {
          font-size: 0.875rem;
          opacity: 0.8;
          margin: 0;
        }

        .login-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-form-card {
          background: white;
          border-radius: 2rem;
          padding: 3rem;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-group svg {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 2rem;
          color: #6b7280;
        }

        .toggle-button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.5rem;
          text-decoration: underline;
        }

        .toggle-button:hover {
          color: #5a67d8;
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .login-features {
            padding: 2rem;
          }

          .login-form-card {
            padding: 2rem;
          }

          .logo-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 1rem;
          }

          .login-form-card {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LoginPage;
