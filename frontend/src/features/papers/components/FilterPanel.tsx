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
    <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-lg p-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#d4f78a] border-2 border-slate-900">
            <SlidersHorizontal className="w-5 h-5 text-slate-900" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)]">Filters</h2>
        </div>
        <div className="text-sm font-medium text-slate-600">
          <span className="font-semibold text-slate-900">{totalFiltered}</span> / {totalPapers}
        </div>
      </div>

            <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
          placeholder="Search in title, abstract, conclusions..."
          className="w-full pl-10 pr-10 py-3 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4f78a]/50 focus:border-slate-900 transition-all text-sm bg-white text-slate-900 placeholder:text-slate-400"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onUpdateFilters({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        )}
      </div>

            <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Year Range: <span className="text-slate-900 font-bold">{filters.yearRange[0]} - {filters.yearRange[1]}</span>
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
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4f78a]"
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
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4f78a]"
          />
        </div>
      </div>

            <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border-2 border-slate-900"
      >
        <span className="text-sm font-semibold text-slate-900">Advanced Filters</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-900 transition-transform ${
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
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Keywords (<span className="font-bold">{filters.keywords.length}</span> selected)
            </label>
            <input
              type="text"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              placeholder="Search keyword..."
              className="w-full px-3 py-2 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4f78a]/50 mb-3 text-sm bg-white text-slate-900 placeholder:text-slate-400"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredKeywords.map((keyword) => (
                <label
                  key={keyword}
                  className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.keywords.includes(keyword)}
                      onChange={() => handleKeywordToggle(keyword)}
                      className="w-4 h-4 rounded border-slate-900 accent-[#d4f78a]"
                    />
                    <span className="text-sm text-slate-900">{keyword}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-900 bg-[#d4f78a] px-2 py-0.5 rounded-full border border-slate-900">
                    {keywordCounts[keyword] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

                    <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Study Design (<span className="font-bold">{filters.studyDesigns.length}</span> selected)
            </label>
            <input
              type="text"
              value={designSearch}
              onChange={(e) => setDesignSearch(e.target.value)}
              placeholder="Search design..."
              className="w-full px-3 py-2 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4f78a]/50 mb-3 text-sm bg-white text-slate-900 placeholder:text-slate-400"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredDesigns.map((design) => (
                <label
                  key={design}
                  className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.studyDesigns.includes(design)}
                      onChange={() => handleDesignToggle(design)}
                      className="w-4 h-4 rounded border-slate-900 accent-[#d4f78a]"
                    />
                    <span className="text-sm text-slate-900">{design}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-900 bg-[#d4f78a] px-2 py-0.5 rounded-full border border-slate-900">
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-colors border-2 border-slate-900"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </motion.button>
      )}
    </div>
  );
}
