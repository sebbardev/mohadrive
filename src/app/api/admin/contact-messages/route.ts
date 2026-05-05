import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session check:', {
      exists: !!session,
      userRole: session?.user?.role,
      hasToken: !!(session?.user as any)?.accessToken
    });
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      console.warn('Unauthorized access attempt');
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.toString();
    
    const apiUrl = `${API_URL}/contact-messages${queryParams ? `?${queryParams}` : ""}`;
    console.log('Forwarding to Laravel:', apiUrl);
    
    const laravelResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${(session.user as any).accessToken}`,
        "Accept": "application/json",
      },
    });

    console.log('Laravel response status:', laravelResponse.status);
    
    const data = await laravelResponse.json();

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { message: "Erreur lors du chargement des messages" },
      { status: 500 }
    );
  }
}
