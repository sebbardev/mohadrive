<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Services\UnifiedEmailService;
use App\Models\Booking;
use App\Models\Car;

// Boot Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🔍 Analyse des problèmes d'email (Prix + Images)\n";
echo "===============================================\n\n";

try {
    // Trouver une réservation spécifique pour analyser
    $booking = Booking::with('car')->first();
    
    if (!$booking) {
        echo "❌ Aucune réservation trouvée pour l'analyse\n";
        exit;
    }
    
    echo "📋 Analyse de la réservation #{$booking->id}\n";
    echo "-----------------------------------\n";
    echo "Client: {$booking->first_name} {$booking->last_name}\n";
    echo "Véhicule: {$booking->car->brand} {$booking->car->model}\n";
    echo "Dates: {$booking->start_date} → {$booking->end_date}\n";
    echo "Prix total en base: {$booking->total_price} MAD\n";
    echo "Prix journalier: {$booking->daily_price} MAD\n";
    echo "Image véhicule: " . ($booking->car->image ?? 'NULL') . "\n";
    
    echo "\n";
    
    // Calcul du prix attendu
    $start = \Carbon\Carbon::parse($booking->start_date)->startOfDay();
    $end = \Carbon\Carbon::parse($booking->end_date)->endOfDay();
    $days = (int) $start->diffInDays($end->copy()->addSecond());
    if ($days <= 0) $days = 1;
    
    $expectedPrice = $days * $booking->daily_price;
    
    echo "🧮 Calcul du prix:\n";
    echo "-----------------\n";
    echo "Nombre de jours: {$days}\n";
    echo "Prix journalier: {$booking->daily_price} MAD\n";
    echo "Prix calculé: {$expectedPrice} MAD\n";
    echo "Prix en base: {$booking->total_price} MAD\n";
    
    if ($booking->total_price != $expectedPrice) {
        echo "⚠️  INCOHÉRENCE DÉTECTÉE!\n";
        echo "   Différence: " . abs($booking->total_price - $expectedPrice) . " MAD\n";
    } else {
        echo "✅ Calcul correct\n";
    }
    
    echo "\n";
    
    // Test spécifique pour le cas mentionné par l'utilisateur
    echo "🚗 Test du cas spécifique (Renault Clio 5):\n";
    echo "-------------------------------------------\n";
    
    // Trouver une Renault Clio
    $clio = Car::where('brand', 'Renault')->where('model', 'like', '%Clio%')->first();
    
    if ($clio) {
        echo "Renault Clio trouvée:\n";
        echo "  - ID: {$clio->id}\n";
        echo "  - Prix/jour: {$clio->price_per_day} MAD\n";
        echo "  - Image: " . ($clio->image ?? 'NULL') . "\n";
        
        // Calcul pour 7 jours (01/08 → 08/08)
        $testDays = 7;
        $testPrice = $testDays * $clio->price_per_day;
        
        echo "\nCalcul pour 7 jours:\n";
        echo "  - {$testDays} jours × {$clio->price_per_day} MAD = {$testPrice} MAD\n";
        echo "  - Attendu: 2000 MAD\n";
        echo "  - Obtenu: {$testPrice} MAD\n";
        
        if ($testPrice != 2000) {
            echo "  ⚠️  Le prix ne correspond pas à 2000 MAD\n";
            echo "  💡 Pour obtenir 2000 MAD, le prix/jour devrait être: " . (2000 / 7) . " MAD\n";
        }
    } else {
        echo "❌ Aucune Renault Clio trouvée\n";
    }
    
    echo "\n";
    
    // Vérification des images
    echo "🖼️  Analyse des images:\n";
    echo "----------------------\n";
    
    $carsWithImage = Car::whereNotNull('image')->count();
    $carsWithoutImage = Car::whereNull('image')->count();
    $totalCars = Car::count();
    
    echo "Total voitures: {$totalCars}\n";
    echo "Avec image: {$carsWithImage}\n";
    echo "Sans image: {$carsWithoutImage}\n";
    
    if ($carsWithoutImage > 0) {
        echo "\n⚠️  {$carsWithoutImage} voitures n'ont pas d'image!\n";
        echo "   Les emails utiliseront l'image par défaut Unsplash\n";
    }
    
    // Afficher quelques exemples d'images
    echo "\n📸 Exemples d'images de voitures:\n";
    $sampleCars = Car::take(5)->get();
    
    foreach ($sampleCars as $car) {
        $imageStatus = $car->image ? "✅" : "❌";
        $imagePreview = $car->image ? substr($car->image, 0, 50) . "..." : "NULL";
        echo "  {$imageStatus} {$car->brand} {$car->model}: {$imagePreview}\n";
    }
    
    echo "\n";
    
    // Test d'envoi d'email avec debug
    echo "📧 Test d'envoi d'email avec debug:\n";
    echo "----------------------------------\n";
    
    echo "Envoi d'un email de test pour la réservation #{$booking->id}...\n";
    
    // Préparer les données comme le ferait le service
    $car = $booking->car;
    $bookingData = [
        'customerName' => $booking->first_name . ' ' . $booking->last_name,
        'firstName' => $booking->first_name,
        'lastName' => $booking->last_name,
        'email' => $booking->email,
        'carName' => $car->brand . ' ' . $car->model,
        'carBrand' => $car->brand,
        'carModel' => $car->model,
        'carImage' => $car->image ?? null,
        'startDate' => \Carbon\Carbon::parse($booking->start_date)->format('d/m/Y à H:i'),
        'endDate' => \Carbon\Carbon::parse($booking->end_date)->format('d/m/Y à H:i'),
        'location' => $booking->location,
        'totalPrice' => $booking->total_price,
        'currency' => 'MAD',
    ];
    
    echo "Données préparées:\n";
    echo "  - Prix total: {$bookingData['totalPrice']} MAD\n";
    echo "  - Image: " . ($bookingData['carImage'] ?? 'Image par défaut Unsplash') . "\n";
    
    $result = UnifiedEmailService::sendBookingConfirmation($booking);
    echo "Résultat envoi: " . ($result ? "✅ Succès" : "❌ Échec") . "\n";
    
    echo "\n";
    
    // Solutions proposées
    echo "💡 Solutions recommandées:\n";
    echo "------------------------\n";
    
    echo "1. **Problème de prix (1750 au lieu de 2000)**:\n";
    echo "   - Vérifier le prix par jour de la Renault Clio 5\n";
    echo "   - Le calcul devrait être: 7 jours × 285.71 MAD ≈ 2000 MAD\n";
    echo "   - Ou ajuster le nombre de jours dans le calcul\n\n";
    
    echo "2. **Problème d'images**:\n";
    echo "   - Ajouter des images pour les voitures qui n'en ont pas\n";
    echo "   - Utiliser des URLs d'images valides et accessibles\n";
    echo "   - Tester l'affichage dans différents clients email\n\n";
    
    echo "3. **Actions immédiates**:\n";
    echo "   - Mettre à jour le prix par jour de la Renault Clio 5\n";
    echo "   - Ajouter des images pour toutes les voitures\n";
    echo "   - Tester avec un email réel\n";
    
} catch (\Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "📋 Stack trace:\n" . $e->getTraceAsString() . "\n";
}
