'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface MobileCardItemProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  };
  leftIcon?: ReactNode;
  rightContent?: ReactNode;
  image?: string;
  onClick?: () => void;
  actions?: ReactNode;
  className?: string;
}

export function MobileCardItem({
  title,
  subtitle,
  badge,
  leftIcon,
  rightContent,
  image,
  onClick,
  actions,
  className = '',
}: MobileCardItemProps) {
  const badgeColors = {
    success: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-orange-50 text-orange-600 border-orange-200',
    error: 'bg-red-50 text-red-600 border-red-200',
    info: 'bg-blue-50 text-blue-600 border-blue-200',
    default: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="p-4 space-y-3">
        {/* Header with Image/Icon and Title */}
        <div className="flex items-start gap-3">
          {/* Image or Icon */}
          {image ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          ) : leftIcon ? (
            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg)] flex items-center justify-center flex-shrink-0 text-[var(--color-secondary)]">
              {leftIcon}
            </div>
          ) : null}

          {/* Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-tight truncate">
                {title}
              </h3>
              {badge && (
                <span
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border flex-shrink-0 ${
                    badgeColors[badge.variant]
                  }`}
                >
                  {badge.text}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Content */}
          {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
            {actions}
          </div>
        )}

        {/* Chevron if clickable */}
        {onClick && !actions && (
          <div className="flex items-center justify-end pt-1">
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}

interface MobileCardListProps {
  items: MobileCardItemProps[];
  className?: string;
}

export default function MobileCardList({ items, className = '' }: MobileCardListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <MobileCardItem key={index} {...item} />
      ))}
    </div>
  );
}
