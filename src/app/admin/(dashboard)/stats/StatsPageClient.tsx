"use client";

import { useState, useEffect } from "react";
import AdminStatsClient from "./AdminStatsClient";
import { useStatsDashboard, StatsDashboard } from "@/hooks/useStatsDashboard";
import { Loader2, Calendar, Car as CarIcon, SlidersHorizontal, X, RefreshCw, BarChart3 } from "lucide-react";
import { getAllCars, Car as CarType } from "@/services/carService";

type Period = "all" | "month" | "quarter" | "year" | "custom";

// Adapter StatsDashboard to Stats interface
function adaptStatsToStatsInterface(data: StatsDashboard) {
  return {
    totalCars: data.totalCars,
    activeBookings: data.activeBookings,
    pendingBookings: data.pendingBookings,
    completedBookings: data.completedBookings,
    totalRevenue: data.totalRevenue,
    totalExpenses: data.totalExpenses,
    netGain: data.netGain,
    monthlyData: data.monthlyData,
    expenseTypeStats: data.expenseTypeStats,
    carsProfit: data.carsProfit,
    recentBookings: data.recentBookings,
    pendingReturns: data.pendingReturns,
    carAvailability: data.carAvailability,
  };
}

export default function AdminStatsPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [cars, setCars] = useState<CarType[]>([]);

  // Charger la liste des voitures
  useEffect(() => {
    getAllCars().then(setCars).catch(console.error);
  }, []);

  const { data, loading, error, refetch } = useStatsDashboard({
    period,
    from: from || undefined,
    to: to || undefined,
    car_id: selectedCarId || undefined,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[var(--color-primary)]" size={48} />
          <p className="admin-label">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="admin-label text-red-500 mb-4">Erreur: {error || "Données non disponibles"}</p>
          <button
            onClick={refetch}
            className="admin-btn-secondary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const adaptedStats = adaptStatsToStatsInterface(data);

  const hasFilters = selectedCarId || from || to || period !== "all";

  return (
    <div className="space-y-8 p-2 max-w-[1600px] mx-auto animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Tableau de Bord <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Analytique</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">Analyse de performance et rentabilité flotte</p>
          </div>
        </div>
        <button onClick={refetch} className="admin-btn-secondary !px-4">
          <RefreshCw size={16} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="admin-table-container">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="admin-section-title">Filtres <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">&amp; Période</span></h2>
              {hasFilters ? (
                <p className="admin-label text-[var(--color-accent)]">
                  {[selectedCarId && "Véhicule", period !== "all" && "Période", (from || to) && "Dates"].filter(Boolean).join(" · ")} actif(s)
                </p>
              ) : (
                <p className="admin-label">Affiner l&apos;analyse des statistiques</p>
              )}
            </div>
          </div>
          {hasFilters && (
            <button
              onClick={() => { setSelectedCarId(""); setFrom(""); setTo(""); setPeriod("all"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[9px] font-black uppercase tracking-widest"
            >
              <X size={11} /> Réinitialiser
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Véhicule */}
          <div className={`p-5 space-y-2 transition-colors ${selectedCarId ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <CarIcon size={13} className={selectedCarId ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${selectedCarId ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Véhicule</label>
              {selectedCarId && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <select
              value={selectedCarId}
              onChange={e => setSelectedCarId(e.target.value)}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${selectedCarId ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
            >
              <option value="">Tous les véhicules</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model}{c.formattedPlate ? ` — ${c.formattedPlate}` : ''}</option>)}
            </select>
          </div>

          {/* Période prédéfinie */}
          <div className={`p-5 space-y-2 transition-colors ${period !== 'all' && period !== 'custom' ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <BarChart3 size={13} className={period !== 'all' && period !== 'custom' ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${period !== 'all' && period !== 'custom' ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Période</label>
              {period !== 'all' && period !== 'custom' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { value: "all", label: "Tout" },
                { value: "month", label: "Ce mois" },
                { value: "quarter", label: "Trimestre" },
                { value: "year", label: "Année" },
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => { setPeriod(p.value as Period); setFrom(""); setTo(""); }}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    period === p.value
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates personnalisées */}
          <div className={`p-5 space-y-2 transition-colors ${(from || to) ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <Calendar size={13} className={(from || to) ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${(from || to) ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Période personnalisée</label>
              {(from || to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={from}
                onChange={e => { setFrom(e.target.value); setPeriod("custom"); }}
                className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${from ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
              />
              <span className="text-gray-300 text-xs">→</span>
              <input
                type="date"
                value={to}
                onChange={e => { setTo(e.target.value); setPeriod("custom"); }}
                className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${to ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Content */}
      <AdminStatsClient initialStats={adaptedStats} />
    </div>
  );
}
