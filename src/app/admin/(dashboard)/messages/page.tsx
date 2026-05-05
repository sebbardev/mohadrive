"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Mail, 
  Search, 
  Eye, 
  Trash2, 
  Loader2, 
  Check, 
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail as MailIcon,
  Calendar,
  AlertCircle,
  Filter
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ContactMessage {
  id: number;
  customer_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  replied_at: string | null;
  admin_notes: string | null;
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

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: parseInt(searchParams.get("page") || "1"),
    last_page: 1,
    total: 0,
    from: 0,
    to: 0
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "created_at");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort_order") || "desc");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [pagination.current_page, filter, sortBy, sortOrder]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/contact-messages?page=${pagination.current_page}&per_page=15&sort_by=${sortBy}&sort_order=${sortOrder}`;
      
      if (search) {
        url += `&search=${search}`;
      }
      
      if (filter === "unread") {
        url += `&is_read=false`;
      } else if (filter === "read") {
        url += `&is_read=true`;
      }

      console.log('Fetching messages from:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expirée ou non autorisée. Veuillez vous reconnecter.");
        }
        
        throw new Error(errorData?.message || "Erreur lors du chargement");
      }
      
      const data = await response.json();
      console.log('Messages loaded:', data);
      
      setMessages(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0,
        from: data.from || 0,
        to: data.to || 0
      });
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error(error.message || "Erreur lors du chargement des messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    router.push(`/admin/messages?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const newOrder = (sortBy === newSortBy && sortOrder === "desc") ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    router.push(`/admin/messages?page=1&sort_by=${newSortBy}&sort_order=${newOrder}`);
  };

  const handleViewMessage = async (message: ContactMessage) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${message.id}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement");
      }
      
      const data = await response.json();
      setSelectedMessage(data);
      setAdminNotes(data.admin_notes || "");
      fetchMessages(); // Refresh to update read status
    } catch (error) {
      console.error("Error viewing message:", error);
      toast.error("Erreur lors du chargement du message");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/contact-messages/${selectedMessage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (response.ok) {
        toast.success("Notes enregistrées");
        const data = await response.json();
        setSelectedMessage(data);
      } else {
        throw new Error("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (id: number, isRead: boolean) => {
    // Mise à jour optimiste immédiate
    const previousMessages = [...messages];
    
    // Mettre à jour visuellement le statut immédiatement
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id 
          ? { ...msg, is_read: isRead }
          : msg
      )
    );

    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: isRead }),
      });

      if (response.ok) {
        toast.success(isRead ? "Message marqué comme lu" : "Message marqué comme non lu");
        // Pas besoin de recharger puisque la mise à jour optimiste a déjà été faite
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        // En cas d'erreur, restaurer l'état précédent
        setMessages(previousMessages);
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      // Restaurer l'état précédent en cas d'erreur
      setMessages(previousMessages);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    
    // Mise à jour optimiste immédiate
    const previousMessages = [...messages];
    const previousSelectedMessage = selectedMessage;
    
    // Supprimer visuellement le message immédiatement
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Message supprimé");
        // Pas besoin de recharger puisque la mise à jour optimiste a déjà été faite
      } else {
        // En cas d'erreur, restaurer l'état précédent
        setMessages(previousMessages);
        setSelectedMessage(previousSelectedMessage);
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      // Restaurer l'état précédent en cas d'erreur
      setMessages(previousMessages);
      setSelectedMessage(previousSelectedMessage);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleBulkAction = async (action: "mark_read" | "mark_unread" | "delete") => {
    if (selectedIds.length === 0) {
      toast.error("Sélectionnez des messages d'abord");
      return;
    }

    const confirmMsg = action === "delete" 
      ? `Êtes-vous sûr de vouloir supprimer ${selectedIds.length} message(s) ?`
      : `Marquer ${selectedIds.length} message(s) comme ${action === "mark_read" ? "lu" : "non lu"} ?`;

    if (!confirm(confirmMsg)) return;

    try {
      const response = await fetch("/api/admin/contact-messages/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      if (response.ok) {
        toast.success("Action effectuée avec succès");
        setSelectedIds([]);
        fetchMessages();
      } else {
        throw new Error("Erreur lors de l'action groupée");
      }
    } catch (error) {
      console.error("Error bulk action:", error);
      toast.error("Erreur lors de l'action groupée");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === messages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map(m => m.id));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchMessages();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Messages <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Clients</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">{pagination.total} messages</p>
          </div>
        </div>

        {/* Sorting Controls */}
        {!selectedMessage && (
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
              onClick={() => handleSortChange('name')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'name'
                  ? 'admin-btn-active'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-1">
                {sortOrder === 'desc' ? '↓' : '↑'} Expéditeur
              </span>
            </button>
          </div>
        )}
      </div>

      {selectedMessage ? (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="admin-card p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedMessage(null)} 
                  className="admin-btn-icon text-gray-500"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="admin-section-title text-2xl">
                  Détails du <span className="text-[var(--color-primary)]">Message</span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.is_read)}
                  className="admin-btn-secondary"
                >
                  {selectedMessage.is_read ? <Eye size={18} /> : <AlertCircle size={18} />}
                  {selectedMessage.is_read ? "Marquer non lu" : "Marquer lu"}
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="admin-btn-icon !text-red-500 hover:!bg-red-500 hover:!text-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="admin-label ml-2">Informations de l'expéditeur</label>
                  <div className="space-y-3 p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MailIcon size={16} className="text-gray-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-sm text-[var(--color-primary)] hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-gray-400" />
                        <a href={`tel:${selectedMessage.phone}`} className="text-sm text-[var(--color-primary)] hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="admin-label ml-2">Sujet</label>
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <p className="text-base font-bold text-gray-800">{selectedMessage.subject}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="admin-label ml-2">Message</label>
                  <div className="p-6 bg-blue-50 border-l-4 border-[var(--color-primary)] rounded-xl">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="admin-label ml-2">Notes administrateur</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Ajouter des notes internes..."
                    className="admin-input pl-6 py-4 min-h-[200px] normal-case"
                    rows={8}
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="admin-btn-primary w-full"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    Enregistrer les notes
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="admin-label ml-2">Répondre</label>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="admin-btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Ouvrir le client email
                  </a>
                </div>

                {selectedMessage.replied_at && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check size={16} />
                      <span className="text-sm font-bold">Répondu le {new Date(selectedMessage.replied_at).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="admin-card p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, sujet..."
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
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  filter === "all"
                    ? "admin-btn-active"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  filter === "unread"
                    ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <AlertCircle size={14} />
                Non lus
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  filter === "read"
                    ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Check size={14} />
                Lus
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="admin-card p-4 bg-blue-50 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-700">
                  {selectedIds.length} message(s) sélectionné(s)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("mark_read")}
                    className="px-4 py-2 admin-btn-active"
                  >
                    Marquer lus
                  </button>
                  <button
                    onClick={() => handleBulkAction("mark_unread")}
                    className="px-4 py-2 admin-btn-active"
                  >
                    Marquer non lus
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] transition-all"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages Table */}
          <div className="admin-table-container">
            {loading ? (
              <div className="p-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
                <p className="admin-label tracking-[0.3em]">Chargement des messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-32 text-center text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20 text-gray-500" />
                <p className="admin-label tracking-[0.3em]">Aucun message trouvé</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto admin-scroll-container">
                  <table className="w-full text-left border-none">
                    <thead>
                      <tr>
                        <th className="admin-table-th w-12">
                          <input
                            type="checkbox"
                            checked={selectedIds.length === messages.length && messages.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded"
                          />
                        </th>
                        <th className="admin-table-th">Statut</th>
                        <th className="admin-table-th">Expéditeur</th>
                        <th className="admin-table-th">Sujet</th>
                        <th className="admin-table-th">Date</th>
                        <th className="admin-table-th text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                      {messages.map((message) => (
                        <tr 
                          key={message.id} 
                          className={`admin-table-row group ${!message.is_read ? 'bg-blue-50/50' : ''}`}
                        >
                          <td className="admin-table-td">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(message.id)}
                              onChange={() => toggleSelect(message.id)}
                              className="w-4 h-4 rounded"
                            />
                          </td>
                          <td className="admin-table-td">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                message.is_read 
                                  ? 'bg-green-400 shadow-green-200 shadow-sm' 
                                  : 'bg-orange-400 animate-pulse'
                              }`} />
                              <span className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                message.is_read 
                                  ? 'text-green-600' 
                                  : 'text-orange-600'
                              }`}>
                                {message.is_read ? "Lu" : "Non lu"}
                              </span>
                            </div>
                          </td>
                          <td className="admin-table-td">
                            <div className="flex flex-col gap-1">
                              <span className="admin-table-primary-text font-bold">
                                {message.name}
                              </span>
                              <span className="admin-table-secondary-text text-xs">
                                {message.email}
                              </span>
                            </div>
                          </td>
                          <td className="admin-table-td">
                            <span className="admin-table-secondary-text font-bold">
                              {message.subject.length > 40 
                                ? message.subject.substring(0, 40) + "..." 
                                : message.subject}
                            </span>
                          </td>
                          <td className="admin-table-td">
                            <span className="admin-table-secondary-text font-bold uppercase tracking-[0.2em] text-xs">
                              {new Date(message.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </td>
                          <td className="admin-table-td text-right">
                            <div className="admin-actions-container">
                              <button 
                                onClick={() => handleViewMessage(message)}
                                className="admin-btn-icon"
                                title="Voir"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleMarkAsRead(message.id, !message.is_read)}
                                className={`admin-btn-icon transition-all duration-200 ${
                                  message.is_read 
                                    ? 'hover:bg-orange-50 hover:text-orange-600' 
                                    : 'hover:bg-green-50 hover:text-green-600'
                                }`}
                                title={message.is_read ? "Marquer non lu" : "Marquer lu"}
                              >
                                {message.is_read ? <X size={16} /> : <Check size={16} />}
                              </button>
                              <button 
                                onClick={() => handleDelete(message.id)}
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

                {/* Pagination - Always Visible */}
                <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 font-bold">
                    Affichage de <span className="text-[var(--color-primary)]">{pagination.from || 0}</span> à <span className="text-[var(--color-primary)]">{pagination.to || 0}</span> sur <span className="text-[var(--color-primary)]">{pagination.total}</span> messages
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
      )}
    </div>
  );
}
