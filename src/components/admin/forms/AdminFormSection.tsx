import { useState, useEffect } from 'react';

interface AdminFormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function AdminFormSection({
  title,
  subtitle,
  children,
  className = '',
  icon
}: AdminFormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={`admin-card ${className}`}>
      <div 
        className="flex items-center gap-3 mb-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {icon && (
          <div className="w-6 h-6 flex items-center justify-center text-[var(--color-primary)]">
            {icon}
          </div>
        )}
        <h3 className="admin-section-title">{title}</h3>
        {subtitle && (
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
            {subtitle}
          </span>
        )}
        <div className={`ml-auto w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}

// Convenience component for form sections with icons
export function AdminFormSectionWithIcon({
  title,
  subtitle,
  children,
  className = '',
  icon
}: Omit<AdminFormSectionProps, 'icon'> & {
  icon: React.ReactNode;
}) {
  return (
    <AdminFormSection 
      title={title} 
      subtitle={subtitle} 
      className={className}
      icon={icon}
    >
      {children}
    </AdminFormSection>
  );
}
