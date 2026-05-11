import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const apiUrl = `${API_URL}/contact-messages/stats/unread-count`;
    
    const laravelResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${(session.user as any).accessToken}`,
        "Accept": "application/json",
      },
    });

    const data = await laravelResponse.json();

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { message: "Erreur lors du chargement du compteur" },
      { status: 500 }
    );
  }
}
