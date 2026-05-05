"use client";

import { motion } from "framer-motion";
import StatsCharts from "@/components/admin/StatsCharts";
import { ExpenseDashboard } from "@/services/expenseService";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  CreditCard, 
  Target, 
  AlertTriangle, 
  Clock,
  ArrowRight
} from "lucide-react";

interface ExpenseAnalyticsProps {
  dashboard: ExpenseDashboard;
}

export default function ExpenseAnalytics({ dashboard }: ExpenseAnalyticsProps) {
  const perCarLabels = dashboard.per_car.map(c => `${c.brand} ${c.model}`);
  
  // Datasets pour le graphique empilé
  const perCarRevenue = dashboard.per_car.map(c => c.total_revenue);
  const perCarMaintenance = dashboard.per_car.map(c => c.maintenance_amount || 0);
  const perCarCredit = dashboard.per_car.map(c => c.credit_amount || 0);

  return (
    <div className="space-y-10">
      {/* Stat Cards - KPIs Améliorés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const maxRev = Math.max(dashboard.summary.total_revenue, 1);
          return (
            <>
              <AnalyticsCard
                label="Revenus Totaux"
                value={dashboard.summary.total_revenue}
                icon={TrendingUp}
                iconColor="text-green-500"
                bar="bg-green-400"
                barPct={100}
                sub="Chiffre d'affaires"
                delay={0.1}
              />
              <AnalyticsCard
                label="Charges Totales"
                value={dashboard.summary.total_expenses}
                icon={TrendingDown}
                iconColor="text-red-400"
                bar="bg-red-400"
                barPct={Math.min(100, Math.round((dashboard.summary.total_expenses / maxRev) * 100))}
                sub="Dépenses enregistrées"
                delay={0.2}
              />
              <AnalyticsCard
                label="Encours Crédit"
                value={dashboard.summary.credit_total || 0}
                icon={CreditCard}
                iconColor="text-orange-400"
                bar="bg-orange-400"
                barPct={Math.min(100, Math.round(((dashboard.summary.credit_total || 0) / maxRev) * 100))}
                sub="Mensualités restantes"
                delay={0.3}
              />
              <AnalyticsCard
                label="Gain Net"
                value={dashboard.summary.total_net_gain}
                icon={DollarSign}
                iconColor={dashboard.summary.total_net_gain < 0 ? "text-red-400" : ""}
                bar={dashboard.summary.total_net_gain >= 0 ? "bg-white/60" : "bg-red-400"}
                barPct={Math.min(100, Math.abs(Math.round((dashboard.summary.total_net_gain / maxRev) * 100)))}
                sub="Bénéfice réel"
                highlight={dashboard.summary.total_net_gain >= 0}
                delay={0.5}
              />
            </>
          );
        })()}
      </div>

      {/* Charts Grid - Barres Empilées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="admin-card"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl border border-[var(--color-primary)]/20">
              <BarChart3 className="text-[var(--color-primary)]" size={20} />
            </div>
            <div>
              <h3 className="admin-section-title">Comparatif par véhicule</h3>
              <p className="admin-label">Répartition Revenus / Maintenance / Crédit (DH)</p>
            </div>
          </div>
          <div className="h-[350px]">
            <StatsCharts
              type="bar"
              labels={perCarLabels}
              stacked={true}
              showProfitLine={true}
              profitLineValue={3000} // Ligne de profit moyenne souhaitée
              datasets={[
                {
                  label: "Revenus",
                  data: perCarRevenue,
                  backgroundColor: "#679436", // Forest Green - accent
                  borderColor: "#679436",
                  stack: 'Stack 0',
                },
                {
                  label: "Entretien/Frais",
                  data: perCarMaintenance,
                  backgroundColor: "#f59e0b", // Orange for expenses/charges
                  borderColor: "#f59e0b",
                  stack: 'Stack 0',
                },
                {
                  label: "Mensualité Crédit",
                  data: perCarCredit,
                  backgroundColor: "#d97706", // Darker Orange for credit
                  borderColor: "#d97706",
                  stack: 'Stack 0',
                },
              ]}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="admin-card"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-400/10 rounded-2xl border border-purple-400/20">
              <PieChart className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="admin-section-title">Rentabilité Net</h3>
              <p className="admin-label">Gain net par véhicule (DH)</p>
            </div>
          </div>
          <div className="h-[350px]">
            <StatsCharts
              type="pie"
              labels={perCarLabels}
              datasets={[
                {
                  label: "Gain Net",
                  data: dashboard.per_car.map(c => Math.max(0, c.net_gain)),
                },
              ]}
            />
          </div>
        </motion.div>
      </div>

      {/* Nouvelles Sections : Échéancier et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Échéancier à venir */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="admin-card"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Clock className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="admin-section-title">Échéancier à venir</h3>
                <p className="admin-label">Prochaines sorties d&apos;argent</p>
              </div>
            </div>
            <button className="admin-btn-secondary !py-2 !px-4 text-[9px]">Voir tout</button>
          </div>
          
          <div className="space-y-4">
            {(dashboard.upcoming_expenses || []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune échéance à venir</p>
            ) : (dashboard.upcoming_expenses || []).map((exp, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[50px]">
                    <p className="text-[10px] font-black text-gray-500 uppercase">{new Date(exp.date).toLocaleDateString('fr-FR', { month: 'short' })}</p>
                    <p className="text-lg font-black text-[var(--color-primary)]">{new Date(exp.date).getDate()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-wider">{exp.label}</p>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      exp.type === 'Crédit' ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-blue-100 text-blue-600 border border-blue-200'
                    }`}>
                      {exp.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-red-500">-{exp.amount.toLocaleString()} DH</p>
                  <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alertes Rentabilité */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="admin-card"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="admin-section-title">Alertes Rentabilité</h3>
              <p className="admin-label">Véhicules sous-performants (30j)</p>
            </div>
          </div>

          <div className="space-y-4">
            {(dashboard.low_profit_cars || []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune alerte de rentabilité</p>
            ) : (dashboard.low_profit_cars || []).map((car, i) => (
              <div key={i} className="p-5 bg-red-50 border border-red-100 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-black text-[var(--color-text-main)] uppercase">{car.brand} {car.model}</p>
                  <span className={`text-xs font-black ${car.profit < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                    {car.profit.toLocaleString()} DH
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{car.reason}</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AnalyticsCard({ label, value, icon, iconColor, highlight, delay, isPercent, bar, barPct = 0, sub }: any) {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`admin-card group admin-card-hover !p-6 relative overflow-hidden ${highlight ? 'bg-[var(--color-primary)] !border-none' : 'bg-white border-gray-100 shadow-sm'}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ${highlight ? 'bg-white/5' : 'bg-white/5'}`} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        {Icon ? (
          <div className={highlight ? 'admin-icon-container-highlight' : 'admin-icon-container'}>
            <Icon size={20} className={`md:w-6 md:h-6 ${iconColor || ''}`} />
          </div>
        ) : (
          <div className="w-12 h-12" />
        )}
        {sub && (
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${highlight ? 'bg-white/20 text-white/70' : 'bg-gray-100 text-gray-400'}`}>{sub}</span>
        )}
      </div>
      <p className={`admin-label mb-1 relative z-10 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{label}</p>
      <div className="flex items-baseline gap-1 relative z-10">
        <h3 className={`text-2xl font-black tracking-tighter ${highlight ? 'text-white' : 'text-[var(--color-primary)]'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        {!isPercent && <span className={`text-[8px] font-black uppercase tracking-widest ${highlight ? 'text-white/60' : 'text-gray-500'}`}>DH</span>}
      </div>
      <div className={`mt-4 h-1.5 rounded-full relative z-10 ${highlight ? 'bg-white/20' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barPct}%` }}
          transition={{ delay: (delay || 0) + 0.3, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${bar || 'bg-[var(--color-highlight)]'}`}
        />
      </div>
    </motion.div>
  );
}
