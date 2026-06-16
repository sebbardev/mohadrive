"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { CheckCircle2, ClipboardList, Plus, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

type PendingReturn = {
  id: string;
  car_id: string;
  car: { brand?: string; model?: string; image?: string };
  first_name: string;
  last_name: string;
  start_date: string;
  end_date: string;
  status: string;
};

type ExpenseDraft = {
  enabled: boolean;
  type: string;
  amount: string;
  note: string;
};

export default function ReturnIntakePanel({ pendingReturns }: { pendingReturns: PendingReturn[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;

  const [active, setActive] = useState<PendingReturn | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Limiter l'affichage Ã  3 retours par dÃ©faut
  const displayedReturns = showAll ? pendingReturns : pendingReturns.slice(0, 3);

  const [returnMileage, setReturnMileage] = useState<string>("");
  const [returnCondition, setReturnCondition] = useState<string>("bon");
  const [returnNote, setReturnNote] = useState<string>("");

  const [expenses, setExpenses] = useState<Record<string, ExpenseDraft>>({
    lavage: { enabled: false, type: "lavage", amount: "", note: "" },
    entretien: { enabled: false, type: "entretien", amount: "", note: "" },
    vidange: { enabled: false, type: "vidange", amount: "", note: "" },
    reparation: { enabled: false, type: "reparation", amount: "", note: "" },
    amendes: { enabled: false, type: "amendes", amount: "", note: "" },
    "autres frais": { enabled: false, type: "autres frais", amount: "", note: "" },
  });

  const resetForm = () => {
    setReturnMileage("");
    setReturnCondition("bon");
    setReturnNote("");
    setExpenses({
      lavage: { enabled: false, type: "lavage", amount: "", note: "" },
      entretien: { enabled: false, type: "entretien", amount: "", note: "" },
      vidange: { enabled: false, type: "vidange", amount: "", note: "" },
      reparation: { enabled: false, type: "reparation", amount: "", note: "" },
      amendes: { enabled: false, type: "amendes", amount: "", note: "" },
      "autres frais": { enabled: false, type: "autres frais", amount: "", note: "" },
    });
  };

  const open = (item: PendingReturn) => {
    setActive(item);
    resetForm();
  };

  const close = () => {
    setActive(null);
    resetForm();
  };

  // Block body scroll when modal is open
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [active]);

  const selectedExpenses = useMemo(() => {
    return Object.values(expenses)
      .filter((e) => e.enabled)
      .map((e) => ({
        type: e.type,
        amount: Number(e.amount || 0),
        note: e.note || undefined,
      }))
      .filter((e) => Number.isFinite(e.amount) && e.amount >= 0);
  }, [expenses]);

  const submit = async () => {
    if (!active) return;
    if (!accessToken) {
      toast.error("Vous devez être connecté en admin.");
      return;
    }

    for (const exp of selectedExpenses) {
      if (!exp.amount || exp.amount <= 0) {
        toast.error("Veuillez renseigner un montant pour chaque charge sélectionnée.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/bookings/${active.id}/return-intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          return_mileage: returnMileage ? Number(returnMileage) : null,
          return_condition: returnCondition || null,
          return_note: returnNote || null,
          expenses: selectedExpenses.length > 0 ? selectedExpenses : [],
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.message || "Erreur lors de l'enregistrement du retour.");
        setSubmitting(false);
        return;
      }

      toast.success("Retour enregistré + charges créées.");
      close();
      router.refresh();
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="admin-card bg-white border-gray-100 shadow-sm p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 bg-[var(--color-primary)]/10 rounded-xl md:rounded-2xl border border-[var(--color-primary)]/20 text-[var(--color-primary)] shadow-inner">
              <ClipboardList size={18} className="md:w-5 md:h-5" />
            </div>
            <div>
              <h3 className="admin-section-title text-lg md:text-xl tracking-tight text-[var(--color-primary)]">
                Retours <span className="text-[var(--color-accent)]">Ã  traiter</span>
              </h3>
              <p className="admin-label text-[9px] md:text-[10px]">Voitures revenues • Saisir dépenses + kilométrage + état</p>
            </div>
          </div>
          <span className="admin-pill admin-pill-warning">{pendingReturns.length} retour(s)</span>
        </div>

        <div className="space-y-3">
          {pendingReturns.length === 0 ? (
            <div className="py-10 text-center bg-gray-50/50 rounded-[2rem] border border-gray-100">
              <p className="admin-label text-[10px]">Aucun retour Ã  traiter pour le moment.</p>
              <p className="text-[10px] font-bold text-gray-400 mt-2">
                Le bloc s'affiche quand une réservation est terminée (status COMPLETED ou date de fin passée) et que le retour n'est pas encore validé.
              </p>
            </div>
          ) : (
            displayedReturns.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-gray-50/50 rounded-[1.5rem] md:rounded-[2rem] border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-md transition-all group gap-4"
              >
                <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                  {/* Car Image - Rectangular */}
                  <div className="w-24 h-16 md:w-32 md:h-20 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                    {r.car?.image ? (
                      <img 
                        src={r.car.image} 
                        alt={`${r.car.brand} ${r.car.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] font-black text-lg">
                        {r.car?.brand?.charAt(0) || 'V'}
                      </div>
                    )}
                  </div>
                  
                  {/* Car & Client Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] md:text-xs font-black text-[var(--color-primary)] uppercase tracking-wider truncate">
                      {r.car?.brand} {r.car?.model}
                    </p>
                    <p className="mt-1 text-[10px] md:text-[11px] font-bold text-gray-600 truncate">
                      Client: {r.first_name} {r.last_name}
                    </p>
                    <p className="admin-label mt-0.5 text-gray-400 text-[8px] md:text-[9px] truncate">
                      {r.start_date} â†’ {r.end_date}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => open(r)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-highlight)] text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg text-[10px] shrink-0"
                >
                  <Plus size={14} strokeWidth={3} />
                  Traiter retour
                </button>
              </div>
            ))
          )}
          
          {/* Bouton "voir plus" si plus de 3 retours */}
          {pendingReturns.length > 3 && (
            <div className="pt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="admin-btn-secondary w-full"
              >
                {showAll ? (
                  <>
                    <span>Voir moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Voir plus ({pendingReturns.length - 3} autres)</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {active && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={close}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-8 sm:p-10 max-h-[85vh] overflow-y-auto animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              margin: 'auto',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="min-w-0 flex-1">
                <h3 className="admin-section-title truncate">
                  Retour véhicule • {active.car?.brand} {active.car?.model}
                </h3>
                <p className="admin-label mt-1 truncate">
                  {active.first_name} {active.last_name}
                </p>
              </div>
              <button onClick={close} className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all flex-shrink-0">
                <X size={24} />
              </button>
            </div>

            {/* Car Image - Rectangular */}
            {active.car?.image && (
              <div className="mb-8 rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg">
                <img 
                  src={active.car.image} 
                  alt={`${active.car.brand} ${active.car.model}`}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                />
              </div>
            )}

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="admin-label block mb-2">Kilométrage retour</label>
                  <input
                    type="number"
                    min={0}
                    value={returnMileage}
                    onChange={(e) => setReturnMileage(e.target.value)}
                    className="admin-input"
                    placeholder="Ex: 45210"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="admin-label block mb-2">État véhicule</label>
                  <select
                    value={returnCondition}
                    onChange={(e) => setReturnCondition(e.target.value)}
                    className="admin-input"
                  >
                    <option value="bon">Bon</option>
                    <option value="moyen">Moyen</option>
                    <option value="mauvais">Mauvais</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="admin-label block mb-2">Note (optionnel)</label>
                  <input
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    className="admin-input"
                    placeholder="Ex: Rayure légère…"
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-inner">
                <div className="flex items-center justify-between mb-5">
                  <p className="admin-label !text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Quelles dépenses avez-vous ?</p>
                  <span className="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-widest">{selectedExpenses.length} sélectionnée(s)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(expenses).map(([key, exp]) => (
                    <div key={key} className="bg-white border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={exp.enabled}
                            onChange={(e) =>
                              setExpenses((p) => ({
                                ...p,
                                [key]: { ...p[key], enabled: e.target.checked },
                              }))
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-xs font-black uppercase tracking-wider text-[var(--color-primary)] truncate">{exp.type}</span>
                        </label>
                        {exp.enabled && (
                          <span className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--color-accent)] uppercase tracking-widest">
                            <CheckCircle2 size={14} />
                            OK
                          </span>
                        )}
                      </div>

                      {exp.enabled && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div>
                            <label className="admin-label block mb-1">Montant (DH)</label>
                            <input
                              type="number"
                              min={0}
                              value={exp.amount}
                              onChange={(e) =>
                                setExpenses((p) => ({
                                  ...p,
                                  [key]: { ...p[key], amount: e.target.value },
                                }))
                              }
                              className="admin-input"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="admin-label block mb-1">Note</label>
                            <input
                              value={exp.note}
                              onChange={(e) =>
                                setExpenses((p) => ({
                                  ...p,
                                  [key]: { ...p[key], note: e.target.value },
                                }))
                              }
                              className="admin-input"
                              placeholder="Optionnel"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={close} className="admin-btn-secondary">
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="admin-btn-primary !bg-[var(--color-accent)] hover:!bg-[var(--color-highlight)] shadow-[var(--color-accent)]/20 disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  Valider le retour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
