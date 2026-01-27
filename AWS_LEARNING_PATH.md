# AWS Deployment Learning Path for Tour Blog

A structured, hands-on learning journey from AWS basics to deploying your complete application.

---

## 📊 Recommended Learning Path

### Phase 1: AWS Fundamentals (2-3 days)
Learn the basic concepts before doing anything on your app.

### Phase 2: Core Services Deep Dive (3-4 days)
Understand the specific services you'll use.

### Phase 3: Hands-On Labs with Your App (5-7 days)
Apply knowledge to your tour blog step by step.

### Phase 4: Optimization & Production (3-5 days)
Make it production-ready.

---

## 📚 PHASE 1: AWS FUNDAMENTALS (2-3 days)

### Week 1, Day 1-2: Core Concepts

**Learning Objectives:**
- Understand AWS account structure
- Learn regions, availability zones, and VPCs
- Understand security groups and IAM
- Know the difference between IaaS, PaaS, SaaS

**Free Resources:**
1. **AWS Skill Builder** (Free tier available)
   - Course: "Getting Started with AWS"
   - Time: 4-6 hours
   - Link: https://skillbuilder.aws.com

2. **YouTube Tutorials**
   - Channel: "A Cloud Guru" (free content)
   - Video: "AWS Concepts Explained"
   - Time: 2-3 hours

3. **Interactive Learning**
   - AWS Free Tier: https://aws.amazon.com/free/
   - Create an account and explore the console
   - Time: 1-2 hours

**Key Concepts to Understand:**
```
AWS Account
├── Regions (us-east-1, eu-west-1, etc.)
│   └── Availability Zones (a, b, c)
│       ├── VPC (Virtual Private Cloud)
│       │   ├── EC2 (Compute)
│       │   ├── RDS (Database)
│       │   └── Security Groups (Firewall)
│       └── S3 (Object Storage)
├── IAM (Identity & Access Management)
└── CloudWatch (Monitoring)
```

**Practical Exercise 1: Explore AWS Console**
```
1. Create AWS account (free tier)
2. Enable MFA (Multi-Factor Authentication)
3. Create IAM user for yourself
4. Create security group for SSH access
5. Launch a free t2.micro EC2 instance
6. SSH into it and stop it
7. Estimated time: 1 hour
```

---

### Day 2-3: Networking & Security Basics

**Learning Objectives:**
- Understand VPC networking
- Learn how security groups work
- Know basic IAM permissions
- Understand SSL/HTTPS

**Key Concepts:**

```
Web Request Flow:
User Browser
    ↓ (HTTPS on port 443)
CloudFront (CDN) / ALB
    ↓ (port 80/443)
Security Group (allows traffic)
    ↓
EC2 Instance / ECS Container
    ↓
RDS MySQL (port 3306)
```

**Practical Exercise 2: Network Setup**
```
1. Create VPC with custom CIDR block (10.0.0.0/16)
2. Create 2 subnets (public & private)
3. Create Internet Gateway
4. Configure route tables
5. Create security groups for:
   - SSH access (port 22)
   - HTTP (port 80)
   - HTTPS (port 443)
   - MySQL (port 3306)
6. Understand why databases go in private subnets
7. Estimated time: 2 hours
```

**Study Material:**
- AWS Documentation: VPC Basics
- Diagram: Draw your network on paper
- Quiz: "What security group rules do I need?"

---

## 🎯 PHASE 2: CORE SERVICES DEEP DIVE (3-4 days)

### Day 1: EC2 (Virtual Machines)

**What You'll Learn:**
- EC2 instance types and sizes
- How to launch, connect, and manage instances
- Storage options (EBS, local storage)
- Pricing models (on-demand, spot, reserved)

**For Your App:** EC2 will run your backend Node.js server.

**Practical Exercise 3: Master EC2**
```
1. Launch t3.micro Ubuntu 22.04 instance
2. SSH using PuTTY or ssh command
3. Install Node.js and npm
4. Clone your repo
5. Start your backend server manually
6. Access it via curl from your local machine
7. Estimated time: 2 hours
```

**Key Commands to Practice:**
```bash
# List instances
aws ec2 describe-instances

# Start/stop instance
aws ec2 start-instances --instance-ids i-xxxxx
aws ec2 stop-instances --instance-ids i-xxxxx

# Connect
ssh -i key.pem ec2-user@public-ip
```

**Resource:**
- Video: "EC2 Basics" - TechWorld with Nana (30 min)
- AWS Docs: https://docs.aws.amazon.com/ec2/

---

### Day 2: RDS (Managed Database)

**What You'll Learn:**
- RDS vs. self-managed databases
- How to create RDS MySQL instance
- Backup and restore
- Security and encryption

**For Your App:** RDS will host your MySQL database.

**Practical Exercise 4: Setup RDS**
```
1. Create RDS MySQL 8.0 instance
2. Set master username/password
3. Choose db.t3.micro (free tier)
4. Create security group for database
5. Connect from your EC2 instance using MySQL client
6. Import your database schema
7. Test connection with credentials
8. Estimated time: 2 hours
```

**Key Concepts:**
```
RDS Features:
├── Automated Backups (point-in-time recovery)
├── Read Replicas (for scaling reads)
├── Multi-AZ (high availability)
├── Encryption (at rest & in transit)
└── Maintenance windows
```

**Resource:**
- Video: "RDS MySQL Setup" - Linux Academy (20 min)
- AWS Docs: https://docs.aws.amazon.com/rds/

---

### Day 3: S3 (Object Storage)

**What You'll Learn:**
- S3 buckets and objects
- Static website hosting
- File uploads and CDN
- Permissions and access control

**For Your App:** S3 will store user uploads instead of local filesystem.

**Practical Exercise 5: S3 Setup**
```
1. Create S3 bucket for static files
2. Create S3 bucket for file uploads
3. Upload a test file
4. Make files public using bucket policy
5. Enable versioning on uploads bucket
6. Configure lifecycle policies (archive old files)
7. Create signed URLs for private downloads
8. Estimated time: 2 hours
```

**Key Concepts:**
```
S3 Use Cases for Your App:
├── Static Website Hosting (React build)
├── User Upload Storage (images, documents)
├── Database Backups
├── Application Logs
└── Assets (CSS, JS, images)
```

**Resource:**
- Video: "S3 Complete Guide" - Stephane Maarek (1 hour)
- AWS Docs: https://docs.aws.amazon.com/s3/

---

### Day 4: CloudFront (CDN)

**What You'll Learn:**
- Content Delivery Networks (CDN)
- How CloudFront accelerates content
- Caching strategies
- SSL/TLS certificates

**For Your App:** CloudFront will serve your React frontend from edge locations worldwide.

**Practical Exercise 6: CloudFront Setup**
```
1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Create SSL certificate in ACM
4. Configure HTTPS
5. Set cache TTL for different file types
6. Test distribution with CloudFront URL
7. Point custom domain using CNAME
8. Estimated time: 1.5 hours
```

**Resource:**
- Video: "CloudFront Explained" - AWS in Plain English (15 min)
- AWS Docs: https://docs.aws.amazon.com/cloudfront/

---

## 💻 PHASE 3: HANDS-ON WITH YOUR APP (5-7 days)

### Day 1-2: Manual EC2 Deployment

**Goal:** Deploy your entire app on a single EC2 instance with everything running.

**Step-by-Step:**

**Step 1: Preparation**
```bash
# On your local machine
cd your-repo
git add .
git commit -m "Ready for AWS deployment"
git push origin main

# Update .gitignore to exclude:
# - node_modules
# - uploads (will use S3 instead)
# - .env (will create on server)
# - dist/
```

**Step 2: Launch EC2 Instance**
```bash
# AWS Console or CLI
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-groups web-server

# Cost: $9/month
```

**Step 3: Connect & Setup Server**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL client
sudo apt install -y mysql-client

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Verify installations
node --version
npm --version
mysql --version
nginx --version
```

**Step 4: Clone Your Repository**
```bash
git clone your-repo-url
cd tour_blog_info_final

# Create .env file
nano server/.env
```

**Content for .env:**
```
NODE_ENV=production
PORT=5000
DB_HOST=your-rds-endpoint.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=sri_lanka_travel
DB_USER=admin
DB_PASSWORD=your-secure-password
JWT_SECRET=generate-random-string-here
UPLOAD_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1
```

**Step 5: Setup Backend**
```bash
cd server
npm install

# Test if it connects to database
node -e "
const config = require('./config/database.js');
config.authenticate()
  .then(() => console.log('✅ DB Connection Success'))
  .catch(err => console.log('❌ DB Error:', err.message))
"

# If error, check:
# - RDS endpoint is correct
# - Security group allows EC2 to access RDS
# - Credentials are correct
```

**Step 6: Setup Frontend**
```bash
cd ../client
npm install
npm run build

# This creates 'dist' folder with optimized files
ls dist/
```

**Step 7: Configure Nginx**
```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/tour-blog
```

**Paste this config:**
```nginx
# Upstream backend server
upstream backend {
  server 127.0.0.1:5000;
}

server {
  listen 80;
  server_name _;
  
  # Frontend React app
  location / {
    root /home/ec2-user/tour_blog_info_final/client/dist;
    try_files $uri $uri/ /index.html;
  }
  
  # API routes
  location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

**Enable and start Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/tour-blog /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

**Step 8: Start Backend Server**
```bash
cd server

# Install process manager
sudo npm install -g pm2

# Start your app with PM2
pm2 start server.js --name "tour-blog"

# Make it auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs tour-blog
```

**Step 9: Test Your Deployment**
```bash
# From your local machine
curl http://your-instance-ip/
# Should return HTML

curl http://your-instance-ip/api/destinations
# Should return JSON

# Open in browser
# http://your-instance-ip
# Test login, create destination, etc.
```

**Common Issues & Solutions:**

```
❌ Problem: "Cannot GET /"
✅ Solution: Check Nginx config, restart: sudo systemctl restart nginx

❌ Problem: "Cannot connect to database"
✅ Solution: Check RDS endpoint, security group, credentials

❌ Problem: "API returns 504 Bad Gateway"
✅ Solution: Backend not running. Check: pm2 logs tour-blog

❌ Problem: "Uploads not saving"
✅ Solution: Update code to use S3 instead of local files
```

---

### Day 3-4: Database Migration & Data

**Goal:** Move your database to RDS and handle migrations safely.

**Step 1: Create Database Schema**
```bash
# SSH into EC2
mysql -h your-rds-endpoint.xxxxx.us-east-1.rds.amazonaws.com \
       -u admin -p sri_lanka_travel < server/database/schema.sql

# Verify
mysql -h your-rds-endpoint.xxxxx.us-east-1.rds.amazonaws.com -u admin -p
> SHOW TABLES;
> SELECT COUNT(*) FROM destinations;
```

**Step 2: Backup & Restore**
```bash
# Backup your local database
mysqldump -u your-user -p your_local_db > backup.sql

# Restore to RDS
mysql -h rds-endpoint -u admin -p sri_lanka_travel < backup.sql

# Verify
mysql -h rds-endpoint -u admin -p -e "SELECT COUNT(*) FROM destinations;"
```

---

### Day 5-6: Upload Handling with S3

**Goal:** Move file uploads from local filesystem to S3.

**Step 1: Create S3 Bucket**
```bash
aws s3 mb s3://tour-blog-uploads-yourname --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket tour-blog-uploads-yourname \
  --versioning-configuration Status=Enabled
```

**Step 2: Create IAM User for App**
```bash
# Create user
aws iam create-user --user-name tour-blog-app

# Create access key
aws iam create-access-key --user-name tour-blog-app

# Attach S3 policy
aws iam put-user-policy \
  --user-name tour-blog-app \
  --policy-name tour-blog-s3-access \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": "arn:aws:s3:::tour-blog-uploads-yourname/*"
    }]
  }'
```

**Step 3: Update Backend for S3 Upload**
```bash
npm install aws-sdk --save
```

**Update your uploadMiddleware.js:**
```javascript
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.UPLOAD_BUCKET,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, 'uploads/' + Date.now() + '-' + file.originalname);
    }
  })
});

module.exports = upload;
```

**Step 4: Add IAM Credentials to EC2**
```bash
# Add to .env on EC2
echo "AWS_ACCESS_KEY_ID=your-access-key" >> server/.env
echo "AWS_SECRET_ACCESS_KEY=your-secret-key" >> server/.env

# Restart backend
pm2 restart tour-blog
```

---

### Day 7: Domain & SSL Certificate

**Goal:** Make your app accessible via your domain with HTTPS.

**Step 1: Register Domain**
```
Option A: Route 53 (AWS) - $12/year
Option B: GoDaddy, Namecheap, etc. - $8-12/year
```

**Step 2: Get SSL Certificate (Free)**
```bash
# SSH into EC2
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Automatic renewal setup
sudo certbot renew --dry-run
```

**Step 3: Point Domain to EC2**
```
If using Route 53:
1. Go to Hosted Zones
2. Create A record
3. Name: your-domain.com
4. Type: A
5. Value: Your EC2 public IP
6. Save

If using external DNS:
Update nameservers to point to Route 53 or use CNAME for subdomain
```

**Step 4: Verify HTTPS Works**
```bash
# From local machine
curl -I https://your-domain.com
# Should show: HTTP/2 200 OK

# Open in browser
# https://your-domain.com
# Check for green lock
```

---

## 🔧 PHASE 4: OPTIMIZATION & PRODUCTION (3-5 days)

### Day 1-2: Performance Optimization

**Learning Goals:**
- Understand load times and optimization
- Learn caching strategies
- Database query optimization

**Practical Exercise 7: Performance Audit**

**Step 1: Measure Current Performance**
```bash
# Install tools
npm install -g lighthouse
npm install -g pm2-profiler

# Run Lighthouse
lighthouse https://your-domain.com --view

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

**Step 2: Implement Frontend Optimization**
```bash
# In client/vite.config.js
// Add gzip compression
// Add minification
// Optimize images

npm run build
# Compare build size before/after
```

**Step 3: Implement Backend Optimization**
```javascript
// Add response caching
const redis = require('redis');
const client = redis.createClient();

// Cache destination list for 5 minutes
app.get('/api/destinations', async (req, res) => {
  const cached = await client.get('destinations');
  if (cached) return res.json(JSON.parse(cached));
  
  const data = await Destination.findAll();
  await client.setex('destinations', 300, JSON.stringify(data));
  res.json(data);
});
```

**Step 4: Database Query Optimization**
```javascript
// Bad: N+1 queries
const destinations = await Destination.findAll();
for (let dest of destinations) {
  dest.comments = await Comment.findAll({where: {destinationId: dest.id}});
}

// Good: Join query
const destinations = await Destination.findAll({
  include: [{association: 'comments'}]
});
```

**Measure Improvement:**
```bash
# Before optimization
curl -w "Total time: %{time_total}s\n" your-domain.com

# After optimization
# Should see significant reduction
```

---

### Day 3: Monitoring & Alerts

**Learning Goals:**
- Setup CloudWatch dashboards
- Create alarms for issues
- View logs and troubleshoot

**Practical Exercise 8: Setup Monitoring**

**Step 1: CloudWatch Agent on EC2**
```bash
# SSH into EC2
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

**Step 2: Create CloudWatch Dashboard**
```bash
# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-xxxxx \
  --start-time 2024-01-25T00:00:00Z \
  --end-time 2024-01-27T00:00:00Z \
  --period 300 \
  --statistics Average
```

**Step 3: Create Alarms**
```bash
# Alert if CPU > 80%
aws cloudwatch put-metric-alarm \
  --alarm-name tour-blog-cpu-high \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Alert if disk space < 10%
# Alert if RDS CPU > 75%
# Alert if API response time > 1s
```

**Step 4: Setup Log Groups**
```bash
# Stream PM2 logs to CloudWatch
pm2 install pm2-auto-pull
pm2 install pm2-logrotate

# Or use CloudWatch Logs Agent
```

---

### Day 4: Backup & Disaster Recovery

**Learning Goals:**
- Understand backup strategies
- Practice recovery procedures
- Know RPO/RTO concepts

**Practical Exercise 9: Backup Strategy**

**Concept Definitions:**
```
RPO (Recovery Point Objective)
= How much data loss can you afford?
= "Last backup was 1 hour ago, so max 1 hour of lost data"

RTO (Recovery Time Objective)
= How long can app be down?
= "We need to be back up in 30 minutes"

For your app:
RPO: 6 hours (backup every 6 hours)
RTO: 1 hour (automated failover)
```

**Step 1: RDS Automated Backups**
```bash
# Already enabled, but verify:
aws rds describe-db-instances \
  --db-instance-identifier tour-blog-db \
  --query 'DBInstances[0].BackupRetentionPeriod'

# Should return 7 (days)
# Increase to 30 for more safety
aws rds modify-db-instance \
  --db-instance-identifier tour-blog-db \
  --backup-retention-period 30
```

**Step 2: Manual Database Backup**
```bash
# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier tour-blog-db \
  --db-snapshot-identifier tour-blog-backup-$(date +%s)

# List snapshots
aws rds describe-db-snapshots
```

**Step 3: Application Code Backup**
```bash
# Use git for version control (already doing)
# Use GitHub for remote backup
git push origin main

# Test recovery
rm -rf your-app
git clone your-repo
# App is recovered!
```

**Step 4: S3 Versioning for Uploads**
```bash
# Already enabled, but verify
aws s3api get-bucket-versioning \
  --bucket tour-blog-uploads-yourname

# Recover deleted file
aws s3api list-object-versions \
  --bucket tour-blog-uploads-yourname

# Copy old version
aws s3api copy-object \
  --bucket tour-blog-uploads-yourname \
  --copy-source tour-blog-uploads-yourname/file?versionId=VERSION_ID \
  --key file
```

**Step 5: Test Disaster Recovery**
```bash
1. Delete database
   aws rds delete-db-instance --skip-final-snapshot
   
2. Restore from snapshot
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier tour-blog-db-restored \
     --db-snapshot-identifier tour-blog-backup-xxxxx
   
3. Verify data is there
   mysql -h restored-endpoint -u admin -p sri_lanka_travel
   > SELECT COUNT(*) FROM destinations;
   
4. Time it: How long did recovery take?
```

---

### Day 5: Cost Optimization & Best Practices

**Learning Goals:**
- Understand AWS costs
- Implement cost-saving strategies
- Best practices for production

**Practical Exercise 10: Cost Analysis**

**Step 1: Review Your Costs**
```bash
# View current spend
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics "BlendedCost"
```

**Step 2: Identify Optimization Opportunities**

```
Current Monthly Cost Breakdown:
├── EC2 Instance (t3.small): $9.50
├── RDS MySQL (t3.micro): $15.00
├── EBS Storage (30GB): $3.00
├── Data Transfer: $5.00
├── RDS Backups: $2.00
├── S3 Storage (uploads): $1.00
├── CloudFront: $0.50
└── Total: ~$36/month

Optimization Ideas:
✅ Use t3.micro instead of t3.small: -$5/month
✅ Enable auto-scaling (turn off at night): -$4/month
✅ Use S3 lifecycle policies: -$0.50/month
✅ Use Spot Instances: -$7/month
✅ Use Reserved Instances (1-year): -$6/month
→ Potential savings: 30-50%
```

**Step 3: Implement Cost Controls**

```bash
# Set budget alert
aws budgets create-budget \
  --budget BudgetName=tour-blog-budget,BudgetLimit={Amount=50,Unit=USD},TimeUnit=MONTHLY,BudgetType=COST

# Enable Cost Anomaly Detection
aws ce put-anomaly-monitor \
  --anomaly-monitor '{
    "MonitorName": "tour-blog-monitor",
    "MonitorType": "DIMENSIONAL",
    "MonitorDimension": "SERVICE"
  }'
```

**Step 4: Best Practices Checklist**

```
Security:
☑ Use IAM roles instead of access keys
☑ Enable MFA on AWS account
☑ Use security groups (whitelist, don't blacklist)
☑ Encrypt data in transit (HTTPS)
☑ Encrypt data at rest (RDS encryption)
☑ Rotate credentials monthly
☑ Use Secrets Manager for passwords

Performance:
☑ Use CloudFront for static assets
☑ Implement database query caching
☑ Use connection pooling
☑ Optimize images
☑ Minify CSS/JS
☑ Use CDN for uploads

Reliability:
☑ Enable RDS automated backups
☑ Use read replicas for high availability
☑ Enable CloudWatch monitoring
☑ Create CloudWatch alarms
☑ Test disaster recovery monthly
☑ Use Auto Scaling (when scaled up)

Operations:
☑ Use Infrastructure as Code (Terraform, CloudFormation)
☑ Implement CI/CD pipeline
☑ Maintain documentation
☑ Regular security audits
☑ Keep software updated
☑ Monitor logs for errors
```

---

## 📚 Learning Resources by Topic

### AWS Services
| Service | Purpose | Learning Time | Difficulty |
|---------|---------|---------------|-----------|
| EC2 | Virtual machines | 4 hours | Easy |
| RDS | Managed database | 3 hours | Easy |
| S3 | Object storage | 3 hours | Easy |
| IAM | Access control | 4 hours | Medium |
| CloudFront | CDN | 2 hours | Easy |
| CloudWatch | Monitoring | 3 hours | Medium |
| VPC | Networking | 5 hours | Medium |
| ALB | Load balancer | 3 hours | Medium |

### Recommended YouTube Channels
- **TechWorld with Nana**: Short, practical videos (15-30 min)
- **A Cloud Guru**: Deep-dive courses (1-5 hours per topic)
- **Linux Academy**: Technical training
- **Freecodecamp**: Full AWS course (12+ hours)

### Interactive Learning
- **AWS Skill Builder**: Free tier, hands-on labs
- **Linux Academy**: Sandbox environments
- **Pluralsight**: AWS path learning

### Documentation
- **Official AWS Docs**: Most authoritative but dense
- **AWS Architecture Patterns**: Reference architectures
- **AWS Well-Architected Framework**: Best practices

---

## 🎓 Learning Milestones

### After Phase 1 (3 days)
✅ Understand AWS architecture and core concepts
✅ Can create account and navigate console
✅ Know how to use IAM and security groups

### After Phase 2 (6-7 days)
✅ Can launch EC2, RDS, S3, CloudFront
✅ Understand networking and security
✅ Know pricing and cost implications

### After Phase 3 (12-14 days)
✅ Deployed complete application on AWS
✅ Application accessible via domain with HTTPS
✅ Using S3 for uploads and CloudFront for CDN
✅ Database running on RDS with backups

### After Phase 4 (17-19 days)
✅ Application optimized for performance
✅ Monitoring and alerting in place
✅ Backup and disaster recovery tested
✅ Cost optimized
✅ Production-ready!

---

## 💡 Pro Tips for Learning

### 1. **Learn by Doing**
Don't just watch videos. Actually create resources, deploy code, break things, and fix them.

### 2. **Take Notes**
Write down what you learn. Create your own AWS reference guide.

### 3. **Cost Management**
- Always use free tier when possible
- Delete resources when not using them
- Set up billing alerts
- Expected cost: $30-50/month for learning

### 4. **Documentation**
- Screenshot important configurations
- Document your architecture
- Write down commands that work
- This becomes your runbook

### 5. **Practice Regularly**
- Deploy something every week
- Try different AWS services
- Experiment in dev environment before production
- Keep learning new services

### 6. **Join Community**
- AWS Reddit: r/aws
- AWS Dev Forums
- Stack Overflow (AWS tag)
- Local AWS User Groups

---

## 🚀 Next Steps

1. **Week 1**: Complete Phase 1 (AWS Fundamentals)
2. **Week 2**: Complete Phase 2 (Core Services)
3. **Week 3-4**: Complete Phase 3 (Deploy Your App)
4. **Week 5-6**: Complete Phase 4 (Optimization)

**After 6 weeks, you'll have:**
- Deep AWS knowledge
- Production-ready application
- Understanding of cloud architecture
- Ability to maintain and scale your app
- Experience to deploy other projects

---

## ❓ FAQ

**Q: How much will this cost?**
A: $30-50/month for your app + learning resources (free)

**Q: Do I need to buy courses?**
A: No! AWS Skill Builder free tier + YouTube is enough

**Q: How long will it take?**
A: 4-6 weeks if you spend 2-3 hours daily

**Q: What if I get stuck?**
A: Check AWS docs, search Stack Overflow, post in r/aws

**Q: Should I learn Terraform?**
A: After deploying once manually, yes! Makes repeat deployments easy

**Q: What about multiple environments?**
A: After mastering single environment, learn about Dev/Test/Prod separation

---

## 📋 Your Personal Learning Checklist

### Week 1 (Phase 1)
- [ ] Create AWS account with MFA
- [ ] Create IAM user for yourself
- [ ] Launch EC2 t2.micro instance
- [ ] SSH into EC2 instance
- [ ] Create VPC with subnets
- [ ] Understand security groups

### Week 2 (Phase 2)
- [ ] Master EC2 instance management
- [ ] Launch RDS MySQL instance
- [ ] Connect to RDS from EC2
- [ ] Create S3 buckets
- [ ] Setup CloudFront distribution
- [ ] Understand pricing

### Week 3-4 (Phase 3)
- [ ] Deploy backend on EC2
- [ ] Deploy frontend (build & serve via Nginx)
- [ ] Migrate database to RDS
- [ ] Setup S3 for uploads
- [ ] Configure domain with Route 53
- [ ] Setup HTTPS with ACM

### Week 5-6 (Phase 4)
- [ ] Optimize performance
- [ ] Setup CloudWatch monitoring
- [ ] Create automated backups
- [ ] Test disaster recovery
- [ ] Optimize costs
- [ ] Document everything

---

## 📞 Getting Help

If you get stuck:
1. Check error message carefully
2. Search AWS documentation
3. Check Stack Overflow
4. Ask in r/aws or AWS forums
5. Review security group rules (99% of issues)
6. Check CloudWatch logs
7. Verify credentials and permissions

---

Good luck! You've got this! 🚀
