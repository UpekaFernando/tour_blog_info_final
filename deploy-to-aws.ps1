# AWS Deployment Script for Tour Blog
# Run this from PowerShell

$env:Path = "C:\Program Files\Amazon\AWSCLIV2;" + $env:Path

Write-Host "=== Tour Blog AWS Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Variables
$EC2_IP = "13.218.231.9"
$KEY_FILE = "$env:USERPROFILE\Downloads\tour-blog-key.pem"
$SERVER_PATH = ".\server"

Write-Host "EC2 Instance IP: $EC2_IP" -ForegroundColor Yellow
Write-Host "SSH Key: $KEY_FILE" -ForegroundColor Yellow
Write-Host ""

# Step 1: Create server archive (excluding node_modules)
Write-Host "Step 1: Creating server archive..." -ForegroundColor Cyan
if (Test-Path ".\server-deploy.zip") {
    Remove-Item ".\server-deploy.zip"
}

# Create a temporary folder
$tempDir = ".\temp-server-deploy"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy server files (excluding node_modules and uploads)
Write-Host "Copying server files..." -ForegroundColor Yellow
Copy-Item -Path "$SERVER_PATH\*" -Destination $tempDir -Recurse -Exclude @("node_modules", "uploads", ".env")

# Create .env file for production
Write-Host "Creating production .env file..." -ForegroundColor Yellow
@"
NODE_ENV=production
PORT=5000

# RDS Database
DB_HOST=tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tour_blog
DB_USER=admin
DB_PASSWORD=UpekaF1740733#

# JWT Secret
JWT_SECRET=tour_blog_super_secret_jwt_key_production_2026_secure_min_32_chars

# Weather API Key
WEATHER_API_KEY=

# Frontend URL (will update after S3 deployment)
FRONTEND_URL=http://$EC2_IP:5000
"@ | Out-File -FilePath "$tempDir\.env" -Encoding ASCII

# Compress
Write-Host "Compressing files..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\*" -DestinationPath ".\server-deploy.zip" -Force

# Cleanup temp
Remove-Item -Recurse -Force $tempDir

Write-Host "✅ Server archive created: server-deploy.zip" -ForegroundColor Green
Write-Host ""

# Step 2: Instructions for manual deployment (SSH required)
Write-Host "Step 2: Deploy to EC2" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy your server, you need to:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option A: Use SCP (if you have OpenSSH)" -ForegroundColor White
Write-Host "Run these commands:" -ForegroundColor Gray
Write-Host "  scp -i `"$KEY_FILE`" .\server-deploy.zip ubuntu@${EC2_IP}:/home/ubuntu/" -ForegroundColor Gray
Write-Host ""
Write-Host "Option B: Use PuTTY/WinSCP" -ForegroundColor White
Write-Host "1. Download WinSCP from https://winscp.net/" -ForegroundColor Gray
Write-Host "2. Convert .pem to .ppk using PuTTYgen" -ForegroundColor Gray
Write-Host "3. Upload server-deploy.zip to /home/ubuntu/" -ForegroundColor Gray
Write-Host ""
Write-Host "Option C: Use AWS Session Manager (No key needed)" -ForegroundColor White
Write-Host "  aws ssm start-session --target i-0d803531ceb56a45b" -ForegroundColor Gray
Write-Host ""

# Step 3: SSH Commands to run on EC2
Write-Host "Step 3: Run these commands on EC2 (via SSH):" -ForegroundColor Cyan
Write-Host ""
$sshCommands = @"
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
"@

Write-Host $sshCommands -ForegroundColor Gray
Write-Host ""

# Save commands to file
$sshCommands | Out-File -FilePath ".\ec2-setup-commands.sh" -Encoding ASCII
Write-Host "✅ Commands saved to: ec2-setup-commands.sh" -ForegroundColor Green
Write-Host ""

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✅ Database: tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com" -ForegroundColor Green
Write-Host "✅ EC2 Instance: $EC2_IP" -ForegroundColor Green
Write-Host "✅ Server archive: server-deploy.zip" -ForegroundColor Green
Write-Host ""
Write-Host "Next: SSH into EC2 and run the setup commands!" -ForegroundColor Yellow
Write-Host "SSH: ssh -i `"$KEY_FILE`" ubuntu@$EC2_IP" -ForegroundColor Yellow
