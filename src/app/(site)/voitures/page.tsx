import { getAllCars } from "@/services/carService";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import CarCard from "@/components/CarCard";

export default async function CarsPage() {
  const cars = await getAllCars();

  return (
    <AnimatedBackground>
      {/* Premium Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gradient orb - top right */}
          <div className="absolute -top-20 -right-20 w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-secondary)]/5 to-transparent rounded-full blur-3xl animate-pulse" />
          
          {/* Medium gradient orb - bottom left */}
          <div className="absolute -bottom-20 -left-20 w-[250px] sm:w-[400px] md:w-[500px] h-[250px] sm:h-[400px] md:h-[500px] bg-gradient-to-tr from-[var(--color-highlight)]/10 via-[var(--color-accent)]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Small floating circle - top left */}
          <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
          
          {/* Small floating circle - bottom right */}
          <div className="absolute bottom-20 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-highlight)]/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          
          {/* Diagonal lines decoration */}
          <div className="absolute top-1/4 right-0 w-64 h-px bg-gradient-to-l from-[var(--color-primary)]/20 to-transparent rotate-45" />
          <div className="absolute bottom-1/3 left-0 w-48 h-px bg-gradient-to-r from-[var(--color-highlight)]/20 to-transparent -rotate-45" />
        </div>

        {/* Centered Content Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-xs sm:text-sm relative animate-fade-in-up">
            <Link 
              href="/" 
              className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-300 font-bold hover:gap-3"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Accueil</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">Notre Flotte</span>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-5">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-3 bg-white/90 backdrop-blur-xl px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-[var(--color-primary)]/10 hover:shadow-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/20 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up whitespace-nowrap" style={{ animationDelay: '0.1s' }}>
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
              </span>
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[var(--color-primary)] whitespace-nowrap">{cars.length} véhicules disponibles</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.9] px-2 sm:px-1 md:px-0 overflow-visible animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Notre{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">
                  Flotte
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 100 4 148 6C196 8 250 4 298 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Choisissez parmi notre large gamme de véhicules <span className="font-semibold text-[var(--color-primary)]">premium</span>. De la citadine économique au SUV luxueux, nous avons la voiture qu&#39;il vous faut.
            </p>
            
            {/* Quick Stats with Cards */}
            <div className="flex flex-nowrap justify-center gap-2 sm:gap-3 md:gap-5 pt-3 sm:pt-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: "7", label: "Véhicules", icon: "🚗" },
                { value: "5", label: "Marques", icon: "⭐" },
                { value: "100%", label: "Assurés", icon: "✓" }
              ].map((stat, index) => (
                <div key={index} className="group flex flex-col flex-1 min-w-0 bg-white/60 backdrop-blur-sm px-2 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/20 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="text-base sm:text-xl md:text-2xl font-black text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-300 truncate text-center">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300 truncate text-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid Section */}
      <section className="pb-12 sm:pb-16 md:pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <div className="text-gray-400 text-2xl">🚗</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun véhicule disponible</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Nous n'avons actuellement aucun véhicule à afficher. Veuillez nous contacter pour plus d'informations.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 bg-[var(--color-primary)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          )}
        </div>
      </section>

          </AnimatedBackground>
  );
}
