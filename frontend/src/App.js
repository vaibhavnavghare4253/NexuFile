import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';

// Lazy load components for better performance
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FileManager = React.lazy(() => import('./pages/FileManager'));
const SecurityCenter = React.lazy(() => import('./pages/SecurityCenter'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Layout = React.lazy(() => import('./components/Layout'));
const LoadingSpinner = React.lazy(() => import('./components/LoadingSpinner'));

// 3D Background Scene Component
const Scene3D = () => {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
      camera={{ position: [0, 0, 5], fov: 75 }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Floating geometric shapes */}
      <mesh position={[-3, 2, -2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#667eea" transparent opacity={0.6} />
      </mesh>
      
      <mesh position={[3, -2, -1]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#764ba2" transparent opacity={0.6} />
      </mesh>
      
      <mesh position={[0, 3, -3]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial color="#f093fb" transparent opacity={0.6} />
      </mesh>
      
      <mesh position={[-2, -3, -1]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <meshStandardMaterial color="#4facfe" transparent opacity={0.6} />
      </mesh>
      
      <mesh position={[2, 1, -2]} rotation={[0, 0, 0]}>
        <octahedronGeometry args={[0.7]} />
        <meshStandardMaterial color="#43e97b" transparent opacity={0.6} />
      </mesh>
      
      {/* Environment */}
      <Environment preset="sunset" />
    </Canvas>
  );
};

// Main App Component
function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication state
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="App">
      {/* 3D Background Scene */}
      <Scene3D />
      
      {/* Main Application Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } 
            />
            
            {/* Protected Routes */}
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
