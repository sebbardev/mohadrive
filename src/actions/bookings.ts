"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function createBooking(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erreur serveur" }));
      return { success: false, error: error.message || "Erreur lors de la réservation" };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Booking error:", error);
    return { success: false, error: error.message || "Erreur de connexion" };
  }
}
