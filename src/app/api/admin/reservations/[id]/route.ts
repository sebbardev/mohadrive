import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/services/emailService";
import BookingClientEmail from "@/emails/BookingClientEmail";
import { BookingAdminEmail } from "@/emails/BookingAdminEmail";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    // On récupère d'abord les détails de la réservation pour l'email
    const bookingRes = await fetch(`${API_URL}/bookings/${params.id}`);
    const bookingData = await bookingRes.json();
    const booking = bookingData.data || bookingData;

    const response = await fetch(`${API_URL}/bookings/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => null);

    // Si le statut passe à CONFIRMED, on envoie l'email au client
    if (response.ok && status === "CONFIRMED" && booking.email && resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: booking.email,
          subject: "Réservation Confirmée - Premium Car Rental",
          react: BookingClientEmail({
            booking: {
              customerName: `${booking.first_name} ${booking.last_name}`,
              carName: `${booking.car?.brand} ${booking.car?.model}`,
              startDate: new Date(booking.start_date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              endDate: new Date(booking.end_date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              location: booking.location,
            }
          }),
        });
        console.log(`[EMAIL] Confirmation envoyée à ${booking.email}`);
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email client:", emailError);
      }

      // Envoyer aussi un email à l'admin pour notification
      if (resend) {
        try {
          await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `✅ Réservation Confirmée - ${booking.car?.brand} ${booking.car?.model}`,
          react: BookingAdminEmail({
            booking: {
              id: booking.id,
              customerName: `${booking.first_name} ${booking.last_name}`,
              carName: `${booking.car?.brand} ${booking.car?.model}`,
              startDate: new Date(booking.start_date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }),
              endDate: new Date(booking.end_date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }),
              location: booking.location,
              totalPrice: booking.total_price || 0,
              phone: booking.phone,
            }
          }),
        });
        console.log(`[EMAIL] Notification confirmation envoyée à l'admin ${ADMIN_EMAIL}`);
        } catch (emailError) {
          console.error("Erreur lors de l'envoi de l'email admin:", emailError);
        }
      }
    }

    // Si le statut passe à CANCELLED, notifier le client
    if (response.ok && status === "CANCELLED" && booking.email && resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: booking.email,
          subject: "Réservation Annulée - Premium Car Rental",
          react: null, // Will use HTML
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #dc2626;">Réservation Annulée</h2>
              <p>Bonjour ${booking.first_name} ${booking.last_name},</p>
              <p>Nous vous informons que votre réservation pour le véhicule <strong>${booking.car?.brand} ${booking.car?.model}</strong> a été annulée.</p>
              <p><strong>Détails:</strong></p>
              <ul>
                <li>Période: du ${new Date(booking.start_date).toLocaleDateString('fr-FR')} au ${new Date(booking.end_date).toLocaleDateString('fr-FR')}</li>
                <li>Lieu: ${booking.location}</li>
              </ul>
              <p>Pour toute question, n'hésitez pas à nous contacter.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #777;">Premium Car Rental - Casablanca, Maroc</p>
            </div>
          `,
        });
        console.log(`[EMAIL] Notification d'annulation envoyée à ${booking.email}`);
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email d'annulation:", emailError);
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur API Booking PATCH:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
