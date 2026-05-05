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
import { useState, useEffect } from "react";

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

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [badges, setBadges] = useState<Badges>({ reservations: 0, messages: 0, notifications: 0, reviews: 0 });

  useEffect(() => {
    const fetchBadges = async () => {
      const token = (session?.user as any)?.accessToken;
      try {
        const [msgRes, notifRes, bookingsRes, reviewsRes] = await Promise.all([
          fetch("/api/admin/contact-messages/unread-count"),
          fetch("http://127.0.0.1:8000/api/notifications/unread-count", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch("http://127.0.0.1:8000/api/bookings?status=PENDING&per_page=200", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch("http://127.0.0.1:8000/api/reviews?status=pending&per_page=200", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        const [msgData, notifData, bookingsData, reviewsData] = await Promise.all([
          msgRes.ok ? msgRes.json() : { count: 0 },
          notifRes.ok ? notifRes.json() : { count: 0 },
          bookingsRes.ok ? bookingsRes.json() : { data: [] },
          reviewsRes.ok ? reviewsRes.json() : { data: [] },
        ]);

        setBadges({
          messages: msgData.count || msgData.unread_count || 0,
          notifications: notifData.count || 0,
          reservations: Array.isArray(bookingsData.data) ? bookingsData.data.length : 0,
          reviews: Array.isArray(reviewsData.data) ? reviewsData.data.length : 0,
        });
      } catch (_) {}
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin/dashboard", badge: 0 },
    { icon: CalendarDays, label: "Réservations", href: "/admin/reservations", badge: badges.reservations },
    { icon: Clock, label: "Planning", href: "/admin/planning", badge: 0 },
    { icon: FileText, label: "Contrats", href: "/admin/contracts", badge: 0 },
    { icon: Car, label: "Véhicules", href: "/admin/voitures", badge: 0 },
    { icon: Users, label: "Clients", href: "/admin/customers", badge: 0 },
    { icon: Star, label: "Avis", href: "/admin/reviews", badge: badges.reviews },
    { icon: CreditCard, label: "Charges", href: "/admin/expenses", badge: 0 },
    { icon: TrendingUp, label: "Statistiques", href: "/admin/stats", badge: 0 },
    { icon: MessageSquare, label: "Messages", href: "/admin/messages", badge: badges.messages },
    { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: badges.notifications },
    { icon: Settings, label: "Paramètres", href: "/admin/settings", badge: 0 },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex flex-col gap-1 group">
            <h2 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tighter leading-none">
              MOHA<span className="text-[var(--color-secondary)]">DRIVE</span>
            </h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Location de Voitures</p>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-[var(--color-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 admin-scroll-container">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? "admin-btn-active shadow-lg shadow-blue-900/10 -translate-x-1" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                }`}
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
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
