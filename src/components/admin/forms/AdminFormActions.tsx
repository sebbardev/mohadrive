import { useState } from 'react';

interface AdminFormActionsProps {
  submitLabel: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  showCancelButton?: boolean;
  variant?: 'default' | 'compact' | 'full-width';
  showSubmitIcon?: boolean;
}

export function AdminFormActions({
  submitLabel,
  cancelLabel = 'Annuler',
  onCancel,
  loading = false,
  disabled = false,
  showCancelButton = true,
  variant = 'default',
  showSubmitIcon = true
}: AdminFormActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || loading) return;
    setIsSubmitting(true);
  };
  
  const buttonClasses = {
    default: 'admin-btn-primary px-8 py-4 text-xs font-black uppercase tracking-widest',
    compact: 'admin-btn-primary px-6 py-3 text-[10px] font-black uppercase tracking-widest',
    'full-width': 'admin-btn-primary w-full px-8 py-4 text-xs font-black uppercase tracking-widest'
  };
  
  return (
    <div className={`flex ${variant === 'full-width' ? 'flex-col gap-4' : 'justify-end'} mt-8`}>
      <div className="flex gap-4">
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || disabled}
            className="admin-btn-secondary px-6 py-3 text-[10px] font-black uppercase tracking-widest"
          >
            {cancelLabel}
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading || disabled}
          className={`${buttonClasses[variant]} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              TRAITEMENT...
            </>
          ) : (
            <>
              {showSubmitIcon && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
