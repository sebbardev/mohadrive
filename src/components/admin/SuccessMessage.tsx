'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  title: string;
  highlightedText: string;
  message: string;
  autoCloseDelay?: number;
  onClose?: () => void;
}

export default function SuccessMessage({
  title,
  highlightedText,
  message,
  autoCloseDelay = 3000,
  onClose,
}: SuccessMessageProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + autoCloseDelay;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / autoCloseDelay) * 100;
      setProgress(newProgress);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);

    const timer = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
    };
  }, [autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!isVisible) return null;

  return (
    <div className="text-center py-12 relative z-10 animate-scale-in">
      {/* Animated CheckCircle with countdown ring */}
      <div className="mb-8 relative inline-block">
        <div className="p-6 bg-[var(--color-bg)] rounded-[2rem] text-[var(--color-accent)] relative">
          <CheckCircle className="h-20 w-20 mx-auto animate-scale-in" />
        </div>
        
        {/* Countdown Ring */}
        <svg className="absolute -top-2 -right-2 w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-[var(--color-secondary)] transition-all duration-100"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
      </div>

      {/* Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${50 + Math.cos((i * 30 * Math.PI) / 180) * 30}%`,
              top: `${50 + Math.sin((i * 30 * Math.PI) / 180) * 30}%`,
              backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'][i % 5],
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>

      {/* Text Content */}
      <h3 className="text-3xl font-black text-[var(--color-primary)] mb-4 uppercase animate-fade-in">
        {title} <span className="text-[var(--color-secondary)]">{highlightedText}</span>
      </h3>
      <p className="text-[var(--color-text-muted)] font-light text-lg mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {message}
      </p>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-bg)] hover:bg-gray-100 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
      >
        <X size={16} />
        Fermer maintenant
      </button>

      {/* Auto-close indicator */}
      <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider animate-pulse">
        Fermeture automatique dans {Math.ceil(progress / 100 * (autoCloseDelay / 1000))}s
      </p>
    </div>
  );
}
