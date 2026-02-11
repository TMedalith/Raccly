'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperQuickView } from '@/features/papers/components/PaperQuickView';
import { usePapersFilter } from '@/features/papers/hooks/usePapersFilter';
import { FileText, Search, X, SlidersHorizontal, Calendar, Users, ExternalLink, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import type { PaperData } from '@/features/papers/types/paper';

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

  // Calculate min and max years from papers
  const allYears = filteredPapers.map(p => p.publication_year).filter(Boolean);
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);
  const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [sortColumn, setSortColumn] = useState<'title' | 'authors' | 'year' | 'journal' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const displayedPapers = filteredPapers.filter(paper =>
    (!searchQuery ||
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (paper.publication_year >= yearRange[0] && paper.publication_year <= yearRange[1])
  );

  // Calculate year counts
  const yearCounts: { [year: number]: number } = {};
  filteredPapers.forEach(paper => {
    const year = paper.publication_year;
    if (year) {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
  });

  const years = Object.keys(yearCounts)
    .map(Number)
    .sort((a, b) => b - a); // Descendente (más reciente primero)

  // Sorting
  const sortedPapers = [...displayedPapers].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue: string | number = '';
    let bValue: string | number = '';
    
    if (sortColumn === 'title') {
      aValue = a.title.toLowerCase();
      bValue = b.title.toLowerCase();
    } else if (sortColumn === 'authors') {
      aValue = (a.authors && a.authors.length > 0 ? a.authors[0]?.name || '' : '').toLowerCase();
      bValue = (b.authors && b.authors.length > 0 ? b.authors[0]?.name || '' : '').toLowerCase();
    } else if (sortColumn === 'year') {
      aValue = a.publication_year || 0;
      bValue = b.publication_year || 0;
    } else if (sortColumn === 'journal') {
      aValue = (a.journal || '').toLowerCase();
      bValue = (b.journal || '').toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPapers = sortedPapers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKeywords, yearRange]);

  const handleSort = (column: 'title' | 'authors' | 'year' | 'journal') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get top keywords for quick filters
  const topKeywords = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([keyword]) => keyword);

  const toggleKeyword = (keyword: string) => {
    const newKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    setSelectedKeywords(newKeywords);
    updateFilters({ keywords: newKeywords });
    setShowKeywordDropdown(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedKeywords([]);
    setYearRange([minYear, maxYear]);
    resetFilters();
  };

  // Filtrar keywords por búsqueda
  const filteredKeywordOptions = Object.entries(keywordCounts)
    .filter(([keyword]) => keyword.toLowerCase().includes(keywordSearch.toLowerCase()))
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_white_0%,_#fef9c3_100%)] ml-20">
      <div className="max-w-[1600px] mx-auto p-6 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-0.5 font-[family-name:var(--font-space-grotesk)] tracking-tight">
            Paper Explorer
          </h1>
          <p className="text-slate-500 text-sm font-[family-name:var(--font-inter)]">
            {totalPapers} research papers
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, abstract, or keywords..."
              className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4f78a]/50 focus:border-slate-900 transition-all bg-white text-slate-900 placeholder:text-slate-400 font-[family-name:var(--font-inter)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters - Horizontal Chips */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm font-semibold font-[family-name:var(--font-space-grotesk)] ${
                showFilters
                  ? 'bg-[#d4f78a] border-slate-900 text-slate-900 shadow-sm'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            
            <div className="h-5 w-px bg-slate-300" />
            
            {/* Year Range Display */}
            <button
              onClick={() => setShowFilters(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all font-[family-name:var(--font-inter)] ${
                yearRange[0] !== minYear || yearRange[1] !== maxYear
                  ? 'bg-[#d4f78a] text-slate-900 border-2 border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-2 border-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
              {yearRange[0]} - {yearRange[1]}
            </button>
            
            <div className="h-5 w-px bg-slate-300" />
            
            {/* Selected Keywords */}
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all font-[family-name:var(--font-inter)] bg-[#d4f78a] text-slate-900 border-2 border-slate-900 shadow-sm"
                >
                  {keyword}
                  <span className="ml-1.5 text-xs opacity-70">({keywordCounts[keyword]})</span>
                  <X className="w-3 h-3 inline ml-1.5" />
                </button>
              ))}
              
              {/* Add Keyword Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowKeywordDropdown(!showKeywordDropdown)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all font-[family-name:var(--font-inter)] bg-white text-slate-700 border-2 border-slate-900 hover:bg-slate-50"
                >
                  + Add Keyword
                </button>
                
                {showKeywordDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-slate-900 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                    <div className="p-3 border-b-2 border-slate-900">
                      <input
                        type="text"
                        value={keywordSearch}
                        onChange={(e) => setKeywordSearch(e.target.value)}
                        placeholder="Search keywords..."
                        className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4f78a]/50 text-sm"
                      />
                    </div>
                    <div className="overflow-y-auto max-h-80 custom-scrollbar">
                      {filteredKeywordOptions.map(([keyword, count]) => (
                        <button
                          key={keyword}
                          onClick={() => toggleKeyword(keyword)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                            selectedKeywords.includes(keyword) ? 'bg-[#d4f78a]' : ''
                          }`}
                        >
                          <span className="font-medium text-slate-900">{keyword}</span>
                          <span className="text-xs text-slate-500">({count})</span>
                        </button>
                      ))}
                      {filteredKeywordOptions.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-slate-500">
                          No keywords found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-500">
              <span className="font-semibold text-slate-900">{displayedPapers.length}</span> papers shown
            </p>
            {(searchQuery || selectedKeywords.length > 0 || yearRange[0] !== minYear || yearRange[1] !== maxYear) && (
              <button
                onClick={clearAllFilters}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm max-w-2xl">
                <div className="flex items-center gap-6">
                  <p className="text-sm text-slate-900 font-bold font-[family-name:var(--font-space-grotesk)] whitespace-nowrap">
                    Year Range
                  </p>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-slate-600 font-medium mb-1 block">From: {yearRange[0]}</label>
                      <input
                        type="range"
                        min={minYear}
                        max={maxYear}
                        value={yearRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin <= yearRange[1]) {
                            setYearRange([newMin, yearRange[1]]);
                          }
                        }}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4f78a]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-slate-600 font-medium mb-1 block">To: {yearRange[1]}</label>
                      <input
                        type="range"
                        min={minYear}
                        max={maxYear}
                        value={yearRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax >= yearRange[0]) {
                            setYearRange([yearRange[0], newMax]);
                          }
                        }}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#d4f78a]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Papers Table */}
        <main>
          {displayedPapers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-[family-name:var(--font-space-grotesk)]">
                No papers found
              </h3>
              <p className="text-slate-500 max-w-md mb-6">
                Try adjusting the filters or search term
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#d4f78a] text-slate-900 rounded-xl border-2 border-slate-900 hover:shadow-md transition-all font-[family-name:var(--font-space-grotesk)] font-semibold"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b-2 border-slate-900">
                    <tr>
                      <th 
                        onClick={() => handleSort('title')}
                        className="px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider w-[40%] font-[family-name:var(--font-space-grotesk)] cursor-pointer hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>Title</span>
                          {sortColumn === 'title' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('authors')}
                        className="px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider w-[18%] font-[family-name:var(--font-space-grotesk)] cursor-pointer hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>Authors</span>
                          {sortColumn === 'authors' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('year')}
                        className="px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider w-[8%] font-[family-name:var(--font-space-grotesk)] cursor-pointer hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>Year</span>
                          {sortColumn === 'year' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('journal')}
                        className="px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-wider w-[20%] font-[family-name:var(--font-space-grotesk)] cursor-pointer hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>Journal</span>
                          {sortColumn === 'journal' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 uppercase tracking-wider w-[7%] font-[family-name:var(--font-space-grotesk)]">
                        PDF
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 uppercase tracking-wider w-[7%] font-[family-name:var(--font-space-grotesk)]">
                        Link
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <AnimatePresence>
                      {paginatedPapers.map((paper, index) => (
                        <motion.tr
                          key={paper.paper_id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => setSelectedPaper(paper)}
                          className="hover:bg-[#d4f78a] cursor-pointer transition-colors group"
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 text-sm line-clamp-2 leading-tight font-[family-name:var(--font-space-grotesk)] group-hover:text-slate-700">
                              {paper.title}
                            </div>
                            {paper.keywords && paper.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {paper.keywords.slice(0, 3).map((kw) => (
                                  <span key={kw} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-medium">
                                    {kw}
                                  </span>
                                ))}
                                {paper.keywords.length > 3 && (
                                  <span className="text-xs text-slate-500 font-medium">+{paper.keywords.length - 3}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-slate-700 truncate font-[family-name:var(--font-inter)]">
                              {paper.authors && paper.authors.length > 0
                                ? `${paper.authors[0]?.name || 'Unknown'}${paper.authors.length > 1 ? ' et al.' : ''}`
                                : 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-slate-700 font-medium font-[family-name:var(--font-inter)]">
                              {paper.publication_year || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-slate-700 truncate font-[family-name:var(--font-inter)]" title={paper.journal}>
                              {paper.journal || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <a
                              href={`https://doi.org/${paper.doi}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d4f78a] text-slate-900 rounded-lg border-2 border-slate-900 hover:shadow-md transition-all font-semibold text-xs font-[family-name:var(--font-space-grotesk)]"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </a>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <a
                              href={`https://doi.org/${paper.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex p-1.5 hover:bg-[#d4f78a] rounded-lg transition-all border border-slate-300 hover:border-slate-900"
                            >
                              <ExternalLink className="w-4 h-4 text-slate-600 hover:text-slate-900" />
                            </a>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="border-t-2 border-slate-900 bg-slate-50 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-700 font-[family-name:var(--font-inter)]">
                  Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(endIndex, sortedPapers.length)}</span> of <span className="font-semibold text-slate-900">{sortedPapers.length}</span> papers
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-[#d4f78a] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-900" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - currentPage) <= 1) return true;
                        return false;
                      })
                      .map((page, index, arr) => (
                        <div key={page} className="flex items-center gap-1">
                          {index > 0 && arr[index - 1] !== page - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[36px] h-9 px-3 rounded-lg border-2 font-semibold text-sm font-[family-name:var(--font-space-grotesk)] transition-all ${
                              currentPage === page
                                ? 'bg-[#d4f78a] border-slate-900 text-slate-900 shadow-sm'
                                : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-[#d4f78a] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* QuickView Sidebar */}
        <PaperQuickView
          paper={selectedPaper}
          isOpen={!!selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      </div>
    </div>
  );
}
