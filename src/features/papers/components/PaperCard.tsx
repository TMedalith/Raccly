'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { PaperData } from '../types/paper';

interface PaperCardProps {
  paper: PaperData;
  viewMode?: 'grid' | 'list';
  onClick?: () => void;
}

export function PaperCard({ paper, onClick }: PaperCardProps) {
  // Extract just the number before the first dash (e.g., "002 - Title..." -> "002")
  const extractPaperId = (fullId: string): string => {
    const match = fullId.match(/^(\d+)\s*-/);
    return match ? match[1] : fullId;
  };

  const paperId = extractPaperId(paper.paper_id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 hover:border-[#d4f78a] hover:shadow-md transition-all cursor-pointer group h-[180px] flex flex-col"
    >
      <div className="p-5 flex flex-col h-full">
        {/* Title - Most prominent */}
        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 line-clamp-2 font-[family-name:var(--font-space-grotesk)] group-hover:text-slate-700 transition-colors">
          {paper.title}
        </h3>

        {/* Metadata - Subtle */}
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-auto">
          {paper.publication_year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {paper.publication_year}
            </span>
          )}
          {paper.journal && paper.journal.trim() && (
            <>
              <span>•</span>
              <span className="truncate flex-1 font-medium">{paper.journal}</span>
            </>
          )}
        </div>

        {/* Max 2 Keywords - Bottom */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {paper.keywords.slice(0, 2).map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200"
              >
                {keyword}
              </span>
            ))}
            {paper.keywords.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-slate-400">
                +{paper.keywords.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
