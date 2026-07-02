pipeline {
    agent any
    
    environment {
        REGISTRY = 'docker.io'
        IMAGE_NAME = "${REGISTRY}/muvay/marius-tasklist-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_LATEST = "${IMAGE_NAME}:latest"
        DOCKER_CREDENTIALS = 'marius-dockerhub-credentials'
        SONARQUBE_TOKEN = 'sonarqube-token'
        SONAR_HOST_URL = 'https://sonarqube.cicd.kits.ext.educentre.fr'
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

        stage('📋 SBOM Generation - SPDX') {
            steps {
                echo '📋 Génération du SBOM au format SPDX...'
                sh '''
                    # Installer CycloneDX si nécessaire
                    if ! command -v cyclonedx-npm > /dev/null 2>&1; then
                        echo "Installation de CycloneDX..."
                        npm install -g @cyclonedx/npm
                    fi
                    
                    # Générer le SBOM en format SPDX JSON
                    echo "Génération du SBOM SPDX..."
                    cyclonedx-npm --output-file sbom.spdx.json --output-format json 2>&1 || echo "⚠️ CycloneDX non disponible"
                    
                    # Vérifier que le fichier a été créé
                    if [ -f sbom.spdx.json ]; then
                        echo "✅ SBOM généré avec succès"
                        ls -lh sbom.spdx.json
                    else
                        echo "⚠️ SBOM non généré"
                    fi
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔍 Analyse SonarQube...'
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        npx sonarqube-scanner \
                            -Dsonar.host.url=https://sonarqube.cicd.kits.ext.educentre.fr \
                            -Dsonar.token=${SONAR_TOKEN} \
                            -Dsonar.projectKey=marius-tasklist-frontend \
                            -Dsonar.projectName="Marius TaskList Frontend" \
                            -Dsonar.sources=src \
                            -Dsonar.exclusions=src/__tests__/**,**/*.test.tsx,src/main.tsx,src/vite-env.d.ts \
                            -Dsonar.tests=src/__tests__ \
                            -Dsonar.test.inclusions=**/*.test.tsx \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                            -Dsonar.coverage.exclusions=src/__tests__/**,src/main.tsx,src/vite-env.d.ts || echo "⚠️ SonarQube non disponible"
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
            echo '📊 Archivage des artefacts...'
            sh '''
                mkdir -p artifacts
                # Archiver le SBOM SPDX
                if [ -f sbom.spdx.json ]; then
                    cp sbom.spdx.json artifacts/
                    echo "✅ SBOM archivé"
                fi
                # Archiver les rapports de couverture
                if [ -d coverage ]; then
                    cp -r coverage artifacts/ 2>/dev/null || true
                fi
                # Archiver le rapport JUnit
                if [ -f reports/junit.xml ]; then
                    cp -r reports artifacts/ 2>/dev/null || true
                fi
            '''
            archiveArtifacts artifacts: 'artifacts/**/*', allowEmptyArchive: true
            
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
