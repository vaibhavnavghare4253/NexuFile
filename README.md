# Secure AI-Based File Management System

A comprehensive cloud-based file management system with AI-powered security features and 3D animated frontend.

## 🚀 Features

### Core Functionality
- **Secure File Storage**: Encrypted cloud storage with Google Cloud Storage
- **AI Content Analysis**: Automatic detection of sensitive information using Vertex AI
- **Smart Access Control**: Role-based permissions with AI recommendations
- **Real-time Threat Detection**: AI monitoring for abnormal access patterns
- **Explainable Alerts**: Clear explanations for security decisions

### 3D Animated Frontend
- **Interactive 3D Interface**: Built with Three.js and React Three Fiber
- **Smooth Animations**: GSAP-powered animations for enhanced UX
- **Immersive Dashboard**: 3D file visualization and management
- **Responsive Design**: Optimized for all devices

### Security Features
- **Firebase Authentication**: Secure user management
- **Data Encryption**: End-to-end encryption for all files
- **Access Logging**: Comprehensive audit trails
- **Threat Detection**: AI-powered security monitoring

## 🛠️ Tech Stack

### Backend
- **Python Flask** - RESTful API framework
- **Google Cloud Platform** - Cloud infrastructure
- **Google Cloud Storage** - File storage
- **Firebase Authentication** - User management
- **Google Vertex AI** - AI services
- **TensorFlow** - Machine learning

### Frontend
- **React.js** - Frontend framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React 3D renderer
- **GSAP** - Animations
- **Framer Motion** - React animations

## 📁 Project Structure

```
CloudAI/
├── backend/                 # Flask backend
│   ├── app/                # Main application
│   ├── models/             # AI models
│   ├── services/           # Business logic
│   ├── utils/              # Utilities
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/                # Source code
│   ├── public/             # Public assets
│   └── package.json        # Node dependencies
├── docs/                   # Documentation
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Cloud Platform account
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CloudAI.git
   cd CloudAI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Configuration

1. Set up Google Cloud Platform project
2. Configure Firebase Authentication
3. Set up Vertex AI services
4. Configure environment variables

## 🔧 Development

### Backend Development
- Flask RESTful APIs
- Google Cloud Storage integration
- AI model deployment
- Security implementation

### Frontend Development
- React component development
- Three.js 3D scene creation
- Animation implementation
- User interface design

## 🧪 Testing

```bash
# Backend testing
cd backend
python -m pytest

# Frontend testing
cd frontend
npm test
```

## 🚀 Deployment

The application can be deployed on:
- Google App Engine
- Firebase Hosting
- Google Cloud Run

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Frontend Guide](docs/frontend.md)
- [Security Guide](docs/security.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Cloud Platform for free student credits
- Firebase for authentication services
- Three.js community for 3D graphics library
- GSAP for animation tools

## 📞 Support

For support, email support@cloudai.com or create an issue in the repository.
