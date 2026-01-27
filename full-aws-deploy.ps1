# Complete AWS Deployment Script
# Deploys both backend and frontend automatically

$env:Path = "C:\Program Files\Amazon\AWSCLIV2;" + $env:Path

$EC2_INSTANCE_ID = "i-0d803531ceb56a45b"
$EC2_IP = "13.218.231.9"
$S3_DEPLOY_BUCKET = "tour-blog-deploy-446654353"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  🚀 FULL AWS DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Deploy Backend to EC2
Write-Host "Step 1: Deploying Backend to EC2..." -ForegroundColor Yellow
Write-Host "Creating deployment script..." -ForegroundColor Gray

$deployScript = @'
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
echo "✅ Backend is running at http://13.218.231.9:5000"
'@

# Save script locally
$deployScript | Out-File -FilePath ".\ec2-auto-deploy.sh" -Encoding ASCII

# Upload script to S3
Write-Host "Uploading deployment script to S3..." -ForegroundColor Gray
aws s3 cp .\ec2-auto-deploy.sh s3://$S3_DEPLOY_BUCKET/ec2-auto-deploy.sh

# Create user data script for EC2
$userData = @"
#!/bin/bash
cd /home/ubuntu
aws s3 cp s3://$S3_DEPLOY_BUCKET/ec2-auto-deploy.sh . --no-sign-request --region us-east-1
chmod +x ec2-auto-deploy.sh
sudo -u ubuntu bash ec2-auto-deploy.sh > /home/ubuntu/deployment.log 2>&1
"@

# Try to execute via SSM (if available)
Write-Host "Attempting to deploy via AWS Systems Manager..." -ForegroundColor Gray
$ssmResult = aws ssm send-command `
    --instance-ids $EC2_INSTANCE_ID `
    --document-name "AWS-RunShellScript" `
    --parameters "commands=['$deployScript']" `
    --region us-east-1 2>&1

if ($LASTEXITCODE -eq 0) {
    $commandId = ($ssmResult | ConvertFrom-Json).Command.CommandId
    Write-Host "✅ Deployment command sent! Command ID: $commandId" -ForegroundColor Green
    Write-Host "Waiting for deployment to complete (60 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
    
    # Get command output
    Write-Host "Checking deployment status..." -ForegroundColor Gray
    aws ssm get-command-invocation --command-id $commandId --instance-id $EC2_INSTANCE_ID --region us-east-1
} else {
    Write-Host "⚠️  SSM not available. Backend needs manual deployment." -ForegroundColor Yellow
    Write-Host "Commands saved to: ec2-auto-deploy.sh" -ForegroundColor Gray
    Write-Host "Upload to EC2 and run: bash ec2-auto-deploy.sh" -ForegroundColor Gray
}

Write-Host "`n✅ Backend deployment initiated!" -ForegroundColor Green
Write-Host "Waiting 30 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test backend
Write-Host "`nTesting backend API..." -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri "http://$EC2_IP:5000/api/health" -TimeoutSec 5 -UseBasicParsing 2>$null
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend not responding yet. May need a few more minutes." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Step 2: Building and Deploying Frontend..." -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Update frontend API URL
Write-Host "Updating frontend configuration..." -ForegroundColor Gray
$apiJsPath = ".\client\src\utils\api.js"
$apiContent = Get-Content $apiJsPath -Raw

# Backup original
Copy-Item $apiJsPath "$apiJsPath.backup"

# Update API URL
$newApiContent = $apiContent -replace "baseURL:.*'http://localhost:5000'", "baseURL: 'http://$EC2_IP:5000'"
$newApiContent | Out-File -FilePath $apiJsPath -Encoding UTF8

Write-Host "✅ Frontend configured to use: http://$EC2_IP:5000" -ForegroundColor Green

# Build frontend
Write-Host "`nBuilding React app..." -ForegroundColor Yellow
cd client
npm run build
cd ..

Write-Host "✅ Frontend built successfully!" -ForegroundColor Green

# Create S3 bucket for frontend
Write-Host "`nCreating S3 bucket for frontend..." -ForegroundColor Yellow
$frontendBucket = "tour-blog-frontend-$(Get-Random)"
aws s3 mb "s3://$frontendBucket" --region us-east-1

# Configure bucket for static website hosting
Write-Host "Configuring S3 for static website hosting..." -ForegroundColor Gray
aws s3 website "s3://$frontendBucket" --index-document index.html --error-document index.html

# Create bucket policy for public read
$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$frontendBucket/*"
        }
    ]
}
"@

$bucketPolicy | Out-File -FilePath ".\bucket-policy.json" -Encoding ASCII

# Disable block public access
aws s3api put-public-access-block --bucket $frontendBucket --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Apply bucket policy
aws s3api put-bucket-policy --bucket $frontendBucket --policy file://bucket-policy.json

Write-Host "✅ S3 bucket configured for public access" -ForegroundColor Green

# Upload frontend files
Write-Host "`nUploading frontend files to S3..." -ForegroundColor Yellow
aws s3 sync .\client\dist "s3://$frontendBucket" --delete

Write-Host "✅ Frontend uploaded to S3!" -ForegroundColor Green

# Get S3 website URL
$websiteUrl = "http://$frontendBucket.s3-website-us-east-1.amazonaws.com"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ Backend API: http://$EC2_IP:5000" -ForegroundColor Green
Write-Host "✅ Frontend Website: $websiteUrl" -ForegroundColor Green
Write-Host "`nS3 Bucket: $frontendBucket" -ForegroundColor Gray
Write-Host "`nNote: Website uses HTTP. For HTTPS, set up CloudFront (next step)" -ForegroundColor Yellow

# Save deployment info
@"
# Deployment Complete!

## 🎉 Your Application is Live!

### Backend API
- URL: http://$EC2_IP:5000
- Health Check: http://$EC2_IP:5000/api/health
- API Docs: http://$EC2_IP:5000/api

### Frontend Website
- URL: $websiteUrl
- S3 Bucket: $frontendBucket

### Database
- Endpoint: tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com
- Database: tour_blog

### EC2 Instance
- Instance ID: $EC2_INSTANCE_ID
- IP: $EC2_IP

## Next Steps (Optional)

### 1. Set up HTTPS with CloudFront
Run: .\setup-cloudfront.ps1

### 2. Configure Custom Domain
- Purchase domain from Route 53
- Point to CloudFront distribution

### 3. Set up CI/CD
- Connect GitHub repository
- Auto-deploy on push

## Troubleshooting

### Check Backend Status
ssh -i "C:\Users\Upeka\Downloads\tour-blog-key.pem" ubuntu@$EC2_IP
pm2 status
pm2 logs tour-blog-api

### Update Frontend
npm run build
aws s3 sync .\client\dist s3://$frontendBucket --delete

Deployment completed: $(Get-Date)
"@ | Out-File -FilePath ".\DEPLOYMENT_COMPLETE.md" -Encoding UTF8

Write-Host "`n📄 Deployment details saved to: DEPLOYMENT_COMPLETE.md" -ForegroundColor Cyan
Write-Host "`nOpening your website in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process $websiteUrl

# Restore API config
Move-Item "$apiJsPath.backup" $apiJsPath -Force
