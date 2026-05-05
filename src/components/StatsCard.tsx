"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { getPublicStats } from "@/services/statsService";

export default function StatsCard() {
  const [stats, setStats] = useState<{ totalBookings: number; availableCars: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPublicStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white/90 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-[var(--color-primary)]/10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <div className="w-12 h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white/90 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-[var(--color-primary)]/10">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
          <Users className="text-white" size={24} />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">
            {stats?.totalBookings || 0}
          </p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Réservations
          </p>
        </div>
      </div>
    </div>
  );
}
