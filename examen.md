# Épreuve certifiante : Piloter l'intégration et le déploiement continu dans le Système d'Information (SI)

L'entreprise **TaskCamel** dispose d'une application interne appelée **TaskList**.
Cette application permet aux employés de gérer leurs tâches quotidiennes : création, consultation, modification et suppression de tâches.

Afin d'améliorer la qualité des livraisons, de réduire les erreurs humaines et d'accélérer les mises en production, l'entreprise TaskCamel souhaite industrialiser ses livraisons logicielles grâce à la mise en place de chaînes CI/CD avec Jenkins.

Vous êtes chargé de mettre en place deux chaînes CI/CD distinctes :

- une chaîne CI/CD pour le **backend** ;
- une chaîne CI/CD pour le **frontend**.

Ces chaînes doivent intégrer des vérifications automatiques : tests, qualité de code, sécurité, génération des livrables, construction des images Docker et publication sur Docker Hub.

---

## Partie A. Mise en place des pipelines CI/CD

Vous devez repartir des projets suivants :

- **Backend** : https://github.com/Educentre-Kits/cicd-tasklist-backend
- **Frontend** : https://github.com/Educentre-Kits/cicd-tasklist-frontend

Vous devez créer vos propres dépôts personnels publics à partir de ces projets en faisant un **fork**.

Les tests unitaires doivent être ajoutés dans vos dépôts personnels publics et intégrés dans les chaînes CI/CD Jenkins.

> **Attention** : l'utilisation d'un ancien dépôt, d'un projet déjà existant ou de commits antérieurs au jour de l'évaluation est interdite. La date de création de votre dépôt GitHub personnel public sera contrôlée.

### Travail attendu

Vous devez mettre en place deux pipelines Jenkins distincts :

1. écrire des tests unitaires pour chaque projet ;
2. un pipeline CI/CD pour le backend ;
3. un pipeline CI/CD pour le frontend.

Les pipelines doivent être définis à l'aide d'un fichier `Jenkinsfile` présent dans chaque dépôt.

### Vérification des commits

Votre rapport doit obligatoirement contenir :

- une capture d'écran des commits du dépôt backend ;
- une capture d'écran des commits du dépôt frontend.

Ces captures sont essentielles, car elles permettent de vérifier que le travail a bien été réalisé le jour de l'évaluation.

> Les commits doivent être **datés du jour de l'évaluation**. Les commits antérieurs ne seront pas considérés comme valides pour justifier le travail demandé.
>
> L'utilisation d'un dépôt déjà existant ou d'un travail préparé à l'avance est **interdite**.

---

## Partie B. Rapport de projet

Vous devez rédiger un rapport de projet au format **PDF**.

Le rapport doit être clair, structuré et illustré. Il doit être organisé selon les compétences évaluées.

Chaque section du rapport doit contenir :

- le titre de la compétence ;
- une description de ce qui a été réalisé ;
- une ou plusieurs captures d'écran ;
- les fichiers ou extraits de configuration utiles ;
- une justification technique.

Les sections ci-dessous sont **obligatoires** et serviront directement à la notation.

### Structure obligatoire du rapport

#### 1. C16.1 — Le pipeline est opérationnel

Dans cette section, vous devez démontrer que les deux pipelines Jenkins sont opérationnels.

Vous devez présenter :

- le pipeline Jenkins du backend ;
- le pipeline Jenkins du frontend ;
- les principales étapes de chaque pipeline ;
- une capture d'écran de l'exécution réussie du pipeline backend ;
- une capture d'écran de l'exécution réussie du pipeline frontend ;
- les fichiers Jenkinsfile utilisés.

Les pipelines doivent s'exécuter correctement et automatiser les étapes essentielles d'intégration et de livraison continue.

#### 2. C16.2 — Les livrables sont pleinement fonctionnels

Dans cette section, vous devez démontrer que les livrables générés par les pipelines sont exploitables.

Vous devez présenter :

- le build du backend ;
- le build du frontend ;
- la construction de l'image Docker backend ;
- la construction de l'image Docker frontend ;
- la publication des images sur Docker Hub ;
- une capture d'écran montrant les images publiées sur Docker Hub.

Les livrables doivent être fonctionnels, cohérents avec le projet et reproductibles à partir des pipelines Jenkins.

#### 3. C17.1 — Tous les tests sont correctement intégrés

Dans cette section, vous devez démontrer que les tests sont bien intégrés dans les pipelines CI/CD.

Vous devez présenter :

- les tests unitaires ajoutés au backend ;
- les tests unitaires ajoutés au frontend ;
- l'étape Jenkins qui exécute les tests backend ;
- l'étape Jenkins qui exécute les tests frontend ;
- les rapports ou résultats de tests générés ;
- une capture d'écran des tests exécutés dans Jenkins.

> Les tests doivent être lancés automatiquement par les pipelines. Un test exécuté uniquement à la main ne suffit pas à valider cette compétence.

#### 4. C17.2 — Les tests sont fonctionnels

Dans cette section, vous devez démontrer que les tests vérifient réellement le comportement de l'application.

Vous devez expliquer :

- capture d'écran de la couverture de tests pour le backend ;
- capture d'écran de la couverture de tests pour le frontend.

Les tests doivent permettre de vérifier des comportements réels de l'application.

#### 5. C18.1 — Les pratiques de sécurité sont correctement appliquées

Dans cette section, vous devez démontrer que les bonnes pratiques de sécurité sont prises en compte dans vos chaînes CI/CD.

Vous devez présenter :

- la gestion des credentials dans Jenkins ;
- l'absence de secrets en clair dans le code source ;
- les analyses de sécurité intégrées dans les pipelines ;
- les commandes ou outils utilisés ;
- les captures d'écran des étapes de sécurité dans Jenkins.

> Les identifiants Docker Hub, les tokens SonarQube et les autres secrets ne doivent jamais apparaître en clair dans les fichiers du projet. Les credentials doivent être gérés via Jenkins ou un mécanisme sécurisé équivalent.

#### 6. C18.2 — Le périmètre des vulnérabilités est suffisamment couvert

Dans cette section, vous devez montrer que votre analyse de sécurité couvre un périmètre suffisant.

Vous devez présenter :

- capture d'écran de l'analyse des images Docker avec **Trivy** ;
- capture d'écran de la génération du **SBOM** au format **SPDX**.

#### 7. C19.1 — Conformité aux pratiques Clean Code

Dans cette section, vous devez démontrer que le code ajouté respecte les bonnes pratiques de développement.

Vous devez présenter :

- capture d'écran des résultats d'analyse de qualité de code par **SonarQube**.

#### 8. C19.2 — Maintenabilité du code

Dans cette section, vous devez démontrer que le projet peut être repris, compris et modifié facilement.

Vous devez présenter :

- le rôle des fichiers `Jenkinsfile` ;
- le rôle des fichiers `sonar-project.properties`.

#### 9. Documentation technique

Vous devez fournir une documentation technique, incluse dans votre rapport.

Cette documentation doit expliquer :

- l'architecture générale du projet ;
- les prérequis nécessaires ;
- les outils utilisés ;
- la configuration Jenkins ;
- la configuration SonarQube ;
- la configuration Docker ;
- la stratégie de tests ;
- la stratégie de sécurité ;
- la génération des livrables.

La documentation doit être suffisamment claire pour permettre à un autre développeur de comprendre l'environnement technique du projet.

#### 10. Runbook

Vous devez également fournir un runbook dans votre rapport.

Le runbook est un guide opérationnel permettant de relancer, vérifier ou dépanner le projet. Il doit contenir :

- les prérequis ;
- les étapes d'installation ;
- les commandes utiles ;
- la procédure de lancement des pipelines Jenkins ;
- la procédure de vérification des livrables ;
- la procédure de vérification des images Docker ;
- les erreurs possibles ;
- les solutions ou pistes de résolution.

Le runbook doit être pratique, concret et exploitable.

#### 11. Annexes obligatoires

Le rapport doit contenir une section Annexes avec les liens suivants :

- lien GitHub du projet backend contenant les tests unitaires ;
- lien GitHub du projet frontend contenant les tests unitaires ;
- lien Docker Hub de l'image backend ;
- lien Docker Hub de l'image frontend.

> Ces liens doivent être accessibles au correcteur selon les modalités indiquées pendant l'évaluation. Ces liens doivent donc être **publics**.

---

## Partie C. Modalités de rendu

Vous devez rendre les documents et fichiers suivants :

- `rapport.pdf` ;
- le `Jenkinsfile` du backend ;
- le fichier `sonar-project.properties` du backend ;
- le fichier `sbom-spdx.json` du backend ;
- le `Jenkinsfile` du frontend ;
- le fichier `sonar-project.properties` du frontend ;
- le fichier `sbom-spdx.json` du frontend.

### Structure du fichier ZIP attendu

Le rendu doit être déposé sur Moodle sous la forme d'un fichier ZIP unique.

La structure du ZIP doit être exactement la suivante :

```
rendus/
├── rapport.pdf
├── backend/
│   ├── Jenkinsfile
│   ├── sonar-project.properties
│   └── sbom-spdx.json
└── frontend/
    ├── Jenkinsfile
    ├── sonar-project.properties
    └── sbom-spdx.json
```

> Tout fichier manquant, mal nommé ou placé au mauvais endroit pourra entraîner une pénalité.

### Anonymisation obligatoire

Tous les éléments rendus doivent être anonymisés.

Les documents ne doivent contenir :

- ni nom ;
- ni prénom ;
- ni adresse e-mail personnelle ;
- ni identifiant nominatif visible ;
- ni information permettant d'identifier directement l'étudiant.

Les captures d'écran doivent également être anonymisées. Les informations personnelles visibles dans les captures doivent être masquées à l'aide d'un bloc noir ou d'un floutage lisible.

### Modalités de dépôt

Le fichier ZIP unique doit être déposé sur Moodle.

> Le non-respect de la structure demandée, l'absence d'anonymisation, l'absence de captures d'écran obligatoires ou l'utilisation d'un dépôt non conforme pourra être pénalisé.

### Rappel des points de vigilance

Avant le dépôt, vérifiez que :

- [ ] les deux dépôts GitHub ont bien été créés à partir des projets fournis et sont publics ;
- [ ] les commits sont datés du jour de l'évaluation ;
- [ ] les tests unitaires sont présents dans les deux projets ;
- [ ] les tests sont exécutés automatiquement dans Jenkins ;
- [ ] les deux pipelines Jenkins fonctionnent ;
- [ ] les images Docker backend et frontend sont publiées sur Docker Hub ;
- [ ] les fichiers `Jenkinsfile`, `sonar-project.properties` et `sbom-spdx.json` sont bien fournis pour le backend et le frontend ;
- [ ] les captures d'écran sont présentes et anonymisées ;
- [ ] le ZIP respecte exactement la structure demandée.
