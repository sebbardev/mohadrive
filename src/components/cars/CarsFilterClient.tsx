"use client";

import { useState, useMemo, useCallback } from "react";
import CarCard from "@/components/CarCard";
import { Car } from "@/services/carService";
import { Filter, X } from "lucide-react";

interface CarsFilterClientProps {
  cars: Car[];
}

export default function CarsFilterClient({ cars }: CarsFilterClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    transmission: "All",
    fuel: "All",
    priceRange: [0, 5000],
  });

  // OPTIMIZED: Memoize derived data
  const categories = useMemo(() => ["All", ...Array.from(new Set(cars.map((c) => c.category)))], [cars]);
  const transmissions = useMemo(() => ["All", ...Array.from(new Set(cars.map((c) => c.transmission)))], [cars]);
  const fuels = useMemo(() => ["All", ...Array.from(new Set(cars.map((c) => c.fuel)))], [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchCategory = filters.category === "All" || car.category === filters.category;
      const matchTransmission = filters.transmission === "All" || car.transmission === filters.transmission;
      const matchFuel = filters.fuel === "All" || car.fuel === filters.fuel;
      const matchPrice = car.pricePerDay >= filters.priceRange[0] && car.pricePerDay <= filters.priceRange[1];
      return matchCategory && matchTransmission && matchFuel && matchPrice;
    });
  }, [filters, cars]);

  // OPTIMIZED: Use useCallback for event handlers
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  
  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters({ category: "All", transmission: "All", fuel: "All", priceRange: [0, 5000] });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
      {/* Mobile Filter Button */}
      <button
        className="lg:hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
        onClick={toggleFilter}
      >
        <Filter size={18} />
        Filtres
      </button>

      {/* Sidebar Filters */}
      <div className={`lg:w-1/4 bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-lg h-fit ${isFilterOpen ? "block" : "hidden lg:block"}`}>
        <div className="flex justify-between items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100">
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">Filtres</h2>
          <button 
            className="text-[9px] sm:text-[10px] text-gray-400 hover:text-[var(--color-primary)] uppercase tracking-widest font-black transition-colors flex items-center gap-2"
            onClick={resetFilters}
          >
            <X size={12} />
            Reset
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8">
          <h3 className="font-black mb-3 sm:mb-4 text-[var(--color-primary)] text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">Catégorie</h3>
          <div className="space-y-2 sm:space-y-3">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-2 sm:p-3 rounded-xl hover:bg-[var(--color-bg)] transition-all">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${filters.category === cat ? "border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" : "border-gray-200 group-hover:border-[var(--color-primary)]"}`}>
                  {filters.category === cat && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-md" />}
                </div>
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => handleFilterChange("category", cat)}
                  className="hidden"
                />
                <span className={`text-xs sm:text-sm transition-all ${filters.category === cat ? "text-[var(--color-primary)] font-black" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"}`}>
                  {cat === "All" ? "Toutes" : cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission Filter */}
        <div className="mb-6 sm:mb-8">
          <h3 className="font-black mb-3 sm:mb-4 text-[var(--color-primary)] text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">Transmission</h3>
          <div className="space-y-2 sm:space-y-3">
            {transmissions.map((trans) => (
              <label key={trans} className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-2 sm:p-3 rounded-xl hover:bg-[var(--color-bg)] transition-all">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${filters.transmission === trans ? "border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" : "border-gray-200 group-hover:border-[var(--color-primary)]"}`}>
                  {filters.transmission === trans && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-md" />}
                </div>
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === trans}
                  onChange={() => handleFilterChange("transmission", trans)}
                  className="hidden"
                />
                <span className={`text-xs sm:text-sm transition-all ${filters.transmission === trans ? "text-[var(--color-primary)] font-black" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"}`}>
                  {trans === "All" ? "Toutes" : trans}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Filter */}
        <div className="mb-4 sm:mb-6">
          <h3 className="font-black mb-3 sm:mb-4 text-[var(--color-primary)] text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">Carburant</h3>
          <div className="space-y-2 sm:space-y-3">
            {fuels.map((fuel) => (
              <label key={fuel} className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-2 sm:p-3 rounded-xl hover:bg-[var(--color-bg)] transition-all">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${filters.fuel === fuel ? "border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" : "border-gray-200 group-hover:border-[var(--color-primary)]"}`}>
                  {filters.fuel === fuel && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-md" />}
                </div>
                <input
                  type="radio"
                  name="fuel"
                  checked={filters.fuel === fuel}
                  onChange={() => handleFilterChange("fuel", fuel)}
                  className="hidden"
                />
                <span className={`text-xs sm:text-sm transition-all ${filters.fuel === fuel ? "text-[var(--color-primary)] font-black" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"}`}>
                  {fuel === "All" ? "Tous" : fuel}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="lg:w-3/4">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-[var(--color-text-muted)] font-light">
            <span className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">{filteredCars.length}</span>
            <span className="text-xs sm:text-sm uppercase tracking-wider">véhicule{filteredCars.length > 1 ? "s" : ""} trouvé{filteredCars.length > 1 ? "s" : ""}</span>
          </div>
        </div>
        
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredCars.map((car) => (
              <div key={car.id} className="group/card hover:-translate-y-2 transition-all duration-500">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white border border-gray-100 rounded-[2.5rem] shadow-lg px-4">
            <div className="bg-[var(--color-bg)] w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Filter size={32} className="text-[var(--color-primary)]" />
            </div>
            <p className="text-base sm:text-xl text-[var(--color-text-muted)] mb-6 sm:mb-8 font-light px-2">Aucun véhicule ne correspond à vos critères.</p>
            <button 
              onClick={() => setFilters({ category: "All", transmission: "All", fuel: "All", priceRange: [0, 5000] })}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] text-white font-black rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 uppercase tracking-widest text-[10px] sm:text-xs shadow-xl"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
