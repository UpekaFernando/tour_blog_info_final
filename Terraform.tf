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
  description = "SSH public key for EC2 access"
  type        = string
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
  description = "Database admin password"
  type        = string
  sensitive   = true
}

# ================================
# Provider Configuration
# ================================
provider "aws" {
  region = var.aws_region
}

# ================================
# Networking Resources
# ================================
data "aws_vpc" "default" {
  default = true
}

resource "aws_subnet" "subnet_a" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = "172.31.48.0/20"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-subnet-a"
  }
}

resource "aws_subnet" "subnet_b" {
  vpc_id                  = data.aws_vpc.default.id
  cidr_block              = "172.31.64.0/20"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-subnet-b"
  }
}

# ================================
# Security Groups
# ================================
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for EC2 backend server"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS MySQL database"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "MySQL from EC2"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  ingress {
    description = "MySQL from anywhere"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# ================================
# EC2 Resources
# ================================
resource "aws_key_pair" "ec2_key" {
  key_name   = "${var.project_name}-key"
  public_key = var.ssh_public_key

  tags = {
    Name = "${var.project_name}-key"
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes = [public_key]
  }
}

resource "aws_instance" "backend" {
  ami                    = var.ec2_ami_id
  instance_type          = var.ec2_instance_type
  key_name               = aws_key_pair.ec2_key.key_name
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  subnet_id              = aws_subnet.subnet_a.id

  user_data = templatefile("${path.module}/user-data-inline.sh", {
    db_host     = aws_db_instance.mysql.address
    db_user     = var.db_username
    db_password = var.db_password
    db_name     = var.db_name
  })

  tags = {
    Name = "${var.project_name}-backend"
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      ami,
      user_data,
      key_name,
      tags
    ]
  }
}

# ================================
# RDS Resources
# ================================
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.project_name}-rds-subnet-group"
  subnet_ids = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]

  tags = {
    Name = "${var.project_name}-rds-subnet-group"
  }
}

resource "aws_db_instance" "mysql" {
  identifier             = "${var.project_name}-db"
  engine                 = "mysql"
  engine_version         = var.db_engine_version
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  storage_type           = "gp2"
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = true
  skip_final_snapshot    = true
  backup_retention_period = 7

  tags = {
    Name = "${var.project_name}-mysql"
  }
}

# ================================
# S3 Resources - Frontend Bucket
# ================================
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${random_id.bucket_suffix.dec}"

  tags = {
    Name = "${var.project_name}-frontend"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# ================================
# S3 Resources - Deploy Bucket
# ================================
resource "aws_s3_bucket" "deploy" {
  bucket = "${var.project_name}-deploy-${random_id.bucket_suffix.dec}"

  tags = {
    Name = "${var.project_name}-deploy"
  }
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
  value       = aws_instance.backend.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.backend.id
}

output "ec2_ssh_command" {
  description = "SSH command to connect to EC2 instance"
  value       = "ssh -i ${var.project_name}-key.pem ubuntu@${aws_instance.backend.public_ip}"
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.mysql.endpoint
}

output "rds_address" {
  description = "RDS instance address"
  value       = aws_db_instance.mysql.address
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.mysql.db_name
}

output "s3_frontend_bucket" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "s3_frontend_url" {
  description = "S3 website endpoint URL"
  value       = "http://${aws_s3_bucket.frontend.bucket}.s3-website-${var.aws_region}.amazonaws.com"
}

output "s3_deploy_bucket" {
  description = "S3 bucket name for deployment files"
  value       = aws_s3_bucket.deploy.bucket
}

output "backend_api_url" {
  description = "Backend API URL"
  value       = "http://${aws_instance.backend.public_ip}:5000/api"
}

output "security_group_ec2_id" {
  description = "Security group ID for EC2 instance"
  value       = aws_security_group.ec2_sg.id
}

output "security_group_rds_id" {
  description = "Security group ID for RDS instance"
  value       = aws_security_group.rds_sg.id
}
