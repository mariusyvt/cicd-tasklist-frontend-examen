FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build du projet
RUN npm run build

# Stage de production
FROM node:20-alpine

WORKDIR /app

# Installer un serveur HTTP simple
RUN npm install -g serve

# Copier les fichiers buildés depuis le stage builder
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Command pour servir l'app
CMD ["serve", "-s", "dist", "-l", "3000"]
