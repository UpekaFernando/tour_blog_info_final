#!/bin/bash
set -e

echo "=== Starting Backend Deployment ==="

# Update system
echo "Updating system..."
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y unzip curl

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

node --version
npm --version

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install AWS CLI
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    cd /tmp
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Download and deploy server
echo "Downloading server files..."
cd /home/ubuntu
aws s3 cp s3://tour-blog-deploy-446654353/server-deploy.zip . --no-sign-request --region us-east-1

echo "Extracting files..."
rm -rf /home/ubuntu/tour-blog
mkdir -p /home/ubuntu/tour-blog
cd /home/ubuntu/tour-blog
unzip -o /home/ubuntu/server-deploy.zip -d server
cd server

echo "Installing dependencies..."
npm install --production

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Initialize database
echo "Initializing database..."
node createDatabase.js || echo "Database already initialized"

# Stop existing PM2 process
pm2 delete tour-blog-api 2>/dev/null || true

# Start application
echo "Starting application..."
pm2 start server.js --name tour-blog-api

# Configure PM2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

echo ""
echo "=== Backend Deployment Complete ==="
pm2 status
pm2 logs tour-blog-api --lines 10 --nostream

echo ""
echo "??? Backend is running at http://13.218.231.9:5000"
