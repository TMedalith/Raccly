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
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white font-[family-name:var(--font-orbitron)]">Filters</h2>
        </div>
        <div className="text-sm font-medium text-blue-200">
          <span className="font-semibold text-cyan-400">{totalFiltered}</span> / {totalPapers}
        </div>
      </div>

            <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
          placeholder="Search in title, abstract, conclusions..."
          className="w-full pl-10 pr-10 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all text-sm bg-white/5 text-white placeholder:text-blue-200/50"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onUpdateFilters({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-blue-200" />
          </button>
        )}
      </div>

            <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Year Range: <span className="text-cyan-400">{filters.yearRange[0]} - {filters.yearRange[1]}</span>
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
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
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
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

            <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
      >
        <span className="text-sm font-semibold text-white">Advanced Filters</span>
        <ChevronDown
          className={`w-5 h-5 text-white transition-transform ${
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
            <label className="block text-sm font-semibold text-white mb-2">
              Keywords (<span className="text-cyan-400">{filters.keywords.length}</span> selected)
            </label>
            <input
              type="text"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              placeholder="Search keyword..."
              className="w-full px-3 py-2 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 mb-3 text-sm bg-white/5 text-white placeholder:text-blue-200/50"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredKeywords.map((keyword) => (
                <label
                  key={keyword}
                  className="flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.keywords.includes(keyword)}
                      onChange={() => handleKeywordToggle(keyword)}
                      className="w-4 h-4 rounded border-white/20 accent-cyan-500"
                    />
                    <span className="text-sm text-white">{keyword}</span>
                  </div>
                  <span className="text-xs font-medium text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                    {keywordCounts[keyword] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

                    <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Study Design (<span className="text-cyan-400">{filters.studyDesigns.length}</span> selected)
            </label>
            <input
              type="text"
              value={designSearch}
              onChange={(e) => setDesignSearch(e.target.value)}
              placeholder="Search design..."
              className="w-full px-3 py-2 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 mb-3 text-sm bg-white/5 text-white placeholder:text-blue-200/50"
            />
            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
              {filteredDesigns.map((design) => (
                <label
                  key={design}
                  className="flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.studyDesigns.includes(design)}
                      onChange={() => handleDesignToggle(design)}
                      className="w-4 h-4 rounded border-white/20 accent-cyan-500"
                    />
                    <span className="text-sm text-white">{design}</span>
                  </div>
                  <span className="text-xs font-medium text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </motion.button>
      )}
    </div>
  );
}
