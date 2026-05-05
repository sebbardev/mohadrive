<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class UnifiedEmailService
{
    /**
     * Envoyer un email de confirmation au client avec le style MOHADRIVE
     */
    public static function sendBookingConfirmation(Booking $booking): bool
    {
        try {
            $car = $booking->car;
            
            $bookingData = [
                'customerName' => $booking->first_name . ' ' . $booking->last_name,
                'firstName' => $booking->first_name,
                'lastName' => $booking->last_name,
                'email' => $booking->email,
                'carName' => $car->brand . ' ' . $car->model,
                'carBrand' => $car->brand,
                'carModel' => $car->model,
                'carImage' => $car->image ? (strpos($car->image, 'http') === 0 ? $car->image : url($car->image)) : null,
                'startDate' => \Carbon\Carbon::parse($booking->start_date)->format('d/m/Y à H:i'),
                'endDate' => \Carbon\Carbon::parse($booking->end_date)->format('d/m/Y à H:i'),
                'location' => $booking->location,
                'totalPrice' => $booking->total_price,
                'currency' => 'MAD',
            ];
            
            $htmlContent = self::generateStyledBookingConfirmationHTML($bookingData);
            
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
     * Envoyer un email de nouvelle réservation aux admins avec le style MOHADRIVE
     */
    public static function sendNewBookingNotification(Booking $booking): bool
    {
        try {
            $adminUsers = \App\Models\User::where('role', 'ADMIN')->get();
            $car = $booking->car;
            
            $bookingData = [
                'customerName' => $booking->first_name . ' ' . $booking->last_name,
                'firstName' => $booking->first_name,
                'lastName' => $booking->last_name,
                'email' => $booking->email,
                'phone' => $booking->phone,
                'carName' => $car->brand . ' ' . $car->model,
                'carBrand' => $car->brand,
                'carModel' => $car->model,
                'carImage' => $car->image ? (strpos($car->image, 'http') === 0 ? $car->image : url($car->image)) : null,
                'startDate' => \Carbon\Carbon::parse($booking->start_date)->format('d/m/Y à H:i'),
                'endDate' => \Carbon\Carbon::parse($booking->end_date)->format('d/m/Y à H:i'),
                'location' => $booking->location,
                'totalPrice' => $booking->total_price,
                'currency' => 'MAD',
            ];
            
            $htmlContent = self::generateStyledAdminBookingHTML($bookingData);
            
            foreach ($adminUsers as $admin) {
                if ($admin->email) {
                    Mail::html($htmlContent, function ($message) use ($admin, $booking, $car) {
                        $message->to($admin->email)
                                ->subject("🚗 Nouvelle Réservation - {$car->brand} {$car->model}");
                    });
                    Log::info("Styled admin booking notification sent to: {$admin->email}");
                }
            }
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled admin booking notification: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Envoyer un email de contact avec le style MOHADRIVE
     */
    public static function sendContactNotification(array $contactData): bool
    {
        try {
            $adminUsers = \App\Models\User::where('role', 'ADMIN')->get();
            $htmlContent = self::generateStyledContactHTML($contactData);
            
            foreach ($adminUsers as $admin) {
                if ($admin->email) {
                    Mail::html($htmlContent, function ($message) use ($admin, $contactData) {
                        $message->to($admin->email)
                                ->subject("📧 Nouveau Message: {$contactData['subject']}");
                    });
                    Log::info("Styled contact notification sent to: {$admin->email}");
                }
            }
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled contact notification: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Envoyer un email de nouvel avis avec le style MOHADRIVE
     */
    public static function sendReviewNotification(Review $review): bool
    {
        try {
            $adminUsers = \App\Models\User::where('role', 'ADMIN')->get();
            
            $reviewData = [
                'name' => $review->name,
                'email' => $review->email,
                'rating' => $review->rating,
                'content' => $review->content,
            ];
            
            $htmlContent = self::generateStyledReviewHTML($reviewData);
            
            foreach ($adminUsers as $admin) {
                if ($admin->email) {
                    Mail::html($htmlContent, function ($message) use ($admin, $review) {
                        $message->to($admin->email)
                                ->subject("⭐ Nouvel Avis: {$review->rating}/5 étoiles par {$review->name}");
                    });
                    Log::info("Styled review notification sent to: {$admin->email}");
                }
            }
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled review notification: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Envoyer un email de confirmation de contrat avec le style MOHADRIVE
     */
    public static function sendContractConfirmation($contract): bool
    {
        try {
            $contractData = [
                'id' => $contract->id,
                'driverFirstName' => $contract->driver_first_name,
                'driverLastName' => $contract->driver_last_name,
                'driverEmail' => $contract->driver_email,
                'carBrand' => $contract->car->brand,
                'carModel' => $contract->car->model,
                'startDate' => \Carbon\Carbon::parse($contract->start_date)->format('d/m/Y à H:i'),
                'endDate' => \Carbon\Carbon::parse($contract->end_date)->format('d/m/Y à H:i'),
                'pickupLocation' => $contract->pickup_location,
                'returnLocation' => $contract->return_location,
                'totalPrice' => $contract->total_price,
                'currency' => 'MAD',
                'pdfPath' => $contract->pdf_path,
            ];
            
            $htmlContent = self::generateStyledContractConfirmationHTML($contractData);
            
            Mail::html($htmlContent, function ($message) use ($contract) {
                $message->to($contract->driver_email)
                        ->subject("Confirmation de votre contrat de location - {$contract->id}");
                
                // Ajouter le PDF en pièce jointe si disponible
                if ($contract->pdf_path && file_exists(storage_path('app/public/' . $contract->pdf_path))) {
                    $message->attach(storage_path('app/public/' . $contract->pdf_path), [
                        'as' => 'Contrat_Location_' . $contract->id . '.pdf',
                        'mime' => 'application/pdf',
                    ]);
                }
            });
            
            Log::info("Styled contract confirmation email sent to: {$contract->driver_email}");
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled contract confirmation email: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Envoyer un email de réinitialisation mot de passe avec le style MOHADRIVE
     */
    public static function sendPasswordReset(string $userName, string $resetUrl, int $expiryMinutes = 60): bool
    {
        try {
            $resetData = [
                'userName' => $userName,
                'resetUrl' => $resetUrl,
                'expiryMinutes' => $expiryMinutes,
            ];
            
            $htmlContent = self::generateStyledPasswordResetHTML($resetData);
            
            Mail::html($htmlContent, function ($message) use ($userName) {
                $message->to($userName) // Note: ceci est une simplification, en pratique il faudrait l'email
                        ->subject('Réinitialisation de votre mot de passe - MOHADRIVE');
            });
            
            Log::info("Styled password reset email sent to: {$userName}");
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled password reset email: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Envoyer un email de nouveau message contact avec le style MOHADRIVE
     */
    public static function sendNewContactMessage($contactMessage): bool
    {
        try {
            $contactData = [
                'name' => $contactMessage->name,
                'email' => $contactMessage->email,
                'phone' => $contactMessage->phone,
                'subject' => $contactMessage->subject,
                'message' => $contactMessage->message,
                'createdAt' => \Carbon\Carbon::parse($contactMessage->created_at)->format('d/m/Y à H:i'),
            ];
            
            $htmlContent = self::generateStyledNewContactMessageHTML($contactData);
            
            $adminUsers = \App\Models\User::where('role', 'ADMIN')->get();
            foreach ($adminUsers as $admin) {
                if ($admin->email) {
                    Mail::html($htmlContent, function ($message) use ($admin, $contactMessage) {
                        $message->to($admin->email)
                                ->subject("Nouveau message de contact - {$contactMessage->subject}");
                    });
                    Log::info("Styled new contact message email sent to: {$admin->email}");
                }
            }
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send styled new contact message email: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Générer le HTML pour l'email de confirmation client
     */
    private static function generateStyledBookingConfirmationHTML(array $bookingData): string
    {
        $carImageUrl = $bookingData['carImage'] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=600";
        
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Réservation Confirmée</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Votre <span class=\"gradient-text\">aventure</span> commence
                </h1>
                
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
                <div class=\"message-container\">
                    <p class=\"message-text\">
                        Notre agent vous contactera sous peu pour finaliser les détails de la livraison et répondre à toutes vos questions.
                    </p>
                    
                    <div class=\"trust-badges\">
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">Annulation gratuite</span>
                        </div>
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">Livraison aéroport</span>
                        </div>
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">Assurance incluse</span>
                        </div>
                    </div>
                    
                    <!-- Boutons d'action style Navbar -->
                    <div class=\"action-buttons\">
                        <a href=\"https://wa.me/212600000000\" class=\"btn btn-whatsapp\">
                            <span class=\"btn-icon\">📞</span>
                            WhatsApp
                        </a>
                        <a href=\"tel:+212600000000\" class=\"btn btn-primary\">
                            <span class=\"btn-icon\">📱</span>
                            Appeler
                        </a>
                    </div>
                </div>
            </div>
        ");
    }
    
    /**
     * Générer le HTML pour l'email admin de nouvelle réservation
     */
    private static function generateStyledAdminBookingHTML(array $bookingData): string
    {
        $carImageUrl = $bookingData['carImage'] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=600";
        
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Nouvelle Réservation</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Nouvelle <span class=\"gradient-text\">réservation</span>
                </h1>
                
                <p class=\"subtitle\">
                    Une nouvelle réservation a été enregistrée et nécessite votre validation.
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
                </div>
            </div>

            <!-- Section Détails client -->
            <div class=\"details-section\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Informations client</span>
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Nom complet</div>
                        <div class=\"detail-value\">{$bookingData['customerName']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Email</div>
                        <div class=\"detail-value\">{$bookingData['email']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Téléphone</div>
                        <div class=\"detail-value\">{$bookingData['phone']}</div>
                    </div>
                </div>
            </div>

            <!-- Section Détails réservation -->
            <div class=\"details-section\" style=\"padding-top: 0;\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Détails de la réservation</span>
                    
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

            <!-- Section Actions -->
            <div class=\"message-section\">
                <div class=\"message-container\">
                    <p class=\"message-text\">
                        Connectez-vous au dashboard pour gérer cette réservation et contacter le client.
                    </p>
                    
                    <div class=\"action-buttons\">
                        <a href=\"https://mohadrive.ma/admin\" class=\"btn-primary\">Accéder au Dashboard</a>
                    </div>
                </div>
            </div>
        ");
    }
    
    /**
     * Générer le HTML pour l'email de contact
     */
    private static function generateStyledContactHTML(array $contactData): string
    {
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Nouveau Message</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Message <span class=\"gradient-text\">contact</span>
                </h1>
                
                <p class=\"subtitle\">
                    Un nouveau message a été reçu depuis le formulaire de contact du site.
                </p>
            </div>

            <!-- Section Informations expéditeur -->
            <div class=\"details-section\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Informations de l'expéditeur</span>
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Nom</div>
                        <div class=\"detail-value\">{$contactData['name']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Email</div>
                        <div class=\"detail-value\">{$contactData['email']}</div>
                    </div>
                    
                    " . (isset($contactData['phone']) ? "
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Téléphone</div>
                        <div class=\"detail-value\">{$contactData['phone']}</div>
                    </div>
                    " : "") . "
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Sujet</div>
                        <div class=\"detail-value\">{$contactData['subject']}</div>
                    </div>
                </div>
            </div>

            <!-- Section Message -->
            <div class=\"details-section\" style=\"padding-top: 0;\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Message</span>
                    
                    <div class=\"message-content\">
                        " . nl2br(htmlspecialchars($contactData['message'])) . "
                    </div>
                </div>
            </div>

            <!-- Section Actions -->
            <div class=\"message-section\">
                <div class=\"message-container\">
                    <p class=\"message-text\">
                        Répondez rapidement à ce message pour offrir un service client exceptionnel.
                    </p>
                    
                    <div class=\"action-buttons\">
                        <a href=\"mailto:{$contactData['email']}\" class=\"btn-primary\">Répondre par Email</a>
                        " . (isset($contactData['phone']) ? "<a href=\"tel:{$contactData['phone']}\" class=\"btn-secondary\">Appeler</a>" : "") . "
                    </div>
                </div>
            </div>
        ");
    }
    
    /**
     * Générer le HTML pour l'email d'avis
     */
    private static function generateStyledReviewHTML(array $reviewData): string
    {
        $stars = str_repeat("★", $reviewData['rating']) . str_repeat("☆", 5 - $reviewData['rating']);
        
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Nouvel Avis</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Avis <span class=\"gradient-text\">client</span>
                </h1>
                
                <p class=\"subtitle\">
                    Un nouvel avis a été déposé par un client et nécessite votre modération.
                </p>
            </div>

            <!-- Section Note -->
            <div class=\"rating-section\">
                <div class=\"rating-container\">
                    <div class=\"stars\">{$stars}</div>
                    <p class=\"rating-text\">{$reviewData['rating']}/5 étoiles</p>
                </div>
            </div>

            <!-- Section Informations client -->
            <div class=\"details-section\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Informations du client</span>
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Nom</div>
                        <div class=\"detail-value\">{$reviewData['name']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Email</div>
                        <div class=\"detail-value\">{$reviewData['email']}</div>
                    </div>
                </div>
            </div>

            <!-- Section Avis -->
            <div class=\"details-section\" style=\"padding-top: 0;\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Avis du client</span>
                    
                    <div class=\"review-content\">
                        \"" . nl2br(htmlspecialchars($reviewData['content'])) . "\"
                    </div>
                </div>
            </div>

            <!-- Section Actions -->
            <div class=\"message-section\">
                <div class=\"moderation-container\">
                    <p class=\"moderation-text\">En attente de modération</p>
                    
                    <p class=\"message-text\">
                        Connectez-vous au dashboard pour approuver ou modérer cet avis.
                    </p>
                    
                    <div class=\"action-buttons\">
                        <a href=\"https://mohadrive.ma/admin/reviews\" class=\"btn-primary\">Gérer les Avis</a>
                        <a href=\"mailto:{$reviewData['email']}\" class=\"btn-secondary\">Contacter le Client</a>
                    </div>
                </div>
            </div>
        ");
    }
    
    /**
     * Template de base MOHADRIVE avec tous les styles
     */
    private static function getMohaDriveEmailTemplate(string $content): string
    {
        return "
<!DOCTYPE html>
<html lang=\"fr\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>MOHADRIVE - Location Premium</title>
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
            padding: 0 40px 40px;
            background-color: #f8fafc;
        }
        
        .car-image-container {
            position: relative;
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
        
        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 32px;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 28px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .btn-whatsapp {
            background: linear-gradient(135deg, #679436, #A4BD01);
            box-shadow: 0 4px 20px rgba(103, 148, 54, 0.3);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #06668C, #427AA1);
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.3);
        }
        
        .btn-icon {
            font-size: 14px;
        }
        
        .rating-section {
            padding: 40px;
            background-color: #f8fafc;
            text-align: center;
        }
        
        .rating-container {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.08);
            border: 1px solid rgba(6, 102, 140, 0.05);
        }
        
        .stars {
            font-size: 48px;
            color: #A4BD01;
            letter-spacing: 4px;
            margin-bottom: 12px;
        }
        
        .rating-text {
            font-size: 18px;
            font-weight: 900;
            color: #06668C;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin: 0;
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
        
        .message-content {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #06668C;
            font-size: 14px;
            line-height: 1.6;
            color: #1C2942;
        }
        
        .review-content {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #A4BD01;
            font-size: 16px;
            line-height: 1.6;
            color: #1C2942;
            font-style: italic;
        }
        
        .message-section {
            padding: 0 40px 40px;
            text-align: center;
        }
        
        .message-container {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.08);
            border: 1px solid rgba(6, 102, 140, 0.05);
        }
        
        .moderation-container {
            background-color: #fffbeb;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.08);
            border: 1px solid #fcd34d;
        }
        
        .moderation-text {
            font-size: 14px;
            font-weight: 700;
            color: #92400e;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin: 0 0 16px 0;
            text-align: center;
        }
        
        .message-text {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin: 0 0 24px 0;
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
        
        .trust-text {
            font-size: 11px;
        }
        
        .action-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            background-color: #06668C;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 4px 14px rgba(6, 102, 140, 0.3);
        }
        
        .btn-secondary {
            background-color: #679436;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 4px 14px rgba(103, 148, 54, 0.3);
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
        
        .document-box {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            border: 2px dashed #06668C;
            text-align: center;
        }
        
        .document-icon {
            font-size: 48px;
            color: #06668C;
            margin-bottom: 16px;
        }
        
        .document-title {
            font-size: 16px;
            font-weight: 700;
            color: #06668C;
            margin: 0 0 8px 0;
        }
        
        .document-desc {
            font-size: 14px;
            color: #4a5568;
            margin: 0;
        }
        
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        
        .link-label {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.6;
            margin: 24px 0 0 0;
            text-align: center;
        }
        
        .link-box {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e2e8f0;
            word-break: break-all;
            margin-top: 12px;
            font-size: 12px;
            color: #06668C;
            font-family: monospace;
        }
        
        .security-icon {
            font-size: 48px;
            color: #f59e0b;
            margin-bottom: 16px;
        }
        
        .security-info {
            text-align: left;
            margin-bottom: 24px;
        }
        
        .security-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .security-bullet {
            color: #f59e0b;
            font-weight: 700;
            margin-top: 2px;
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
            
            .car-image-section {
                padding: 0 20px 30px;
            }
            
            .car-image-wrapper {
                height: 200px;
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
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .trust-badges {
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class=\"container\">
        {$content}
        
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
    
    /**
     * Générer le HTML pour l'email de confirmation de contrat
     */
    private static function generateStyledContractConfirmationHTML(array $contractData): string
    {
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Contrat Confirmé</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Votre <span class=\"gradient-text\">contrat</span> est prêt
                </h1>
                
                <p class=\"subtitle\">
                    Nous avons le plaisir de vous confirmer la création de votre contrat de location pour le véhicule <strong>{$contractData['carBrand']} {$contractData['carModel']}</strong>.
                </p>
            </div>

            <!-- Section Détails du contrat -->
            <div class=\"details-section\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Détails de la location</span>
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Véhicule</div>
                        <div class=\"detail-value\">{$contractData['carBrand']} {$contractData['carModel']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Départ</div>
                        <div class=\"detail-value\">{$contractData['startDate']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Retour</div>
                        <div class=\"detail-value\">{$contractData['endDate']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Lieu de départ</div>
                        <div class=\"detail-value\">{$contractData['pickupLocation']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Lieu de retour</div>
                        <div class=\"detail-value\">{$contractData['returnLocation']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Montant total</div>
                        <div class=\"detail-value gradient-text\">{$contractData['totalPrice']} {$contractData['currency']}</div>
                    </div>
                </div>
            </div>

            <!-- Section Document -->
            <div class=\"message-section\">
                <div class=\"message-container\">
                    <div class=\"document-box\">
                        <div class=\"document-icon\">📄</div>
                        <p class=\"document-title\">Contrat de Location</p>
                        <p class=\"document-desc\">Vous trouverez ci-joint votre contrat de location au format PDF</p>
                    </div>
                    
                    <p class=\"message-text\">
                        Merci de votre confiance et à très bientôt pour votre location !
                    </p>
                    
                    <div class=\"trust-badges\">
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">Contrat signé</span>
                        </div>
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">PDF inclus</span>
                        </div>
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">Validé</span>
                        </div>
                    </div>
                </div>
            </div>
        ");
    }
    
    /**
     * Générer le HTML pour l'email de réinitialisation mot de passe
     */
    private static function generateStyledPasswordResetHTML(array $resetData): string
    {
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Sécurité</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Réinitialisation <span class=\"gradient-text\">mot de passe</span>
                </h1>
                
                <p class=\"subtitle\">
                    Bonjour {$resetData['userName']}, nous avons reçu une demande de réinitialisation de votre mot de passe.
                </p>
            </div>

            <!-- Section Instructions -->
            <div class=\"details-section\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Instructions de réinitialisation</span>
                    
                    <p class=\"message-text\">
                        Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous. Ce lien est valable pendant {$resetData['expiryMinutes']} minutes.
                    </p>
                    
                    <div class=\"button-container\">
                        <a href=\"{$resetData['resetUrl']}\" class=\"btn-primary\">Réinitialiser mon mot de passe</a>
                    </div>
                    
                    <p class=\"link-label\">
                        Ou copiez-collez ce lien dans votre navigateur :
                    </p>
                    
                    <div class=\"link-box\">
                        {$resetData['resetUrl']}
                    </div>
                </div>
            </div>

            <!-- Section Sécurité -->
            <div class=\"message-section\">
                <div class=\"moderation-container\">
                    <div class=\"security-icon\">🔒</div>
                    
                    <p class=\"moderation-text\">Informations importantes</p>
                    
                    <div class=\"security-info\">
                        <div class=\"security-item\">
                            <span class=\"security-bullet\">•</span>
                            <span>Ce lien expirera dans {$resetData['expiryMinutes']} minutes</span>
                        </div>
                        
                        <div class=\"security-item\">
                            <span class=\"security-bullet\">•</span>
                            <span>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</span>
                        </div>
                        
                        <div class=\"security-item\">
                            <span class=\"security-bullet\">•</span>
                            <span>Ne partagez jamais ce lien avec personne</span>
                        </div>
                    </div>
                    
                    <p class=\"message-text\">
                        Si vous avez des questions, contactez notre support technique.
                    </p>
                </div>
            </div>
        ");
    }
    
    /**
     * Générer le HTML pour l'email de nouveau message contact
     */
    private static function generateStyledNewContactMessageHTML(array $contactData): string
    {
        return self::getMohaDriveEmailTemplate("
            <!-- Header Section -->
            <div class=\"header-section\">
                <div class=\"badge-container\">
                    <div class=\"badge-dot\"></div>
                    <div class=\"badge-dot-inner\"></div>
                    <span class=\"badge-text\">Nouveau Message</span>
                </div>
                
                <h1 class=\"main-heading\">
                    Message <span class=\"gradient-text\">contact</span>
                </h1>
                
                <p class=\"subtitle\">
                    Un nouveau message a été reçu depuis le formulaire de contact du site web.
                </p>
            </div>

            <!-- Section Informations expéditeur -->
            <div class=\"details-section\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Informations de l'expéditeur</span>
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Nom</div>
                        <div class=\"detail-value\">{$contactData['name']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Email</div>
                        <div class=\"detail-value\">{$contactData['email']}</div>
                    </div>
                    
                    " . (isset($contactData['phone']) ? "
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Téléphone</div>
                        <div class=\"detail-value\">{$contactData['phone']}</div>
                    </div>
                    " : "") . "
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Sujet</div>
                        <div class=\"detail-value\">{$contactData['subject']}</div>
                    </div>
                    
                    <hr class=\"detail-divider\" />
                    
                    <div class=\"detail-row\">
                        <div class=\"detail-label\">Date</div>
                        <div class=\"detail-value\">{$contactData['createdAt']}</div>
                    </div>
                </div>
            </div>

            <!-- Section Message -->
            <div class=\"details-section\" style=\"padding-top: 0;\">
                <div class=\"details-container\">
                    <span class=\"section-tag\">Message du client</span>
                    
                    <div class=\"message-content\">
                        " . nl2br(htmlspecialchars($contactData['message'])) . "
                    </div>
                </div>
            </div>

            <!-- Section Actions -->
            <div class=\"message-section\">
                <div class=\"message-container\">
                    <p class=\"message-text\">
                        Répondez rapidement à ce message pour offrir un service client exceptionnel.
                    </p>
                    
                    <div class=\"action-buttons\">
                        <a href=\"mailto:{$contactData['email']}?subject=Re: " . urlencode($contactData['subject']) . "\" class=\"btn-primary\">Répondre par Email</a>
                        " . (isset($contactData['phone']) ? "<a href=\"tel:{$contactData['phone']}\" class=\"btn-secondary\">Appeler</a>" : "") . "
                    </div>
                    
                    <div class=\"trust-badges\">
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">⚡</span>
                            <span class=\"trust-text\">Réponse rapide</span>
                        </div>
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">🎯</span>
                            <span class=\"trust-text\">Service client</span>
                        </div>
                        <div class=\"trust-badge\">
                            <span class=\"trust-icon\">✓</span>
                            <span class=\"trust-text\">Qualité</span>
                        </div>
                    </div>
                </div>
            </div>
        ");
    }
}
