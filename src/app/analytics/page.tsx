'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getAllPapers } from '@/shared/utils/paperReference';
import { TrendingUp, Users, BookOpen, Calendar, Building2, FlaskConical, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic import to avoid SSR issues with ECharts
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function AnalyticsPage() {
  const allPapers = getAllPapers();

  const selectedYears = useMemo(() => [] as number[], []);
  const selectedMethodology = 'all';

  const filteredPapers = useMemo(() => {
    return allPapers.filter(paper => {
      const yearMatch = selectedYears.length === 0 || (paper.publication_year && selectedYears.includes(paper.publication_year));
      const methodMatch = selectedMethodology === 'all' || paper.structured_data?.methodology?.study_design?.startsWith(selectedMethodology);
      return yearMatch && methodMatch;
    });
  }, [allPapers, selectedYears, selectedMethodology]);

  const analytics = useMemo(() => {
    const publicationsByYear = new Map<number, number>();
    filteredPapers.forEach(paper => {
      if (paper.publication_year) {
        publicationsByYear.set(
          paper.publication_year,
          (publicationsByYear.get(paper.publication_year) || 0) + 1
        );
      }
    });

    const yearlyData = Array.from(publicationsByYear.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, count]) => ({ year, papers: count }));

    const authorCounts = new Map<string, number>();
    filteredPapers.forEach(paper => {
      paper.authors?.forEach(author => {
        if (author?.name) {
          authorCounts.set(author.name, (authorCounts.get(author.name) || 0) + 1);
        }
      });
    });

    const topAuthors = Array.from(authorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    const journalCounts = new Map<string, number>();
    filteredPapers.forEach(paper => {
      if (paper.journal) {
        journalCounts.set(paper.journal, (journalCounts.get(paper.journal) || 0) + 1);
      }
    });

    const topJournals = Array.from(journalCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    const institutionCounts = new Map<string, number>();
    filteredPapers.forEach(paper => {
      paper.authors?.forEach(author => {
        if (author?.location?.institution) {
          institutionCounts.set(
            author.location.institution,
            (institutionCounts.get(author.location.institution) || 0) + 1
          );
        }
      });
    });

    const topInstitutions = Array.from(institutionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const methodologyCounts = new Map<string, number>();
    filteredPapers.forEach(paper => {
      const methodology = paper.structured_data?.methodology?.study_design;
      if (methodology && methodology.trim() !== '') {
        const methodType = methodology.split(' ')[0];
        methodologyCounts.set(methodType, (methodologyCounts.get(methodType) || 0) + 1);
      }
    });

    const methodologies = Array.from(methodologyCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    const keywordCounts = new Map<string, number>();
    filteredPapers.forEach(paper => {
      paper.keywords?.forEach(keyword => {
        if (keyword) {
          keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
        }
      });
    });

    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    return {
      yearlyData,
      topAuthors,
      topJournals,
      topInstitutions,
      methodologies,
      topKeywords,
      totalPapers: filteredPapers.length,
      totalAuthors: authorCounts.size,
      totalJournals: journalCounts.size,
      totalInstitutions: institutionCounts.size
    };
  }, [filteredPapers]);

  const statCards = [
    {
      icon: BookOpen,
      value: analytics.totalPapers,
      label: 'Total Papers',
      color: 'from-[#22D3EE] to-[#3B82F6]',
      bgColor: 'bg-gradient-to-br from-[#22D3EE]/10 to-[#3B82F6]/10',
      iconBg: 'bg-gradient-to-br from-[#22D3EE] to-[#3B82F6]',
      iconColor: 'text-white'
    },
    {
      icon: Users,
      value: analytics.totalAuthors,
      label: 'Unique Authors',
      color: 'from-[#C084FC] to-[#EC4899]',
      bgColor: 'bg-gradient-to-br from-[#C084FC]/10 to-[#EC4899]/10',
      iconBg: 'bg-gradient-to-br from-[#C084FC] to-[#EC4899]',
      iconColor: 'text-white'
    },
    {
      icon: BookOpen,
      value: analytics.totalJournals,
      label: 'Journals',
      color: 'from-[#4ADE80] to-[#10B981]',
      bgColor: 'bg-gradient-to-br from-[#4ADE80]/10 to-[#10B981]/10',
      iconBg: 'bg-gradient-to-br from-[#4ADE80] to-[#10B981]',
      iconColor: 'text-white'
    },
    {
      icon: Building2,
      value: analytics.totalInstitutions,
      label: 'Institutions',
      color: 'from-[#FBBF24] to-[#F59E0B]',
      bgColor: 'bg-gradient-to-br from-[#FBBF24]/10 to-[#F59E0B]/10',
      iconBg: 'bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]',
      iconColor: 'text-white'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-orbitron)]">
              Research Analytics
            </h1>
          </div>
          <p className="text-blue-200 text-lg font-[family-name:var(--font-space-grotesk)]">
            Advanced insights and interactive visualizations from the research database
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className={`${stat.bgColor} backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all shadow-lg hover:shadow-2xl`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div className="p-2 rounded-xl bg-green-500/20">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 font-[family-name:var(--font-orbitron)]`}>
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-blue-200/80 font-[family-name:var(--font-space-grotesk)]">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Publications Over Time */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white font-[family-name:var(--font-space-grotesk)]">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#3B82F6]">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Publications Over Time
            </h3>
            <ReactECharts
              option={{
                backgroundColor: 'transparent',
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b}: {c} papers',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#60a5fa',
                  textStyle: { color: '#fff' }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
                xAxis: {
                  type: 'category',
                  data: analytics.yearlyData.map(d => d.year),
                  boundaryGap: false,
                  axisLabel: { color: '#93c5fd' },
                  axisLine: { lineStyle: { color: '#1e3a8a' } }
                },
                yAxis: {
                  type: 'value',
                  axisLabel: { color: '#93c5fd' },
                  splitLine: { lineStyle: { color: '#1e3a8a', type: 'dashed' } }
                },
                series: [{
                  data: analytics.yearlyData.map(d => d.papers),
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    color: '#22d3ee',
                    width: 4,
                    shadowColor: 'rgba(34, 211, 238, 0.5)',
                    shadowBlur: 10
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 0, y2: 1,
                      colorStops: [
                        { offset: 0, color: 'rgba(34, 211, 238, 0.6)' },
                        { offset: 0.5, color: 'rgba(59, 130, 246, 0.3)' },
                        { offset: 1, color: 'rgba(59, 130, 246, 0)' }
                      ]
                    }
                  },
                  itemStyle: {
                    color: '#22d3ee',
                    borderColor: '#fff',
                    borderWidth: 2
                  },
                  emphasis: { focus: 'series' }
                }]
              }}
              style={{ height: '300px' }}
              opts={{ renderer: 'canvas' }}
            />
          </motion.div>

          {/* Top Authors */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white font-[family-name:var(--font-space-grotesk)]">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#C084FC] to-[#EC4899]">
                <Users className="w-5 h-5 text-white" />
              </div>
              Top Authors
            </h3>
            <ReactECharts
              option={{
                backgroundColor: 'transparent',
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' },
                  formatter: '{b}: {c} papers',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#c084fc',
                  textStyle: { color: '#fff' }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
                xAxis: {
                  type: 'value',
                  axisLabel: { color: '#c4b5fd' },
                  splitLine: { lineStyle: { color: '#1e3a8a', type: 'dashed' } }
                },
                yAxis: {
                  type: 'category',
                  data: analytics.topAuthors.map(a => a.name).reverse(),
                  axisLabel: {
                    color: '#e0e7ff',
                    formatter: (value: string) => value.length > 25 ? value.substring(0, 25) + '...' : value
                  },
                  axisLine: { lineStyle: { color: '#1e3a8a' } }
                },
                series: [{
                  data: analytics.topAuthors.map(a => a.value).reverse(),
                  type: 'bar',
                  itemStyle: {
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 1, y2: 0,
                      colorStops: [
                        { offset: 0, color: '#a78bfa' },
                        { offset: 1, color: '#c084fc' }
                      ]
                    },
                    borderRadius: [0, 8, 8, 0]
                  },
                  emphasis: {
                    itemStyle: {
                      color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                          { offset: 0, color: '#c084fc' },
                          { offset: 1, color: '#e879f9' }
                        ]
                      }
                    }
                  }
                }]
              }}
              style={{ height: '300px' }}
            />
          </motion.div>

          {/* Top Journals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white font-[family-name:var(--font-space-grotesk)]">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#10B981]">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              Top Journals
            </h3>
            <ReactECharts
              option={{
                backgroundColor: 'transparent',
                tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c} papers ({d}%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#34d399',
                  textStyle: { color: '#fff' }
                },
                legend: {
                  orient: 'vertical',
                  left: 'left',
                  textStyle: { color: '#a7f3d0' }
                },
                series: [{
                  type: 'pie',
                  radius: ['40%', '70%'],
                  center: ['60%', '50%'],
                  avoidLabelOverlap: true,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderWidth: 2
                  },
                  label: {
                    show: true,
                    formatter: '{d}%',
                    color: '#fff'
                  },
                  emphasis: {
                    label: { show: true, fontSize: 16, fontWeight: 'bold' }
                  },
                  data: analytics.topJournals.map((j, idx) => ({
                    value: j.value,
                    name: j.name,
                    itemStyle: {
                      color: ['#34d399', '#10b981', '#059669', '#047857', '#065f46'][idx]
                    }
                  }))
                }]
              }}
              style={{ height: '300px' }}
            />
          </motion.div>

          {/* Top Institutions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white font-[family-name:var(--font-space-grotesk)]">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Top Institutions
            </h3>
            <ReactECharts
              option={{
                backgroundColor: 'transparent',
                tooltip: {
                  formatter: (params: { name: string; value: number }) => `${params.name}: ${params.value} papers`,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#fb923c',
                  textStyle: { color: '#fff' }
                },
                series: [{
                  type: 'treemap',
                  data: analytics.topInstitutions.map(([name, value]) => ({
                    name,
                    value
                  })),
                  label: {
                    show: true,
                    formatter: '{b}',
                    fontSize: 11,
                    color: '#fff'
                  },
                  itemStyle: {
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderWidth: 2,
                    gapWidth: 2
                  },
                  levels: [{
                    itemStyle: {
                      borderWidth: 0,
                      gapWidth: 5
                    }
                  }, {
                    itemStyle: {
                      gapWidth: 1
                    },
                    colorSaturation: [0.35, 0.5]
                  }],
                  breadcrumb: { show: false },
                  roam: false,
                  nodeClick: false,
                  colorMappingBy: 'value',
                  visualDimension: 0,
                  visualMin: Math.min(...analytics.topInstitutions.map(i => i[1])),
                  visualMax: Math.max(...analytics.topInstitutions.map(i => i[1])),
                  colorAlpha: [0.6, 1],
                  color: ['#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412']
                }]
              }}
              style={{ height: '300px' }}
            />
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Research Methodologies */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white font-[family-name:var(--font-space-grotesk)]">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              Research Methodologies
            </h3>
            <ReactECharts
              option={{
                backgroundColor: 'transparent',
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' },
                  formatter: (params: Array<{ name: string; value: number }>) => {
                    const percentage = ((params[0].value / analytics.totalPapers) * 100).toFixed(1);
                    return `${params[0].name}: ${params[0].value} papers (${percentage}%)`;
                  },
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#fbbf24',
                  textStyle: { color: '#fff' }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
                xAxis: {
                  type: 'value',
                  axisLabel: { color: '#fde68a' },
                  splitLine: { lineStyle: { color: '#1e3a8a', type: 'dashed' } }
                },
                yAxis: {
                  type: 'category',
                  data: analytics.methodologies.map(m => m.name).reverse(),
                  axisLabel: {
                    color: '#fef3c7',
                    fontSize: 11
                  },
                  axisLine: { lineStyle: { color: '#1e3a8a' } }
                },
                series: [{
                  data: analytics.methodologies.map(m => m.value).reverse(),
                  type: 'bar',
                  itemStyle: {
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 1, y2: 0,
                      colorStops: [
                        { offset: 0, color: '#fbbf24' },
                        { offset: 1, color: '#f59e0b' }
                      ]
                    },
                    borderRadius: [0, 8, 8, 0]
                  },
                  emphasis: {
                    itemStyle: {
                      color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                          { offset: 0, color: '#fcd34d' },
                          { offset: 1, color: '#fbbf24' }
                        ]
                      }
                    }
                  }
                }]
              }}
              style={{ height: '300px' }}
            />
          </motion.div>

          {/* Top Keywords */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/30 transition-all shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white font-[family-name:var(--font-space-grotesk)]">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#8B5CF6]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Top Keywords
            </h3>
            <div className="flex flex-wrap gap-3">
              {analytics.topKeywords.map((keyword, index) => {
                const size = Math.min(12 + (keyword[1] / 10), 18);
                const colors = [
                  'from-cyan-400 to-blue-500',
                  'from-purple-400 to-pink-500',
                  'from-green-400 to-emerald-500',
                  'from-orange-400 to-red-500',
                  'from-yellow-400 to-orange-500'
                ];
                const color = colors[index % colors.length];
                return (
                  <motion.span
                    key={`keyword-${index}-${keyword[0]}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`px-4 py-2 bg-gradient-to-r ${color} rounded-full text-white font-medium hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm border border-white/20`}
                    style={{ fontSize: `${size}px` }}
                    title={`${keyword[1]} papers`}
                  >
                    {keyword[0]}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
