const { Resend } = require('resend');
const { render } = require('@react-email/render');
const React = require('react');

// Import des composants d'emails
const StyledBookingConfirmationEmail = require('../src/emails/StyledBookingConfirmationEmail').default;
const StyledAdminBookingEmail = require('../src/emails/StyledAdminBookingEmail').default;

// Configuration Resend
const resend = new Resend('re_votre_api_key_ici'); // Remplacez avec votre vraie clé API

// Données de test
const testBookingData = {
  customerName: "Jean Dupont",
  firstName: "Jean",
  lastName: "Dupont",
  email: "test@example.com",
  phone: "+212600000000",
  carName: "Peugeot 206",
  carBrand: "Peugeot",
  carModel: "206",
  carImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800&h=600",
  startDate: "15 Mars 2026",
  endDate: "18 Mars 2026",
  location: "El Aïoun Sidi Mellouk, Maroc",
  totalPrice: 1200,
  currency: "MAD"
};

async function sendTestEmails() {
  console.log('🚀 Début des tests d\'envoi d\'emails...\n');

  try {
    // Test 1: Email de confirmation client
    console.log('📧 Envoi de l\'email de confirmation client...');
    
    const clientEmailHtml = await render(
      React.createElement(StyledBookingConfirmationEmail, { 
        booking: testBookingData 
      })
    );

    const clientResult = await resend.emails.send({
      from: 'MOHADRIVE <noreply@mohadrive.ma>',
      to: ['votre-email@test.com'], // Remplacez avec votre email
      subject: '✅ Test - Réservation Confirmée - MOHADRIVE',
      html: clientEmailHtml,
    });

    console.log('✅ Email client envoyé:', clientResult.id);

    // Test 2: Email admin
    console.log('📧 Envoi de l\'email admin...');
    
    const adminEmailHtml = await render(
      React.createElement(StyledAdminBookingEmail, { 
        booking: testBookingData 
      })
    );

    const adminResult = await resend.emails.send({
      from: 'MOHADRIVE <noreply@mohadrive.ma>',
      to: ['admin@mohadrive.ma'], // Remplacez avec l'email admin
      subject: '🔔 Test - Nouvelle Réservation - MOHADRIVE',
      html: adminEmailHtml,
    });

    console.log('✅ Email admin envoyé:', adminResult.id);

    console.log('\n🎉 Tous les emails de test ont été envoyés avec succès !');
    console.log('📝 Vérifiez votre boîte de réception pour voir le nouveau design avec:');
    console.log('   - Logo MOHADRIVE identique au site');
    console.log('   - Boutons WhatsApp et Appeler style Navbar');
    console.log('   - Design responsive et moderne');

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Solution:');
      console.log('1. Ajoutez votre clé API Resend dans le script');
      console.log('2. Créez un compte sur https://resend.com');
      console.log('3. Copiez votre clé API et remplacez "re_votre_api_key_ici"');
    }
    
    if (error.message.includes('from address')) {
      console.log('\n💡 Solution:');
      console.log('1. Vérifiez votre domaine email dans Resend');
      console.log('2. Assurez-vous que le domaine est vérifié');
    }
  }
}

// Test local sans envoi (pour développement)
async function previewEmails() {
  console.log('🔍 Génération des aperçus d\'emails...\n');

  try {
    // Aperçu email client
    const clientEmailHtml = await render(
      React.createElement(StyledBookingConfirmationEmail, { 
        booking: testBookingData 
      })
    );

    // Sauvegarder en fichier local
    const fs = require('fs');
    fs.writeFileSync('test-client-email.html', clientEmailHtml);
    console.log('✅ Aperçu email client sauvegardé dans: test-client-email.html');

    // Aperçu email admin
    const adminEmailHtml = await render(
      React.createElement(StyledAdminBookingEmail, { 
        booking: testBookingData 
      })
    );

    fs.writeFileSync('test-admin-email.html', adminEmailHtml);
    console.log('✅ Aperçu email admin sauvegardé dans: test-admin-email.html');

    console.log('\n🌐 Ouvrez ces fichiers dans votre navigateur pour prévisualiser les emails');

  } catch (error) {
    console.error('❌ Erreur lors de la génération des aperçus:', error);
  }
}

// Menu interactif
const args = process.argv.slice(2);

if (args.includes('--preview')) {
  previewEmails();
} else if (args.includes('--send')) {
  sendTestEmails();
} else {
  console.log('📋 Usage du script:');
  console.log('node test-emails.js --preview  : Générer les aperçus locaux');
  console.log('node test-emails.js --send     : Envoyer les emails de test');
  console.log('\n💡 Commencez avec --preview pour vérifier le design');
}
