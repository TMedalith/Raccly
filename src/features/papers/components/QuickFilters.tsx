'use client';

import { memo, useMemo } from 'react';
import { Filter, X, Calendar, Globe, SortDesc } from 'lucide-react';
import type { PaperData } from '@/shared/utils/paperReference';

export interface FilterState {
  yearRange?: [number, number] | null;
  countries?: string[];
  sortBy?: 'year' | 'relevance' | 'citations';
}

interface QuickFiltersProps {
  papers: PaperData[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export const QuickFilters = memo(function QuickFilters({
  papers,
  filters,
  onFiltersChange,
  className = ''
}: QuickFiltersProps) {
    const { years, countries } = useMemo(() => {
    const yearsSet = new Set<number>();
    const countriesSet = new Set<string>();

    papers.forEach((paper) => {
      if (paper.publication_year) {
        yearsSet.add(paper.publication_year);
      }
      if (paper.authors) {
        paper.authors.forEach((author) => {
          if (author.location?.country) {
            countriesSet.add(author.location.country);
          }
        });
      }
    });

    return {
      years: Array.from(yearsSet).sort((a, b) => b - a),
      countries: Array.from(countriesSet).sort()
    };
  }, [papers]);

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.yearRange) count++;
    if (filters.countries && filters.countries.length > 0) count++;
    if (filters.sortBy && filters.sortBy !== 'relevance') count++;
    return count;
  }, [filters]);

  const toggleCountry = (country: string) => {
    const currentCountries = filters.countries || [];
    const newCountries = currentCountries.includes(country)
      ? currentCountries.filter((c) => c !== country)
      : [...currentCountries, country];

    onFiltersChange({
      ...filters,
      countries: newCountries.length > 0 ? newCountries : undefined
    });
  };

  const setYearRange = (min: number, max: number) => {
    if (min === minYear && max === maxYear) {
      onFiltersChange({ ...filters, yearRange: null });
    } else {
      onFiltersChange({ ...filters, yearRange: [min, max] });
    }
  };

  const setSortBy = (sortBy: 'year' | 'relevance' | 'citations') => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    onFiltersChange({
      yearRange: null,
      countries: undefined,
      sortBy: 'relevance'
    });
  };

  if (papers.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--muted-foreground)]" />
          <span className="text-sm font-medium text-[var(--foreground)]">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)] text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

            <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
          <SortDesc className="w-3 h-3" />
          Ordenar por
        </div>
        <div className="flex gap-2">
          {(['relevance', 'year', 'citations'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                filters.sortBy === sort || (!filters.sortBy && sort === 'relevance')
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-[var(--foreground)] hover:bg-gray-200'
              }`}
            >
              {sort === 'relevance' ? 'Relevancia' : sort === 'year' ? 'Año' : 'Citas'}
            </button>
          ))}
        </div>
      </div>

            {years.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
            <Calendar className="w-3 h-3" />
            Rango de años
          </div>
          <div className="space-y-2">
            <div className="flex gap-2 text-xs">
              <input
                type="number"
                min={minYear}
                max={maxYear}
                value={filters.yearRange?.[0] || minYear}
                onChange={(e) => setYearRange(parseInt(e.target.value), filters.yearRange?.[1] || maxYear)}
                className="w-20 px-2 py-1 rounded border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
              <span className="flex items-center">-</span>
              <input
                type="number"
                min={minYear}
                max={maxYear}
                value={filters.yearRange?.[1] || maxYear}
                onChange={(e) => setYearRange(filters.yearRange?.[0] || minYear, parseInt(e.target.value))}
                className="w-20 px-2 py-1 rounded border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        </div>
      )}

            {countries.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
            <Globe className="w-3 h-3" />
            Países ({filters.countries?.length || 0} seleccionados)
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
            {countries.slice(0, 20).map((country) => {
              const isSelected = filters.countries?.includes(country);
              const count = papers.filter((p) =>
                p.authors?.some((a) => a.location?.country === country)
              ).length;

              return (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-50 text-[var(--foreground)] hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{country}</span>
                  <span className={`ml-2 ${isSelected ? 'text-white/80' : 'text-[var(--muted-foreground)]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
