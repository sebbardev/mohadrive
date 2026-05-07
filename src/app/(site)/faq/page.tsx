"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Plus, Minus, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import LinkButton from "@/components/ui/LinkButton";

const faqData = [
  {
    question: "Quels documents sont nécessaires pour louer une voiture ?",
    answer: "Pour louer une voiture, vous devez présenter un permis de conduire valide depuis au moins 2 ans, une pièce d'identité (CIN ou passeport) et une carte de crédit pour la caution.",
  },
  {
    question: "Quel âge faut-il avoir pour louer une voiture ?",
    answer: "L'âge minimum requis est de 21 ans. Pour certaines catégories de véhicules de luxe, l'âge minimum peut être plus élevé (25 ans).",
  },
  {
    question: "L'assurance est-elle incluse dans le prix ?",
    answer: "Oui, tous nos tarifs incluent l'assurance responsabilité civile obligatoire. Des assurances complémentaires (rachat de franchise, protection pneus et bris de glace) sont disponibles en option.",
  },
  {
    question: "Puis-je modifier ou annuler ma réservation ?",
    answer: "Oui, vous pouvez modifier ou annuler votre réservation sans frais jusqu'à 48 heures avant la prise en charge du véhicule. Passé ce délai, des frais peuvent s'appliquer.",
  },
  {
    question: "Faut-il verser une caution ?",
    answer: "Oui, une caution est bloquée sur votre carte de crédit au moment de la prise en charge. Son montant dépend de la catégorie du véhicule loué. Elle est débloquée à la restitution du véhicule, sous réserve qu'aucun dommage ne soit constaté.",
  },
  {
    question: "Le kilométrage est-il illimité ?",
    answer: "La plupart de nos offres incluent le kilométrage illimité. Cependant, pour certaines locations de courte durée ou promotions spécifiques, un forfait kilométrique peut s'appliquer. Vérifiez les détails de votre offre.",
  },
  {
    question: "Proposez-vous la livraison à l'aéroport ?",
    answer: "Oui, nous livrons votre véhicule gratuitement dans toutes les régions de l'Oriental ainsi qu'aux aéroports d'Oujda Angad et Aroui et à votre hôtel ou résidence.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-[var(--color-bg)] via-white to-[var(--color-bg)] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 py-8 sm:py-10 md:py-12 lg:py-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[300px] sm:w-[500px] md:w-[700px] lg:w-[800px] h-[300px] sm:h-[500px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[200px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[200px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm relative">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-bold"
            >
              <ArrowLeft size={16} />
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider">FAQ</span>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--color-primary)]">Assistance</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.95] sm:leading-[0.9] px-2 sm:px-1 md:px-0 overflow-visible">
              Foire Aux <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Questions</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-2">
              Retrouvez ici les réponses aux questions les plus fréquentes sur la <span className="font-semibold text-[var(--color-primary)]">location de voiture</span> avec MOHADRIVE Location de Voitures.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-12 sm:pb-16 md:pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-[2rem] sm:rounded-[2.5rem] shadow-lg overflow-hidden transition-all duration-300 hover:border-[var(--color-secondary)] hover:shadow-xl group"
            >
              <button
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className={`font-black text-base sm:text-lg md:text-xl uppercase tracking-tight transition-colors pr-4 ${openIndex === index ? "text-[var(--color-accent)]" : "text-[var(--color-primary)] group-hover:text-[var(--color-secondary)]"}`}>{item.question}</span>
                {openIndex === index ? (
                  <Minus className="text-[var(--color-accent)] flex-shrink-0" size={24} />
                ) : (
                  <Plus className="text-gray-300 flex-shrink-0 group-hover:text-[var(--color-accent)] transition-colors" size={24} />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 sm:p-8 pt-0 text-[var(--color-text-muted)] border-t border-gray-50 mt-2 font-light leading-relaxed text-base sm:text-lg">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center bg-white border border-gray-100 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 md:p-12 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-br from-[var(--color-bg)] to-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto">
              <HelpCircle size={32} className="text-[var(--color-primary)]" />
            </div>
            <p className="text-[var(--color-text-muted)] font-light text-base sm:text-lg md:text-xl px-2">Vous n'avez pas trouvé la réponse à votre question ?</p>
            <LinkButton
              href="https://wa.me/212600000000"
              external
              variant="primary"
              size="lg"
              className="shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Contactez notre équipe
            </LinkButton>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
