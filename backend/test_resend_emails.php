<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Booking;
use App\Services\UnifiedEmailService;

echo "🚀 Test d'envoi d'emails avec Resend\n";
echo "=====================================\n\n";

// Test 1: Email de confirmation de réservation
echo "1. Test email confirmation réservation:\n";
try {
    $booking = Booking::with('car')->first();
    if ($booking) {
        echo "   Réservation: {$booking->id} - {$booking->first_name} {$booking->last_name}\n";
        echo "   Email: {$booking->email}\n";
        echo "   Véhicule: {$booking->car->brand} {$booking->car->model}\n";
        
        $result = UnifiedEmailService::sendBookingConfirmation($booking);
        echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    } else {
        echo "   ❌ Aucune réservation trouvée\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Email de notification admin
echo "2. Test email notification admin:\n";
try {
    $booking = Booking::with('car')->first();
    if ($booking) {
        echo "   Envoi aux admins pour réservation: {$booking->id}\n";
        
        $result = UnifiedEmailService::sendNewBookingNotification($booking);
        echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    } else {
        echo "   ❌ Impossible de tester (pas de réservation)\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: Email de contact
echo "3. Test email contact:\n";
try {
    $contactData = [
        'name' => 'Test Resend User',
        'email' => 'test@resend.com',
        'phone' => '+212600000000',
        'subject' => 'Test gratuit Resend',
        'message' => 'Ceci est un test d\'envoi d\'email gratuit via Resend pour MOHADRIVE.'
    ];
    
    echo "   Envoi du message: {$contactData['name']}\n";
    $result = UnifiedEmailService::sendContactNotification($contactData);
    echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
} catch (Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 4: Email de réinitialisation mot de passe
echo "4. Test email réinitialisation mot de passe:\n";
try {
    $resetUrl = 'https://mohadrive.ma/admin/reset-password?token=test123&email=test@example.com';
    echo "   Envoi à: test@example.com\n";
    
    $result = UnifiedEmailService::sendPasswordReset('Test User', $resetUrl, 60);
    echo "   Résultat: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
} catch (Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n";

// Vérification de la configuration
echo "5. Configuration actuelle:\n";
echo "   MAIL_MAILER: " . env('MAIL_MAILER', 'non défini') . "\n";
echo "   RESEND_API_KEY: " . (env('RESEND_API_KEY') ? '✅ Configuré' : '❌ Non configuré') . "\n";
echo "   MAIL_FROM_ADDRESS: " . env('MAIL_FROM_ADDRESS', 'non défini') . "\n";
echo "   MAIL_FROM_NAME: " . env('MAIL_FROM_NAME', 'non défini') . "\n";

echo "\n🎉 Tests terminés !\n";
echo "📝 Consultez le dashboard Resend pour voir les emails envoyés\n";
echo "🔗 https://resend.com/dashboard\n";
