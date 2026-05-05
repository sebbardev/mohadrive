// Interface pour correspondre à ce que le frontend attend
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  currency: string;
  fuel: string;
  transmission: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  deposit: number;
  available: boolean;
  plateNumber?: string;
  plateLetter?: string;
  plateCityCode?: string;
  formattedPlate?: string;
  // Financial Parameters
  has_credit: boolean;
  monthly_credit?: number;
  credit_start_date?: string;
  credit_end_date?: string;
  credit_payment_day?: number;
  annual_insurance?: number;
  insurance_expiry_date?: string;
  annual_vignette?: number;
  vignette_expiry_date?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// Cache for API responses to reduce unnecessary calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds cache TTL

/**
 * Fetch with cache to avoid redundant API calls
 */
async function fetchWithCache(url: string, options?: RequestInit) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
}

/**
 * Mappe un objet Car de l'API Laravel vers l'interface Car du frontend
 */
function mapLaravelCarToFrontend(laravelCar: any): Car {
  if (!laravelCar) return {} as Car;
  
  return {
    id: laravelCar.id?.toString() || "",
    name: `${laravelCar.brand || ""} ${laravelCar.model || ""}`,
    brand: laravelCar.brand || "",
    model: laravelCar.model || "",
    year: laravelCar.year || new Date().getFullYear(),
    pricePerDay: parseFloat(laravelCar.price_per_day || "0"),
    currency: laravelCar.currency || "MAD",
    fuel: laravelCar.fuel || "",
    transmission: laravelCar.transmission || "",
    category: laravelCar.category || "",
    image: laravelCar.image || "",
    images: Array.isArray(laravelCar.images) 
      ? laravelCar.images 
      : (typeof laravelCar.images === 'string' ? JSON.parse(laravelCar.images || "[]") : []),
    description: laravelCar.description || "",
    features: Array.isArray(laravelCar.features) 
      ? laravelCar.features 
      : (typeof laravelCar.features === 'string' ? JSON.parse(laravelCar.features || "[]") : []),
    deposit: parseFloat(laravelCar.deposit || "0"),
    available: Boolean(laravelCar.available),
    plateNumber: laravelCar.plate_number,
    plateLetter: laravelCar.plate_letter,
    plateCityCode: laravelCar.plate_city_code,
    formattedPlate: laravelCar.formatted_plate,
    // Financial mapping
    has_credit: Boolean(laravelCar.has_credit),
    monthly_credit: parseFloat(laravelCar.monthly_credit || "0"),
    credit_start_date: laravelCar.credit_start_date,
    credit_end_date: laravelCar.credit_end_date,
    credit_payment_day: parseInt(laravelCar.credit_payment_day || "1"),
    annual_insurance: parseFloat(laravelCar.annual_insurance || "0"),
    insurance_expiry_date: laravelCar.insurance_expiry_date,
    annual_vignette: parseFloat(laravelCar.annual_vignette || "0"),
    vignette_expiry_date: laravelCar.vignette_expiry_date,
  };
}

/**
 * Récupère tous les véhicules depuis l'API Laravel
 */
export async function getAllCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_URL}/cars`, {
      next: { revalidate: 120 }, // Increased to 120 seconds for better caching
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Réponse non-JSON reçue de l'API Laravel (getAllCars):", text.substring(0, 200));
      return [];
    }

    const result = await response.json();
    const data = result.data || result;
    return Array.isArray(data) ? data.map(mapLaravelCarToFrontend) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures via Laravel API:", error);
    return [];
  }
}

/**
 * Récupère un véhicule spécifique par son ID depuis l'API Laravel
 */
export async function getCarById(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`${API_URL}/cars/${id}`, {
      next: { revalidate: 120 }, // Increased to 120 seconds for better caching
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`Réponse non-JSON reçue de l'API Laravel (getCarById ${id}):`, text.substring(0, 200));
      return null;
    }

    const result = await response.json();
    const data = result.data || result;
    return data ? mapLaravelCarToFrontend(data) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la voiture ${id} via Laravel API:`, error);
    return null;
  }
}

/**
 * Récupère les véhicules mis en avant (ex: les 3 derniers) depuis l'API Laravel
 */
export async function getFeaturedCars(limit = 3): Promise<Car[]> {
  try {
    const response = await fetch(`${API_URL}/cars/featured`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return [];
    }

    const result = await response.json();
    const data = result.data || result;
    return Array.isArray(data) ? data.map(mapLaravelCarToFrontend) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures vedettes via Laravel API:", error);
    return [];
  }
}
