pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = "upeka2002"
    BACKEND_IMAGE = "${DOCKERHUB_REPO}/tourblog-backend"
    FRONTEND_IMAGE = "${DOCKERHUB_REPO}/tourblog-frontend"
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
  }

  post {
    success {
      echo "✅ Images pushed successfully!"
      echo "Backend: ${BACKEND_IMAGE}:${IMAGE_TAG}"
      echo "Frontend: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
    }
    failure {
      echo "❌ Build or push failed - check console output"
    }
  }
}
