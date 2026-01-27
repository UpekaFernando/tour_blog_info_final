#!/bin/bash
set -e

# Download server files
curl -sL "https://tour-blog-deploy-446654353.s3.us-east-1.amazonaws.com/server-deploy.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVLY2UD7E6RYCIUQK%2F20260127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260127T172845Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d61b2b7fe8c9219fb38d59ea170e51f338c928425390285887f4e4f0143abe49" -o server-deploy.zip

# Extract and setup
mkdir -p tour-blog
cd tour-blog
unzip -q -o ~/server-deploy.zip -d server
cd server

# Install dependencies
npm install --production

# Create uploads directory
mkdir -p uploads

# Initialize database
node createDatabase.js

# Stop existing PM2 process
pm2 delete tour-blog-api 2>/dev/null || true

# Start application
pm2 start server.js --name tour-blog-api
pm2 save

# Show status
pm2 status
pm2 logs tour-blog-api --lines 20 --nostream
