import { useState, useEffect } from 'react';
import { useFormContext } from './FormContext';

interface AdminFormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox' | 'radio';
}

export function AdminFormField({
  name,
  label,
  required = false,
  children,
  error,
  helperText,
  className = '',
  inputClassName = '',
  type = 'text'
}: AdminFormFieldProps) {
  const [fieldError, setFieldError] = useState<string | undefined>(error);
  const { errors, clearErrors } = useFormContext();
  
  // Update error state when context errors change
  useEffect(() => {
    if (errors[name]) {
      setFieldError(errors[name]);
    } else if (fieldError && !errors[name]) {
      setFieldError(undefined);
    }
  }, [errors, name, fieldError]);
  
  
  const handleFocus = () => {
    if (fieldError) {
      clearErrors();
      setFieldError(undefined);
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="admin-label ml-2 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        className={`relative group ${inputClassName} ${fieldError ? 'border-red-400 ring-2 ring-red-200' : ''}`}
        onFocus={handleFocus}
      >
        {children}
      </div>
      
      {helperText && (
        <p className="text-[9px] text-gray-400 font-light mt-1 px-2">{helperText}</p>
      )}
      
      {fieldError && (
        <p className="text-[9px] text-red-600 font-bold mt-1 px-2 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm1-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 102 0v-1a1 1 0 10-2 0v1z" clipRule="evenodd" />
          </svg>
          {fieldError}
        </p>
      )}
    </div>
  );
}

// Convenience components for common field types
export function AdminTextInput({
  name,
  label,
  required = false,
  placeholder,
  defaultValue,
  value,
  maxLength,
  helperText,
  className = '',
  onChange,
  onKeyPress,
  inputClassName: _ic,
  ...props
}: Omit<AdminFormFieldProps, 'children'> & {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <AdminFormField 
      name={name} 
      label={label} 
      required={required}
      helperText={helperText}
      className={className}
      inputClassName="admin-input"
      type="text"
    >
      <input
        ref={props.ref as any}
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
        {...props}
      />
    </AdminFormField>
  );
}

export function AdminSelectInput({
  name,
  label,
  required = false,
  options,
  defaultValue,
  helperText,
  className = '',
  onChange,
  inputClassName: _ic2,
  ...props
}: Omit<AdminFormFieldProps, 'children'> & {
  options: { value: string; label: string }[];
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ref?: React.Ref<HTMLSelectElement>;
}) {
  return (
    <AdminFormField 
      name={name} 
      label={label} 
      required={required}
      helperText={helperText}
      className={className}
      inputClassName="admin-input appearance-none cursor-pointer"
      type="select"
    >
      <select
        ref={props.ref as any}
        name={name}
        required={required}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none appearance-none"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </AdminFormField>
  );
}

export function AdminTextareaInput({
  name,
  label,
  required = false,
  placeholder,
  defaultValue,
  rows = 5,
  helperText,
  className = '',
  onChange,
  inputClassName: _ic3,
  ...props
}: Omit<AdminFormFieldProps, 'children'> & {
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  ref?: React.Ref<HTMLTextAreaElement>;
}) {
  return (
    <AdminFormField 
      name={name} 
      label={label} 
      required={required}
      helperText={helperText}
      className={className}
      inputClassName="admin-input resize-none font-light text-lg rounded-2xl"
      type="textarea"
    >
      <textarea
        ref={props.ref as any}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
        {...props}
      />
    </AdminFormField>
  );
}

export function AdminNumberInput({
  name,
  label,
  required = false,
  placeholder,
  defaultValue,
  min,
  max,
  step,
  helperText,
  className = '',
  onChange,
  inputClassName: _ic4,
  ...props
}: Omit<AdminFormFieldProps, 'children'> & {
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <AdminFormField 
      name={name} 
      label={label} 
      required={required}
      helperText={helperText}
      className={className}
      inputClassName="admin-input"
      type="number"
    >
      <input
        ref={props.ref as any}
        type="number"
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none"
        {...props}
      />
    </AdminFormField>
  );
}

export function AdminDateInput({
  name,
  label,
  required = false,
  defaultValue,
  min,
  max,
  helperText,
  className = '',
  onChange,
  inputClassName: _ic5,
  ...props
}: Omit<AdminFormFieldProps, 'children'> & {
  defaultValue?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <AdminFormField 
      name={name} 
      label={label} 
      required={required}
      helperText={helperText}
      className={className}
      inputClassName="admin-input"
      type="date"
    >
      <input
        ref={props.ref as any}
        type="date"
        name={name}
        required={required}
        defaultValue={defaultValue}
        min={min}
        max={max}
        onChange={onChange}
        className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none [color-scheme:dark]"
        {...props}
      />
    </AdminFormField>
  );
}

export function AdminTimeInput({
  name,
  label,
  required = false,
  defaultValue,
  helperText,
  className = '',
  ...props
}: Omit<AdminFormFieldProps, 'children'> & {
  defaultValue?: string;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <AdminFormField 
      name={name} 
      label={label} 
      required={required}
      helperText={helperText}
      className={className}
      inputClassName="admin-input"
      type="time"
    >
      <input
        ref={props.ref as any}
        type="time"
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full h-full p-0 bg-transparent border-none focus:ring-0 focus:outline-none [color-scheme:dark]"
        {...props}
      />
    </AdminFormField>
  );
}
