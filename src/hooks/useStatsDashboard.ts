import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export interface StatsDashboard {
  totalCars: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalExpenses: number;
  netGain: number;
  monthlyData: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expenseTypeStats: Array<{
    type: string;
    amount: number;
  }>;
  carsProfit: Array<{
    id: string;
    brand: string;
    model: string;
    total_revenue: number;
    total_expenses: number;
    profit: number;
    revenue_details: Array<{
      id: string;
      customer: string;
      amount: number;
      date: string;
    }>;
    expense_details: Array<{
      id: string;
      type: string;
      amount: number;
      date: string;
    }>;
  }>;
  recentBookings: any[];
  pendingReturns: any[];
  carAvailability: {
    available: number;
    unavailable: number;
  };
}

export interface UseStatsDashboardOptions {
  period?: "all" | "month" | "quarter" | "year" | "custom";
  from?: string;
  to?: string;
  car_id?: string; // Filtre par voiture
  enabled?: boolean;
}

export function useStatsDashboard(options: UseStatsDashboardOptions = {}) {
  const {
    period = "all",
    from,
    to,
    car_id,
    enabled = true,
  } = options;

  const [data, setData] = useState<StatsDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${API_URL}/stats`);
      url.searchParams.append("period", period);
      
      if (from) url.searchParams.append("from", from);
      if (to) url.searchParams.append("to", to);
      if (car_id) url.searchParams.append("car_id", car_id);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const statsData = await response.json();
      setData(statsData);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, [period, from, to, car_id, enabled]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}
