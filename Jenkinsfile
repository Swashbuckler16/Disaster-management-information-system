pipeline {
    agent any

    environment {
        APP_IMAGE = "dmis-app"
        APP_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Code Quality & Lint') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'python3 -m py_compile server.py test_server.py'
                    } else {
                        bat 'python -m py_compile server.py test_server.py'
                    }
                }
            }
        }

        stage('Automated Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'python3 test_server.py'
                    } else {
                        bat 'python test_server.py'
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker build -t ${APP_IMAGE}:${APP_TAG} -t ${APP_IMAGE}:latest ."
                    } else {
                        bat "docker build -t %APP_IMAGE%:%APP_TAG% -t %APP_IMAGE%:latest ."
                    }
                }
            }
        }

        stage('Container Smoke Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            docker run -d --name dmis-ci-test -p 8080:8000 ${APP_IMAGE}:${APP_TAG}
                            sleep 4
                            curl --fail http://localhost:8080/api/all || exit 1
                            docker stop dmis-ci-test
                            docker rm dmis-ci-test
                        '''
                    } else {
                        bat '''
                            docker run -d --name dmis-ci-test -p 8080:8000 %APP_IMAGE%:%APP_TAG%
                            timeout /t 4 /nobreak
                            powershell -Command "Invoke-RestMethod -Uri 'http://localhost:8080/api/all'"
                            docker stop dmis-ci-test
                            docker rm dmis-ci-test
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying DMIS Application container with Docker Compose..."
                script {
                    if (isUnix()) {
                        sh 'docker compose up -d --build'
                    } else {
                        bat 'docker compose up -d --build'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed."
        }
        success {
            echo "CI/CD Pipeline succeeded! DMIS is operational."
        }
        failure {
            echo "CI/CD Pipeline failed! Check stage logs."
        }
    }
}
