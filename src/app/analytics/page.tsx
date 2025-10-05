'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getAllPapers } from '@/shared/utils/paperReference';
import { TrendingUp, Users, BookOpen, Calendar, Building2, FlaskConical } from 'lucide-react';

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
      const methodology = paper.structured_data?.methodology?.study_design?.split(' ')[0] || 'Unknown';
      methodologyCounts.set(methodology, (methodologyCounts.get(methodology) || 0) + 1);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Analytics</h1>
          <p className="text-gray-600">Advanced insights and interactive visualizations from the research database</p>
        </div>                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-[var(--primary)] opacity-20" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--primary)]">{analytics.totalPapers}</p>
            <p className="text-sm text-gray-600">Total Papers</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{analytics.totalAuthors}</p>
            <p className="text-sm text-gray-600">Unique Authors</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-green-600 opacity-20" />
            </div>
            <p className="text-2xl font-bold text-green-600">{analytics.totalJournals}</p>
            <p className="text-sm text-gray-600">Journals</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{analytics.totalInstitutions}</p>
            <p className="text-sm text-gray-600">Institutions</p>
          </div>
        </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Publications Over Time */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--primary)]" />
              Publications Over Time
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b}: {c} papers'
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
                xAxis: {
                  type: 'category',
                  data: analytics.yearlyData.map(d => d.year),
                  boundaryGap: false,
                  axisLabel: { color: '#6b7280' }
                },
                yAxis: {
                  type: 'value',
                  axisLabel: { color: '#6b7280' }
                },
                series: [{
                  data: analytics.yearlyData.map(d => d.papers),
                  type: 'line',
                  smooth: true,
                  lineStyle: { color: '#1e3a8a', width: 3 },
                  areaStyle: { color: 'rgba(30, 58, 138, 0.1)' },
                  itemStyle: { color: '#1e3a8a' },
                  emphasis: { focus: 'series' }
                }]
              }}
              style={{ height: '300px' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>

                    {/* Top Authors */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--primary)]" />
              Top Authors
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' },
                  formatter: '{b}: {c} papers'
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
                xAxis: {
                  type: 'value',
                  axisLabel: { color: '#6b7280' }
                },
                yAxis: {
                  type: 'category',
                  data: analytics.topAuthors.map(a => a.name).reverse(),
                  axisLabel: { 
                    color: '#1f2937',
                    formatter: (value: string) => value.length > 25 ? value.substring(0, 25) + '...' : value
                  }
                },
                series: [{
                  data: analytics.topAuthors.map(a => a.value).reverse(),
                  type: 'bar',
                  itemStyle: {
                    color: '#1e3a8a',
                    borderRadius: [0, 4, 4, 0]
                  },
                  emphasis: {
                    itemStyle: { color: '#3b82f6' }
                  }
                }]
              }}
              style={{ height: '300px' }}
            />
          </div>

                            {/* Top Journals */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--primary)]" />
              Top Journals
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'item',
                  formatter: '{b}: {c} papers ({d}%)'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left',
                  textStyle: { color: '#4b5563' }
                },
                series: [{
                  type: 'pie',
                  radius: ['40%', '70%'],
                  center: ['60%', '50%'],
                  avoidLabelOverlap: true,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                  },
                  label: {
                    show: true,
                    formatter: '{d}%'
                  },
                  emphasis: {
                    label: { show: true, fontSize: 16, fontWeight: 'bold' }
                  },
                  data: analytics.topJournals.map((j, idx) => ({
                    value: j.value,
                    name: j.name,
                    itemStyle: {
                      color: ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'][idx]
                    }
                  }))
                }]
              }}
              style={{ height: '300px' }}
            />
          </div>

          {/* Top Institutions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--primary)]" />
              Top Institutions
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  formatter: (params: { name: string; value: number }) => `${params.name}: ${params.value} papers`
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
                    borderColor: '#fff',
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
                  color: ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
                }]
              }}
              style={{ height: '300px' }}
            />
          </div>
        </div>

        {/* Charts Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Research Methodologies */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[var(--primary)]" />
              Research Methodologies
            </h3>
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'shadow' },
                  formatter: (params: Array<{ name: string; value: number }>) => {
                    const percentage = ((params[0].value / analytics.totalPapers) * 100).toFixed(1);
                    return `${params[0].name}: ${params[0].value} papers (${percentage}%)`;
                  }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
                xAxis: {
                  type: 'value',
                  axisLabel: { color: '#6b7280' }
                },
                yAxis: {
                  type: 'category',
                  data: analytics.methodologies.map(m => m.name).reverse(),
                  axisLabel: { 
                    color: '#1f2937',
                    fontSize: 11
                  }
                },
                series: [{
                  data: analytics.methodologies.map(m => m.value).reverse(),
                  type: 'bar',
                  itemStyle: {
                    color: '#10b981',
                    borderRadius: [0, 4, 4, 0]
                  },
                  emphasis: {
                    itemStyle: { color: '#059669' }
                  }
                }]
              }}
              style={{ height: '300px' }}
            />
          </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Top Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analytics.topKeywords.map((keyword, index) => {
                const size = Math.min(12 + (keyword[1] / 10), 20);
                return (
                  <span
                    key={`keyword-${index}-${keyword[0]}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all cursor-pointer"
                    style={{ fontSize: `${size}px` }}
                    title={`${keyword[1]} papers`}
                  >
                    {keyword[0]}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
