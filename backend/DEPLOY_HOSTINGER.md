# Déploiement Laravel sur Hostinger

## 🚀 Étapes de déploiement

### 1. Configuration du domaine/sous-domaine

Dans Hostinger, configure :
- **Domaine principal** : `api.mohadrive.com` (ou un sous-domaine)
- **Pointage** : Dossier `/public` de Laravel

### 2. Variables d'environnement (Panel Hostinger)

Va dans **Avancé** → **Variables d'environnement** et ajoute :

```
APP_NAME=MOHADRIVE
APP_ENV=production
APP_KEY=base64:votre_cle_ici
APP_DEBUG=false
APP_URL=https://api.mohadrive.com

# Database (crée d'abord la BDD dans Hostinger)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mohadrive_db
DB_USERNAME=root
DB_PASSWORD=votre_mdp_bdd

# Session & Cache (fichier pour Hostinger shared)
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Mail (Resend)
MAIL_MAILER=resend
RESEND_API_KEY=re_votre_cle_resend
MAIL_FROM_ADDRESS=contact@mohadrive.com
MAIL_FROM_NAME=MOHADRIVE

# CORS pour Next.js
FRONTEND_URL=https://mohadrive.com
```

### 3. Upload des fichiers

**Méthode 1 : Git (recommandée)**
```bash
# Dans Hostinger terminal
cd /home/u975287166/domains/api.mohadrive.com
git clone https://github.com/sebbardev/mohadrive.git .
cd backend
composer install --no-dev --optimize-autoloader
```

**Méthode 2 : FTP**
- Zip le dossier `backend` (sans `vendor/`)
- Upload et dézip dans `/domains/api.mohadrive.com/`
- Upload `vendor/` séparément

### 4. Configuration post-déploiement

```bash
# Générer la clé APP_KEY
php artisan key:generate --force

# Optimiser pour production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migrations
php artisan migrate --force

# Storage link
php artisan storage:link
```

### 5. Permissions

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod -R 644 .env
```

### 6. Configuration .htaccess (déjà prêt)

Le fichier `public/.htaccess` gère :
- Redirection vers `index.php`
- Headers Authorization pour Sanctum
- Protection des fichiers sensibles

### 7. CORS Configuration

Vérifier dans `config/cors.php` que `FRONTEND_URL` est configuré :
```php
'allowed_origins' => [env('FRONTEND_URL', 'https://mohadrive.com')],
```

## ✅ Vérification

Test l'API avec :
```bash
curl https://api.mohadrive.com/api/voitures
```

## 🔧 Dépannage

| Problème | Solution |
|----------|----------|
| 500 Internal Server Error | Vérifier `storage/logs/laravel.log` |
| CORS errors | Vérifier `FRONTEND_URL` dans .env |
| 404 Not Found | Vérifier le .htaccess |
| Database connection | Vérifier les credentials MySQL |

## 📋 Checklist avant déploiement

- [ ] Clé `APP_KEY` générée
- [ ] Base de données créée sur Hostinger
- [ ] Variables d'environnement configurées
- [ ] `APP_DEBUG=false` en production
- [ ] `FRONTEND_URL` pointe vers Vercel
- [ ] `RESEND_API_KEY` configuré
- [ ] Dossier `storage` writable (755)
- [ ] `vendor` uploadé complet
