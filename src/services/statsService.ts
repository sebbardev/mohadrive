const API_URL = "https://mohadrive.com/api";

export interface CarProfitDetail {
  id: string;
  brand: string;
  model: string;
  image?: string;
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
}

export interface Stats {
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
  carsProfit: CarProfitDetail[];
  recentBookings: any[];
  pendingReturns?: Array<{
    id: string;
    car_id: string;
    car: { brand?: string; model?: string; image?: string };
    first_name: string;
    last_name: string;
    start_date: string;
    end_date: string;
    status: string;
  }>;
  carAvailability: {
    available: number;
    unavailable: number;
  };
}

export interface CarDetailedStats {
  car: {
    id: string;
    brand: string;
    model: string;
    image: string;
  };
  totalRevenue: number;
  totalExpenses: number;
  netGain: number;
  bookingCount: number;
  totalDaysRented: number;
  occupancyRate: number;
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
  bookings: any[];
  expenses: any[];
}

export async function getStats(): Promise<Stats> {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques via Laravel API:", error);
    return {
      totalCars: 0,
      activeBookings: 0,
      pendingBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netGain: 0,
      monthlyData: [],
      expenseTypeStats: [],
      carsProfit: [],
      recentBookings: [],
      pendingReturns: [],
      carAvailability: {
        available: 0,
        unavailable: 0,
      }
    };
  }
}

export async function getPublicStats(): Promise<{ totalBookings: number; availableCars: number }> {
  try {
    const response = await fetch(`${API_URL}/public-stats`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques publiques:", error);
    return {
      totalBookings: 0,
      availableCars: 0,
    };
  }
}

export async function getCarDetailedStats(id: string): Promise<CarDetailedStats | null> {
  try {
    const response = await fetch(`${API_URL}/stats/cars/${id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des statistiques pour la voiture ${id}:`, error);
    return null;
  }
}
