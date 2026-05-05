"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, X, Calendar, ChevronDown, RotateCcw } from "lucide-react";
import { 
  AdaptiveFilterConfig, 
  FilterState, 
  FilterResults, 
  FilterConfig,
  SearchFilter,
  TabFilter,
  DropdownFilter,
  DateRangeFilter,
  SortFilter
} from "@/types/filters";

interface AdaptiveFilterProps<T> {
  config: AdaptiveFilterConfig;
  data: T[];
  onFilterChange?: (filters: FilterState, results: FilterResults<T>) => void;
  onReset?: () => void;
  className?: string;
}

export function AdaptiveFilter<T>({
  config,
  data,
  onFilterChange,
  onReset,
  className = ""
}: AdaptiveFilterProps<T>) {
  const [filters, setFilters] = useState<FilterState>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize filters with default values
  useEffect(() => {
    const initialFilters: FilterState = {};
    config.filters.forEach((filter) => {
      if (filter.type === 'sort' && 'defaultOrder' in filter) {
        initialFilters[filter.type] = filter.options[0]?.value || '';
      } else if (filter.type === 'tab') {
        initialFilters[filter.type] = filter.options[0]?.value || '';
      }
    });
    setFilters(initialFilters);
  }, [config.filters]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let result = [...data];
    let hasActiveFilters = false;

    config.filters.forEach((filter) => {
      const filterValue = filters[filter.type];

      if (!filterValue || filterValue === 'all') return;

      hasActiveFilters = true;

      switch (filter.type) {
        case 'search':
          const searchFilter = filter as SearchFilter;
          result = result.filter((item) => {
            return searchFilter.fields.some((field) => {
              const value = getNestedValue(item, field);
              return value && 
                typeof value === 'string' && 
                value.toLowerCase().includes(filterValue.toLowerCase());
            });
          });
          break;

        case 'tab':
          const tabFilter = filter as TabFilter;
          if (filterValue !== 'all') {
            result = result.filter((item) => {
              if (filterValue === 'unread') {
                return !(item as any).is_read;
              } else if (filterValue === 'read') {
                return (item as any).is_read;
              } else if (filterValue === 'approved') {
                return (item as any).is_approved === true;
              } else if (filterValue === 'pending') {
                return (item as any).is_approved === false;
              }
              return true;
            });
          }
          break;

        case 'dropdown':
          const dropdownFilter = filter as DropdownFilter;
          if (filterValue && filterValue !== 'all') {
            result = result.filter((item) => {
              if (dropdownFilter.placeholder?.toLowerCase().includes('véhicule')) {
                return (item as any).car?.id === filterValue;
              } else if (dropdownFilter.placeholder?.toLowerCase().includes('type')) {
                return (item as any).type === filterValue;
              }
              return true;
            });
          }
          break;

        case 'dateRange':
          const dateFilter = filter as DateRangeFilter;
          if (filterValue?.from || filterValue?.to) {
            result = result.filter((item) => {
              const itemDate = new Date((item as any).created_at || (item as any).date);
              const fromDate = filterValue.from ? new Date(filterValue.from) : null;
              const toDate = filterValue.to ? new Date(filterValue.to) : null;
              
              if (fromDate && itemDate < fromDate) return false;
              if (toDate && itemDate > toDate) return false;
              return true;
            });
          }
          break;

        case 'sort':
          const sortFilter = filter as SortFilter;
          if (filterValue) {
            result.sort((a, b) => {
              const aValue = getNestedValue(a, filterValue);
              const bValue = getNestedValue(b, filterValue);
              const order = filters.order || sortFilter.defaultOrder || 'desc';
              
              if (aValue < bValue) return order === 'asc' ? -1 : 1;
              if (aValue > bValue) return order === 'asc' ? 1 : -1;
              return 0;
            });
          }
          break;
      }
    });

    return {
      data: result,
      total: data.length,
      filteredCount: result.length,
      hasFilters: hasActiveFilters
    };
  }, [data, filters, config.filters]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange?.(filters, filteredData);
  }, [filters, filteredData, onFilterChange]);

  const updateFilter = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    const initialFilters: FilterState = {};
    config.filters.forEach((filter) => {
      if (filter.type === 'sort' && 'defaultOrder' in filter) {
        initialFilters[filter.type] = filter.options[0]?.value || '';
      } else if (filter.type === 'tab') {
        initialFilters[filter.type] = filter.options[0]?.value || '';
      }
    });
    setFilters(initialFilters);
    onReset?.();
  };

  const renderFilter = (filter: FilterConfig) => {
    const filterValue = filters[filter.type];

    switch (filter.type) {
      case 'search':
        const searchFilter = filter as SearchFilter;
        return (
          <div className="relative flex-1">
            <Search 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder={searchFilter.placeholder}
              value={filterValue || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="admin-input pl-12"
            />
            {filterValue && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        );

      case 'tab':
        const tabFilter = filter as TabFilter;
        return (
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <div className="flex items-center gap-2">
              {tabFilter.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('tab', option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    filterValue === option.value
                      ? 'admin-btn-active'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'dropdown':
        const dropdownFilter = filter as DropdownFilter;
        return (
          <div className="relative">
            <select
              value={filterValue || ''}
              onChange={(e) => updateFilter('dropdown', e.target.value)}
              className="admin-input appearance-none pr-10"
            >
              <option value="">{dropdownFilter.placeholder}</option>
              {dropdownFilter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
        );

      case 'dateRange':
        const dateFilter = filter as DateRangeFilter;
        const dateValue = filterValue as { from?: string; to?: string } || {};
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                placeholder={dateFilter.fromPlaceholder || "Date début"}
                value={dateValue.from || ''}
                onChange={(e) => updateFilter('dateRange', { ...dateValue, from: e.target.value })}
                className="admin-input pl-10"
              />
            </div>
            <span className="text-gray-400">→</span>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                placeholder={dateFilter.toPlaceholder || "Date fin"}
                value={dateValue.to || ''}
                onChange={(e) => updateFilter('dateRange', { ...dateValue, to: e.target.value })}
                className="admin-input pl-10"
              />
            </div>
          </div>
        );

      case 'sort':
        const sortFilter = filter as SortFilter;
        return (
          <div className="flex items-center gap-2">
            <select
              value={filterValue || ''}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="admin-input"
            >
              {sortFilter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => updateFilter('order', filters.order === 'asc' ? 'desc' : 'asc')}
              className="admin-btn-icon p-2"
            >
              {filters.order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    value => value && value !== 'all' && !(typeof value === 'object' && !value.from && !value.to)
  ).length;

  return (
    <div className={`admin-card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
        <div className="flex items-center gap-2">
          {config.showReset && activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="admin-btn-icon flex items-center gap-2 px-3 py-1 text-sm"
            >
              <RotateCcw size={14} />
              Réinitialiser ({activeFiltersCount})
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="admin-btn-icon"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {isExpanded && (
        <div className="space-y-4">
          {config.layout === 'horizontal' ? (
            <div className="flex flex-wrap items-center gap-4">
              {config.filters.map((filter, index) => (
                <div key={index} className="flex-1 min-w-[200px]">
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          ) : config.layout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.filters.map((filter, index) => (
                <div key={index}>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {config.filters.map((filter, index) => (
                <div key={index}>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredData.hasFilters 
                ? `${filteredData.filteredCount} résultats sur ${filteredData.total}`
                : `${filteredData.total} éléments au total`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get nested object values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export default AdaptiveFilter;
