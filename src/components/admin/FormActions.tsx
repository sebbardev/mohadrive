'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  children?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'premium' | 'compact';
  className?: string;
  showCancelButton?: boolean;
  showSubmitIcon?: boolean;
  totalAmount?: number;
  currency?: string;
}

export default function FormActions({
  children,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  onSubmit,
  loading = false,
  disabled = false,
  variant = 'default',
  className = '',
  showCancelButton = true,
  showSubmitIcon = true,
  totalAmount,
  currency = 'MAD',
}: FormActionsProps) {
  // Default variant
  if (variant === 'default') {
    return (
      <div className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 ${className}`}>
        {children || (
          <>
            {showCancelButton && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full md:w-auto px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
              >
                {cancelLabel}
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || disabled}
              className="w-full md:w-auto admin-btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {submitLabel}
                  {showSubmitIcon && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  )}
                </>
              )}
            </button>
          </>
        )}
      </div>
    );
  }

  // Premium variant with gradient background
  if (variant === 'premium') {
    return (
      <div className={`mt-12 ${className}`}>
        <div className="p-10 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {totalAmount !== undefined && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Montant Total</p>
                {totalAmount > 0 ? (
                  <h4 className="text-4xl font-black tracking-tighter">
                    {totalAmount.toLocaleString()} <span className="text-sm not-italic text-white/40 ml-2 uppercase">{currency}</span>
                  </h4>
                ) : (
                  <p className="text-sm text-white/40 italic">Sélectionnez un véhicule et des dates pour calculer le prix</p>
                )}
              </div>
            )}
            
            <div className="flex gap-4 w-full md:w-auto">
              {showCancelButton && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 md:flex-none px-8 py-5 bg-white/20 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/30 transition-all"
                >
                  {cancelLabel}
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading || disabled}
                className="flex-1 md:flex-none px-12 py-5 bg-white text-[var(--color-primary)] rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  showSubmitIcon && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  )
                )}
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-4 rounded-xl border border-gray-300 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            {cancelLabel}
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              {submitLabel}
              {showSubmitIcon && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              )}
            </>
          )}
        </button>
      </div>
    );
  }

  return null;
}
