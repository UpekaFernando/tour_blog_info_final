#!/bin/bash
# Terraform State Cleanup Script
# Run this ONCE on your Jenkins server before the next pipeline run

echo "========================================="
echo "Terraform State Cleanup"
echo "========================================="
echo ""
echo "This script removes old security group resources from Terraform state"
echo "that were created in previous runs. These will be replaced with data sources."
echo ""

# Navigate to terraform directory
cd /var/lib/jenkins/workspace/tourblog-pipeline || exit 1

echo "Current Terraform state resources:"
terraform state list

echo ""
echo "Removing old security group resources from state..."

# Remove old security groups from state (if they exist)
terraform state rm aws_security_group.ec2_sg 2>/dev/null && echo "✓ Removed aws_security_group.ec2_sg" || echo "- aws_security_group.ec2_sg not in state"
terraform state rm aws_security_group.rds_sg 2>/dev/null && echo "✓ Removed aws_security_group.rds_sg" || echo "- aws_security_group.rds_sg not in state"

echo ""
echo "Updated Terraform state resources:"
terraform state list

echo ""
echo "========================================="
echo "Cleanup complete!"
echo "========================================="
echo ""
echo "You can now run the pipeline again."
echo "The security groups will be referenced as data sources (read-only)."
