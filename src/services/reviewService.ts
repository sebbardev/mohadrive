const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

export interface Review {
  id: number;
  name: string;
  role: string | null;
  rating: number;
  content: string;
  created_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
}

export interface ReviewsResponse {
  data: Review[];
  average_rating: number;
  total_reviews: number;
}

/**
 * Get all approved reviews
 */
export async function getReviews(): Promise<ReviewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      next: { revalidate: 120 }, // Cache for 2 minutes
    });

    if (!response.ok) {
      return { data: [], average_rating: 0, total_reviews: 0 };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { data: [], average_rating: 0, total_reviews: 0 };
  }
}

/**
 * Submit a new review
 */
export async function submitReview(reviewData: {
  name: string;
  email: string;
  role?: string;
  rating: number;
  content: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || "Erreur lors de l'envoi de l'avis" 
      };
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { success: false, message: error.message || "Erreur de connexion" };
  }
}

/**
 * Get all reviews for admin
 */
export async function getAdminReviews(token: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return [];
  }
}

/**
 * Approve or reject a review
 */
export async function updateReviewStatus(
  token: string,
  reviewId: number,
  isApproved: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ is_approved: isApproved }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Erreur" };
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur de connexion" };
  }
}

/**
 * Delete a review
 */
export async function deleteReview(
  token: string,
  reviewId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Erreur" };
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur de connexion" };
  }
}
