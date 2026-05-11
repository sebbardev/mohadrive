const API_URL = "https://mohadrive.com/api";

export type UnavailabilityType = "MAINTENANCE" | "NETTOYAGE" | "PANNE" | "INDISPONIBLE";

export interface Unavailability {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  type: UnavailabilityType | string;
  note: string | null;
}

function mapLaravelUnavailabilityToFrontend(item: any): Unavailability {
  return {
    id: item.id?.toString(),
    carId: item.car_id?.toString(),
    startDate: item.start_date,
    endDate: item.end_date,
    type: item.type,
    note: item.note ?? null,
  };
}

export async function getUnavailabilities(params?: {
  from?: string;
  to?: string;
  carId?: string;
}): Promise<Unavailability[]> {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.carId) searchParams.set("car_id", params.carId);

  const url = `${API_URL}/unavailabilities${searchParams.toString() ? `?${searchParams}` : ""}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const { data } = await response.json();
    return data.map(mapLaravelUnavailabilityToFrontend);
  } catch (error) {
    console.error("Erreur lors de la récupération des indisponibilités:", error);
    return [];
  }
}

export async function createUnavailability(
  payload: {
    carId: string;
    startDate: string;
    endDate: string;
    type: UnavailabilityType | string;
    note?: string;
  },
  accessToken: string
): Promise<{ success: true; item: Unavailability } | { success: false; error: string }> {
  try {
    const response = await fetch(`${API_URL}/unavailabilities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        car_id: payload.carId,
        start_date: payload.startDate,
        end_date: payload.endDate,
        type: payload.type,
        note: payload.note,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: data?.message || "Erreur lors du blocage" };
    }

    return { success: true, item: mapLaravelUnavailabilityToFrontend(data.data ?? data) };
  } catch (error) {
    return { success: false, error: "Erreur réseau" };
  }
}

export async function deleteUnavailability(
  id: string,
  accessToken: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const response = await fetch(`${API_URL}/unavailabilities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: data?.message || "Erreur lors de la suppression" };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur réseau" };
  }
}

