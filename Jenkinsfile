pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_PREFIX = 'todo-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        AWS_REGION = 'us-east-1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourusername/todo-devops-app.git'
            }
        }
        
        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            sh "docker build -t ${DOCKER_IMAGE_PREFIX}-backend:${DOCKER_TAG} ./backend"
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            sh "docker build -t ${DOCKER_IMAGE_PREFIX}-frontend:${DOCKER_TAG} ./frontend"
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Run basic health checks
                    sh """
                        docker run --rm -d --name test-backend -p 5001:5000 ${DOCKER_IMAGE_PREFIX}-backend:${DOCKER_TAG}
                        sleep 10
                        curl -f http://localhost:5001/health || exit 1
                        docker stop test-backend
                    """
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    // Tag and push to Docker Hub or ECR
                    sh """
                        docker tag ${DOCKER_IMAGE_PREFIX}-backend:${DOCKER_TAG} yourdockerhub/${DOCKER_IMAGE_PREFIX}-backend:${DOCKER_TAG}
                        docker tag ${DOCKER_IMAGE_PREFIX}-frontend:${DOCKER_TAG} yourdockerhub/${DOCKER_IMAGE_PREFIX}-frontend:${DOCKER_TAG}
                        
                        docker push yourdockerhub/${DOCKER_IMAGE_PREFIX}-backend:${DOCKER_TAG}
                        docker push yourdockerhub/${DOCKER_IMAGE_PREFIX}-frontend:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Deploy to AWS EC2') {
            steps {
                script {
                    sh '''
                        # Copy deployment files to EC2
                        scp -i ~/.ssh/aws-key.pem docker-compose.yml deploy.sh ec2-user@your-ec2-ip:~/
                        
                        # SSH and deploy
                        ssh -i ~/.ssh/aws-key.pem ec2-user@your-ec2-ip "
                            export DOCKER_TAG=${DOCKER_TAG}
                            chmod +x deploy.sh
                            ./deploy.sh
                        "
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Clean up local images
            sh """
                docker rmi ${DOCKER_IMAGE_PREFIX}-backend:${DOCKER_TAG} || true
                docker rmi ${DOCKER_IMAGE_PREFIX}-frontend:${DOCKER_TAG} || true
            """
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}