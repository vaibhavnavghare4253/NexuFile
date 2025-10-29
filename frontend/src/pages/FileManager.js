import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical, 
  Download, 
  Share2, 
  Trash2, 
  Eye,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  FolderOpen,
  Star,
  Clock,
  HardDrive,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

// 3D File Visualization Components
const FileCube3D = ({ position, file, onClick }) => {
  const meshRef = React.useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  const getFileColor = (type) => {
    switch (type) {
      case 'document': return '#667eea';
      case 'image': return '#f093fb';
      case 'video': return '#4facfe';
      case 'audio': return '#43e97b';
      case 'folder': return '#f59e0b';
      default: return '#764ba2';
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        color={getFileColor(file.type)} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, 3d
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // File upload with dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: getFileType(file.type),
          size: formatFileSize(file.size),
          date: new Date().toISOString().split('T')[0],
          status: 'safe',
          path: `/uploads/${file.name}`
        };
      });
      
      const newFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...newFiles, ...prev]);
      toast.success(`${acceptedFiles.length} files uploaded successfully!`);
    },
    multiple: true
  });

  useEffect(() => {
    // Simulate loading files
    const loadFiles = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFiles([
        { id: 1, name: 'Project Proposal.pdf', type: 'document', size: '2.4 MB', date: '2024-01-15', status: 'safe', starred: true },
        { id: 2, name: 'Team Photo.jpg', type: 'image', size: '1.8 MB', date: '2024-01-14', status: 'safe', starred: false },
        { id: 3, name: 'Presentation.mp4', type: 'video', size: '45.2 MB', date: '2024-01-13', status: 'safe', starred: true },
        { id: 4, name: 'Meeting Notes.docx', type: 'document', size: '856 KB', date: '2024-01-12', status: 'safe', starred: false },
        { id: 5, name: 'Background Music.mp3', type: 'audio', size: '3.2 MB', date: '2024-01-11', status: 'safe', starred: false },
        { id: 6, name: 'Design Assets', type: 'folder', size: '12.5 MB', date: '2024-01-10', status: 'safe', starred: false },
        { id: 7, name: 'Screenshot.png', type: 'image', size: '892 KB', date: '2024-01-09', status: 'safe', starred: false },
        { id: 8, name: 'Contract.pdf', type: 'document', size: '1.2 MB', date: '2024-01-08', status: 'safe', starred: true },
      ]);
      
      setLoading(false);
    };
    
    loadFiles();
  }, []);

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    return 'archive';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'document': return <FileText size={24} />;
      case 'image': return <Image size={24} />;
      case 'video': return <Video size={24} />;
      case 'audio': return <Music size={24} />;
      case 'folder': return <Folder size={24} />;
      default: return <Archive size={24} />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || file.type === filterBy;
    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const handleFileAction = (action, fileId) => {
    switch (action) {
      case 'download':
        toast.success('Download started');
        break;
      case 'share':
        toast.success('Share link generated');
        break;
      case 'delete':
        setFiles(prev => prev.filter(file => file.id !== fileId));
        toast.success('File deleted');
        break;
      case 'star':
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, starred: !file.starred } : file
        ));
        break;
    }
  };

  if (loading) {
    return (
      <div className="file-manager-loading">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-spinner" />
          <p>Loading your files...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="file-manager">
      {/* Header */}
      <motion.div
        className="file-manager-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1 className="page-title">File Manager</h1>
          <p className="page-subtitle">Manage and organize your secure files</p>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload size={32} />
          <p>
            {isDragActive 
              ? 'Drop files here...' 
              : 'Drag & drop files here, or click to select'
            }
          </p>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="file-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="controls-left">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Files</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="folder">Folders</option>
          </select>
        </div>

        <div className="controls-right">
          <div className="view-modes">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
            <button
              className={`view-button ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              <HardDrive size={20} />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </motion.div>

      {/* File List */}
      <motion.div
        className="file-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {viewMode === '3d' ? (
          <div className="file-3d-view">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              
              {filteredFiles.map((file, index) => (
                <FileCube3D
                  key={file.id}
                  position={[
                    (index % 4 - 1.5) * 2,
                    Math.floor(index / 4) * 2 - 2,
                    -5
                  ]}
                  file={file}
                  onClick={() => handleFileSelect(file.id)}
                />
              ))}
            </Canvas>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="file-grid">
            <AnimatePresence>
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  className={`file-card ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <div className="file-icon">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="file-info">
                    <h3 className="file-name">{file.name}</h3>
                    <p className="file-size">{file.size}</p>
                    <p className="file-date">{file.date}</p>
                  </div>

                  <div className="file-actions">
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('star', file.id);
                      }}
                    >
                      <Star size={16} fill={file.starred ? 'currentColor' : 'none'} />
                    </button>
                    
                    <div className="action-menu">
                      <button
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('download', file.id);
                        }}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('share', file.id);
                        }}
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        className="action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('delete', file.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {file.status === 'safe' && (
                    <div className="security-badge">
                      <Shield size={12} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="file-list">
            <div className="list-header">
              <input
                type="checkbox"
                checked={selectedFiles.length === filteredFiles.length}
                onChange={handleSelectAll}
                className="select-all-checkbox"
              />
              <span>Name</span>
              <span>Size</span>
              <span>Modified</span>
              <span>Actions</span>
            </div>
            
            <AnimatePresence>
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  className={`file-list-item ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="file-checkbox"
                  />
                  
                  <div className="file-icon">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="file-name">
                    <h4>{file.name}</h4>
                    <div className="file-badges">
                      {file.starred && <Star size={12} fill="currentColor" />}
                      {file.status === 'safe' && <Shield size={12} />}
                    </div>
                  </div>
                  
                  <span className="file-size">{file.size}</span>
                  <span className="file-date">{file.date}</span>
                  
                  <div className="file-actions">
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('download', file.id);
                      }}
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('share', file.id);
                      }}
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('delete', file.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .file-manager {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .file-manager-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .file-manager-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #6b7280;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .upload-area:hover,
        .upload-area.drag-active {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .upload-area svg {
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .file-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 1rem 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 1rem;
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
          width: 300px;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
        }

        .filter-select,
        .sort-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .view-modes {
          display: flex;
          background: #f3f4f6;
          border-radius: 0.75rem;
          padding: 0.25rem;
        }

        .view-button {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .view-button.active {
          background: white;
          color: #667eea;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .file-3d-view {
          height: 600px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .file-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .file-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .file-card.selected {
          border: 2px solid #667eea;
          background: #f0f4ff;
        }

        .file-icon {
          width: 60px;
          height: 60px;
          background: #f3f4f6;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .file-info {
          margin-bottom: 1rem;
        }

        .file-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          word-break: break-word;
        }

        .file-size,
        .file-date {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .file-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .action-menu {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-button:hover {
          background: #e2e8f0;
          color: #667eea;
        }

        .security-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #10b981;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-list {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .list-header {
          display: grid;
          grid-template-columns: 40px 1fr 120px 120px 120px;
          gap: 1rem;
          padding: 1rem 2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
        }

        .file-list-item {
          display: grid;
          grid-template-columns: 40px 40px 1fr 120px 120px 120px;
          gap: 1rem;
          padding: 1rem 2rem;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .file-list-item:hover {
          background: #f8fafc;
        }

        .file-list-item.selected {
          background: #f0f4ff;
        }

        .select-all-checkbox,
        .file-checkbox {
          width: 20px;
          height: 20px;
        }

        .file-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .file-manager {
            padding: 1rem;
          }

          .file-manager-header {
            flex-direction: column;
            gap: 1rem;
          }

          .file-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .controls-left,
          .controls-right {
            width: 100%;
            justify-content: space-between;
          }

          .search-input {
            width: 200px;
          }

          .file-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default FileManager;
