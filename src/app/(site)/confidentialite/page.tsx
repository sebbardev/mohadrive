import Link from "next/link";
import { ChevronRight, ArrowLeft, FileText, Shield, Eye, Database, Lock } from "lucide-react";
import LinkButton from "@/components/ui/LinkButton";

export default function ConfidentialitePage() {
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
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider">Confidentialité</span>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--color-primary)]">Protection des Données</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.95] sm:leading-[0.9] px-2 sm:px-1 md:px-0 overflow-visible">
              Politique de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Confidentialité</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-2">
              Votre confiance est notre priorité. Nous nous engageons à protéger vos données personnelles avec le plus grand soin.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-12 sm:pb-16 md:pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-8 sm:space-y-10 md:space-y-12">
            
            {/* Data Collection */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Database size={20} />
                </div>
                <span>Données collectées</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  Lors de votre utilisation de nos services, nous pouvons collecter les types de données suivants :
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    "Nom et prénom",
                    "Adresse email",
                    "Numéro de téléphone",
                    "Adresse postale",
                    "Permis de conduire",
                    "Informations de paiement",
                    "Données de navigation",
                    "Préférences de location"
                  ].map((data, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3 text-[var(--color-text-muted)] font-bold text-xs sm:text-sm uppercase tracking-wide bg-gradient-to-r from-[var(--color-bg)] to-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full flex-shrink-0" />
                      {data}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Purpose of Collection */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Eye size={20} />
                </div>
                <span>Finalités de la collecte</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Gestion des réservations</p>
                    <p className="text-[var(--color-text-muted)] font-light text-sm sm:text-base">Traitement de vos demandes de location</p>
                  </div>
                  <div className="bg-gradient-to-r from-white to-[var(--color-bg)] p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Communication</p>
                    <p className="text-[var(--color-text-muted)] font-light text-sm sm:text-base">Envoi de confirmations et informations</p>
                  </div>
                  <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Amélioration du service</p>
                    <p className="text-[var(--color-text-muted)] font-light text-sm sm:text-base">Analyse pour optimiser l'expérience</p>
                  </div>
                  <div className="bg-gradient-to-r from-white to-[var(--color-bg)] p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Obligations légales</p>
                    <p className="text-[var(--color-text-muted)] font-light text-sm sm:text-base">Conformité avec la réglementation</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-secondary)] to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Shield size={20} />
                </div>
                <span>Protection des données</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
                </p>
                <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                  <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Mesures de sécurité</p>
                  <ul className="text-[var(--color-text-muted)] font-light text-sm sm:text-base space-y-2">
                    <li>• Chiffrement des données sensibles</li>
                    <li>• Accès limité au personnel autorisé</li>
                    <li>• Sauvegardes régulières et sécurisées</li>
                    <li>• Surveillance des accès et activités</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-[var(--color-primary)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Lock size={20} />
                </div>
                <span>Durée de conservation</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  Vos données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, conformément à la réglementation en vigueur.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Données de réservation</p>
                    <p className="text-[var(--color-text-muted)] font-light text-sm sm:text-base">Conservées 3 ans après la location</p>
                  </div>
                  <div className="bg-gradient-to-r from-white to-[var(--color-bg)] p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Données de navigation</p>
                    <p className="text-[var(--color-text-muted)] font-light text-sm sm:text-base">Conservées 13 mois maximum</p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <FileText size={20} />
                </div>
                <span>Vos droits</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    "Droit d'accès à vos données",
                    "Droit de rectification",
                    "Droit à l'effacement",
                    "Droit à la portabilité",
                    "Droit d'opposition",
                    "Droit de limitation du traitement"
                  ].map((right, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3 text-[var(--color-text-muted)] font-bold text-xs sm:text-sm uppercase tracking-wide bg-gradient-to-r from-[var(--color-bg)] to-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full flex-shrink-0" />
                      {right}
                    </li>
                  ))}
                </ul>
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  Pour exercer ces droits, contactez-nous à : <span className="font-bold text-[var(--color-primary)]">Mohadrive51@gmail.com</span>
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100 text-center">
              <p className="text-[var(--color-text-muted)] mb-6 sm:mb-8 md:mb-10 font-light text-base sm:text-lg px-2">
                Vous avez des questions sur notre politique de confidentialité ?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <LinkButton
                  href="/contact"
                  variant="secondary"
                  size="lg"
                >
                  Nous Contacter
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
