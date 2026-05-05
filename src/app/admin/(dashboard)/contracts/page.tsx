"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ContractForm from "@/components/admin/ContractForm";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useSearchParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Printer, 
  Edit2, 
  Trash2, 
  Loader2,
  Calendar,
  User,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Contract {
  id: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_email: string;
  driver_phone: string;
  driver_license_number?: string;
  driver_cin_number?: string;
  pickup_location: string;
  car: {
    id: string;
    brand: string;
    model: string;
    image: string;
    plateNumber: string;
    pricePerDay: number;
  };
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  pdf_path: string;
  version: number;
  created_at: string;
}

interface PaginationState {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

export default function ContractsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefillBookingId = searchParams.get("prefill");
  const openNewForm = searchParams.get("new") === "true";

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(!!prefillBookingId || openNewForm);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: parseInt(searchParams.get("page") || "1"),
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "created_at");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort_order") || "desc");

  useEffect(() => {
    if (prefillBookingId) {
      setShowForm(true);
    }
  }, [prefillBookingId]);

  useEffect(() => {
    fetchContracts();
  }, [pagination.current_page, sortBy, sortOrder]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: "15",
        sort_by: sortBy,
        sort_order: sortOrder,
        search: search,
      });
      
      const response = await fetch(`/api/admin/contracts?${params.toString()}`);
      const data = await response.json();
      setContracts(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from || 0,
        to: data.to || 0,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des contrats");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    router.push(`/admin/contracts?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const newOrder = (sortBy === newSortBy && sortOrder === "desc") ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    router.push(`/admin/contracts?page=1&sort_by=${newSortBy}&sort_order=${newOrder}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) return;
    
    try {
      const response = await fetch(`/api/admin/contracts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Contrat supprimé");
        fetchContracts();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => 
    `${contract.driver_first_name} ${contract.driver_last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    contract.driver_email.toLowerCase().includes(search.toLowerCase()) ||
    contract.driver_phone.includes(search) ||
    `${contract.car.brand} ${contract.car.model}`.toLowerCase().includes(search.toLowerCase()) ||
    contract.car.plateNumber.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPdf = async (id: string) => {
    window.open(`/api/admin/contracts/${id}/download`, "_blank");
  };

  const printContract = async (id: string) => {
    window.open(`/api/admin/contracts/${id}/download`, "_blank");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Contrats <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Location</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">{pagination.total} Documents officiels</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, véhicule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 hover:border-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* Sorting Controls */}
          {!showForm && (
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
                onClick={() => handleSortChange('start_date')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'start_date'
                    ? 'admin-btn-active'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  {sortOrder === 'desc' ? '↓' : '↑'} Période
                </span>
              </button>
              <button
                onClick={() => handleSortChange('total_price')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'total_price'
                    ? 'admin-btn-active'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  {sortOrder === 'desc' ? '↓' : '↑'} Montant
                </span>
              </button>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="admin-btn-primary group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Plus size={22} className="relative z-10" />
              <span className="relative z-10">Nouveau Contrat</span>
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <ContractFormModal
          initialData={editingContract}
          prefillBookingId={prefillBookingId}
          onSuccess={() => {
            setShowForm(false);
            setEditingContract(null);
            router.replace("/admin/contracts");
            fetchContracts();
          }}
          onClose={() => {
            setShowForm(false);
            setEditingContract(null);
            router.replace("/admin/contracts");
          }}
        />
      )}

      {!showForm && (
        <div className="space-y-6">
          {/* Contracts Grid/Table */}
          <div className="admin-table-container">
            {loading ? (
              <div className="p-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
                <p className="admin-label tracking-[0.3em]">Synchronisation des contrats...</p>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="p-32 text-center text-gray-500">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-200 shadow-sm">
                  <FileText size={40} className="opacity-20" />
                </div>
                <p className="admin-label tracking-[0.3em]">Aucune archive disponible</p>
              </div>
            ) : (
              <div className="overflow-x-auto admin-scroll-container">
                <table className="w-full text-left border-none">
                  <thead>
                    <tr>
                      <th className="admin-table-th">Conducteur / ID</th>
                      <th className="admin-table-th">Véhicule</th>
                      <th className="admin-table-th">Période</th>
                      <th className="admin-table-th">Montant</th>
                      <th className="admin-table-th">Statut</th>
                      <th className="admin-table-th text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="admin-table-row group">
                        <td className="admin-table-td">
                          <div className="flex flex-col">
                            <p className="admin-table-primary-text">{contract.driver_first_name} {contract.driver_last_name}</p>
                            <p className="admin-table-secondary-text">{contract.driver_phone}</p>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <div className="flex flex-col gap-2">
                            <p className="admin-table-primary-text">{contract.car.brand} {contract.car.model}</p>
                            <div className="relative h-12 w-20 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                              <Image 
                                src={contract.car.image} 
                                alt={contract.car.brand}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[13px] font-bold text-[#1A3B5D] whitespace-nowrap">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{format(new Date(contract.start_date), "d/M/yyyy")} - {format(new Date(contract.end_date), "d/M/yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 admin-table-secondary-text whitespace-nowrap">
                              <Search size={14} />
                              <span>{contract.pickup_location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <div className="flex flex-col gap-0.5 whitespace-nowrap">
                            <span className="admin-table-price">
                              {contract.total_price.toLocaleString()} <span className="admin-table-unit">DH</span>
                            </span>
                            <span className="admin-table-secondary-text">
                              {contract.car.pricePerDay} DH / jour
                            </span>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <div className="whitespace-nowrap">
                            {contract.status === 'COMPLETED' ? (
                              <span className="admin-pill admin-pill-success">
                                Clôturé
                              </span>
                            ) : contract.status === 'CANCELLED' ? (
                              <span className="admin-pill admin-pill-error">
                                Annulé
                              </span>
                            ) : (
                              <span className="admin-pill admin-pill-info">
                                En cours
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="admin-table-td text-right">
                          <div className="admin-actions-container">
                            <button 
                              onClick={() => downloadPdf(contract.id)}
                              className="admin-btn-icon !text-green-500 hover:!bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] hover:!text-white"
                              title="Télécharger PDF"
                            >
                              <Download size={16} />
                            </button>
                            <button 
                              onClick={() => printContract(contract.id)}
                              className="admin-btn-icon !text-blue-500 hover:!bg-blue-500 hover:!text-white"
                              title="Imprimer"
                            >
                              <Printer size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingContract(contract)}
                              className="admin-btn-icon !text-[var(--color-secondary)] hover:!bg-[var(--color-secondary)] hover:!text-white"
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(contract.id)}
                              className="admin-btn-icon !text-red-500 hover:!bg-red-500 hover:!text-white"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Custom Pagination - Always Visible */}
          <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 font-bold">
              Affichage de <span className="text-[var(--color-primary)]">{pagination.from || 0}</span> à <span className="text-[var(--color-primary)]">{pagination.to || 0}</span> sur <span className="text-[var(--color-primary)]">{pagination.total}</span> contrats
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:hover:border-gray-200 disabled:hover:text-gray-400"
              >
                <ChevronLeft size={16} />
                Précédent
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === pagination.last_page ||
                      (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                    );
                  })
                  .reduce<(number | string)[]>((acc, page, idx, arr) => {
                    // Add ellipsis between non-consecutive pages
                    if (idx > 0 && page !== arr[idx - 1] + 1) {
                      acc.push('...');
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) => {
                    if (item === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400 font-bold">
                          ...
                        </span>
                      );
                    }
                    const page = item as number;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                          page === pagination.current_page
                            ? 'admin-btn-active shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>

              {/* Next Button */}
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
      )}
    </div>
  );
}

function ContractFormModal({ initialData, prefillBookingId, onSuccess, onClose }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
        
        <div className="sticky top-0 z-20 bg-white rounded-t-[2.5rem] p-8 sm:p-10 lg:p-12 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                {initialData ? "Édition" : "Nouveau"} <span className="text-[var(--color-secondary)]">Contrat</span>
              </h3>
              <p className="text-[var(--color-text-muted)] font-light">
                Remplissez les informations pour créer le contrat
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all ml-4 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">

        <ContractForm 
          initialData={initialData}
          prefillFromBookingId={prefillBookingId}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return modalContent;

  return createPortal(modalContent, modalRoot);
}