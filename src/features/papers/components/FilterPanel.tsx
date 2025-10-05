'use client';

import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { PaperFilters } from '../types/paper';

interface FilterPanelProps {
  filters: PaperFilters;
  filterOptions: {
    keywords: string[];
    studyDesigns: string[];
    yearRange: [number, number];
  };
  keywordCounts: Record<string, number>;
  studyDesignCounts: Record<string, number>;
  onUpdateFilters: (updates: Partial<PaperFilters>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalPapers: number;
}

export function FilterPanel({
  filters,
  filterOptions,
  keywordCounts,
  studyDesignCounts,
  onUpdateFilters,
  onResetFilters,
  totalFiltered,
  totalPapers,
}: FilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [designSearch, setDesignSearch] = useState('');

  const filteredKeywords = filterOptions.keywords.filter((keyword) =>
    keyword.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  const filteredDesigns = filterOptions.studyDesigns.filter((design) =>
    design.toLowerCase().includes(designSearch.toLowerCase())
  );

  const handleKeywordToggle = (keyword: string) => {
    const newKeywords = filters.keywords.includes(keyword)
      ? filters.keywords.filter((k) => k !== keyword)
      : [...filters.keywords, keyword];
    onUpdateFilters({ keywords: newKeywords });
  };

  const handleDesignToggle = (design: string) => {
    const newDesigns = filters.studyDesigns.includes(design)
      ? filters.studyDesigns.filter((d) => d !== design)
      : [...filters.studyDesigns, design];
    onUpdateFilters({ studyDesigns: newDesigns });
  };

  const hasActiveFilters =
    filters.keywords.length > 0 ||
    filters.studyDesigns.length > 0 ||
    filters.searchQuery.length > 0 ||
    filters.yearRange[0] !== filterOptions.yearRange[0] ||
    filters.yearRange[1] !== filterOptions.yearRange[1];

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-bold text-[var(--foreground)]">Control de Misión</h2>
        </div>
        <div className="text-sm font-medium text-[var(--muted-foreground)]">
          {totalFiltered} / {totalPapers} papers
        </div>
      </div>

            <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
          placeholder="Buscar en título, abstract, conclusiones..."
          className="w-full pl-10 pr-10 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onUpdateFilters({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--secondary)] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        )}
      </div>

            <div>
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
          Rango de Años: {filters.yearRange[0]} - {filters.yearRange[1]}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={filterOptions.yearRange[0]}
            max={filterOptions.yearRange[1]}
            value={filters.yearRange[0]}
            onChange={(e) =>
              onUpdateFilters({
                yearRange: [parseInt(e.target.value), filters.yearRange[1]],
              })
            }
            className="w-full h-2 bg-[var(--secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
          <input
            type="range"
            min={filterOptions.yearRange[0]}
            max={filterOptions.yearRange[1]}
            value={filters.yearRange[1]}
            onChange={(e) =>
              onUpdateFilters({
                yearRange: [filters.yearRange[0], parseInt(e.target.value)],
              })
            }
            className="w-full h-2 bg-[var(--secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
        </div>
      </div>

            <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary)]/70 rounded-lg transition-colors"
      >
        <span className="text-sm font-semibold text-[var(--foreground)]">Filtros Avanzados</span>
        <ChevronDown
          className={`w-5 h-5 text-[var(--foreground)] transition-transform ${
            showAdvanced ? 'rotate-180' : ''
          }`}
        />
      </button>

            {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
                    <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Keywords ({filters.keywords.length} seleccionadas)
            </label>
            <input
              type="text"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              placeholder="Buscar keyword..."
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-3 text-sm"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredKeywords.map((keyword) => (
                <label
                  key={keyword}
                  className="flex items-center justify-between px-3 py-2 hover:bg-[var(--secondary)] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.keywords.includes(keyword)}
                      onChange={() => handleKeywordToggle(keyword)}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm text-[var(--foreground)]">{keyword}</span>
                  </div>
                  <span className="text-xs font-medium text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
                    {keywordCounts[keyword] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

                    <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Diseño de Estudio ({filters.studyDesigns.length} seleccionados)
            </label>
            <input
              type="text"
              value={designSearch}
              onChange={(e) => setDesignSearch(e.target.value)}
              placeholder="Buscar diseño..."
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-3 text-sm"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredDesigns.map((design) => (
                <label
                  key={design}
                  className="flex items-center justify-between px-3 py-2 hover:bg-[var(--secondary)] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.studyDesigns.includes(design)}
                      onChange={() => handleDesignToggle(design)}
                      className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="text-sm text-[var(--foreground)]">{design}</span>
                  </div>
                  <span className="text-xs font-medium text-[var(--muted-foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded-full">
                    {studyDesignCounts[design] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}

            {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--destructive)]/10 hover:bg-[var(--destructive)]/20 text-[var(--destructive)] rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restablecer Filtros
        </motion.button>
      )}
    </div>
  );
}
