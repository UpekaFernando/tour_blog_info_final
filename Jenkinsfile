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
            
            def deployScript = """
              #!/bin/bash
              set -e
              
              # Install Docker if not present
              if ! command -v docker &> /dev/null; then
                echo "Installing Docker..."
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                sudo usermod -aG docker ubuntu
                sudo systemctl enable docker
                sudo systemctl start docker
              fi
              
              # Install Docker Compose if not present
              if ! command -v docker-compose &> /dev/null; then
                echo "Installing Docker Compose..."
                sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
                sudo chmod +x /usr/local/bin/docker-compose
              fi
              
              # Navigate to app directory
              cd /home/ubuntu/tour-blog || mkdir -p /home/ubuntu/tour-blog && cd /home/ubuntu/tour-blog
              
              # Pull latest images
              echo "Pulling latest Docker images..."
              docker pull ${BACKEND_IMAGE}:latest
              docker pull ${FRONTEND_IMAGE}:latest
              
              # Stop and remove old containers
              echo "Stopping old containers..."
              docker stop tour-blog-backend tour-blog-frontend 2>/dev/null || true
              docker rm tour-blog-backend tour-blog-frontend 2>/dev/null || true
              
              # Get RDS endpoint from environment or Terraform
              export DB_HOST=\$(aws rds describe-db-instances --db-instance-identifier tour-blog-db --region us-east-1 --query 'DBInstances[0].Endpoint.Address' --output text)
              
              # Run backend container
              echo "Starting backend container..."
              docker run -d \\
                --name tour-blog-backend \\
                --restart unless-stopped \\
                -p 5000:5000 \\
                -e NODE_ENV=production \\
                -e DB_HOST=\${DB_HOST} \\
                -e DB_PORT=3306 \\
                -e DB_NAME=tour_blog \\
                -e DB_USER=admin \\
                -e DB_PASSWORD='${DB_PASSWORD}' \\
                -e JWT_SECRET=\$(openssl rand -hex 32) \\
                ${BACKEND_IMAGE}:latest
              
              # Run frontend container
              echo "Starting frontend container..."
              docker run -d \\
                --name tour-blog-frontend \\
                --restart unless-stopped \\
                -p 80:80 \\
                -p 5173:80 \\
                ${FRONTEND_IMAGE}:latest
              
              echo "Deployment complete!"
              docker ps
            """
            
            // Save script to file
            writeFile file: 'deploy-to-ec2.sh', text: deployScript
            
            // Execute on EC2 using AWS SSM (no SSH key needed)
            sh """
              # Send script to EC2 via SSM
              aws ssm send-command \\
                --instance-ids i-0d803531ceb56a45b \\
                --region us-east-1 \\
                --document-name "AWS-RunShellScript" \\
                --parameters 'commands=["${deployScript}"]' \\
                --output text \\
                --query 'Command.CommandId' > command_id.txt
              
              COMMAND_ID=\$(cat command_id.txt)
              echo "SSM Command ID: \${COMMAND_ID}"
              
              # Wait for command execution (timeout 5 minutes)
              echo "Waiting for deployment to complete..."
              aws ssm wait command-executed \\
                --command-id \${COMMAND_ID} \\
                --instance-id i-0d803531ceb56a45b \\
                --region us-east-1 || true
              
              # Get command output
              aws ssm get-command-invocation \\
                --command-id \${COMMAND_ID} \\
                --instance-id i-0d803531ceb56a45b \\
                --region us-east-1 \\
                --query 'StandardOutputContent' \\
                --output text || echo "Could not retrieve deployment logs"
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
