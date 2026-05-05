# Configuration Email MOHADRIVE

## 🔧 **Étapes pour corriger l'envoi d'emails**

### 1. **Mettre à jour le fichier .env**

Copiez `.env.example` vers `.env` et modifiez ces lignes :

```bash
# Dans votre terminal
cp .env.example .env
```

Puis éditez `.env` avec ces valeurs :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@mohadrive.ma"
MAIL_FROM_NAME="MOHADRIVE"
```

### 2. **Configuration Gmail (recommandé)**

1. **Activer 2FA sur votre compte Gmail**
2. **Générer un App Password** :
   - Allez dans : `Compte Google → Sécurité → Mot de passe des applications`
   - Créez un nouveau mot de passe pour "MohaDrive"
   - Copiez ce mot de passe (16 caractères)

### 3. **Configuration alternatives**

#### **Option A : Mailtrap (pour développement)**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre-username-mailtrap
MAIL_PASSWORD=votre-password-mailtrap
MAIL_FROM_ADDRESS="noreply@mohadrive.ma"
```

#### **Option B : Resend (recommandé pour production)**
```env
MAIL_MAILER=resend
MAIL_RESEND_API_KEY=re_votre_cle_api
MAIL_FROM_ADDRESS="noreply@mohadrive.ma"
```

### 4. **Tester la configuration**

Créez un fichier de test :

```php
// test_email.php
<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    Mail::raw('Test email content', function ($message) {
        $message->to('votre-email@test.com')
                ->subject('Test Email MOHADRIVE')
                ->from('noreply@mohadrive.ma', 'MOHADRIVE');
    });
    
    echo "✅ Email envoyé avec succès !";
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage();
}
```

### 5. **Redémarrer les services**

```bash
php artisan config:cache
php artisan cache:clear
php artisan queue:restart
```

## 🔍 **Dépannage**

### **Erreurs communes :**

1. **"Message non distribué"**
   - Vérifiez que l'adresse email de destination existe
   - Changez `admin@car-rental.com` vers `admin@mohadrive.ma`

2. **"Authentication failed"**
   - Utilisez un App Password Gmail (pas votre mot de passe normal)
   - Vérifiez le 2FA est activé

3. **"Connection timed out"**
   - Vérifiez les ports : 587 pour TLS, 465 pour SSL
   - Testez avec telnet : `telnet smtp.gmail.com 587`

4. **"550 Sender Rejected"**
   - Vérifiez que `MAIL_FROM_ADDRESS` est autorisé
   - Utilisez une adresse email vérifiée

### **Commandes utiles :**

```bash
# Vider les logs d'emails
php artisan log:clear

# Voir les logs récents
tail -f storage/logs/laravel.log

# Tester la configuration mail
php artisan tinker
>>> Mail::raw('test', fn($m) => $m->to('test@example.com'));
```

## 📧 **Configuration finale recommandée**

Pour la production, utilisez cette configuration :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_votre_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@mohadrive.ma"
MAIL_FROM_NAME="MOHADRIVE"
```

## ✅ **Vérification**

Après configuration, testez avec :

1. **Email de test simple**
2. **Email de réservation**
3. **Email admin**

Les emails devraient maintenant s'envoyer correctement avec le nouveau design MOHADRIVE !
