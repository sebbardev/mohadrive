<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Mail;
use App\Models\Booking;
use App\Models\Car;

// Boot Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🧪 Test COMPLET d'envoi d'email de confirmation\n";
echo "===============================================\n\n";

try {
    // Trouver une réservation PENDING ou en créer une
    $booking = Booking::with('car')->where('status', 'PENDING')->first();
    
    if (!$booking) {
        echo "📝 Création d'une réservation PENDING pour le test...\n";
        
        $car = Car::first();
        if (!$car) {
            echo "❌ Aucune voiture trouvée. Créez d'abord une voiture.\n";
            exit(1);
        }
        
        $booking = Booking::create([
            'car_id' => $car->id,
            'first_name' => 'Test',
            'last_name' => 'Email',
            'email' => 'sbbrhaythamcreetou@gmail.com', // Email de test
            'phone' => '0600000000',
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(3),
            'location' => 'Agence Marrakech',
            'total_price' => 1500,
            'daily_price' => 500,
            'status' => 'PENDING',
        ]);
        
        $booking->load('car');
        echo "✅ Réservation PENDING créée (ID: {$booking->id})\n";
    } else {
        echo "✅ Réservation PENDING trouvée (ID: {$booking->id})\n";
    }
    
    echo "📋 Détails de la réservation:\n";
    echo "   - Client: {$booking->first_name} {$booking->last_name}\n";
    echo "   - Email: {$booking->email}\n";
    echo "   - Véhicule: {$booking->car->brand} {$booking->car->model}\n";
    echo "   - Statut: {$booking->status}\n";
    echo "   - Dates: " . \Illuminate\Support\Carbon::parse($booking->start_date)->format('d/m/Y') . " → " . \Illuminate\Support\Carbon::parse($booking->end_date)->format('d/m/Y') . "\n\n";
    
    // Test 1: Vérifier la configuration email
    echo "🔧 Test de configuration email...\n";
    $config = [
        'mailer' => config('mail.mailer'),
        'host' => config('mail.host'),
        'port' => config('mail.port'),
        'username' => config('mail.username'),
        'from_address' => config('mail.from.address'),
        'from_name' => config('mail.from.name'),
    ];
    echo "   - Mailer: {$config['mailer']}\n";
    echo "   - Host: {$config['host']}\n";
    echo "   - Port: {$config['port']}\n";
    echo "   - Username: {$config['username']}\n";
    echo "   - From: {$config['from_name']} <{$config['from_address']}>\n\n";
    
    // Test 2: Envoyer un email simple de test
    echo "📧 Test 1: Envoi d'un email simple de test...\n";
    try {
        Mail::raw(
            "Ceci est un email de test pour vérifier la configuration SMTP.\n\n" .
            "Envoyé depuis: MOHADRIVE Test Script\n" .
            "Date: " . now()->format('d/m/Y H:i:s') . "\n",
            function ($message) {
                $message->to('sbbrhaythamcreetou@gmail.com')
                        ->subject('🧪 Test Email Simple - MOHADRIVE');
            }
        );
        echo "✅ Email simple envoyé avec succès!\n";
    } catch (\Exception $e) {
        echo "❌ Erreur email simple: " . $e->getMessage() . "\n";
    }
    
    // Test 3: Simuler la validation de réservation
    echo "\n📧 Test 2: Simulation de validation de réservation...\n";
    
    $oldStatus = $booking->status;
    echo "   Changement de statut: {$oldStatus} → CONFIRMED\n";
    
    // Mettre à jour le statut
    $booking->status = 'CONFIRMED';
    $booking->save();
    
    // Envoyer l'email de confirmation (logique exacte du controller)
    if ($oldStatus !== 'CONFIRMED' && $booking->status === 'CONFIRMED') {
        echo "   Déclenchement de l'envoi d'email au client...\n";
        
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
                            ->subject('✅ Réservation Confirmée - Premium Car Rental - MOHADRIVE (TEST COMPLET)');
                }
            );
            
            echo "✅ Email de confirmation envoyé avec succès!\n";
            echo "📧 Destinataire: {$booking->email}\n";
            echo "📋 Sujet: Réservation Confirmée - Premium Car Rental - MOHADRIVE (TEST COMPLET)\n";
            
        } catch (\Exception $e) {
            echo "❌ Erreur envoi confirmation: " . $e->getMessage() . "\n";
            echo "📋 Détails erreur:\n";
            echo "   - Code: " . $e->getCode() . "\n";
            echo "   - Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
        }
    }
    
    // Test 4: Vérifier les logs Laravel
    echo "\n📋 Vérification des logs Laravel...\n";
    $logFile = storage_path('logs/laravel.log');
    if (file_exists($logFile)) {
        $recentLogs = tailCustom($logFile, 10);
        echo "   Dernières lignes du log:\n";
        foreach ($recentLogs as $line) {
            if (strpos($line, 'email') !== false || strpos($line, 'mail') !== false) {
                echo "   " . trim($line) . "\n";
            }
        }
    } else {
        echo "   Fichier de log non trouvé.\n";
    }
    
    // Nettoyage: restaurer le statut
    echo "\n🧹 Nettoyage: restauration du statut original...\n";
    $booking->status = $oldStatus;
    $booking->save();
    echo "✅ Statut restauré à: {$oldStatus}\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur générale: " . $e->getMessage() . "\n";
    echo "📋 Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n🏁 Tests terminés!\n";
echo "📧 Vérifiez votre boîte de réception (y compris les spams/promotions)\n";
echo "🔍 Si aucun email reçu, vérifiez la configuration SMTP dans .env\n\n";

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
