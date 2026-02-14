# ================================
# Terraform Configuration
# ================================
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ================================
# Variables
# ================================
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "tour-blog"
}

variable "ec2_ami_id" {
  description = "AMI ID for EC2 instance (Ubuntu 22.04 LTS in us-east-1)"
  type        = string
  default     = "ami-0e2c8caa4b6378d8c" # Ubuntu 22.04 LTS in us-east-1
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access (not used with existing infrastructure)"
  type        = string
  default     = ""  # Not needed when using existing EC2
  sensitive   = true
}

variable "db_engine_version" {
  description = "MySQL engine version"
  type        = string
  default     = "8.0.40"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS instance in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "tour_blog"
}

variable "db_username" {
  description = "Database admin username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database admin password (not used with existing infrastructure)"
  type        = string
  default     = ""  # Not needed when using existing RDS
  sensitive   = true
}

# ================================
# Provider Configuration
# ================================
provider "aws" {
  region = var.aws_region
}

# ================================
# Networking Resources - Using Existing
# ================================
data "aws_vpc" "default" {
  default = true
}

# Use existing subnets (no creation)
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ================================
# Security Groups - Using Existing
# ================================
# Reference existing security groups (no creation)
data "aws_security_group" "ec2_sg" {
  filter {
    name   = "group-name"
    values = ["tour-blog-backend-sg"]
  }
  vpc_id = data.aws_vpc.default.id
}

data "aws_security_group" "rds_sg" {
  filter {
    name   = "group-name"
    values = ["*rds*", "*database*", "tour-blog*"]
  }
  vpc_id = data.aws_vpc.default.id
}

# ================================
# EC2 Resources - Using Existing Instance
# ================================
# Reference existing EC2 instance (do not create/destroy)
data "aws_instance" "backend" {
  instance_id = "i-0d803531ceb56a45b"  # Your existing instance

  filter {
    name   = "instance-state-name"
    values = ["running", "stopped"]
  }
}

# Reference existing key pair (do not create/destroy)
data "aws_key_pair" "ec2_key" {
  key_name = "tour-blog-key"  # Your existing key pair
}

# ================================
# RDS Resources - Using Existing Database
# ================================
# Reference existing RDS instance (do not create/destroy) 
data "aws_db_instance" "mysql" {
  db_instance_identifier = "tour-blog-db"  # Your existing RDS instance
}

# ================================
# S3 Resources - Using Existing Buckets
# ================================
# Reference existing S3 buckets (do not create/destroy)
data "aws_s3_bucket" "frontend" {
  bucket = "tour-blog-frontend-295054972"  # Your existing frontend bucket
}

data "aws_s3_bucket" "deploy" {
  bucket = "tour-blog-deploy-446654353"  # Your existing deploy bucket
}

# Optionally manage website configuration for existing frontend bucket
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = data.aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = data.aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = data.aws_s3_bucket.frontend.id

  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${data.aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# ================================
# User Data Script (Inline)
# ================================
# Note: This script is referenced in the EC2 instance user_data attribute above
# Create a file named "user-data-inline.sh" with the following content:
#
# #!/bin/bash
# set -e
#
# # Update system
# apt-get update
# apt-get upgrade -y
#
# # Install Node.js 20.x
# curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# apt-get install -y nodejs
#
# # Install PM2 globally
# npm install -g pm2
#
# # Install MySQL client
# apt-get install -y mysql-client
#
# # Install Git
# apt-get install -y git
#
# # Install unzip
# apt-get install -y unzip
#
# # Install AWS CLI
# curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# unzip awscliv2.zip
# ./aws/install
# rm -rf aws awscliv2.zip
#
# # Create application directory
# mkdir -p /home/ubuntu/tour-blog/server
# chown -R ubuntu:ubuntu /home/ubuntu/tour-blog
#
# # Create .env file for backend
# cat > /home/ubuntu/tour-blog/server/.env << EOF
# PORT=5000
# DB_HOST=${db_host}
# DB_USER=${db_user}
# DB_PASSWORD='${db_password}'
# DB_NAME=${db_name}
# JWT_SECRET=$(openssl rand -hex 32)
# NODE_ENV=production
# EOF
#
# chown ubuntu:ubuntu /home/ubuntu/tour-blog/server/.env
#
# # Create deployment script
# cat > /home/ubuntu/deploy.sh << 'EOFINNER'
# #!/bin/bash
# cd /home/ubuntu/tour-blog/server
# npm install
# pm2 restart tour-blog-api || pm2 start server.js --name tour-blog-api
# pm2 save
# pm2 startup
# EOFINNER
#
# chmod +x /home/ubuntu/deploy.sh
# chown ubuntu:ubuntu /home/ubuntu/deploy.sh
#
# echo "User data script completed successfully"

# ================================
# Outputs
# ================================
output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = data.aws_instance.backend.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = data.aws_instance.backend.id
}

output "ec2_ssh_command" {
  description = "SSH command to connect to EC2 instance"
  value       = "ssh -i ${data.aws_key_pair.ec2_key.key_name}.pem ubuntu@${data.aws_instance.backend.public_ip}"
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = data.aws_db_instance.mysql.endpoint
}

output "rds_address" {
  description = "RDS instance address"
  value       = data.aws_db_instance.mysql.address
}

output "database_name" {
  description = "Database name"
  value       = data.aws_db_instance.mysql.db_name
}

output "s3_frontend_bucket" {
  description = "S3 bucket name for frontend"
  value       = data.aws_s3_bucket.frontend.bucket
}

output "s3_frontend_url" {
  description = "S3 website endpoint URL"
  value       = "http://${data.aws_s3_bucket.frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com"
}

output "s3_deploy_bucket" {
  description = "S3 bucket name for deployment files"
  value       = data.aws_s3_bucket.deploy.bucket
}

output "backend_api_url" {
  description = "Backend API URL"
  value       = "http://${data.aws_instance.backend.public_ip}:5000/api"
}

output "security_group_ec2_id" {
  description = "Security group ID for EC2 instance"
  value       = data.aws_security_group.ec2_sg.id
}

output "security_group_rds_id" {
  description = "Security group ID for RDS instance"
  value       = data.aws_security_group.rds_sg.id
}
