# Deployment Guide for Secure AI File Management System

This guide provides step-by-step instructions for deploying the Secure AI File Management System to various cloud platforms.

## Prerequisites

- Google Cloud Platform account with billing enabled
- Firebase project
- Docker and Docker Compose installed
- Git installed

## 1. Google Cloud Platform Setup

### 1.1 Create GCP Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Cloud Storage API
   - Vertex AI API
   - Cloud Functions API
   - App Engine API

### 1.2 Set up Authentication

1. Create a service account:
   ```bash
   gcloud iam service-accounts create secureai-service \
       --description="Service account for Secure AI File Management" \
       --display-name="Secure AI Service Account"
   ```

2. Grant necessary permissions:
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
       --member="serviceAccount:secureai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/storage.admin"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
       --member="serviceAccount:secureai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
       --role="roles/aiplatform.user"
   ```

3. Create and download service account key:
   ```bash
   gcloud iam service-accounts keys create service-account.json \
       --iam-account=secureai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

### 1.3 Set up Cloud Storage

1. Create a storage bucket:
   ```bash
   gsutil mb gs://your-secure-file-storage
   ```

2. Set bucket permissions:
   ```bash
   gsutil iam ch allUsers:objectViewer gs://your-secure-file-storage
   ```

## 2. Firebase Setup

### 2.1 Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password
4. Enable Firestore Database
5. Download Firebase Admin SDK key

### 2.2 Configure Firebase Authentication

1. Go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Configure authorized domains

## 3. Local Development Setup

### 3.1 Clone Repository

```bash
git clone https://github.com/yourusername/secure-ai-file-management.git
cd secure-ai-file-management
```

### 3.2 Environment Configuration

1. Copy environment template:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your configuration:
   ```bash
   # Update with your actual values
   GOOGLE_CLOUD_PROJECT=your-project-id
   FIREBASE_PROJECT_ID=your-firebase-project-id
   # ... other variables
   ```

### 3.3 Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3.4 Manual Setup (Alternative)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 4. Production Deployment

### 4.1 Google App Engine Deployment

1. Create `app.yaml` in the backend directory:
   ```yaml
   runtime: python311
   service: backend

   env_variables:
     GOOGLE_CLOUD_PROJECT: "your-project-id"
     FIREBASE_PROJECT_ID: "your-firebase-project-id"
     # ... other environment variables

   automatic_scaling:
     min_instances: 1
     max_instances: 10

   resources:
     cpu: 1
     memory_gb: 0.5
   ```

2. Deploy backend:
   ```bash
   cd backend
   gcloud app deploy
   ```

3. Deploy frontend:
   ```bash
   cd frontend
   npm run build
   gcloud app deploy frontend.yaml
   ```

### 4.2 Google Cloud Run Deployment

1. Build and push Docker images:
   ```bash
   # Backend
   docker build -t gcr.io/YOUR_PROJECT_ID/secureai-backend ./backend
   docker push gcr.io/YOUR_PROJECT_ID/secureai-backend

   # Frontend
   docker build -t gcr.io/YOUR_PROJECT_ID/secureai-frontend ./frontend
   docker push gcr.io/YOUR_PROJECT_ID/secureai-frontend
   ```

2. Deploy to Cloud Run:
   ```bash
   # Backend
   gcloud run deploy secureai-backend \
       --image gcr.io/YOUR_PROJECT_ID/secureai-backend \
       --platform managed \
       --region us-central1 \
       --allow-unauthenticated

   # Frontend
   gcloud run deploy secureai-frontend \
       --image gcr.io/YOUR_PROJECT_ID/secureai-frontend \
       --platform managed \
       --region us-central1 \
       --allow-unauthenticated
   ```

### 4.3 Kubernetes Deployment

1. Create Kubernetes manifests:

   ```yaml
   # k8s/backend-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: secureai-backend
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: secureai-backend
     template:
       metadata:
         labels:
           app: secureai-backend
       spec:
         containers:
         - name: backend
           image: gcr.io/YOUR_PROJECT_ID/secureai-backend
           ports:
           - containerPort: 5000
           env:
           - name: GOOGLE_CLOUD_PROJECT
             value: "your-project-id"
           # ... other environment variables
   ```

2. Deploy to Kubernetes:
   ```bash
   kubectl apply -f k8s/
   ```

## 5. Monitoring and Maintenance

### 5.1 Set up Monitoring

1. Enable Cloud Monitoring
2. Set up alerts for:
   - High error rates
   - Storage usage
   - Authentication failures
   - File upload/download rates

### 5.2 Backup Strategy

1. Set up automated backups for:
   - Firestore database
   - Cloud Storage buckets
   - Application configuration

### 5.3 Security Updates

1. Regularly update dependencies
2. Monitor security advisories
3. Apply security patches promptly

## 6. Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Firebase configuration
   - Verify service account permissions
   - Ensure environment variables are set correctly

2. **File Upload Issues**
   - Check Cloud Storage permissions
   - Verify bucket configuration
   - Check file size limits

3. **AI Analysis Failures**
   - Verify Vertex AI API is enabled
   - Check model endpoint configuration
   - Monitor API quotas

### Logs and Debugging

1. View application logs:
   ```bash
   # Google Cloud Logging
   gcloud logging read "resource.type=cloud_run_revision"

   # Docker logs
   docker-compose logs -f backend
   ```

2. Enable debug mode:
   ```bash
   export FLASK_ENV=development
   export LOG_LEVEL=DEBUG
   ```

## 7. Performance Optimization

### 7.1 Caching

1. Implement Redis caching for frequently accessed data
2. Use CDN for static assets
3. Cache AI analysis results

### 7.2 Database Optimization

1. Create appropriate indexes
2. Optimize queries
3. Use connection pooling

### 7.3 File Storage Optimization

1. Implement file compression
2. Use appropriate storage classes
3. Set up lifecycle policies

## 8. Security Considerations

### 8.1 Network Security

1. Use HTTPS everywhere
2. Implement proper CORS policies
3. Use VPC for internal communication

### 8.2 Data Security

1. Encrypt data at rest and in transit
2. Implement proper access controls
3. Regular security audits

### 8.3 Authentication Security

1. Use strong password policies
2. Implement rate limiting
3. Monitor for suspicious activities

## Support

For additional support, please refer to:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Project Issues](https://github.com/yourusername/secure-ai-file-management/issues)
