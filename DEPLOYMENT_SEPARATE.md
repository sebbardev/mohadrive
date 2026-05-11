# Guide de Déploiement Séparé MohaDrive (Sans Docker)
## Laravel sur Hostinger + Next.js sur Vercel

## Architecture Recommandée
- **Frontend**: Next.js 14 déployé sur Vercel
- **Backend**: Laravel 12 API déployé sur Hostinger (hébergement web traditionnel)
- **Base de données**: MySQL sur Hostinger
- **Communication**: API REST entre frontend et backend

---

## Étape 1: Préparation du Backend Laravel pour Hostinger

### 1.1 Configuration CORS
Ajoutez la configuration CORS dans `backend/config/cors.php`:

```php
<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://votre-domaine-vercel.vercel.app',
        'https://votre-domaine-personnalise.com',
        'http://localhost:3000',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
    'max_age' => 0,
];
```

### 1.2 Variables d'Environnement Production
Créez `backend/.env.production`:

```env
APP_NAME=MOHADRIVE
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine-hostinger.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=mohadrive_db
DB_USERNAME=mohadrive_user
DB_PASSWORD=votre_mot_de_passe_secure

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.votre-domaine-hostinger.com

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail Resend
MAIL_MAILER=resend
RESEND_API_KEY=re_votre_clé_api_production
MAIL_FROM_ADDRESS="noreply@votre-domaine-hostinger.com"
MAIL_FROM_NAME="MOHADRIVE"

# Sécurité
SANCTUM_STATEFUL_DOMAINS=https://votre-domaine-vercel.vercel.app
```

### 1.3 Configuration API Routes
Assurez-vous que `backend/routes/api.php` contient:

```php
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Vos routes API ici
Route::apiResource('vehicles', App\Http\Controllers\Api\VehicleController::class);
Route::apiResource('reservations', App\Http\Controllers\Api\ReservationController::class);
Route::apiResource('customers', App\Http\Controllers\Api\CustomerController::class);
```

---

## Étape 2: Déploiement Laravel sur Hostinger

### 2.1 Prérequis Hostinger
- Plan Business Hosting ou supérieur
- Accès SSH activé
- Base de données MySQL créée
- Domaine configuré

### 2.2 Déploiement via SSH (Sans Docker)

```bash
# Connexion SSH
ssh user@votre-domaine-hostinger.com

# Navigation vers le répertoire web
cd public_html

# Clone du repository (branche backend uniquement)
git clone --branch main --single-branch https://github.com/votre-username/MohaDrive.git api
cd api/backend

# Installation dépendances PHP
composer install --optimize-autoloader --no-dev --no-interaction

# Configuration environnement
cp .env.production.example .env
# Éditez .env avec vos valeurs de production
php artisan key:generate --force

# Permissions importantes pour Hostinger
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 644 storage/logs/*.log

# Optimisation production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force --no-interaction

# Nettoyage
php artisan cache:clear
php artisan config:clear

# Vérification
php artisan about
php artisan route:list
```

### 2.3 Configuration Virtual Host
Créez `.htaccess` dans le répertoire `backend/public`:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

# Headers CORS
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "https://votre-domaine-vercel.vercel.app"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>
```

---

## Étape 3: Préparation du Frontend Next.js pour Vercel

### 3.1 Configuration API URL
Créez `next.config.js` optimisé pour Vercel:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production API URL
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://votre-domaine-hostinger.com/api',
  },

  // Images optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "votre-domaine-hostinger.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Static optimization
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
```

### 3.2 Variables d'Environnement Vercel
Dans le dashboard Vercel > Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://votre-domaine-hostinger.com/api
NEXT_PUBLIC_APP_NAME=MOHADRIVE
NEXT_PUBLIC_APP_URL=https://votre-domaine-vercel.vercel.app
```

### 3.3 Configuration API Client
Créez `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
```

---

## Étape 4: Déploiement sur Vercel

### 4.1 Installation Vercel CLI
```bash
npm i -g vercel
```

### 4.2 Déploiement
```bash
# Depuis la racine du projet
vercel --prod

# Ou connectez votre repository GitHub à Vercel pour déploiement automatique
```

### 4.3 Configuration du Projet Vercel
- Connectez votre repository GitHub
- Configurez les variables d'environnement
- Activez le déploiement automatique sur `git push`
- Configurez votre domaine personnalisé si nécessaire

---

## Étape 5: Tests et Validation

### 5.1 Test API Backend
```bash
# Test local
curl -X GET https://votre-domaine-hostinger.com/api/user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 5.2 Test Frontend
Visitez `https://votre-domaine-vercel.vercel.app` et vérifiez:
- Connexion à l'API
- Authentification
- CRUD operations

### 5.3 Monitoring
- **Backend**: Logs Hostinger + Laravel Telescope
- **Frontend**: Analytics Vercel + erreurs browser

---

## Sécurité

### Backend Laravel
- HTTPS obligatoire
- CORS configuré
- Rate limiting sur les routes API
- Validation des inputs
- Sanitization des données

### Frontend Next.js
- Variables d'environnement côté client uniquement
- Headers de sécurité
- Validation côté client + serveur
- Protection XSS

---

## Maintenance

### Mises à jour (Sans Docker)
```bash
# Backend Hostinger
cd public_html/api/backend
git pull origin main
composer install --optimize-autoloader --no-dev --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force --no-interaction

# Permissions après mise à jour
chmod -R 755 storage bootstrap/cache

# Frontend Vercel (automatique avec git push)
```

### Backup
- Base de données: Backup automatique Hostinger
- Fichiers: Backup régulier du storage Laravel

---

## Support

En cas de problème:
1. Vérifiez les logs des deux plateformes
2. Testez les endpoints API avec Postman/curl
3. Vérifiez la configuration CORS
4. Validez les variables d'environnement
