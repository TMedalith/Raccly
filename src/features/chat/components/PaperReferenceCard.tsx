'use client';

import { ExternalLink, FileText } from 'lucide-react';
import type { PaperData } from '@/shared/utils/paperReference';

interface PaperReferenceCardProps {
  paper: PaperData;
  index: number;
  onClick?: () => void;
}

export function PaperReferenceCard({ paper, index, onClick }: PaperReferenceCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 hover:border-[var(--primary)] transition-all group"
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h5 className="text-xs font-semibold text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              {paper.title}
            </h5>
            <FileText className="flex-shrink-0 w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
            {paper.authors.length > 2 && ' et al.'} ({paper.publication_year})
          </p>
          {paper.doi && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">Ver en sidebar</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
