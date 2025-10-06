'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterPanel } from '@/features/papers/components/FilterPanel';
import { PaperCard } from '@/features/papers/components/PaperCard';
import { usePapersFilter } from '@/features/papers/hooks/usePapersFilter';
import { FileText, Search, LayoutGrid, List, X } from 'lucide-react';
import { useAudio } from '@/shared/hooks/useAudio';

export default function ExplorePage() {
  const { play } = useAudio();
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

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Play audio guide when page loads - only once
  useEffect(() => {
    play(['On your le.mp3', 'In the cen.mp3']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedPapers = filteredPapers.filter(paper =>
    !searchQuery ||
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27]">
      <div className="max-w-[1600px] mx-auto p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 font-[family-name:var(--font-orbitron)] tracking-tight">
            Paper Explorer
          </h1>
          <p className="text-white/60 text-lg font-[family-name:var(--font-space-grotesk)] mb-6">
            Discover and explore scientific research papers
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, abstract, or keywords..."
                className="w-full pl-12 pr-12 py-4 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all bg-white/5 backdrop-blur-xl text-white placeholder:text-white/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 border border-white/20 rounded-2xl p-1 bg-white/5 backdrop-blur-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'text-white/60 hover:bg-white/10'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'text-white/60 hover:bg-white/10'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-white/60">
              <span className="font-semibold text-cyan-400">{displayedPapers.length}</span> {displayedPapers.length === 1 ? 'paper' : 'papers'} found
            </p>
            {(searchQuery || Object.values(filters).some(f => f.length > 0 || (Array.isArray(f) && f.length > 0))) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  resetFilters();
                }}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-[320px] flex-shrink-0">
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
          </aside>

          <main className="flex-1 min-w-0">
            {displayedPapers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 backdrop-blur-xl border border-white/20">
                  <FileText className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2 font-[family-name:var(--font-orbitron)]">
                  No papers found
                </h3>
                <p className="text-white/60 max-w-md mb-6">
                  Try adjusting the filters or search term
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    resetFilters();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
                >
                  Clear search
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={`grid gap-4 ${viewMode === 'list'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}
              >
                <AnimatePresence>
                  {displayedPapers.map((paper) => (
                    <PaperCard
                      key={paper.paper_id}
                      paper={paper}
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
