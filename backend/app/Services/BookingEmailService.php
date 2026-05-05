<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class BookingEmailService
{
    /**
     * Envoyer un email de confirmation au client avec le template stylisé
     */
    public static function sendConfirmationEmail(Booking $booking): bool
    {
        try {
            $car = $booking->car;
            
            // Préparer les données pour le template
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
            
            // Pour l'instant, utiliser un template HTML simple avec le style MOHADRIVE
            // Plus tard, nous pourrons intégrer React Email si nécessaire
            $htmlContent = self::generateStyledEmailHTML($bookingData);
            
            Mail::html($htmlContent, function ($message) use ($booking) {
                $message->to($booking->email)
                        ->subject('✅ Réservation Confirmée - MOHADRIVE Location Premium');
            });
            
            Log::info("Styled booking confirmation email sent to: {$booking->email}");
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled booking confirmation email: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Générer le HTML de l'email avec le style MOHADRIVE
     */
    private static function generateStyledEmailHTML(array $bookingData): string
    {
        $carImageUrl = $bookingData['carImage'] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=600";
        
        return "
<!DOCTYPE html>
<html lang=\"fr\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Réservation Confirmée - MOHADRIVE</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
            background-color: #EBF2FA;
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(6, 102, 140, 0.05) 0%, transparent 50%), 
                radial-gradient(circle at 80% 20%, rgba(164, 189, 1, 0.08) 0%, transparent 50%), 
                radial-gradient(circle at 40% 40%, rgba(103, 148, 54, 0.03) 0%, transparent 50%);
            padding: 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 32px;
            box-shadow: 0 20px 60px rgba(6, 102, 140, 0.15);
            overflow: hidden;
        }
        
        .header-section {
            padding: 60px 40px 40px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            text-align: center;
        }
        
        .badge-container {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(16px);
            padding: 8px 20px;
            border-radius: 9999px;
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.1);
            border: 1px solid rgba(6, 102, 140, 0.1);
            margin-bottom: 24px;
        }
        
        .badge-dot {
            position: relative;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #A4BD01;
        }
        
        .badge-dot-inner {
            position: absolute;
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: linear-gradient(135deg, #A4BD01, #679436);
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
            75%, 100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .badge-text {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #06668C;
        }
        
        .main-heading {
            font-size: 42px;
            font-weight: 900;
            color: #06668C;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            line-height: 1.1;
            margin: 0 0 24px 0;
        }
        
        .gradient-text {
            background: linear-gradient(135deg, #06668C, #427AA1, #A4BD01);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin: 0 auto;
            max-width: 500px;
        }
        
        .car-image-section {
            padding: 0;
            position: relative;
        }
        
        .car-image-container {
            position: relative;
            margin: 0 40px;
        }
        
        .car-image-wrapper {
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(6, 102, 140, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            height: 300px;
            margin-bottom: 20px;
        }
        
        .car-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(6, 102, 140, 0.3) 100%);
        }
        
        .car-info-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 24px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
        }
        
        .car-name-heading {
            font-size: 28px;
            font-weight: 900;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: tight;
            margin: 0 0 8px 0;
        }
        
        .car-price-text {
            font-size: 18px;
            font-weight: 700;
            color: #A4BD01;
            margin: 0;
        }
        
        .location-card {
            position: absolute;
            top: 20px;
            right: -20px;
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            padding: 16px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(6, 102, 140, 0.15);
            border: 1px solid rgba(6, 102, 140, 0.1);
            width: 200px;
        }
        
        .location-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .location-icon-cell {
            vertical-align: top;
            padding-right: 12px;
        }
        
        .location-icon {
            background-color: #06668C;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .location-label {
            font-size: 8px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #4a5568;
            margin-bottom: 4px;
        }
        
        .location-value {
            font-size: 12px;
            font-weight: 700;
            color: #1C2942;
        }
        
        .details-section {
            padding: 40px;
            background-color: #f8fafc;
        }
        
        .details-container {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.08);
            border: 1px solid rgba(6, 102, 140, 0.05);
        }
        
        .section-tag {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #A4BD01;
            margin-bottom: 20px;
            display: block;
        }
        
        .detail-row {
            margin-bottom: 16px;
        }
        
        .detail-label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #4a5568;
            margin-bottom: 4px;
        }
        
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #1C2942;
        }
        
        .detail-divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 16px 0;
        }
        
        .message-section {
            padding: 0 40px 40px;
            text-align: center;
        }
        
        .message-text {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin: 0 0 32px 0;
        }
        
        .trust-badges {
            display: flex;
            justify-content: center;
            gap: 24px;
            flex-wrap: wrap;
        }
        
        .trust-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 600;
            color: #4a5568;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .trust-icon {
            color: #679436;
            font-weight: 700;
            font-size: 14px;
        }
        
        .footer-section {
            padding: 40px;
            text-align: center;
            background-color: #ffffff;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 0 0 24px 0;
        }
        
        .footer-text {
            font-size: 12px;
            color: #8898aa;
            line-height: 1.5;
            margin: 0;
        }
        
        .footer-small {
            font-size: 10px;
            opacity: 0.8;
        }
        
        @media (max-width: 600px) {
            .container {
                border-radius: 16px;
                margin: 10px;
            }
            
            .header-section {
                padding: 40px 20px 30px;
            }
            
            .main-heading {
                font-size: 32px;
            }
            
            .car-image-container {
                margin: 0 20px;
            }
            
            .location-card {
                position: static;
                width: auto;
                margin-top: 16px;
            }
            
            .details-section {
                padding: 30px 20px;
            }
            
            .details-container {
                padding: 24px 20px;
            }
            
            .message-section {
                padding: 0 20px 30px;
            }
            
            .footer-section {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class=\"container\">
        <!-- Header Section -->
        <div class=\"header-section\">
            <!-- Badge animé -->
            <div class=\"badge-container\">
                <div class=\"badge-dot\"></div>
                <div class=\"badge-dot-inner\"></div>
                <span class=\"badge-text\">Réservation Confirmée</span>
            </div>
            
            <!-- Titre principal -->
            <h1 class=\"main-heading\">
                Votre <span class=\"gradient-text\">aventure</span> commence
            </h1>
            
            <!-- Sous-titre -->
            <p class=\"subtitle\">
                Bonne nouvelle ! Votre demande de réservation pour le véhicule <strong>{$bookingData['carBrand']} {$bookingData['carModel']}</strong> a été acceptée par notre équipe premium.
            </p>
        </div>

        <!-- Section Image du véhicule -->
        <div class=\"car-image-section\">
            <div class=\"car-image-container\">
                <div class=\"car-image-wrapper\">
                    <img src=\"{$carImageUrl}\" alt=\"{$bookingData['carBrand']} {$bookingData['carModel']}\" class=\"car-image\" />
                    <div class=\"image-overlay\"></div>
                    <div class=\"car-info-overlay\">
                        <h2 class=\"car-name-heading\">{$bookingData['carBrand']} {$bookingData['carModel']}</h2>
                        <p class=\"car-price-text\">{$bookingData['totalPrice']} {$bookingData['currency']}</p>
                    </div>
                </div>
                
                <!-- Carte de localisation flottante -->
                <div class=\"location-card\">
                    <table class=\"location-table\">
                        <tr>
                            <td class=\"location-icon-cell\">
                                <div class=\"location-icon\">
                                    📍
                                </div>
                            </td>
                            <td>
                                <div>
                                    <div class=\"location-label\">Lieu de prise en charge</div>
                                    <div class=\"location-value\">{$bookingData['location']}</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- Section Détails de la réservation -->
        <div class=\"details-section\">
            <div class=\"details-container\">
                <span class=\"section-tag\">Récapitulatif de votre location</span>
                
                <div class=\"detail-row\">
                    <div class=\"detail-label\">Véhicule</div>
                    <div class=\"detail-value\">{$bookingData['carBrand']} {$bookingData['carModel']}</div>
                </div>
                
                <hr class=\"detail-divider\" />
                
                <div class=\"detail-row\">
                    <div class=\"detail-label\">Prise en charge</div>
                    <div class=\"detail-value\">{$bookingData['startDate']}</div>
                </div>
                
                <hr class=\"detail-divider\" />
                
                <div class=\"detail-row\">
                    <div class=\"detail-label\">Dépôt</div>
                    <div class=\"detail-value\">{$bookingData['endDate']}</div>
                </div>
                
                <hr class=\"detail-divider\" />
                
                <div class=\"detail-row\">
                    <div class=\"detail-label\">Lieu</div>
                    <div class=\"detail-value\">{$bookingData['location']}</div>
                </div>
                
                <hr class=\"detail-divider\" />
                
                <div class=\"detail-row\">
                    <div class=\"detail-label\">Prix total</div>
                    <div class=\"detail-value gradient-text\">{$bookingData['totalPrice']} {$bookingData['currency']}</div>
                </div>
            </div>
        </div>

        <!-- Section Message et CTA -->
        <div class=\"message-section\">
            <p class=\"message-text\">
                Notre agent vous contactera sous peu pour finaliser les détails de la livraison et répondre à toutes vos questions.
            </p>
            
            <div class=\"trust-badges\">
                <div class=\"trust-badge\">
                    <span class=\"trust-icon\">✓</span>
                    <span>Annulation gratuite</span>
                </div>
                <div class=\"trust-badge\">
                    <span class=\"trust-icon\">✓</span>
                    <span>Livraison aéroport</span>
                </div>
                <div class=\"trust-badge\">
                    <span class=\"trust-icon\">✓</span>
                    <span>Assurance incluse</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class=\"footer-section\">
            <hr class=\"footer-divider\" />
            <p class=\"footer-text\">
                <strong>MOHADRIVE Location Premium</strong><br />
                Service Client - Merci de votre confiance !<br />
                <span class=\"footer-small\">Boulevard Mohamed VI, El Aïoun Sidi Mellouk, Maroc</span>
            </p>
        </div>
    </div>
</body>
</html>";
    }
}
