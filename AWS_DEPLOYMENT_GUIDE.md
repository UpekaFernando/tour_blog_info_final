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
```

---

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
```

---

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
    }
  ]
}
```

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
```

---

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
});

const upload = multer({
  storage: multerS3({
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
