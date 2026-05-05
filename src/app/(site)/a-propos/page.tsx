"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Users, Award, Heart } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { getTotalBookings } from "@/lib/api";

export default function AboutPage() {
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const count = await getTotalBookings();
        setTotalBookings(count);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    
    fetchBookings();
  }, []);
  return (
    <AnimatedBackground>
      {/* Premium Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6 md:pb-8 overflow-hidden">
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
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">À Propos</span>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-5">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-xl px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-[var(--color-primary)]/10 hover:shadow-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/20 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
              </span>
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[var(--color-primary)] whitespace-nowrap">Récemment ouvert à votre service</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.9] px-2 sm:px-1 md:px-0 overflow-visible animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              À Propos de{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">
                  MohaDrive
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 100 4 148 6C196 8 250 4 298 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Nous sommes votre <span className="font-semibold text-[var(--color-primary)]">partenaire de confiance</span> pour la location de voitures à El Aïoun Sidi Mellouk. Notre mission est de rendre votre voyage aussi agréable et sans stress que possible.
            </p>
            
            {/* Quick Stats with Cards */}
            <div className="flex flex-nowrap justify-center gap-2 sm:gap-3 md:gap-5 pt-3 sm:pt-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: "7", label: "Véhicules" },
                { value: "5", label: "Marques" },
                { value: "100%", label: "Satisfaction" }
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

      {/* Story Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <div className="relative h-[350px] sm:h-[450px] lg:h-[600px] group">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[2rem] sm:rounded-[3rem] rotate-3 blur-xl" />
                
                {/* Main image container */}
                <div className="relative h-full overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-4 border-white/50">
                  <Image
                    src="/a-propos.jpeg"
                    alt="Notre équipe"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/40 via-transparent to-transparent" />
                </div>
                
                {/* Floating stats card */}
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white/90 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-[var(--color-primary)]/10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">{totalBookings}</p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">clients</p>
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <span className="section-tag">Notre Parcours</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter px-2 sm:px-1 md:px-0 overflow-visible">
                    Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]">Histoire</span>
                  </h2>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-[var(--color-text-muted)] text-base sm:text-lg font-light leading-relaxed">
                    Récemment ouverte, MohaDrive est née d&#39;une passion pour l&#39;automobile et d&#39;un désir de fournir un service de qualité supérieure aux voyageurs et locaux de notre région.
                  </p>
                  <p className="text-[var(--color-text-muted)] text-base sm:text-lg font-light leading-relaxed">
                    Nous avons commencé avec une flotte de 7 véhicules soigneusement sélectionnés pour offrir le meilleur rapport qualité-prix adapté à tous les besoins et budgets.
                  </p>
                  <p className="text-[var(--color-text-muted)] text-base sm:text-lg font-light leading-relaxed">
                    Que vous soyez en voyage d&#39;affaires, en vacances en famille ou simplement à la recherche d&#39;une escapade le temps d&#39;un week-end, nous avons la voiture qu&#39;il vous faut.
                  </p>
                </div>
                
                {/* Achievement badges */}
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                  {[
                    { icon: <Award size={20} />, text: "Service récent et moderne" },
                    { icon: <Heart size={20} />, text: "Service passionné" }
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[var(--color-bg)] to-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                      <div className="text-[var(--color-primary)]">{badge.icon}</div>
                      <span className="text-xs font-black text-[var(--color-primary)] uppercase tracking-wider">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <span className="section-tag">Ce qui nous motive</span>
              <h2 className="page-header-title">
                Nos <span className="text-[var(--color-secondary)]">Valeurs</span>
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-4 sm:mt-6 px-2">
                Des valeurs fondamentales qui guident chacune de nos actions au quotidien
              </p>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {[
              {
                title: "Transparence",
                desc: "Pas de frais cachés. Nos prix incluent l'assurance et le kilométrage illimité (selon offre). Vous savez exactement ce que vous payez.",
                color: "from-blue-500 to-[var(--color-primary)]"
              },
              {
                title: "Qualité",
                desc: "Nous entretenons rigoureusement notre flotte pour garantir votre sécurité et votre confort à chaque kilomètre.",
                color: "from-[var(--color-highlight)] to-[var(--color-accent)]"
              },
              {
                title: "Service Client",
                desc: "Notre équipe est disponible pendant les horaires d'ouverture pour répondre à vos questions et vous assister en cas de besoin.",
                color: "from-[var(--color-secondary)] to-blue-600"
              }
            ].map((value, index) => (
                <div key={index} className="group relative bg-gradient-to-br from-white to-[var(--color-bg)] p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--color-primary)]/20 hover:-translate-y-3 overflow-hidden">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }} />
                  
                  {/* Icon container with enhanced styling */}
                  <div className={`relative bg-gradient-to-br ${value.color} w-24 h-24 rounded-3xl flex items-center justify-center mb-8 text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-2xl`}>
                    <CheckCircle size={40} />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  </div>
                  
                  {/* Title with improved typography */}
                  <h3 className="relative text-2xl font-black mb-4 text-[var(--color-primary)] uppercase tracking-tight group-hover:text-[var(--color-secondary)] transition-colors">
                    {value.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="relative text-[var(--color-text-muted)] font-light leading-relaxed">
                    {value.desc}
                  </p>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] group-hover:w-full transition-all duration-700 rounded-full" />
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--color-highlight)]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
              {/* Enhanced headline */}
              <div className="space-y-4 sm:space-y-6">
                <span className="inline-block text-[var(--color-highlight)] text-xs font-black uppercase tracking-[0.3em]">Rejoignez-nous</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight sm:tracking-tighter leading-[1.1] sm:leading-tight px-3 sm:px-2 md:px-0 overflow-visible">
                  Prêt à <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">partir ?</span>
                </h2>
              </div>
              
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-light max-w-2xl mx-auto leading-relaxed px-2">
                Découvrez notre sélection de 7 véhicules et <span className="font-semibold text-white">réservez dès maintenant</span> pour votre prochain voyage.
              </p>
              
              {/* Enhanced CTA button */}
              <div className="pt-4 sm:pt-6 md:pt-8">
                <Link
                  href="/voitures"
                  className="group relative inline-block bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white px-8 sm:px-12 md:px-14 py-5 sm:py-6 md:py-7 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-500 shadow-2xl hover:shadow-[var(--color-highlight)]/50 hover:-translate-y-2 active:scale-95 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative">Découvrir nos voitures</span>
                </Link>
              </div>
            </div>
        </div>
      </section>
    </AnimatedBackground>
  );
}
