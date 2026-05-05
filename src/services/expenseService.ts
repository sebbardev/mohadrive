import { getAllCars, Car } from "./carService";
import { getAllBookings, Booking } from "./bookingService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export interface Expense {
  id: string;
  car_id: string;
  type: string;
  amount: number;
  date: string;
  note?: string;
  car?: {
    brand: string;
    model: string;
    image?: string;
  };
  createdAt: string;
}

export interface ExpenseDashboard {
  summary: {
    total_revenue: number;
    total_expenses: number;
    total_net_gain: number;
    credit_total?: number;
    break_even_ratio?: number;
  };
  per_car: Array<{
    car_id: string;
    brand: string;
    model: string;
    total_revenue: number;
    total_expenses: number;
    credit_amount?: number;
    maintenance_amount?: number;
    net_gain: number;
  }>;
  upcoming_expenses?: Array<{
    date: string;
    label: string;
    amount: number;
    type: string;
  }>;
  low_profit_cars?: Array<{
    car_id: string;
    brand: string;
    model: string;
    revenue: number;
    expenses: number;
    profit: number;
    reason: string;
  }>;
}

export async function getExpenses(params?: {
  car_id?: string;
  type?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: string;
  search?: string;
}) {
  try {
    // Utiliser l'API locale Next.js qui gère correctement la pagination
    const url = new URL('/api/expenses', window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value.toString());
      });
    }
    const response = await fetch(url.toString());
    return await response.json();
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

export async function createExpense(data: any, accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.message || "Erreur lors de la création" };
    }
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateExpense(id: string, data: any, accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.message || "Erreur lors de la mise à jour" };
    }
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteExpense(id: string, accessToken: string) {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      const result = await response.json();
      return { success: false, error: result.message || "Erreur lors de la suppression" };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function getExpenseDashboard(params?: { 
  car_id?: string; 
  type?: string;
  period?: string; // 'month', 'quarter', 'year', 'all'
  from?: string;
  to?: string;
}): Promise<ExpenseDashboard | null> {
  try {
    // Utiliser l'API backend qui fait déjà correctement les calculs
    const url = new URL(`${API_URL}/expenses/dashboard`);
    if (params?.car_id) {
      url.searchParams.append('car_id', params.car_id);
    }
    if (params?.type) {
      url.searchParams.append('type', params.type);
    }
    if (params?.from) {
      url.searchParams.append('from', params.from);
    }
    if (params?.to) {
      url.searchParams.append('to', params.to);
    }
    if (params?.period) {
      url.searchParams.append('period', params.period);
    }
    
    const response = await fetch(url.toString());
    const backendData = await response.json();

    // Transformer les données du backend vers le format frontend
    return {
      summary: {
        total_revenue: backendData.summary.total_revenue,
        total_expenses: backendData.summary.total_expenses,
        total_net_gain: backendData.summary.total_net_gain,
        credit_total: backendData.summary.credit_total || 0,
        break_even_ratio: backendData.summary.break_even_ratio || 0,
      },
      per_car: backendData.per_car.map((car: any) => ({
        car_id: car.car_id.toString(),
        brand: car.brand,
        model: car.model,
        total_revenue: car.total_revenue,
        total_expenses: car.total_expenses,
        credit_amount: car.credit_amount || 0,
        maintenance_amount: car.maintenance_amount || 0,
        net_gain: car.net_gain,
      })),
      low_profit_cars: backendData.low_profit_cars || [],
      upcoming_expenses: backendData.upcoming_expenses || [],
    };
  } catch (error) {
    console.error("Error fetching expense dashboard from API:", error);
    
    // Fallback: calcul côté client si l'API échoue
    try {
      const [cars, bookings, expenses] = await Promise.all([
        getAllCars(),
        getAllBookings(),
        getExpenses(params),
      ]);

      const now = new Date();
      let startDate: Date;
      let endDate = now;

      // Déterminer la période de calcul
      if (params?.from && params?.to) {
        startDate = new Date(params.from);
        endDate = new Date(params.to);
      } else {
        switch (params?.period) {
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'quarter':
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          case 'all':
          default:
            startDate = new Date(0);
            break;
        }
      }

      // Calculer les statistiques par véhicule
      const perCarStats = cars.map(car => {
        const carBookings = bookings.data.filter((b: any) => {
          const bookingDate = new Date(b.startDate);
          return b.carId === car.id && 
                 b.status !== "CANCELLED" &&
                 bookingDate >= startDate && 
                 bookingDate <= endDate;
        });
        const totalRevenue = carBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);

        const carExpenses = expenses.filter((e: any) => {
          const expenseDate = new Date(e.date);
          return e.car_id === car.id &&
                 expenseDate >= startDate && 
                 expenseDate <= endDate;
        });
        
        const totalExpenses = carExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
        
        const manualExpenses = carExpenses.filter((e: any) => !e.is_automatic);
        const automaticExpenses = carExpenses.filter((e: any) => e.is_automatic);
        
        const creditAmount = automaticExpenses
          .filter((e: any) => e.type === 'crédit')
          .reduce((sum: number, e: any) => sum + e.amount, 0);
        
        const maintenanceAmount = manualExpenses.reduce((sum: number, e: any) => sum + e.amount, 0) +
          automaticExpenses
            .filter((e: any) => ['assurance', 'vignette'].includes(e.type))
            .reduce((sum: number, e: any) => sum + e.amount, 0);

        const netGain = Math.round((totalRevenue - totalExpenses) * 100) / 100;

        return {
          car_id: car.id,
          brand: car.brand,
          model: car.model,
          total_revenue: totalRevenue,
          total_expenses: totalExpenses,
          credit_amount: creditAmount,
          maintenance_amount: maintenanceAmount,
          net_gain: netGain,
          alerts: []
        };
      });

      const totalRevenue = perCarStats.reduce((sum, s) => sum + s.total_revenue, 0);
      const totalExpenses = perCarStats.reduce((sum, s) => sum + s.total_expenses, 0);
      const creditTotal = perCarStats.reduce((sum, s) => sum + (s.credit_amount || 0), 0);
      const totalNetGain = totalRevenue - totalExpenses;
      const breakEvenRatio = totalExpenses > 0 ? (totalRevenue / totalExpenses) * 100 : (totalRevenue > 0 ? 100 : 0);

      return {
        summary: {
          total_revenue: totalRevenue,
          total_expenses: totalExpenses,
          total_net_gain: totalNetGain,
          credit_total: creditTotal,
          break_even_ratio: breakEvenRatio,
        },
        per_car: perCarStats,
        low_profit_cars: [],
        upcoming_expenses: [],
      };
    } catch (fallbackError) {
      console.error("Error in fallback calculation:", fallbackError);
      return null;
    }
  }
}
