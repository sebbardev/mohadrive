"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bell, BellOff, Check, Trash2, Calendar, MessageSquare, AlertCircle, CheckCircle2, Clock, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: "BOOKING" | "CONTACT_MESSAGE" | "SYSTEM";
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  link?: string;
}

interface PaginationState {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let url = `/api/notifications?page=${pagination.current_page}&per_page=15&sort_by=${sortBy}&sort_order=${sortOrder}`;
      
      if (filter !== "ALL") {
        url += `&filter=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken || ''}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setPagination({
          current_page: data.current_page || 1,
          last_page: data.last_page || 1,
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [pagination.current_page, sortBy, sortOrder, filter]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    router.push(`/admin/notifications?page=${page}&sort_by=${sortBy}&sort_order=${sortOrder}&filter=${filter}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const newOrder = (sortBy === newSortBy && sortOrder === "desc") ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    router.push(`/admin/notifications?page=1&sort_by=${newSortBy}&sort_order=${newOrder}&filter=${filter}`);
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken || ''}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken || ''}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken || ''}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.is_read;
    if (filter === "READ") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Calendar className="text-blue-500" size={20} />;
      case "CONTACT_MESSAGE":
        return <MessageSquare className="text-green-500" size={20} />;
      case "SYSTEM":
        return <AlertCircle className="text-orange-500" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case "BOOKING": 
        return "bg-blue-50 border-blue-100";
      case "CONTACT_MESSAGE": 
        return "bg-green-50 border-green-100";
      case "SYSTEM": 
        return "bg-orange-50 border-orange-100";
      case "REVIEW": 
        return "bg-yellow-50 border-yellow-100";
      default: 
        return "bg-gray-50 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <RefreshCw className="animate-spin text-[var(--color-primary)]" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Chargement des notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">Centre de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Notifications</span></h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
            <p className="admin-header-subtitle">{pagination.total} Notifications</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              onClick={() => handleSortChange('type')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'type'
                  ? 'admin-btn-active'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-1">
                {sortOrder === 'desc' ? '↓' : '↑'} Type
              </span>
            </button>
          </div>
          
          <button
            onClick={fetchNotifications}
            className="admin-btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="admin-btn-primary flex items-center gap-2"
            >
              <Check size={16} />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-card !p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "ALL"
                ? "admin-btn-active shadow-lg shadow-[var(--color-primary)]/20"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              filter === "UNREAD"
                ? "bg-[var(--color-highlight)] text-white shadow-lg shadow-[var(--color-highlight)]/20"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Non lues
            {unreadCount > 0 && (
              <span className="bg-white text-[var(--color-highlight)] px-2 py-0.5 rounded-full text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("READ")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "READ"
                ? "bg-gray-600 text-white shadow-lg shadow-gray-600/20"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Lues
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="admin-card !p-0 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100/80">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`group relative p-4 sm:p-6 transition-all duration-300 hover:shadow-sm cursor-pointer animate-fade-in ${
                  notification.is_read
                    ? "bg-white hover:bg-gray-50/30"
                    : `${getTypeBg(notification.type)} border-l-4 border-l-[var(--color-primary)] hover:bg-opacity-70`
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedNotification(notification)}
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Enhanced icon container */}
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${getTypeBg(notification.type)} group-hover:scale-110 transition-transform duration-300`}>
                    {getTypeIcon(notification.type)}
                    {!notification.is_read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-highlight)] rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className={`text-xs sm:text-sm font-black uppercase tracking-tight transition-colors ${
                          notification.is_read 
                            ? "text-gray-500 group-hover:text-gray-600" 
                            : "text-[var(--color-primary)] group-hover:text-[var(--color-secondary)]"
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
                          {notification.message}
                        </p>
                      </div>
                      
                      {/* Enhanced timestamp and status */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold flex items-center gap-1 whitespace-nowrap">
                          <Clock size={10} className="sm:w-3 sm:h-3" />
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                        {!notification.is_read && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-highlight)]/10 text-[var(--color-highlight)] text-[8px] font-black uppercase rounded-full border border-[var(--color-highlight)]/20">
                            <span className="w-1.5 h-1.5 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced action buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[var(--color-primary)]/20 transition-all duration-200 hover:scale-105"
                        >
                          <Check size={10} className="sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Marquer lu</span>
                          <span className="sm:hidden">Lu</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-red-50 text-red-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-105"
                      >
                        <Trash2 size={10} className="sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Supprimer</span>
                        <span className="sm:hidden">×</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <BellOff size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">
              Aucune notification
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {filter === "UNREAD"
                ? "Toutes les notifications ont été lues"
                : "Vous n'avez pas encore de notifications"}
            </p>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getTypeBg(selectedNotification.type)}`}>
                {getTypeIcon(selectedNotification.type)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                  {selectedNotification.title}
                </h2>
                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">
                  {format(new Date(selectedNotification.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedNotification.message}
              </p>
            </div>

            {selectedNotification.data && (
              <div className="mb-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                  Données associées
                </h3>
                <pre className="bg-gray-50 rounded-xl p-4 text-xs overflow-auto border border-gray-100">
                  {JSON.stringify(selectedNotification.data, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex items-center gap-3">
              {selectedNotification.link && (
                <a
                  href={selectedNotification.link}
                  className="admin-btn-primary flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Accéder
                </a>
              )}
              {!selectedNotification.is_read && (
                <button
                  onClick={() => {
                    markAsRead(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="admin-btn-secondary flex items-center gap-2"
                >
                  <Check size={16} />
                  Marquer comme lu
                </button>
              )}
              <button
                onClick={() => setSelectedNotification(null)}
                className="admin-btn-icon ml-auto"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Pagination - Always Visible */}
      <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 font-bold">
          Affichage de <span className="text-[var(--color-primary)]">{pagination.from || 0}</span> à <span className="text-[var(--color-primary)]">{pagination.to || 0}</span> sur <span className="text-[var(--color-primary)]">{pagination.total}</span> notifications
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
  );
}
