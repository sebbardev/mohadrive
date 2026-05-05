import { getAllCars } from "@/services/carService";
import { getBookingsByRange } from "@/services/bookingService";
import PlanningBoard from "@/components/admin/PlanningBoard";
import { CalendarDays, CheckCircle, DollarSign } from "lucide-react";

export default async function AdminPlanningPage() {
  const cars = await getAllCars();
  
  // Calculate stats for the current week
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayOfWeek = startOfWeek.getDay();
  const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const formatDateISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  
  const bookings = await getBookingsByRange({
    from: formatDateISO(startOfWeek),
    to: formatDateISO(endOfWeek),
  });
  
  const totalWeekBookings = bookings.length;
  const activeBookings = bookings.filter(b => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    return today >= start && today <= end && b.status !== "CANCELLED";
  }).length;
  
  const availableCars = cars.length - activeBookings;
  const weekRevenue = bookings.reduce((sum, b) => {
    if (b.status !== "CANCELLED") {
      return sum + (b.totalPrice || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="space-y-1">
                <h1 className="admin-header-title">Planning des <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Réservations</span></h1>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] rounded-full" />
          <p className="admin-header-subtitle">Vue agenda par véhicule avec réservations et indisponibilités</p>
        </div>
      </div>

      {/* Planning Board */}
      <div className="admin-card border-none bg-transparent shadow-none">
        <PlanningBoard cars={cars} />
      </div>
    </div>
  );
}

