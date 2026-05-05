"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, Users, Briefcase, Check, Star, ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import BookingFormModal from "@/components/booking/BookingFormModal";
import LinkButton from "@/components/ui/LinkButton";
import ImageLightbox from "@/components/ImageLightbox";
import { Car } from "@/services/carService";

interface CarDetailPageProps {
  car: Car;
}

export default function CarDetailPage({ car }: CarDetailPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Combiner l'image principale avec les images supplémentaires
  const allImages = car.image ? [car.image, ...(car.images || [])] : (car.images || []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-24 lg:pb-32 overflow-hidden bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-xs sm:text-sm relative animate-fade-in-up">
            <Link 
              href="/voitures" 
              className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-300 font-bold hover:gap-3"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Notre Flotte</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">{car.brand} {car.model}</span>
          </div>

          {/* Main Grid Layout - Desktop: 3/5 + 2/5 */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Left Column: Media & Details - 7 columns on xl */}
            <div className="xl:col-span-7 space-y-6 lg:space-y-8">
              {/* Title section */}
              <div className="space-y-4">
                <span className="section-tag">{car.category}</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.95] sm:leading-[0.9] md:leading-[0.85] overflow-visible">
                  {car.brand} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">{car.model}</span>
                </h1>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Modèle {car.year}</p>
                </div>
              </div>

              {/* Main image */}
              <div 
                className="relative h-[350px] sm:h-[450px] lg:h-[500px] xl:h-[600px] w-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-2xl border-2 lg:border-4 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700 cursor-pointer"
                onClick={() => openLightbox(0)}
              >
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 65vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 via-transparent to-transparent" />
                {/* Click indicator */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Cliquer pour agrandir
                </div>
              </div>
              
              {/* Thumbnail gallery */}
              {car.images && car.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                  {car.images.map((img: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="relative h-24 sm:h-28 lg:h-32 bg-white rounded-xl lg:rounded-2xl overflow-hidden border-2 border-white shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                      onClick={() => openLightbox(idx + 1)} // +1 parce que l'image principale est à l'index 0
                    >
                      <Image 
                        src={img} 
                        alt={`${car.name} ${idx + 1}`} 
                        fill 
                        sizes="(max-width: 768px) 25vw, 150px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        quality={75}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Information & Actions - 5 columns on xl, sticky */}
            <div className="xl:col-span-5 space-y-6 lg:space-y-8 xl:sticky xl:top-24">
              {/* Price & Primary Action */}
              <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 lg:p-8 xl:p-10 rounded-[2rem] lg:rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:border-[var(--color-primary)]/20 transition-all duration-500">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[80px] opacity-10" />
                
                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Tarif Journalier</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl md:text-7xl font-black text-[var(--color-primary)] tracking-tighter">{car.pricePerDay}</span>
                      <span className="text-xs sm:text-sm font-black text-[var(--color-secondary)] uppercase tracking-widest">{car.currency}/jour</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Button */}
                <BookingFormModal car={car} />

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[var(--color-accent)]" />
                    <span>Assurance incluse</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <Clock size={14} className="text-[var(--color-accent)]" />
                    <span>Support 24/7</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-lg hover:shadow-xl transition-all duration-500">
                <h3 className="text-xs font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                  Description
                </h3>
                <p className="text-[var(--color-text-muted)] text-base sm:text-lg leading-relaxed font-light">
                  {car.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-lg hover:shadow-xl transition-all duration-500">
                <h3 className="text-xs font-black text-[var(--color-primary)] mb-6 lg:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                  Spécifications
                </h3>
                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  {[
                    { label: "Marque", value: car.brand },
                    { label: "Modèle", value: car.model },
                    { label: "Année", value: car.year },
                    { label: "Transmission", value: car.transmission },
                    { label: "Carburant", value: car.fuel },
                    { label: "Catégorie", value: car.category }
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col border-b border-gray-100 pb-3 group hover:border-[var(--color-highlight)]/30 transition-colors">
                      <span className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">{spec.label}</span>
                      <span className="text-xs sm:text-sm text-[var(--color-primary)] font-bold uppercase tracking-tight group-hover:text-[var(--color-secondary)] transition-colors">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features/Equipment */}
              <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-lg hover:shadow-xl transition-all duration-500">
                <h3 className="text-xs font-black text-[var(--color-primary)] mb-6 lg:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                  Équipements
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-3">
                  {car.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)] font-medium">
                      <span className="text-[var(--color-primary)] font-bold">–</span>
                      <span className="capitalize">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--color-highlight)]/20 via-transparent to-transparent" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="container-custom relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Enhanced headline */}
              <div className="space-y-4">
                <span className="inline-block text-[var(--color-highlight)] text-xs font-black uppercase tracking-[0.3em]">Intéressé par ce véhicule ?</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight sm:tracking-tighter leading-[1.1] sm:leading-tight px-3 sm:px-2 md:px-0 overflow-visible">
                  Réservez <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">maintenant</span>
                </h2>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light max-w-xl mx-auto leading-relaxed">
                Profitez de ce véhicule premium et vivez une <span className="font-semibold text-white">expérience de conduite exceptionnelle</span>.
              </p>
              
              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-6">
                <LinkButton
                  href="/voitures"
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-xl text-white border-2 border-white/30 hover:bg-white hover:text-[var(--color-primary)] hover:border-white"
                >
                  Voir d'autres véhicules
                </LinkButton>
              </div>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 text-white/90 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                  <ShieldCheck size={14} />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                  <Clock size={14} />
                  <span>Support 24/7</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                  <Star size={14} fill="currentColor" />
                  <span>Meilleure qualité</span>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </div>
  );
}
