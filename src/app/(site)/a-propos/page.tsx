"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Award, Heart, ShieldCheck, Star, Zap, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
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

      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-36 pb-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-highlight)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--color-secondary)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          {/* Decorative rings */}
          <div className="absolute top-20 right-32 w-24 h-24 border-2 border-[var(--color-primary)]/10 rounded-full" />
          <div className="absolute bottom-24 left-32 w-40 h-40 border-2 border-[var(--color-highlight)]/10 rounded-full" />
          <div className="absolute top-1/3 left-16 w-16 h-16 border-2 border-[var(--color-accent)]/10 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-16 text-sm">
            <Link href="/" className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-300 font-bold hover:gap-3">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Accueil</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">À Propos</span>
          </div>

          {/* Centered content */}
          <div className="text-center max-w-5xl mx-auto space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10 hover:-translate-y-1 transition-all duration-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]" />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">Récemment ouvert à votre service</span>
            </div>

            {/* Main title */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--color-highlight)]">Notre identité</p>
              <h1 className="text-8xl font-black text-[var(--color-primary)] uppercase tracking-tighter leading-[0.85] overflow-visible">
                À Propos de{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">MohaDrive</span>
                  <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 400 14" fill="none">
                    <path d="M2 12C60 4 130 4 200 7C270 10 340 5 398 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-2xl text-[var(--color-text-muted)] font-light leading-relaxed max-w-3xl mx-auto">
              Votre <span className="font-semibold text-[var(--color-primary)]">partenaire de confiance</span> pour la location de voitures à El Aïoun Sidi Mellouk — une expérience simple, transparente et premium.
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-[var(--color-primary)]/30" />
              <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-[var(--color-primary)]/30" />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 pt-4">
              {[
                { value: "7", label: "Véhicules", icon: <Award size={18} /> },
                { value: String(totalBookings || "0"), label: "Réservations", icon: <Users size={18} /> },
                { value: "5", label: "Marques", icon: <Star size={18} /> },
                { value: "100%", label: "Satisfaction", icon: <Heart size={18} /> },
              ].map((stat, i) => (
                <div key={i} className="group flex items-center gap-4 bg-white/70 backdrop-blur-sm border border-[var(--color-primary)]/10 rounded-2xl px-7 py-5 hover:bg-white hover:shadow-2xl hover:border-[var(--color-primary)]/20 hover:-translate-y-2 transition-all duration-500">
                  <div className="p-2.5 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-xl text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black text-[var(--color-primary)] leading-none">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ── */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--color-bg)]/50 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="section-tag">Notre Parcours</span>
            <h2 className="page-header-title">
              Notre <span className="text-[var(--color-secondary)]">Histoire</span>
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-6">
              Comment MohaDrive est né d'une passion pour l'automobile et d'une vision de service premium
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-primary)]/30 via-[var(--color-highlight)]/50 to-transparent" />

            {[
              {
                side: "left",
                icon: <Zap size={20} />,
                color: "from-blue-500 to-[var(--color-primary)]",
                title: "La Vision",
                text: "MohaDrive est née d'une passion pour l'automobile et d'un désir profond de fournir un service de qualité supérieure aux voyageurs et aux habitants de la région."
              },
              {
                side: "right",
                icon: <Award size={20} />,
                color: "from-[var(--color-highlight)] to-[var(--color-accent)]",
                title: "La Flotte",
                text: "Nous avons soigneusement sélectionné 7 véhicules récents — de la citadine économique au SUV confortable — pour répondre à tous les besoins et tous les budgets."
              },
              {
                side: "left",
                icon: <Heart size={20} />,
                color: "from-[var(--color-accent)] to-[var(--color-highlight)]",
                title: "Le Service",
                text: "Livraison à l'aéroport, assistance 24/7, assurance incluse, tarifs transparents. Chaque détail est pensé pour que votre expérience soit sans stress."
              },
              {
                side: "right",
                icon: <Star size={20} />,
                color: "from-[var(--color-secondary)] to-blue-600",
                title: "Aujourd'hui",
                text: "Fiers de la confiance de nos clients, nous continuons à améliorer notre flotte et notre service pour rester le partenaire de mobilité de référence dans la région."
              },
            ].map((item, i) => (
              <div key={i} className={`relative flex items-center gap-8 mb-16 ${item.side === 'right' ? 'flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="w-[calc(50%-2.5rem)]">
                  <div className={`group bg-gradient-to-br from-white to-[var(--color-bg)] p-8 rounded-[2rem] border border-gray-100 hover:border-[var(--color-primary)]/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative ${item.side === 'right' ? 'text-left' : 'text-right'}`}>
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] group-hover:w-full transition-all duration-700 rounded-full" />
                    <h3 className="text-xl font-black text-[var(--color-primary)] uppercase tracking-tight mb-3">{item.title}</h3>
                    <p className="text-[var(--color-text-muted)] font-light leading-relaxed">{item.text}</p>
                  </div>
                </div>
                {/* Center dot */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className={`bg-gradient-to-br ${item.color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white`}>
                    {item.icon}
                  </div>
                </div>
                {/* Empty side */}
                <div className="w-[calc(50%-2.5rem)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ── */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] to-white">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="section-tag">Ce qui nous motive</span>
            <h2 className="page-header-title">
              Nos <span className="text-[var(--color-secondary)]">Valeurs</span>
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto mt-6">
              Des principes fondamentaux qui guident chacune de nos actions
            </p>
          </div>

          <div className="grid grid-cols-3 gap-10">
            {[
              {
                icon: <ShieldCheck size={40} />,
                title: "Transparence",
                desc: "Pas de frais cachés. Nos prix incluent l'assurance et le kilométrage illimité. Vous savez exactement ce que vous payez, dès le départ.",
                color: "from-blue-500 to-[var(--color-primary)]",
                perks: ["Prix tout inclus", "Aucune surprise", "Contrat clair"]
              },
              {
                icon: <Star size={40} />,
                title: "Qualité",
                desc: "Chaque véhicule est soigneusement entretenu et inspecté avant chaque location pour garantir votre sécurité et votre confort.",
                color: "from-[var(--color-highlight)] to-[var(--color-accent)]",
                perks: ["Véhicules récents", "Entretien régulier", "Propreté garantie"]
              },
              {
                icon: <Heart size={40} />,
                title: "Service Client",
                desc: "Disponibles pendant les horaires d'ouverture pour répondre à vos questions, vous assister et rendre chaque étape simple.",
                color: "from-[var(--color-secondary)] to-blue-600",
                perks: ["Équipe disponible", "Livraison aéroport", "Assistance dédiée"]
              }
            ].map((value, i) => (
              <div key={i} className="group relative bg-white p-10 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--color-primary)]/20 hover:-translate-y-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/0 to-[var(--color-secondary)]/0 group-hover:from-[var(--color-primary)]/3 group-hover:to-[var(--color-secondary)]/5 transition-all duration-500" />
                <div className={`relative bg-gradient-to-br ${value.color} w-24 h-24 rounded-3xl flex items-center justify-center mb-8 text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {value.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                </div>
                <h3 className="relative text-2xl font-black mb-4 text-[var(--color-primary)] uppercase tracking-tight group-hover:text-[var(--color-secondary)] transition-colors">
                  {value.title}
                </h3>
                <p className="relative text-[var(--color-text-muted)] font-light leading-relaxed mb-6">{value.desc}</p>
                <div className="relative space-y-2">
                  {value.perks.map((perk, j) => (
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

      {/* ── CONTACT RAPIDE ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <MapPin size={22} />, title: "Adresse", text: "Boulevard Mohamed VI, El Aïoun Sidi Mellouk" },
              { icon: <Phone size={22} />, title: "Téléphone", text: "+212 676-349036" },
              { icon: <Clock size={22} />, title: "Horaires", text: "Lun – Sam : 9h00 – 19h00" },
            ].map((info, i) => (
              <div key={i} className="group bg-[var(--color-bg)] hover:bg-white border border-transparent hover:border-[var(--color-primary)]/10 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-3 rounded-xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] mb-1">{info.title}</p>
                    <p className="text-sm font-light text-[var(--color-text-muted)]">{info.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--color-highlight)]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-6">
              <span className="inline-block text-[var(--color-highlight)] text-xs font-black uppercase tracking-[0.3em]">Rejoignez-nous</span>
              <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-tight overflow-visible">
                Prêt à <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">partir ?</span>
              </h2>
            </div>
            <p className="text-2xl text-blue-100 font-light max-w-2xl mx-auto leading-relaxed">
              Découvrez nos <span className="font-semibold text-white">7 véhicules disponibles</span> et réservez dès maintenant pour votre prochain voyage.
            </p>
            <div className="flex flex-row gap-6 justify-center pt-8">
              <Link
                href="/voitures"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white px-14 py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-500 shadow-2xl hover:shadow-[var(--color-highlight)]/50 hover:-translate-y-2 active:scale-95 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative">Découvrir nos voitures</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white border-2 border-white/30 hover:bg-white hover:text-[var(--color-primary)] hover:border-white px-14 py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-500 hover:-translate-y-2"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

    </AnimatedBackground>
  );
}
