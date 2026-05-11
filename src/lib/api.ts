import { cache } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  currency: string;
  image: string;
  available: boolean;
  category: string;
  fuel: string;
  transmission: string;
  color: string;
  description?: string;
}

export interface Review {
  id: number;
  name: string;
  role: string | null;
  rating: number;
  content: string;
  date?: string;
  avatar?: string;
  comment?: string;
}

export interface HeroImage {
  id: number;
  image_path: string;
  title: string | null;
  subtitle: string | null;
  order: number;
  is_active?: boolean;
}

export const getAllCars = cache(async (): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js will automatically cache this fetch request
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
});

export const getHeroImages = cache(async (): Promise<HeroImage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-images`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js will automatically cache this fetch request
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }
});

export const getReviews = cache(async (): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js will automatically cache this fetch request
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const reviews = Array.isArray(data) ? data : [];
    
    // Map API response to Review interface
    return reviews.map((review: any) => ({
      id: review.id || 0,
      name: review.name || '',
      role: review.role || null,
      rating: review.rating || 0,
      content: review.content || review.comment || '',
      date: review.date || review.created_at || '',
      avatar: review.avatar || null,
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
});

export const getTotalBookings = cache(async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js will automatically cache this fetch request
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return 0;
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data.length : 0;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return 0;
  }
});
