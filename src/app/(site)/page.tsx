"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Star,
  ShieldCheck,
  Users
} from "lucide-react";
import { getHeroImages, getReviews } from "@/lib/api";
import { getAllCars } from "@/services/carService";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSlider from "@/components/HeroSlider";
import CarCard from "@/components/CarCard";
import CarCardSkeleton from "@/components/ui/CarCardSkeleton";
import CarCarousel from "@/components/CarCarousel";
import CarouselTwo from "@/components/CarouselTwo";
import Testimonials from "@/components/Testimonials";
import LinkButton from "@/components/ui/LinkButton";
import type { HeroImage, Review } from "@/lib/api";
import type { Car } from "@/services/carService";

export default function Home() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [randomCars, setRandomCars] = useState<Car[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Début de la récupération des données...");
        
        const [carsData, heroData, reviewsDataResult] = await Promise.all([
          getAllCars(),
          getHeroImages(),
          getReviews()
        ]);
        
        console.log("📊 Données brutes reçues:");
        console.log("- Voitures:", carsData);
        console.log("- Hero images:", heroData);
        console.log("- Reviews:", reviewsDataResult);
        
        // Select all cars (no more limit to 3)
        const selectedRandomCars = carsData.length > 0 
          ? [...carsData]
              .sort(() => Math.random() - 0.5)
          : [];
        
        console.log("🎲 Voitures sélectionnées (toutes):", selectedRandomCars);
        
        setAllCars(carsData);
        setRandomCars(selectedRandomCars);
        setHeroImages(heroData);
        setReviewsData(reviewsDataResult);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen max-h-[900px] flex items-center py-20 sm:py-10 md:py-12 lg:py-16 overflow-hidden bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[200px] sm:w-[400px] md:w-[600px] h-[200px] sm:h-[400px] md:h-[600px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-[150px] sm:w-[300px] md:w-[400px] h-[150px] sm:h-[300px] md:h-[400px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-16 md:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              {/* Badge with improved styling */}
              <div className="inline-flex items-center gap-1.5 sm:gap-3 bg-white/80 backdrop-blur-xl px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10 hover:shadow-xl hover:border-[var(--color-primary)]/20 transition-all duration-500 group cursor-default whitespace-nowrap">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
                </span>
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors whitespace-nowrap">Nouveau service de location à votre disposition</span>
              </div>
              
              {/* Main headline with enhanced responsive typography */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.95] sm:leading-[0.9] md:leading-[0.85] overflow-visible">
                Libérez <br className="hidden sm:inline" />
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">votre route</span>
                  <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 4 148 6C196 8 250 4 298 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              
              {/* Enhanced description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-xl font-light leading-relaxed">
                Découvrez une <span className="font-semibold text-[var(--color-primary)]">expérience de location premium</span> avec notre sélection exclusive de véhicules de luxe et de confort.
              </p>
              
                            
              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <LinkButton
                  href="/voitures"
                  variant="primary"
                  size="lg"
                  className="shadow-2xl shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-2"
                >
                  Découvrir le parc
                </LinkButton>
              </div>
              
              {/* Trust indicators */}
              <div className="sm:flex items-center gap-1 sm:gap-2 md:gap-4 pt-2 text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wider whitespace-nowrap">
                {/* Mobile: First item centered on top */}
                <div className="flex justify-center sm:hidden mb-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <CheckCircle2 size={12} className="text-[var(--color-accent)] sm:w-4 sm:h-4" />
                    <span>Annulation gratuite</span>
                  </div>
                </div>
                
                {/* Mobile: Second and third items on same line */}
                <div className="flex sm:hidden items-center justify-center gap-1 sm:gap-1.5">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-[var(--color-accent)]" />
                    <span>Livraison aéroport</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-[var(--color-accent)]" />
                    <span>Assurance incluse</span>
                  </div>
                </div>
                
                {/* Desktop: All items in one line */}
                <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
                  <CheckCircle2 size={12} className="text-[var(--color-accent)] sm:w-4 sm:h-4" />
                  <span>Annulation gratuite</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
                  <CheckCircle2 size={12} className="text-[var(--color-accent)] sm:w-4 sm:h-4" />
                  <span>Livraison aéroport</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
                  <CheckCircle2 size={12} className="text-[var(--color-accent)] sm:w-4 sm:h-4" />
                  <span>Assurance incluse</span>
                </div>
              </div>
            </div>
                        
            {/* Enhanced hero image section */}
            <div className="relative">
              {heroImages.length > 0 ? (
                <HeroSlider images={heroImages} />
              ) : randomCars.length > 0 ? (
                <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[2rem] rotate-3 blur-xl" />
                              
                  {/* Main image container - Show first random car (fallback) */}
                  <div className="relative h-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-2 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700">
                    <Image
                      src={randomCars[0].image}
                      alt={`${randomCars[0].brand} ${randomCars[0].model}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      priority
                      quality={90}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
                                
                    {/* Car info overlay - Top Left */}
                    <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                        {randomCars[0].brand} {randomCars[0].model}
                      </h3>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-[var(--color-highlight)] mt-1 sm:mt-2">
                        À partir de {randomCars[0].pricePerDay} {randomCars[0].currency}/jour
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Placeholder when no images available */
                <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[2rem] rotate-3 blur-xl" />
                  <div className="relative h-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-2 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700 bg-[var(--color-bg)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--color-primary)] rounded-full"></div>
                      </div>
                      <p className="text-[var(--color-primary)] font-black text-lg sm:text-xl uppercase tracking-tight">Aucune image disponible</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Floating location card */}
              <div className="absolute top-2 sm:top-6 md:top-8 -right-3 sm:-right-5 md:-right-6 bg-white/90 backdrop-blur-xl p-3 sm:p-4 md:p-5 lg:p-6 rounded-[1rem] sm:rounded-[1.25rem] md:rounded-[1.5rem] shadow-2xl border border-[var(--color-primary)]/10 hover:shadow-[var(--color-primary)]/20 hover:translate-y-2 transition-all duration-500 cursor-default z-20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-[var(--color-primary)] p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl">
                    <MapPin className="text-white w-4 h-4 sm:w-5 sm:h-5" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-wider">El Aïoun Sidi Mellouk</p>
                    <p className="text-[8px] sm:text-[10px] font-bold text-gray-500">Maroc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="section-tag">Pourquoi nous choisir</span>
              <h3 className="page-header-title">
                Une expérience <span className="text-[var(--color-secondary)]">sans compromis</span>
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-4 sm:mt-6 px-2">
                Nous offrons un service exceptionnel qui dépasse vos attentes à chaque étape
              </p>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: <ShieldCheck size={48} className="sm:w-14 sm:h-14 md:w-16 md:h-16" />,
                title: "Fiabilité & Sécurité",
                desc: "7 véhicules récents de moins de 2 ans, entretenus avec rigueur pour une sécurité absolue. Livraison gratuite à l'aéroport ou à votre hôtel, assistance dédiée 24/7.",
                color: "from-blue-500 to-[var(--color-primary)]"
              },
              {
                icon: <Star size={48} className="sm:w-14 sm:h-14 md:w-16 md:h-16" />,
                title: "Prix Transparents & Satisfaction",
                desc: "Tarification claire sans frais cachés. Nos clients témoignent de la qualité de notre service.",
                color: "from-[var(--color-accent)] to-[var(--color-highlight)]"
              }
            ].map((item, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-[var(--color-bg)] p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl md:rounded-[2rem] hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--color-primary)]/20 hover:-translate-y-2 overflow-hidden">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }} />
                  
                  {/* Icon container with enhanced styling */}
                  <div className={`relative bg-gradient-to-br ${item.color} w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-2xl`}>
                    {item.icon}
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  </div>
                  
                  {/* Title with improved typography */}
                  <h4 className="relative text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-[var(--color-primary)] uppercase tracking-tight group-hover:text-[var(--color-secondary)] transition-colors">
                    {item.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="relative text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light leading-relaxed">
                    {item.desc}
                  </p>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] group-hover:w-full transition-all duration-700 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="section-tag">Notre Sélection</span>
            <h3 className="page-header-title">
              Véhicules <span className="text-[var(--color-secondary)]">Vedettes</span>
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-4 sm:mt-6 px-2">
              Découvrez notre flotte de véhicules premium soigneusement sélectionnés
            </p>
            
            {/* Voir plus button */}
            <div className="mt-6 sm:mt-8">
              <LinkButton
                href="/voitures"
                variant="outline"
                size="md"
                icon={<ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />}
                iconPosition="right"
              >
                Voir tout le parc
              </LinkButton>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(4)].map((_, index) => (
                <CarCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <CarouselTwo cars={randomCars} />
          )}
        </div>
      </section>

      <Testimonials initialTestimonials={reviewsData} />

      {/* Location / Map Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-white via-[var(--color-bg)] to-white">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10 mb-4 sm:mb-6">
              <MapPin size={14} className="text-[var(--color-primary)] sm:w-4 sm:h-4" />
              <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[var(--color-primary)]">Notre Emplacement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter px-2">
              Venez Nous <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Rendre Visite</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light mt-4 max-w-2xl mx-auto px-2">
              Nos bureaux sont situés en plein cœur d'El Aïoun Sidi Mellouk, facilement accessibles pour votre commodité
            </p>
          </div>

          {/* Map Container */}
          <div className="relative group max-w-6xl mx-auto">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] rotate-1 blur-xl" />
            
            {/* Map wrapper */}
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 group-hover:shadow-[var(--color-primary)]/20 transition-shadow duration-500">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.9412096776846!2d-2.5063597999999994!3d34.5803541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd77f9c58daebc7f%3A0x60704923cf279dfc!2sMoha%20Drive!5e0!3m2!1sfr!2sma!4v1777640069856!5m2!1sfr!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Notre localisation sur Google Maps"
              ></iframe>
              
              {/* Overlay gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              
                          </div>
          </div>

          {/* Quick Info Cards */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
            {[
              {
                icon: <MapPin size={20} className="sm:w-6 sm:h-6" />,
                title: "Adresse",
                text: "Boulevard Mohamed VI, El Aïoun Sidi Mellouk"
              },
              {
                icon: <Phone size={20} className="sm:w-6 sm:h-6" />,
                title: "Téléphone",
                text: "+212 676-349036"
              },
              {
                icon: <Clock size={20} className="sm:w-6 sm:h-6" />,
                title: "Horaires",
                text: "Lun - Sam: 9h00 - 19h00"
              }
            ].map((info, index) => (
              <div key={index} className="group/item bg-white/80 backdrop-blur-xl border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-2 sm:p-3 rounded-lg sm:rounded-xl text-white shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-wider text-[10px] sm:text-xs mb-1 text-[var(--color-primary)]">{info.title}</p>
                    <p className="text-xs sm:text-sm font-light text-[var(--color-text-muted)]">{info.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--color-highlight)]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 h-24 sm:w-32 sm:h-32 border-4 border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-36 h-36 sm:w-48 sm:h-48 border-4 border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="container-custom relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
              {/* Enhanced headline */}
              <div className="space-y-4 sm:space-y-6">
                <span className="inline-block text-[var(--color-highlight)] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Rejoignez-nous</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white uppercase tracking-tight sm:tracking-tighter leading-[1.1] sm:leading-tight px-2 sm:px-0 overflow-visible">
                  Prêt pour votre <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">prochaine aventure ?</span>
                </h2>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 font-light max-w-2xl mx-auto leading-relaxed px-2">
                Réservez votre véhicule idéal en quelques clics et profitez du <span className="font-semibold text-white">meilleur service de location au Maroc</span>.
              </p>
              
              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-8">
                <LinkButton
                  href="/voitures"
                  variant="primary"
                  size="lg"
                  className="shadow-2xl hover:shadow-[var(--color-highlight)]/50 hover:-translate-y-2"
                >
                  Réserver une voiture
                </LinkButton>
              </div>
              
              {/* Additional trust badges */}
              <div className="sm:flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 text-white/90 text-xs sm:text-sm font-bold uppercase tracking-wider">
                {/* Mobile: First item centered on top */}
                <div className="flex justify-center sm:hidden mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors cursor-default">
                    <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
                    <span>Paiement sécurisé</span>
                  </div>
                </div>
                
                {/* Mobile: Second and third items on same line */}
                <div className="flex sm:hidden items-center justify-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                    <Clock size={14} />
                    <span>Support 24/7</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                    <Star size={14} fill="currentColor" />
                    <span>Meilleure qualité</span>
                  </div>
                </div>
                
                {/* Desktop: All items in one line */}
                <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors cursor-default">
                  <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors cursor-default">
                  <Clock size={14} className="sm:w-4 sm:h-4" />
                  <span>Support 24/7</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 hover:text-white transition-colors cursor-default">
                  <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
                  <span>Meilleure qualité</span>
                </div>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}
