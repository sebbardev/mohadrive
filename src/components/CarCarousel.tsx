"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Car } from "@/services/carService";

interface CarCarouselProps {
  cars: Car[];
}

export default function CarCarousel({ cars }: CarCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (cars.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cars.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cars.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + cars.length) % cars.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cars.length);
  };

  if (cars.length === 0) return null;

  return (
    <div className="relative">
      {/* Mobile Carousel */}
      <div className="sm:hidden relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {cars.map((car) => (
              <div key={car.id} className="w-full flex-shrink-0 px-2">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {cars.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--color-primary)] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              aria-label="Voiture précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--color-primary)] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              aria-label="Voiture suivante"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[var(--color-primary)] w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Aller à la voiture ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Grid (unchanged) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {cars.map((car) => (
          <div key={car.id} className="group/card hover:-translate-y-2 transition-all duration-500">
            <CarCard car={car} />
          </div>
        ))}
      </div>
    </div>
  );
}
