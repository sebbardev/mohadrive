"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  User, 
  Car, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Plus,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
  Filter,
  Eye,
  Edit,
  Trash2,
  FilePlus,
  Check,
  X,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BookingPagination, updateBookingStatus } from "@/services/bookingService";
import BookingStatusActions from "@/components/admin/BookingStatusActions";
import AdminBookingForm from "@/components/admin/AdminBookingForm";

export default function AdminReservationsClient({ 
  initialBookings, 
  currentPage,
  currentSortBy = "created_at",
  currentSortOrder = "desc",
  openNewForm = false
}: { 
  initialBookings: BookingPagination;
  currentPage: number;
  currentSortBy?: string;
  currentSortOrder?: string;
  openNewForm?: boolean;
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingPagination>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(openNewForm);
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; firstName: string; lastName: string; car: { brand: string; model: string } } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [sortOrder, setSortOrder] = useState(currentSortOrder);

  // Synchroniser showForm avec openNewForm quand il change
  useEffect(() => {
    setShowForm(openNewForm);
  }, [openNewForm]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const actionLabel = newStatus === "CONFIRMED" ? "accepter" : "refuser";
    if (!confirm(`Êtes-vous sûr de vouloir ${actionLabel} cette réservation ?`)) return;

    setActionLoading(id);
    try {
      const success = await updateBookingStatus(id, newStatus);
      if (success) {
        toast.success(`Réservation ${newStatus === "CONFIRMED" ? "acceptée" : "refusée"} avec succès`);
        console.log(`[EMAIL] Envoi d'une notification à l'utilisateur pour la réservation ${id}`);
        await fetchBookings();
        if (newStatus === "CONFIRMED") {
          const booking = bookings.data.find(b => b.id === id);
          if (booking) setConfirmedBooking({ id: booking.id, firstName: booking.firstName, lastName: booking.lastName, car: booking.car });
        }
      } else {
        toast.error("Une erreur est survenue lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setActionLoading(null);
    }
  };

  const fetchBookings = async (page: number = currentPage, newSortBy?: string, newSortOrder?: string) => {
    const effectiveSortBy = newSortBy || sortBy;
    const effectiveSortOrder = newSortOrder || sortOrder;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "15",
        sort_by: effectiveSortBy,
        sort_order: effectiveSortOrder,
      });
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const response = await fetch(`${API_URL}/bookings?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      setBookings({
        data: result.data || [],
        current_page: result.current_page || page,
        last_page: result.last_page || 1,
        per_page: result.per_page || 15,
        total: result.total || 0,
        from: result.from || 0,
        to: result.to || 0,
        sort_by: effectiveSortBy,
        sort_order: effectiveSortOrder,
      });
      
      // Update URL with new page and sort parameters
      router.push(`/admin/reservations?page=${page}&sort_by=${effectiveSortBy}&sort_order=${effectiveSortOrder}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      try {
        // Appel au service de suppression ici si disponible
        console.log("Supprimer la réservation:", id);
        await fetchBookings();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="admin-pill admin-pill-success">
            Confirmé
          </span>
        );
      case "CANCELLED":
        return (
          <span className="admin-pill admin-pill-error">
            Annulé
          </span>
        );
      case "COMPLETED":
        return (
          <span className="admin-pill admin-pill-info">
            Terminé
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="admin-pill admin-pill-info">
            En cours
          </span>
        );
      default:
        return (
          <span className="admin-pill admin-pill-warning">
            En attente
          </span>
        );
    }
  };

  const filteredBookings = bookings.data.filter(booking => 
    `${booking.firstName} ${booking.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    fetchBookings(page);
  };

  const handleSortChange = (newSortBy: string) => {
    // If clicking the same field, toggle order. Otherwise, sort descending by default
    const newOrder = (sortBy === newSortBy && sortOrder === "desc") ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    fetchBookings(1, newSortBy, newOrder); // Reset to page 1 when sorting changes
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header avec Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="admin-header-title">
            Réservations <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Clients</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-1 w-16 bg-[var(--color-primary)] rounded-full" />
            <p className="admin-header-subtitle uppercase tracking-[0.3em]">{bookings.total} Demandes au total</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 hover:border-[var(--color-primary)]/30 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={14} className="text-gray-400" />
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
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchBookings(currentPage)}
              disabled={loading}
              className="admin-btn-secondary !px-4"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            
            <button 
              onClick={() => setShowForm(true)}
              className="admin-btn-primary"
            >
              <Plus size={18} strokeWidth={3} />
              Nouvelle Réservation
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des Réservations */}
      <div className="admin-table-container">
        <div className="overflow-x-auto admin-scroll-container">
          <table className="w-full text-left border-none">
            <thead>
              <tr>
                <th className="admin-table-th">Client</th>
                <th className="admin-table-th">Véhicule</th>
                <th className="admin-table-th">Dates & Lieu</th>
                <th className="admin-table-th">Prix Total</th>
                <th className="admin-table-th">Statut</th>
                <th className="admin-table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {bookings.data.map((booking) => (
                <tr key={booking.id} className="admin-table-row group">
                  <td className="admin-table-td">
                    <div className="flex flex-col">
                      <p className="admin-table-primary-text">{booking.firstName} {booking.lastName}</p>
                      <p className="admin-table-secondary-text">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="admin-table-td">
                    <div className="flex flex-col gap-2">
                      <p className="admin-table-primary-text">{booking.car.brand} {booking.car.model}</p>
                      <div className="relative h-12 w-20 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <Image
                          src={booking.car.image || "/placeholder-car.png"}
                          alt={booking.car.brand}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-td">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[13px] font-bold text-[#1A3B5D] whitespace-nowrap">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 admin-table-secondary-text whitespace-nowrap">
                        <MapPin size={14} />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="admin-table-td">
                    <div className="flex flex-col gap-0.5 whitespace-nowrap">
                      <span className="admin-table-price">
                        {(booking.totalPrice || 0).toLocaleString()} <span className="admin-table-unit">DH</span>
                      </span>
                      {booking.dailyPrice && (
                        <span className="admin-table-secondary-text">
                          {booking.dailyPrice} DH / jour
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="admin-table-td">
                    <div className="whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </div>
                  </td>
                  <td className="admin-table-td text-right">
                    <div className="admin-actions-container">
                      {booking.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                            disabled={actionLoading === booking.id}
                            className="admin-btn-icon !text-green-500 hover:!bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] hover:!text-white"
                            title="Accepter la réservation"
                          >
                            {actionLoading === booking.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                            disabled={actionLoading === booking.id}
                            className="admin-btn-icon !text-red-500 hover:!bg-red-500 hover:!text-white"
                            title="Refuser la réservation"
                          >
                            {actionLoading === booking.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                          </button>
                        </>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <button 
                          onClick={() => router.push(`/admin/contracts?prefill=${booking.id}`)}
                          className="admin-btn-icon !text-green-500 hover:!bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] hover:!text-white"
                          title="Générer Contrat"
                        >
                          <FilePlus size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {/* Action modifier */}} 
                        className="admin-btn-icon !text-[var(--color-secondary)] hover:!bg-[var(--color-secondary)] hover:!text-white" 
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(booking.id)} 
                        className="admin-btn-icon !text-red-500 hover:!bg-red-500 hover:!text-white" 
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-40 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-200 shadow-sm">
                      <Calendar size={48} className="opacity-20 text-gray-400" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Aucune réservation trouvée</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Always visible */}
        <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 font-bold">
            Affichage de <span className="text-[var(--color-primary)]">{bookings.from || 0}</span> à <span className="text-[var(--color-primary)]">{bookings.to || 0}</span> sur <span className="text-[var(--color-primary)]">{bookings.total}</span> réservations
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: bookings.last_page }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === bookings.last_page ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
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
                        page === currentPage
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === bookings.last_page}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Popup contrat après confirmation */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="admin-card max-w-md w-full !p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-8 border-b border-gray-100">
              <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="admin-section-title">Réservation <span className="text-[var(--color-primary)]">Confirmée</span></h3>
                <p className="admin-label">{confirmedBooking.firstName} {confirmedBooking.lastName} — {confirmedBooking.car.brand} {confirmedBooking.car.model}</p>
              </div>
            </div>
            {/* Body */}
            <div className="p-8 space-y-6">
              <p className="text-sm text-[var(--color-text-muted)] font-medium leading-relaxed">
                La réservation a été confirmée avec succès. Souhaitez-vous générer le contrat de location maintenant ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="admin-btn-secondary flex-1 justify-center"
                >
                  Plus tard
                </button>
                <button
                  onClick={() => {
                    setConfirmedBooking(null);
                    router.push(`/admin/contracts?prefill=${confirmedBooking.id}&new=true`);
                  }}
                  className="admin-btn-primary flex-1 justify-center"
                >
                  <FilePlus size={16} className="relative z-10" />
                  <span className="relative z-10">Générer le contrat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulaire */}
      {showForm && (
        <AdminBookingForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            fetchBookings();
          }} 
        />
      )}
    </div>
  );
}
