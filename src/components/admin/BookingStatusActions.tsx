"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatus } from "@/services/bookingService";
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  PlayCircle,
  MoreVertical,
  Loader2,
  FilePlus
} from "lucide-react";
import Link from "next/link";

interface BookingStatusActionsProps {
  bookingId: string;
  currentStatus: string;
}

export default function BookingStatusActions({ bookingId, currentStatus }: BookingStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const success = await updateBookingStatus(bookingId, newStatus);

      if (success) {
        router.refresh();
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau");
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-gray-400 hover:text-white hover:bg-[#0f172a] rounded-lg transition-all"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <MoreVertical size={18} />}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {currentStatus === "CONFIRMED" && (
              <Link
                href={`/admin/contracts?prefill=${bookingId}`}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors uppercase tracking-wider"
              >
                <FilePlus size={14} />
                Générer Contrat
              </Link>
            )}
            {currentStatus !== "CONFIRMED" && (
              <button
                onClick={() => updateStatus("CONFIRMED")}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-green-500 hover:bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)]/10 transition-colors uppercase tracking-wider"
              >
                <CheckCircle size={14} />
                Confirmer
              </button>
            )}
            {currentStatus !== "CANCELLED" && (
              <button
                onClick={() => updateStatus("CANCELLED")}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-wider"
              >
                <XCircle size={14} />
                Annuler
              </button>
            )}
            {currentStatus !== "COMPLETED" && currentStatus === "CONFIRMED" && (
              <button
                onClick={() => updateStatus("COMPLETED")}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-blue-500 hover:bg-blue-500/10 transition-colors uppercase tracking-wider"
              >
                <CheckCircle size={14} />
                Terminer
              </button>
            )}
            {currentStatus !== "IN_PROGRESS" && currentStatus === "CONFIRMED" && (
              <button
                onClick={() => updateStatus("IN_PROGRESS")}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-400/10 transition-colors uppercase tracking-wider"
              >
                <PlayCircle size={14} />
                En cours
              </button>
            )}
            <button
              onClick={() => updateStatus("PENDING")}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-400 hover:bg-gray-700/50 transition-colors uppercase tracking-wider border-t border-gray-700"
            >
              <RotateCcw size={14} />
              Remettre en attente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
