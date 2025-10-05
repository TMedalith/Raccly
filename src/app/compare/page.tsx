'use client';

import { useResearch } from '@/shared/contexts/ResearchContext';
import { getAllPapers } from '@/shared/utils/paperReference';
import { useState, useMemo } from 'react';
import { X, Download, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useResearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPaper, setShowAddPaper] = useState(false);

  const allPapers = getAllPapers();
  const filteredPapers = useMemo(() => {
    if (!searchQuery) return allPapers.slice(0, 50);
    const query = searchQuery.toLowerCase();
    return allPapers.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.authors.some(a => a.name.toLowerCase().includes(query))
    ).slice(0, 20);
  }, [searchQuery, allPapers]);

  const handleExportComparison = () => {
    const headers = ['Aspect', ...compareList.map((_, i) => `Paper ${i + 1}`)];
    const rows = [
      ['Title', ...compareList.map(p => p.title)],
      ['Authors', ...compareList.map(p => p.authors.map(a => a.name).join('; '))],
      ['Year', ...compareList.map(p => p.publication_year || 'N/A')],
      ['Journal', ...compareList.map(p => p.journal)],
      ['Methodology', ...compareList.map(p => p.structured_data?.methodology?.study_design || 'N/A')],
      ['Sample Size', ...compareList.map(p => p.structured_data?.methodology?.sample_size || 'N/A')],
      ['Main Conclusion', ...compareList.map(p => p.structured_data?.main_conclusion || 'N/A')],
      ['Research Question', ...compareList.map(p => p.structured_data?.research_question || 'N/A')]
    ];

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paper_comparison.csv';
    a.click();
  };

  const similarities = useMemo(() => {
    if (compareList.length < 2) return [];
    const similar: string[] = [];

        const methodologies = compareList.map(p => p.structured_data?.methodology?.study_design);
    if (methodologies.every(m => m === methodologies[0] && m)) {
      similar.push(`All use ${methodologies[0]} methodology`);
    }

        const years = compareList.map(p => p.publication_year).filter(Boolean) as number[];
    if (years.length > 1) {
      const yearRange = Math.max(...years) - Math.min(...years);
      if (yearRange <= 2) {
        similar.push(`Published within ${yearRange} years (${Math.min(...years)}-${Math.max(...years)})`);
      }
    }

        const authorSets = compareList.map(p => new Set(p.authors.map(a => a.name)));
    const commonAuthors = Array.from(authorSets[0]).filter(author =>
      authorSets.every(set => set.has(author))
    );
    if (commonAuthors.length > 0) {
      similar.push(`Common authors: ${commonAuthors.join(', ')}`);
    }

    return similar;
  }, [compareList]);

  const conflicts = useMemo(() => {
    if (compareList.length < 2) return [];
    const conflicting: string[] = [];

        const methodologies = new Set(compareList.map(p => p.structured_data?.methodology?.study_design).filter(Boolean));
    if (methodologies.size > 1) {
      conflicting.push(`Different methodologies: ${Array.from(methodologies).join(', ')}`);
    }

        const conclusions = compareList.map(p => p.structured_data?.main_conclusion?.toLowerCase() || '');
    const hasPositive = conclusions.some(c => c.includes('increase') || c.includes('improve') || c.includes('enhance'));
    const hasNegative = conclusions.some(c => c.includes('decrease') || c.includes('reduce') || c.includes('inhibit'));
    if (hasPositive && hasNegative) {
      conflicting.push('Contradictory conclusions detected (increase vs. decrease effects)');
    }

    return conflicting;
  }, [compareList]);

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Papers</h1>
          <p className="text-gray-600 mb-8">Side-by-side comparison of research papers</p>

          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Papers to Compare</h2>
              <p className="text-gray-600 mb-6">
                Add papers from chat or search to start comparing. You can compare up to 5 papers at once.
              </p>
              <button
                onClick={() => setShowAddPaper(true)}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Browse Papers
              </button>
            </div>
          </div>
        </div>

                {showAddPaper && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Papers to Compare</h3>
                <button onClick={() => setShowAddPaper(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />

              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredPapers.map(paper => (
                  <div key={paper.paper_id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <h4 className="font-medium text-sm">{paper.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {paper.authors.slice(0, 2).map(a => a.name).join(', ')}
                      {paper.authors.length > 2 && ' et al.'} · {paper.publication_year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Papers</h1>
            <p className="text-gray-600">Comparing {compareList.length} paper{compareList.length > 1 ? 's' : ''}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportComparison}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={clearCompare}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Clear All
            </button>
          </div>
        </div>

                {(similarities.length > 0 || conflicts.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {similarities.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Similarities Found
                </h3>
                <ul className="space-y-1">
                  {similarities.map((sim, i) => (
                    <li key={i} className="text-sm text-green-700">• {sim}</li>
                  ))}
                </ul>
              </div>
            )}

            {conflicts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Potential Conflicts
                </h3>
                <ul className="space-y-1">
                  {conflicts.map((conf, i) => (
                    <li key={i} className="text-sm text-amber-700">• {conf}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 min-w-[150px]">
                    Aspect
                  </th>
                  {compareList.map((paper, index) => (
                    <th key={paper.paper_id} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 min-w-[300px]">
                      <div className="flex items-center justify-between">
                        <span>Paper {index + 1}</span>
                        <button
                          onClick={() => removeFromCompare(paper.paper_id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <ComparisonRow label="Title" values={compareList.map(p => p.title)} />
                <ComparisonRow label="Authors" values={compareList.map(p => p.authors.map(a => a.name).join(', '))} />
                <ComparisonRow label="Year" values={compareList.map(p => p.publication_year?.toString() || 'N/A')} />
                <ComparisonRow label="Journal" values={compareList.map(p => p.journal)} />
                <ComparisonRow
                  label="Methodology"
                  values={compareList.map(p => p.structured_data?.methodology?.study_design || 'Not specified')}
                />
                <ComparisonRow
                  label="Sample Size"
                  values={compareList.map(p => p.structured_data?.methodology?.sample_size || 'Not specified')}
                />
                <ComparisonRow
                  label="Research Question"
                  values={compareList.map(p => p.structured_data?.research_question || 'Not specified')}
                />
                <ComparisonRow
                  label="Main Conclusion"
                  values={compareList.map(p => p.structured_data?.main_conclusion || 'Not specified')}
                />
                <ComparisonRow
                  label="Keywords"
                  values={compareList.map(p => p.keywords.join(', ') || 'None')}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">
        {label}
      </td>
      {values.map((value, index) => (
        <td key={index} className="px-4 py-3 text-sm text-gray-600">
          {value}
        </td>
      ))}
    </tr>
  );
}
