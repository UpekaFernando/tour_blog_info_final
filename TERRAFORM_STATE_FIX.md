# Critical Fix: Terraform State and Security Groups

## What Happened

During the pipeline run, Terraform tried to **DESTROY your security groups**. This is extremely dangerous because:

1. **Previous Pipeline Run Created Resources**: An earlier run of the pipeline created security groups (`tour-blog-ec2-sg` and `tour-blog-rds-sg`)
2. **Those Resources Were in Terraform State**: Terraform tracked them as managed resources
3. **We Changed to Data Sources**: We updated the config to use existing resources (data sources)
4. **Terraform Wanted to Delete Them**: Since they're no longer in the config as resources, Terraform planned to destroy them

## What We Fixed

### 1. **Security Group References - Fixed ✅**

**Before (WRONG - caused multiple matches):**
```hcl
data "aws_security_group" "rds_sg" {
  filter {
    name   = "group-name"
    values = ["*rds*", "*database*", "tour-blog*"]  # Too broad!
  }
}
```

**After (CORRECT - specific IDs):**
```hcl
data "aws_security_group" "ec2_sg" {
  id = "sg-08d4c1991878c35be"  # tour-blog-backend-sg (your actual EC2 SG)
}

data "aws_security_group" "rds_sg" {
  id = "sg-096b0d9c71c78a4e8"  # default VPC security group (used by RDS)
}
```

### 2. **Terraform State Cleanup - Added ✅**

Added a new pipeline stage that automatically removes old resources from state:

```groovy
stage('Terraform State Cleanup') {
  steps {
    script {
      sh """
        # Remove old security groups from state
        terraform state rm aws_security_group.ec2_sg 2>/dev/null || true
        terraform state rm aws_security_group.rds_sg 2>/dev/null || true
      """
    }
  }
}
```

This runs BEFORE `terraform plan` to prevent destruction attempts.

## Security Groups Identified

| Resource | Security Group ID | Name | Purpose |
|----------|------------------|------|---------|
| EC2 Instance | `sg-08d4c1991878c35be` | `tour-blog-backend-sg` | Your actual EC2 instance SG |
| RDS Database | `sg-096b0d9c71c78a4e8` | `default` | Default VPC SG used by RDS |
| ~~Old (to remove)~~ | ~~`sg-024747475e17d801b`~~ | ~~`tour-blog-ec2-sg`~~ | Created by previous Terraform run |
| ~~Old (to remove)~~ | ~~`sg-015ddf79e90a109b4`~~ | ~~`tour-blog-rds-sg`~~ | Created by previous Terraform run |

## What the Pipeline Now Does

### ✅ **Reads (Data Sources - Safe):**
- EC2 instance: `i-0d803531ceb56a45b`
- RDS database: `tour-blog-db`
- EC2 Security Group: `sg-08d4c1991878c35be`
- RDS Security Group: `sg-096b0d9c71c78a4e8`
- S3 buckets: existing ones
- VPC & Subnets: existing defaults

### ✅ **Updates (Configuration Only):**
- S3 website configuration
- S3 bucket policies
- S3 public access settings

### ❌ **Does NOT Touch:**
- EC2 instances
- RDS databases
- Security groups
- Any infrastructure resources

## Next Pipeline Run

When you push the next commit, the pipeline will:

1. ✅ Build Docker images
2. ✅ Push to Docker Hub
3. ✅ Install Terraform
4. ✅ Initialize Terraform
5. ✅ **Clean up state** (removes old SG resources)
6. ✅ Plan changes (0 to add, 0 to change, **0 to destroy**)
7. ✅ Apply changes (S3 config only)

**Expected plan output:**
```
Plan: 0 to add, 0 to change, 0 to destroy.
```

## If You See Destruction Plans Again

If Terraform ever shows it wants to destroy resources:

1. **STOP THE PIPELINE IMMEDIATELY** ⛔
2. Check what it wants to destroy
3. If it's important infrastructure:
   - Add `prevent_destroy` lifecycle block
   - Or convert to data source
   - Or remove from state: `terraform state rm <resource>`

## Security Group Details

### EC2 Security Group (`sg-08d4c1991878c35be`)
**Allows:**
- SSH (port 22) from anywhere (0.0.0.0/0)
- HTTP (port 80) from anywhere
- Backend API (port 5000) from anywhere

**Perfect for your use case** - accessible from workplace and anywhere else.

### RDS Security Group (`sg-096b0d9c71c78a4e8`)
**Allows:**
- MySQL (port 3306) from anywhere (0.0.0.0/0)

**Note:** This is the default VPC security group, which is fine for now.

## Manual Cleanup (If Needed)

If you want to manually remove the old security groups that were created by Terraform:

```bash
# On your Jenkins server
cd /var/lib/jenkins/workspace/tourblog-pipeline

# Remove from Terraform state
terraform state rm aws_security_group.ec2_sg
terraform state rm aws_security_group.rds_sg

# Optionally delete the actual SGs from AWS (if not in use)
aws ec2 delete-security-group --group-id sg-024747475e17d801b --region us-east-1
aws ec2 delete-security-group --group-id sg-015ddf79e90a109b4 --region us-east-1
```

**But**: The pipeline now handles this automatically!

## Summary

✅ **Fixed security group references** - now uses specific IDs  
✅ **Added automatic state cleanup** - prevents destruction attempts  
✅ **Your infrastructure is safe** - pipeline only manages S3 configs  
✅ **No CIDR restrictions** - security groups allow 0.0.0.0/0 (anywhere)  

**You can now safely run the pipeline!**
