"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function ContractsPage() {
  const router = useRouter();
  useEffect(() => { const t = setTimeout(() => router.push("/admin/dashboard"), 3000); return () => clearTimeout(t); }, [router]);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
        <Lock size={36} className="text-gray-300" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Contrats</h2>
        <p className="text-gray-400 text-sm mt-2">Cette fonctionnalité n'est pas encore disponible.</p>
        <p className="text-gray-300 text-xs mt-1">Redirection vers le tableau de bord...</p>
      </div>
    </div>
  );
}
