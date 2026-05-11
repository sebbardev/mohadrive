import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_URL = "https://mohadrive.com/api";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { id } = params;
    
    const apiUrl = `${API_URL}/admin/reviews/${id}`;
    console.log('Forwarding PUT to Laravel reviews:', apiUrl);
    
    const laravelResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${(session.user as any).accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await laravelResponse.json();

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'avis" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('DELETE request received for review ID:', params.id);
    
    const session = await getServerSession(authOptions);
    console.log('Session check:', {
      exists: !!session,
      hasUser: !!session?.user,
      userRole: session?.user?.role,
      hasToken: !!(session?.user as any)?.accessToken
    });
    
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      console.log('Access denied - not admin or no session');
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const { id } = params;
    
    const apiUrl = `${API_URL}/admin/reviews/${id}`;
    console.log('Forwarding DELETE to Laravel reviews:', apiUrl);
    
    const laravelResponse = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${(session.user as any).accessToken}`,
        "Accept": "application/json",
      },
    });

    console.log('Laravel response status:', laravelResponse.status);
    const data = await laravelResponse.json();
    console.log('Laravel response data:', data);

    return NextResponse.json(data, { status: laravelResponse.status });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'avis" },
      { status: 500 }
    );
  }
}
