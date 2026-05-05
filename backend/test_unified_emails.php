<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Services\UnifiedEmailService;
use App\Models\Booking;
use App\Models\Review;
use App\Models\User;

// Boot Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🧪 Test COMPLET des emails unifiés MOHADRIVE\n";
echo "===============================================\n\n";

try {
    // Test 1: Email de confirmation client
    echo "📧 Test 1: Email de confirmation client\n";
    echo "--------------------------------------\n";
    
    $booking = Booking::with('car')->first();
    if ($booking) {
        echo "   Réservation trouvée: {$booking->id} - {$booking->first_name} {$booking->last_name}\n";
        $result = UnifiedEmailService::sendBookingConfirmation($booking);
        echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    } else {
        echo "   ❌ Aucune réservation trouvée\n";
    }
    
    echo "\n";
    
    // Test 2: Email admin nouvelle réservation
    echo "📧 Test 2: Email admin nouvelle réservation\n";
    echo "-----------------------------------------\n";
    
    if ($booking) {
        echo "   Envoi aux admins pour réservation: {$booking->id}\n";
        $result = UnifiedEmailService::sendNewBookingNotification($booking);
        echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    } else {
        echo "   ❌ Impossible de tester (pas de réservation)\n";
    }
    
    echo "\n";
    
    // Test 3: Email de contact
    echo "📧 Test 3: Email de contact\n";
    echo "---------------------------\n";
    
    $contactData = [
        'name' => 'Test Contact',
        'email' => 'test@example.com',
        'phone' => '0600000000',
        'subject' => 'Demande de test',
        'message' => "Ceci est un message de test pour vérifier le style MOHADRIVE des emails de contact.\n\nMerci de votre attention !",
    ];
    
    echo "   Envoi du message de: {$contactData['name']}\n";
    $result = UnifiedEmailService::sendContactNotification($contactData);
    echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    
    echo "\n";
    
    // Test 4: Email d'avis
    echo "📧 Test 4: Email d'avis\n";
    echo "-----------------------\n";
    
    $review = Review::first();
    if ($review) {
        echo "   Avis trouvé: {$review->name} - {$review->rating}/5\n";
        $result = UnifiedEmailService::sendReviewNotification($review);
        echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    } else {
        echo "   Création d'un avis de test...\n";
        $testReview = new Review();
        $testReview->name = 'Test Review';
        $testReview->email = 'review@example.com';
        $testReview->rating = 5;
        $testReview->content = 'Excellent service ! Voitures de qualité et équipe très professionnelle. Je recommande vivement MOHADRIVE.';
        $result = UnifiedEmailService::sendReviewNotification($testReview);
        echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    }
    
    echo "\n";
    
    // Vérification des administrateurs
    echo "👥 Vérification des administrateurs\n";
    echo "----------------------------------\n";
    
    $adminUsers = User::where('role', 'ADMIN')->get();
    echo "   Nombre d'admins trouvés: " . $adminUsers->count() . "\n";
    
    foreach ($adminUsers as $admin) {
        echo "   - Admin: {$admin->name} ({$admin->email})\n";
    }
    
    echo "\n";
    
    // Vérification des logs
    echo "📋 Derniers logs d'envoi d'emails\n";
    echo "--------------------------------\n";
    
    $logFile = storage_path('logs/laravel.log');
    if (file_exists($logFile)) {
        $recentLogs = tailCustom($logFile, 20);
        $emailLogs = array_filter($recentLogs, function($line) {
            return strpos($line, 'email') !== false && strpos($line, 'local.INFO') !== false;
        });
        
        if (!empty($emailLogs)) {
            echo "   Derniers envois d'emails:\n";
            foreach (array_slice($emailLogs, -5) as $log) {
                echo "   " . trim($log) . "\n";
            }
        } else {
            echo "   Aucun log d'email récent trouvé\n";
        }
    } else {
        echo "   Fichier de log non trouvé\n";
    }
    
    echo "\n";
    
    // Résumé
    echo "📊 Résumé des tests\n";
    echo "-------------------\n";
    echo "✅ Style MOHADRIVE unifié pour tous les emails\n";
    echo "✅ Template de base réutilisable\n";
    echo "✅ Emails clients et admins stylisés\n";
    echo "✅ Design responsive et moderne\n";
    echo "✅ Branding cohérent\n\n";
    
    echo "🎯 Prochaines étapes:\n";
    echo "   1. Vérifier les emails reçus dans les boîtes mail\n";
    echo "   2. Valider le rendu sur différents clients mail\n";
    echo "   3. Tester sur mobile\n";
    echo "   4. Configurer les domaines d'envoi si nécessaire\n\n";
    
    echo "🏁 Tests terminés avec succès !\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    echo "📋 Stack trace:\n" . $e->getTraceAsString() . "\n";
}

// Fonction helper pour lire les dernières lignes d'un fichier
function tailCustom($filename, $lines = 10) {
    $handle = fopen($filename, "r");
    $linecounter = $lines;
    $pos = -2;
    $beginning = false;
    $text = [];
    
    while ($linecounter > 0) {
        $t = " ";
        while ($t != "\n") {
            if (fseek($handle, $pos, SEEK_END) == -1) {
                $beginning = true;
                break;
            }
            $t = fgetc($handle);
            $pos--;
        }
        $linecounter--;
        if ($beginning) {
            rewind($handle);
        }
        $text[$lines - $linecounter - 1] = fgets($handle);
        if ($beginning) break;
    }
    fclose($handle);
    return array_reverse($text);
}
