'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Users, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PaperData } from '../types/paper';

interface PaperCardProps {
  paper: PaperData;
  viewMode?: 'grid' | 'list';
}

export function PaperCard({ paper }: PaperCardProps) {
  const router = useRouter();

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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/paper/${paperId}`)}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all cursor-pointer group hover:shadow-xl hover:shadow-cyan-500/20"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
              {paper.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
              {paper.authors && paper.authors.length > 0 && (
                <>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {paper.authors[0]?.name || 'Unknown'}
                    {paper.authors.length > 1 && ' et al.'}
                  </span>
                  <span>•</span>
                </>
              )}
              {paper.publication_year && (
                <>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {paper.publication_year}
                  </span>
                  {paper.journal && paper.journal.trim() && <span>•</span>}
                </>
              )}
              {paper.journal && paper.journal.trim() && (
                <span className="font-medium truncate max-w-[200px]">{paper.journal}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-cyan-400" />
            </a>
            <div className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Abstract Preview */}
        <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-3">
          {paper.abstract}
        </p>

        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {paper.keywords.slice(0, 4).map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              >
                {keyword}
              </span>
            ))}
            {paper.keywords.length > 4 && (
              <span className="px-3 py-1 text-xs font-medium text-white/60 bg-white/10 rounded-full border border-white/20">
                +{paper.keywords.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
