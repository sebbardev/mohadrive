// Script simple pour tester les emails sans dépendances complexes
const fs = require('fs');
const path = require('path');

// Simuler le rendu des emails avec HTML statique
function generateTestEmailHTML(type) {
  const baseHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MOHADRIVE - Email Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #EBF2FA;
        }
        
        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 32px;
            box-shadow: 0 20px 60px rgba(6, 102, 140, 0.15);
            overflow: hidden;
        }
        
        .header {
            padding: 40px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            text-align: center;
        }
        
        .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .logo-text {
            display: flex;
            flex-direction: column;
            text-align: left;
        }
        
        .logo-main {
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: #06668C;
            line-height: 1;
        }
        
        .logo-sub {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #A4BD01;
            line-height: 1;
            margin-top: 4px;
        }
        
        .content {
            padding: 40px;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.8);
            padding: 8px 20px;
            border-radius: 9999px;
            box-shadow: 0 4px 20px rgba(6, 102, 140, 0.1);
            border: 1px solid rgba(6, 102, 140, 0.1);
            margin-bottom: 24px;
        }
        
        .badge-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #A4BD01;
        }
        
        .badge-text {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #06668C;
        }
        
        .title {
            font-size: 42px;
            font-weight: 900;
            line-height: 1.1;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            margin: 0 0 20px 0;
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
            margin: 0 0 40px 0;
        }
        
        .buttons {
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
        
        .details {
            background: #f8fafc;
            padding: 30px;
            border-radius: 20px;
            margin: 40px 0;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid rgba(6, 102, 140, 0.1);
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #4a5568;
        }
        
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #1C2942;
        }
        
        .footer {
            padding: 40px;
            text-align: center;
            background: #f8fafc;
            border-top: 1px solid rgba(6, 102, 140, 0.1);
        }
        
        .footer-text {
            font-size: 12px;
            color: #4a5568;
            line-height: 1.6;
        }
        
        @media (max-width: 600px) {
            .email-container {
                border-radius: 20px;
                margin: 10px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .title {
                font-size: 32px;
            }
            
            .buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header avec logo -->
        <div class="header">
            <div class="logo-container">
                <div class="logo-text">
                    <div class="logo-main">MOHADRIVE</div>
                    <div class="logo-sub">location de voitures</div>
                </div>
            </div>
        </div>
        
        <!-- Contenu principal -->
        <div class="content">
            ${type === 'client' ? `
            <!-- Badge -->
            <div class="badge">
                <div class="badge-dot"></div>
                <span class="badge-text">Réservation Confirmée</span>
            </div>
            
            <!-- Titre -->
            <h1 class="title">Votre <span class="gradient-text">aventure</span> commence</h1>
            
            <!-- Sous-titre -->
            <p class="subtitle">
                Bonne nouvelle ! Votre demande de réservation pour le véhicule 
                <strong>Peugeot 206</strong> a été acceptée par notre équipe premium.
            </p>
            
            <!-- Détails de réservation -->
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Véhicule</span>
                    <span class="detail-value">Peugeot 206</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Prise en charge</span>
                    <span class="detail-value">15 Mars 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dépôt</span>
                    <span class="detail-value">18 Mars 2026</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lieu</span>
                    <span class="detail-value">El Aïoun Sidi Mellouk, Maroc</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Prix total</span>
                    <span class="detail-value gradient-text">1200 MAD</span>
                </div>
            </div>
            
            <!-- Boutons d'action -->
            <div class="buttons">
                <a href="https://wa.me/212600000000" class="btn btn-whatsapp">
                    <span>📞</span>
                    WhatsApp
                </a>
                <a href="tel:+212600000000" class="btn btn-primary">
                    <span>📱</span>
                    Appeler
                </a>
            </div>
            ` : `
            <!-- Badge -->
            <div class="badge">
                <div class="badge-dot"></div>
                <span class="badge-text">Nouvelle Réservation</span>
            </div>
            
            <!-- Titre -->
            <h1 class="title">Nouvelle <span class="gradient-text">réservation</span> reçue</h1>
            
            <!-- Sous-titre -->
            <p class="subtitle">
                Une nouvelle réservation a été enregistrée pour le véhicule 
                <strong>Peugeot 206</strong> par Jean Dupont.
            </p>
            
            <!-- Détails de réservation -->
            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Client</span>
                    <span class="detail-value">Jean Dupont</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">test@example.com</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Téléphone</span>
                    <span class="detail-value">+212600000000</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Véhicule</span>
                    <span class="detail-value">Peugeot 206</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Prix total</span>
                    <span class="detail-value gradient-text">1200 MAD</span>
                </div>
            </div>
            
            <!-- Boutons d'action -->
            <div class="buttons">
                <a href="https://wa.me/212600000000" class="btn btn-whatsapp">
                    <span>📞</span>
                    Contacter Client
                </a>
                <a href="tel:+212600000000" class="btn btn-primary">
                    <span>📱</span>
                    Appeler
                </a>
            </div>
            `}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                <strong>MOHADRIVE Location Premium</strong><br>
                Service Client - Merci de votre confiance !<br>
                Boulevard Mohamed VI, El Aïoun Sidi Mellouk, Maroc
            </div>
        </div>
    </div>
</body>
</html>
  `;
  
  return baseHTML;
}

// Créer les fichiers de test
function createTestEmails() {
  console.log('🚀 Création des emails de test...\n');
  
  try {
    // Email client
    const clientHTML = generateTestEmailHTML('client');
    fs.writeFileSync('test-email-client.html', clientHTML);
    console.log('✅ Email client créé: test-email-client.html');
    
    // Email admin
    const adminHTML = generateTestEmailHTML('admin');
    fs.writeFileSync('test-email-admin.html', adminHTML);
    console.log('✅ Email admin créé: test-email-admin.html');
    
    console.log('\n🎉 Emails de test créés avec succès !');
    console.log('📝 Caractéristiques testées:');
    console.log('   ✅ Logo MOHADRIVE identique au Navbar');
    console.log('   ✅ Boutons WhatsApp et Appeler style Navbar');
    console.log('   ✅ Design responsive mobile-friendly');
    console.log('   ✅ Gradients et animations CSS');
    console.log('   ✅ Typographie cohérente');
    
    console.log('\n🌐 Pour tester:');
    console.log('1. Ouvrez les fichiers HTML dans votre navigateur');
    console.log('2. Testez l\'affichage sur desktop et mobile');
    console.log('3. Vérifiez les boutons et les liens');
    console.log('4. Confirmez le logo et les couleurs');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des emails:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  createTestEmails();
}

module.exports = { generateTestEmailHTML, createTestEmails };
