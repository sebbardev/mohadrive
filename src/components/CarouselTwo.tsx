"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Car } from "@/services/carService";

interface CarouselTwoProps {
  cars: Car[];
}

export default function CarouselTwo({ cars }: CarouselTwoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculer combien de paires de voitures nous pouvons afficher
  const pairsCount = Math.ceil(cars.length / 2);

  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pairsCount) % pairsCount);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pairsCount);
  };

  // Obtenir les deux voitures à afficher pour l'index actuel
  const getCurrentPair = () => {
    const firstCar = cars[currentIndex * 2];
    const secondCar = cars[currentIndex * 2 + 1];
    return [firstCar, secondCar].filter(Boolean); // Filtrer les valeurs undefined
  };

  if (cars.length === 0) return null;

  const currentPair = getCurrentPair();

  return (
    <div className="relative group">
      {/* Navigation Buttons - style identique aux avis */}
      {pairsCount > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--color-primary)] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-20 hover:scale-110"
            aria-label="Voitures précédentes"
          >
            <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--color-primary)] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-20 hover:scale-110"
            aria-label="Voitures suivantes"
          >
            <ChevronRight size={20} className="sm:w-7 sm:h-7" />
          </button>
        </>
      )}

      <div className="overflow-hidden mx-2 sm:mx-4 lg:mx-8">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Créer des slides pour chaque paire de voitures */}
          {Array.from({ length: pairsCount }).map((_, pairIndex) => {
            const pairStartIndex = pairIndex * 2;
            const firstCar = cars[pairStartIndex];
            const secondCar = cars[pairStartIndex + 1];
            
            return (
              <div key={pairIndex} className="w-full flex-shrink-0 px-2 sm:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {firstCar && (
                    <div className="group/car hover:-translate-y-3 transition-all duration-500 transform">
                      <div className="relative">
                        <CarCard car={firstCar} />
                        {/* Effet de brillance au hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/5 via-transparent to-transparent rounded-2xl opacity-0 group/car:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    </div>
                  )}
                  {secondCar && (
                    <div className="group/car hover:-translate-y-3 transition-all duration-500 transform">
                      <div className="relative">
                        <CarCard car={secondCar} />
                        {/* Effet de brillance au hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/5 via-transparent to-transparent rounded-2xl opacity-0 group/car:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    </div>
                  )}
                  {/* Si seulement une voiture dans cette paire, ajouter un espace vide pour maintenir la grille */}
                  {firstCar && !secondCar && (
                    <div className="hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator - amélioré */}
      {pairsCount > 1 && (
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: pairsCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[var(--color-primary)] w-8 shadow-lg shadow-[var(--color-primary)]/30"
                  : "bg-gray-300 hover:bg-gray-400 w-2"
              }`}
              aria-label={`Aller à la paire ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
