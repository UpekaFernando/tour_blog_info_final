#!/bin/bash

echo "=== Tour Blog Backend Deployment Script ==="
echo "Starting deployment..."

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 process manager
echo "Installing PM2..."
sudo npm install -g pm2

# Install Git
echo "Installing Git..."
sudo apt install -y git

# Create application directory
echo "Creating application directory..."
mkdir -p /home/ubuntu/tour-blog
cd /home/ubuntu/tour-blog

# Clone repository (will be done manually or via upload)
echo "Repository should be uploaded to: /home/ubuntu/tour-blog/server"

# Create .env file
echo "Creating environment file..."
cat > /home/ubuntu/tour-blog/.env.example << 'EOF'
NODE_ENV=production
PORT=5000

# RDS Database
DB_HOST=tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tour_blog
DB_USER=admin
DB_PASSWORD=UpekaF1740733#

# JWT Secret (generate new one for production)
JWT_SECRET=your_super_secret_jwt_key_for_production_min_32_chars_tour_blog_2026

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key

# Frontend URL (update after deploying frontend)
FRONTEND_URL=http://13.218.231.9:5000
EOF

echo "✅ System setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your server code to /home/ubuntu/tour-blog/server"
echo "2. Copy .env.example to server/.env"
echo "3. cd /home/ubuntu/tour-blog/server"
echo "4. npm install"
echo "5. pm2 start server.js --name tour-blog-api"
echo "6. pm2 save && pm2 startup"
