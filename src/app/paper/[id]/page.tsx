'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Users, BookOpen, Tag, Download, Share2 } from 'lucide-react';
import { findPaperById, type PaperData } from '@/shared/utils/paperReference';

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paper, setPaper] = useState<PaperData | null>(null);

  useEffect(() => {
    console.log('Looking for paper with ID:', params.id);
    const foundPaper = findPaperById(params.id);
    console.log('Found paper:', foundPaper);
    setPaper(foundPaper || null);
  }, [params.id]);

  if (!paper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Paper not found</div>
          <div className="text-white/60 mb-6">ID: {params.id}</div>
          <button
            onClick={() => router.push('/explore')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Back to Explorer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] pt-24">
      <div className="max-w-5xl mx-auto p-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to papers</span>
        </motion.button>

        {/* Paper Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-[family-name:var(--font-orbitron)]">
            {paper.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-6">
            {paper.publication_year && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-white/80">{paper.publication_year}</span>
              </div>
            )}
            {paper.journal && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-white/80">{paper.journal}</span>
              </div>
            )}
            {paper.authors && paper.authors.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-white/80">{paper.authors.length} authors</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {paper.doi && (
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Publisher
              </a>
            )}
            <button className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>

        {/* Authors Section */}
        {paper.authors && paper.authors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-orbitron)]">
              Authors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paper.authors.map((author, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {author.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{author.name}</p>
                    {author.location?.institution && (
                      <p className="text-white/60 text-sm">{author.location.institution}</p>
                    )}
                    {author.location?.country && (
                      <p className="text-white/40 text-xs">{author.location.country}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Abstract */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-orbitron)]">
            Abstract
          </h2>
          <p className="text-white/80 leading-relaxed text-lg">
            {paper.abstract}
          </p>
        </motion.div>

        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-orbitron)] flex items-center gap-2">
              <Tag className="w-6 h-6" />
              Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-sm hover:bg-cyan-500/30 transition-colors cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quantitative Results */}
        {paper.structured_data?.quantitative_results && paper.structured_data.quantitative_results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-orbitron)]">
              Quantitative Results
            </h2>
            <div className="space-y-4">
              {paper.structured_data.quantitative_results.map((result, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-white font-semibold">{result.variable_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      result.direction === 'Positive' ? 'bg-green-500/20 text-green-400' :
                      result.direction === 'Negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {result.direction}
                    </span>
                  </div>
                  <p className="text-white/70">{result.effect_description}</p>
                  {result.effect_size && (
                    <p className="text-white/60 text-sm mt-1">
                      Effect Size: {result.effect_size} {result.units || ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Methodology */}
        {paper.structured_data?.methodology && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-orbitron)]">
              Methodology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paper.structured_data.methodology.study_design && (
                <div>
                  <p className="text-white/60 text-sm mb-1">Study Design</p>
                  <p className="text-white font-medium">{paper.structured_data.methodology.study_design}</p>
                </div>
              )}
              {paper.structured_data.methodology.sample_size && (
                <div>
                  <p className="text-white/60 text-sm mb-1">Sample Size</p>
                  <p className="text-white font-medium">{paper.structured_data.methodology.sample_size}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Research Question & Conclusion */}
        {paper.structured_data && (paper.structured_data.research_question || paper.structured_data.main_conclusion) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {paper.structured_data.research_question && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-3 font-[family-name:var(--font-orbitron)]">
                  Research Question
                </h3>
                <p className="text-white/80 leading-relaxed">{paper.structured_data.research_question}</p>
              </div>
            )}
            {paper.structured_data.main_conclusion && (
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-3 font-[family-name:var(--font-orbitron)]">
                  Main Conclusion
                </h3>
                <p className="text-white/80 leading-relaxed">{paper.structured_data.main_conclusion}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
