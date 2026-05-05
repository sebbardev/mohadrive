import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const laravelResponse = await fetch(
      `${API_URL}/contact-messages/${params.id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${(session.user as any).accessToken}`,
          "Accept": "application/json",
        },
      }
    );

    const data = await laravelResponse.json();

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error fetching contact message:", error);
    return NextResponse.json(
      { message: "Erreur lors du chargement du message" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();

    const laravelResponse = await fetch(
      `${API_URL}/contact-messages/${params.id}`,
      {
        method: "PUT",
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
    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const laravelResponse = await fetch(
      `${API_URL}/contact-messages/${params.id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${(session.user as any).accessToken}`,
          "Accept": "application/json",
        },
      }
    );

    const data = await laravelResponse.json();

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression du message" },
      { status: 500 }
    );
  }
}
