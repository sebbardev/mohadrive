"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] via-white to-[var(--color-bg)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-to-br from-red-500/5 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Error Icon */}
        <div className="mb-8 sm:mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-500 to-orange-500 p-8 sm:p-12 rounded-full shadow-2xl">
              <AlertTriangle className="text-white w-16 h-16 sm:w-20 sm:h-20" />
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-red-500/10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Erreur détectée</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-primary)] italic uppercase tracking-tight sm:tracking-tighter px-2 sm:px-0">
              Oups ! Quelque chose <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500">
                s&#39;est mal passé
              </span>
            </h2>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Une erreur inattendue s&#39;est produite. Veuillez réessayer ou retourner à l&#39;accueil.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="lg"
            icon={<RefreshCcw size={18} />}
            iconPosition="left"
            className="shadow-2xl shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-2"
          >
            Réessayer
          </Button>

          <LinkButton
            href="/"
            variant="outline"
            size="lg"
            icon={<Home size={18} />}
            iconPosition="left"
            className="hover:shadow-2xl hover:-translate-y-2"
          >
            Retour à l&#39;accueil
          </LinkButton>
        </div>

        {/* Help message */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-gray-200">
          <p className="text-sm text-[var(--color-text-muted)] font-light">
            Si le problème persiste, n&#39;hésitez pas à{}
            <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-bold hover:underline">
              nous contacter
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
