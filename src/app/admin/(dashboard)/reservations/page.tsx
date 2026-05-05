import { getAllBookings } from "@/services/bookingService";
import AdminReservationsClient from "./AdminReservationsClient";

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: { page?: string; sort_by?: string; sort_order?: string; new?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const sortBy = searchParams.sort_by || "created_at";
  const sortOrder = searchParams.sort_order || "desc";
  const openNewForm = searchParams.new === "true";
  const initialBookings = await getAllBookings(page, 15, sortBy, sortOrder);

  return (
    <AdminReservationsClient 
      initialBookings={initialBookings} 
      currentPage={page}
      currentSortBy={sortBy}
      currentSortOrder={sortOrder}
      openNewForm={openNewForm}
    />
  );
}
