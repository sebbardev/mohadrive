'use client';

import React, { ReactNode } from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';

export interface StandardFormFieldProps {
  label: string;
  error?: string | { message?: string };
  children: ReactNode;
  icon?: LucideIcon;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  helpText?: string;
  inputClassName?: string;
}

export default function StandardFormField({
  label,
  error,
  children,
  icon: Icon,
  required = false,
  className = '',
  labelClassName = '',
  containerClassName = '',
  helpText,
  inputClassName = '',
}: StandardFormFieldProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  // Apply default admin-input styling if inputClassName is provided
  const applyInputStyling = (child: ReactNode): ReactNode => {
    if (!inputClassName || !child) return child;
    
    if (typeof child === 'object' && child !== null && 'props' in child) {
      const reactElement = child as React.ReactElement<any>;
      const existingClassName = reactElement.props.className || '';
      // Merge admin-input with any existing classes
      const mergedClassName = `${inputClassName} ${existingClassName}`.trim();
      
      return React.cloneElement(reactElement, {
        ...reactElement.props,
        className: mergedClassName,
      });
    }
    
    return child;
  };

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {/* Label */}
      <label className={`admin-label mb-2 ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Input Container */}
      <div className="relative group">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors z-10 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        {/* Children (Input/Select/Textarea) */}
        <div className={Icon ? 'pl-12' : ''}>
          {applyInputStyling(children)}
        </div>
        
        {/* Error Icon */}
        {errorMessage && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none z-10">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      
      {/* Help Text */}
      {helpText && !errorMessage && (
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">
          {helpText}
        </p>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
