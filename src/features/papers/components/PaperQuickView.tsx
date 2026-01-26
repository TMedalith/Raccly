'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Users, Calendar, FileText, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PaperData } from '../types/paper';

interface PaperQuickViewProps {
  paper: PaperData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaperQuickView({ paper, isOpen, onClose }: PaperQuickViewProps) {
  const router = useRouter();

  if (!paper) return null;

  const extractPaperId = (fullId: string): string => {
    const match = fullId.match(/^(\d+)\s*-/);
    return match ? match[1] : fullId;
  };

  const handleViewFull = () => {
    const paperId = extractPaperId(paper.paper_id);
    router.push(`/paper/${paperId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-sm font-semibold text-slate-900 font-[family-name:var(--font-space-grotesk)]">
                Quick View
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight font-[family-name:var(--font-space-grotesk)]">
                  {paper.title}
                </h1>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {paper.authors && paper.authors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>
                      {paper.authors[0]?.name || 'Unknown'}
                      {paper.authors.length > 1 && ` et al. (${paper.authors.length})`}
                    </span>
                  </div>
                )}
                {paper.publication_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{paper.publication_year}</span>
                  </div>
                )}
                {paper.journal && paper.journal.trim() && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{paper.journal}</span>
                  </div>
                )}
              </div>

              {/* Keywords */}
              {paper.keywords && paper.keywords.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 text-sm rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Abstract */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Abstract
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {paper.abstract}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleViewFull}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#d4f78a] text-slate-900 rounded-xl border-2 border-slate-900 hover:shadow-md transition-all font-semibold font-[family-name:var(--font-space-grotesk)]"
                >
                  <span>View Full Details</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {paper.doi && (
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-900 rounded-xl border-2 border-slate-900 hover:shadow-md transition-all font-semibold font-[family-name:var(--font-space-grotesk)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open DOI</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
