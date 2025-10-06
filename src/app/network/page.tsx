'use client';

import { useMemo, useState } from 'react';
import { getAllPapers } from '@/shared/utils/paperReference';
import { Download, Filter, Search, X } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  val: number;
  color: string;
  year?: number;
}

interface NetworkLink {
  source: string;
  target: string;
}

export default function NetworkPage() {
    const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allPapers = getAllPapers();

    const networkData = useMemo(() => {
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];
    const nodeMap = new Map<string, NetworkNode>();

        allPapers.forEach(paper => {
      if (filterYear && paper.publication_year !== filterYear) return;
      if (searchQuery && !paper.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const node: NetworkNode = {
        id: paper.paper_id,
        name: paper.title,
        val: 5,
        color: paper.publication_year && paper.publication_year > 2020 ? '#6366f1' : '#94a3b8',
        year: paper.publication_year || undefined
      };

      nodeMap.set(paper.paper_id, node);
      nodes.push(node);
    });

        const papersByAuthor = new Map<string, string[]>();
    allPapers.forEach(paper => {
      if (!nodeMap.has(paper.paper_id)) return;
      if (!paper.authors || !Array.isArray(paper.authors)) return;

      paper.authors.forEach(author => {
        if (!author || !author.name) return;
        if (!papersByAuthor.has(author.name)) {
          papersByAuthor.set(author.name, []);
        }
        papersByAuthor.get(author.name)!.push(paper.paper_id);
      });
    });

        papersByAuthor.forEach(paperIds => {
      if (paperIds.length > 1) {
        for (let i = 0; i < paperIds.length; i++) {
          for (let j = i + 1; j < Math.min(i + 3, paperIds.length); j++) {
            if (nodeMap.has(paperIds[i]) && nodeMap.has(paperIds[j])) {
              links.push({
                source: paperIds[i],
                target: paperIds[j]
              });
            }
          }
        }
      }
    });

    return { nodes, links };
  }, [allPapers, filterYear, searchQuery]);

  const stats = useMemo(() => {
    const citationCounts = new Map<string, number>();

    networkData.links.forEach(link => {
      citationCounts.set(link.target, (citationCounts.get(link.target) || 0) + 1);
    });

    const topPapers = Array.from(citationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([paperId, count]) => ({
        paper: allPapers.find(p => p.paper_id === paperId),
        citations: count
      }))
      .filter(item => item.paper);

    return {
      totalNodes: networkData.nodes.length,
      totalLinks: networkData.links.length,
      topPapers
    };
  }, [networkData, allPapers]);

  const handleExportNetwork = () => {
    const graphData = {
      nodes: networkData.nodes.map(n => ({
        id: n.id,
        label: n.name,
        year: n.year
      })),
      edges: networkData.links.map((l, i) => ({
        id: `e${i}`,
        source: l.source,
        target: l.target
      }))
    };

    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citation_network.json';
    a.click();
  };

  const years = useMemo(() => {
    const yearSet = new Set(allPapers.map(p => p.publication_year).filter(Boolean));
    return Array.from(yearSet).sort((a, b) => b! - a!) as number[];
  }, [allPapers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] p-6 pt-24">
      <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Citation Network</h1>
            <p className="text-gray-600">Explore relationships between research papers</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleExportNetwork}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

                {showFilters && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Papers</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Year</label>
                <select
                  value={filterYear || ''}
                  onChange={(e) => setFilterYear(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {(searchQuery || filterYear) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterYear(null);
                }}
                className="mt-3 text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Papers</p>
            <p className="text-2xl font-bold text-[var(--primary)]">{stats.totalNodes}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Connections</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalLinks}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Density</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalNodes > 0
                ? ((stats.totalLinks / (stats.totalNodes * (stats.totalNodes - 1))) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Network Visualization</h3>
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 p-8">
                <svg className="w-full h-full">
                  {networkData.links.slice(0, 100).map((link, i) => {
                    const sourceNode = networkData.nodes.find(n => n.id === link.source);
                    const targetNode = networkData.nodes.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;

                    const sourceIndex = networkData.nodes.indexOf(sourceNode);
                    const targetIndex = networkData.nodes.indexOf(targetNode);

                    const x1 = (sourceIndex % 20) * 40 + 50;
                    const y1 = Math.floor(sourceIndex / 20) * 40 + 50;
                    const x2 = (targetIndex % 20) * 40 + 50;
                    const y2 = Math.floor(targetIndex / 20) * 40 + 50;

                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#cbd5e1"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    );
                  })}

                  {networkData.nodes.slice(0, 100).map((node, i) => {
                    const x = (i % 20) * 40 + 50;
                    const y = Math.floor(i / 20) * 40 + 50;

                    return (
                      <circle
                        key={node.id}
                        cx={x}
                        cy={y}
                        r="6"
                        fill={node.color}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => console.log('Selected node:', node.id)}
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/80 px-3 py-1 rounded-lg">
                Showing {Math.min(100, networkData.nodes.length)} of {networkData.nodes.length} papers
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
                <span className="text-gray-600">Recent (2021+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Older</span>
              </div>
            </div>
          </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Most Connected Papers</h3>
            <div className="space-y-4">
              {stats.topPapers.map(({ paper, citations }, index) => {
                if (!paper) return null;

                return (
                  <div key={paper.paper_id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{paper.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{paper.publication_year}</p>
                        <p className="text-xs text-[var(--primary)] mt-1">{citations} connections</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {stats.topPapers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No connections found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
