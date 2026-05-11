import type { HeroImage } from "@/lib/api";

const API_BASE_URL = "https://mohadrive.com/api";

/**
 * Get active hero images for homepage
 */
export async function getHeroImages(): Promise<HeroImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-images`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }
}
