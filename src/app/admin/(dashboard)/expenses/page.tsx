"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, getAllCars } from "@/services/carService";
import {
  Expense,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseDashboard,
  ExpenseDashboard,
} from "@/services/expenseService";
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Car as CarIcon,
  X,
  Loader2,
  AlertTriangle,
  History,
  Calendar,
  Tag,
  FileText,
  Keyboard,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  List,
  SlidersHorizontal,
  FileDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ExpenseAnalytics from "@/components/admin/expenses/ExpenseAnalytics";
import ExpenseForm from "@/components/admin/ExpenseForm";
import PDFExportDialog from "@/components/admin/PDFExportDialog";
import { exportExpensesToPDF } from "@/services/pdfExportService";

const EXPENSE_CATEGORIES = [
  { id: "PONCTUELLE", label: "Ponctuelle", types: ["vidange", "pneu", "amende", "lavage", "réparation"] },
  { id: "RECURRENTE", label: "Récurrente (Fixe)", types: ["assurance", "vignette", "visite technique"] },
  { id: "CREDIT", label: "Crédit / Financement", types: ["crédit"] },
];

const ALL_TYPES = EXPENSE_CATEGORIES.flatMap(c => c.types);

interface PaginationState {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

export default function ExpensesPage() {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;
  const searchParams = useSearchParams();
  const router = useRouter();
  const openNewForm = searchParams.get("new") === "true";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [dashboard, setDashboard] = useState<ExpenseDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormModal, setShowFormModal] = useState(openNewForm);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: parseInt(searchParams.get("page") || "1"),
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "created_at");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort_order") || "desc");

  // Filters
  const [filterCarId, setFilterCarId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expData, carsData, dashData] = await Promise.all([
        getExpenses({
          car_id: filterCarId,
          type: filterType,
          from: filterFrom,
          to: filterTo,
          page: pagination.current_page,
          per_page: 15,
          sort_by: sortBy,
          sort_order: sortOrder,
          search: searchQuery,
        }),
        getAllCars(),
        getExpenseDashboard({ 
          car_id: filterCarId,
          type: filterType,
          from: filterFrom,
          to: filterTo,
        }),
      ]);
      // Gérer la réponse paginée de l'API
      if (expData && expData.data && expData.pagination) {
        setExpenses(expData.data);
        setPagination({
          current_page: expData.pagination.current_page,
          last_page: expData.pagination.last_page,
          total: expData.pagination.total,
          from: expData.pagination.from || 0,
          to: expData.pagination.to || 0,
        });
      } else {
        // Fallback si l'API ne retourne pas de pagination
        setExpenses(Array.isArray(expData) ? expData : []);
        setPagination({
          current_page: 1,
          last_page: 1,
          total: Array.isArray(expData) ? expData.length : 0,
          from: 0,
          to: Array.isArray(expData) ? expData.length : 0,
        });
      }
      setCars(carsData);
      setDashboard(dashData);
    } catch (err) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [filterCarId, filterType, filterFrom, filterTo, pagination.current_page, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!accessToken) { toast.error("Session expirée, veuillez vous reconnecter"); return; }
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette charge ?")) return;
    const res = await deleteExpense(id, accessToken);
    if (res.success) {
      toast.success("Charge supprimée");
      loadData();
    } else {
      toast.error(res.error || "Erreur lors de la suppression");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setSelectedExpense(null);
    loadData();
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    router.push(`/admin/expenses?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}&search=${searchQuery}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const newOrder = (sortBy === newSortBy && sortOrder === "desc") ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    router.push(`/admin/expenses?page=1&sort_by=${newSortBy}&sort_order=${newOrder}&search=${searchQuery}`);
  };

  const openAddForm = () => {
    setSelectedExpense(null);
    setShowFormModal(true);
  };

  const openEditForm = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowFormModal(true);
  };



  const filteredExpenses = expenses;

  return (
    <div className="space-y-10 p-2 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Gestion des <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Charges</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">{pagination.total} Charges enregistrées</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par type, note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 hover:border-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
          
          {/* Sorting Controls */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => handleSortChange('created_at')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'created_at'
                  ? 'admin-btn-active'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-1">
                {sortOrder === 'desc' ? '↓' : '↑'} Plus récent
              </span>
            </button>
            <button
              onClick={() => handleSortChange('date')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'date'
                  ? 'admin-btn-active'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-1">
                {sortOrder === 'desc' ? '↓' : '↑'} Date
              </span>
            </button>
            <button
              onClick={() => handleSortChange('amount')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'amount'
                  ? 'admin-btn-active'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-1">
                {sortOrder === 'desc' ? '↓' : '↑'} Montant
              </span>
            </button>
          </div>
          
          <button
            onClick={() => setShowExportDialog(true)}
            className="admin-btn-secondary group"
          >
            <FileDown size={18} className="relative z-10" />
            <span className="relative z-10 text-xs">Exporter PDF</span>
          </button>
          <button
            onClick={openAddForm}
            className="admin-btn-primary group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10 text-xs">Enregistrer une charge</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-table-container">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="admin-section-title">Filtres <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">& Recherche</span></h2>
              {(filterCarId || filterType || filterFrom || filterTo) ? (
                <p className="admin-label text-[var(--color-accent)]">
                  {[filterCarId && "Véhicule", filterType && "Type", (filterFrom || filterTo) && "Période"].filter(Boolean).join(" · ")} actif(s)
                </p>
              ) : (
                <p className="admin-label">Affiner la liste des charges</p>
              )}
            </div>
          </div>
          {(filterCarId || filterType || filterFrom || filterTo) && (
            <button
              onClick={() => { setFilterCarId(""); setFilterType(""); setFilterFrom(""); setFilterTo(""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[9px] font-black uppercase tracking-widest"
            >
              <X size={11} /> Réinitialiser
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Véhicule */}
          <div className={`p-5 space-y-2 transition-colors ${filterCarId ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <CarIcon size={13} className={filterCarId ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${filterCarId ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Véhicule</label>
              {filterCarId && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <select
              value={filterCarId}
              onChange={e => { setFilterCarId(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${filterCarId ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
            >
              <option value="">Tous les véhicules</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model}{c.formattedPlate ? ` — ${c.formattedPlate}` : ''}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className={`p-5 space-y-2 transition-colors ${filterType ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <Tag size={13} className={filterType ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${filterType ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Type de charge</label>
              {filterType && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${filterType ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
            >
              <option value="">Tous les types</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <optgroup key={cat.id} label={cat.label}>
                  {cat.types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Date début */}
          <div className={`p-5 space-y-2 transition-colors ${filterFrom ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <Calendar size={13} className={filterFrom ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${filterFrom ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Date début</label>
              {filterFrom && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <input
              type="date"
              value={filterFrom}
              onChange={e => { setFilterFrom(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${filterFrom ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
            />
          </div>

          {/* Date fin */}
          <div className={`p-5 space-y-2 transition-colors ${filterTo ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/60'}`}>
            <div className="flex items-center gap-2">
              <Calendar size={13} className={filterTo ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <label className={`text-[9px] font-black uppercase tracking-widest ${filterTo ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>Date fin</label>
              {filterTo && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <input
              type="date"
              value={filterTo}
              onChange={e => { setFilterTo(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
              className={`w-full text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all outline-none bg-white ${filterTo ? 'border-[var(--color-primary)]/40 text-[var(--color-primary)]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {dashboard && (
        <div className="admin-table-container">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] text-white">
              <BarChart3 size={18} />
            </div>
            <h2 className="admin-section-title">Analyse <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Financière</span></h2>
          </div>
          <div className="p-6">
            <ExpenseAnalytics dashboard={dashboard} />
          </div>
        </div>
      )}

      {/* Tableau des Charges */}
      <div className="admin-table-container">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <List size={18} />
            </div>
            <div>
              <h2 className="admin-section-title">Liste des <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Charges</span></h2>
              <p className="admin-label">{pagination.total} charge(s) enregistrée(s)</p>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-x-auto p-2">
            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                <p className="admin-label">Chargement...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-20">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="admin-label">Aucune charge trouvée</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="admin-table-th">Véhicule</th>
                    <th className="admin-table-th">Type</th>
                    <th className="admin-table-th">Montant</th>
                    <th className="admin-table-th">Date</th>
                    <th className="admin-table-th">Note</th>
                    <th className="admin-table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="admin-table-row">
                      <td className="admin-table-td">
                        {expense.car?.brand} {expense.car?.model}
                      </td>
                      <td className="admin-table-td">
                        <span className={`admin-pill ${
                          expense.type === 'crédit' ? 'admin-pill-warning' :
                          expense.type === 'assurance' || expense.type === 'vignette' || expense.type === 'visite technique' ? 'admin-pill-info' :
                          expense.type === 'réparation' || expense.type === 'amende' ? 'admin-pill-error' :
                          'bg-gray-100 text-gray-600'
                        }`}>{expense.type}</span>
                      </td>
                      <td className="admin-table-td">
                        <span className="text-red-500 font-bold">-{expense.amount.toLocaleString()} DH</span>
                      </td>
                      <td className="admin-table-td">
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="admin-table-td">
                        {expense.note ? (
                          <span title={expense.note} className="inline-block max-w-[120px] truncate text-gray-500 cursor-help" >{expense.note}</span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="admin-table-td text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(expense)}
                            className="admin-btn-icon !text-blue-500"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="admin-btn-icon !text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-6">
          <div className="text-sm text-gray-600 font-bold">
            Affichage de <span className="text-[var(--color-primary)]">{pagination.from || 0}</span> à <span className="text-[var(--color-primary)]">{pagination.to || 0}</span> sur <span className="text-[var(--color-primary)]">{pagination.total}</span> charges
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                    page === pagination.current_page
                      ? 'admin-btn-active shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {showFormModal && (
          <ExpenseForm
            initialData={selectedExpense}
            cars={cars}
            onClose={() => {
              setShowFormModal(false);
              setSelectedExpense(null);
            }}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* PDF Export Dialog */}
      <PDFExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={async (from, to) => {
          // Fetch all expenses for the selected period (without pagination)
          const allExpensesData = await getExpenses({
            from,
            to,
            per_page: 1000, // Get all expenses
          });
          const allExpenses = allExpensesData?.data || allExpensesData || [];
          
          // Get dashboard data for the period
          const periodDashboard = await getExpenseDashboard({
            from,
            to,
          });
          
          await exportExpensesToPDF(
            allExpenses,
            periodDashboard,
            { label: from && to ? `Du ${new Date(from).toLocaleDateString("fr-FR")} au ${new Date(to).toLocaleDateString("fr-FR")}` : "Tout l'historique", from, to }
          );
          toast.success("PDF exporté avec succès!");
        }}
        title="Exporter les charges"
        description="Sélectionnez la période des charges à exporter en PDF"
      />
    </div>
  );
}
