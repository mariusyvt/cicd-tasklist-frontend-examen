# TaskList Frontend - Pipeline CI/CD

## 📋 Configuration requise pour Jenkins

### 1. Credentials à créer dans Jenkins

#### DockerHub Credentials

- ID: `marius-dockerhub-credentials`
- Type: `Username with password`
- Username: `<votre-username-dockerhub>`
- Password: `<votre-token-dockerhub>`

#### SonarQube Token

- ID: `sonarqube-token`
- Type: `Secret text`
- Secret: `<votre-token-sonarqube>`

### 2. Outils à installer dans Jenkins

```
- Node.js (v20.13+)
- Docker
- Git
- SonarQube Scanner
- Trivy (pour la sécurité)
- CycloneDX (pour les SBOM)
```

### 3. Configuration de la tâche Jenkins

#### Créer un pipeline depuis SCM

1. **Type**: `Pipeline script from SCM`
2. **SCM**: `Git`
3. **Repository URL**: `https://github.com/mariusyvart/cicd-tasklist-frontend-examen.git`
4. **Branch**: `main`
5. **Script Path**: `Jenkinsfile`

### 4. Étapes du Pipeline

#### 🔍 Checkout

Récupère le code source depuis GitHub

#### 📥 Install Dependencies

Installe les dépendances npm avec `npm ci`

#### 🏗️ Build

Construit l'application React avec `npm run build`

#### ✅ Unit Tests

Exécute les tests unitaires avec couverture de code

- Rapport JUnit: `reports/junit.xml`
- Rapport de couverture: `coverage/index.html`
- Objectif: **≥ 70% de couverture**

#### 🔐 Security Scan - Trivy

Scanne les vulnérabilités dans les dépendances

- Rapport: `trivy-report.json`
- Sévérité: HIGH, CRITICAL

#### 📋 SBOM Generation

Génère un SBOM (Software Bill of Materials) au format SPDX

- Fichier: `sbom.spdx.json`

#### 🔍 SonarQube Analysis

Analyse la qualité du code avec SonarQube

- Configuration: `sonar-project.properties`
- Exclusions: Tests, fichier principal

#### 🐳 Build Docker Image

Construit l'image Docker multi-stage

- Base: `node:20-alpine`
- Tags:
  - `docker.io/muvay/marius-tasklist-frontend:${BUILD_NUMBER}`
  - `docker.io/muvay/marius-tasklist-frontend:latest`

#### 🔐 Docker Image Security Scan

Scanne l'image Docker pour les vulnérabilités

#### 📤 Push to DockerHub

Pousse les images vers DockerHub

- Authentification sécurisée via credentials

#### 📊 Archive Artifacts

Archive les artefacts du build:

- `dist/` (fichiers buildés)
- `trivy-report.json`
- `sbom.spdx.json`

### 5. Métriques de qualité

#### Tests

- **Couverture requise**: ≥ 70%
- **Rapport**: Coverage Report (HTML)

#### Sécurité

- **SBOM**: Format SPDX
- **Scan d'images**: Trivy
- **Scan du code**: SonarQube

#### Code

- **Quality Gate**: SonarQube
- **Standards**: Clean Code

### 6. Points importants

⚠️ **Ne JAMAIS**:

- Commiter les secrets en clair
- Partager les tokens Docker Hub ou SonarQube
- Désactiver la validation des certificats SSL

✅ **Toujours**:

- Utiliser Jenkins Credentials pour les secrets
- Vérifier la couverture de code (≥ 70%)
- Passer tous les tests avant production
- Scanner les images pour les vulnérabilités

### 7. Commandes locales

```bash
# Installer les dépendances
npm install

# Lancer les tests
npm run test:coverage

# Builder l'app
npm run build

# Vérifier la qualité SonarQube
sonar-scanner -Dsonar.host.url=http://localhost:9000 ...

# Scanned avec Trivy
trivy fs .
trivy image <image-name>
```

### 8. Variables d'environnement Jenkins

```
REGISTRY = docker.io
IMAGE_NAME = docker.io/muvay/marius-tasklist-frontend
IMAGE_TAG = ${BUILD_NUMBER}
SONAR_HOST_URL = http://localhost:9000
```

---

**Pipeline CI/CD Frontend - v1.0**
Dernière mise à jour: 2026-07-02
