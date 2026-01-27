#!/bin/bash

echo "=== Starting Tour Blog Backend Setup ==="

# Update system
echo "Updating system..."
sudo apt update && sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y

# Install required packages
echo "Installing unzip and curl..."
sudo apt install -y unzip curl

# Install Node.js 20.x
echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# Install AWS CLI
echo "Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# Download server files from S3
echo "Downloading server files from S3..."
cd /home/ubuntu
aws s3 cp s3://tour-blog-deploy-446654353/server-deploy.zip . --no-sign-request --region us-east-1

# Extract server files
echo "Extracting files..."
mkdir -p /home/ubuntu/tour-blog/server
cd /home/ubuntu/tour-blog
unzip -o /home/ubuntu/server-deploy.zip -d server

# Install dependencies
echo "Installing dependencies..."
cd /home/ubuntu/tour-blog/server
npm install --production

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Initialize database
echo "Initializing database..."
node createDatabase.js || echo "Database initialization completed or skipped"

# Stop any existing PM2 process
pm2 delete tour-blog-api 2>/dev/null || true

# Start application
echo "Starting application..."
pm2 start server.js --name tour-blog-api

# Configure PM2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# Show status
echo ""
echo "=== Deployment Complete ==="
pm2 status
pm2 logs tour-blog-api --lines 20

echo ""
echo "✅ Backend is running!"
echo "API URL: http://13.218.231.9:5000"
