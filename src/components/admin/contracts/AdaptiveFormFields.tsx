import React from "react";
import { UseFormReturn, FieldError } from "react-hook-form";
import { ContractFormValues } from "@/hooks/admin/useContractForm";
import { AlertCircle, Loader2 } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  name?: string;
}

export function FormField({ label, error, children, className = "", required = false, name }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={name}
        className="admin-label mb-2 block"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {children}
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none z-10">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      {error && (
        <p 
          id={`${name}-error`}
          className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

interface AdaptiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register: any;
  name: keyof ContractFormValues;
  icon?: React.ReactNode;
}

export function AdaptiveInput({ register, name, className = "", icon, ...props }: AdaptiveInputProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors">
          {icon}
        </div>
      )}
      <input
        {...register(name)}
        id={name}
        aria-describedby={props["aria-invalid"] ? `${name}-error` : undefined}
        className={`admin-input ${icon ? 'pl-12' : ''} ${className}`}
        {...props}
      />
    </div>
  );
}

interface AdaptiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  register: any;
  name: keyof ContractFormValues;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export function AdaptiveSelect({ register, name, options, placeholder, className = "", icon, ...props }: AdaptiveSelectProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <select
        {...register(name)}
        id={name}
        className={`admin-input ${icon ? 'pl-12' : ''} appearance-none pr-10 ${className}`}
        {...props}
      >
        <option value="">{placeholder || "-- Sélectionner --"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h3 className="admin-section-title flex items-center gap-3">
        <div className="h-8 w-1.5 bg-[var(--color-primary)] rounded-full" />
        {title}
      </h3>
      {subtitle && <p className="text-[var(--color-text-muted)] font-light mt-2 ml-5">{subtitle}</p>}
    </div>
  );
}

export function AdminCard({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={`admin-card ${className}`}>
      {title && (
        <h3 className="admin-section-title mb-10 flex items-center gap-3">
          <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function AdminButton({ children, className = "", loading, ...props }: any) {
  return (
    <button 
      {...props}
      disabled={loading || props.disabled}
      className={`admin-btn-primary ${className}`}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
}
