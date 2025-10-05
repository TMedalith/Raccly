'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { Download, Check, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import type { PaperData } from '@/shared/utils/paperReference';
import { generateAPACitation, generateBibTeXCitation } from '@/shared/utils/paperReference';

interface PaperQuickActionsProps {
  paper: PaperData;
  onCompare?: (paperId: string) => void;
  className?: string;
  compact?: boolean;
}

type CitationFormat = 'apa' | 'bibtex' | 'mla' | 'chicago';

export const PaperQuickActions = memo(function PaperQuickActions({
  paper,
  onCompare,
  className = '',
  compact = false
}: PaperQuickActionsProps) {
  const [showCitationMenu, setShowCitationMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCitationMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCitation = (format: CitationFormat): string => {
    switch (format) {
      case 'apa':
        return generateAPACitation(paper);
      case 'bibtex':
        return generateBibTeXCitation(paper);
      case 'mla':
        const authors = paper.authors.map(a => a.name).join(', ');
        return `${authors}. "${paper.title}." ${paper.journal}, ${paper.publication_year}. DOI: ${paper.doi}.`;
      case 'chicago':
        const firstAuthor = paper.authors[0]?.name || 'Unknown';
        const otherAuthors = paper.authors.slice(1).map(a => a.name).join(', ');
        return `${firstAuthor}${otherAuthors ? ', ' + otherAuthors : ''}. "${paper.title}." ${paper.journal} (${paper.publication_year}). https://doi.org/${paper.doi}.`;
      default:
        return generateAPACitation(paper);
    }
  };

  const handleCopyCitation = (format: CitationFormat) => {
    const citation = generateCitation(format);
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setShowCitationMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCitation = (format: CitationFormat) => {
    const citation = generateCitation(format);
    const extension = format === 'bibtex' ? 'bib' : 'txt';
    const blob = new Blob([citation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.paper_id}_${format}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowCitationMenu(false);
  };

  const handleOpenDOI = () => {
    if (paper.doi) {
      window.open(`https://doi.org/${paper.doi}`, '_blank');
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowCitationMenu(!showCitationMenu)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors group"
            title="Copy citation"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
            )}
          </button>

          {showCitationMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              <button
                onClick={() => handleCopyCitation('apa')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
              >
                Copy APA
              </button>
              <button
                onClick={() => handleCopyCitation('bibtex')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
              >
                Copy BibTeX
              </button>
              <button
                onClick={() => handleCopyCitation('mla')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
              >
                Copy MLA
              </button>
              <button
                onClick={() => handleCopyCitation('chicago')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
              >
                Copy Chicago
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleOpenDOI}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors group"
          title="Open DOI"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowCitationMenu(!showCitationMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--foreground)] transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Cite
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>

        {showCitationMenu && (
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b">Copy Citation</div>
            <button
              onClick={() => handleCopyCitation('apa')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
            >
              APA Format
            </button>
            <button
              onClick={() => handleCopyCitation('bibtex')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
            >
              BibTeX
            </button>
            <button
              onClick={() => handleCopyCitation('mla')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
            >
              MLA Format
            </button>
            <button
              onClick={() => handleCopyCitation('chicago')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
            >
              Chicago Style
            </button>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-t mt-1">Download</div>
            <button
              onClick={() => handleExportCitation('bibtex')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
            >
              <Download className="w-3 h-3 inline mr-1" />
              Export BibTeX
            </button>
            <button
              onClick={() => handleExportCitation('apa')}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors"
            >
              <Download className="w-3 h-3 inline mr-1" />
              Export APA
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleOpenDOI}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--foreground)] transition-all"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open DOI
      </button>
    </div>
  );
});
