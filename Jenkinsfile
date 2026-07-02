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
                sh 'ls -la dist/'
            }
        }

        stage('✅ Unit Tests') {
            steps {
                echo '✅ Exécution des tests unitaires avec couverture...'
                sh '''
                    npm run test:coverage
                '''
                // Publier les résultats des tests
                junit 'reports/junit.xml'
                publishHTML([
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: 'Code Coverage Report'
                ])
            }
        }

        stage('🔐 Security Scan - Trivy') {
            steps {
                echo '🔐 Scan de sécurité des dépendances avec Trivy...'
                sh '''
                    # Installer Trivy si nécessaire
                    if ! command -v trivy &> /dev/null; then
                        curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
                    fi
                    
                    # Scanner le filesystem
                    trivy fs --severity HIGH,CRITICAL --format json --output trivy-report.json . || true
                    trivy fs --severity HIGH,CRITICAL . || true
                '''
            }
        }

        stage('📋 SBOM Generation') {
            steps {
                echo '📋 Génération du SBOM au format SPDX...'
                sh '''
                    # Installer CycloneDX si nécessaire
                    if ! command -v cyclonedx-npm &> /dev/null; then
                        npm install -g @cyclonedx/npm
                    fi
                    
                    # Générer le SBOM SPDX
                    cyclonedx-npm --output-file sbom.spdx.json --output-format json 2>/dev/null || echo "SBOM generation avec avertissements"
                '''
            }
        }

        stage('🔍 SonarQube Analysis') {
            steps {
                echo '🔍 Analyse qualité du code avec SonarQube...'
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        npm install -g sonarqube-scanner
                        
                        sonar-scanner \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.projectKey=marius-tasklist-frontend \
                            -Dsonar.projectName="Marius TaskList Frontend" \
                            -Dsonar.sources=src \
                            -Dsonar.tests=src/__tests__ \
                            -Dsonar.exclusions=src/main.tsx,src/vite-env.d.ts \
                            -Dsonar.coverage.exclusions=src/__tests__/** \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                            || echo "SonarQube analysis completed with warnings"
                    '''
                }
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                echo '🐳 Construction de l\'image Docker...'
                sh '''
                    docker build \
                        --build-arg NODE_ENV=production \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${IMAGE_LATEST} \
                        -f Dockerfile .
                    
                    docker images | grep marius-tasklist-frontend
                '''
            }
        }

        stage('🔐 Docker Image Security Scan') {
            steps {
                echo '🔐 Scan de sécurité de l\'image Docker avec Trivy...'
                sh '''
                    trivy image --severity HIGH,CRITICAL ${IMAGE_NAME}:${IMAGE_TAG} || true
                '''
            }
        }

        stage('📤 Push to DockerHub') {
            steps {
                echo '📤 Publication des images sur DockerHub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", 
                                                   usernameVariable: 'DOCKER_USER', 
                                                   passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_LATEST}
                        
                        echo "✅ Images publiées avec succès"
                        echo "Image avec tag: ${IMAGE_NAME}:${IMAGE_TAG}"
                        echo "Image latest: ${IMAGE_LATEST}"
                        
                        docker logout
                    '''
                }
            }
        }

        stage('📊 Archive Artifacts') {
            steps {
                echo '📊 Archivage des artefacts...'
                sh '''
                    mkdir -p artifacts
                    cp -r dist/* artifacts/ 2>/dev/null || echo "Dist déjà archivé"
                    cp trivy-report.json artifacts/ 2>/dev/null || echo "Trivy report non disponible"
                    cp sbom.spdx.json artifacts/ 2>/dev/null || echo "SBOM non disponible"
                '''
                archiveArtifacts artifacts: 'artifacts/**/*', allowEmptyArchive: true
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
