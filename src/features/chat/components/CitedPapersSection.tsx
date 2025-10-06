'use client';

import { FileText, Users, Calendar } from 'lucide-react';
import type { PaperData } from '@/shared/utils/paperReference';
import { PaperQuickActions } from '@/features/papers/components/PaperQuickActions';

interface CitedPapersSectionProps {
  papers: PaperData[];
  onPaperClick?: (paperId: string) => void;
}

export function CitedPapersSection({ papers, onPaperClick }: CitedPapersSectionProps) {
  if (papers.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Cited Sources ({papers.length})
        </h4>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {papers.map((paper, index) => (
          <div
            key={paper.paper_id}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/20 hover:border-cyan-400 transition-all"
          >
            <div className="flex gap-3">
                            <div className="flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  {index + 1}
                </div>
              </div>

                            <div className="flex-1 min-w-0">
                <button
                  onClick={() => onPaperClick?.(paper.paper_id)}
                  className="text-left w-full"
                >
                  <h5 className="text-sm font-semibold text-white line-clamp-2 hover:text-cyan-400 transition-colors mb-1">
                    {paper.title}
                  </h5>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-200 mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>
                        {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
                        {paper.authors.length > 2 && ' et al.'}
                      </span>
                    </div>

                    {paper.publication_year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{paper.publication_year}</span>
                      </div>
                    )}
                  </div>
                </button>

                                <div onClick={(e) => e.stopPropagation()}>
                  <PaperQuickActions paper={paper} compact />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
