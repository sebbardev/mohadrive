import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 404 Number with gradient */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)] leading-none tracking-tighter animate-pulse">
            404
          </h1>
        </div>

        {/* Error message */}
        <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-[var(--color-primary)]/10">
              <Search size={18} className="text-[var(--color-primary)]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Page non trouvée</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary)] italic uppercase tracking-tight sm:tracking-tighter px-2 sm:px-0">
              Oups ! Cette page <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">
                n&#39;existe pas
              </span>
            </h2>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            La page que vous recherchez a peut-être été supprimée, renommée ou n&#39;est temporairement pas disponible.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative mb-12 sm:mb-16">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-xl border border-[var(--color-primary)]/10 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-6 sm:p-8 rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-white text-4xl sm:text-5xl font-black">404</div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[var(--color-text-muted)] font-light">
              Ne vous inquiétez pas, nous allons vous aider à retrouver votre chemin
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Link
            href="/"
            className="group relative bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white px-10 sm:px-12 py-5 sm:py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 shadow-2xl shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-2 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
              <Home size={18} />
              Retour à l&#39;accueil
            </span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-10 sm:px-12 py-5 sm:py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 hover:bg-[var(--color-primary)] hover:text-white hover:shadow-2xl hover:-translate-y-2 active:scale-95 flex items-center gap-3"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Page précédente
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-gray-200">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 sm:mb-8">
            Pages populaires
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { name: "Nos Voitures", href: "/voitures" },
              { name: "À Propos", href: "/a-propos" },
              { name: "Conditions", href: "/conditions" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group bg-white px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
              >
                {link.name}
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
