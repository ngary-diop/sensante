# 🛡️ SénSanté - Plateforme de Santé Communautaire

SénSanté est une application moderne de suivi médical conçue pour les agents de santé communautaire au Sénégal. Elle permet la gestion des patients, le suivi des consultations et propose une analyse assistée par Intelligence Artificielle (IA).

## 🚀 Fonctionnalités Clés

- **Tableau de Bord Bento** : Une interface moderne et intuitive pour visualiser les KPI en un coup d'œil.
- **Gestion des Patients** : Répertoire complet avec recherche en temps réel et filtrage géographique.
- **Diagnostics IA** : Analyse automatisée des symptômes pour assister les agents de santé.
- **Sécurité "Gardien"** : Protection robuste des données médicales et gestion des rôles (Agent, Médecin, Admin).
- **Design Premium** : Thème Blanc & Jaune Solaire inspiré de l'identité numérique moderne du Sénégal.

---

## 🛠️ Installation avec Docker (Recommandé)

Le projet est entièrement conteneurisé pour garantir un fonctionnement identique sur toutes les machines.

### 1. Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé.
- Un terminal (PowerShell ou Bash).

### 2. Lancement de l'application
Depuis la racine du projet, lancez la commande suivante :
```powershell
docker compose up -d --build
```
Cette commande va :
- Télécharger les images nécessaires (PostgreSQL, Node.js).
- Configurer la base de données.
- Compiler l'application Next.js.
- Lancer le serveur sur [http://localhost:3000](http://localhost:3000).

### 3. Initialisation des données (Seed)
Pour tester l'application avec des patients et des consultations de démonstration :
```powershell
docker compose exec app npx prisma db seed
```

---

## 🔑 Identifiants de Test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Gardien (Agent)** | `gardien@sensante.sn` | `gardien123` |
| **Médecin** | `medecin@sensante.sn` | `medecin123` |
| **Administrateur** | `admin@sensante.sn` | `password123` |

---

## 🏗️ Architecture Technique

- **Frontend** : Next.js 15+ (App Router), Tailwind CSS 4, Lucide React (Icônes).
- **Backend** : Next.js API Routes, Prisma ORM.
- **Base de données** : PostgreSQL 16.
- **Authentification** : NextAuth.js avec cryptage Bcrypt.
- **IA** : Intégration Groq Cloud (Llama 3).

---

## 📦 Commandes Utiles

- **Voir les logs** : `docker compose logs -f app`
- **Arrêter le projet** : `docker compose down`
- **Réinitialiser la BDD** : `docker compose exec app npx prisma migrate reset`
- **Explorer la BDD (Interface Web)** : 
  ```powershell
  docker compose exec app npx prisma studio
  ```
  *(Disponible ensuite sur http://localhost:5555)*

---

## 🤝 Contribution

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-feature`).
2. Committez vos changements avec des messages clairs en français.
3. Poussez sur votre branche (`git push origin feature/ma-feature`).
4. Ouvrez une Pull Request sur GitHub.

---

*Développé avec ❤️ pour la santé communautaire.*