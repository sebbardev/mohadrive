import Link from "next/link";
import { ChevronRight, ArrowLeft, FileText, Building, MapPin, Phone } from "lucide-react";

export default function MentionsLegalesPage() {
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
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider">Mentions Légales</span>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--color-primary)]">Informations Légales</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.95] sm:leading-[0.9] px-2 sm:px-1 md:px-0 overflow-visible">
              Mentions <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Légales</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-2">
              Informations légales et identification de l'entreprise MohaDrive conformément à la réglementation en vigueur.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-12 sm:pb-16 md:pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl p-6 sm:p-8 md:p-12 lg:p-16 space-y-8 sm:space-y-10 md:space-y-12">
            
            {/* Company Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Building size={20} />
                </div>
                <span>Identification de l'entreprise</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Raison Sociale</p>
                    <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">MohaDrive</p>
                  </div>
                  <div className="bg-gradient-to-r from-white to-[var(--color-bg)] p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Forme Juridique</p>
                    <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">Entreprise Individuelle</p>
                  </div>
                  <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Numéro d'Immatriculation</p>
                    <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">En cours d'immatriculation</p>
                  </div>
                  <div className="bg-gradient-to-r from-white to-[var(--color-bg)] p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Capital Social</p>
                    <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">Non applicable</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <span>Coordonnées</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                  <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Adresse Postale</p>
                  <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">Boulevard Mohamed VI, El Aïoun Sidi Mellouk, Maroc</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-white to-[var(--color-bg)] p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Téléphone</p>
                    <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">+212 676-349036</p>
                  </div>
                  <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                    <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Email</p>
                    <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">Mohadrive51@gmail.com</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Hosting Information */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--color-secondary)] to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <FileText size={20} />
                </div>
                <span>Hébergement</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  Le site web MohaDrive est hébergé sur des serveurs sécurisés localisés au Maroc.
                </p>
                <div className="bg-gradient-to-r from-[var(--color-bg)] to-white p-4 rounded-xl sm:rounded-2xl border border-gray-100">
                  <p className="text-xs sm:text-sm font-black text-[var(--color-primary)] uppercase tracking-wider mb-2">Directeur de Publication</p>
                  <p className="text-[var(--color-text-muted)] font-bold text-sm sm:text-base">M. Moha Sebbar</p>
                </div>
              </div>
            </section>

            {/* Legal Notice */}
            <section>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] mb-4 sm:mb-6 uppercase tracking-tight flex items-start sm:items-center gap-3 flex-wrap">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-[var(--color-primary)] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <Building size={20} />
                </div>
                <span>Propriété Intellectuelle</span>
              </h2>
              <div className="sm:ml-[4.5rem] space-y-3 sm:space-y-4">
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
                </p>
                <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-base sm:text-lg">
                  La reproduction totale ou partielle de ce site, sur quelque support que ce soit, est formellement interdite sans l'autorisation expresse de MohaDrive.
                </p>
              </div>
            </section>

            {/* Update Date */}
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100 text-center">
              <p className="text-[var(--color-text-muted)] font-light text-sm">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
