import CarForm from "@/components/admin/CarForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AddCarPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-6">
        <Link
          href="/admin/voitures"
          className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-[var(--color-primary)] rounded-2xl transition-all shadow-sm group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-[var(--color-primary)] uppercase tracking-tighter">Ajouter un <span className="text-[var(--color-secondary)]">Véhicule</span></h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-0.5 w-8 bg-[var(--color-highlight)] rounded-full" />
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Nouveau membre de la flotte</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-2">
        <CarForm />
      </div>
    </div>
  );
}
