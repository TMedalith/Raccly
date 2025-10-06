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
        <h3 className="text-lg font-bold text-[var(--foreground)] leading-tight mb-2">
          {paper.title}
        </h3>

                {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            <span>DOI: {paper.doi}</span>
          </a>
        )}
      </div>

            <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <Users className="w-4 h-4 text-[var(--primary)]" />
          <span>Autores</span>
        </div>
        <div className="space-y-1.5">
          {paper.authors.slice(0, 5).map((author, idx) => (
            <div key={idx} className="text-xs">
              <p className="font-medium text-[var(--foreground)]">{author.name}</p>
              <p className="text-[var(--muted-foreground)]">{author.affiliation}</p>
            </div>
          ))}
          {paper.authors.length > 5 && (
            <p className="text-xs text-[var(--muted-foreground)] italic">
              +{paper.authors.length - 5} más
            </p>
          )}
        </div>
      </div>

            <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-900">Year</span>
          </div>
          <p className="text-sm font-bold text-blue-700">{paper.publication_year}</p>
        </div>

        {paper.journal && paper.journal.trim() && (
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">Journal</span>
            </div>
            <p className="text-xs font-medium text-purple-700 line-clamp-2">{paper.journal}</p>
          </div>
        )}
      </div>

            <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <FileText className="w-4 h-4 text-[var(--primary)]" />
          <span>Abstract</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar">
          <p className="text-xs text-[var(--foreground)] leading-relaxed">
            {paper.abstract}
          </p>
        </div>
      </div>

            {paper.keywords && paper.keywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Tag className="w-4 h-4 text-[var(--primary)]" />
            <span>Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {paper.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

            {paper.structured_data?.research_question && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Target className="w-4 h-4 text-orange-600" />
            <span>Pregunta de Investigación</span>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-orange-900 leading-relaxed">
              {paper.structured_data.research_question}
            </p>
          </div>
        </div>
      )}

            {paper.structured_data?.main_conclusion && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Conclusión Principal</span>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-900 leading-relaxed">
              {paper.structured_data.main_conclusion}
            </p>
          </div>
        </div>
      )}

            {paper.structured_data?.methodology && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Beaker className="w-4 h-4 text-[var(--primary)]" />
            <span>Metodología</span>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 space-y-2">
            {paper.structured_data.methodology.study_design && (
              <div>
                <p className="text-xs font-semibold text-indigo-900">Design:</p>
                <p className="text-xs text-indigo-700">{paper.structured_data.methodology.study_design}</p>
              </div>
            )}
            {paper.structured_data.methodology.sample_size && (
              <div>
                <p className="text-xs font-semibold text-indigo-900">Muestra:</p>
                <p className="text-xs text-indigo-700">{paper.structured_data.methodology.sample_size}</p>
              </div>
            )}
            {paper.structured_data.methodology.instruments_used && paper.structured_data.methodology.instruments_used.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-indigo-900 mb-1">Instrumentos:</p>
                <div className="flex flex-wrap gap-1">
                  {paper.structured_data.methodology.instruments_used.map((instrument, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-indigo-200 text-indigo-800 text-xs rounded"
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
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
            <span>Resultados Cuantitativos</span>
          </div>
          <div className="space-y-2">
            {paper.structured_data.quantitative_results.slice(0, 3).map((result, idx) => (
              <div key={idx} className="bg-teal-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-teal-900 mb-1">
                  {result.variable_name.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-teal-700 mb-1">{result.effect_description}</p>
                {result.effect_size !== null && (
                  <p className="text-xs text-teal-600">
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
              <p className="text-xs font-semibold text-[var(--foreground)] mb-1.5">Tecnologías:</p>
              <div className="flex flex-wrap gap-1">
                {paper.semantic_data.technologies_applied.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {paper.semantic_data.key_concepts && paper.semantic_data.key_concepts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)] mb-1.5">Conceptos clave:</p>
              <div className="flex flex-wrap gap-1">
                {paper.semantic_data.key_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full"
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
