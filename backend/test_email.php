<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Mail;
use App\Models\Booking;
use App\Models\Car;

// Boot Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🧪 Test d'envoi d'email de confirmation de réservation\n";
echo "=====================================================\n\n";

try {
    // Simuler une réservation existante ou en créer une pour le test
    $booking = Booking::with('car')->first();
    
    if (!$booking) {
        echo "❌ Aucune réservation trouvée en base de données.\n";
        echo "Création d'une réservation de test...\n";
        
        $car = Car::first();
        if (!$car) {
            echo "❌ Aucune voiture trouvée. Veuillez d'abord créer une voiture.\n";
            exit(1);
        }
        
        $booking = Booking::create([
            'car_id' => $car->id,
            'first_name' => 'Test',
            'last_name' => 'Client',
            'email' => 'sbbrhaythamcreetou@gmail.com',
            'phone' => '0600000000',
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(3),
            'location' => 'Agence Marrakech',
            'total_price' => 1500,
            'status' => 'PENDING',
        ]);
        
        $booking->load('car');
        echo "✅ Réservation de test créée (ID: {$booking->id})\n";
    }
    
    echo "📋 Détails de la réservation de test:\n";
    echo "   - Client: {$booking->first_name} {$booking->last_name}\n";
    echo "   - Email: {$booking->email}\n";
    echo "   - Véhicule: {$booking->car->brand} {$booking->car->model}\n";
    echo "   - Statut actuel: {$booking->status}\n\n";
    
    // Simuler la mise à jour du statut vers CONFIRMED
    echo "🔄 Simulation de la validation de la réservation...\n";
    
    $oldStatus = $booking->status;
    $booking->status = 'CONFIRMED';
    $booking->save();
    
    // Envoyer l'email de confirmation (même logique que dans le controller)
    if ($oldStatus !== 'CONFIRMED' && $booking->status === 'CONFIRMED') {
        echo "📧 Envoi de l'email de confirmation au client...\n";
        
        try {
            $car = $booking->car;
            
            Mail::raw(
                "Bonjour {$booking->first_name} {$booking->last_name},\n\n" .
                "Bonne nouvelle ! Votre demande de réservation pour le véhicule {$car->brand} {$car->model} a été acceptée par notre équipe.\n\n" .
                "Récapitulatif de votre location :\n" .
                "- Véhicule: {$car->brand} {$car->model}\n" .
                "- Prise en charge: " . \Illuminate\Support\Carbon::parse($booking->start_date)->format('d/m/Y à H:i') . "\n" .
                "- Dépôt: " . \Illuminate\Support\Carbon::parse($booking->end_date)->format('d/m/Y à H:i') . "\n" .
                "- Lieu: {$booking->location}\n" .
                "- Prix total: {$booking->total_price} MAD\n\n" .
                "Notre agent vous contactera sous peu pour finaliser les détails de la livraison.\n\n" .
                "Cordialement,\nL'équipe Premium Car Rental - MOHADRIVE",
                function ($message) use ($booking) {
                    $message->to($booking->email)
                            ->subject('✅ Réservation Confirmée - Premium Car Rental - MOHADRIVE (TEST)');
                }
            );
            
            echo "✅ Email envoyé avec succès à {$booking->email}\n";
            echo "📝 Vérifiez votre boîte de réception (y compris les spams)\n";
            
        } catch (\Exception $e) {
            echo "❌ Erreur lors de l'envoi de l'email: " . $e->getMessage() . "\n";
            echo "📋 Détails de l'erreur:\n";
            echo "   - Code: " . $e->getCode() . "\n";
            echo "   - Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
        }
    }
    
    // Restaurer le statut original
    $booking->status = $oldStatus;
    $booking->save();
    echo "\n🔄 Statut original de la réservation restauré.\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    echo "📋 Détails:\n";
    echo "   - Code: " . $e->getCode() . "\n";
    echo "   - Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n🏁 Test terminé.\n";
