"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RotateCcw, Car, CheckCircle, Plus, Check, Loader2, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateBookingStatus } from "@/services/bookingService";
import { getAllCars } from "@/services/carService";
import { createExpense } from "@/services/expenseService";

const RETURN_EXPENSE_TYPES = ["lavage", "vidange", "rÃ©paration", "pneu", "amende"];

export default function PendingReturnsSection() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [returnModal, setReturnModal] = useState<any | null>(null);
  const [returnCharges, setReturnCharges] = useState<{ type: string; amount: string; note: string }[]>([]);
  const [processingReturn, setProcessingReturn] = useState(false);
  const [cars, setCars] = useState<any[]>([]);

  const fetchReturns = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";
      const res = await fetch(`${API_URL}/bookings?per_page=100&sort_by=end_date&sort_order=asc`);
      const data = await res.json();
      const all: any[] = data.data || [];
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const in3days = new Date(today); in3days.setDate(today.getDate() + 3);
      const returns = all.filter((b: any) => {
        if (b.status !== "CONFIRMED" && b.status !== "IN_PROGRESS") return false;
        const end = new Date(b.end_date || b.endDate);
        return end <= in3days;
      });
      setBookings(returns);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchReturns();
    getAllCars().then(setCars).catch(() => {});
  }, []);

  const openModal = (b: any) => {
    setReturnModal(b);
    setReturnCharges([]);
  };

  const handleValidate = async () => {
    const accessToken = (session?.user as any)?.accessToken;
    if (!accessToken) { toast.error("Session expirÃ©e"); return; }
    setProcessingReturn(true);
    try {
      const validCharges = returnCharges.filter(c => c.type && c.amount);
      await Promise.all(validCharges.map(c =>
        createExpense({
          car_id: returnModal.car?.id || returnModal.car_id,
          type: c.type,
          amount: parseFloat(c.amount),
          date: new Date().toISOString().split("T")[0],
          note: c.note || undefined,
        }, accessToken)
      ));
      const ok = await updateBookingStatus(returnModal.id, "COMPLETED");
      if (ok) {
        toast.success(`Retour traitÃ©${validCharges.length > 0 ? ` + ${validCharges.length} charge(s)` : ""}`);
        setReturnModal(null);
        setReturnCharges([]);
        fetchReturns();
      } else {
        toast.error("Erreur lors du traitement");
      }
    } catch {
      toast.error("Erreur rÃ©seau");
    } finally {
      setProcessingReturn(false);
    }
  };

  if (loading) return null;
  if (bookings.length === 0) return null;

  return (
    <>
      <div className="admin-table-container">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <RotateCcw size={18} />
            </div>
            <div>
              <h2 className="admin-section-title">
                Retours{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">
                  Ã  Traiter
                </span>
              </h2>
              <p className="admin-label">{bookings.length} vÃ©hicule(s) Ã  rÃ©ceptionner</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="divide-y divide-gray-50">
          {bookings.map((b: any) => {
            const endDate = new Date(b.end_date || b.endDate);
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const isOverdue = endDate < today;
            const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-4">
                  {b.car?.image ? (
                    <div className="w-16 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      <img src={b.car.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Car size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-black text-[var(--color-text-main)] uppercase tracking-wide">
                      {b.car?.brand} {b.car?.model}
                    </p>
                    <p className="admin-label">{b.first_name} {b.last_name}</p>
                    <span className={`admin-pill text-[8px] mt-1 inline-block ${
                      isOverdue ? "admin-pill-error" : diff === 0 ? "admin-pill-warning" : "admin-pill-info"
                    }`}>
                      {isOverdue
                        ? `En retard (${Math.abs(diff)}j)`
                        : diff === 0 ? "Aujourd'hui"
                        : `Dans ${diff}j`} â€” {endDate.toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => openModal(b)}
                  className="admin-btn-secondary !py-2 !px-4 text-[9px] flex items-center gap-2"
                >
                  <RotateCcw size={12} />
                  Traiter le retour
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <h3 className="admin-section-title">Traiter le retour</h3>
                  <p className="admin-label">{returnModal.car?.brand} {returnModal.car?.model} â€” {returnModal.first_name} {returnModal.last_name}</p>
                </div>
              </div>
              <button onClick={() => setReturnModal(null)} className="admin-btn-icon">
                <span className="text-gray-400 hover:text-gray-700 text-lg leading-none">âœ•</span>
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto admin-scroll-container">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                  Charges Ã  enregistrer <span className="normal-case font-medium">(optionnel)</span>
                </p>
                {returnCharges.map((charge, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <select
                      value={charge.type}
                      onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? { ...c, type: e.target.value } : c))}
                      className="admin-input flex-1 text-xs py-2 px-3 h-auto"
                    >
                      <option value="">Type</option>
                      {RETURN_EXPENSE_TYPES.map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Montant DH"
                      value={charge.amount}
                      onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? { ...c, amount: e.target.value } : c))}
                      className="admin-input w-28 text-xs py-2 px-3 h-auto"
                    />
                    <input
                      type="text"
                      placeholder="Note"
                      value={charge.note}
                      onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? { ...c, note: e.target.value } : c))}
                      className="admin-input flex-1 text-xs py-2 px-3 h-auto"
                    />
                    <button
                      onClick={() => setReturnCharges(prev => prev.filter((_, idx) => idx !== i))}
                      className="admin-btn-icon !text-red-400 hover:!bg-red-50 flex-shrink-0"
                    >
                      <span className="text-sm leading-none">âœ•</span>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setReturnCharges(prev => [...prev, { type: "", amount: "", note: "" }])}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:opacity-70 transition-opacity mt-1"
                >
                  <Plus size={12} /> Ajouter une charge
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button onClick={() => setReturnModal(null)} className="admin-btn-secondary !py-2 !px-5 text-[9px]">
                Annuler
              </button>
              <button
                disabled={processingReturn}
                onClick={handleValidate}
                className="admin-btn-primary !py-2 !px-5 text-[9px] group flex items-center gap-2"
              >
                {processingReturn ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Valider le retour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
