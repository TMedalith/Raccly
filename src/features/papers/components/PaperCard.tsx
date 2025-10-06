'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Lightbulb, FlaskConical, Users, Calendar } from 'lucide-react';
import type { PaperData } from '../types/paper';

interface PaperCardProps {
  paper: PaperData;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  viewMode?: 'grid' | 'list';
}

export function PaperCard({ paper, isExpanded = false, onToggleExpand }: PaperCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: isExpanded ? 1 : 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onToggleExpand}
      className={`bg-white rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all cursor-pointer ${
        isExpanded ? 'col-span-full ring-2 ring-[var(--primary)]' : ''
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-base font-bold text-[var(--foreground)] leading-tight mb-2 line-clamp-2">
              {paper.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted-foreground)]">
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
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 p-1.5 hover:bg-[var(--secondary)] rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[var(--primary)]" />
          </a>
        </div>

                {paper.structured_data?.research_question && (
          <div className="mb-3 p-3 bg-[var(--secondary)]/50 rounded-lg">
            <div className="flex items-start gap-2">
              <FlaskConical className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--foreground)] line-clamp-2">
                {paper.structured_data.research_question}
              </p>
            </div>
          </div>
        )}

                {paper.structured_data?.main_conclusion && (
          <div className="mb-3 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--foreground)] font-medium line-clamp-2">
                {paper.structured_data.main_conclusion}
              </p>
            </div>
          </div>
        )}

                {paper.keywords && paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {paper.keywords.slice(0, 5).map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-0.5 text-xs font-medium rounded bg-[var(--primary)]/10 text-[var(--primary)]"
              >
                {keyword}
              </span>
            ))}
            {paper.keywords.length > 5 && (
              <span className="px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                +{paper.keywords.length - 5}
              </span>
            )}
          </div>
        )}

                {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[var(--border)] pt-4 mt-4 space-y-4"
          >
                        <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Abstract</h4>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{paper.abstract}</p>
            </div>

                        {paper.structured_data?.methodology && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Methodology</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paper.structured_data.methodology.study_design && (
                    <div className="text-sm">
                      <span className="font-medium text-[var(--foreground)]">Study Design:</span>{' '}
                      <span className="text-[var(--muted-foreground)]">
                        {paper.structured_data.methodology.study_design}
                      </span>
                    </div>
                  )}
                  {paper.structured_data.methodology.sample_size && (
                    <div className="text-sm">
                      <span className="font-medium text-[var(--foreground)]">Sample Size:</span>{' '}
                      <span className="text-[var(--muted-foreground)]">
                        {paper.structured_data.methodology.sample_size}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

                        {paper.structured_data?.quantitative_results && paper.structured_data.quantitative_results.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Key Findings</h4>
                <div className="space-y-2">
                  {paper.structured_data.quantitative_results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        result.direction === 'Positive'
                          ? 'bg-green-50 border-green-200'
                          : result.direction === 'Negative'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-semibold text-[var(--foreground)] mb-1">
                        {result.variable_name}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">{result.effect_description}</p>
                      {result.effect_size && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          Effect: {result.effect_size} {result.units}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

                        {paper.authors && paper.authors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Authors & Affiliations</h4>
                <div className="space-y-2">
                  {paper.authors.map((author, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-[var(--foreground)]">{author?.name || 'Unknown'}</span>
                      <span className="text-[var(--muted-foreground)]"> - {author?.location?.institution || 'Unknown'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
