# Backend Premium Car Rental (Laravel 12)

Ce dossier contient le backend robuste développé avec Laravel pour la gestion du parc automobile et des réservations.

## Architecture
- **Framework** : Laravel 12.x
- **Base de données** : MySQL
- **Authentification** : Laravel Sanctum (API Tokens)
- **Validation** : Form Requests & Controllers
- **Audit** : Système de logs d'audit pour chaque action critique (CRUD véhicules, statuts réservations).

## Installation

1.  **Prérequis** : PHP 8.4+, Composer, MySQL.
2.  **Configuration** :
    ```bash
    cd backend
    cp .env.example .env
    ```
    Modifiez les variables `DB_*` dans le fichier `.env` avec vos identifiants MySQL.
3.  **Dépendances** :
    ```bash
    composer install
    php artisan key:generate
    ```
4.  **Migrations & Seed** :
    ```bash
    php artisan migrate
    ```

## API Endpoints

### Authentification
- `POST /api/login` : Connexion
- `POST /api/register` : Inscription
- `GET /api/me` : Profil actuel (protégé)
- `POST /api/logout` : Déconnexion (protégé)

### Véhicules
- `GET /api/cars` : Liste publique
- `GET /api/cars/{id}` : Détail public
- `POST /api/cars` : Ajouter (Admin uniquement)
- `PUT /api/cars/{id}` : Modifier (Admin uniquement)
- `DELETE /api/cars/{id}` : Supprimer (Admin uniquement)

### Réservations
- `GET /api/bookings` : Liste (Filtrable par date/statut pour Admin, réservations propres pour User)
- `POST /api/bookings` : Créer une réservation
- `PATCH /api/bookings/{id}` : Modifier le statut (Admin uniquement)

## Sécurité
- Protection contre les injections SQL via Eloquent ORM.
- Validation stricte des entrées via Laravel Validation.
- Autorisation basée sur les rôles (ADMIN/USER) intégrée aux contrôleurs.
- Audit Logs stockés en base de données pour la traçabilité.
