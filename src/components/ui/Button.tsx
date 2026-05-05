"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base style matching WhatsApp button exactly
    const baseStyles =
      "group relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 overflow-hidden";

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

    // Secondary variant - outline gradient
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

    // Outline variant - bordered gradient
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
      lg: "px-8 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm gap-2 sm:gap-3",
    };

    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClass,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine effect overlay - exact match to WhatsApp/Testimonials */}
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        {isLoading ? (
          <span className="relative flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Chargement...</span>
          </span>
        ) : (
          <span className="relative flex items-center gap-2">
            {icon && iconPosition === "left" && (
              <span className="shrink-0 group-hover:rotate-12 transition-transform">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <span className="shrink-0 group-hover:rotate-12 transition-transform">{icon}</span>
            )}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
