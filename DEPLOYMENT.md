# Guide de Déploiement MohaDrive sur Hostinger

## Architecture
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Laravel 12 + PHP 8.2
- **Base de données**: MySQL 8.0
- **Cache**: Redis 7
- **Web Server**: Nginx + PHP-FPM

## Prérequis Hostinger

1. **Plan Hostinger**: Business Hosting ou Cloud Hosting avec support Docker
2. **Domaine**: Configuré pour pointer vers Hostinger
3. **Accès SSH**: Activé dans votre panel Hostinger

## Étapes de Déploiement

### 1. Configuration Initiale sur Hostinger

```bash
# Connectez-vous via SSH
ssh user@votre-domaine.com

# Clonez votre repository
git clone https://github.com/votre-username/MohaDrive.git
cd MohaDrive

# Configurez les variables d'environnement
cp backend/.env.example backend/.env
```

### 2. Variables d'Environnement

Configurez `backend/.env` avec les valeurs de production :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_HOST=mysql
DB_DATABASE=mohadrive
DB_USERNAME=mohadrive_user
DB_PASSWORD=votre_mot_de_passe_db

RESEND_API_KEY=votre_clé_resend
MAIL_FROM_ADDRESS="noreply@votre-domaine.com"
```

### 3. Déploiement avec Docker

```bash
# Lancez les services
docker-compose up -d

# Exécutez les migrations
docker-compose exec php php artisan migrate --force

# Optimisez l'application
docker-compose exec php php artisan config:cache
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache
```

### 4. Configuration GitHub Actions (Déploiement Automatique)

Dans GitHub > Settings > Secrets, ajoutez :

- `HOSTINGER_HOST`: IP ou domaine de votre serveur
- `HOSTINGER_USER`: Nom d'utilisateur SSH
- `HOSTINGER_SSH_KEY`: Votre clé SSH privée
- `NEXT_PUBLIC_API_URL`: URL de votre API en production
- `PRODUCTION_URL`: URL complète de votre site
- `DB_PASSWORD`: Mot de passe de la base de données

## Déploiement Automatique

Chaque `git push` sur la branche `main` déclenchera :

1. **Build** du frontend Next.js
2. **Installation** des dépendances PHP
3. **Déploiement** via SSH sur Hostinger
4. **Redémarrage** des services Docker
5. **Migration** de la base de données
6. **Cache** optimisation
7. **Vérification** santé du site

## Commandes Utiles

```bash
# Vérifier les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart php

# Accéder au conteneur PHP
docker-compose exec php bash

# Mettre à jour le code
git pull && docker-compose up -d --build
```

## Sécurité

- Les mots de passe sont dans les variables d'environnement
- Clés SSH utilisées pour le déploiement
- Headers de sécurité configurés dans Nginx
- Cache activé pour les assets statiques

## Monitoring

- Health check automatique après déploiement
- Logs disponibles via `docker-compose logs`
- Surveillance de l'espace disque et ressources

## Support

En cas de problème :

1. Vérifiez les logs : `docker-compose logs`
2. Validez la configuration : `docker-compose config`
3. Testez localement avant de déployer
4. Contactez le support Hostinger si problème infrastructure
