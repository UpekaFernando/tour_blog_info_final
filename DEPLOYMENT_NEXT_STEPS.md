# 🚀 AWS Deployment - Next Steps

## ✅ What's Done

1. **RDS MySQL Database** - Created and running
   - Endpoint: `tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com`
   - Username: `admin`
   - Password: `UpekaF1740733#`
   - Database: `tour_blog`

2. **EC2 Instance** - Running
   - IP Address: `13.218.231.9`
   - Instance ID: `i-0d803531ceb56a45b`
   - SSH Key: `C:\Users\Upeka\Downloads\tour-blog-key.pem`

3. **Server Files** - Packaged
   - File: `server-deploy.zip`
   - Uploaded to S3: `tour-blog-deploy-446654353`

---

## 📝 What You Need to Do Next

### Step 1: Connect to EC2 Instance

**Option A: Using Windows PowerShell with OpenSSH**

```powershell
# Test if SSH is available
ssh -V

# If available, connect:
ssh -i "C:\Users\Upeka\Downloads\tour-blog-key.pem" ubuntu@13.218.231.9
```

**Option B: Using WSL (Windows Subsystem for Linux)**

```bash
wsl
cp /mnt/c/Users/Upeka/Downloads/tour-blog-key.pem ~/
chmod 400 ~/tour-blog-key.pem
ssh -i ~/tour-blog-key.pem ubuntu@13.218.231.9
```

**Option C: Using PuTTY (Windows SSH Client)**

1. Download PuTTY: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html
2. Download PuTTYgen (included with PuTTY)
3. Convert `.pem` to `.ppk`:
   - Open PuTTYgen
   - Load `tour-blog-key.pem`
   - Save private key as `tour-blog-key.ppk`
4. Open PuTTY:
   - Host: `ubuntu@13.218.231.9`
   - Port: `22`
   - Connection > SSH > Auth > Private key file: Browse to `tour-blog-key.ppk`
   - Click "Open"

---

### Step 2: Once Connected to EC2, Run These Commands

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js
node --version
npm --version

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install unzip and AWS CLI
sudo apt install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Download server files from S3
cd /home/ubuntu
aws s3 cp s3://tour-blog-deploy-446654353/server-deploy.zip . --no-sign-request --region us-east-1

# Extract files
mkdir -p /home/ubuntu/tour-blog
cd /home/ubuntu/tour-blog
unzip -o /home/ubuntu/server-deploy.zip -d server
cd server

# Install dependencies
npm install --production

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Initialize database (creates tables)
node createDatabase.js

# Start the application
pm2 start server.js --name tour-blog-api

# Configure PM2 to start on boot
pm2 startup
# Run the command it outputs (starts with 'sudo env PATH=...')

pm2 save

# Check status
pm2 status
pm2 logs tour-blog-api
```

---

### Step 3: Test Backend API

Once the server is running, test it:

```bash
# From EC2 instance:
curl http://localhost:5000/api/health

# From your local machine:
curl http://13.218.231.9:5000/api/health
```

You should see a response from your API!

---

## 🎯 Next Steps After Backend is Running

### Deploy Frontend to S3 + CloudFront

Once your backend is confirmed working, we'll:

1. Build the React frontend
2. Create an S3 bucket for static hosting
3. Upload built files to S3
4. Set up CloudFront CDN
5. Update frontend to use EC2 backend URL

---

## 🛠️ Troubleshooting

### Can't SSH to EC2?

```powershell
# Check if instance is running
$env:Path = "C:\Program Files\Amazon\AWSCLIV2;" + $env:Path
aws ec2 describe-instances --instance-ids i-0d803531ceb56a45b --query "Reservations[0].Instances[0].State.Name"

# Should return "running"
```

### Check Security Group

```powershell
# Verify port 22 (SSH) is open
aws ec2 describe-security-groups --group-ids sg-08d4c1991878c35be --query "SecurityGroups[0].IpPermissions"
```

### PM2 Commands (on EC2)

```bash
# View logs
pm2 logs tour-blog-api

# Restart app
pm2 restart tour-blog-api

# Stop app
pm2 stop tour-blog-api

# List all processes
pm2 list

# Delete process
pm2 delete tour-blog-api
```

---

## 📊 Current Architecture

```
Your Computer
     ↓
EC2 Instance (13.218.231.9)
     ├── Node.js/Express API (Port 5000)
     └── PM2 Process Manager
         ↓
RDS MySQL Database
     └── tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com
```

---

## 💡 Quick Commands Reference

```powershell
# Set AWS CLI path (run in every new PowerShell)
$env:Path = "C:\Program Files\Amazon\AWSCLIV2;" + $env:Path

# Check EC2 status
aws ec2 describe-instances --instance-ids i-0d803531ceb56a45b --query "Reservations[0].Instances[0].[State.Name,PublicIpAddress]"

# Check RDS status
aws rds describe-db-instances --db-instance-identifier tour-blog-db --query "DBInstances[0].[DBInstanceStatus,Endpoint.Address]"

# SSH to EC2
ssh -i "C:\Users\Upeka\Downloads\tour-blog-key.pem" ubuntu@13.218.231.9
```

---

## 🎉 When Backend is Working

Come back and I'll help you:
1. Build and deploy the React frontend to S3
2. Set up CloudFront for HTTPS
3. Configure custom domain (optional)
4. Set up CI/CD for automatic deployments

**Let me know once you've SSH'd into the EC2 instance and need help with the commands!**
