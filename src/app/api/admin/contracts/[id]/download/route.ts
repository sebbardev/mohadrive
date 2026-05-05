import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const contractId = params.id;

    // Call Laravel backend to get the PDF
    const response = await fetch(`${API_URL}/contracts/${contractId}/download`, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erreur lors du téléchargement du PDF" },
        { status: response.status }
      );
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `contract_${contractId}.pdf`; // fallback
    
    if (contentDisposition) {
      // Try to extract filename* first (RFC 5987), then filename (RFC 6266)
      const filenameStarMatch = contentDisposition.match(/filename\*=['"]?[^'";]*'[^'";]*'([^'";\s]+)/i);
      if (filenameStarMatch && filenameStarMatch[1]) {
        filename = decodeURIComponent(filenameStarMatch[1]);
      } else {
        const filenameMatch = contentDisposition.match(/filename=['"]?([^'";\s]+)['"]?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
    }

    // Return the PDF with proper headers
    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors du téléchargement" },
      { status: 500 }
    );
  }
}
