import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Simple components without complex 3D dependencies
const LoginPage = React.lazy(() => import('./pages/LoginPage-simple'));
const Dashboard = React.lazy(() => import('./pages/Dashboard-simple'));
const FileManager = React.lazy(() => import('./pages/FileManager-simple'));
const SecurityCenter = React.lazy(() => import('./pages/SecurityCenter-simple'));
const Profile = React.lazy(() => import('./pages/Profile-simple'));
const Layout = React.lazy(() => import('./components/Layout-simple'));
const LoadingSpinner = React.lazy(() => import('./components/LoadingSpinner'));

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="App">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } 
            />
            
            <Route 
              path="/*" 
              element={
                isAuthenticated ? (
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/files" element={<FileManager />} />
                      <Route path="/security" element={<SecurityCenter />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
