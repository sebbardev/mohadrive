<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <!-- Email Container -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Card -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0c4a6e 0%, #0891b2 50%, #06b6d4 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <!-- Background Pattern -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="position: relative; z-index: 1;">
                                        <!-- Logo/Brand -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                                            <tr>
                                                <td style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); padding: 15px 25px; border-radius: 50px; border: 2px solid rgba(255, 255, 255, 0.3);">
                                                    <span style="font-size: 32px;">🔐</span>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <h1 style="margin: 0 0 10px; font-size: 32px; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: -0.5px;">
                                            Premium Car Rental
                                        </h1>
                                        <p style="margin: 0; font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.9); text-transform: uppercase; letter-spacing: 3px;">
                                            Administration Sécurisée
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 25px; font-size: 20px; color: #0c4a6e; font-weight: 700;">
                                Bonjour {{ $userName }},
                            </p>
                            
                            <!-- Message -->
                            <p style="margin: 0 0 35px; color: #64748b; line-height: 1.8; font-size: 15px;">
                                Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte <strong style="color: #0c4a6e;">Premium Car Rental</strong>. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 40px 0;">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #0c4a6e 0%, #0891b2 100%); border-radius: 16px; box-shadow: 0 10px 30px rgba(8, 145, 178, 0.3);">
                                                    <a href="{{ $resetUrl }}" target="_blank" style="display: inline-block; padding: 18px 50px; color: white; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
                                                        Réinitialiser mon mot de passe
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Expiry Notice -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 12px; padding: 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="font-size: 24px; padding-right: 15px;">⏰</td>
                                                <td>
                                                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                                        <strong>Ce lien expirera dans {{ $expiryMinutes }} minutes.</strong><br>
                                                        Si vous ne l'utilisez pas maintenant, vous devrez faire une nouvelle demande.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 30px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left: 4px solid #ef4444; border-radius: 12px; padding: 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="font-size: 24px; padding-right: 15px;">🔒</td>
                                                <td>
                                                    <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                                        <strong>Important :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe actuel restera inchangé.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Fallback Link -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="border-top: 1px solid #e2e8f0; padding-top: 25px;">
                                        <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
                                            Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
                                        </p>
                                        <a href="{{ $resetUrl }}" style="color: #0891b2; word-break: break-all; font-size: 12px; text-decoration: none; font-weight: 600;">
                                            {{ $resetUrl }}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px; color: #0c4a6e; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
                                Premium Car Rental
                            </p>
                            <p style="margin: 0 0 10px; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                                Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
                            </p>
                            <p style="margin: 0; color: #cbd5e1; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                                &copy; {{ date('Y') }} Premium Car Rental. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                <!-- End Main Card -->
                
            </td>
        </tr>
    </table>
    <!-- End Email Container -->
</body>
</html>
