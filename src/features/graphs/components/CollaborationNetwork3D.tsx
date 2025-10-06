'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Users, FileText, Filter, Search, ZoomIn, ZoomOut, Maximize, X, Info } from 'lucide-react';
import type { NodeObject } from 'react-force-graph-3d';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface GraphNode {
  id: string;
  label: string;
  node_type: string;
  color?: string;
  community?: number;
  community_label?: string;
  year?: number;
  topic?: string;
  venue?: string;
  url?: string;
  source_pdf?: string;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  edge_type: string;
  weight?: number;
  author_order?: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface CollaborationNetwork3DProps {
  graphData: GraphData;
}

export function CollaborationNetwork3D({ graphData }: CollaborationNetwork3DProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fgRef = useRef<any>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<GraphLink>>(new Set());
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [filters, setFilters] = useState({
    showAuthored: true,
    showCoauthor: true,
    showSimilarity: true,
    selectedCommunities: new Set<number>(),
  });

    const availableCommunities = useMemo(() => {
    const communities = new Set<number>();
    graphData.nodes.forEach(n => {
      if (n.community !== undefined) communities.add(n.community);
    });
    return Array.from(communities).sort((a, b) => a - b);
  }, [graphData.nodes]);

    const filteredGraphData = useMemo(() => {
    const filteredNodes = graphData.nodes.filter((node) => {
            if (filters.selectedCommunities.size > 0 && node.community !== undefined) {
        if (!filters.selectedCommunities.has(node.community)) return false;
      }

      return true;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = graphData.links.filter((link) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;

      if (!nodeIds.has(sourceId) || !nodeIds.has(targetId)) return false;

      if (link.edge_type === 'authored' && !filters.showAuthored) return false;
      if (link.edge_type === 'coauthor' && !filters.showCoauthor) return false;
      if (link.edge_type === 'paper_similarity' && !filters.showSimilarity) return false;
      return true;
    });

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  }, [graphData, filters]);

    useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = filteredGraphData.nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(term) ||
        node.id.toLowerCase().includes(term) ||
        node.topic?.toLowerCase().includes(term) ||
        node.community_label?.toLowerCase().includes(term)
    ).slice(0, 10); 
    setSearchResults(results);
  }, [searchTerm, filteredGraphData.nodes]);

    const handleNodeHover = useCallback(
    (node: NodeObject | null) => {
      setHoverNode(node as GraphNode | null);
    },
    []
  );

    const handleNodeClick = useCallback(
    (node: NodeObject) => {
      const graphNode = node as GraphNode;
      if (selectedNode?.id === graphNode.id) {
        setSelectedNode(null);
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
        return;
      }

      const highlightNodes = new Set<string>();
      const highlightLinks = new Set<GraphLink>();

      highlightNodes.add(graphNode.id);

      filteredGraphData.links.forEach((link) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        if (sourceId === graphNode.id || targetId === graphNode.id) {
          highlightLinks.add(link);
          highlightNodes.add(sourceId);
          highlightNodes.add(targetId);
        }
      });

      setSelectedNode(graphNode);
      setHighlightNodes(highlightNodes);
      setHighlightLinks(highlightLinks);

            if (fgRef.current) {
        const distance = 200;
        fgRef.current.cameraPosition(
          { x: (graphNode as unknown as { x: number }).x, y: (graphNode as unknown as { y: number }).y, z: (graphNode as unknown as { z: number }).z + distance },
          graphNode as unknown as { x: number; y: number; z: number },
          1000
        );
      }
    },
    [filteredGraphData.links, selectedNode]
  );

    const focusOnNode = useCallback((node: GraphNode) => {
    setSearchTerm('');
    setSearchResults([]);
    handleNodeClick(node as unknown as NodeObject);
  }, [handleNodeClick]);

    const handleZoomIn = useCallback(() => {
    if (fgRef.current) {
      const currentPos = fgRef.current.cameraPosition();
      const distance = Math.sqrt(currentPos.x ** 2 + currentPos.y ** 2 + currentPos.z ** 2);
      const newDistance = distance * 0.7;       const ratio = newDistance / distance;
      fgRef.current.cameraPosition(
        { x: currentPos.x * ratio, y: currentPos.y * ratio, z: currentPos.z * ratio },
        { x: 0, y: 0, z: 0 },
        500
      );
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (fgRef.current) {
      const currentPos = fgRef.current.cameraPosition();
      const distance = Math.sqrt(currentPos.x ** 2 + currentPos.y ** 2 + currentPos.z ** 2);
      const newDistance = distance * 1.5;       const ratio = newDistance / distance;
      fgRef.current.cameraPosition(
        { x: currentPos.x * ratio, y: currentPos.y * ratio, z: currentPos.z * ratio },
        { x: 0, y: 0, z: 0 },
        500
      );
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: 0, y: 0, z: 1000 },
        { x: 0, y: 0, z: 0 },
        1500
      );
      setSelectedNode(null);
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
    }
  }, []);

    const toggleCommunity = useCallback((community: number) => {
    setFilters(prev => {
      const newCommunities = new Set(prev.selectedCommunities);
      if (newCommunities.has(community)) {
        newCommunities.delete(community);
      } else {
        newCommunities.add(community);
      }
      return { ...prev, selectedCommunities: newCommunities };
    });
  }, []);

    const hasActiveFilters = useMemo(() => {
    return (
      !filters.showAuthored ||
      !filters.showCoauthor ||
      !filters.showSimilarity ||
      filters.selectedCommunities.size > 0
    );
  }, [filters]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0f1115] via-[#141825] to-[#0f1115]">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xl px-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#6b7280] group-focus-within:text-[var(--primary)] transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nodes by name, topic or community..."
            className="w-full pl-12 pr-12 py-3.5 bg-[#171a21]/95 backdrop-blur-md border-2 border-[#2b3147] rounded-2xl text-[#e7e7e7] placeholder-[#6b7280] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all shadow-lg text-sm font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#232734] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#6b7280] hover:text-[#e7e7e7]" />
            </button>
          )}
        </div>

                {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-[#171a21]/98 backdrop-blur-sm border border-[#232734] rounded-xl overflow-hidden shadow-2xl">
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => focusOnNode(node)}
                    className="w-full px-4 py-3 text-left hover:bg-[#232734]/50 transition-colors border-b border-[#232734] last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      {node.node_type === 'author' ? (
                        <Users className="w-4 h-4 text-[#6b9cff] mt-0.5 flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#ff7b7b] mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#e7e7e7] font-medium truncate">{node.label}</p>
                        <div className="flex gap-2 mt-1 text-xs text-[#a7aab2]">
                          <span>{node.node_type === 'paper' ? 'Paper' : 'Autor'}</span>
                          {node.year && <span>• {node.year}</span>}
                          {node.community_label && <span>• {node.community_label}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
          </div>
        )}
      </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2.5 bg-[#171a21]/90 backdrop-blur-sm border border-[#232734] rounded-lg hover:border-[var(--primary)] transition-colors group"
          title="Help"
        >
          <Info className="w-5 h-5 text-[#a7aab2] group-hover:text-[var(--primary)]" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-[#171a21]/90 backdrop-blur-sm border border-[#232734] rounded-lg hover:border-[var(--primary)] transition-colors group"
          title="Acercar"
        >
          <ZoomIn className="w-5 h-5 text-[#a7aab2] group-hover:text-[var(--primary)]" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-[#171a21]/90 backdrop-blur-sm border border-[#232734] rounded-lg hover:border-[var(--primary)] transition-colors group"
          title="Alejar"
        >
          <ZoomOut className="w-5 h-5 text-[#a7aab2] group-hover:text-[var(--primary)]" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2.5 bg-[#171a21]/90 backdrop-blur-sm border border-[#232734] rounded-lg hover:border-[var(--primary)] transition-colors group"
          title="Reiniciar vista"
        >
          <Maximize className="w-5 h-5 text-[#a7aab2] group-hover:text-[var(--primary)]" />
        </button>
      </div>

            {showHelp && (
        <div className="absolute top-20 right-4 z-20 w-80 bg-[#171a21]/98 backdrop-blur-sm border border-[#232734] rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#e7e7e7]">Cómo usar la red 3D</h3>
              <button onClick={() => setShowHelp(false)} className="text-[#a7aab2] hover:text-[#e7e7e7]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#a7aab2]">
              <div className="flex gap-2">
                <span className="font-semibold text-[var(--primary)] min-w-[80px]">Search:</span>
                <span>Usa la barra superior para encontrar nodos rápidamente</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-[var(--primary)] min-w-[80px]">Click:</span>
                <span>Selecciona un nodo para ver sus conexiones</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-[var(--primary)] min-w-[80px]">Arrastrar:</span>
                <span>Mueve el mouse para rotar la vista</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-[var(--primary)] min-w-[80px]">Scroll:</span>
                <span>Usa la rueda para hacer zoom</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-[var(--primary)] min-w-[80px]">Filters:</span>
                <span>Use the left panel to filter by type and community</span>
              </div>
            </div>
        </div>
      )}

            <div className="absolute top-4 left-4 z-10 bg-[#171a21]/95 backdrop-blur-md border border-[#2b3147] rounded-2xl shadow-2xl w-72 max-h-[calc(100vh-2rem)] flex flex-col">
                <div className="p-4 border-b border-[#232734]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--primary)]" />
              <h3 className="font-bold text-sm text-[#e7e7e7]">Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters({
                    showAuthored: true,
                    showCoauthor: true,
                    showSimilarity: true,
                    selectedCommunities: new Set(),
                  });
                }}
                className="text-xs text-[var(--primary)] hover:text-[#8fb9ff] font-medium"
              >
                Clear all
              </button>
            )}
          </div>

                    {(filteredGraphData.nodes.length < graphData.nodes.length || filteredGraphData.links.length < graphData.links.length) && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                <span className="text-[#a7aab2]">
                  <span className="text-[#e7e7e7] font-semibold">{filteredGraphData.nodes.length}</span>/{graphData.nodes.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#8fb9ff]" />
                <span className="text-[#a7aab2]">
                  <span className="text-[#e7e7e7] font-semibold">{filteredGraphData.links.length}</span> enlaces
                </span>
              </div>
            </div>
          )}
        </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 custom-scrollbar">

                <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#e7e7e7] mb-2">Connection Types</h4>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#232734]/30 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.showAuthored}
                onChange={(e) => setFilters({ ...filters, showAuthored: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-[#2a3042] bg-[#1e2230] text-[var(--primary)]"
              />
              <span className="text-xs text-[#e7e7e7]">Autoría</span>
              <span className="text-xs text-[#6b7280] ml-auto">autor → paper</span>
            </label>

            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#232734]/30 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.showCoauthor}
                onChange={(e) => setFilters({ ...filters, showCoauthor: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-[#2a3042] bg-[#1e2230] text-[var(--primary)]"
              />
              <span className="text-xs text-[#e7e7e7]">Co-autoría</span>
              <span className="text-xs text-[#6b7280] ml-auto">autor ↔ autor</span>
            </label>

            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#232734]/30 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.showSimilarity}
                onChange={(e) => setFilters({ ...filters, showSimilarity: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-[#2a3042] bg-[#1e2230] text-[var(--primary)]"
              />
              <span className="text-xs text-[#e7e7e7]">Similitud</span>
              <span className="text-xs text-[#6b7280] ml-auto">paper ↔ paper</span>
            </label>
          </div>
        </div>


                {availableCommunities.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#e7e7e7]">Communities</h4>
              {filters.selectedCommunities.size > 0 && (
                <button
                  onClick={() => setFilters({ ...filters, selectedCommunities: new Set() })}
                  className="text-xs font-medium text-[var(--primary)] hover:text-[#8fb9ff]"
                >
                  Clear ({filters.selectedCommunities.size})
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {availableCommunities.map((community) => {
                const communityNode = graphData.nodes.find(n => n.community === community);
                const count = graphData.nodes.filter(n => n.community === community).length;
                const label = communityNode?.community_label || `Community ${community}`;
                const isSelected = filters.selectedCommunities.has(community);

                return (
                  <button
                    key={community}
                    onClick={() => toggleCommunity(community)}
                    title={label}
                    className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-[var(--primary)]/20'
                        : 'hover:bg-[#232734]/30'
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: communityNode?.color || '#6b9cff' }}
                    />
                    <span className={`text-xs truncate flex-1 text-left ${isSelected ? 'text-[#e7e7e7] font-medium' : 'text-[#a7aab2]'}`}>
                      {label}
                    </span>
                    <span className={`text-xs font-semibold flex-shrink-0 ${isSelected ? 'text-[var(--primary)]' : 'text-[#6b7280]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </div>

            {(hoverNode || selectedNode) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-[#171a21]/98 backdrop-blur-sm border border-[#232734] rounded-xl p-5 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {(hoverNode || selectedNode)?.node_type === 'author' ? (
                    <div className="p-2 bg-[#6b9cff]/20 rounded-lg">
                      <Users className="w-5 h-5 text-[#6b9cff]" />
                    </div>
                  ) : (
                    <div className="p-2 bg-[#ff7b7b]/20 rounded-lg">
                      <FileText className="w-5 h-5 text-[#ff7b7b]" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-xs text-[#a7aab2] uppercase tracking-wide">
                      {(hoverNode || selectedNode)?.node_type === 'paper' ? 'Paper' : 'Autor'}
                    </span>
                    <p className="text-base text-[#fff] font-medium leading-relaxed mt-0.5">
                      {(hoverNode || selectedNode)?.label}
                    </p>
                  </div>
                </div>
                {selectedNode && (
                  <button
                    onClick={() => {
                      setSelectedNode(null);
                      setHighlightNodes(new Set());
                      setHighlightLinks(new Set());
                    }}
                    className="text-[#a7aab2] hover:text-[#e7e7e7] flex-shrink-0"
                    title="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                {(hoverNode || selectedNode)?.year && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232734]/50 rounded-lg">
                    <span className="text-[#a7aab2]">Year:</span>
                    <span className="text-[#e7e7e7] font-medium">{(hoverNode || selectedNode)?.year}</span>
                  </div>
                )}
                {(hoverNode || selectedNode)?.venue && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232734]/50 rounded-lg">
                    <span className="text-[#a7aab2]">Venue:</span>
                    <span className="text-[#e7e7e7] font-medium">{(hoverNode || selectedNode)?.venue}</span>
                  </div>
                )}
                {(hoverNode || selectedNode)?.url && (hoverNode || selectedNode)?.node_type === 'paper' && (
                  <a
                    href={(hoverNode || selectedNode)?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)]/30 hover:bg-[var(--primary)]/50 border border-[var(--primary)] rounded-lg transition-all"
                  >
                    <span className="text-[#a7aab2]">DOI:</span>
                    <span className="text-[#e7e7e7] font-medium underline">Ver paper →</span>
                  </a>
                )}
                {(hoverNode || selectedNode)?.community_label && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)]/20 border border-[var(--primary)] rounded-lg">
                    <span className="text-[#a7aab2]">Community:</span>
                    <span className="text-[#e7e7e7] font-medium">{(hoverNode || selectedNode)?.community_label}</span>
                  </div>
                )}
                {(hoverNode || selectedNode)?.topic && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232734]/50 rounded-lg">
                    <span className="text-[#a7aab2]">Tema:</span>
                    <span className="text-[#e7e7e7] font-medium">{(hoverNode || selectedNode)?.topic}</span>
                  </div>
                )}
              </div>

              {selectedNode && highlightNodes.size > 1 && (
                <div className="pt-2 border-t border-[#232734]">
                  <p className="text-xs text-[#a7aab2]">
                    <span className="font-semibold text-[var(--primary)]">{highlightNodes.size - 1}</span> {highlightNodes.size - 1 === 1 ? 'conexión encontrada' : 'conexiones encontradas'}
                  </p>
                </div>
              )}
            </div>
        </div>
      )}

            <div style={{ touchAction: 'none', width: '100%', height: '100%' }}>
        <ForceGraph3D
          ref={fgRef}
          graphData={filteredGraphData}
          nodeLabel={() => ''}
          nodeColor={(node) => {
            const graphNode = node as GraphNode;
            const isHighlighted = highlightNodes.has(graphNode.id);
            const isSelected = selectedNode?.id === graphNode.id;

            if (isSelected) return '#ffffff';

                        if (selectedNode && !isHighlighted) {
              return graphNode.node_type === 'paper'
                ? 'rgba(255, 123, 123, 0.15)'
                : 'rgba(107, 156, 255, 0.15)';
            }

            if (isHighlighted) {
              return graphNode.node_type === 'paper'
                ? '#ff9999'
                : '#8fb9ff';
            }

            if (graphNode.node_type === 'paper') {
              return graphNode.color || '#ff7b7b';
            }
            return graphNode.color || '#6b9cff';
          }}
          nodeRelSize={6}
          nodeVal={(node) => {
            const graphNode = node as GraphNode;
            const isSelected = selectedNode?.id === graphNode.id;
            const isHighlighted = highlightNodes.has(graphNode.id);

            if (isSelected) return 22;
            if (isHighlighted) return 12;

            return graphNode.node_type === 'paper' ? 8 : 5;
          }}
          linkColor={(link) => {
            const graphLink = link as GraphLink;
            const isHighlighted = highlightLinks.has(graphLink);

                        if (selectedNode && !isHighlighted) {
              switch (graphLink.edge_type) {
                case 'authored':
                  return 'rgba(183, 191, 204, 0.02)';
                case 'coauthor':
                  return 'rgba(211, 214, 221, 0.02)';
                case 'paper_similarity':
                  return 'rgba(122, 160, 255, 0.02)';
                default:
                  return 'rgba(180, 180, 180, 0.02)';
              }
            }

            if (isHighlighted) {
              switch (graphLink.edge_type) {
                case 'authored':
                  return 'rgba(183, 191, 204, 0.9)';
                case 'coauthor':
                  return 'rgba(211, 214, 221, 0.8)';
                case 'paper_similarity':
                  return 'rgba(122, 160, 255, 0.7)';
                default:
                  return 'rgba(180, 180, 180, 0.7)';
              }
            }

            switch (graphLink.edge_type) {
              case 'authored':
                return 'rgba(183, 191, 204, 0.3)';
              case 'coauthor':
                return 'rgba(211, 214, 221, 0.25)';
              case 'paper_similarity':
                return 'rgba(122, 160, 255, 0.2)';
              default:
                return 'rgba(180, 180, 180, 0.2)';
            }
          }}
          linkWidth={(link) => {
            const graphLink = link as GraphLink;
            const isHighlighted = highlightLinks.has(graphLink);
            const baseWidth = graphLink.edge_type === 'coauthor'
              ? Math.max(0.5, (graphLink.weight || 1) * 0.5)
              : 0.5;

            return isHighlighted ? baseWidth * 2.5 : baseWidth;
          }}
          linkDirectionalParticles={(link) => {
            const graphLink = link as GraphLink;
            return highlightLinks.has(graphLink) ? 2 : 0;
          }}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          enableNodeDrag={false}
          enableNavigationControls={true}
          showNavInfo={false}
          backgroundColor="rgba(0,0,0,0)"
          controlType="orbit"
          warmupTicks={100}
          cooldownTicks={0}
        />
      </div>
    </div>
  );
}
