import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisÃ©" }, { status: 401 });
    }

    const accessToken = (session.user as any).accessToken as string | undefined;
    if (!accessToken) {
      return NextResponse.json({ message: "Token manquant" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, currentPassword, newPassword, profileImage } = body;

    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";
    const response = await fetch(`${API_URL}/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, email, currentPassword, newPassword, profile_image: profileImage }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message || "Erreur lors de la mise Ã  jour du profil" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Profil mis Ã  jour avec succÃ¨s", user: data });
  } catch (error) {
    console.error("Erreur API Profile PUT:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
