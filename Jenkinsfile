pipeline {
    agent {
        docker {
            image 'node:19-alpine'
            args '-u root'
        }
    }
    environment {
        CI = false
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh "npm install"
                sh "cd client && npm install"
            }
        }
        stage('Build') {
            steps {
                sh 'npm run'  
                sh 'cd client && npm run build'
            }
        }
        stage('Lint') {
            steps {
                sh 'npm run lint && cat lint-results.xml'
            }
        }
        stage('Test') {
            steps {
                sh 'cd client && npm test'
            }
        }

        stage('Test Coverage') {
            steps {
                sh 'cat ./client/coverage/lcov.info'
            }
        }
        stage('Deployment Time Analysis') {
            steps {
            sh 'sh ./DeploymentTime.sh'
            }
        }
        stage('Security Scanning') {
            steps {
                sh 'sh ./SecurityScanning.sh'
            }
        }
    }
}

