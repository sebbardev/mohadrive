import { Resend } from 'resend';
import { ReactNode } from 'react';
import { render } from '@react-email/render';
import { StyledContactEmail } from '@/emails/StyledContactEmail';
import { StyledAdminBookingEmail } from '@/emails/StyledAdminBookingEmail';
import { StyledReviewEmail } from '@/emails/StyledReviewEmail';

// On n'instancie Resend que si la clé est présente pour éviter le crash au démarrage
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

// Email templates simples (sans React Email pour l'instant)
const createContactEmailHTML = (data: { name: string; email: string; phone?: string; subject: string; message: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #06668C, #427AA1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #06668C; display: block; margin-bottom: 5px; }
    .value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #679436; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Nouveau Message de Contact</h1>
      <p>Premium Car Rental - MohaDrive</p>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Nom:</span>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <span class="label">Email:</span>
        <div class="value">${data.email}</div>
      </div>
      ${data.phone ? `<div class="field"><span class="label">Téléphone:</span><div class="value">${data.phone}</div></div>` : ''}
      <div class="field">
        <span class="label">Sujet:</span>
        <div class="value">${data.subject}</div>
      </div>
      <div class="field">
        <span class="label">Message:</span>
        <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      <p>Ce message a été envoyé depuis le formulaire de contact de votre site.</p>
      <p><a href="mailto:${data.email}">Répondre à ${data.name}</a></p>
    </div>
  </div>
</body>
</html>
`;

const createBookingEmailHTML = (data: { firstName: string; lastName: string; email: string; phone: string; carBrand: string; carModel: string; startDate: string; endDate: string; location: string; totalPrice?: number }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #679436, #A4BD01); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #06668C; display: block; margin-bottom: 5px; }
    .value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #679436; }
    .highlight { background: linear-gradient(135deg, #06668C, #427AA1); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Nouvelle Réservation</h1>
      <p>Premium Car Rental - MohaDrive</p>
    </div>
    <div class="content">
      <div class="highlight">
        <strong>${data.carBrand} ${data.carModel}</strong><br>
        ${data.startDate} → ${data.endDate}
      </div>
      <div class="field">
        <span class="label">Client:</span>
        <div class="value">${data.firstName} ${data.lastName}</div>
      </div>
      <div class="field">
        <span class="label">Email:</span>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <span class="label">Téléphone:</span>
        <div class="value">${data.phone}</div>
      </div>
      <div class="field">
        <span class="label">Lieu de prise en charge:</span>
        <div class="value">${data.location}</div>
      </div>
      ${data.totalPrice ? `<div class="field"><span class="label">Prix total estimé:</span><div class="value">${data.totalPrice} MAD</div></div>` : ''}
    </div>
    <div class="footer">
      <p><a href="mailto:${data.email}">Contacter le client</a> | <a href="tel:${data.phone}">Appeler</a></p>
    </div>
  </div>
</body>
</html>
`;

export const ADMIN_EMAIL = "sbbrhaythamcreetou@gmail.com";
export const FROM_EMAIL = "Premium Car Rental <onboarding@resend.dev>";

/**
 * Fonction utilitaire pour envoyer des emails de manière sécurisée (ne plante pas si pas de clé)
 */
export async function sendEmail({ to, subject, react }: { to: string, subject: string, react: any }) {
  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("📧 [MOCK EMAIL] - Mode Développement (Pas de clé API)");
    console.log(`Destinataire: ${to}`);
    console.log(`Sujet: ${subject}`);
    console.log("Contenu: (Template React-Email détecté)");
    console.log("--------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    });
    return { success: true, data };
  } catch (error) {
    console.error("❌ [EMAIL ERROR]:", error);
    return { success: false, error };
  }
}

/**
 * Envoyer une notification à l'admin lors d'un nouveau message de contact
 */
export async function sendContactNotification(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("📧 [CONTACT NOTIFICATION - MOCK]");
    console.log(`Admin: ${ADMIN_EMAIL}`);
    console.log(`De: ${data.name} (${data.email})`);
    console.log(`Sujet: ${data.subject}`);
    console.log("--------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const html = await render(StyledContactEmail({ contact: data }));
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `📧 Nouveau message: ${data.subject}`,
      html,
    });
    console.log("✅ Email de contact envoyé à l'admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Erreur envoi email contact:", error);
    return { success: false, error };
  }
}

/**
 * Envoyer une notification à l'admin lors d'une nouvelle réservation
 */
export async function sendBookingNotification(data: { firstName: string; lastName: string; email: string; phone: string; carBrand: string; carModel: string; carImage?: string; startDate: string; endDate: string; location: string; totalPrice?: number }) {
  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("🚗 [BOOKING NOTIFICATION - MOCK]");
    console.log(`Admin: ${ADMIN_EMAIL}`);
    console.log(`Client: ${data.firstName} ${data.lastName}`);
    console.log(`Véhicule: ${data.carBrand} ${data.carModel}`);
    console.log("--------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const carImageAbsolute = data.carImage
      ? data.carImage.startsWith("http")
        ? data.carImage
        : `${appUrl}${data.carImage}`
      : undefined;

    const html = await render(StyledAdminBookingEmail({
      booking: {
        customerName: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        carName: `${data.carBrand} ${data.carModel}`,
        carBrand: data.carBrand,
        carModel: data.carModel,
        carImage: carImageAbsolute,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        totalPrice: data.totalPrice || 0,
      },
    }));
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚗 Nouvelle réservation: ${data.carBrand} ${data.carModel}`,
      html,
    });
    console.log("✅ Email de réservation envoyé à l'admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Erreur envoi email réservation:", error);
    return { success: false, error };
  }
}

const createReviewEmailHTML = (data: { name: string; email: string; rating: number; content: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
      line-height: 1.6; 
      color: #1C2942;
      background: #EBF2FA;
      margin: 0;
      padding: 40px 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(6, 102, 140, 0.1);
      border: 1px solid #f3f4f6;
    }
    .header { 
      background: linear-gradient(135deg, #06668C 0%, #427AA1 100%); 
      color: white; 
      padding: 40px; 
      text-align: center;
    }
    .header-tag {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      margin: 0 0 10px 0;
      opacity: 0.7;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin: 0 0 8px 0;
    }
    .header p {
      font-size: 13px;
      margin: 0;
      opacity: 0.8;
    }
    .rating-section {
      background: #EBF2FA;
      padding: 30px;
      text-align: center;
      border-bottom: 3px solid #A4BD01;
    }
    .stars {
      color: #A4BD01;
      font-size: 36px;
      letter-spacing: 4px;
      margin: 0 0 8px 0;
    }
    .rating-text {
      color: #06668C;
      font-size: 16px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }
    .content { 
      padding: 35px 40px;
    }
    .field { 
      margin-bottom: 20px;
      display: flex;
      align-items: baseline;
    }
    .label { 
      font-weight: 900;
      color: #4a5568;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      width: 100px;
    }
    .value { 
      color: #1C2942;
      font-weight: 700;
      font-size: 14px;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 25px 0;
    }
    .review-label {
      color: #06668C;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin: 0 0 12px 0;
    }
    .review-box {
      background: #EBF2FA;
      border-left: 4px solid #679436;
      border-radius: 16px;
      padding: 20px 24px;
    }
    .review-content {
      color: #1C2942;
      font-size: 15px;
      line-height: 1.7;
      font-style: italic;
      margin: 0;
    }
    .status-badge {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 9999px;
      padding: 12px 24px;
      margin: 0 40px 20px;
      text-align: center;
    }
    .status-text {
      color: #92400e;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }
    .cta-section {
      padding: 0 40px 35px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #679436;
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      box-shadow: 0 4px 14px rgba(103, 148, 54, 0.3);
    }
    .footer {
      border-top: 1px solid #e5e7eb;
      text-align: center;
      padding: 25px 40px;
      color: #4a5568;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="header-tag">Témoignages</p>
      <h1>⭐ NOUVEL AVIS CLIENT</h1>
      <p>Premium Car Rental - MohaDrive</p>
    </div>
    
    <div class="rating-section">
      <div class="stars">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</div>
      <p class="rating-text">${data.rating}/5 étoiles</p>
    </div>
    
    <div class="content">
      <div class="field">
        <span class="label">Client</span>
        <span class="value">${data.name}</span>
      </div>
      <div class="field">
        <span class="label">Email</span>
        <span class="value">${data.email}</span>
      </div>
      
      <hr class="divider">
      
      <p class="review-label">Avis du client</p>
      <div class="review-box">
        <p class="review-content">"${data.content.replace(/\n/g, '<br>')}"</p>
      </div>
    </div>
    
    <div class="status-badge">
      <p class="status-text">En attente de modération</p>
    </div>
    
    <div class="cta-section">
      <a href="mailto:${data.email}" class="button">Contacter le client</a>
    </div>
    
    <div class="footer">
      <p>Avis déposé sur mohadrive.ma</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Envoyer une notification à l'admin lors d'un nouvel avis
 */
export async function sendReviewNotification(data: { name: string; email: string; rating: number; content: string }) {
  if (!resend) {
    console.log("--------------------------------------------------");
    console.log("⭐ [REVIEW NOTIFICATION - MOCK]");
    console.log(`Admin: ${ADMIN_EMAIL}`);
    console.log(`Client: ${data.name}`);
    console.log(`Note: ${data.rating}/5`);
    console.log("--------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const html = await render(StyledReviewEmail({ review: data }));
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⭐ Nouvel avis: ${data.rating}/5 étoiles par ${data.name}`,
      html,
    });
    console.log("✅ Email d'avis envoyé à l'admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Erreur envoi email avis:", error);
    return { success: false, error };
  }
}
