pipeline {
    agent any
    
    environment {
        REGISTRY = 'docker.io'
        IMAGE_NAME = "${REGISTRY}/muvay/marius-tasklist-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_LATEST = "${IMAGE_NAME}:latest"
        DOCKER_CREDENTIALS = 'marius-dockerhub-credentials'
        SONARQUBE_TOKEN = 'sonarqube-token'
        SONAR_HOST_URL = 'http://localhost:9000'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
        quietPeriod(0)
    }

    triggers {
        githubPush()
    }

    stages {
        stage('🔍 Checkout') {
            steps {
                echo '📦 Récupération du code source depuis GitHub...'
                checkout scm
            }
        }

        stage('📥 Install Dependencies') {
            steps {
                echo '📥 Installation des dépendances npm...'
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }

        stage('🏗️ Build') {
            steps {
                echo '🏗️ Construction du projet React + TypeScript...'
                sh 'npm run build'
            }
        }

        stage('✅ Unit Tests') {
            steps {
                echo '✅ Exécution des tests unitaires avec couverture...'
                sh 'npm run test:coverage 2>&1' 
                junit 'reports/junit.xml'
            }
        }

        stage('🔐 Security - Trivy') {
            when {
                expression { sh(script: 'command -v trivy > /dev/null 2>&1', returnStatus: true) == 0 }
            }
            steps {
                echo '🔐 Scan de sécurité avec Trivy...'
                sh '''
                    trivy fs --severity HIGH,CRITICAL . || echo "⚠️ Trivy non disponible"
                '''
            }
        }

        stage('🔍 SonarQube Analysis') {
            when {
                expression { credentials(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN') != null }
            }
            steps {
                echo '🔍 Analyse qualité du code avec SonarQube...'
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        which sonar-scanner || npm install -g sonarqube-scanner
                        sonar-scanner \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.projectKey=marius-tasklist-frontend \
                            -Dsonar.sources=src \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info || echo "⚠️ SonarQube non disponible"
                    '''
                }
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                echo '🐳 Construction de l\'image Docker...'
                sh '''
                    docker build \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${IMAGE_LATEST} \
                        -f Dockerfile .
                    
                    docker images | grep marius-tasklist-frontend
                '''
            }
        }

        stage('📤 Push to DockerHub') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Publication des images sur DockerHub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", 
                                                   usernameVariable: 'DOCKER_USER', 
                                                   passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_LATEST}
                        docker logout
                    '''
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Nettoyage des ressources Docker...'
            sh 'docker logout || true'
        }

        success {
            echo '''
            ✅ ╔════════════════════════════════════════╗
               ║   Pipeline Frontend RÉUSSI! ✓        ║
               ║   Image disponible sur DockerHub     ║
               ║   ${IMAGE_NAME}:${IMAGE_TAG}          ║
               ╚════════════════════════════════════════╝
            '''
        }

        failure {
            echo '''
            ❌ ╔════════════════════════════════════════╗
               ║   Pipeline Frontend ÉCHOUÉ! ✗         ║
               ║   Consultez les logs ci-dessus        ║
               ╚════════════════════════════════════════╝
            '''
        }
    }
}
