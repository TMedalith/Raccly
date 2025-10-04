'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterPanel } from '@/features/papers/components/FilterPanel';
import { PaperCard } from '@/features/papers/components/PaperCard';
import { usePapersFilter } from '@/features/papers/hooks/usePapersFilter';
import { FileText, Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';

export default function ExplorePage() {
  const {
    filters,
    filterOptions,
    filteredPapers,
    keywordCounts,
    studyDesignCounts,
    updateFilters,
    resetFilters,
    totalPapers,
  } = usePapersFilter();

  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleToggleExpand = (paperId: string) => {
    setExpandedPaperId((prev) => (prev === paperId ? null : paperId));
  };

  const displayedPapers = filteredPapers.filter(paper =>
    !searchQuery ||
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full overflow-y-auto bg-[var(--background)]">
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Header con búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            Explorador de Papers
          </h1>

          {/* Barra de búsqueda y controles */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, abstract, o keywords..."
                className="w-full pl-12 pr-4 py-3 border-2 border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--secondary)] rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--muted-foreground)]" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl font-medium transition-all ${
                showFilters
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)]'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </button>

            <div className="flex items-center gap-1 border-2 border-[var(--border)] rounded-xl p-1 bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-[var(--muted-foreground)]">
              {displayedPapers.length} {displayedPapers.length === 1 ? 'paper' : 'papers'} encontrados
            </p>
            {(searchQuery || Object.values(filters).some(f => f.length > 0 || (Array.isArray(f) && f.length > 0))) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  resetFilters();
                }}
                className="text-[var(--primary)] hover:text-[var(--navy)] font-medium"
              >
                Limpiar todo
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Panel de filtros lateral (colapsable) */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-[280px]">
                  <FilterPanel
                    filters={filters}
                    filterOptions={filterOptions}
                    keywordCounts={keywordCounts}
                    studyDesignCounts={studyDesignCounts}
                    onUpdateFilters={updateFilters}
                    onResetFilters={resetFilters}
                    totalFiltered={filteredPapers.length}
                    totalPapers={totalPapers}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Papers Grid/List */}
          <main className="flex-1 min-w-0">
            {displayedPapers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  No se encontraron papers
                </h3>
                <p className="text-[var(--muted-foreground)] max-w-md mb-4">
                  Intenta ajustar los filtros o el término de búsqueda
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    resetFilters();
                  }}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--navy)] transition-colors"
                >
                  Limpiar búsqueda
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={`grid gap-4 ${
                  viewMode === 'list' || expandedPaperId
                    ? 'grid-cols-1'
                    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {displayedPapers.map((paper) => (
                    <PaperCard
                      key={paper.paper_id}
                      paper={paper}
                      isExpanded={expandedPaperId === paper.paper_id}
                      onToggleExpand={() => handleToggleExpand(paper.paper_id)}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
