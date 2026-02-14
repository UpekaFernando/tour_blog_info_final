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
              docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest .
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
              docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest .
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
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
          string(credentialsId: 'terraform-ssh-public-key', variable: 'TF_VAR_ssh_public_key'),
          string(credentialsId: 'terraform-db-password', variable: 'TF_VAR_db_password')
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

    stage('Terraform Plan') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
          string(credentialsId: 'terraform-ssh-public-key', variable: 'TF_VAR_ssh_public_key'),
          string(credentialsId: 'terraform-db-password', variable: 'TF_VAR_db_password')
        ]) {
          script {
            echo "Running Terraform plan (excluding EC2 instance)..."
            sh """
              terraform plan \
                -target=aws_db_instance.mysql \
                -target=aws_s3_bucket.frontend \
                -target=aws_s3_bucket.deploy \
                -target=aws_s3_bucket_website_configuration.frontend \
                -target=aws_s3_bucket_policy.frontend_policy \
                -target=aws_s3_bucket_public_access_block.frontend \
                -out=tfplan
            """
          }
        }
      }
    }

    stage('Terraform Apply') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY'),
          string(credentialsId: 'terraform-ssh-public-key', variable: 'TF_VAR_ssh_public_key'),
          string(credentialsId: 'terraform-db-password', variable: 'TF_VAR_db_password')
        ]) {
          script {
            echo "Applying Terraform changes (excluding EC2 instance)..."
            sh """
              terraform apply -auto-approve tfplan
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
