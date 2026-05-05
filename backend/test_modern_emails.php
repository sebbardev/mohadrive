<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Booking;
use App\Services\ModernEmailService;

echo "🎨 Test d'emails modernes style MOHADRIVE\n";
echo "==========================================\n\n";

// Test 1: Email de confirmation moderne
echo "1. Test email confirmation moderne:\n";
try {
    $booking = Booking::with('car')->first();
    if ($booking) {
        echo "   Réservation: {$booking->id} - {$booking->first_name} {$booking->last_name}\n";
        echo "   Email: {$booking->email}\n";
        echo "   Véhicule: {$booking->car->brand} {$booking->car->model}\n";
        
        $result = ModernEmailService::sendBookingConfirmation($booking);
        echo "   Résultat: " . ($result ? "✅ Succès moderne" : "❌ Échec") . "\n";
    } else {
        echo "   ❌ Aucune réservation trouvée\n";
    }
} catch (Exception $e) {
    echo "   ❌ Erreur: " . $e->getMessage() . "\n";
}

echo "\n";

// Vérification de la configuration
echo "2. Configuration actuelle:\n";
echo "   MAIL_MAILER: " . env('MAIL_MAILER', 'non défini') . "\n";
echo "   RESEND_API_KEY: " . (env('RESEND_API_KEY') ? '✅ Configuré' : '❌ Non configuré') . "\n";
echo "   MAIL_FROM_ADDRESS: " . env('MAIL_FROM_ADDRESS', 'non défini') . "\n";
echo "   MAIL_FROM_NAME: " . env('MAIL_FROM_NAME', 'non défini') . "\n";

echo "\n";

// Comparaison avec ancien service
echo "3. Comparaison des styles:\n";
echo "   🆕 ModernEmailService: Design moderne, variables CSS, composants réutilisables\n";
echo "   🔄 UnifiedEmailService: Design classique, styles inline\n";
echo "   📱 Responsive: Les deux services supportent le mobile\n";
echo "   🎨 Couleurs: Les deux utilisent la palette MOHADRIVE\n";

echo "\n🎉 Test terminé !\n";
echo "📝 Consultez le dashboard Resend pour voir l'email moderne envoyé\n";
echo "🔗 https://resend.com/dashboard\n";
echo "\n💡 Pour utiliser le nouveau service:\n";
echo "   Remplacez UnifiedEmailService::sendBookingConfirmation() par ModernEmailService::sendBookingConfirmation()\n";
echo "   dans vos contrôleurs pour bénéficier du design moderne.\n";
