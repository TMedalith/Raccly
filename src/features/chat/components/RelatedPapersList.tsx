'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import type { Paper } from '@/features/papers/types';

interface RelatedPapersListProps {
  papers: Paper[];
  isLoading?: boolean;
}

export function RelatedPapersList({ papers, isLoading = false }: RelatedPapersListProps) {
  if (papers.length === 0 && !isLoading) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Papers Relacionados
        </h3>
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Los papers relacionados aparecerán aquí cuando hagas una pregunta
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
        Papers Relacionados
      </h3>

      {isLoading && papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
          <p className="text-sm text-[var(--muted-foreground)]">
            Buscando papers relacionados...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {papers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-white rounded-xl p-4 border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all">
                    {}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                        {Math.round(paper.relevance * 100)}% relevante
                      </span>
                      <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                    </div>

                    {}
                    <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                      {paper.title}
                    </h4>

                    {}
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">
                      {paper.authors.slice(0, 2).join(', ')}
                      {paper.authors.length > 2 && ` et al.`} · {paper.year}
                    </p>

                    {}
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-3">
                      {paper.abstract}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
