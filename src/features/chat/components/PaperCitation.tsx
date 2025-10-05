'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  generateAPACitation,
  generateBibTeXCitation,
  generateMLACitation,
  generateChicagoCitation,
  type PaperData,
} from '@/shared/utils/paperReference';

interface PaperCitationProps {
  paper: PaperData;
}

type CitationFormat = 'APA' | 'BibTeX' | 'MLA' | 'Chicago';

export function PaperCitation({ paper }: PaperCitationProps) {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('APA');
  const [copied, setCopied] = useState(false);

  const getCitation = (format: CitationFormat): string => {
    switch (format) {
      case 'APA':
        return generateAPACitation(paper);
      case 'BibTeX':
        return generateBibTeXCitation(paper);
      case 'MLA':
        return generateMLACitation(paper);
      case 'Chicago':
        return generateChicagoCitation(paper);
    }
  };

  const handleCopy = async () => {
    const citation = getCitation(selectedFormat);
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const citation = getCitation(selectedFormat);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[var(--foreground)]">Citar este paper</h4>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-[var(--border)] rounded-md hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

            <div className="flex gap-2">
        {(['APA', 'BibTeX', 'MLA', 'Chicago'] as CitationFormat[]).map((format) => (
          <button
            key={format}
            onClick={() => setSelectedFormat(format)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedFormat === format
                ? 'bg-[var(--primary)] text-white'
                : 'bg-white text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-gray-50'
            }`}
          >
            {format}
          </button>
        ))}
      </div>

            <div className="bg-white rounded-md p-3 border border-[var(--border)]">
        <p className={`text-xs ${selectedFormat === 'BibTeX' ? 'font-mono' : ''} text-[var(--foreground)] whitespace-pre-wrap`}>
          {citation}
        </p>
      </div>
    </div>
  );
}
