"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LinkButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type LinkButtonSize = "sm" | "md" | "lg";

interface LinkButtonProps {
  href: string;
  variant?: LinkButtonVariant;
  size?: LinkButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function LinkButton({
  href,
  variant = "primary",
  size = "md",
  children,
  icon,
  iconPosition = "left",
  external = false,
  className,
  onClick,
}: LinkButtonProps) {
  // Base style matching WhatsApp button exactly
  const baseStyles =
    "group relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-500 focus:outline-none active:scale-95 overflow-hidden";

  // Primary variant - exact WhatsApp/Testimonials button style
  const primaryStyles = [
    "bg-gradient-to-r",
    "from-[var(--color-accent)]",
    "to-[var(--color-highlight)]",
    "hover:from-[var(--color-highlight)]",
    "hover:to-[var(--color-accent)]",
    "text-white",
    "rounded-2xl",
    "hover:shadow-xl",
    "hover:shadow-[var(--color-accent)]/30",
    "hover:-translate-y-1",
  ];

  // Secondary variant - blue gradient
  const secondaryStyles = [
    "bg-gradient-to-r",
    "from-[var(--color-primary)]",
    "to-[var(--color-secondary)]",
    "hover:from-[var(--color-secondary)]",
    "hover:to-[var(--color-primary)]",
    "text-white",
    "rounded-2xl",
    "hover:shadow-xl",
    "hover:shadow-[var(--color-primary)]/30",
    "hover:-translate-y-1",
  ];

  // Outline variant - bordered
  const outlineStyles = [
    "bg-white",
    "text-[var(--color-primary)]",
    "border-2",
    "border-[var(--color-primary)]",
    "rounded-2xl",
    "hover:bg-[var(--color-primary)]",
    "hover:text-white",
    "hover:shadow-xl",
    "hover:-translate-y-1",
  ];

  // Ghost variant - subtle
  const ghostStyles = [
    "bg-transparent",
    "text-[var(--color-text-main)]",
    "hover:bg-[var(--color-bg)]",
    "hover:text-[var(--color-primary)]",
    "rounded-2xl",
    "hover:-translate-y-1",
  ];

  const variants = {
    primary: primaryStyles,
    secondary: secondaryStyles,
    outline: outlineStyles,
    ghost: ghostStyles,
  };

  const sizes = {
    sm: "px-5 py-2.5 text-[10px] gap-1.5",
    md: "px-7 py-3.5 text-xs gap-2",
    lg: "px-12 py-5 text-sm gap-3",
  };

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...linkProps}
    >
      {/* Shine effect overlay - exact match to WhatsApp/Testimonials */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <span className="relative flex items-center gap-2">
        {icon && iconPosition === "left" && (
          <span className="shrink-0 group-hover:rotate-12 transition-transform">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="shrink-0 group-hover:rotate-12 transition-transform">{icon}</span>
        )}
      </span>
    </Link>
  );
}
