"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page des charges comme page par défaut
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4 text-[var(--color-primary)]" size={48} />
        <p className="admin-label">Redirection vers le panel admin...</p>
      </div>
    </div>
  );
}
