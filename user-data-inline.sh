#!/bin/bash
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install MySQL client
apt-get install -y mysql-client

# Install Git
apt-get install -y git

# Install unzip
apt-get install -y unzip

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf aws awscliv2.zip

# Create application directory
mkdir -p /home/ubuntu/tour-blog/server
chown -R ubuntu:ubuntu /home/ubuntu/tour-blog

# Create .env file for backend
cat > /home/ubuntu/tour-blog/server/.env << EOF
PORT=5000
DB_HOST=$${db_host}
DB_USER=$${db_user}
DB_PASSWORD='$${db_password}'
DB_NAME=$${db_name}
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
EOF

chown ubuntu:ubuntu /home/ubuntu/tour-blog/server/.env

# Create deployment script
cat > /home/ubuntu/deploy.sh << 'EOFINNER'
#!/bin/bash
cd /home/ubuntu/tour-blog/server
npm install
pm2 restart tour-blog-api || pm2 start server.js --name tour-blog-api
pm2 save
pm2 startup
EOFINNER

chmod +x /home/ubuntu/deploy.sh
chown ubuntu:ubuntu /home/ubuntu/deploy.sh

echo "User data script completed successfully"
