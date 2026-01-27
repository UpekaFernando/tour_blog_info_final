# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create directory and extract
mkdir -p /home/ubuntu/tour-blog
cd /home/ubuntu/tour-blog
unzip -o /home/ubuntu/server-deploy.zip -d server
cd server

# Install dependencies
npm install --production

# Create uploads directory
mkdir -p uploads

# Initialize database
node createDatabase.js

# Start application with PM2
pm2 start server.js --name tour-blog-api

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs tour-blog-api --lines 50
