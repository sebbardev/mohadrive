"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 3;

interface Car {
  id: string;
  brand: string;
  model: string;
  color?: string;
  price_per_day: number;
  image?: string;
  images?: string[];
}

interface CarSelectorProps {
  cars: Car[];
  selectedCarId: string;
  onSelect: (carId: string) => void;
  error?: boolean;
}

export default function CarSelector({ cars, selectedCarId, onSelect, error }: CarSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(cars.length / PAGE_SIZE);
  const visibleCars = cars.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-12 h-12 bg-gray-300 rounded mb-4" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Aucun véhicule disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
      {visibleCars.map((car) => {
        const isSelected = selectedCarId === car.id;
        const isHovered = hoveredId === car.id;
        const carImage = car.image || (car.images && car.images[0]) || "";

        return (
          <motion.div
            key={car.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredId(car.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect(car.id)}
            className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
              isSelected
                ? "border-[var(--color-secondary)] shadow-xl shadow-green-500/20"
                : error
                ? "border-red-300 hover:border-red-400"
                : isHovered
                ? "border-gray-300 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {carImage ? (
                <img
                  src={carImage}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 bg-gray-400 rounded" />
                </div>
              )}

              {/* Selection Badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check size={18} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Price Badge */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                  <p className="text-xs font-black text-[var(--color-primary)]">
                    {car.price_per_day.toLocaleString()} MAD
                  </p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    par jour
                  </p>
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="p-4 bg-white">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-1">
                {car.brand} {car.model}
              </h3>
              {car.color && (
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {car.color}
                </p>
              )}
            </div>

            {/* Selection Overlay */}
            {isSelected && (
              <motion.div
                layoutId="selection-border"
                className="absolute inset-0 border-4 border-[var(--color-secondary)] rounded-2xl pointer-events-none"
              />
            )}
          </motion.div>
        );
      })}
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <ChevronLeft size={15} />
            Précédent
          </button>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Suivant
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
