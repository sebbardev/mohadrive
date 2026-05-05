import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const accessToken = (session.user as any).accessToken as string | undefined;
    if (!accessToken) {
      return NextResponse.json({ message: "Token manquant" }, { status: 401 });
    }

    const id = params.id;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    
    const response = await fetch(`${API_URL}/cars/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Erreur lors de la suppression" }));
      return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    console.error("Erreur API Car DELETE:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
