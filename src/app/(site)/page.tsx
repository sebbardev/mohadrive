"use client";

export const dynamic = 'force-dynamic';

// Fixed duplicate Car identifier issue

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
  Users,
  Car as CarIcon,
  Headphones,
  PlaneTakeoff,
  Search,
  CalendarCheck,
  KeyRound
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
        const [carsData, heroData, reviewsDataResult] = await Promise.all([
          getAllCars(),
          getHeroImages(),
          getReviews()
        ]);
        
        const selectedRandomCars = carsData.length > 0 
          ? [...carsData].sort(() => Math.random() - 0.5)
          : [];
        
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
      <section className="relative min-h-screen max-h-[900px] flex items-center py-16 overflow-hidden bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="container-custom relative z-10 px-8 pt-12">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Badge with improved styling */}
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10 hover:shadow-xl hover:border-[var(--color-primary)]/20 transition-all duration-500 group cursor-default whitespace-nowrap">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
                </span>
                <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors whitespace-nowrap">Nouveau service de location à votre disposition</span>
              </div>
              
              {/* Main headline with enhanced responsive typography */}
              <h1 className="text-7xl font-black text-[var(--color-primary)] uppercase tracking-tighter leading-[0.85] overflow-visible">
                Libérez <br className="hidden sm:inline" />
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">votre route</span>
                  <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 4 148 6C196 8 250 4 298 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              
              {/* Enhanced description */}
              <p className="text-xl text-[var(--color-text-muted)] max-w-xl font-light leading-relaxed">
                Découvrez une <span className="font-semibold text-[var(--color-primary)]">expérience de location premium</span> avec notre sélection exclusive de véhicules de luxe et de confort.
              </p>
              
                            
              {/* Enhanced CTA buttons */}
              <div className="flex flex-row gap-4 pt-2">
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
              <div className="flex items-center gap-4 pt-2 text-sm text-gray-600 font-bold uppercase tracking-wider whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                  <span>Annulation gratuite</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                  <span>Livraison aéroport</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                  <span>Assurance incluse</span>
                </div>
              </div>
            </div>
                        
            {/* Enhanced hero image section */}
            <div className="relative">
              {heroImages.length > 0 ? (
                <HeroSlider images={heroImages} />
              ) : randomCars.length > 0 ? (
                <div className="relative h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[2rem] rotate-3 blur-xl" />
                  <div className="relative h-full overflow-hidden rounded-[2.5rem] shadow-2xl border-2 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700">
                    <Image
                      src={randomCars[0].image}
                      alt={`${randomCars[0].brand} ${randomCars[0].model}`}
                      fill
                      sizes="600px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      priority
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                        {randomCars[0].brand} {randomCars[0].model}
                      </h3>
                      <p className="text-xl font-bold text-[var(--color-highlight)] mt-2">
                        À partir de {randomCars[0].pricePerDay} {randomCars[0].currency}/jour
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Placeholder when no images available */
                <div className="relative h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[2rem] rotate-3 blur-xl" />
                  <div className="relative h-full overflow-hidden rounded-[2.5rem] shadow-2xl border-2 border-white/50 group hover:shadow-[var(--color-primary)]/20 transition-all duration-700 bg-[var(--color-bg)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full"></div>
                      </div>
                      <p className="text-[var(--color-primary)] font-black text-xl uppercase tracking-tight">Aucune image disponible</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Floating location card */}
              <div className="absolute top-8 -right-6 bg-white/90 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-2xl border border-[var(--color-primary)]/10 hover:shadow-[var(--color-primary)]/20 hover:translate-y-2 transition-all duration-500 cursor-default z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--color-primary)] p-3 rounded-xl">
                    <MapPin className="text-white w-5 h-5" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider">El Aïoun Sidi Mellouk</p>
                    <p className="text-[10px] font-bold text-gray-500">Maroc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="container-custom px-8">
          <div className="grid grid-cols-4 gap-6">
            {[
              { value: "7", label: "Véhicules disponibles", icon: <CarIcon size={24} />, color: "from-blue-500 to-[var(--color-primary)]" },
              { value: "5", label: "Marques différentes", icon: <Star size={24} />, color: "from-[var(--color-highlight)] to-[var(--color-accent)]" },
              { value: "100%", label: "Clients satisfaits", icon: <Users size={24} />, color: "from-[var(--color-accent)] to-[var(--color-highlight)]" },
              { value: "6j/7", label: "Service disponible", icon: <Headphones size={24} />, color: "from-[var(--color-secondary)] to-blue-600" },
            ].map((stat, i) => (
              <div key={i} className="group flex items-center gap-5 bg-[var(--color-bg)] hover:bg-white border border-transparent hover:border-[var(--color-primary)]/10 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-4xl font-black text-[var(--color-primary)] leading-none group-hover:text-[var(--color-secondary)] transition-colors duration-300">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10 px-8">
          <div className="text-center mb-20">
            <span className="section-tag">Pourquoi nous choisir</span>
              <h3 className="page-header-title">
                Une expérience <span className="text-[var(--color-secondary)]">sans compromis</span>
              </h3>
              <p className="text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-6">
                Nous offrons un service exceptionnel qui dépasse vos attentes à chaque étape
              </p>
            </div>
          
          <div className="grid grid-cols-2 gap-10">
            {[
              {
                icon: <ShieldCheck size={40} />,
                title: "Fiabilité & Sécurité",
                desc: "7 véhicules récents de moins de 2 ans, entretenus avec rigueur pour une sécurité absolue à chaque trajet.",
                color: "from-blue-500 to-[var(--color-primary)]",
                perks: ["Véhicules < 2 ans", "Contrôle technique à jour", "Assurance tous risques"]
              },
              {
                icon: <Star size={40} />,
                title: "Prix Transparents",
                desc: "Tarification claire sans frais cachés. Le prix affiché est le prix payé, assurance et kilométrage inclus.",
                color: "from-[var(--color-accent)] to-[var(--color-highlight)]",
                perks: ["Aucun frais caché", "Kilométrage illimité", "Assurance incluse"]
              },
              {
                icon: <PlaneTakeoff size={40} />,
                title: "Livraison Aéroport",
                desc: "Nous livrons votre véhicule directement à l'aéroport d'Oujda Angad, à votre hôtel ou à l'adresse de votre choix.",
                color: "from-[var(--color-secondary)] to-blue-600",
                perks: ["Aéroport d'Oujda", "Hôtel ou résidence", "Sans frais supplémentaires"]
              },
              {
                icon: <Headphones size={40} />,
                title: "Assistance Dédiée",
                desc: "Notre équipe est disponible 6 jours sur 7 pour répondre à vos questions et vous assister à tout moment.",
                color: "from-[var(--color-highlight)] to-[var(--color-accent)]",
                perks: ["Disponible 6j/7", "Réponse rapide", "Support WhatsApp"]
              }
            ].map((item, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-[var(--color-bg)] p-10 rounded-[2rem] hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--color-primary)]/20 hover:-translate-y-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/0 to-[var(--color-secondary)]/0 group-hover:from-[var(--color-primary)]/3 group-hover:to-[var(--color-secondary)]/5 transition-all duration-500" />
                <div className={`relative bg-gradient-to-br ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {item.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                </div>
                <h4 className="relative text-2xl font-black mb-3 text-[var(--color-primary)] uppercase tracking-tight group-hover:text-[var(--color-secondary)] transition-colors">
                  {item.title}
                </h4>
                <p className="relative text-[var(--color-text-muted)] font-light leading-relaxed mb-5">{item.desc}</p>
                <div className="relative space-y-2">
                  {item.perks.map((perk, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                      <CheckCircle2 size={13} className="text-[var(--color-accent)] shrink-0" />
                      {perk}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] group-hover:w-full transition-all duration-700 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10 px-8">
          <div className="text-center mb-20">
            <span className="section-tag">Notre Sélection</span>
            <h3 className="page-header-title">
              Véhicules <span className="text-[var(--color-secondary)]">Vedettes</span>
            </h3>
            <p className="text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-6">
              Découvrez notre flotte de véhicules premium soigneusement sélectionnés
            </p>
            
            <div className="mt-8">
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
            <div className="grid grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <CarCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <CarouselTwo cars={randomCars} />
          )}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-white">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="container-custom px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="section-tag">Simple & Rapide</span>
            <h3 className="page-header-title">
              Comment ça <span className="text-[var(--color-secondary)]">marche ?</span>
            </h3>
            <p className="text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-6">
              Louez votre voiture en 3 étapes simples, sans paperasse inutile
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-[var(--color-primary)]/30 via-[var(--color-highlight)]/50 to-[var(--color-primary)]/30" />

            <div className="grid grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  icon: <Search size={32} />,
                  title: "Choisissez votre voiture",
                  desc: "Parcourez notre flotte de 7 véhicules, filtrez par catégorie, transmission ou budget et trouvez le véhicule parfait pour votre voyage.",
                  color: "from-blue-500 to-[var(--color-primary)]",
                  href: "/voitures"
                },
                {
                  step: "02",
                  icon: <CalendarCheck size={32} />,
                  title: "Réservez en ligne",
                  desc: "Remplissez le formulaire de réservation en quelques minutes. Indiquez vos dates, lieux de prise en charge et vos informations personnelles.",
                  color: "from-[var(--color-highlight)] to-[var(--color-accent)]",
                  href: "/voitures"
                },
                {
                  step: "03",
                  icon: <KeyRound size={32} />,
                  title: "Récupérez le véhicule",
                  desc: "Nous vous livrons la voiture à l'endroit de votre choix — aéroport, hôtel ou adresse — aux heures convenues. Partez l'esprit libre !",
                  color: "from-[var(--color-accent)] to-[var(--color-highlight)]",
                  href: "/voitures"
                }
              ].map((step, i) => (
                <div key={i} className="group flex flex-col items-center text-center">
                  {/* Step number + icon */}
                  <div className="relative mb-8">
                    <div className={`bg-gradient-to-br ${step.color} w-32 h-32 rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-[var(--color-primary)]/30 relative z-10`}>
                      {step.icon}
                      <div className="absolute inset-0 bg-white/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-3 -right-3 w-9 h-9 bg-white border-2 border-[var(--color-primary)]/20 rounded-full flex items-center justify-center z-20 shadow-lg">
                      <span className="text-[10px] font-black text-[var(--color-primary)]">{step.step}</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-[var(--color-primary)] uppercase tracking-tight mb-4 group-hover:text-[var(--color-secondary)] transition-colors">{step.title}</h4>
                  <p className="text-[var(--color-text-muted)] font-light leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA below steps */}
            <div className="text-center mt-16">
              <LinkButton href="/voitures" variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="shadow-2xl shadow-[var(--color-accent)]/20">
                Voir les voitures disponibles
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <Testimonials initialTestimonials={reviewsData} />

      {/* Location / Map Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white via-[var(--color-bg)] to-white">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="container-custom px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10 mb-6">
              <MapPin size={16} className="text-[var(--color-primary)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">Notre Emplacement</span>
            </div>
            <h2 className="text-5xl font-black text-[var(--color-primary)] uppercase tracking-tighter">
              Venez Nous <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Rendre Visite</span>
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] font-light mt-4 max-w-2xl mx-auto">
              Nos bureaux sont situés en plein cœur d'El Aïoun Sidi Mellouk, facilement accessibles pour votre commodité
            </p>
          </div>

          {/* Map Container */}
          <div className="relative group max-w-6xl mx-auto">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[3rem] rotate-1 blur-xl" />
            
            <div className="relative w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 group-hover:shadow-[var(--color-primary)]/20 transition-shadow duration-500">
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
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-4xl mx-auto">
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
              <div key={index} className="group/item bg-white/80 backdrop-blur-xl border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-3 rounded-xl text-white shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-wider text-xs mb-1 text-[var(--color-primary)]">{info.title}</p>
                    <p className="text-sm font-light text-[var(--color-text-muted)]">{info.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 relative overflow-hidden">
        {/* Multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-highlight)]/30 via-transparent to-[var(--color-accent)]/20" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Decorative orbs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[var(--color-highlight)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent)]/10 rounded-full blur-3xl" />

        {/* Decorative rings */}
        <div className="absolute top-12 left-16 w-24 h-24 border-2 border-white/10 rounded-full animate-pulse" />
        <div className="absolute top-12 left-16 w-40 h-40 border border-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-12 right-16 w-32 h-32 border-2 border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-12 right-16 w-56 h-56 border border-white/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container-custom relative z-10 px-8">
          <div className="grid grid-cols-2 gap-20 items-center">

            {/* Left — text content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-highlight)]" />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-white/80">Disponible maintenant</span>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--color-highlight)]">Rejoignez-nous</p>
                <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] overflow-visible">
                  Prêt pour votre
                  <br />
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">aventure ?</span>
                    <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 400 14" fill="none">
                      <path d="M2 12C60 4 130 4 200 7C270 10 340 5 398 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </h2>
              </div>

              <p className="text-xl text-white/70 font-light leading-relaxed max-w-lg">
                Réservez votre véhicule en quelques clics et profitez du <span className="font-semibold text-white">meilleur service de location</span> dans la région de l'Oriental.
              </p>

              <div className="flex items-center gap-5 pt-2">
                <LinkButton
                  href="/voitures"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                  className="shadow-2xl hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-2"
                >
                  Réserver une voiture
                </LinkButton>
                <LinkButton
                  href="/contact"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 hover:-translate-y-2"
                >
                  Nous contacter
                </LinkButton>
              </div>
            </div>

            {/* Right — floating stat cards */}
            <div className="relative h-[400px]">
              {/* Card 1 */}
              <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 w-64 hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] p-3 rounded-xl">
                    <Star size={22} className="text-white" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Satisfaction</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[var(--color-highlight)]" fill="currentColor" />
                  ))}
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 w-60 hover:-translate-y-2 transition-all duration-500" style={{ transitionDelay: '0.1s' }}>
                <div className="bg-gradient-to-br from-[var(--color-primary)]/80 to-[var(--color-secondary)]/80 p-3 rounded-xl w-fit mb-4">
                  <CarIcon size={22} className="text-white" />
                </div>
                <p className="text-4xl font-black text-white mb-1">7</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Véhicules disponibles</p>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-0 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 w-56 hover:-translate-y-2 transition-all duration-500" style={{ transitionDelay: '0.2s' }}>
                <div className="bg-gradient-to-br from-[var(--color-accent)]/80 to-[var(--color-highlight)]/80 p-3 rounded-xl w-fit mb-4">
                  <Users size={22} className="text-white" />
                </div>
                <p className="text-4xl font-black text-white mb-1">6j/7</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Service disponible</p>
              </div>

              {/* Connecting line decoration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full" />
            </div>

          </div>

          {/* Bottom trust bar */}
          <div className="mt-20 pt-10 border-t border-white/10 flex items-center justify-center gap-12">
            {[
              { icon: <ShieldCheck size={18} />, text: "Assurance incluse" },
              { icon: <CheckCircle2 size={18} />, text: "Annulation gratuite" },
              { icon: <Clock size={18} />, text: "Support 6j/7" },
              { icon: <Star size={18} fill="currentColor" />, text: "Véhicules récents" },
              { icon: <MapPin size={18} />, text: "Livraison aéroport" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors duration-300 cursor-default">
                <span className="text-[var(--color-highlight)]">{item.icon}</span>
                <span className="text-xs font-black uppercase tracking-wider">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
