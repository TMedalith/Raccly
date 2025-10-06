'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Calendar,
  BookOpen,
  Tag,
  ExternalLink,
  TrendingUp,
  Beaker,
  Target,
  CheckCircle,
} from 'lucide-react';
import { PaperCitation } from './PaperCitation';
import type { PaperData } from '@/shared/utils/paperReference';

interface PaperDetailsCardProps {
  paper: PaperData;
}

export function PaperDetailsCard({ paper }: PaperDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
            <div>
        <h3 className="text-lg font-bold text-white leading-tight mb-2">
          {paper.title}
        </h3>

                {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
          >
            <ExternalLink className="w-3 h-3" />
            <span>DOI: {paper.doi}</span>
          </a>
        )}
      </div>

            <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Autors</span>
        </div>
        <div className="space-y-1.5">
          {paper.authors.slice(0, 5).map((author, idx) => (
            <div key={idx} className="text-xs">
              <p className="font-medium text-white">{author.name}</p>
              <p className="text-blue-200">{author.affiliation}</p>
            </div>
          ))}
          {paper.authors.length > 5 && (
            <p className="text-xs text-blue-200 italic">
              +{paper.authors.length - 5} más
            </p>
          )}
        </div>
      </div>

            <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-400/30">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-200">Year</span>
          </div>
          <p className="text-sm font-bold text-blue-300">{paper.publication_year}</p>
        </div>

        {paper.journal && paper.journal.trim() && (
          <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-400/30">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-200">Journal</span>
            </div>
            <p className="text-xs font-medium text-purple-300 line-clamp-2">{paper.journal}</p>
          </div>
        )}
      </div>

            <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Abstract</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar border border-white/20">
          <p className="text-xs text-white leading-relaxed">
            {paper.abstract}
          </p>
        </div>
      </div>

            {paper.keywords && paper.keywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {paper.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium border border-blue-400/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

            {paper.structured_data?.research_question && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Target className="w-4 h-4 text-orange-400" />
            <span>Pregunta de Investigación</span>
          </div>
          <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-400/30">
            <p className="text-xs text-orange-200 leading-relaxed">
              {paper.structured_data.research_question}
            </p>
          </div>
        </div>
      )}

            {paper.structured_data?.main_conclusion && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Conclusión Principal</span>
          </div>
          <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/30">
            <p className="text-xs text-green-200 leading-relaxed">
              {paper.structured_data.main_conclusion}
            </p>
          </div>
        </div>
      )}

            {paper.structured_data?.methodology && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Beaker className="w-4 h-4 text-cyan-400" />
            <span>Metodología</span>
          </div>
          <div className="bg-indigo-500/20 rounded-lg p-3 space-y-2 border border-indigo-400/30">
            {paper.structured_data.methodology.study_design && (
              <div>
                <p className="text-xs font-semibold text-indigo-200">Design:</p>
                <p className="text-xs text-indigo-300">{paper.structured_data.methodology.study_design}</p>
              </div>
            )}
            {paper.structured_data.methodology.sample_size && (
              <div>
                <p className="text-xs font-semibold text-indigo-200">Muestra:</p>
                <p className="text-xs text-indigo-300">{paper.structured_data.methodology.sample_size}</p>
              </div>
            )}
            {paper.structured_data.methodology.instruments_used && paper.structured_data.methodology.instruments_used.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-indigo-200 mb-1">Instrumentos:</p>
                <div className="flex flex-wrap gap-1">
                  {paper.structured_data.methodology.instruments_used.map((instrument, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-indigo-400/30 text-indigo-200 text-xs rounded"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

            {paper.structured_data?.quantitative_results && paper.structured_data.quantitative_results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Resultados Cuantitativos</span>
          </div>
          <div className="space-y-2">
            {paper.structured_data.quantitative_results.slice(0, 3).map((result, idx) => (
              <div key={idx} className="bg-teal-500/20 rounded-lg p-3 border border-teal-400/30">
                <p className="text-xs font-semibold text-teal-200 mb-1">
                  {result.variable_name.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-teal-300 mb-1">{result.effect_description}</p>
                {result.effect_size !== null && (
                  <p className="text-xs text-teal-300">
                    <span className="font-semibold">Efecto:</span> {result.effect_size} {result.units}
                    {result.direction && result.direction !== 'N/A' && ` (${result.direction})`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

            {paper.semantic_data && (
        <div className="space-y-3">
          {paper.semantic_data.technologies_applied && paper.semantic_data.technologies_applied.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-white mb-1.5">Tecnologías:</p>
              <div className="flex flex-wrap gap-1">
                {paper.semantic_data.technologies_applied.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-400/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {paper.semantic_data.key_concepts && paper.semantic_data.key_concepts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-white mb-1.5">Conceptos clave:</p>
              <div className="flex flex-wrap gap-1">
                {paper.semantic_data.key_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

            <PaperCitation paper={paper} />
    </motion.div>
  );
}
