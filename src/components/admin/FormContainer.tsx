'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface FormContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  isOpen?: boolean;
  variant?: 'modal' | 'page' | 'card';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
  scrollable?: boolean;
  maxHeight?: string;
}

export default function FormContainer({
  children,
  title,
  subtitle,
  onClose,
  isOpen = true,
  variant = 'page',
  size = 'lg',
  className = '',
  showCloseButton = true,
  overlayClassName = '',
  contentClassName = '',
  scrollable = true,
  maxHeight,
}: FormContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (variant === 'modal') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [variant]);

  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const maxHeightClass = maxHeight || (scrollable ? 'max-h-[85vh]' : 'max-h-none');

  // Modal variant
  if (variant === 'modal') {
    const modalContent = (
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in ${overlayClassName}`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-[2.5rem] ${sizeClasses[size]} w-full ${maxHeightClass} overflow-y-auto relative animate-scale-in shadow-2xl ${contentClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
          
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="sticky top-0 z-20 bg-white rounded-t-[2.5rem] p-8 sm:p-10 lg:p-12 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-[var(--color-text-muted)] font-light">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && onClose && (
                  <button
                    onClick={onClose}
                    className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all ml-4 flex-shrink-0"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8 sm:p-10 lg:p-12">
            {children}
          </div>
        </div>
      </div>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden ${sizeClasses[size]} ${className}`}>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-5" />
        
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="relative z-10 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <h2 className="text-2xl font-black text-[var(--color-primary)] mb-2 uppercase">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-[var(--color-text-muted)] font-light">
                    {subtitle}
                  </p>
                )}
              </div>
              {showCloseButton && onClose && (
                <button
                  onClick={onClose}
                  className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all flex-shrink-0"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // Page variant (default)
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}
