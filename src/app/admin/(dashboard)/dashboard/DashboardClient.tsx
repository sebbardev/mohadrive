"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Calendar,
  FileText,
  CreditCard,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Plus,
  Loader2,
  RefreshCw,
  RotateCcw,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { updateBookingStatus } from "@/services/bookingService";
import { getAllCars } from "@/services/carService";
import { createExpense } from "@/services/expenseService";
import ExpenseForm from "@/components/admin/ExpenseForm";
import Link from "next/link";
import { useStatsDashboard } from "@/hooks/useStatsDashboard";

export default function DashboardClient() {
  const { data: session } = useSession();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [upcomingReturns, setUpcomingReturns] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [expenseBooking, setExpenseBooking] = useState<any | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [returnModal, setReturnModal] = useState<any | null>(null);
  const [returnCharges, setReturnCharges] = useState<{type: string; amount: string; note: string}[]>([]);
  const [processingReturn, setProcessingReturn] = useState(false);

  const RETURN_EXPENSE_TYPES = ['lavage', 'vidange', 'réparation', 'pneu', 'amende'];

  useEffect(() => {
    getAllCars().then(setCars).catch(() => {});
  }, []);

  const { data: stats, loading: statsLoading, refetch } = useStatsDashboard({ period: "all" });

  useEffect(() => {
    const fetchExtra = async () => {
      setLoadingExtra(true);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        const res = await fetch(`${API_BASE_URL}/bookings?per_page=50&sort_by=created_at&sort_order=desc`);
        const data = await res.json();
        const all: any[] = data.data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const in3days = new Date(today);
        in3days.setDate(today.getDate() + 3);
        setPendingBookings(all.filter((b: any) => b.status === "PENDING").slice(0, 4));
        setUpcomingReturns(
          all
            .filter((b: any) => {
              if (b.status !== "CONFIRMED" && b.status !== "IN_PROGRESS") return false;
              const end = new Date(b.end_date || b.endDate);
              return end >= today && end <= in3days;
            })
            .slice(0, 4)
        );
      } catch (_) {}
      finally { setLoadingExtra(false); }
    };
    fetchExtra();
  }, []);

  const quickActions = [
    { label: "Nouvelle Réservation", sub: "Créer une réservation client", icon: Calendar, href: "/admin/reservations?new=true", color: "from-[var(--color-primary)] to-[var(--color-secondary)]" },
    { label: "Nouveau Contrat", sub: "Générer un contrat de location", icon: FileText, href: "/admin/contracts?new=true", color: "from-[var(--color-accent)] to-[var(--color-highlight)]" },
    { label: "Ajouter une Charge", sub: "Enregistrer une dépense véhicule", icon: CreditCard, href: "/admin/expenses?new=true", color: "from-orange-400 to-orange-500" },
    { label: "Nouveau Véhicule", sub: "Ajouter un véhicule au parc", icon: Car, href: "/admin/voitures?new=true", color: "from-[var(--color-primary)] to-[var(--color-secondary)]" },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[var(--color-primary)]" size={48} />
          <p className="admin-label">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8 p-2 max-w-[1600px] mx-auto animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Tableau de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Bord</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">Vue globale de votre activité ce mois</p>
          </div>
        </div>
        <button onClick={refetch} className="relative overflow-hidden admin-btn-secondary !px-4">
          <div className="absolute inset-0 bg-[var(--color-primary)]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <RefreshCw size={16} className="relative z-10" />
          <span className="relative z-10">Actualiser</span>
        </button>
      </div>

      {/* KPIs */}
      {stats && (() => {
        const maxRev = Math.max(stats.totalRevenue, 1);
        const kpis = [
          { label: "Revenus du mois", value: `${stats.totalRevenue.toLocaleString()} DH`, icon: TrendingUp, color: "text-green-500", bar: "bg-green-400", barPct: 100, sub: "Chiffre d'affaires" },
          { label: "Charges du mois", value: `${stats.totalExpenses.toLocaleString()} DH`, icon: TrendingDown, color: "text-red-400", bar: "bg-red-400", barPct: Math.min(100, Math.round((stats.totalExpenses / maxRev) * 100)), sub: "Dépenses enregistrées" },
          { label: "Gain Net", value: `${stats.netGain.toLocaleString()} DH`, icon: DollarSign, color: stats.netGain >= 0 ? "text-[var(--color-highlight)]" : "text-red-400", bar: stats.netGain >= 0 ? "bg-[var(--color-highlight)]" : "bg-red-400", barPct: Math.min(100, Math.abs(Math.round((stats.netGain / maxRev) * 100))), highlight: stats.netGain >= 0, sub: "Bénéfice réel" },
          { label: "Réservations actives", value: stats.activeBookings.toString(), icon: Calendar, color: "text-blue-400", bar: "bg-blue-400", barPct: Math.min(100, stats.activeBookings * 10), sub: `${stats.pendingBookings} en attente` },
        ];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`admin-card !p-6 relative overflow-hidden group admin-card-hover ${kpi.highlight ? "bg-[var(--color-primary)] !border-none" : ""}`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 bg-white/5 group-hover:scale-150 transition-transform duration-700" />
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={kpi.highlight ? "admin-icon-container-highlight" : "admin-icon-container"}>
                      <Icon size={20} className={`md:w-6 md:h-6 ${kpi.color}`} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${kpi.highlight ? "bg-white/20 text-white/70" : "bg-gray-100 text-gray-400"}`}>{kpi.sub}</span>
                  </div>
                  <p className={`admin-label mb-1 relative z-10 ${kpi.highlight ? "text-white/60" : "text-gray-400"}`}>{kpi.label}</p>
                  <h3 className={`text-2xl font-black tracking-tighter relative z-10 ${kpi.highlight ? "text-white" : "text-[var(--color-primary)]"}`}>{kpi.value}</h3>
                  <div className={`mt-4 h-1.5 rounded-full relative z-10 ${kpi.highlight ? "bg-white/20" : "bg-gray-100"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${kpi.barPct}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${kpi.highlight ? "bg-white/60" : kpi.bar}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Réservations en attente */}
        <div className="admin-table-container">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="admin-section-title">En <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Attente</span></h2>
                <p className="admin-label">{pendingBookings.length} réservation(s) à traiter</p>
              </div>
            </div>
            <Link href="/admin/reservations" className="admin-btn-secondary !py-2 !px-4 text-[9px]">Voir tout</Link>
          </div>
          {loadingExtra ? (
            <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
          ) : pendingBookings.length === 0 ? (
            <div className="min-h-[160px] flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                <CheckCircle size={22} className="text-[var(--color-accent)]" />
              </div>
              <p className="admin-label text-[var(--color-accent)]">Aucune réservation en attente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-primary)] font-black text-xs flex-shrink-0">
                      {(b.first_name || b.firstName || "?")[0]}{(b.last_name || b.lastName || "")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--color-text-main)] uppercase">{b.first_name || b.firstName} {b.last_name || b.lastName}</p>
                      <p className="admin-label">{b.car?.brand} {b.car?.model}</p>
                    </div>
                  </div>
                  <Link href="/admin/reservations" className="admin-btn-icon group-hover:!bg-orange-100 group-hover:!text-orange-500">
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Rapides */}
        <div className="admin-table-container">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] text-white">
              <Plus size={18} />
            </div>
            <h2 className="admin-section-title">Actions <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Rapides</span></h2>
          </div>
          <div className="divide-y divide-gray-50">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-wide">{action.label}</p>
                    <p className="admin-label text-[9px] mt-0.5">{action.sub}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Retours à traiter */}
      {stats && (
        <div className="admin-table-container">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                <RotateCcw size={18} />
              </div>
              <div>
                <h2 className="admin-section-title">Retours <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">à Traiter</span></h2>
                <p className="admin-label">{stats.pendingReturns?.length ?? 0} véhicule(s) à réceptionner</p>
              </div>
            </div>
            <Link href="/admin/planning" className="admin-btn-secondary !py-2 !px-4 text-[9px]">Planning</Link>
          </div>
          {(!stats.pendingReturns || stats.pendingReturns.length === 0) ? (
            <div className="min-h-[160px] flex flex-col items-center justify-center gap-2">
              <CheckCircle size={32} className="text-[var(--color-accent)]" />
              <p className="admin-label text-[var(--color-accent)]">Aucun retour à traiter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.pendingReturns.slice(0, 4).map((b: any) => {
                const endDate = new Date(b.end_date || b.endDate);
                const today = new Date(); today.setHours(0,0,0,0);
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
                        <p className="text-sm font-black text-[var(--color-text-main)] uppercase tracking-wide">{b.car?.brand} {b.car?.model}</p>
                        <p className="admin-label">{b.first_name || b.firstName} {b.last_name || b.lastName}</p>
                        <span className={`admin-pill text-[8px] mt-1 inline-block ${
                          isOverdue ? 'admin-pill-error' : diff === 0 ? 'admin-pill-warning' : 'admin-pill-info'
                        }`}>
                          {isOverdue ? `En retard (${Math.abs(diff)}j)` : diff === 0 ? "Aujourd'hui" : `Dans ${diff}j`} — {endDate.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setReturnModal(b); setReturnCharges([]); }}
                      className="admin-btn-secondary !py-2 !px-4 text-[9px] flex items-center gap-2"
                    >
                      <RotateCcw size={12} />
                      Traiter le retour
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Activité récente */}
      {stats && stats.recentBookings?.length > 0 && (
        <div className="admin-table-container">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                <Calendar size={18} />
              </div>
              <h2 className="admin-section-title">Activité <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Récente</span></h2>
            </div>
            <Link href="/admin/reservations" className="admin-btn-secondary !py-2 !px-4 text-[9px]">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentBookings.slice(0, 4).map((b: any) => {
              const statusMap: Record<string, { label: string; cls: string }> = {
                CONFIRMED: { label: "Confirmé", cls: "admin-pill-success" },
                PENDING: { label: "En attente", cls: "admin-pill-warning" },
                CANCELLED: { label: "Annulé", cls: "admin-pill-error" },
                COMPLETED: { label: "Terminé", cls: "admin-pill-info" },
                IN_PROGRESS: { label: "En cours", cls: "admin-pill-info" },
              };
              const s = statusMap[b.status] ?? { label: b.status, cls: "" };
              return (
                <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-primary)] font-black text-xs flex-shrink-0">
                    {(b.first_name || "?")[0]}{(b.last_name || "?")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-wide truncate">{b.first_name} {b.last_name}</p>
                    <p className="admin-label text-[9px] mt-0.5 truncate">{b.car?.brand} {b.car?.model} — {new Date(b.start_date).toLocaleDateString("fr-FR")} → {new Date(b.end_date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`admin-pill ${s.cls}`}>{s.label}</span>
                    <span className="text-sm font-black text-[var(--color-primary)]">{(b.total_price || 0).toLocaleString()} <span className="text-[9px] font-bold text-gray-400">DH</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>

      {returnModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                <RotateCcw size={18} />
              </div>
              <div>
                <h3 className="admin-section-title">Traiter le retour</h3>
                <p className="admin-label">{returnModal.car?.brand} {returnModal.car?.model} — {returnModal.first_name} {returnModal.last_name}</p>
              </div>
            </div>
            <button onClick={() => setReturnModal(null)} className="admin-btn-icon"><AlertTriangle size={0} className="hidden" /><span className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</span></button>
          </div>

          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto admin-scroll-container">
            {/* Charges */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Charges à enregistrer (optionnel)</p>
              {returnCharges.map((charge, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <select
                    value={charge.type}
                    onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? {...c, type: e.target.value} : c))}
                    className="admin-input flex-1 text-xs py-2 px-3 h-auto"
                  >
                    <option value="">Type</option>
                    {RETURN_EXPENSE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Montant DH"
                    value={charge.amount}
                    onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? {...c, amount: e.target.value} : c))}
                    className="admin-input w-28 text-xs py-2 px-3 h-auto"
                  />
                  <input
                    type="text"
                    placeholder="Note"
                    value={charge.note}
                    onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? {...c, note: e.target.value} : c))}
                    className="admin-input flex-1 text-xs py-2 px-3 h-auto"
                  />
                  <button onClick={() => setReturnCharges(prev => prev.filter((_, idx) => idx !== i))} className="admin-btn-icon !text-red-400 hover:!bg-red-50 flex-shrink-0">
                    <span className="text-sm leading-none">✕</span>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setReturnCharges(prev => [...prev, {type: '', amount: '', note: ''}])}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:opacity-70 transition-opacity mt-1"
              >
                <Plus size={12} /> Ajouter une charge
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button onClick={() => setReturnModal(null)} className="admin-btn-secondary !py-2 !px-5 text-[9px]">Annuler</button>
            <button
              disabled={processingReturn}
              onClick={async () => {
                const accessToken = (session?.user as any)?.accessToken;
                if (!accessToken) { toast.error("Session expirée"); return; }
                setProcessingReturn(true);
                try {
                  const validCharges = returnCharges.filter(c => c.type && c.amount);
                  await Promise.all(validCharges.map(c =>
                    createExpense({
                      car_id: returnModal.car?.id || returnModal.car_id,
                      type: c.type,
                      amount: parseFloat(c.amount),
                      date: new Date().toISOString().split('T')[0],
                      note: c.note || undefined,
                    }, accessToken)
                  ));
                  const ok = await updateBookingStatus(returnModal.id, 'COMPLETED');
                  if (ok) {
                    toast.success(`Retour de ${returnModal.car?.brand} ${returnModal.car?.model} traité${validCharges.length > 0 ? ` + ${validCharges.length} charge(s) enregistrée(s)` : ''}`);
                    setReturnModal(null);
                    setReturnCharges([]);
                    refetch();
                  } else {
                    toast.error('Erreur lors du traitement du retour');
                  }
                } catch {
                  toast.error('Erreur réseau');
                } finally {
                  setProcessingReturn(false);
                }
              }}
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
