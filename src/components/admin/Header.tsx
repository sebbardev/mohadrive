import { useState, useEffect, useRef } from "react";
import { Bell, Search, User, Menu, X, Calendar, AlertCircle, CheckCircle2, ChevronRight, Star, CreditCard, TrendingUp, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

interface HeaderProps {
  session: any;
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  type: "BOOKING" | "CONTRACT" | "EXPENSE" | "SYSTEM" | "REVIEW" | "RETURN";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function Header({ session, onMenuClick }: HeaderProps) {
  const { data: sessionData } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [returnNotifs, setReturnNotifs] = useState<Notification[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Get auth token from session
  const getToken = () => {
    return (sessionData?.user as any)?.accessToken || (session?.user as any)?.accessToken;
  };

  // Fetch pending returns
  const fetchPendingReturns = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings?per_page=50&sort_by=created_at&sort_order=desc`);
      const data = await res.json();
      const all: any[] = data.data || [];
      const today = new Date(); today.setHours(0,0,0,0);
      const in3days = new Date(today); in3days.setDate(today.getDate() + 3);
      const returns = all.filter((b: any) => {
        if (b.status !== 'CONFIRMED' && b.status !== 'IN_PROGRESS') return false;
        const end = new Date(b.end_date || b.endDate);
        return end <= in3days;
      });
      setReturnNotifs(returns.map((b: any) => {
        const end = new Date(b.end_date || b.endDate);
        const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isOverdue = diff < 0;
        return {
          id: `return-${b.id}`,
          type: 'RETURN' as const,
          title: `Retour ${isOverdue ? 'en retard' : diff === 0 ? "aujourd'hui" : `dans ${diff}j`}`,
          message: `${b.car?.brand} ${b.car?.model} — ${b.first_name} ${b.last_name} — ${end.toLocaleDateString('fr-FR')}`,
          time: isOverdue ? `Retard ${Math.abs(diff)}j` : diff === 0 ? "Aujourd'hui" : `${diff}j`,
          read: false,
          link: '/admin/planning',
        };
      }));
    } catch {}
  };

  // Fetch notifications and unread count from API
  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No auth token available");
      return;
    }

    try {
      const [notificationsRes, unreadCountRes] = await Promise.all([
        fetch(`${API_BASE_URL}/notifications?per_page=3`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/notifications/unread-count`, {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
      ]);

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        // Transform backend notifications to Header format
        const transformedNotifications: Notification[] = (data.data || []).map((notif: any) => ({
          id: notif.id.toString(),
          type: notif.type as "BOOKING" | "CONTRACT" | "EXPENSE" | "SYSTEM",
          title: notif.title,
          message: notif.message,
          time: formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }),
          read: notif.is_read,
          link: notif.data?.booking_id ? "/admin/reservations" : 
                notif.data?.message_id ? "/admin/messages" : 
                notif.data?.review_id ? "/admin/reviews" : "#"
        }));
        setNotifications(transformedNotifications);
      }

      if (unreadCountRes.ok) {
        const data = await unreadCountRes.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchPendingReturns();
    const interval = setInterval(() => { fetchNotifications(); fetchPendingReturns(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No auth token available");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh notifications
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BOOKING": return <Calendar className="text-blue-500" size={16} />;
      case "CONTRACT": return <CheckCircle2 className="text-green-500" size={16} />;
      case "SYSTEM": return <AlertCircle className="text-orange-500" size={16} />;
      case "REVIEW": return <Star className="text-yellow-500" size={16} />;
      case "RETURN": return <RotateCcw className="text-purple-500" size={16} />;
      default: return <Bell className="text-gray-400" size={16} />;
    }
  };

  return (
    <header className="h-24 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-10 shadow-sm z-50 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-gray-50 rounded-2xl text-[var(--color-primary)] hover:bg-gray-100 transition-all shadow-sm"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-8">
        {/* Bouton Charges */}
        <Link 
          href="/admin/expenses"
          className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-all shadow-sm group"
          title="Charges"
        >
          <CreditCard size={18} />
        </Link>

        {/* Bouton Statistiques */}
        <Link 
          href="/admin/stats"
          className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-all shadow-sm group"
          title="Statistiques"
        >
          <TrendingUp size={18} />
        </Link>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl transition-all shadow-sm group ${
              showNotifications ? "admin-btn-active" : "bg-gray-50 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-100"
            }`}
          >
            <Bell size={18} />
            {(unreadCount + returnNotifs.length) > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount + returnNotifs.length}
              </span>
            )}
          </button>

          {/* Notifications Pop-up */}
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-tight">Notifications</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{unreadCount + returnNotifs.length} non lues</p>
                </div>
                <button 
                  onClick={markAllAsRead}
                  className="text-[9px] font-black text-[var(--color-highlight)] uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  Tout marquer lu
                </button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto admin-scroll-container">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <Bell size={24} className="text-gray-300 animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chargement...</p>
                  </div>
                ) : [...returnNotifs, ...notifications].length > 0 ? (
                  [...returnNotifs, ...notifications].map((notif) => (
                    <Link 
                      key={notif.id} 
                      href={notif.link || "#"}
                      onClick={() => setShowNotifications(false)}
                      className={`flex gap-4 p-5 border-b border-gray-50 hover:bg-gray-50/80 transition-all group/notif ${!notif.read ? "bg-blue-50/20" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/notif:scale-110 ${
                        notif.read ? "bg-gray-50 text-gray-400" : "bg-white text-[var(--color-primary)]"
                      }`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-[11px] font-black uppercase tracking-tight truncate ${notif.read ? "text-gray-500" : "text-[var(--color-primary)]"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[8px] font-bold text-gray-400 uppercase whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className={`text-[10px] leading-relaxed line-clamp-2 ${notif.read ? "text-gray-400" : "text-gray-600 font-medium"}`}>
                          {notif.message}
                        </p>
                      </div>
                      <div className="flex items-center opacity-0 group-hover/notif:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-[var(--color-highlight)]" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                      <Bell size={24} className="text-gray-200" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aucune notification</p>
                  </div>
                )}
              </div>
              
              <Link 
                href="/admin/notifications" 
                className="block p-4 bg-gray-50/50 text-center text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:bg-gray-50 transition-colors"
                onClick={() => setShowNotifications(false)}
              >
                Voir tout l'historique
              </Link>
            </div>
          )}
        </div>

        <div className="h-10 w-px bg-gray-100 hidden md:block"></div>

        <div className="flex items-center gap-3 md:gap-5 bg-gray-50/50 p-1.5 md:p-2 md:pl-6 rounded-2xl md:rounded-[2rem] border border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest">{sessionData?.user?.name || session.user?.name}</p>
            <p className="text-[9px] text-[var(--color-highlight)] font-black uppercase tracking-[0.3em] mt-1">
              {(sessionData?.user as any)?.role || session.user?.role}
            </p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 text-[var(--color-primary)] shadow-sm flex items-center justify-center">
            {(sessionData?.user as any)?.profileImage ? (
              <img
                src={(sessionData?.user as any)?.profileImage}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
