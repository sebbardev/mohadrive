import { useState, useEffect } from 'react';

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function AdminTable({ 
  children, 
  className = '',
  striped = false,
  hoverable = true
}: AdminTableProps) {
  return (
    <div className={`admin-table-container ${className} ${striped ? 'striped' : ''}`}>
      {children}
    </div>
  );
}

// Table Header Components
export function AdminTableHeader({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function AdminTableFooter({ children }: { children: React.ReactNode }) {
  return <tfoot>{children}</tfoot>;
}

// Row Components
interface AdminTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AdminTableRow({ 
  children, 
  className = '',
  onClick,
  disabled = false
}: AdminTableRowProps) {
  const baseClasses = `admin-table-row ${className}`;
  
  return (
    <tr 
      className={baseClasses}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      aria-disabled={disabled}
    >
      {children}
    </tr>
  );
}

// Cell Components
interface AdminTableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  isHeader?: boolean;
}

export function AdminTableCell({ 
  children, 
  className = '',
  align = 'left',
  isHeader = false
}: AdminTableCellProps) {
  const baseClasses = `admin-table-td ${className} text-${align}`;
  
  if (isHeader) {
    return (
      <th className={baseClasses} scope="col">
        {children}
      </th>
    );
  }
  
  return (
    <td className={baseClasses}>
      {children}
    </td>
  );
}

interface AdminTableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function AdminTableHeaderCell({ 
  children, 
  className = '',
  align = 'left'
}: AdminTableHeaderCellProps) {
  const baseClasses = `admin-table-th ${className} text-${align}`;
  
  return (
    <th className={baseClasses} scope="col">
      {children}
    </th>
  );
}

// Status Badge Components
interface AdminTableStatusBadgeProps {
  children: React.ReactNode;
  status: 'success' | 'info' | 'warning' | 'error' | 'pending';
  className?: string;
}

export function AdminTableStatusBadge({ 
  children, 
  status, 
  className = ''
}: AdminTableStatusBadgeProps) {
  const statusClasses = {
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-orange-100 text-orange-700',
    error: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusClasses[status]} ${className}`}>
      {children}
    </span>
  );
}

// Action Cell Component
interface AdminTableActionCellProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminTableActionCell({ 
  children, 
  className = ''
}: AdminTableActionCellProps) {
  return (
    <td className={`admin-table-td ${className} text-right`}> 
      {children}
    </td>
  );
}

// Pagination Component
interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AdminTablePagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = ''
}: AdminTablePaginationProps) {
  const pages = [];
  
  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  
  return (
    <div className={`flex items-center justify-between py-4 px-6 border-t border-gray-100 ${className}`}>
      <div className="text-sm text-gray-500">
        Page {currentPage} sur {totalPages}
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Précédent
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg ${currentPage === page ? 'admin-btn-active' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="text-sm text-gray-500">
        {totalPages * 10} résultats
      </div>
    </div>
  );
}
