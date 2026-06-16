"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  Users, 
  CalendarDays, 
  Clock, 
  FileText, 
  Settings, 
  LogOut,
  X,
  MessageSquare,
  Bell,
  Star,
  CreditCard,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useCallback, memo } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface Badges {
  reservations: number;
  messages: number;
  notifications: number;
  reviews: number;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [badges, setBadges] = useState<Badges>({ reservations: 0, messages: 0, notifications: 0, reviews: 0 });

  const fetchBadges = useCallback(async () => {
      const token = (session?.user as any)?.accessToken;
      if (!token) return;
      
      try {
        // Use Promise.allSettled to avoid blocking if one request fails
        const [msgRes, notifRes, bookingsRes, reviewsRes] = await Promise.allSettled([
          fetch("/api/admin/contact-messages/unread-count"),
          fetch(`${API_BASE_URL}/notifications/unread-count`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_BASE_URL}/bookings?status=PENDING&per_page=200`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_BASE_URL}/reviews?status=pending&per_page=200`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        const results = await Promise.all([
          msgRes.status === 'fulfilled' && msgRes.value.ok ? msgRes.value.json() : { count: 0 },
          notifRes.status === 'fulfilled' && notifRes.value.ok ? notifRes.value.json() : { count: 0 },
          bookingsRes.status === 'fulfilled' && bookingsRes.value.ok ? bookingsRes.value.json() : { data: [] },
          reviewsRes.status === 'fulfilled' && reviewsRes.value.ok ? reviewsRes.value.json() : { data: [] },
        ]);

        setBadges({
          messages: results[0].count || results[0].unread_count || 0,
          notifications: results[1].count || 0,
          reservations: Array.isArray(results[2].data) ? results[2].data.length : 0,
          reviews: Array.isArray(results[3].data) ? results[3].data.length : 0,
        });
      } catch (_) {}
  }, [session]);

  useEffect(() => {
    // Add a small delay to prevent blocking initial render
    const timeoutId = setTimeout(fetchBadges, 150);
    const interval = setInterval(fetchBadges, 30000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [fetchBadges]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin/dashboard", badge: 0, disabled: false },
    { icon: CalendarDays, label: "Réservations", href: "/admin/reservations", badge: badges.reservations, disabled: true },
    { icon: Clock, label: "Planning", href: "/admin/planning", badge: 0, disabled: true },
    { icon: FileText, label: "Contrats", href: "/admin/contracts", badge: 0, disabled: true },
    { icon: Car, label: "Véhicules", href: "/admin/voitures", badge: 0, disabled: false },
    { icon: Users, label: "Clients", href: "/admin/customers", badge: 0, disabled: true },
    { icon: Star, label: "Avis", href: "/admin/reviews", badge: badges.reviews, disabled: false },
    { icon: CreditCard, label: "Charges", href: "/admin/expenses", badge: 0, disabled: true },
    { icon: TrendingUp, label: "Statistiques", href: "/admin/stats", badge: 0, disabled: true },
    { icon: MessageSquare, label: "Messages", href: "/admin/messages", badge: badges.messages, disabled: false },
    { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: badges.notifications, disabled: false },
    { icon: Settings, label: "Paramètres", href: "/admin/settings", badge: 0, disabled: false },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity duration-150"
          onClick={onClose}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-50 transition-transform duration-200 ease-out transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex flex-col gap-1 group">
            <h2 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tighter leading-none">
              MOHA<span className="text-[var(--color-secondary)]">DRIVE</span>
            </h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Location de Voitures</p>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-[var(--color-primary)] active:scale-95 transition-transform duration-150 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 admin-scroll-container">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex items-center justify-between px-4 py-4 rounded-2xl cursor-not-allowed opacity-35 select-none"
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={18} className="text-gray-300" />
                    <span className="font-black uppercase text-[10px] tracking-widest text-gray-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect width="11" height="11" x="11" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-150 group touch-manipulation ${
                  isActive 
                    ? "admin-btn-active shadow-lg shadow-blue-900/10 -translate-x-1" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-[var(--color-primary)] active:scale-[0.98]"
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} className={isActive ? "text-white" : "group-hover:text-[var(--color-primary)]"} />
                  <span className="font-black uppercase text-[10px] tracking-widest">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge > 0 && (
                    <span className={`min-w-[20px] h-5 px-1.5 text-white text-[9px] font-black rounded-full flex items-center justify-center ${
                      isActive ? "bg-white/30" : "bg-red-500"
                    }`}>
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-50 bg-gray-50/30">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 px-4 py-4 w-full text-red-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <LogOut size={18} />
            <span>DÃ©connexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);
