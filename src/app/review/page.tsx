'use client';

import { useState } from 'react';
import { useResearch } from '@/shared/contexts/ResearchContext';
import { findPaperById } from '@/shared/utils/paperReference';
import { Download, FileText, Sparkles } from 'lucide-react';
import { generateAPACitation } from '@/shared/utils/paperReference';

type Organization = 'chronological' | 'methodology' | 'topic';

export default function ReviewPage() {
  const { savedPapers } = useResearch();
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [organization, setOrganization] = useState<Organization>('chronological');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePaper = (paperId: string) => {
    setSelectedPapers(prev =>
      prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const generateReview = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const papers = selectedPapers.map(id => findPaperById(id)).filter(Boolean);

      let review = '';

      if (organization === 'chronological') {
        const sortedPapers = papers.sort((a, b) =>
          (a!.publication_year || 0) - (b!.publication_year || 0)
        );

        review = `# Literature Review\n\n## Chronological Overview\n\nRecent research on this topic has evolved significantly over the years. `;

        sortedPapers.forEach((paper, index) => {
          if (!paper) return;
          const citation = `[${index + 1}]`;
          review += `\n\n${paper.authors[0]?.name.split(' ').pop()} et al. (${paper.publication_year}) ${citation} investigated ${paper.structured_data?.research_question?.toLowerCase() || 'this topic'}. Their study found that ${paper.structured_data?.main_conclusion || 'significant results were observed'}.`;
        });

        review += `\n\n## Conclusions\n\nThe body of research demonstrates a clear progression in our understanding of this field.`;

      } else if (organization === 'methodology') {
        const byMethodology = new Map<string, typeof papers>();

        papers.forEach(paper => {
          if (!paper) return;
          const method = paper.structured_data?.methodology?.study_design || 'Other approaches';
          if (!byMethodology.has(method)) {
            byMethodology.set(method, []);
          }
          byMethodology.get(method)!.push(paper);
        });

        review = `# Literature Review\n\n## Methodological Approaches\n\n`;

        Array.from(byMethodology.entries()).forEach(([method, methodPapers]) => {
          review += `\n### ${method}\n\n`;
          methodPapers.forEach((paper, index) => {
            if (!paper) return;
            review += `${paper.authors[0]?.name.split(' ').pop()} et al. (${paper.publication_year}) [${index + 1}] used this approach to ${paper.structured_data?.research_question?.toLowerCase() || 'address the research question'}. `;
          });
        });

      } else {
        review = `# Literature Review\n\n## Thematic Analysis\n\n`;

        papers.forEach((paper, index) => {
          if (!paper) return;
          review += `\n### Study ${index + 1}: ${paper.title}\n\n`;
          review += `${paper.authors.map(a => a.name).join(', ')} (${paper.publication_year}) conducted a ${paper.structured_data?.methodology?.study_design?.toLowerCase() || 'study'} examining ${paper.structured_data?.research_question?.toLowerCase() || 'the research question'}. `;
          review += `The main finding was that ${paper.structured_data?.main_conclusion || 'significant results were observed'}.\n`;
        });
      }

      review += `\n\n## References\n\n`;
      papers.forEach((paper, index) => {
        if (!paper) return;
        review += `[${index + 1}] ${generateAPACitation(paper)}\n\n`;
      });

      setGeneratedText(review);
      setIsGenerating(false);
    }, 1500);
  };

  const exportReview = (format: 'word' | 'latex' | 'markdown') => {
    let content = generatedText;
    let filename = 'literature_review';
    let mimeType = 'text/plain';

    if (format === 'latex') {
      content = content
        .replace(/# /g, '\\section{')
        .replace(/\n/g, '}\n')
        .replace(/## /g, '\\subsection{')
        .replace(/### /g, '\\subsubsection{');
      filename += '.tex';
      mimeType = 'application/x-latex';
    } else if (format === 'markdown') {
      filename += '.md';
      mimeType = 'text/markdown';
    } else {
      filename += '.txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
                <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Literature Review Assistant</h1>
          <p className="text-gray-600">AI-powered tool to help you write your literature review</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-semibold">Select Papers</h3>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedPapers.map(paperId => {
                  const paper = findPaperById(paperId);
                  if (!paper) return null;

                  const isSelected = selectedPapers.includes(paperId);

                  return (
                    <button
                      key={paperId}
                      onClick={() => togglePaper(paperId)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-[var(--primary)] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{paper.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{paper.publication_year}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {savedPapers.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No saved papers yet</p>
                    <p className="text-xs text-gray-400 mt-1">Save papers to use them here</p>
                  </div>
                )}
              </div>

              {selectedPapers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {selectedPapers.length} paper{selectedPapers.length > 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>

                        <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-semibold">Choose Organization</h3>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setOrganization('chronological')}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    organization === 'chronological'
                      ? 'border-[var(--primary)] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm">Chronological</p>
                  <p className="text-xs text-gray-500 mt-1">Organize by publication year</p>
                </button>

                <button
                  onClick={() => setOrganization('methodology')}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    organization === 'methodology'
                      ? 'border-[var(--primary)] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm">By Methodology</p>
                  <p className="text-xs text-gray-500 mt-1">Group by research approach</p>
                </button>

                <button
                  onClick={() => setOrganization('topic')}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    organization === 'topic'
                      ? 'border-[var(--primary)] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm">By Topic</p>
                  <p className="text-xs text-gray-500 mt-1">Organize thematically</p>
                </button>
              </div>
            </div>

                        <button
              onClick={generateReview}
              disabled={selectedPapers.length === 0 || isGenerating}
              className="w-full px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Review
                </>
              )}
            </button>
          </div>

                    <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI-Generated Draft</h3>

              {generatedText && (
                <div className="flex gap-2">
                  <button
                    onClick={() => exportReview('markdown')}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Markdown
                  </button>
                  <button
                    onClick={() => exportReview('latex')}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    LaTeX
                  </button>
                  <button
                    onClick={() => exportReview('word')}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Text
                  </button>
                </div>
              )}
            </div>

            {generatedText ? (
              <div className="prose prose-sm max-w-none">
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full h-[600px] p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select papers and click &ldquo;Generate Review&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1">AI will create a structured literature review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
