import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();

    const laravelResponse = await fetch(
      `${API_URL}/contact-messages/bulk-update`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(session.user as any).accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await laravelResponse.json();

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error bulk updating contact messages:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'action groupée" },
      { status: 500 }
    );
  }
}
