"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Car } from "@/services/carService";
import { Booking, createBookingAdmin, getBookingsByRange, updateBookingStatus } from "@/services/bookingService";
import {
  createUnavailability,
  deleteUnavailability,
  getUnavailabilities,
  Unavailability,
  UnavailabilityType,
} from "@/services/unavailabilityService";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarRange,
  Filter,
  Plus,
  Wrench,
  X,
  Loader2,
  AlertTriangle,
  Search,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Trash2,
  FilePlus,
  FileText,
  CreditCard,
  ChevronRight as ChevronRightIcon,
  Car as CarIcon,
  RotateCcw,
  Check,
} from "lucide-react";
import { createExpense } from "@/services/expenseService";
import { toast } from "react-hot-toast";
import SuccessMessage from "./SuccessMessage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mohadrive.com/api";

type ViewMode = "week" | "month";

const DEFAULT_cellWidth = 44;
const FIRST_COL_WIDTH = 340; // LÃ©gÃ¨rement plus large pour les miniatures

const STATUS_STYLES: Record<string, { label: string; dot: string; border: string; bg: string; text: string; gradient: string }> = {
  PENDING: { 
    label: "En attente", 
    dot: "bg-amber-500", 
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    gradient: "from-amber-500/20 to-amber-500/5"
  },
  CONFIRMED: { 
    label: "ConfirmÃ©e", 
    dot: "bg-emerald-500", 
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    gradient: "from-emerald-500/20 to-emerald-500/5"
  },
  IN_PROGRESS: { 
    label: "En cours", 
    dot: "bg-blue-500", 
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    gradient: "from-blue-500/20 to-blue-500/5"
  },
  COMPLETED: { 
    label: "TerminÃ©e", 
    dot: "bg-slate-500", 
    border: "border-slate-500/30",
    bg: "bg-slate-500/10",
    text: "text-slate-700",
    gradient: "from-slate-500/20 to-slate-500/5"
  },
  CANCELLED: { 
    label: "AnnulÃ©e", 
    dot: "bg-rose-500", 
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    gradient: "from-rose-500/20 to-rose-500/5"
  },
};

const UNAVAILABILITY_LABELS: Record<string, string> = {
  MAINTENANCE: "Maintenance",
  NETTOYAGE: "Nettoyage",
  PANNE: "Panne",
  INDISPONIBLE: "Indisponible",
};

function parseDateOnly(value: string): Date {
  const [datePart] = value.split(" ");
  const [y, m, d] = datePart.split("-").map((v) => parseInt(v, 10));
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

function getEffectiveStatus(booking: Booking): string {
  if (booking.status === "CANCELLED") return "CANCELLED";

  const now = new Date();
  now.setHours(12, 0, 0, 0);

  const start = parseDateOnly(booking.startDate);
  const end = parseDateOnly(booking.endDate);

  if (now > end) return "COMPLETED";
  if (now >= start && now <= end) return "IN_PROGRESS";

  return booking.status;
}

function formatDateShortFR(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function parseDateTime(value: string): Date {
  const [datePart, timePart] = value.split(" ");
  const [y, m, d] = datePart.split("-").map((v) => parseInt(v, 10));
  if (timePart) {
    const [h, min, s] = timePart.split(":").map((v) => parseInt(v, 10));
    return new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0, s || 0);
  }
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function clampDate(date: Date, min: Date, max: Date): Date {
  return new Date(Math.min(max.getTime(), Math.max(min.getTime(), date.getTime())));
}

function diffDays(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 12, 0, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function hashToHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

function carColor(carId: string): { bg: string; border: string; text: string } {
  const hue = hashToHue(carId);
  return {
    bg: `hsl(${hue} 85% 45% / 0.18)`,
    border: `hsl(${hue} 85% 55% / 0.55)`,
    text: `hsl(${hue} 90% 70% / 1)`,
  };
}

function formatMonthValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function parseMonthValue(value: string): Date {
  const [y, m] = value.split("-").map((v) => parseInt(v, 10));
  return new Date(y, (m || 1) - 1, 1, 12, 0, 0, 0);
}

function isBookingVisible(booking: Booking, from: Date, to: Date): boolean {
  const start = parseDateOnly(booking.startDate);
  const end = parseDateOnly(booking.endDate);
  return start.getTime() <= to.getTime() && end.getTime() >= from.getTime();
}

function isUnavailabilityVisible(item: Unavailability, from: Date, to: Date): boolean {
  const start = parseDateOnly(item.startDate);
  const end = parseDateOnly(item.endDate);
  return start.getTime() <= to.getTime() && end.getTime() >= from.getTime();
}

interface PlanningBoardProps {
  cars: Car[];
}

const RETURN_EXPENSE_TYPES = ["lavage", "vidange", "rÃ©paration", "pneu", "amende"];

export default function PlanningBoard({ cars }: PlanningBoardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;

  // ---- Retours Ã  traiter (panneau flottant) ----
  const [mountedPortal, setMountedPortal] = useState(false);
  const [showReturnsPanel, setShowReturnsPanel] = useState(false);

  useEffect(() => { setMountedPortal(true); }, []);
  const [pendingReturns, setPendingReturns] = useState<any[]>([]);
  const [returnModal, setReturnModal] = useState<any | null>(null);
  const [returnCharges, setReturnCharges] = useState<{ type: string; amount: string; note: string }[]>([]);
  const [processingReturn, setProcessingReturn] = useState(false);

  const fetchPendingReturns = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings?per_page=100&sort_by=end_date&sort_order=asc`);
      const data = await res.json();
      const all: any[] = data.data || [];
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const in3days = new Date(today); in3days.setDate(today.getDate() + 3);
      setPendingReturns(all.filter((b: any) => {
        if (b.status !== "CONFIRMED" && b.status !== "IN_PROGRESS") return false;
        const end = new Date(b.end_date || b.endDate);
        return end <= in3days;
      }));
    } catch {}
  };

  useEffect(() => { fetchPendingReturns(); }, []);

  const handleValidateReturn = async () => {
    if (!accessToken) { toast.error("Session expirÃ©e"); return; }
    setProcessingReturn(true);
    try {
      const validCharges = returnCharges.filter(c => c.type && c.amount);
      await Promise.all(validCharges.map(c =>
        createExpense({
          car_id: returnModal.car?.id || returnModal.car_id,
          type: c.type,
          amount: parseFloat(c.amount),
          date: new Date().toISOString().split("T")[0],
          note: c.note || undefined,
        }, accessToken)
      ));
      const ok = await updateBookingStatus(returnModal.id, "COMPLETED");
      if (ok) {
        toast.success(`Retour traitÃ©${validCharges.length > 0 ? ` + ${validCharges.length} charge(s)` : ""}`);
        setReturnModal(null);
        setReturnCharges([]);
        fetchPendingReturns();
        load();
      } else {
        toast.error("Erreur lors du traitement");
      }
    } catch { toast.error("Erreur rÃ©seau"); }
    finally { setProcessingReturn(false); }
  };
  // ---- fin retours ----

  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCarId, setSelectedCarId] = useState<string>("ALL");
  const [cellWidth, setCellWidth] = useState(DEFAULT_cellWidth);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedUnavailability, setSelectedUnavailability] = useState<Unavailability | null>(null);
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Mise Ã  jour automatique de la largeur des colonnes
  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;

      if (viewMode === "week") {
        // En mode semaine, on divise l'espace disponible par 7
        const availableWidth = containerWidth - FIRST_COL_WIDTH;
        const newCellWidth = Math.max(DEFAULT_cellWidth, availableWidth / 7);
        setCellWidth(newCellWidth);
      } else {
        // En mode mois, on garde la largeur par dÃ©faut
        setCellWidth(DEFAULT_cellWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [viewMode]); // Re-calculer si le mode change

  const { rangeStart, rangeEnd, days } = useMemo(() => {
    if (viewMode === "week") {
      const start = startOfWeekMonday(cursorDate);
      const end = addDays(start, 6);
      const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
      return { rangeStart: start, rangeEnd: end, days: dates };
    }

    const start = startOfMonth(cursorDate);
    const end = endOfMonth(cursorDate);
    const length = diffDays(start, end) + 1;
    const dates = Array.from({ length }, (_, i) => addDays(start, i));
    return { rangeStart: start, rangeEnd: end, days: dates };
  }, [cursorDate, viewMode]);

  const filteredCars = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars
      .filter((car) => (selectedCarId === "ALL" ? true : car.id === selectedCarId))
      .filter((car) => {
        if (!q) return true;
        return `${car.brand} ${car.model}`.toLowerCase().includes(q);
      });
  }, [cars, query, selectedCarId]);

  const totalWidth = FIRST_COL_WIDTH + days.length * cellWidth;

  const load = async () => {
    setLoading(true);
    setError("");

    const from = formatDateISO(rangeStart);
    const to = formatDateISO(rangeEnd);
    const carId = selectedCarId === "ALL" ? undefined : selectedCarId;

    const [b, u] = await Promise.all([
      getBookingsByRange({ from, to, carId }),
      getUnavailabilities({ from, to, carId }),
    ]);

    setBookings(b);
    setUnavailabilities(u);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => {
      setError("Impossible de charger le planning.");
      setLoading(false);
    });

    // Mise Ã  jour automatique toutes les 5 secondes (polling)
    const interval = setInterval(() => {
      load().catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, rangeStart.getTime(), rangeEnd.getTime(), selectedCarId]);

  const goPrev = () => {
    setCursorDate((d) => (viewMode === "week" ? addDays(d, -7) : addMonths(d, -1)));
  };

  const goNext = () => {
    setCursorDate((d) => (viewMode === "week" ? addDays(d, 7) : addMonths(d, 1)));
  };

  const goToday = () => setCursorDate(new Date());

  const visibleBookingsByCar = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of bookings) {
      if (!isBookingVisible(booking, rangeStart, rangeEnd)) continue;
      const list = map.get(booking.carId) ?? [];
      list.push(booking);
      map.set(booking.carId, list);
    }
    return map;
  }, [bookings, rangeStart, rangeEnd]);

  const visibleUnavailabilityByCar = useMemo(() => {
    const map = new Map<string, Unavailability[]>();
    for (const item of unavailabilities) {
      if (!isUnavailabilityVisible(item, rangeStart, rangeEnd)) continue;
      const list = map.get(item.carId) ?? [];
      list.push(item);
      map.set(item.carId, list);
    }
    return map;
  }, [unavailabilities, rangeStart, rangeEnd]);

  const selectedBookingCar = useMemo(() => {
    if (!selectedBooking) return null;
    return cars.find((c) => c.id === selectedBooking.carId) ?? null;
  }, [cars, selectedBooking]);

  const selectedUnavailabilityCar = useMemo(() => {
    if (!selectedUnavailability) return null;
    return cars.find((c) => c.id === selectedUnavailability.carId) ?? null;
  }, [cars, selectedUnavailability]);

  const onUpdateStatus = async (bookingId: string, status: string) => {
    setLoading(true);
    const ok = await updateBookingStatus(bookingId, status);
    if (!ok) {
      setError("Erreur lors de la mise Ã  jour du statut.");
      setLoading(false);
      return;
    }
    await load();
    setSelectedBooking((b) => (b && b.id === bookingId ? { ...b, status } : b));
  };

  const onDeleteUnavailability = async (id: string) => {
    if (!accessToken) {
      setError("Vous devez Ãªtre connectÃ©.");
      return;
    }
    setLoading(true);
    const result = await deleteUnavailability(id, accessToken);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSelectedUnavailability(null);
    await load();
  };

  const headerLabel = useMemo(() => {
    if (viewMode === "week") {
      const from = formatDateShortFR(rangeStart);
      const to = formatDateShortFR(rangeEnd);
      const year = rangeStart.getFullYear();
      return `Semaine du ${from} â†’ ${to} ${year}`;
    }
    const monthLabel = cursorDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return `${monthLabel} â€¢ ${days.length} jours`;
  }, [cursorDate, days.length, rangeEnd, rangeStart, viewMode]);

  return (
    <>
      <div className="admin-card !p-0 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between xl:items-center">
          {/* Navigation & Label Group */}
          <div className="flex items-center gap-4 min-w-0 flex-wrap sm:flex-nowrap shrink-0">
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 shadow-sm shrink-0">
              <button
                onClick={goPrev}
                className="admin-btn-icon !p-2 hover:bg-gray-50 transition-colors"
                title="PrÃ©cÃ©dent"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goToday}
                className="admin-btn-secondary !px-3 !py-2 !rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap bg-white hover:bg-gray-50 border-gray-100"
              >
                Aujourd&apos;hui
              </button>
              <button
                onClick={goNext}
                className="admin-btn-icon !p-2 hover:bg-gray-50 transition-colors"
                title="Suivant"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="min-w-0 pl-2">
              <p title={headerLabel} className="text-base font-black text-[var(--color-primary)] uppercase tracking-tight truncate leading-none mb-1">
                {headerLabel}
              </p>
              <p className="admin-label !text-[9px] font-bold opacity-60">
                {filteredCars.length} vÃ©hicule(s) disponible(s)
              </p>
            </div>
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-3 lg:justify-end min-w-0">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-1 shadow-sm shrink-0">
              <button
                onClick={() => {
                  setViewMode("week");
                  setCursorDate((d) => startOfWeekMonday(d));
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  viewMode === "week" ? "admin-btn-active shadow-lg shadow-[var(--color-primary-rgb)]/20" : "text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-50"
                }`}
              >
                <CalendarRange size={13} />
                Semaine
              </button>
              <button
                onClick={() => {
                  setViewMode("month");
                  setCursorDate((d) => startOfMonth(d));
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  viewMode === "month" ? "admin-btn-active shadow-lg shadow-[var(--color-primary-rgb)]/20" : "text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-50"
                }`}
              >
                <CalendarDays size={13} />
                Mois
              </button>
            </div>

            {/* Date/Month Selector */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl px-3 py-1.5 shadow-sm w-full sm:w-[170px] lg:w-[160px] xl:w-[170px] shrink-0 hover:border-[var(--color-primary)]/30 transition-colors overflow-hidden">
              <span className="admin-label !text-[8px] font-black opacity-40 uppercase shrink-0">{viewMode === "week" ? "DÃ©but" : "Mois"}</span>
              <input
                type={viewMode === "week" ? "date" : "month"}
                value={viewMode === "week" ? formatDateISO(rangeStart) : formatMonthValue(cursorDate)}
                onChange={(e) => {
                  if (!e.target.value) return;
                  setCursorDate(viewMode === "week" ? parseDateOnly(e.target.value) : parseMonthValue(e.target.value));
                }}
                className="bg-transparent text-[var(--color-text-main)] text-[10px] font-black outline-none uppercase tracking-tight [color-scheme:light] w-full cursor-pointer border-none p-0 focus:ring-0"
              />
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                  onClick={() => setShowCreateBookingModal(true)}
                  className="admin-btn-primary !py-2.5 !px-4 !rounded-2xl group/btn shrink-0 !bg-gradient-to-r !from-[var(--color-accent)] !to-[var(--color-highlight)] hover:!from-[var(--color-highlight)] hover:!to-[var(--color-accent)] shadow-xl"
                >
                  <Plus size={15} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">RÃ©servation</span>
                </button>
              <button
                onClick={() => setShowBlockModal(true)}
                className="admin-btn-secondary !py-2.5 !px-4 !rounded-2xl group/btn shrink-0"
              >
                <Wrench size={15} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-wider whitespace-nowrap">Bloquer</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-4 border-b border-red-100 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <div className="overflow-x-auto admin-scroll-container" ref={containerRef}>
          <div style={{ minWidth: totalWidth }} className="select-none bg-white">

            <div
              className="grid sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md border-b border-gray-100"
              style={{ gridTemplateColumns: `${FIRST_COL_WIDTH}px repeat(${days.length}, ${cellWidth}px)` }}
            >
              <div className="sticky left-0 z-30 bg-gray-50 border-r border-gray-100 px-6 py-5 flex items-center gap-3 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="admin-label !text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Flotte</p>
            </div>
              {days.map((d) => {
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isToday = formatDateISO(d) === formatDateISO(new Date());
                return (
                  <div
                    key={formatDateISO(d)}
                    className={`px-2 py-5 border-r border-gray-100 flex flex-col items-center justify-center transition-colors relative ${
                      isToday ? "bg-[var(--color-primary)]/5" : isWeekend ? "bg-gray-100/30" : ""
                    }`}
                  >
                    {isToday && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-[var(--color-primary)] rounded-b-full" />
                    )}
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isToday ? "text-[var(--color-primary)]" : "text-gray-400"}`}>
                      {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                    </p>
                    <p className={`text-sm font-black leading-none ${isToday ? "text-[var(--color-primary)]" : "text-[var(--color-text-main)]"}`}>
                      {d.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="divide-y divide-gray-50">
              {filteredCars.map((car) => {
                const color = carColor(car.id);
                const carBookings = visibleBookingsByCar.get(car.id) ?? [];
                const carBlocks = visibleUnavailabilityByCar.get(car.id) ?? [];

                return (
                  <div
                    key={car.id}
                    className="grid group/row hover:bg-gray-50/30 transition-colors"
                    style={{ gridTemplateColumns: `${FIRST_COL_WIDTH}px repeat(${days.length}, ${cellWidth}px)` }}
                  >
                    <div className="sticky left-0 z-10 bg-white border-r border-gray-50 px-6 py-4 flex items-center gap-4 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] transition-colors group-hover/row:bg-gray-50/50">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm flex-shrink-0">
                        <Image
                          src={car.image}
                          alt={car.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[var(--color-primary)] uppercase tracking-tight truncate mb-0.5">
                          {car.brand} <span className="text-[var(--color-text-main)] not-italic ml-1 opacity-70">{car.model}</span>
                        </p>
                        {car.plateNumber ? (
                          <div className="inline-flex items-center border border-gray-800 rounded overflow-hidden text-[10px] font-black tracking-widest bg-white shadow-sm">
                            <span className="px-1.5 py-0.5 text-gray-900">{car.plateNumber}</span>
                            <span className="px-1 py-0.5 border-l border-r border-gray-800 text-gray-900">{car.plateLetter}</span>
                            <span className="px-1.5 py-0.5 text-gray-900">{car.plateCityCode}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2 py-0.5 bg-gray-100/80 border border-gray-200 rounded-lg shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sans plaque</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="relative col-span-full"
                      style={{
                        gridColumn: `2 / span ${days.length}`,
                        height: 84,
                        backgroundImage:
                          `repeating-linear-gradient(to right, rgba(0, 0, 0, 0.02) 0px, rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent ${cellWidth}px)`,
                      }}
                    >
                      <div className="absolute inset-0 flex pointer-events-none">
                        {days.map((d) => {
                          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                          const isToday = formatDateISO(d) === formatDateISO(new Date());
                          return (
                            <div
                              key={`${car.id}-${formatDateISO(d)}`}
                              style={{ width: cellWidth }}
                              className={`transition-colors border-r border-gray-50/50 ${isToday ? "bg-[var(--color-primary)]/5" : isWeekend ? "bg-gray-100/10" : ""}`}
                            >
                              {isToday && (
                                <div className="h-full w-[2px] bg-[var(--color-primary)]/20 mx-auto" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {carBlocks.map((block) => {
                        const startRaw = parseDateTime(block.startDate);
                        const endRaw = parseDateTime(block.endDate);
                        const start = clampDate(startRaw, rangeStart, rangeEnd);
                        const end = clampDate(endRaw, rangeStart, rangeEnd);
                        const left = diffDays(rangeStart, start) * cellWidth;
                        const width = (diffDays(start, end) + 1) * cellWidth;

                        return (
                          <button
                            key={`u-${block.id}`}
                            onClick={() => setSelectedUnavailability(block)}
                            className="absolute top-3 h-12 rounded-xl border px-3 text-left overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all z-10 group/block"
                            style={{
                              left,
                              width: Math.max(width, cellWidth),
                              background:
                                "repeating-linear-gradient(135deg, rgba(249,115,22,0.1) 0px, rgba(249,115,22,0.1) 8px, rgba(249,115,22,0.05) 8px, rgba(249,115,22,0.05) 16px)",
                              borderColor: "rgba(249,115,22,0.3)",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] shadow-sm" />
                              <p className="text-[9px] font-black uppercase tracking-wider text-orange-600 truncate">
                                {UNAVAILABILITY_LABELS[block.type] ?? block.type}
                              </p>
                            </div>
                            <p className="text-[8px] text-orange-500/70 font-black uppercase tracking-widest mt-0.5 truncate">
                              {formatDateShortFR(startRaw)} â†’ {formatDateShortFR(endRaw)}
                            </p>
                          </button>
                        );
                      })}

                      {carBookings.map((booking) => {
                        const startRaw = parseDateTime(booking.startDate);
                        const endRaw = parseDateTime(booking.endDate);
                        const start = clampDate(startRaw, rangeStart, rangeEnd);
                        const end = clampDate(endRaw, rangeStart, rangeEnd);
                        const left = diffDays(rangeStart, start) * cellWidth;
                        const width = (diffDays(start, end) + 1) * cellWidth;
                        const effectiveStatus = getEffectiveStatus(booking);
                        const statusStyle = STATUS_STYLES[effectiveStatus] ?? STATUS_STYLES.PENDING;
                        const chargedDays = Math.max(1, diffDays(startRaw, endRaw));
                        const pricePerDay =
                          booking.dailyPrice !== undefined && booking.dailyPrice !== null
                            ? Math.round(booking.dailyPrice)
                            : Math.round(booking.totalPrice / chargedDays);

                        return (
                          <button
                            key={`b-${booking.id}`}
                            onClick={() => setSelectedBooking(booking)}
                            className={`absolute top-4 h-14 rounded-2xl border px-4 text-left overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all z-10 group/booking ${statusStyle.border} ${statusStyle.bg}`}
                            style={{
                              left: left + 2,
                              width: Math.max(width - 4, cellWidth - 4),
                            }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${statusStyle.gradient} opacity-50`} />
                            <div className="relative z-10 flex flex-col justify-center h-full">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`h-2 w-2 rounded-full shadow-sm animate-pulse ${statusStyle.dot}`} />
                                <p className={`text-[11px] font-black uppercase tracking-wider truncate ${statusStyle.text}`}>
                                  {booking.firstName} {booking.lastName}
                                </p>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[9px] text-gray-500/80 font-black uppercase tracking-widest truncate">
                                  {formatDateShortFR(startRaw)} â†’ {formatDateShortFR(endRaw)}
                                </p>
                                <span className="text-[9px] font-black text-gray-400 whitespace-nowrap">
                                  {formatTime(startRaw)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredCars.length === 0 && (
                <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-inner">
                    <Filter className="text-gray-200" size={32} />
                  </div>
                  <p className="admin-label tracking-[0.3em]">Aucun vÃ©hicule ne correspond</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3 text-[var(--color-primary)]">
            <Loader2 className="animate-spin" size={18} />
            <p className="admin-label">Mise Ã  jour du planning...</p>
          </div>
        )}
      </div>

      {selectedBooking && selectedBookingCar && (
        <BookingDetailsModal
          booking={selectedBooking}
          car={selectedBookingCar}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {selectedUnavailability && selectedUnavailabilityCar && (
        <UnavailabilityDetailsModal
          item={selectedUnavailability}
          car={selectedUnavailabilityCar}
          onClose={() => setSelectedUnavailability(null)}
          onDelete={() => onDeleteUnavailability(selectedUnavailability.id)}
          canEdit={Boolean(accessToken)}
        />
      )}

      {showCreateBookingModal && (
        <CreateBookingModal
          cars={cars}
          initialCarId={selectedCarId !== "ALL" ? selectedCarId : cars[0]?.id}
          onClose={() => setShowCreateBookingModal(false)}
          onCreated={async () => {
            setShowCreateBookingModal(false);
            await load();
          }}
          accessToken={accessToken}
          currentRange={{
            from: formatDateISO(rangeStart),
            to: formatDateISO(rangeEnd),
          }}
        />
      )}

      {showBlockModal && (
        <BlockCarModal
          cars={cars}
          initialCarId={selectedCarId !== "ALL" ? selectedCarId : cars[0]?.id}
          onClose={() => setShowBlockModal(false)}
          onCreated={async () => {
            setShowBlockModal(false);
            await load();
          }}
          accessToken={accessToken}
          currentRange={{
            from: formatDateISO(rangeStart),
            to: formatDateISO(rangeEnd),
          }}
        />
      )}

      {/* Bouton flottant retours â€” portÃ© vers document.body */}
      {mountedPortal && pendingReturns.length > 0 && createPortal(
        <button
          onClick={() => setShowReturnsPanel(true)}
          className="fixed bottom-8 right-8 z-[199] flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <RotateCcw size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Retours Ã  traiter</span>
          <span className="bg-white text-[var(--color-primary)] text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
            {pendingReturns.length}
          </span>
        </button>,
        document.body
      )}

      {/* Slide-over + modal retour â€” portÃ©s vers document.body */}
      {mountedPortal && (showReturnsPanel || returnModal) && createPortal(
        <>
          {/* Slide-over retours */}
          {showReturnsPanel && (
            <>
              <div
                className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
                onClick={() => setShowReturnsPanel(false)}
              />
              <div className="fixed right-0 top-0 h-full w-full max-w-md z-[201] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <h2 className="admin-section-title">Retours <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Ã  Traiter</span></h2>
                      <p className="admin-label">{pendingReturns.length} vÃ©hicule(s) Ã  rÃ©ceptionner</p>
                    </div>
                  </div>
                  <button onClick={() => setShowReturnsPanel(false)} className="admin-btn-icon">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {pendingReturns.map((b: any) => {
                    const endDate = new Date(b.end_date || b.endDate);
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    const isOverdue = endDate < today;
                    const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-3">
                          {b.car?.image ? (
                            <div className="w-14 h-10 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                              <img src={b.car.image} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <CarIcon size={16} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-wide">{b.car?.brand} {b.car?.model}</p>
                            <p className="admin-label text-[9px]">{b.first_name} {b.last_name}</p>
                            <span className={`admin-pill text-[8px] mt-0.5 inline-block ${
                              isOverdue ? "admin-pill-error" : diff === 0 ? "admin-pill-warning" : "admin-pill-info"
                            }`}>
                              {isOverdue ? `En retard (${Math.abs(diff)}j)` : diff === 0 ? "Aujourd'hui" : `Dans ${diff}j`}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => { setReturnModal(b); setReturnCharges([]); }}
                          className="admin-btn-secondary !py-1.5 !px-3 text-[8px] flex items-center gap-1.5 flex-shrink-0"
                        >
                          <RotateCcw size={10} />
                          Traiter
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Modal traitement retour */}
          {returnModal && (
            <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="admin-table-icon-container bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <h3 className="admin-section-title">Traiter le retour</h3>
                      <p className="admin-label">{returnModal.car?.brand} {returnModal.car?.model} â€” {returnModal.first_name} {returnModal.last_name}</p>
                    </div>
                  </div>
                  <button onClick={() => setReturnModal(null)} className="admin-btn-icon"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Charges Ã  enregistrer <span className="normal-case font-medium">(optionnel)</span></p>
                  {returnCharges.map((charge, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select
                        value={charge.type}
                        onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? { ...c, type: e.target.value } : c))}
                        className="admin-input flex-1 text-xs py-2 px-3 h-auto"
                      >
                        <option value="">Type</option>
                        {RETURN_EXPENSE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                      <input
                        type="number" placeholder="Montant DH" value={charge.amount}
                        onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? { ...c, amount: e.target.value } : c))}
                        className="admin-input w-28 text-xs py-2 px-3 h-auto"
                      />
                      <input
                        type="text" placeholder="Note" value={charge.note}
                        onChange={e => setReturnCharges(prev => prev.map((c, idx) => idx === i ? { ...c, note: e.target.value } : c))}
                        className="admin-input flex-1 text-xs py-2 px-3 h-auto"
                      />
                      <button onClick={() => setReturnCharges(prev => prev.filter((_, idx) => idx !== i))} className="admin-btn-icon !text-red-400 flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setReturnCharges(prev => [...prev, { type: "", amount: "", note: "" }])}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                  >
                    <Plus size={12} /> Ajouter une charge
                  </button>
                </div>
                <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button onClick={() => setReturnModal(null)} className="admin-btn-secondary !py-2 !px-5 text-[9px]">Annuler</button>
                  <button
                    disabled={processingReturn}
                    onClick={handleValidateReturn}
                    className="admin-btn-primary !py-2 !px-5 text-[9px] flex items-center gap-2"
                  >
                    {processingReturn ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Valider le retour
                  </button>
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    // EmpÃªcher le dÃ©filement du corps quand le modal est ouvert
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setHasScrolled(target.scrollTop > 10);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onScroll={handleScroll}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
        
        <div className={`sticky top-0 z-20 rounded-t-[2.5rem] p-8 sm:p-10 lg:p-12 transition-all duration-300 ${
          hasScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
            : 'bg-white border-b border-gray-100'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[var(--color-text-muted)] font-light">
                  {subtitle}
                </p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] hover:bg-red-50 hover:rotate-90 transition-all duration-300 ml-4 flex-shrink-0 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return modalContent;

  return createPortal(modalContent, modalRoot);
}

function BookingDetailsModal({
  booking,
  car,
  onClose,
  onUpdateStatus,
}: {
  booking: Booking;
  car: Car;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: string) => Promise<void>;
}) {
  const router = useRouter();
  const effectiveStatus = getEffectiveStatus(booking);
  const statusStyle = STATUS_STYLES[effectiveStatus] ?? STATUS_STYLES.PENDING;
  const startRaw = parseDateTime(booking.startDate);
  const endRaw = parseDateTime(booking.endDate);
  const chargedDays = Math.max(1, diffDays(startRaw, endRaw));
  const pricePerDay =
    booking.dailyPrice !== undefined && booking.dailyPrice !== null
      ? Math.round(booking.dailyPrice)
      : Math.round(booking.totalPrice / chargedDays);

  return (
    <ModalShell
      title={`RÃ©servation â€¢ ${car.brand} ${car.model}`}
      subtitle={`${booking.firstName} ${booking.lastName} â€¢ ${statusStyle.label}`}
      onClose={onClose}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Gauche - Client & PÃ©riode */}
        <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
          {/* Bloc Client */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm group/info transition-all hover:border-[var(--color-primary)]/20 hover:shadow-md">
            <p className="admin-label !text-[9px] mb-4 font-black uppercase tracking-[0.2em] opacity-50">Informations Client</p>
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">{booking.firstName} {booking.lastName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 text-xs text-gray-600 font-bold bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <Phone size={16} />
                  </div>
                  {booking.phone}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 font-bold bg-gray-50/50 p-3 rounded-2xl border border-gray-50 truncate">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <Mail size={16} />
                  </div>
                  <span className="truncate">{booking.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc PÃ©riode */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm group/info transition-all hover:border-[var(--color-primary)]/20 hover:shadow-md flex-grow">
            <p className="admin-label !text-[9px] mb-5 font-black uppercase tracking-[0.2em] opacity-50">PÃ©riode de location</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">DÃ©part prÃ©vu</p>
                  <p className="text-sm font-black text-[var(--color-text-main)] uppercase bg-gray-50 p-3 rounded-xl inline-block">
                    {formatDateShortFR(startRaw)} Ã  {formatTime(startRaw)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Retour prÃ©vu</p>
                  <p className="text-sm font-black text-[var(--color-text-main)] uppercase bg-gray-50 p-3 rounded-xl inline-block">
                    {formatDateShortFR(endRaw)} Ã  {formatTime(endRaw)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="admin-label !text-[8px] font-black opacity-50">DurÃ©e calculÃ©e</span>
                <span className="text-lg font-black text-[var(--color-primary)] uppercase">{chargedDays} jour(s) de location</span>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black uppercase text-gray-400">
                {pricePerDay} MAD / jour
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite - Paiement & Actions */}
        <div className="lg:col-span-5 space-y-6 h-full flex flex-col">
          {/* Bloc Paiement */}
          <div className="bg-[var(--color-primary)] rounded-[2.5rem] p-8 shadow-[0_20px_40px_-12px_rgba(var(--color-primary-rgb),0.3)] relative overflow-hidden group/price">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl transition-all group-hover/price:scale-125" />
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Ã  percevoir</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-black text-white tracking-tighter drop-shadow-sm">
                {Math.round(booking.totalPrice).toLocaleString()}
              </p>
              <span className="text-white/80 text-sm font-black uppercase tracking-widest">MAD</span>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-sm border border-white/5">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Lieu de prise en charge</p>
                  <p className="text-xs font-black text-white uppercase truncate">{booking.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc Actions & Statut */}
          <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 shadow-inner flex-grow flex flex-col">
            <p className="admin-label !text-[9px] mb-6 font-black uppercase tracking-[0.2em] opacity-50 text-center">Gestion de la rÃ©servation</p>
            
            <div className="space-y-4 mt-auto">
              {booking.status === "CONFIRMED" && (
                <button
                  onClick={() => router.push(`/admin/contracts?prefill=${booking.id}`)}
                  className="w-full flex items-center justify-between px-6 py-5 bg-white border-2 border-[var(--color-primary)] rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-[0_10px_20px_-5px_rgba(var(--color-primary-rgb),0.1)] hover:shadow-[0_15px_30px_-10px_rgba(var(--color-primary-rgb),0.3)] mb-8 group/btn hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <FilePlus size={22} className="group-hover/btn:scale-110 transition-transform duration-300" />
                    GÃ©nÃ©rer le contrat
                  </div>
                  <ChevronRightIcon size={20} />
                </button>
              )}

              <div className="flex flex-col gap-3">
                {["PENDING", "CONFIRMED", "CANCELLED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(booking.id, s)}
                    className={`flex items-center justify-between px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
                      booking.status === s
                        ? `${STATUS_STYLES[s]?.bg} ${STATUS_STYLES[s]?.text} border-2 ${STATUS_STYLES[s]?.border} shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] scale-[1.03] z-10`
                        : "bg-white border border-gray-100 text-gray-400 hover:text-[var(--color-text-main)] hover:border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full shadow-inner ${STATUS_STYLES[s]?.dot} ${booking.status === s ? 'animate-pulse' : ''}`} />
                      {STATUS_STYLES[s]?.label}
                    </div>
                    {booking.status === s && <CheckCircle size={18} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function UnavailabilityDetailsModal({
  item,
  car,
  onClose,
  onDelete,
  canEdit,
}: {
  item: Unavailability;
  car: Car;
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
}) {
  const startRaw = parseDateTime(item.startDate);
  const endRaw = parseDateTime(item.endDate);

  return (
    <ModalShell
      title={`Blocage â€¢ ${car.brand} ${car.model}`}
      subtitle={UNAVAILABILITY_LABELS[item.type] ?? item.type}
      onClose={onClose}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-inner">
          <p className="admin-label mb-3">PÃ©riode de blocage</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-orange-500 shadow-sm">
                <Calendar size={14} />
              </div>
              <p className="text-xs font-black text-[var(--color-text-main)] uppercase">
                Du {formatDateShortFR(startRaw)} Ã  {formatTime(startRaw)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-orange-500 shadow-sm">
                <Calendar size={14} />
              </div>
              <p className="text-xs font-black text-[var(--color-text-main)] uppercase">
                Au {formatDateShortFR(endRaw)} Ã  {formatTime(endRaw)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-inner">
          <p className="admin-label mb-2">Informations complÃ©mentaires</p>
          <p className="text-xs text-[var(--color-text-main)] font-bold bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-h-[80px]">
            {item.note || "Aucune note prÃ©cisÃ©e pour ce blocage."}
          </p>
        </div>
      </div>

      <div className="pt-8 flex items-center justify-end gap-4">
        <button
          onClick={onClose}
          className="admin-btn-secondary"
        >
          Fermer
        </button>
        {canEdit && (
          <button
            onClick={onDelete}
            className="admin-btn-primary !bg-red-500 hover:!bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] shadow-red-500/20"
          >
            <Trash2 size={16} />
            Supprimer le blocage
          </button>
        )}
      </div>
    </ModalShell>
  );
}

function CreateBookingModal({
  cars,
  initialCarId,
  onClose,
  onCreated,
  accessToken,
  currentRange,
}: {
  cars: Car[];
  initialCarId?: string;
  onClose: () => void;
  onCreated: () => void;
  accessToken?: string;
  currentRange: { from: string; to: string };
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const defaultStart = currentRange.from;
  const defaultEnd = formatDateISO(addDays(parseDateOnly(currentRange.from), 1));

  const [form, setForm] = useState({
    carId: initialCarId || cars[0]?.id || "",
    customerId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    startDate: defaultStart,
    startTime: "09:00",
    endDate: defaultEnd,
    endTime: "18:00",
    pickupLocation: "",
    returnLocation: "",
    dailyPrice: 0,
    status: "PENDING",
  });

  const selectedCar = useMemo(() => cars.find((c) => c.id === form.carId) ?? null, [cars, form.carId]);
  const carDisplayName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error) {
      console.error("Erreur chargement clients:", error);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    setForm(p => ({
      ...p,
      customerId: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.phone,
    }));
    toast.success("Client sÃ©lectionnÃ©");
  };

  useEffect(() => {
    if (!selectedCar) return;
    setForm((p) => {
      if (p.dailyPrice > 0) return p;
      return { ...p, dailyPrice: Math.round(selectedCar.pricePerDay) };
    });
  }, [selectedCar]);

  const chargedDays = useMemo(() => {
    if (!form.startDate || !form.endDate) return 1;
    // Combine date and time to calculate accurate duration
    const startDateTime = `${form.startDate} ${form.startTime}:00`;
    const endDateTime = `${form.endDate} ${form.endTime}:00`;
    const start = parseDateTime(startDateTime);
    const end = parseDateTime(endDateTime);
    const ms = end.getTime() - start.getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  }, [form.startDate, form.endDate, form.startTime, form.endTime]);

  const total = useMemo(() => {
    const daily = Number.isFinite(form.dailyPrice) ? form.dailyPrice : 0;
    return Math.max(0, Math.round(daily * chargedDays));
  }, [chargedDays, form.dailyPrice]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accessToken) {
      setError("Vous devez Ãªtre connectÃ©.");
      return;
    }

    if (!selectedCar) {
      setError("VÃ©hicule invalide.");
      return;
    }

    setLoading(true);
    // Combine date and time into datetime format
    const startDateTime = `${form.startDate} ${form.startTime}:00`;
    const endDateTime = `${form.endDate} ${form.endTime}:00`;
    
    const result = await createBookingAdmin({
      accessToken,
      carId: form.carId,
      customerId: form.customerId || undefined,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      startDate: startDateTime,
      endDate: endDateTime,
      pickupLocation: form.pickupLocation,
      returnLocation: form.returnLocation || undefined,
      dailyPrice: Number(form.dailyPrice),
      status: form.status,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onCreated();
      onClose();
    }, 3000);
  };

  if (submitted) {
    return (
      <ModalShell 
        title="" 
        subtitle="" 
        onClose={onClose}
      >
        <SuccessMessage
          title="RÃ©servation"
          highlightedText="CrÃ©Ã©e avec succÃ¨s !"
          message="La rÃ©servation a Ã©tÃ© enregistrÃ©e avec succÃ¨s. Elle est maintenant visible dans le planning."
          autoCloseDelay={3000}
          onClose={onClose}
        />
      </ModalShell>
    );
  }

  return (
    <ModalShell 
      title={`Nouvelle ${carDisplayName ? `RÃ©servation â€¢ ${carDisplayName}` : 'RÃ©servation'}`} 
      subtitle="Remplissez le formulaire pour crÃ©er cette rÃ©servation"
      onClose={onClose}
    >
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-black text-center uppercase tracking-tight">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6 relative z-10">
        <div className="p-5 bg-[var(--color-bg)] rounded-xl space-y-3">
          <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">SÃ©lectionner un client existant (Optionnel)</label>
          <select
            onChange={(e) => handleCustomerSelect(e.target.value)}
            className="w-full px-5 py-3.5 bg-white border border-transparent text-[var(--color-text)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-secondary)] text-sm font-bold"
            value={form.customerId}
          >
            <option value="">-- Nouveau Client --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">VÃ©hicule</label>
            <select
              value={form.carId}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  carId: e.target.value,
                  dailyPrice: cars.find((c) => c.id === e.target.value)?.pricePerDay ? Math.round(cars.find((c) => c.id === e.target.value)!.pricePerDay) : p.dailyPrice,
                }))
              }
              className="w-full px-5 py-3.5 bg-[var(--color-bg)] border border-transparent text-[var(--color-text)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-secondary)] text-sm font-bold"
              required
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full px-5 py-3.5 bg-[var(--color-bg)] border border-transparent text-[var(--color-text)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-secondary)] text-sm font-bold"
              required
            >
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">ConfirmÃ©e</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">TerminÃ©e</option>
              <option value="CANCELLED">AnnulÃ©e</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Date de dÃ©but</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Heure de dÃ©part</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Date de fin</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Heure de retour</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">PrÃ©nom</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
              placeholder="Ahmed"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Nom</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
              placeholder="Alami"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">TÃ©lÃ©phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
              placeholder="+212 676-349036"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
              placeholder="ahmed@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Lieu de prise en charge</label>
            <input
              value={form.pickupLocation}
              onChange={(e) => setForm((p) => ({ ...p, pickupLocation: e.target.value }))}
              required
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
              placeholder="Casablanca"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Lieu de retour (optionnel)</label>
            <input
              value={form.returnLocation}
              onChange={(e) => setForm((p) => ({ ...p, returnLocation: e.target.value }))}
              className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm placeholder:text-gray-400"
              placeholder="Casablanca"
            />
          </div>
        </div>

        {(form.startDate && form.endDate) && (
          <div className="p-6 bg-[var(--color-bg)] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">DurÃ©e totale</span>
              </div>
              <span className="text-sm font-black text-[var(--color-text)]">{chargedDays} Jours</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tarif appliquÃ©</span>
              </div>
              <span className="text-sm font-black text-[var(--color-text)]">{form.dailyPrice} MAD/Jour</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-[var(--color-highlight)]" />
                <span className="text-xs font-black text-[var(--color-text)] uppercase tracking-wider">Montant Total</span>
              </div>
              <span className="text-2xl font-black text-[var(--color-highlight)]">
                {total} <span className="text-xs not-italic text-gray-400">{selectedCar?.currency ?? "MAD"}</span>
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full admin-btn-active font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          Confirmer la RÃ©servation
        </button>
      </form>
    </ModalShell>
  );
}

function BlockCarModal({
  cars,
  initialCarId,
  onClose,
  onCreated,
  accessToken,
  currentRange,
}: {
  cars: Car[];
  initialCarId?: string;
  onClose: () => void;
  onCreated: () => void;
  accessToken?: string;
  currentRange: { from: string; to: string };
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    carId: initialCarId || cars[0]?.id || "",
    startDate: currentRange.from,
    endDate: currentRange.to,
    type: "MAINTENANCE" as UnavailabilityType,
    note: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accessToken) {
      setError("Vous devez Ãªtre connectÃ©.");
      return;
    }

    setLoading(true);
    const result = await createUnavailability(
      {
        carId: form.carId,
        startDate: form.startDate,
        endDate: form.endDate,
        type: form.type,
        note: form.note || undefined,
      },
      accessToken
    );

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onCreated();
      onClose();
    }, 3000);
  };

  if (submitted) {
    const typeLabels: Record<string, string> = {
      MAINTENANCE: "Maintenance",
      NETTOYAGE: "Nettoyage",
      PANNE: "Panne",
      INDISPONIBLE: "Indisponible",
    };
    const selectedCar = cars.find((c) => c.id === form.carId);
    const carName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "la voiture";
    const typeLabel = typeLabels[form.type] || form.type;

    return (
      <ModalShell 
        title="" 
        subtitle="" 
        onClose={onClose}
      >
        <SuccessMessage
          title="Voiture"
          highlightedText="BloquÃ©e avec succÃ¨s !"
          message={`${carName} est maintenant en pÃ©riode de ${typeLabel.toLowerCase()}. Le blocage est visible dans le planning.`}
          autoCloseDelay={3000}
          onClose={onClose}
        />
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Bloquer une voiture" subtitle="Maintenance, panne, nettoyage, indisponibilitÃ©â€¦" onClose={onClose}>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-black text-center uppercase tracking-tight">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label mb-2 block">Voiture</label>
            <select
              value={form.carId}
              onChange={(e) => setForm((p) => ({ ...p, carId: e.target.value }))}
              className="admin-input"
              required
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label mb-2 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as UnavailabilityType }))}
              className="admin-input"
              required
            >
              <option value="MAINTENANCE">Maintenance</option>
              <option value="NETTOYAGE">Nettoyage</option>
              <option value="PANNE">Panne</option>
              <option value="INDISPONIBLE">Indisponible</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label mb-2 block">DÃ©but</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              required
              className="admin-input [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="admin-label mb-2 block">Fin</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              required
              className="admin-input [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="admin-label mb-2 block">Note (optionnel)</label>
          <input
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            placeholder="Ex: vidange + pneus, nettoyage intÃ©rieurâ€¦"
            className="admin-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="admin-btn-primary w-full"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          Bloquer la voiture
        </button>
      </form>
    </ModalShell>
  );
}
