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
