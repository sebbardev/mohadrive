"use client";

import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[var(--color-primary)] via-[#054a66] to-[#043549] text-white pt-16 sm:pt-20 pb-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 via-[var(--color-secondary)]/10 to-[var(--color-highlight)]/10 rounded-full blur-3xl" />
      </div>
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/50 via-[var(--color-secondary)] to-[var(--color-highlight)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo */}
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-2xl tracking-tighter uppercase text-white leading-none">
                MOHADRIVE
              </span>
              <span className="font-black text-[8px] sm:text-sm tracking-[0.3em] uppercase text-[var(--color-secondary)] leading-none mt-0.5 sm:mt-1">
                location de voitures
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed font-light text-sm">
              Votre partenaire de confiance pour la location de voitures à El Aïoun Sidi Mellouk. Vivez une expérience de conduite inoubliable.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/people/Moha-Drive/pfbid0Fpb4zHN6WQ1ptmoebYbEzHnx5eoXjtKHS1NLjYSeqaRmhKginipeaR6gXBSA164cl/?mibextid=wwXIfr&ref=1", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/moha.drive?igsh=MW81cWtudWo3aGt5Zg==", label: "Instagram" },
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative bg-white/10 backdrop-blur-sm p-3 rounded-xl text-white hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-transparent"
                >
                  <social.icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
              <a 
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="group relative bg-white/10 backdrop-blur-sm p-3 rounded-xl text-white hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-transparent"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform group-hover:scale-110">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-highlight)] to-transparent" />
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Accueil", href: "/" },
                { name: "Nos Voitures", href: "/voitures" },
                { name: "À Propos", href: "/a-propos" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-all flex items-center gap-2 group text-sm font-medium">
                    <ArrowRight size={14} className="text-[var(--color-primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-highlight)] to-transparent" />
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Conditions", href: "/conditions" },
                { name: "FAQ", href: "/faq" },
                { name: "Mentions Légales", href: "/mentions-legales" },
                { name: "Confidentialité", href: "/confidentialite" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-all flex items-center gap-2 group text-sm font-medium">
                    <ArrowRight size={14} className="text-[var(--color-secondary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-highlight)] to-transparent" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors mt-0.5">
                  <MapPin size={16} className="text-[var(--color-highlight)]" />
                </div>
                <span className="text-gray-300 text-sm font-light">Boulevard Mohamed VI, El Aïoun Sidi Mellouk</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors mt-0.5">
                  <Phone size={16} className="text-[var(--color-highlight)]" />
                </div>
                <a href="tel:+212676349036" className="text-white hover:text-[var(--color-highlight)] text-sm font-light transition-colors">
                  +212 676-349036
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors mt-0.5">
                  <Mail size={16} className="text-[var(--color-highlight)]" />
                </div>
                <a href="mailto:Mohadrive51@gmail.com" className="text-white hover:text-[var(--color-highlight)] text-sm font-light transition-colors">
                  Mohadrive51@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-white/70 text-center md:text-left">
              &copy; {new Date().getFullYear()} MohaDrive. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                L&#39;excellence automobile
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
