"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Car
} from "lucide-react";
import StatsCharts from "@/components/admin/StatsCharts";
import { Stats, CarProfitDetail } from "@/services/statsService";

export default function AdminStatsClient({ initialStats }: { initialStats: Stats }) {
  const [selectedCar, setSelectedCar] = useState<CarProfitDetail | null>(null);

  // Trier par date décroissante pour afficher les plus récents en premier
  const sortedRevenues = selectedCar 
    ? [...selectedCar.revenue_details].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  const sortedExpenses = selectedCar 
    ? [...selectedCar.expense_details].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const limitedRevenues = sortedRevenues.slice(0, 3);
  const limitedExpenses = sortedExpenses.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const maxRev = Math.max(initialStats.totalRevenue, 1);
          return (
            <>
              <StatCard
                label="Chiffre d'Affaires"
                value={`${initialStats.totalRevenue.toLocaleString()} DH`}
                icon={TrendingUp}
                iconColor="text-green-500"
                bar="bg-green-400"
                barPct={100}
                trend="Revenu brut total"
                delay={0}
                suppressHydrationWarning
              />
              <StatCard
                label="Charges Totales"
                value={`${initialStats.totalExpenses.toLocaleString()} DH`}
                icon={TrendingDown}
                iconColor="text-red-400"
                bar="bg-red-400"
                barPct={Math.min(100, Math.round((initialStats.totalExpenses / maxRev) * 100))}
                trend="Dépenses enregistrées"
                delay={0.08}
                suppressHydrationWarning
              />
              <StatCard
                label="Bénéfice Net"
                value={`${initialStats.netGain.toLocaleString()} DH`}
                icon={DollarSign}
                bar={initialStats.netGain >= 0 ? "bg-white/60" : "bg-red-400"}
                barPct={Math.min(100, Math.abs(Math.round((initialStats.netGain / maxRev) * 100)))}
                trend="Profit réel généré"
                highlight
                delay={0.16}
                suppressHydrationWarning
              />
              <StatCard
                label="Taux d'Occupation"
                value={`${Math.round((initialStats.activeBookings / (initialStats.totalCars || 1)) * 100)}%`}
                icon={CheckCircle2}
                iconColor="text-blue-400"
                bar="bg-blue-400"
                barPct={Math.min(100, Math.round((initialStats.activeBookings / (initialStats.totalCars || 1)) * 100))}
                trend={`${initialStats.activeBookings} voitures louées`}
                delay={0.24}
              />
            </>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue vs Expenses Chart */}
        <div className="admin-table-container">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="admin-section-title">Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Mensuelle</span></h3>
              <p className="admin-label">Revenus vs Charges vs Profit</p>
            </div>
          </div>
          <div className="p-6">
           <StatsCharts 
            type="bar" 
            labels={initialStats.monthlyData.map((d: any) => d.name)} 
            datasets={[
              {
                label: "Revenus",
                data: initialStats.monthlyData.map((d: any) => d.revenue),
                backgroundColor: "rgba(6, 102, 140, 0.2)",
                borderColor: "#06668C",
                borderWidth: 2,
              },
              {
                label: "Charges",
                data: initialStats.monthlyData.map((d: any) => d.expenses),
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderColor: "#ef4444",
                borderWidth: 2,
              },
              {
                label: "Profit",
                data: initialStats.monthlyData.map((d: any) => d.profit),
                backgroundColor: "rgba(164, 189, 1, 0.35)",
                borderColor: "#A4BD01",
                borderWidth: 2,
              }
            ]} 
           />
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="admin-table-container">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] text-white">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="admin-section-title">Répartition des <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Charges</span></h3>
              <p className="admin-label">Par catégorie de dépense</p>
            </div>
          </div>
          <div className="p-6">
           {(() => {
             // Filter to show only specific expense types
             const allowedTypes = ['carburant', 'entretien', 'lavage', 'assurance', 'vignette', 'réparation', 'reparation'];
             const filteredExpenses = initialStats.expenseTypeStats.filter((d: any) => 
               allowedTypes.includes(d.type.toLowerCase())
             );
             
             // Define colors for each expense type
             const colorMap: { [key: string]: string } = {
               'carburant': '#f59e0b',      // Orange
               'entretien': '#3b82f6',      // Blue
               'lavage': '#06b6d4',         // Cyan
               'assurance': '#8b5cf6',      // Purple
               'vignette': '#ef4444',       // Red
               'réparation': '#10b981',     // Green
               'reparation': '#10b981',     // Green (without accent)
             };
             
             const backgroundColors = filteredExpenses.map((d: any) => 
               colorMap[d.type.toLowerCase()] || '#6b7280' // Default gray
             );
             
             return (
               <StatsCharts 
                type="pie" 
                labels={filteredExpenses.map((d: any) => d.type.toUpperCase())} 
                datasets={[{
                  label: "Montant (DH)",
                  data: filteredExpenses.map((d: any) => d.amount),
                  backgroundColor: backgroundColors,
                }]} 
               />
             );
           })()}
          </div>
        </div>
      </div>

      {/* Recent Activity - Full Width Row */}
      <div className="admin-table-container">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="admin-section-title">Réservations <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Récentes</span></h3>
              <p className="admin-label">{initialStats.recentBookings.length} dernières réservations</p>
            </div>
          </div>
          <Link href="/admin/reservations" className="admin-btn-secondary !py-2 !px-4 text-[9px]">
            Voir tout
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {initialStats.recentBookings.slice(0, 4).map((booking: any) => (
            <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all group">
              <div className="w-16 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex-shrink-0 group-hover:shadow-md transition-all">
                {booking.car?.image ? (
                  <img src={booking.car.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 text-[var(--color-primary)] font-black text-xs">
                    {booking.car?.brand?.[0] || 'V'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-wide truncate">{booking.car?.brand} {booking.car?.model}</p>
                <p className="admin-label text-[9px] mt-0.5 truncate">{booking.first_name} {booking.last_name} — {new Date(booking.start_date).toLocaleDateString("fr-FR")} → {new Date(booking.end_date).toLocaleDateString("fr-FR")}</p>
              </div>
              <span className="text-sm font-black text-[var(--color-primary)] flex-shrink-0">+{booking.total_price.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">DH</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Car Profitability Ranking - Full Width Row */}
      <div className="admin-table-container">
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] text-white">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="admin-section-title">Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Rentabilité</span></h3>
            <p className="admin-label">Classement par gain net</p>
          </div>
        </div>
         <div className="overflow-x-auto admin-scroll-container">
           <table className="w-full text-left border-none">
             <thead>
               <tr>
                 <th className="admin-table-th">#</th>
                 <th className="admin-table-th">Véhicule</th>
                 <th className="admin-table-th text-right">Gain Net</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50/50">
               {initialStats.carsProfit.slice(0, 3).map((car: CarProfitDetail, index: number) => (
                 <tr key={`${car.brand}-${car.model}`} className="admin-table-row group cursor-pointer" onClick={() => setSelectedCar(car)}>
                   <td className="admin-table-td">
                     <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${
                       index === 0 ? 'admin-btn-active' :
                       index === 1 ? 'bg-[var(--color-secondary)] text-white' :
                       index === 2 ? 'bg-[var(--color-accent)] text-white' :
                       'bg-gray-100 text-gray-600'
                     }`}>
                       {index + 1}
                     </span>
                   </td>
                   <td className="admin-table-td">
                     <div className="flex items-center gap-3">
                       <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                         {car.image ? (
                           <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] font-black text-[9px] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                             {car.brand?.[0] || 'V'}
                           </div>
                         )}
                       </div>
                       <p className="admin-table-primary-text uppercase tracking-wider text-xs">{car.brand} {car.model}</p>
                     </div>
                   </td>
                   <td className="admin-table-td text-right">
                     <p className={`text-sm font-black ${car.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {car.profit.toLocaleString()} <span className="text-[10px] not-italic text-gray-600">DH</span>
                     </p>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      {/* Modal Détails Rentabilité */}
      {selectedCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedCar(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] border border-gray-200 shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                  Détails Rentabilité • {selectedCar.brand} {selectedCar.model}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight size={14} className="text-green-400" />
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                      Revenus: {selectedCar.total_revenue.toLocaleString()} DH
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowDownRight size={14} className="text-red-400" />
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                      Charges: {selectedCar.total_expenses.toLocaleString()} DH
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full">
                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                      Gain Net: {selectedCar.profit.toLocaleString()} DH
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCar(null)}
                className="p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 admin-scroll-container grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne Revenus */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-green-400" />
                  <h4 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Historique des Revenus</h4>
                </div>
                <div className="space-y-2">
                  {limitedRevenues.length === 0 ? (
                    <p className="text-xs text-gray-500">Aucun revenu enregistré.</p>
                  ) : (
                    limitedRevenues.map((rev) => (
                      <div key={rev.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-[var(--color-text-main)] uppercase">{rev.customer}</p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">{new Date(rev.date).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <p className="text-xs font-black text-green-400">+{rev.amount.toLocaleString()} DH</p>
                      </div>
                    ))
                  )}
                </div>
                {sortedRevenues.length > 3 && (
                  <Link 
                    href={`/admin/stats/cars/${selectedCar.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl hover:bg-[var(--color-primary)]/10 transition-all"
                  >
                    Voir l'historique complet
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>

              {/* Colonne Charges */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={18} className="text-red-400" />
                  <h4 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Historique des Charges</h4>
                </div>
                <div className="space-y-2">
                  {limitedExpenses.length === 0 ? (
                    <p className="text-xs text-gray-500">Aucune charge enregistrée.</p>
                  ) : (
                    limitedExpenses.map((exp) => (
                      <div key={exp.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-[var(--color-text-main)] uppercase">{exp.type}</p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">{new Date(exp.date).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <p className="text-xs font-black text-red-400">-{exp.amount.toLocaleString()} DH</p>
                      </div>
                    ))
                  )}
                </div>
                {sortedExpenses.length > 3 && (
                  <Link 
                    href={`/admin/stats/cars/${selectedCar.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-400/5 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-all"
                  >
                    Voir tout le détail
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconColor,
  trend,
  bar,
  barPct = 0,
  highlight,
  delay = 0,
  suppressHydrationWarning,
}: {
  label: string;
  value: string;
  icon: any;
  iconColor?: string;
  trend: string;
  bar?: string;
  barPct?: number;
  highlight?: boolean;
  delay?: number;
  suppressHydrationWarning?: boolean;
}) {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`admin-card group admin-card-hover !p-6 relative overflow-hidden ${highlight ? 'bg-[var(--color-primary)] !border-none' : 'bg-white border-gray-100'}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ${highlight ? 'bg-white/5' : 'bg-white/5'}`} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={highlight ? 'admin-icon-container-highlight' : 'admin-icon-container'}>
          <Icon size={20} className={`md:w-6 md:h-6 ${iconColor || ''}`} />
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${highlight ? 'bg-white/20 text-white/70' : 'bg-gray-100 text-gray-400'}`}>{trend}</span>
      </div>
      <p className={`admin-label mb-1 relative z-10 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{label}</p>
      <h3 className={`text-2xl font-black tracking-tighter relative z-10 ${highlight ? 'text-white' : 'text-[var(--color-primary)]'}`} suppressHydrationWarning={suppressHydrationWarning}>
        {value}
      </h3>
      <div className={`mt-4 h-1.5 rounded-full relative z-10 ${highlight ? 'bg-white/20' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barPct}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${bar || 'bg-[var(--color-highlight)]'}`}
        />
      </div>
    </motion.div>
  );
}
