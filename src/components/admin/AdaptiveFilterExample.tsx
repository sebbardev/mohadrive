"use client";

import { useState, useEffect } from "react";
import AdaptiveFilter from "./AdaptiveFilter";
import { VIEW_FILTER_CONFIGS, ViewFilterKey } from "@/types/filters";

// Exemple d'utilisation pour la page des notifications
interface Notification {
  id: string;
  type: "BOOKING" | "CONTACT_MESSAGE" | "SYSTEM";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdaptiveFilterExample() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    const mockData: Notification[] = [
      {
        id: "1",
        type: "BOOKING",
        title: "Nouvelle réservation",
        message: "Une nouvelle réservation a été effectuée",
        is_read: false,
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        type: "CONTACT_MESSAGE",
        title: "Message contact",
        message: "Un client a envoyé un message",
        is_read: true,
        created_at: "2024-01-14T15:20:00Z"
      },
      // ... plus de données
    ];

    setTimeout(() => {
      setNotifications(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filters: any, results: any) => {
    setFilteredNotifications(results.data);
  };

  const handleReset = () => {
    setFilteredNotifications(notifications);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">
            Centre de <span className="text-[var(--color-primary)]">Notifications</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full" />
            <p className="admin-header-subtitle">
              {notifications.filter(n => !n.is_read).length} notifications non lues
            </p>
          </div>
        </div>
      </div>

      {/* Filtre Adaptatif */}
      <AdaptiveFilter
        config={VIEW_FILTER_CONFIGS.notifications}
        data={notifications}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Résultats */}
      <div className="admin-card !p-0 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-all hover:bg-gray-50/50 cursor-pointer ${
                  notification.is_read
                    ? "bg-white"
                    : "bg-blue-50 border-l-4 border-l-[var(--color-primary)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50">
                    {/* Icône selon le type */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-black uppercase tracking-tight ${
                      notification.is_read ? "text-gray-500" : "text-[var(--color-primary)]"
                    }`}>
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="admin-label">Aucune notification trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook personnalisé pour faciliter l'utilisation
export function useAdaptiveFilter<T>(
  configKey: ViewFilterKey,
  data: T[]
) {
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [filters, setFilters] = useState<any>({});

  const handleFilterChange = (newFilters: any, results: any) => {
    setFilters(newFilters);
    setFilteredData(results.data);
  };

  const handleReset = () => {
    setFilters({});
    setFilteredData(data);
  };

  return {
    config: VIEW_FILTER_CONFIGS[configKey],
    filteredData,
    filters,
    handleFilterChange,
    handleReset
  };
}
