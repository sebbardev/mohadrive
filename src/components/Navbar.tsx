"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Voitures", href: "/voitures" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-2xl py-3 border-b border-gray-100/50"
          : "bg-white/80 backdrop-blur-lg py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors leading-none">
                MOHADRIVE
              </span>
              <span className="font-black text-sm tracking-[0.3em] uppercase text-[var(--color-highlight)] leading-none mt-1">
                location de voitures
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-3 text-xs font-black uppercase tracking-widest transition-all duration-500 rounded-xl group ${
                  pathname === link.href
                    ? "text-[var(--color-primary)] bg-[var(--color-bg)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)]/50"
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] transition-all duration-500 rounded-full ${
                  pathname === link.href ? "w-8" : "w-0 group-hover:w-8"
                }`} />
              </Link>
            ))}

            {/* WhatsApp CTA Button */}
            <a
              href="https://wa.me/212676349036"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative ml-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white px-7 py-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-widest transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-accent)]/30 hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2.5">
                <Phone size={14} className="group-hover:rotate-12 transition-transform" />
                WhatsApp
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
