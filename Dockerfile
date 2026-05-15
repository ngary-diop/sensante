# 1. Image de base : Node.js 20 sur Alpine Linux
FROM node:20-alpine

# 2. Répertoire de travail dans le conteneur
WORKDIR /app

# 3. Copier les fichiers de dépendances EN PREMIER
COPY package.json package-lock.json ./

# 4. Installer les dépendances
RUN npm ci

# 5. Copier le reste du code source
COPY . .

# 6. Générer le client Prisma
RUN npx prisma generate

# 7. Compiler Next.js pour la production
RUN npm run build

# 8. Déclarer le port utilisé
EXPOSE 3000

# 9. Commande de démarrage
CMD ["npm", "start"]
