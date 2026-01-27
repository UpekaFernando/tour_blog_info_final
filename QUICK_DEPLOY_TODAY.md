# Deploy to AWS TODAY - Quick Start Guide

**Estimated Time**: 1-2 hours to get your app live!

---

## 🚀 Step-by-Step: Deploy in 60 Minutes

### Prerequisites (5 minutes)
- [ ] AWS Account created
- [ ] Credit card added to AWS (for billing)
- [ ] GitHub repo accessible

---

## PHASE 1: Create AWS EC2 Instance (15 minutes)

### Step 1: Login to AWS Console
1. Go to https://console.aws.amazon.com
2. Login with your credentials
3. Select region: **us-east-1** (top right)

### Step 2: Launch EC2 Instance

1. **Navigate to EC2**:
   - Search for "EC2" in the top search bar
   - Click "EC2" service

2. **Click "Launch Instance"** (orange button)

3. **Configure Instance**:
   ```
   Name: tour-blog-server
   
   Application and OS Images (AMI):
   ✓ Ubuntu Server 22.04 LTS (Free tier eligible)
   
   Instance type:
   ✓ t3.small (Select from dropdown)
   
   Key pair (login):
   ✓ Click "Create new key pair"
   ✓ Name: tour-blog-key
   ✓ Type: RSA
   ✓ Format: .pem (for Mac/Linux) or .ppk (for Windows)
   ✓ Download and save it securely!
   
   Network settings:
   ✓ Click "Edit"
   ✓ Auto-assign public IP: Enable
   ✓ Create security group: tour-blog-sg
   ✓ Add rules:
      - SSH (port 22) - Source: My IP
      - HTTP (port 80) - Source: Anywhere (0.0.0.0/0)
      - HTTPS (port 443) - Source: Anywhere (0.0.0.0/0)
      - Custom TCP (port 5000) - Source: Anywhere (0.0.0.0/0)
   
   Configure storage:
   ✓ 30 GB gp3
   
   Advanced details:
   ✓ Leave as default
   ```

4. **Click "Launch Instance"** (orange button)

5. **Wait 2-3 minutes** for instance to start

6. **Note down**:
   - Public IPv4 address (e.g., 52.201.123.45)
   - Instance ID

---

## PHASE 2: Connect to Your Server (5 minutes)

### For Mac/Linux:

```bash
# Move key to safe location
mv ~/Downloads/tour-blog-key.pem ~/.ssh/
chmod 400 ~/.ssh/tour-blog-key.pem

# Connect (replace with YOUR IP)
ssh -i ~/.ssh/tour-blog-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### For Windows (Using PowerShell):

```powershell
# Connect (replace with YOUR IP)
ssh -i C:\path\to\tour-blog-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**You should see**: `ubuntu@ip-xxx-xxx-xxx-xxx:~$`

---

## PHASE 3: Install Software (10 minutes)

Run these commands on your EC2 instance:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Verify installations
node --version    # Should show v18.x.x
docker --version  # Should show Docker version
nginx --version   # Should show nginx version

# IMPORTANT: Logout and login again for Docker permissions
exit
```

**Reconnect to server**:
```bash
ssh -i ~/.ssh/tour-blog-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## PHASE 4: Deploy Your Application (20 minutes)

### Step 1: Clone Your Repository

```bash
cd ~
git clone https://github.com/UpekaFernando/tour_blog_info_final.git
cd tour_blog_info_final
```

### Step 2: Configure Environment Variables

```bash
# Create production .env file
cat > server/.env << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_NAME=sri_lanka_travel
DB_USER=tourblog_user
DB_PASSWORD=StrongPassword123!
JWT_SECRET=your-super-secret-jwt-key-change-this-now-123456789
EOF
```

**⚠️ IMPORTANT**: Change the JWT_SECRET to something random!

Generate a random JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update your .env file:
```bash
nano server/.env
# Update JWT_SECRET with the random string
# Press Ctrl+X, then Y, then Enter to save
```

### Step 3: Update docker-compose for Production

```bash
# Edit docker-compose.prod.yml
nano docker-compose.prod.yml
```

Update the passwords in the file:
- Change `MYSQL_ROOT_PASSWORD`
- Change `MYSQL_PASSWORD`
- Change `DB_PASSWORD`
- Change `JWT_SECRET`

### Step 4: Start Docker Containers

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# This will:
# - Download MySQL image
# - Download your backend/frontend images
# - Start MySQL database
# - Start backend server
# - Start frontend server

# Wait 2-3 minutes for containers to start

# Check status
docker-compose -f docker-compose.prod.yml ps

# You should see:
# - tourblog_mysql (healthy)
# - tourblog_backend (Up)
# - tourblog_frontend (Up)
```

### Step 5: Initialize Database

```bash
# Access MySQL container
docker exec -it tourblog_mysql mysql -uroot -proot sri_lanka_travel

# If you have seed data, run:
docker exec -it tourblog_backend node seed.js
```

### Step 6: Test Backend

```bash
# Test API
curl http://localhost:5000/api/destinations

# Should return JSON data or empty array
```

---

## PHASE 5: Configure Nginx Reverse Proxy (10 minutes)

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/tour-blog > /dev/null << 'EOF'
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads/ {
        proxy_pass http://backend;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/tour-blog /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If OK, restart Nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## PHASE 6: Test Your Deployment (5 minutes)

### From Your Local Machine:

```bash
# Replace with YOUR EC2 public IP
curl http://YOUR_EC2_PUBLIC_IP

# Should return HTML

curl http://YOUR_EC2_PUBLIC_IP/api/destinations

# Should return JSON
```

### In Your Browser:

1. Open: `http://YOUR_EC2_PUBLIC_IP`
2. You should see your Tour Blog homepage!
3. Test navigation, login, etc.

---

## 🎉 YOUR APP IS LIVE!

**Your app is now accessible at**: `http://YOUR_EC2_PUBLIC_IP`

---

## What's Next? (Optional, but recommended)

### 1. Setup Domain Name (Later today or tomorrow)

1. Buy domain from:
   - Namecheap ($8-12/year)
   - GoDaddy
   - Google Domains
   - AWS Route 53

2. Point domain to EC2:
   - Create A record
   - Value: Your EC2 public IP
   - Wait 5-30 minutes for DNS propagation

### 2. Setup HTTPS/SSL (After domain is setup)

```bash
# SSH into your server
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts
# Certificate auto-renews every 90 days
```

### 3. Setup Automatic Backups

```bash
# Create backup script
cat > ~/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec tourblog_mysql mysqldump -uroot -proot sri_lanka_travel > ~/backup_$DATE.sql
# Keep only last 7 backups
ls -t ~/backup_*.sql | tail -n +8 | xargs rm -f
EOF

chmod +x ~/backup.sh

# Run daily at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup.sh") | crontab -
```

### 4. Setup Monitoring

```bash
# Install htop for monitoring
sudo apt install -y htop

# Check resources
htop

# Check Docker logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f mysql
```

---

## Troubleshooting

### Problem: Cannot connect to EC2
```bash
# Check security group allows SSH from your IP
# Check you're using correct key file
# Check key permissions: chmod 400 key.pem
```

### Problem: Docker containers not starting
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Rebuild if needed
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Problem: "502 Bad Gateway" from Nginx
```bash
# Check backend is running
docker ps
curl localhost:5000/api/destinations

# Check Nginx config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Problem: Database connection error
```bash
# Check MySQL is running
docker exec -it tourblog_mysql mysql -uroot -proot -e "SELECT 1"

# Check backend can connect
docker exec -it tourblog_backend node -e "
const db = require('./config/database.js');
db.authenticate().then(() => console.log('✅ Connected')).catch(e => console.log('❌', e.message))
"
```

### Problem: Frontend shows blank page
```bash
# Check frontend container
docker logs tourblog_frontend

# Rebuild frontend
cd ~/tour_blog_info_final
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

---

## Cost Breakdown

| Item | Cost/Month |
|------|------------|
| EC2 t3.small | $15 |
| EBS 30GB | $3 |
| Data Transfer | ~$1 |
| **Total** | **~$19/month** |

**Note**: First month might be partially free with AWS Free Tier

---

## Support

If you get stuck:
1. Check the error message carefully
2. Review the troubleshooting section above
3. Check Docker logs: `docker-compose logs`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
5. Verify security group rules in AWS Console

---

## Summary of What You Did

✅ Created EC2 instance on AWS
✅ Installed Docker, Node.js, Nginx
✅ Deployed backend, frontend, and database
✅ Configured reverse proxy
✅ App is live and accessible!

**Your app URL**: `http://YOUR_EC2_PUBLIC_IP`

---

## Important Security Notes

🔒 **Before going to production**:
1. Change all default passwords
2. Setup SSL/HTTPS
3. Restrict SSH access to your IP only
4. Enable CloudWatch monitoring
5. Setup automated backups
6. Review security group rules

---

Good luck! Your app should be live within 1-2 hours! 🚀
