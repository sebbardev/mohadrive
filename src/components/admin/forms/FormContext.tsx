import { createContext, useContext, useState, useEffect } from 'react';

interface FormContextType {
  isSubmitting: boolean;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  registerField: (name: string, validation?: (value: any) => string | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const clearErrors = () => setErrors({});
  
  const registerField = (name: string, validation?: (value: any) => string | null) => {
    // Field registration logic would go here
  };
  
  return (
    <FormContext.Provider value={{
      isSubmitting,
      errors,
      setErrors,
      clearErrors,
      registerField
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}
