#!/bin/bash

# 🔧 Update Client API URL for Separate Backend Deployment
# Usage: ./update-client-api.sh <backend-url>

BACKEND_URL=$1

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Error: Please provide backend URL"
    echo "Usage: ./update-client-api.sh https://your-backend.railway.app"
    exit 1
fi

echo "🔧 Updating client API configuration..."
echo "Backend URL: $BACKEND_URL"

# Update .env.production
echo "📝 Updating .env.production..."
cat > client/.env.production << EOF
# Production Environment Variables - Separate Backend
VITE_API_BASE_URL=$BACKEND_URL
VITE_IMAGE_BASE_URL=$BACKEND_URL
VITE_DEV_PORT=5174
VITE_PROD_PORT=5174
VITE_APP_NAME="Shilp Admin Panel"
VITE_APP_VERSION="1.0.0"

# Production settings
VITE_DEBUG_IMAGES=false
EOF

# Update config.ts to use environment variable
echo "🔧 Updating config.ts..."
cat > client/src/api/config.ts << 'EOF'
// API configuration for separate backend deployment
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Get backend URL from environment
const getBaseUrl = (): string => {
  // Production environment - Use environment variable
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
  }
  
  // Development environment - Dynamic detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // If accessing via network IP, use network IP for API
    if (hostname === '192.168.2.143' || hostname.includes('192.168')) {
      return `${protocol}//${hostname}:8081`;
    }
    
    // If accessing via localhost with custom port
    if (hostname === 'localhost' && window.location.port === '5175') {
      return 'http://localhost:8081';
    }
  }
  
  // Default development URL
  return 'http://localhost:8081';
};

// Base URL for API calls
export const API_BASE_URL = getBaseUrl();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: false,
});

// Request interceptor to add auth token
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Image URL helper function
export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath || imagePath.trim() === '') {
    return '';
  }
  
  // Handle full URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Handle relative paths - prepend base URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
};

console.log('🔧 API Base URL:', API_BASE_URL);
EOF

echo "✅ Client configuration updated!"
echo "📝 Files updated:"
echo "   - client/.env.production"
echo "   - client/src/api/config.ts"
echo ""
echo "🎯 Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Build production: npm run build"
echo "3. Deploy: git push origin main"