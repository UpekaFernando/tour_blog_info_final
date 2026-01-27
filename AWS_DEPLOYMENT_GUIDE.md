<<<<<<< HEAD
# AWS Deployment Guide - Sri Lanka Tour Blog

## 🏗️ Architecture Overview

Your application will be deployed as:
- **Frontend (React)**: AWS S3 + CloudFront (CDN)
- **Backend (Node.js)**: AWS EC2 or Elastic Beanstalk
- **Database (MySQL)**: AWS RDS
- **File Storage**: AWS S3 for images
- **Domain**: Route 53 (optional)

**Estimated Cost**: $30-50/month (with free tier: $10-20/month for first year)

---

## 📋 Prerequisites

1. **AWS Account** - Sign up at https://aws.amazon.com
2. **AWS CLI** - Install from https://aws.amazon.com/cli/
3. **Domain Name** (Optional) - From Route 53 or external provider

---

## 🗄️ Step 1: Setup AWS RDS (MySQL Database)

### 1.1 Create RDS MySQL Instance

```bash
# Via AWS Console:
1. Go to AWS RDS Dashboard
2. Click "Create database"
3. Choose:
   - Engine: MySQL 8.0
   - Template: Free tier (or Production for better performance)
   - DB Instance: db.t3.micro (free tier) or db.t3.small
   - DB Name: tour_blog
   - Master username: admin
   - Master password: [Create strong password]
   - Storage: 20 GB (expandable)
   - Public access: Yes (for now, secure later)
4. Create database
5. Wait 5-10 minutes for creation
```

### 1.2 Configure Security Group

```bash
# In RDS Security Group:
1. Go to EC2 > Security Groups
2. Find your RDS security group
3. Edit Inbound Rules:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: Your IP (for testing) + EC2 Security Group (production)
```

### 1.3 Get Connection Details

```bash
# Save these from RDS Console:
Endpoint: tour-blog.xxxxx.us-east-1.rds.amazonaws.com
Port: 3306
Username: admin
Password: [your password]
Database: tour_blog
```

### 1.4 Initialize Database

```bash
# From your local machine (with MySQL client):
mysql -h tour-blog.xxxxx.us-east-1.rds.amazonaws.com -P 3306 -u admin -p

# Or use MySQL Workbench to connect
# Then your application will auto-create tables on first run
=======
# AWS Deployment Guide for Tour Blog Application

This guide walks through deploying a React + Node.js + MySQL application to AWS using several possible approaches.

---

## Table of Contents

1. [Overview](#overview)
2. [Option 1: AWS Elastic Beanstalk (Recommended for beginners)](#option-1-aws-elastic-beanstalk)
3. [Option 2: ECS + RDS + EC2 (Recommended for production)](#option-2-ecs--rds--ec2)
4. [Option 3: EC2 + Manual Setup](#option-3-ec2--manual-setup)
5. [Common Setup Steps](#common-setup-steps)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Your application consists of:
- **Frontend**: React + Vite (builds to static files)
- **Backend**: Node.js + Express
- **Database**: MySQL
- **File Storage**: Multer uploads (needs persistent storage)

### Recommended Architecture

```
Client Browser
     ↓
CloudFront (CDN)
     ↓
S3 (Frontend assets)
     ↓
ALB (Load Balancer)
     ↓
ECS/EC2 (Backend API)
     ↓
RDS MySQL (Database)
>>>>>>> 1c5c3c855d19bc5036dfc5a4db7234b54e6557af
```

---

<<<<<<< HEAD
## 🖥️ Step 2: Deploy Backend to AWS EC2

### 2.1 Launch EC2 Instance

```bash
# Via AWS Console:
1. Go to EC2 Dashboard
2. Click "Launch Instance"
3. Choose:
   - Name: tour-blog-backend
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t2.micro (free tier) or t2.small
   - Key pair: Create new key pair (download .pem file)
   - Security group: Create new
     * SSH (22) - Your IP
     * HTTP (80) - 0.0.0.0/0
     * HTTPS (443) - 0.0.0.0/0
     * Custom TCP (5000) - 0.0.0.0/0
4. Launch instance
```

### 2.2 Connect to EC2 Instance

```bash
# Windows (PowerShell):
$env:EC2_IP = "your-ec2-public-ip"
ssh -i "your-key.pem" ubuntu@$env:EC2_IP

# Or use PuTTY on Windows
```

### 2.3 Install Node.js and Dependencies

```bash
# On EC2 instance:
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Verify installations
node --version
npm --version
pm2 --version
```

### 2.4 Clone and Setup Backend

```bash
# Clone your repository (or upload files)
git clone https://github.com/yourusername/tour-blog.git
cd tour-blog/server

# Or upload files using SCP:
# scp -i "your-key.pem" -r ./server ubuntu@$env:EC2_IP:/home/ubuntu/

# Install dependencies
npm install

# Create production .env file
nano .env
```

### 2.5 Configure Environment Variables

```bash
# /home/ubuntu/tour-blog/server/.env
NODE_ENV=production
PORT=5000

# RDS Database
DB_HOST=tour-blog.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tour_blog
DB_USER=admin
DB_PASSWORD=your_rds_password

# JWT Secret (generate new one)
JWT_SECRET=your_super_secret_jwt_key_for_production_min_32_chars

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-cloudfront-domain.cloudfront.net
```

### 2.6 Update CORS Configuration

```javascript
// Update server/server.js CORS settings:
app.use(cors({
  origin: [
    'https://your-cloudfront-domain.cloudfront.net',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2.7 Create uploads directory

```bash
mkdir -p /home/ubuntu/tour-blog/server/uploads
chmod 755 /home/ubuntu/tour-blog/server/uploads
```

### 2.8 Start Application with PM2

```bash
# Start the application
pm2 start server.js --name tour-blog-api

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs tour-blog-api
```

### 2.9 Setup Nginx Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/tour-blog
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 public IP

    # Increase client body size for image uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/tour-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt (Free HTTPS)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
=======
## Option 1: AWS Elastic Beanstalk (Recommended for beginners)

**Pros**: Easiest setup, auto-scaling, managed platform  
**Cons**: Less control, higher costs at scale

### Step 1: Prerequisites

1. AWS Account with proper permissions
2. AWS CLI installed:
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   aws --version
   ```

3. EB CLI installed:
   ```bash
   pip install awsebcli
   ```

4. Git configured and repository ready

### Step 2: Prepare Your Application

1. **Update `.gitignore`** to exclude unnecessary files:
   ```
   node_modules/
   .env
   .env.local
   dist/
   build/
   uploads/
   ```

2. **Create `.ebignore`** in root:
   ```
   .git
   .gitignore
   node_modules
   npm-debug.log
   dist
   .vscode
   .DS_Store
   Images/
   ```

3. **Update backend environment variables** - Create `.env.example`:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=your-rds-endpoint.rds.amazonaws.com
   DB_PORT=3306
   DB_NAME=sri_lanka_travel
   DB_USER=admin
   DB_PASSWORD=your-secure-password
   JWT_SECRET=your-jwt-secret-key
   UPLOAD_DIR=/var/app/current/uploads
   ```

### Step 3: Create Elastic Beanstalk Environment

1. **Initialize Elastic Beanstalk**:
   ```bash
   eb init -p "Node.js 18 running on 64bit Amazon Linux 2" tour-blog --region us-east-1
   ```

2. **Create environment**:
   ```bash
   eb create tour-blog-env --instance-type t3.small --database
   ```
   - Choose MySQL for database
   - Set master username and password

3. **Configure environment**:
   ```bash
   eb config
   ```
   Add this section:
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       GzipCompression: true
     aws:elasticbeanstalk:application:environment:
       NODE_ENV: production
   ```

### Step 4: Update Server Configuration

Create `.platform/hooks/predeploy/01_build.sh` in root:
```bash
#!/bin/bash
cd server
npm install
cd ../client
npm install
npm run build
```

Create `.platform/nginx/conf.d/custom.conf`:
```nginx
upstream nodejs {
  server 127.0.0.1:5000;
}

server {
  listen 80 default_server;
  
  # Frontend (React build)
  location / {
    root /var/www/html;
    try_files $uri $uri/ /index.html;
  }
  
  # API Routes
  location /api {
    proxy_pass http://nodejs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### Step 5: Prepare Database

Before deploying, you need to run migrations on RDS:

```bash
# Get RDS endpoint from AWS Console
# Update server/config/database.js with RDS credentials

# Create migration script
node server/setupNewDatabase.js
```

### Step 6: Deploy

```bash
# Add and commit your changes
git add .
git commit -m "Prepare for AWS deployment"

# Deploy to Elastic Beanstalk
eb deploy
eb open  # Opens your app in browser
```

### Step 7: Set Environment Variables on AWS

```bash
eb setenv DB_HOST=your-rds-endpoint.c9akciq32.us-east-1.rds.amazonaws.com \
           DB_USER=admin \
           DB_PASSWORD=your-password \
           JWT_SECRET=your-secret
>>>>>>> 1c5c3c855d19bc5036dfc5a4db7234b54e6557af
```

---

<<<<<<< HEAD
## 🌐 Step 3: Deploy Frontend to AWS S3 + CloudFront

### 3.1 Build Production Frontend

```bash
# On your local machine:
cd client

# Update API URL in src/utils/api.js
# Change baseURL to your backend URL
```

Update `client/src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-domain.com/api',  // or http://ec2-ip:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
```

```bash
# Build for production
npm run build

# This creates a 'dist' folder
```

### 3.2 Create S3 Bucket

```bash
# Via AWS Console:
1. Go to S3 Dashboard
2. Click "Create bucket"
3. Bucket name: tour-blog-frontend (must be unique globally)
4. Region: us-east-1 (or your preferred region)
5. Uncheck "Block all public access"
6. Acknowledge the warning
7. Create bucket
```

### 3.3 Configure S3 Bucket for Static Website

```bash
# In S3 bucket settings:
1. Go to Properties tab
2. Scroll to "Static website hosting"
3. Enable it
4. Index document: index.html
5. Error document: index.html (for React Router)
6. Save changes
```

### 3.4 Add Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tour-blog-frontend/*"
=======
## Option 2: ECS + RDS + EC2 (Recommended for production)

**Pros**: Maximum control, better scaling, container-based  
**Cons**: More complex setup

### Step 1: Create RDS MySQL Database

1. Go to AWS RDS Console
2. Click "Create database"
3. Select MySQL 8.0
4. Configuration:
   - Instance class: db.t3.micro (free tier)
   - Allocated storage: 20 GB
   - DB instance identifier: `tour-blog-db`
   - Master username: `admin`
   - Master password: (save securely)
   - VPC: Create new or use existing
5. Create Security Group allowing port 3306 from your app
6. Create database

### Step 2: Create ECR Repositories

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create repositories
aws ecr create-repository --repository-name tour-blog-backend --region us-east-1
aws ecr create-repository --repository-name tour-blog-frontend --region us-east-1
```

### Step 3: Build and Push Docker Images

**Backend**:
```bash
cd server
docker build -t tour-blog-backend .
docker tag tour-blog-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tour-blog-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tour-blog-backend:latest
```

**Frontend**:
```bash
cd client
docker build -t tour-blog-frontend .
docker tag tour-blog-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tour-blog-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tour-blog-frontend:latest
```

### Step 4: Create ECS Cluster

1. Go to ECS Console
2. Create cluster: `tour-blog-cluster`
3. Infrastructure: AWS Fargate
4. Configure networking with VPC

### Step 5: Create Task Definitions

**Backend Task Definition**:
```json
{
  "family": "tour-blog-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tour-blog-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DB_HOST",
          "value": "your-rds-endpoint.c9akciq32.us-east-1.rds.amazonaws.com"
        },
        {
          "name": "DB_PORT",
          "value": "3306"
        },
        {
          "name": "DB_NAME",
          "value": "sri_lanka_travel"
        }
      ],
      "secrets": [
        {
          "name": "DB_USER",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:tour-blog-db-user"
        },
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:tour-blog-db-pass"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/tour-blog-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
>>>>>>> 1c5c3c855d19bc5036dfc5a4db7234b54e6557af
    }
  ]
}
```

<<<<<<< HEAD
### 3.5 Upload Files to S3

```bash
# Via AWS CLI:
aws s3 sync ./dist s3://tour-blog-frontend --delete

# Or via AWS Console:
# Upload all files from the dist folder
```

### 3.6 Setup CloudFront Distribution

```bash
# Via AWS Console:
1. Go to CloudFront Dashboard
2. Click "Create Distribution"
3. Configure:
   - Origin domain: tour-blog-frontend.s3.us-east-1.amazonaws.com
   - Origin path: (leave empty)
   - Origin access: Legacy access identities
   - Create new OAI
   - Yes, update bucket policy
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Allowed HTTP methods: GET, HEAD, OPTIONS
   - Cache policy: CachingOptimized
   - Default root object: index.html
4. Create distribution
5. Wait 15-20 minutes for deployment
```

### 3.7 Configure CloudFront Error Pages

```bash
# In CloudFront distribution:
1. Go to Error Pages tab
2. Create custom error response:
   - HTTP error code: 403
   - Response page path: /index.html
   - HTTP response code: 200
3. Repeat for error code 404
```

### 3.8 Update Backend CORS

```bash
# Update server/.env
FRONTEND_URL=https://d111111abcdef8.cloudfront.net

# Update server.js CORS origin
=======
### Step 6: Create Services

1. Create ECS Service from task definition
2. Set desired count: 2 (for HA)
3. Configure Load Balancer (ALB)
4. Set up Auto Scaling policies

### Step 7: Configure S3 for Frontend

```bash
aws s3 mb s3://tour-blog-frontend --region us-east-1
aws s3 cp client/dist s3://tour-blog-frontend --recursive --include "*"
```

### Step 8: Setup CloudFront

1. Go to CloudFront Console
2. Create distribution
3. Origin: S3 bucket for frontend
4. Alternate domain: yourdomain.com
5. Request SSL certificate from ACM

---

## Option 3: EC2 + Manual Setup

**Pros**: Full control, simple single-instance setup  
**Cons**: Manual management, no auto-scaling

### Step 1: Launch EC2 Instance

```bash
# AWS Console → EC2 → Instances → Launch Instance
# AMI: Ubuntu 22.04 LTS
# Instance type: t3.small or t3.medium
# Storage: 30 GB GP3
# Security Group: Allow ports 22, 80, 443
```

### Step 2: Connect and Setup Server

```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx for reverse proxy
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 3: Clone and Configure Application

```bash
git clone your-repo-url
cd tour_blog_info_final

# Create .env file
cat > server/.env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_NAME=sri_lanka_travel
DB_USER=tourblog_user
DB_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret
EOF

# Create MySQL data directory
mkdir -p ./mysql_data
sudo chown 999:999 ./mysql_data
```

### Step 4: Start Services

```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

### Step 5: Configure Nginx Reverse Proxy

```bash
sudo tee /etc/nginx/sites-available/tour-blog > /dev/null << EOF
upstream backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name your-domain.com www.your-domain.com;
  
  # Frontend
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
  
  # API
  location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF

sudo ln -s /etc/nginx/sites-available/tour-blog /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
>>>>>>> 1c5c3c855d19bc5036dfc5a4db7234b54e6557af
```

---

<<<<<<< HEAD
## 📦 Step 4: Setup S3 for Image Uploads

### 4.1 Create S3 Bucket for Images

```bash
1. Create new bucket: tour-blog-uploads
2. Enable public access for uploaded images
3. Add CORS configuration:
```

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 4.2 Update Backend to Use S3

Install AWS SDK:
```bash
# On EC2:
cd /home/ubuntu/tour-blog/server
npm install @aws-sdk/client-s3 multer-s3
```

Update `server/middleware/uploadMiddleware.js`:
```javascript
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
=======
## Common Setup Steps

### 1. Database Initialization

```bash
# SSH into database server or use MySQL client
mysql -h your-rds-endpoint.amazonaws.com -u admin -p

# Run initialization script
source server/setupNewDatabase.js
```

### 2. Environment Variables Management

For production, store secrets in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name tour-blog-db-password \
  --secret-string 'your-secure-password'
```

### 3. File Upload Storage

For persistent uploads, use S3:

1. Create S3 bucket: `tour-blog-uploads`
2. Update backend to use AWS SDK:

```bash
npm install aws-sdk --save
```

Modify `uploadMiddleware.js` to use S3:

```javascript
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
>>>>>>> 1c5c3c855d19bc5036dfc5a4db7234b54e6557af
});

const upload = multer({
  storage: multerS3({
<<<<<<< HEAD
    s3: s3Client,
    bucket: 'tour-blog-uploads',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Images only!'));
  }
});

module.exports = { upload };
```

### 4.3 Create IAM User for S3 Access

```bash
1. Go to IAM Dashboard
2. Create new user: tour-blog-s3-user
3. Attach policy: AmazonS3FullAccess
4. Create access keys
5. Save Access Key ID and Secret Access Key
6. Add to EC2 .env file:
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
```

---

## 🔒 Step 5: Security Enhancements

### 5.1 Restrict RDS Access

```bash
# Update RDS Security Group:
- Remove "Your IP" rule
- Add rule: Source = EC2 Security Group ID
```

### 5.2 Setup AWS WAF (Optional)

```bash
1. Go to AWS WAF Dashboard
2. Create Web ACL
3. Attach to CloudFront distribution
4. Add rules:
   - AWS managed rules - Core rule set
   - AWS managed rules - Known bad inputs
   - Rate limiting (1000 requests per 5 minutes)
```

### 5.3 Enable CloudWatch Monitoring

```bash
# On EC2:
sudo apt install -y amazon-cloudwatch-agent

# Configure monitoring
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

---

## 🚀 Step 6: Deployment Workflow

### 6.1 Frontend Updates

```bash
# On local machine:
cd client
npm run build
aws s3 sync ./dist s3://tour-blog-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 6.2 Backend Updates

```bash
# SSH to EC2
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# Pull latest changes
cd /home/ubuntu/tour-blog/server
git pull

# Install any new dependencies
npm install

# Restart application
pm2 restart tour-blog-api

# Check logs
pm2 logs tour-blog-api
```

---

## 💰 Cost Estimates

### With Free Tier (First 12 months):
- **EC2 t2.micro**: FREE (750 hours/month)
- **RDS db.t3.micro**: FREE (750 hours/month)
- **S3**: FREE (5GB storage, 20,000 GET requests)
- **CloudFront**: FREE (1TB data transfer out)
- **Total**: ~$5-10/month (data transfer overages)

### After Free Tier:
- **EC2 t2.small**: ~$17/month
- **RDS db.t3.micro**: ~$15/month
- **S3**: ~$0.23/month (10GB)
- **CloudFront**: ~$1/month (10GB transfer)
- **Route 53**: ~$0.50/month
- **Total**: ~$35-40/month

---

## 🔧 Alternative: Use AWS Amplify (Easier)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize in your project
cd client
amplify init

# Add hosting
amplify add hosting
# Choose: Hosting with Amplify Console
# Choose: Manual deployment

# Deploy
amplify publish
```

**Amplify handles:**
- Automatic builds
- CDN distribution
- SSL certificates
- CI/CD pipeline
- Easy updates

---

## 📝 Post-Deployment Checklist

- [ ] RDS database created and accessible
- [ ] EC2 instance running with Node.js app
- [ ] PM2 configured to restart on reboot
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed
- [ ] S3 bucket created for frontend
- [ ] CloudFront distribution deployed
- [ ] DNS configured (if using custom domain)
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Image uploads working
- [ ] Database migrations run
- [ ] Application tested end-to-end
- [ ] Monitoring enabled
- [ ] Backups configured

---

## 🆘 Troubleshooting

### Backend not connecting to RDS
```bash
# Test connection from EC2
mysql -h your-rds-endpoint -P 3306 -u admin -p

# Check security groups
# Ensure EC2 can reach RDS
```

### Frontend API calls failing
```bash
# Check CORS settings in backend
# Verify API URL in frontend
# Check browser console for errors
```

### Images not uploading
```bash
# Check S3 permissions
# Verify IAM credentials
# Check bucket CORS policy
```

### PM2 not restarting on reboot
```bash
pm2 startup
pm2 save
sudo reboot
```

---

## 📚 Additional Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## 🎯 Quick Start Checklist

1. ✅ Create AWS account
2. ✅ Setup RDS MySQL database
3. ✅ Launch EC2 instance
4. ✅ Install Node.js and deploy backend
5. ✅ Build frontend
6. ✅ Create S3 bucket
7. ✅ Setup CloudFront distribution
8. ✅ Update environment variables
9. ✅ Test application
10. ✅ Configure monitoring

**Estimated Setup Time**: 2-3 hours

Need help? Check AWS documentation or consider using AWS Amplify for automated deployment!
=======
    s3: s3,
    bucket: 'tour-blog-uploads',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

module.exports = upload;
```

### 4. SSL/HTTPS Setup

- Use AWS Certificate Manager (ACM) for free SSL certificates
- Configure ALB or CloudFront to use SSL
- Redirect HTTP to HTTPS

### 5. Monitoring and Logging

```bash
# CloudWatch Logs
# Set up log groups for:
# - /aws/ecs/tour-blog-backend
# - /aws/ecs/tour-blog-frontend
# - /aws/rds/sri_lanka_travel

# CloudWatch Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name tour-blog-cpu-high \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### 6. Backup Strategy

- RDS: Enable automated backups (7-35 days)
- S3: Enable versioning and cross-region replication
- CodeCommit/GitHub: Regular git commits

### 7. Domain Configuration

1. Register domain (Route 53 or external)
2. Point nameservers to Route 53
3. Create Route 53 hosted zone
4. Add A record pointing to ALB or CloudFront

---

## Troubleshooting

### Application won't start

```bash
# Check logs
docker logs tourblog_backend
docker logs tourblog_mysql

# Verify environment variables
echo $NODE_ENV
echo $DB_HOST
```

### Database connection failing

```bash
# Test MySQL connection
mysql -h your-rds-endpoint.amazonaws.com -u admin -p -e "SELECT 1"

# Check security group rules
# Ensure RDS security group allows port 3306 from app security group
```

### Uploads not persisting

- Ensure uploads directory is on persistent storage (EBS, S3, or EFS)
- Check file permissions: `chmod 755 uploads/`
- Use S3 for uploads instead of local filesystem

### High costs

- Use smaller instance types (t3.micro, t3.small)
- Enable auto-scaling to turn off unused instances
- Review CloudWatch metrics for idle resources
- Use Reserved Instances for long-term deployments

### Performance issues

- Check RDS CPU and connections
- Implement caching (Redis/ElastiCache)
- Enable CloudFront for static assets
- Optimize database queries

---

## Cost Estimation (Monthly, us-east-1)

| Component | Tier | Cost |
|-----------|------|------|
| EC2 t3.small | 1 instance | $8.00 |
| RDS t3.micro MySQL | 1 instance | $15.00 |
| EBS Storage | 30 GB | $3.00 |
| Data Transfer | 100 GB/month | $9.00 |
| Route 53 | 1 hosted zone | $0.50 |
| **Total** | | **$35.50** |

---

## Next Steps

1. Choose deployment option (Elastic Beanstalk recommended for beginners)
2. Set up AWS account and configure IAM permissions
3. Prepare application code and environment variables
4. Create database and necessary AWS resources
5. Deploy application
6. Setup monitoring and backups
7. Configure domain and SSL
8. Test thoroughly before production

---

## Support & Resources

- AWS Documentation: https://docs.aws.amazon.com/
- Docker Documentation: https://docs.docker.com/
- Node.js Best Practices: https://nodejs.org/en/docs/guides/
- React Deployment: https://create-react-app.dev/deployment/
>>>>>>> 1c5c3c855d19bc5036dfc5a4db7234b54e6557af
