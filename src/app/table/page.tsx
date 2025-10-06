'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import papersData from '@/shared/services/papers.json';

interface QuantitativeResult {
  variable_name: string;
  effect_size?: number;
  effect_description: string;
  direction: 'Positive' | 'Negative' | 'Neutral';
  units?: string;
}

interface Paper {
  paper_id: string;
  title: string;
  publication_year: number;
  keywords: string[];
  structured_data: {
    quantitative_results?: QuantitativeResult[];
  };
  semantic_data: {
    research_category: string;
  };
}

// Type guard to validate papers have essential data
function isValidPaper(paper: unknown): paper is Paper {
  const p = paper as Record<string, unknown>;
  return Boolean(
    p.title &&
    p.authors &&
    Array.isArray(p.authors) &&
    p.authors.length > 0 &&
    p.publication_year &&
    typeof p.publication_year === 'number' &&
    p.publication_year > 0 &&
    p.journal
  );
}

export default function TablePage() {
  // Filter out papers with missing essential data
  const papers = Object.values(papersData as Record<string, unknown>).filter(isValidPaper);

  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const hasQuantData = paper.structured_data?.quantitative_results &&
        paper.structured_data.quantitative_results.length > 0;
      return hasQuantData;
    });
  }, [papers]);

  const availableMetrics = useMemo(() => {
    const metrics = new Set<string>();
    filteredPapers.forEach(paper => {
      paper.structured_data.quantitative_results?.forEach(result => {
        metrics.add(result.variable_name);
      });
    });
    return Array.from(metrics).sort();
  }, [filteredPapers]);



  useEffect(() => {
    if (availableMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(availableMetrics[0]);
    }
  }, [availableMetrics, selectedMetric]);

  const barChartData = useMemo(() => {
    if (!selectedMetric) return [];

    return filteredPapers
      .map(paper => {
        const result = paper.structured_data.quantitative_results?.find(
          r => r.variable_name === selectedMetric
        );
        return {
          title: paper.title.length > 35 ? paper.title.substring(0, 35) + '...' : paper.title,
          fullTitle: paper.title,
          value: result?.effect_size || 0,
          direction: result?.direction || 'Neutral',
          units: result?.units || '',
          description: result?.effect_description || '',
        };
      })
      .filter(item => item.value !== 0)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 10);
  }, [filteredPapers, selectedMetric]);

  const heatmapData = useMemo(() => {
    return filteredPapers.slice(0, 8).map(paper => {
      const row: Record<string, string | null> = {
        title: paper.title.length > 40 ? paper.title.substring(0, 40) + '...' : paper.title,
        fullTitle: paper.title,
      };

      availableMetrics.slice(0, 6).forEach(metric => {
        const result = paper.structured_data.quantitative_results?.find(
          r => r.variable_name === metric
        );
        row[metric] = result?.direction || null;
      });

      return row;
    });
  }, [filteredPapers, availableMetrics]);

  const getBarColor = (direction: string) => {
    switch (direction) {
      case 'Positive': return 'hsl(142, 76%, 36%)';
      case 'Negative': return 'hsl(0, 84%, 60%)';
      default: return 'hsl(210, 14%, 53%)';
    }
  };

  const getHeatmapColor = (direction: string | null) => {
    switch (direction) {
      case 'Positive': return 'bg-green-500';
      case 'Negative': return 'bg-red-500';
      case 'Neutral': return 'bg-gray-400';
      default: return 'bg-gray-200';
    }
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof barChartData[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[var(--border)] max-w-xs">
          <p className="font-semibold text-xs text-[var(--foreground)] mb-1.5">{data.fullTitle}</p>
          <p className="text-xs text-[var(--muted-foreground)] mb-1">
            <span className="font-medium">Effect:</span> {data.value.toFixed(2)} {data.units}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            <span className="font-medium">Direction:</span>{' '}
            <span className={`font-semibold ${data.direction === 'Positive' ? 'text-green-600' :
              data.direction === 'Negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
              {data.direction}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1535] pt-24">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-orbitron)]">
            Comparative Analysis
          </h1>
          <p className="text-lg text-blue-200 font-[family-name:var(--font-space-grotesk)]">
            Compare quantitative results across scientific studies
          </p>
        </motion.div>

        <div className="space-y-6">
          {availableMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl"
            >
              <label className="block mb-2">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  Metric for Comparison
                </span>
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all cursor-pointer backdrop-blur-xl"
              >
                {availableMetrics.map((metric, index) => (
                  <option key={`metric-${index}-${metric}`} value={metric} className="bg-[#0f1435] text-white">{metric}</option>
                ))}
              </select>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {barChartData.length > 0 ? (
              <motion.div
                key="bar-chart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Effect Size by Study
                </h3>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="title"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                      />
                      <YAxis
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                        label={{ value: 'Efecto', angle: -90, position: 'insideLeft', style: { fill: '#374151', fontSize: 11 } }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.direction)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center shadow-xl"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-cyan-400" />
                </div>
                <p className="text-white text-base font-semibold mb-2">
                  No data available for this metric
                </p>
                <p className="text-sm text-blue-200">
                  Try adjusting the filters or selecting another metric
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {heatmapData.length > 0 && availableMetrics.slice(0, 6).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Effect Direction
              </h3>

              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-52 flex-shrink-0"></div>
                    {availableMetrics.slice(0, 6).map(metric => (
                      <div
                        key={metric}
                        className="w-24 flex-shrink-0 text-[9px] font-semibold text-white text-center transform -rotate-45 origin-left mb-6"
                        title={metric}
                      >
                        {metric.length > 15 ? metric.substring(0, 15) + '...' : metric}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    {heatmapData.map((row, rowIndex) => (
                      <motion.div
                        key={row.fullTitle || rowIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIndex * 0.03 }}
                        className="flex gap-1.5 items-center"
                      >
                        <div className="w-52 flex-shrink-0">
                          <p className="text-[10px] font-medium text-white truncate" title={row.fullTitle || ''}>
                            {row.title}
                          </p>
                        </div>
                        {availableMetrics.slice(0, 6).map((metric, metricIndex) => (
                          <div
                            key={`${rowIndex}-${metricIndex}-${metric}`}
                            title={`${row.fullTitle} - ${metric}: ${row[metric] || 'No data'}`}
                            className={`w-24 h-10 flex-shrink-0 rounded transition-all duration-200 hover:scale-105 cursor-pointer ${getHeatmapColor(row[metric])
                              } ${!row[metric] ? 'opacity-30' : ''}`}
                          />
                        ))}
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-xs text-blue-200">Positive</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-xs text-blue-200">Negative</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <span className="text-xs text-blue-200">Neutral</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
