const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

export interface Booking {
  id: string;
  carId: string;
  car: {
    brand: string;
    model: string;
    category: string;
    image?: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  dailyPrice?: number | null;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  returnLocation?: string | null;
  createdAt: string;
}

function mapLaravelBookingToFrontend(laravelBooking: any): Booking {
  return {
    id: laravelBooking.id.toString(),
    carId: laravelBooking.car_id?.toString(),
    car: {
      brand: laravelBooking.car?.brand || "Inconnu",
      model: laravelBooking.car?.model || "",
      category: laravelBooking.car?.category || "Berline",
      image: laravelBooking.car?.image,
    },
    startDate: laravelBooking.start_date,
    endDate: laravelBooking.end_date,
    totalPrice: parseFloat(laravelBooking.total_price),
    dailyPrice: laravelBooking.daily_price !== undefined && laravelBooking.daily_price !== null
      ? parseFloat(laravelBooking.daily_price)
      : null,
    status: laravelBooking.status,
    firstName: laravelBooking.first_name,
    lastName: laravelBooking.last_name,
    email: laravelBooking.email,
    phone: laravelBooking.phone,
    location: laravelBooking.location,
    returnLocation: laravelBooking.return_location ?? null,
    createdAt: laravelBooking.created_at,
  };
}

export interface BookingPagination {
  data: Booking[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  sort_by?: string;
  sort_order?: string;
}

export async function getAllBookings(
  page: number = 1, 
  perPage: number = 15,
  sortBy: string = 'created_at',
  sortOrder: string = 'desc'
): Promise<BookingPagination> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      sort_by: sortBy,
      sort_order: sortOrder,
    });
    
    const response = await fetch(`${API_URL}/bookings?${params.toString()}`, {
      next: { revalidate: 0 }, // Pas de cache pour les rÃ©servations
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data || [];
    
    return {
      data: data.map(mapLaravelBookingToFrontend),
      current_page: result.current_page || page,
      last_page: result.last_page || 1,
      per_page: result.per_page || perPage,
      total: result.total || data.length,
      from: result.from || 0,
      to: result.to || data.length,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  } catch (error) {
    console.error("Erreur lors de la rÃ©cupÃ©ration des rÃ©servations via Laravel API:", error);
    return {
      data: [],
      current_page: page,
      last_page: 1,
      per_page: perPage,
      total: 0,
      from: 0,
      to: 0,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }
}

export async function getBookingsByRange(params: {
  from: string;
  to: string;
  carId?: string;
}): Promise<Booking[]> {
  try {
    const searchParams = new URLSearchParams({ from: params.from, to: params.to });
    if (params.carId) searchParams.set("car_id", params.carId);

    const response = await fetch(`${API_URL}/bookings?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const { data } = await response.json();
    return data.map(mapLaravelBookingToFrontend);
  } catch (error) {
    console.error("Erreur lors de la rÃ©cupÃ©ration des rÃ©servations (range):", error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string, adminId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        status,
        admin_id: adminId, // Pour la journalisation cÃ´tÃ© backend
        updated_at: new Date().toISOString()
      }),
    });

    if (response.ok) {
      // Simulation d'envoi d'email et journalisation
      console.log(`[LOG] RÃ©servation ${id} mise Ã  jour vers ${status} par l'admin ${adminId || 'systÃ¨me'}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de la mise Ã  jour du statut:", error);
    return false;
  }
}

export async function createBooking(bookingData: any): Promise<Booking | null> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la crÃ©ation de la rÃ©servation");
    }

    const result = await response.json();
    const data = result.data || result;
    return mapLaravelBookingToFrontend(data);
  } catch (error) {
    console.error("Erreur lors de la crÃ©ation de la rÃ©servation:", error);
    throw error;
  }
}

export async function createBookingAdmin(params: {
  accessToken: string;
  carId: string;
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation?: string;
  dailyPrice: number;
  status?: string;
}): Promise<{ success: true; booking: Booking } | { success: false; error: string }> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.accessToken}`,
      },
      body: JSON.stringify({
        car_id: params.carId,
        customer_id: params.customerId,
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        phone: params.phone,
        start_date: params.startDate,
        end_date: params.endDate,
        location: params.pickupLocation,
        return_location: params.returnLocation,
        daily_price: params.dailyPrice,
        status: params.status,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: data?.message || "Erreur lors de la crÃ©ation" };
    }

    const bookingData = data?.data ?? data;
    return { success: true, booking: mapLaravelBookingToFrontend(bookingData) };
  } catch (error) {
    return { success: false, error: "Erreur rÃ©seau" };
  }
}
