"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { Car } from "@/services/carService";
import { Fuel, Gauge, Users, Check, ArrowRight, Calendar, Tag } from "lucide-react";
import LinkButton from "@/components/ui/LinkButton";

interface CarCardProps {
  car: Car;
}

// OPTIMIZED: Wrap with memo to prevent unnecessary re-renders
const CarCard = memo(function CarCard({ car }: CarCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full relative">
      {/* Subtle gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-[var(--color-primary)]/20 transition-all duration-500 pointer-events-none z-10" />

      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-gray-200" />
          </div>
        )}

        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-gray-400 text-sm">Image non disponible</p>
            </div>
          </div>
        )}

        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="33vw"
          className={`object-cover transition-all duration-700 ${
            imageLoaded ? 'group-hover:scale-105 opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          quality={85}
          priority={false}
          onLoad={handleImageLoad}
          onError={handleImageError}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
        />

        {/* Dark gradient at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top-right: Price badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl shadow-lg flex items-baseline gap-1">
            <span className="font-black text-lg leading-none">{car.pricePerDay}</span>
            <span className="text-[10px] font-semibold uppercase opacity-80">{car.currency}/j</span>
          </div>
        </div>

        {/* Top-left: Availability dot */}
        {car.available && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">Disponible</span>
          </div>
        )}

        {/* Bottom: Car name over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-black text-xl uppercase tracking-tight leading-tight drop-shadow-md">
            {car.brand} <span className="font-light opacity-90">{car.model}</span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
              {car.category}
            </span>
            <span className="flex items-center gap-1 text-white/80 text-[10px] font-semibold">
              <Calendar size={10} />
              {car.year}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Specs row */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {[
            { icon: <Fuel size={11} className="text-[var(--color-primary)]" />, value: car.fuel },
            { icon: <Gauge size={11} className="text-[var(--color-primary)]" />, value: car.transmission },
            { icon: <Calendar size={11} className="text-[var(--color-primary)]" />, value: String(car.year) },
            { icon: <Tag size={11} className="text-[var(--color-primary)]" />, value: car.category },
          ].map((spec, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-2 bg-[var(--color-bg)] rounded-lg">
              <div className="p-1 bg-[var(--color-primary)]/10 rounded-md shrink-0">
                {spec.icon}
              </div>
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide truncate">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Features preview */}
        {car.features && car.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {car.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-text-muted)] bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                <Check size={9} className="text-[var(--color-accent)] shrink-0" />
                {feature}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-2 py-1 rounded-full">
                +{car.features.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <LinkButton
            href={`/voitures/${car.id}`}
            variant="primary"
            size="lg"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            className="w-full"
          >
            Voir & Réserver
          </LinkButton>
        </div>
      </div>
    </div>
  );
});

export default CarCard;
