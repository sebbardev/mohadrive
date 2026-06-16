"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, Check, Star, ArrowLeft, ShieldCheck, Clock, Car as CarIcon, Calendar, Tag, Banknote } from "lucide-react";
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
  const [activeThumb, setActiveThumb] = useState(0);

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
      <section className="relative pt-40 pb-32 overflow-hidden bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 text-sm relative animate-fade-in-up">
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
          <div className="grid grid-cols-12 gap-12 items-start">
            {/* Left Column: Media & Details - 7 columns on xl */}
            <div className="col-span-7 space-y-8">
              {/* Title section */}
              <div className="space-y-4">
                <span className="section-tag">{car.category}</span>
                <h1 className="text-7xl font-black text-[var(--color-primary)] uppercase tracking-tighter leading-[0.85] overflow-visible">
                  {car.brand} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">{car.model}</span>
                </h1>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Modèle {car.year}</p>
                </div>
              </div>

              {/* Main image */}
              <div 
                className="relative h-[560px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl border-2 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700 cursor-pointer"
                onClick={() => openLightbox(activeThumb)}
              >
                <Image
                  src={allImages[activeThumb] || car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 65vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 via-transparent to-transparent" />
                {/* Counter badge */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold">
                  {activeThumb + 1} / {allImages.length}
                </div>
                {/* Click indicator */}
                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                  <span>⛶</span> Agrandir
                </div>
              </div>
              
              {/* Scrollable thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveThumb(idx)}
                      className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        activeThumb === idx
                          ? 'border-[var(--color-primary)] scale-105 shadow-lg shadow-[var(--color-primary)]/20'
                          : 'border-transparent opacity-60 hover:opacity-90 hover:border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${car.name} ${idx + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                        loading="lazy"
                        quality={70}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Information & Actions - 5 columns on xl, sticky */}
            <div className="col-span-5 space-y-8 sticky top-24">
              {/* Price & Primary Action */}
              <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:border-[var(--color-primary)]/20 transition-all duration-500">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[80px] opacity-10" />
                
                <div className="relative z-10 mb-6">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Tarif Journalier</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-black text-[var(--color-primary)] tracking-tighter">{car.pricePerDay}</span>
                    <span className="text-sm font-black text-[var(--color-secondary)] uppercase tracking-widest">{car.currency}/jour</span>
                  </div>
                  {car.deposit > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
                      <Banknote size={14} className="text-amber-600 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">Caution / Dépôt</p>
                        <p className="text-sm font-black text-amber-700">{car.deposit} {car.currency}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reservation Button */}
                <BookingFormModal car={car} />

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
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
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-lg hover:shadow-xl transition-all duration-500">
                <h3 className="text-xs font-black text-[var(--color-primary)] mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                  Description
                </h3>
                <p className="text-[var(--color-text-muted)] text-lg leading-relaxed font-light">
                  {car.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-lg hover:shadow-xl transition-all duration-500">
                <h3 className="text-xs font-black text-[var(--color-primary)] mb-5 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                  Spécifications
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Marque", value: car.brand, icon: <CarIcon size={14} />, color: "bg-blue-50 text-blue-600" },
                    { label: "Modèle", value: car.model, icon: <Tag size={14} />, color: "bg-purple-50 text-purple-600" },
                    { label: "Année", value: String(car.year), icon: <Calendar size={14} />, color: "bg-amber-50 text-amber-600" },
                    { label: "Transmission", value: car.transmission, icon: <Gauge size={14} />, color: "bg-green-50 text-green-600" },
                    { label: "Carburant", value: car.fuel, icon: <Fuel size={14} />, color: "bg-orange-50 text-orange-600" },
                    { label: "Catégorie", value: car.category, icon: <Star size={14} />, color: "bg-pink-50 text-pink-600" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-bg)] rounded-xl hover:bg-white transition-colors duration-200 border border-transparent hover:border-gray-100">
                      <div className={`p-2 rounded-lg shrink-0 ${spec.color}`}>
                        {spec.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</p>
                        <p className="text-xs font-bold text-[var(--color-primary)] truncate">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features/Equipment */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-lg hover:shadow-xl transition-all duration-500">
                <h3 className="text-xs font-black text-[var(--color-primary)] mb-5 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
                  Équipements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[var(--color-primary)]/10 transition-colors">
                      <Check size={10} className="text-[var(--color-accent)] shrink-0" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
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
                <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-tight overflow-visible">
                  Réservez <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">maintenant</span>
                </h2>
              </div>
              
              <p className="text-xl text-blue-100 font-light max-w-xl mx-auto leading-relaxed">
                Profitez de ce véhicule premium et vivez une <span className="font-semibold text-white">expérience de conduite exceptionnelle</span>.
              </p>
              
              {/* Enhanced CTA buttons */}
              <div className="flex flex-row gap-6 justify-center pt-6">
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
              <div className="flex flex-wrap justify-center gap-8 pt-8 text-white/90 text-sm font-bold uppercase tracking-wider">
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
