'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Users, FileText, Filter, Search, ZoomIn, ZoomOut, Maximize, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [showFilters, setShowFilters] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [filters, setFilters] = useState({
    showAuthored: true,
    showCoauthor: true,
    showSimilarity: true,
    selectedCommunities: new Set<number>(),
  });

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setShowFilters(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <div className="relative w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_#fef9c3_100%)]">
            <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 w-[calc(100%-2rem)] sm:w-full max-w-md px-2 sm:px-4">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all shadow-lg text-xs sm:text-sm font-medium font-[family-name:var(--font-space-grotesk)]"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 hover:text-slate-900" />
            </button>
          )}
        </div>

                {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white border-2 border-slate-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => focusOnNode(node)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-100 transition-colors border-b-2 border-slate-200 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      {node.node_type === 'author' ? (
                        <Users className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-medium truncate font-[family-name:var(--font-space-grotesk)]">{node.label}</p>
                        <div className="flex gap-2 mt-1 text-xs text-slate-600">
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

            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg group"
          title="Help"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-slate-900" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg group"
          title="Acercar"
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-slate-900" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg group"
          title="Alejar"
        >
          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-slate-900" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg group"
          title="Reiniciar vista"
        >
          <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-slate-900" />
        </button>
      </div>

            {showHelp && (
        <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-20 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 font-[family-name:var(--font-space-grotesk)]">Cómo usar la red 3D</h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-600 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-2">
                <span className="font-semibold text-slate-900 min-w-[80px]">Search:</span>
                <span>Usa la barra superior para encontrar nodos rápidamente</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-900 min-w-[80px]">Click:</span>
                <span>Selecciona un nodo para ver sus conexiones</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-900 min-w-[80px]">Arrastrar:</span>
                <span>Mueve el mouse para rotar la vista</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-900 min-w-[80px]">Scroll:</span>
                <span>Usa la rueda para hacer zoom</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-900 min-w-[80px]">Filters:</span>
                <span>Use the left panel to filter by type and community</span>
              </div>
            </div>
        </div>
      )}

      {/* Botón Toggle Filters */}
      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-[#d4f78a] transition-all text-sm font-bold font-[family-name:var(--font-space-grotesk)] shadow-xl"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      )}

      {/* Backdrop para móvil */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Panel de Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="absolute top-2 sm:top-4 left-2 sm:left-4 z-40 bg-white border-2 border-slate-900 rounded-2xl shadow-2xl w-[min(340px,calc(100vw-1rem))] lg:w-80 xl:w-96 max-h-[calc(100vh-2rem)] flex flex-col"
          >
            <div className="p-3 sm:p-4 border-b-2 border-slate-900">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 font-[family-name:var(--font-space-grotesk)]">Filters</h3>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
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
                      className="text-xs text-slate-900 hover:text-[#d4f78a] font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {(filteredGraphData.nodes.length < graphData.nodes.length || filteredGraphData.links.length < graphData.links.length) && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#d4f78a] border border-slate-900" />
                    <span className="text-slate-600">
                      <span className="text-slate-900 font-semibold">{filteredGraphData.nodes.length}</span>/{graphData.nodes.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                    <span className="text-slate-600">
                      <span className="text-slate-900 font-semibold">{filteredGraphData.links.length}</span> enlaces
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-4 custom-scrollbar">
              {/* Connection Types */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 mb-2 font-[family-name:var(--font-space-grotesk)]">Connection Types</h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.showAuthored}
                      onChange={(e) => setFilters({ ...filters, showAuthored: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-slate-900 bg-white accent-[#d4f78a]"
                    />
                    <span className="text-xs text-slate-900">Authorship</span>
                    <span className="text-xs text-slate-600 ml-auto">autor → paper</span>
                  </label>

                  <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.showCoauthor}
                      onChange={(e) => setFilters({ ...filters, showCoauthor: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-slate-900 bg-white accent-[#d4f78a]"
                    />
                    <span className="text-xs text-slate-900">Co-authorship</span>
                    <span className="text-xs text-slate-600 ml-auto">autor ↔ autor</span>
                  </label>

                  <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.showSimilarity}
                      onChange={(e) => setFilters({ ...filters, showSimilarity: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-slate-900 bg-white accent-[#d4f78a]"
                    />
                    <span className="text-xs text-slate-900">Similarity</span>
                    <span className="text-xs text-slate-600 ml-auto">paper ↔ paper</span>
                  </label>
                </div>
              </div>

              {/* Communities */}
              {availableCommunities.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-900 font-[family-name:var(--font-space-grotesk)]">Communities</h4>
                    {filters.selectedCommunities.size > 0 && (
                      <button
                        onClick={() => setFilters({ ...filters, selectedCommunities: new Set() })}
                        className="text-xs font-medium text-slate-900 hover:text-[#d4f78a]"
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
                              ? 'bg-[#d4f78a] border border-slate-900'
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0 border border-slate-900"
                            style={{ backgroundColor: communityNode?.color || '#d4f78a' }}
                          />
                          <span className={`text-xs truncate flex-1 text-left ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                            {label}
                          </span>
                          <span className={`text-xs font-semibold flex-shrink-0 ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            {(hoverNode || selectedNode) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white border-2 border-slate-900 rounded-xl p-5 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {(hoverNode || selectedNode)?.node_type === 'author' ? (
                    <div className="p-2 bg-[#d4f78a] border-2 border-slate-900 rounded-lg">
                      <Users className="w-5 h-5 text-slate-900" />
                    </div>
                  ) : (
                    <div className="p-2 bg-[#d4f78a] border-2 border-slate-900 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-900" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-xs text-slate-600 uppercase tracking-wide">
                      {(hoverNode || selectedNode)?.node_type === 'paper' ? 'Paper' : 'Autor'}
                    </span>
                    <p className="text-base text-slate-900 font-medium leading-relaxed mt-0.5 font-[family-name:var(--font-space-grotesk)]">
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
                    className="text-slate-600 hover:text-slate-900 flex-shrink-0"
                    title="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                {(hoverNode || selectedNode)?.year && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-900 rounded-lg">
                    <span className="text-slate-600">Year:</span>
                    <span className="text-slate-900 font-medium">{(hoverNode || selectedNode)?.year}</span>
                  </div>
                )}
                {(hoverNode || selectedNode)?.venue && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-900 rounded-lg">
                    <span className="text-slate-600">Venue:</span>
                    <span className="text-slate-900 font-medium">{(hoverNode || selectedNode)?.venue}</span>
                  </div>
                )}
                {(hoverNode || selectedNode)?.url && (hoverNode || selectedNode)?.node_type === 'paper' && (
                  <a
                    href={(hoverNode || selectedNode)?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4f78a] hover:bg-[#d4f78a]/80 border-2 border-slate-900 rounded-lg transition-all"
                  >
                    <span className="text-slate-900">DOI:</span>
                    <span className="text-slate-900 font-medium underline">Ver paper →</span>
                  </a>
                )}
                {(hoverNode || selectedNode)?.community_label && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4f78a] border-2 border-slate-900 rounded-lg">
                    <span className="text-slate-900">Community:</span>
                    <span className="text-slate-900 font-medium">{(hoverNode || selectedNode)?.community_label}</span>
                  </div>
                )}
                {(hoverNode || selectedNode)?.topic && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-900 rounded-lg">
                    <span className="text-slate-600">Tema:</span>
                    <span className="text-slate-900 font-medium">{(hoverNode || selectedNode)?.topic}</span>
                  </div>
                )}
              </div>

              {selectedNode && highlightNodes.size > 1 && (
                <div className="pt-2 border-t-2 border-slate-900">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">{highlightNodes.size - 1}</span> {highlightNodes.size - 1 === 1 ? 'conexión encontrada' : 'conexiones encontradas'}
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
