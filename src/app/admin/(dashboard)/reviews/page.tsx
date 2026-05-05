"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  Star, 
  Check, 
  X, 
  Trash2, 
  Loader2, 
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  User,
  Mail as MailIcon
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Review {
  id: number;
  name: string;
  email: string;
  role: string | null;
  rating: number;
  content: string;
  is_approved: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

interface PaginationState {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: parseInt(searchParams.get('page') || '1'),
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc');
  
  useEffect(() => {
    fetchReviews();
  }, [pagination.current_page, filter, sortBy, sortOrder]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/reviews?page=${pagination.current_page}&per_page=15&sort_by=${sortBy}&sort_order=${sortOrder}`;
      
      if (search) {
        url += `&search=${search}`;
      }
      
      if (filter === 'approved') {
        url += `&is_approved=true`;
      } else if (filter === 'pending') {
        url += `&is_approved=false`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Erreur lors du chargement des avis');
      }
      
      const data = await response.json();
      
      setReviews(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0,
        from: data.from || 0,
        to: data.to || 0
      });
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error(error.message || 'Erreur lors du chargement des avis');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    router.push(`/admin/reviews?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const newOrder = (sortBy === newSortBy && sortOrder === 'desc') ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    router.push(`/admin/reviews?page=1&sort_by=${newSortBy}&sort_order=${newOrder}`);
  };

  const handleApproveReview = async (id: number) => {
    // Mise à jour optimiste immédiate pour un feedback visuel instantané
    const previousReviews = [...reviews];
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === id 
          ? { ...review, is_approved: true }
          : review
      )
    );

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: true })
      });
      
      if (response.ok) {
        toast.success('Avis approuvé avec succès');
        // Pas besoin de recharger puisque la mise à jour optimiste a déjà été faite
      } else {
        // En cas d'erreur, restaurer l'état précédent
        setReviews(previousReviews);
        throw new Error('Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      // Restaurer l'état précédent en cas d'erreur
      setReviews(previousReviews);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;
    
    // Mise à jour optimiste immédiate
    const previousReviews = [...reviews];
    
    // Supprimer visuellement l'avis immédiatement
    setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
    
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Avis supprimé avec succès');
        // Pas besoin de recharger puisque la mise à jour optimiste a déjà été faite
      } else {
        // En cas d'erreur, restaurer l'état précédent
        setReviews(previousReviews);
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      // Restaurer l'état précédent en cas d'erreur
      setReviews(previousReviews);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchReviews();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Avis <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Clients</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">{pagination.total} avis</p>
          </div>
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
            onClick={() => handleSortChange('rating')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'rating'
                ? 'admin-btn-active'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-1">
              {sortOrder === 'desc' ? '↓' : '↑'} Note
            </span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="admin-card p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, commentaire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-12"
            />
          </div>
          <button type="submit" className="admin-btn-primary">
            <Search size={18} />
            Rechercher
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
          <Filter size={16} className="text-gray-400" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === 'all'
                ? 'admin-btn-active'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              filter === 'approved'
                ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Check size={14} />
            Approuvés
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <X size={14} />
            En attente
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center text-gray-400 gap-6">
            <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
            <p className="admin-label tracking-[0.3em]">Chargement des avis...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-32 text-center text-gray-500">
            <Star size={48} className="mx-auto mb-4 opacity-20 text-gray-500" />
            <p className="admin-label tracking-[0.3em]">Aucun avis trouvé</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto admin-scroll-container">
              <table className="w-full text-left border-none">
                <thead>
                  <tr>
                    <th className="admin-table-th w-12">Statut</th>
                    <th className="admin-table-th">Client</th>
                    <th className="admin-table-th">Rôle</th>
                    <th className="admin-table-th">Note</th>
                    <th className="admin-table-th">Avis</th>
                    <th className="admin-table-th">Date</th>
                    <th className="admin-table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {reviews.map((review) => (
                    <tr 
                      key={review.id} 
                      className="admin-table-row group"
                    >
                      <td className="admin-table-td">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            review.is_approved 
                              ? 'bg-green-400 shadow-green-200 shadow-sm' 
                              : 'bg-orange-400 animate-pulse'
                          }`} />
                          <span className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            review.is_approved 
                              ? 'text-green-600' 
                              : 'text-orange-600'
                          }`}>
                            {review.is_approved ? 'Approuvé' : 'En attente'}
                          </span>
                        </div>
                      </td>
                      <td className="admin-table-td">
                        <div className="flex flex-col gap-1">
                          <span className="admin-table-primary-text font-bold">{review.name}</span>
                          <span className="admin-table-secondary-text text-xs">{review.email}</span>
                        </div>
                      </td>
                      <td className="admin-table-td">
                        <span className="admin-table-secondary-text font-bold">
                          {review.role || 'Client'}
                        </span>
                      </td>
                      <td className="admin-table-td">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                            />
                          ))}
                          <span className="ml-2 text-xs font-bold text-gray-600">{review.rating}/5</span>
                        </div>
                      </td>
                      <td className="admin-table-td max-w-xs">
                        <p className="admin-table-secondary-text text-xs line-clamp-2">
                          {review.content}
                        </p>
                      </td>
                      <td className="admin-table-td">
                        <span className="admin-table-secondary-text font-bold uppercase tracking-[0.2em] text-xs">
                          {new Date(review.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="admin-table-td text-right">
                        <div className="admin-actions-container">
                          <button 
                            onClick={() => handleApproveReview(review.id)}
                            className={`admin-btn-icon transition-all duration-200 ${
                              review.is_approved 
                                ? 'bg-green-100 text-green-600 cursor-not-allowed opacity-60' 
                                : 'hover:bg-green-50 hover:text-green-600'
                            }`}
                            title={review.is_approved ? 'Déjà approuvé' : 'Approuver'}
                            disabled={review.is_approved}
                          >
                            <Check size={16} className={review.is_approved ? 'animate-bounce-once' : ''} />
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
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

            {/* Pagination */}
            <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 font-bold">
                Affichage de <span className="text-[var(--color-primary)]">{pagination.from || 0}</span> à <span className="text-[var(--color-primary)]">{pagination.to || 0}</span> sur <span className="text-[var(--color-primary)]">{pagination.total}</span> avis
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
          </>
        )}
      </div>
    </div>
  );
}