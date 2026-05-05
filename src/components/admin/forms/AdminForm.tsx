import { useState, useEffect, useRef } from 'react';
import { useFormContext, FormProvider } from './FormContext';

interface AdminFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AdminForm({ 
  onSubmit, 
  children, 
  className = '',
  disabled = false
}: AdminFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isSubmitting) return;
    
    // Reset previous errors and success state
    setErrors({});
    setSuccess(false);
    
    try {
      setIsSubmitting(true);
      
      // Collect form data
      const formData = new FormData(formRef.current!);
      const data: Record<string, any> = {};
      
      for (let [key, value] of formData.entries()) {
        // Handle multiple select values
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else if (data[key] !== undefined) {
          data[key] = [data[key], value];
        } else {
          data[key] = value;
        }
      }
      
      await onSubmit(data);
      setSuccess(true);
      
      // Auto-reset after success
      setTimeout(() => {
        setSuccess(false);
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 3000);
      
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Une erreur est survenue' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormProvider>
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className={`space-y-8 ${className}`}
        noValidate
      >
        {children}
        
        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-100 text-green-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 shadow-sm">
            <div className="p-2 bg-green-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Opération réussie !</p>
          </div>
        )}
        
        {/* Error messages */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 shadow-sm">
            <div className="p-2 bg-red-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              {errors.general || 'Veuillez corriger les erreurs ci-dessous'}
            </p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
