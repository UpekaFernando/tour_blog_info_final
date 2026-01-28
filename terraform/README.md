# Tour Blog Infrastructure - Terraform

This directory contains Terraform configuration files to provision the complete AWS infrastructure for the Tour Blog application.

## Infrastructure Components

- **EC2 Instance**: t3.micro instance running Ubuntu 22.04 LTS for Node.js backend
- **RDS MySQL**: db.t3.micro instance running MySQL 8.0.40
- **S3 Buckets**: 
  - Frontend static website hosting
  - Deployment files storage
- **Security Groups**: Configured for EC2 and RDS access
- **VPC**: Uses default VPC with public subnets

## Prerequisites

1. **Terraform**: Install Terraform v1.0 or higher
   ```bash
   # Download from https://www.terraform.io/downloads
   ```

2. **AWS CLI**: Configure AWS credentials
   ```bash
   aws configure
   ```

3. **SSH Key Pair**: Generate SSH key pair for EC2 access
   ```bash
   ssh-keygen -t rsa -b 4096 -f tour-blog-key
   ```

## Quick Start

1. **Initialize Terraform**
   ```bash
   cd terraform
   terraform init
   ```

2. **Create terraform.tfvars file**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. **Edit terraform.tfvars** with your values:
   - Add your SSH public key
   - Set a secure database password
   - Adjust region and instance types if needed

4. **Review the plan**
   ```bash
   terraform plan
   ```

5. **Apply the configuration**
   ```bash
   terraform apply
   ```

6. **Save outputs**
   ```bash
   terraform output > outputs.txt
   ```

## Configuration Files

- `main.tf` - Main infrastructure configuration
- `variables.tf` - Variable definitions
- `outputs.tf` - Output values
- `user-data.sh` - EC2 user data script for initial setup
- `terraform.tfvars.example` - Example variable values
- `.terraform.tfstate` - Terraform state (auto-generated, do not commit)

## Outputs

After successful deployment, Terraform will output:

- `ec2_public_ip` - Public IP of the EC2 instance
- `ec2_ssh_command` - SSH command to connect to EC2
- `rds_endpoint` - RDS database endpoint
- `s3_frontend_url` - Frontend website URL
- `backend_api_url` - Backend API URL

## Post-Deployment Steps

1. **Connect to EC2**
   ```bash
   ssh -i tour-blog-key.pem ubuntu@<ec2_public_ip>
   ```

2. **Deploy Backend Code**
   - Upload your server code to `/home/ubuntu/tour-blog/server/`
   - Run the deployment script: `./deploy.sh`

3. **Seed Database**
   ```bash
   cd /home/ubuntu/tour-blog/server
   node seedNewDatabase.js
   ```

4. **Deploy Frontend to S3**
   ```bash
   cd client
   npm run build
   aws s3 sync dist/ s3://<frontend-bucket-name> --delete
   ```

## Cost Estimation

Monthly AWS costs (approximate):

- EC2 t3.micro: ~$8.50
- RDS db.t3.micro: ~$15.00
- S3 Storage & Transfer: ~$1-5
- **Total**: ~$25-30/month

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will permanently delete all resources including the database!

## Security Notes

1. **Database Password**: Use a strong password in production
2. **SSH Key**: Keep your private key secure, never commit it
3. **Security Groups**: Consider restricting IP ranges for production
4. **S3 Buckets**: Frontend bucket is publicly accessible by design
5. **RDS Public Access**: Consider using private subnets for production

## Customization

### Change Instance Types
Edit `terraform.tfvars`:
```hcl
ec2_instance_type = "t3.small"  # More CPU/memory
db_instance_class = "db.t3.small"  # Larger database
```

### Change Region
Edit `terraform.tfvars`:
```hcl
aws_region = "ap-south-1"  # Mumbai region
```
Note: Update AMI ID for the new region

### Add CloudFront CDN
Add to `main.tf`:
```hcl
resource "aws_cloudfront_distribution" "frontend" {
  # CloudFront configuration
}
```

## Troubleshooting

### Terraform Init Fails
```bash
rm -rf .terraform
terraform init
```

### SSH Connection Refused
- Check security group allows SSH (port 22)
- Verify key permissions: `chmod 400 tour-blog-key.pem`

### Database Connection Fails
- Verify security group allows MySQL (port 3306)
- Check RDS is in "available" state
- Confirm password in .env file matches Terraform

### S3 Website Not Accessible
- Verify bucket policy allows public read
- Check website configuration is enabled
- Confirm files are uploaded

## Support

For issues or questions:
1. Check AWS Console for resource status
2. Review Terraform state: `terraform show`
3. Check EC2 logs: `sudo journalctl -u tour-blog-api`
4. Review PM2 logs: `pm2 logs`
