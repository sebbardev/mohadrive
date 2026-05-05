import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const accessToken = (session.user as any).accessToken as string | undefined;
    if (!accessToken) {
      return NextResponse.json({ message: "Token manquant" }, { status: 401 });
    }

    const body = await req.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const response = await fetch(`${API_URL}/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        brand: body.brand,
        model: body.model,
        year: body.year,
        price_per_day: body.price_per_day ?? body.pricePerDay,
        currency: body.currency,
        fuel: body.fuel,
        transmission: body.transmission,
        category: body.category,
        image: body.image,
        images: body.images,
        description: body.description,
        features: body.features,
        deposit: body.deposit ?? 0,
        available: body.available,
      }),
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erreur API Car POST:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const response = await fetch(`${API_URL}/cars`, { cache: "no-store" });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
