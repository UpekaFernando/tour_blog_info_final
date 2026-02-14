pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = "upeka2002"
    BACKEND_IMAGE = "${DOCKERHUB_REPO}/tourblog-backend"
    FRONTEND_IMAGE = "${DOCKERHUB_REPO}/tourblog-frontend"
    TF_VERSION = "1.7.0"
  }

  stages {
    stage('Prepare') {
      steps {
        checkout scm
        script {
          env.GIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.IMAGE_TAG = env.GIT_SHORT
        }
        echo "Building commit: ${env.IMAGE_TAG}"
      }
    }

    stage('Build Backend') {
      steps {
        dir('server') {
          script {
            echo "Building backend Docker image..."
            sh """
              docker build -f Dockerfile_backend -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest .
            """
          }
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('client') {
          script {
            echo "Building frontend Docker image..."
            sh """
              docker build -f Dockerfile_frontend -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest .
            """
          }
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
            
            echo "Pushing backend images..."
            sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
            sh "docker push ${BACKEND_IMAGE}:latest"
            
            echo "Pushing frontend images..."
            sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            sh "docker push ${FRONTEND_IMAGE}:latest"
            
            sh "docker logout"
          }
        }
      }
    }

    stage('Install Terraform') {
      steps {
        script {
          echo "Checking for Terraform..."
          def terraformExists = sh(script: "which terraform || echo 'not found'", returnStdout: true).trim()
          
          if (terraformExists.contains('not found')) {
            echo "Installing Terraform ${TF_VERSION}..."
            sh """
              wget -q https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip
              unzip -o terraform_${TF_VERSION}_linux_amd64.zip
              sudo mv terraform /usr/local/bin/
              rm terraform_${TF_VERSION}_linux_amd64.zip
            """
          }
          
          sh "terraform version"
        }
      }
    }

    stage('Terraform Init') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          script {
            echo "Initializing Terraform..."
            sh """
              terraform init -upgrade
            """
          }
        }
      }
    }

    stage('Terraform State Cleanup') {
      steps {
        script {
          echo "Cleaning up old resources from Terraform state..."
          sh """
            # Remove old security groups from state if they exist
            terraform state rm aws_security_group.ec2_sg 2>/dev/null || echo "✓ ec2_sg not in state"
            terraform state rm aws_security_group.rds_sg 2>/dev/null || echo "✓ rds_sg not in state"
            
            echo "Current state resources:"
            terraform state list || echo "State is empty or not initialized"
          """
        }
      }
    }

    stage('Terraform Plan') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          script {
            echo "Running Terraform plan (using existing infrastructure)..."
            sh """
              terraform plan -out=tfplan
            """
          }
        }
      }
    }

    stage('Terraform Apply') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          script {
            echo "Applying Terraform changes (S3 configuration only)..."
            sh """
              terraform apply -auto-approve tfplan
            """
          }
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
          string(credentialsId: 'rds-db-password', variable: 'DB_PASSWORD')
        ]) {
          script {
            echo "Deploying latest Docker images to EC2 instance..."
            
            // Create inline deployment script
            sh """
              # Create deployment script inline
              cat > /tmp/deploy-script.sh << 'DEPLOY_EOF'
#!/bin/bash
set -e
echo "=== Starting Deployment ==="

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sudo sh /tmp/get-docker.sh
  sudo usermod -aG docker ubuntu
  sudo systemctl enable docker
  sudo systemctl start docker
  echo "Docker installed"
fi

# Pull latest images
echo "Pulling Docker images..."
docker pull upeka2002/tourblog-backend:latest
docker pull upeka2002/tourblog-frontend:latest

# Stop old containers
echo "Stopping old containers..."
docker stop tour-blog-backend tour-blog-frontend 2>/dev/null || true
docker rm tour-blog-backend tour-blog-frontend 2>/dev/null || true

# Get RDS endpoint
DB_HOST=\\\$(aws rds describe-db-instances --db-instance-identifier tour-blog-db --region us-east-1 --query 'DBInstances[0].Endpoint.Address' --output text 2>/dev/null || echo "tour-blog-db.c2fqs2k2ar64.us-east-1.rds.amazonaws.com")

# Start backend
echo "Starting backend container..."
docker run -d \\\\
  --name tour-blog-backend \\\\
  --restart unless-stopped \\\\
  -p 5000:5000 \\\\
  -e NODE_ENV=production \\\\
  -e DB_HOST="\\\${DB_HOST}" \\\\
  -e DB_PORT=3306 \\\\
  -e DB_NAME=tour_blog \\\\
  -e DB_USER=admin \\\\
  -e DB_PASSWORD="\\\${DB_PASSWORD}" \\\\
  -e JWT_SECRET=\\\$(openssl rand -hex 32) \\\\
  upeka2002/tourblog-backend:latest

# Start frontend
echo "Starting frontend container..."
docker run -d \\\\
  --name tour-blog-frontend \\\\
  --restart unless-stopped \\\\
  -p 80:80 \\\\
  -p 5173:80 \\\\
  upeka2002/tourblog-frontend:latest

echo "=== Deployment Complete ==="
docker ps --filter name=tour-blog
DEPLOY_EOF

              # Encode script for SSM
              ENCODED_SCRIPT=\$(cat /tmp/deploy-script.sh | base64 -w 0)
              
              # Send to EC2 via SSM
              COMMAND_ID=\$(aws ssm send-command \\
                --instance-ids i-0d803531ceb56a45b \\
                --region us-east-1 \\
                --document-name "AWS-RunShellScript" \\
                --parameters "{\\"commands\\":[\\"echo '\${ENCODED_SCRIPT}' | base64 -d > /tmp/deploy.sh\\",\\"chmod +x /tmp/deploy.sh\\",\\"export DB_PASSWORD='${DB_PASSWORD}'\\",\\"/tmp/deploy.sh\\"]}" \\
                --output text \\
                --query 'Command.CommandId')
              
              echo "SSM Command ID: \${COMMAND_ID}"
              
              # Wait for completion
              echo "Waiting for deployment..."
              aws ssm wait command-executed \\
                --command-id \${COMMAND_ID} \\
                --instance-id i-0d803531ceb56a45b \\
                --region us-east-1 || echo "Command may still be running..."
              
              # Get output
              echo "=== Deployment Output ==="
              aws ssm get-command-invocation \\
                --command-id \${COMMAND_ID} \\
                --instance-id i-0d803531ceb56a45b \\
                --region us-east-1 \\
                --query 'StandardOutputContent' \\
                --output text || echo "Could not retrieve logs"
              
              # Check errors
              ERROR_OUT=\$(aws ssm get-command-invocation \\
                --command-id \${COMMAND_ID} \\
                --instance-id i-0d803531ceb56a45b \\
                --region us-east-1 \\
                --query 'StandardErrorContent' \\
                --output text)
              
              if [ ! -z "\${ERROR_OUT}" ] && [ "\${ERROR_OUT}" != "None" ]; then
                echo "=== Errors ==="
                echo "\${ERROR_OUT}"
              fi
              
              rm -f /tmp/deploy-script.sh
              echo "✅ Deployment completed!"
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully!"
      echo "Backend: ${BACKEND_IMAGE}:${IMAGE_TAG}"
      echo "Frontend: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
      echo "Infrastructure: Updated via Terraform (RDS + S3)"
    }
    failure {
      echo "❌ Pipeline failed - check console output"
    }
    always {
      script {
        // Clean up terraform plan file
        sh "rm -f tfplan"
      }
    }
  }
}
