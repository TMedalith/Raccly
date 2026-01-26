'use client';

import {
  FileText, ExternalLink, ChevronLeft,
  Download, Copy,
  BarChart3, Users, Building2, Link as LinkIcon,
  FolderKanban, TrendingUp, Map as MapIcon
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { findPaperById } from '@/shared/utils/paperReference';
import { PaperDetailsCard } from './PaperDetailsCard';
import type { Paper } from '@/features/papers/types';
import type { PaperData } from '@/shared/utils/paperReference';
import { useResearch } from '@/shared/contexts/ResearchContext';
import { useRouter } from 'next/navigation';

interface RelatedPapersListProps {
  papers: Paper[];
  isLoading?: boolean;
  selectedPaperId?: string | null;
  citedPapers?: PaperData[];
}

export function RelatedPapersList({ papers, isLoading = false, selectedPaperId, citedPapers = [] }: RelatedPapersListProps) {
    const [viewingPaper, setViewingPaper] = useState<PaperData | null>(null);
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const { savedPapers, collections } = useResearch();
  const router = useRouter();

  useEffect(() => {
    if (selectedPaperId) {
      const paper = findPaperById(selectedPaperId);
      if (paper) {
        setViewingPaper(paper);
      }
    } else {
      setViewingPaper(null);
    }
  }, [selectedPaperId]);

  const allPapers = useMemo(() => {
    const paperIds = new Set<string>();
    const result: PaperData[] = [];

    citedPapers.forEach(paper => {
      if (!paperIds.has(paper.paper_id)) {
        paperIds.add(paper.paper_id);
        result.push(paper);
      }
    });

    papers.forEach(p => {
      const fullPaper = findPaperById(p.id);
      if (fullPaper && !paperIds.has(fullPaper.paper_id)) {
        paperIds.add(fullPaper.paper_id);
        result.push(fullPaper);
      }
    });

    return result;
  }, [papers, citedPapers]);

    const researchStats = useMemo(() => {
    const institutions = new Set<string>();
    const journals = new Set<string>();
    const methods = new Set<string>();

    allPapers.forEach(p => {
      p.authors?.forEach(a => {
        if (a.location?.institution) institutions.add(a.location.institution);
      });
      if (p.journal) journals.add(p.journal);
      p.structured_data?.methodology?.instruments_used?.forEach(i => methods.add(i));
    });

    const years = allPapers
      .map(p => p.publication_year)
      .filter(Boolean) as number[];

    return {
      totalPapers: allPapers.length,
      citedCount: citedPapers.length,
      institutions: institutions.size,
      journals: journals.size,
      methods: methods.size,
      yearRange: years.length > 0 ? `${Math.min(...years)}-${Math.max(...years)}` : 'N/A'
    };
  }, [allPapers, citedPapers]);

    const topInstitutions = useMemo(() => {
    const instCount = new Map<string, number>();
    allPapers.forEach(p => {
      p.authors?.forEach(a => {
        if (a.location?.institution) {
          instCount.set(a.location.institution, (instCount.get(a.location.institution) || 0) + 1);
        }
      });
    });

    return Array.from(instCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [allPapers]);

    const availableYears = useMemo(() => {
    const years = new Set(allPapers.map(p => p.publication_year).filter(Boolean));
    return Array.from(years).sort((a, b) => b! - a!);
  }, [allPapers]);

  const availableMethodologies = useMemo(() => {
    const methods = new Set<string>();
    allPapers.forEach(p => {
      const method = p.structured_data?.methodology?.study_design?.split(' ')[0];
      if (method) methods.add(method);
    });
    return Array.from(methods).sort();
  }, [allPapers]);

    const filteredPapers = useMemo(() => {
    return allPapers.filter(p => {
      const yearMatch = yearFilter === 'all' || p.publication_year?.toString() === yearFilter;
      const methodMatch = methodFilter === 'all' || p.structured_data?.methodology?.study_design?.startsWith(methodFilter);
      return yearMatch && methodMatch;
    });
  }, [allPapers, yearFilter, methodFilter]);

  const handleCopyDOI = (doi: string) => {
    navigator.clipboard.writeText(doi);
  };

  const handleExportAll = () => {
    // Export all filtered papers as BibTeX
    const bibtexEntries = filteredPapers.map(paper => {
      const authors = paper.authors.map(a => a.name).join(' and ');
      return `@article{${paper.paper_id},
  title={${paper.title}},
  author={${authors}},
  journal={${paper.journal}},
  year={${paper.publication_year}},
  doi={${paper.doi}}
}`;
    }).join('\n\n');

    const blob = new Blob([bibtexEntries], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research_papers_${new Date().toISOString().split('T')[0]}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (viewingPaper) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 bg-white/5 border-b border-white/20 backdrop-blur-xl">
          <button
            onClick={() => setViewingPaper(null)}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <PaperDetailsCard paper={viewingPaper} />
        </div>
      </div>
    );
  }

    if (allPapers.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-5 border-b border-white/20 bg-white/5 backdrop-blur-xl">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Research Papers
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Ask a question to find relevant papers
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[var(--primary)]" />
              Your Library
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-[var(--primary)]">{savedPapers.length}</div>
                <div className="text-xs text-gray-600 mt-1">Saved Papers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{collections.length}</div>
                <div className="text-xs text-gray-600 mt-1">Collections</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/workspace')}
              className="w-full mt-3 px-3 py-2 text-xs rounded-lg bg-white hover:bg-gray-50 border border-blue-200 transition-all"
            >
              Open Library
            </button>
          </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
              Explore
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/analytics')}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all text-xs flex items-center gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Research Analytics
              </button>
              <button
                onClick={() => router.push('/network')}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all text-xs flex items-center gap-2"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Citation Network
              </button>
              <button
                onClick={() => router.push('/map')}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all text-xs flex items-center gap-2"
              >
                <MapIcon className="w-3.5 h-3.5" />
                Geographic Map
              </button>
            </div>
          </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">💡 Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Save papers with the bookmark icon</li>
              <li>• Copy citations in multiple formats</li>
              <li>• Filter by year, methodology, or institution</li>
              <li>• Organize papers in collections</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

    if (isLoading && allPapers.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-5 border-b border-white/20 bg-white/5 backdrop-blur-xl">
          <h3 className="text-base font-semibold text-white">
            Related Papers
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-blue-200">Searching papers...</p>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/20 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Papers
            <span className="text-sm font-normal text-blue-200">
              ({filteredPapers.length})
            </span>
          </h3>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1 px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/20 rounded transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>

                {allPapers.length > 3 && (
          <div className="space-y-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-white/20 rounded-lg bg-white/10 text-white"
            >
              <option value="all" className="bg-[#0f1435]">All Years</option>
              {availableYears.map((year, index) => (
                <option key={`year-${year}-${index}`} value={year || ''} className="bg-[#0f1435]">{year}</option>
              ))}
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-white/20 rounded-lg bg-white/10 text-white"
            >
              <option value="all" className="bg-[#0f1435]">All Methodologies</option>
              {availableMethodologies.map((method, index) => (
                <option key={`method-${method}-${index}`} value={method} className="bg-[#0f1435]">{method}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-2 mb-4">
                    {citedPapers.filter(p => {
            const yearMatch = yearFilter === 'all' || p.publication_year?.toString() === yearFilter;
            const methodMatch = methodFilter === 'all' || p.structured_data?.methodology?.study_design?.startsWith(methodFilter);
            return yearMatch && methodMatch;
          }).map((paper) => (
            <PaperCard
              key={paper.paper_id}
              paper={paper}
              isCited
              onView={() => setViewingPaper(paper)}
              onCopyDOI={handleCopyDOI}
            />
          ))}

                    {filteredPapers
            .filter(p => !citedPapers.find(c => c.paper_id === p.paper_id))
            .map((paper) => (
              <PaperCard
                key={paper.paper_id}
                paper={paper}
                onView={() => setViewingPaper(paper)}
                onCopyDOI={handleCopyDOI}
              />
            ))}
        </div>

                {topInstitutions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
            <h4 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" />
              Top Institutions
            </h4>
            <div className="space-y-1.5">
              {topInstitutions.slice(0, 3).map(([inst, count]) => (
                <div key={inst} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 truncate flex-1 pr-2">{inst}</span>
                  <span className="text-[var(--primary)] font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-[var(--primary)]">{researchStats.citedCount}</div>
              <div className="text-xs text-gray-600">Cited</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{researchStats.journals}</div>
              <div className="text-xs text-gray-600">Journals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PaperCardProps {
  paper: PaperData;
  isCited?: boolean;
  onView: () => void;
  onCopyDOI: (doi: string) => void;
}

function PaperCard({ paper, isCited, onView, onCopyDOI }: PaperCardProps) {
    const methodology = paper.structured_data?.methodology?.study_design?.split(' ')[0] || 'Study';

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-lg border transition-all overflow-hidden group ${
      isCited
        ? 'border-cyan-400 shadow-sm'
        : 'border-white/20 hover:border-cyan-400'
    }`}>
      <button
        onClick={onView}
        className="w-full text-left p-3"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h5 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors flex-1">
            {paper.title}
          </h5>
          {isCited && (
            <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500 text-white">
              CITED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-blue-200 mb-1">
          {paper.publication_year && <span>{paper.publication_year}</span>}
          {paper.publication_year && paper.journal && paper.journal.trim() && <span>•</span>}
          {paper.journal && paper.journal.trim() && (
            <span className="truncate">{paper.journal}</span>
          )}
        </div>

        {paper.authors && paper.authors.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-blue-200/70">
            <Users className="w-3 h-3" />
            <span className="truncate">
              {paper.authors[0].location?.institution || paper.authors[0].name}
            </span>
          </div>
        )}
      </button>

      <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap">
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/20 rounded transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            PDF
          </a>
        )}

        {paper.doi && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyDOI(paper.doi);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-200 hover:bg-white/10 rounded transition-all"
          >
            <Copy className="w-3 h-3" />
            DOI
          </button>
        )}

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-blue-200">
          {methodology}
        </span>
      </div>
    </div>
  );
}
