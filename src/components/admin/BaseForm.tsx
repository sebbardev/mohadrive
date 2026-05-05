'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface BaseFormProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showHeader?: boolean;
  headerVariant?: 'default' | 'minimal' | 'accented';
}

export default function BaseForm({
  title,
  subtitle,
  icon: Icon,
  children,
  onSubmit,
  className = '',
  headerClassName = '',
  contentClassName = '',
  showHeader = true,
  headerVariant = 'default',
}: BaseFormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-8 animate-fade-in ${className}`}>
      {/* Form Header */}
      {showHeader && (
        <div className={`mb-8 ${headerClassName}`}>
          {headerVariant === 'default' && (
            <>
              <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight flex items-center gap-3">
                <div className="h-8 w-1.5 bg-[var(--color-primary)] rounded-full" />
                {Icon && <Icon size={24} className="text-[var(--color-secondary)]" />}
                {title}
              </h3>
              {subtitle && (
                <p className="text-[var(--color-text-muted)] font-light mt-2 ml-5">{subtitle}</p>
              )}
            </>
          )}
          
          {headerVariant === 'minimal' && (
            <>
              <h3 className="text-xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  {subtitle}
                </p>
              )}
            </>
          )}
          
          {headerVariant === 'accented' && (
            <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
              {Icon && (
                <div className="p-2 bg-[var(--color-bg)] rounded-xl text-[var(--color-secondary)]">
                  <Icon size={20} strokeWidth={2.5} />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-highlight)] rounded-full" />
            </div>
          )}
        </div>
      )}

      {/* Form Content */}
      <div className={`space-y-6 ${contentClassName}`}>
        {children}
      </div>
    </form>
  );
}
