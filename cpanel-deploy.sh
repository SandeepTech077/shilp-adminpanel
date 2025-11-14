#!/bin/bash

# 🚀 cPanel Auto-Deployment Script
# Save as: /home/username/deploy.sh
# Make executable: chmod +x /home/username/deploy.sh

# Configuration
REPO_URL="https://github.com/SandeepTech077/shilp-adminpanel.git"
TEMP_DIR="/home/username/temp-deploy"
FRONTEND_DIR="/public_html/admin"
BACKEND_DIR="/home/username/mail.shilpgroup.com"
LOG_FILE="/home/username/deployment.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

log_message "🚀 Starting deployment..."

# Clean temp directory
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Clone latest code
log_message "📥 Cloning repository..."
cd $TEMP_DIR
git clone $REPO_URL .

if [ $? -ne 0 ]; then
    log_message "❌ Failed to clone repository"
    exit 1
fi

# Build frontend
log_message "📦 Building frontend..."
cd client
npm install --production
npm run build

if [ $? -ne 0 ]; then
    log_message "❌ Frontend build failed"
    exit 1
fi

# Deploy frontend
log_message "📱 Deploying frontend..."
rm -rf $FRONTEND_DIR/*
cp -r dist/* $FRONTEND_DIR/
cp .htaccess $FRONTEND_DIR/

# Deploy backend
log_message "🚀 Deploying backend..."
cd $TEMP_DIR
cp -r server/src/* $BACKEND_DIR/src/
cp server/package.json $BACKEND_DIR/
cp server/.env.production $BACKEND_DIR/.env

# Install backend dependencies
log_message "📦 Installing backend dependencies..."
cd $BACKEND_DIR
npm install --production

# Create uploads directories if they don't exist
mkdir -p uploads/{banners,blogs,projects,projecttree}
chmod -R 755 uploads/

# Restart Node.js app (if using cPanel Node.js Apps)
# Note: This may require manual restart in cPanel interface
log_message "🔄 Backend deployment complete - Manual restart may be required"

# Cleanup
log_message "🧹 Cleaning up..."
rm -rf $TEMP_DIR

log_message "✅ Deployment completed successfully!"

echo "Deployment completed at $(date)"