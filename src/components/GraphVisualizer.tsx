import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Vertex, Edge } from '../types';
import { MousePointer, PlusCircle, ArrowUpRight, Trash2, Shuffle, RotateCcw, FileCode, Upload, Download, Sparkles } from 'lucide-react';

interface GraphVisualizerProps {
  vertices: Vertex[];
  edges: Edge[];
  onChange: (vertices: Vertex[], edges: Edge[]) => void;
  // Highlights from MST algorithms
  visitedNodes?: string[];
  currentNodeId?: string | null;
  mstEdges?: string[];
  candidateEdges?: string[];
  rejectedEdges?: string[];
  currentEdgeId?: string | null;
  isSimulationActive?: boolean;
}

const DEFAULT_SAMPLE_NODES: Vertex[] = [
  { id: 'A', label: 'A', x: 100, y: 150 },
  { id: 'B', label: 'B', x: 260, y: 80 },
  { id: 'C', label: 'C', x: 260, y: 220 },
  { id: 'D', label: 'D', x: 420, y: 80 },
  { id: 'E', label: 'E', x: 420, y: 220 },
  { id: 'F', label: 'F', x: 560, y: 150 }
];

const DEFAULT_SAMPLE_EDGES: Edge[] = [
  { id: 'e1', source: 'A', target: 'B', weight: 4 },
  { id: 'e2', source: 'A', target: 'C', weight: 2 },
  { id: 'e3', source: 'B', target: 'C', weight: 1 },
  { id: 'e4', source: 'B', target: 'D', weight: 5 },
  { id: 'e5', source: 'C', target: 'D', weight: 8 },
  { id: 'e6', source: 'C', target: 'E', weight: 10 },
  { id: 'e7', source: 'D', target: 'E', weight: 2 },
  { id: 'e8', source: 'D', target: 'F', weight: 6 },
  { id: 'e9', source: 'E', target: 'F', weight: 3 }
];

export default function GraphVisualizer({
  vertices,
  edges,
  onChange,
  visitedNodes = [],
  currentNodeId = null,
  mstEdges = [],
  candidateEdges = [],
  rejectedEdges = [],
  currentEdgeId = null,
  isSimulationActive = false
}: GraphVisualizerProps) {
  const [editorMode, setEditorMode] = useState<'drag' | 'add_node' | 'add_edge' | 'delete'>('drag');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // For edge drawing
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);
  const [edgeWeightVal, setEdgeWeightVal] = useState<number>(5);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load sample graph on mount if empty
  useEffect(() => {
    if (vertices.length === 0) {
      loadSampleGraph();
    }
  }, []);

  const loadSampleGraph = () => {
    onChange([...DEFAULT_SAMPLE_NODES], [...DEFAULT_SAMPLE_EDGES]);
    setEditorMode('drag');
    setSelectedNodeId(null);
    setEditingEdge(null);
  };

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 3) + 5; // 5 to 7 nodes
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const newVertices: Vertex[] = [];

    // Generate random distinct coordinates
    for (let i = 0; i < nodeCount; i++) {
      let x = Math.floor(Math.random() * 450) + 100;
      let y = Math.floor(Math.random() * 200) + 70;
      // Ensure reasonable distance from other nodes
      let attempts = 0;
      while (newVertices.some(v => Math.hypot(v.x - x, v.y - y) < 80) && attempts < 50) {
        x = Math.floor(Math.random() * 450) + 100;
        y = Math.floor(Math.random() * 200) + 70;
        attempts++;
      }
      newVertices.push({ id: labels[i], label: labels[i], x, y });
    }

    // Connect them randomly, making sure it's fully connected
    const newEdges: Edge[] = [];
    let edgeCounter = 1;

    // Connect linearly first to guarantee connectedness
    for (let i = 0; i < nodeCount - 1; i++) {
      const u = newVertices[i];
      const v = newVertices[i + 1];
      const weight = Math.floor(Math.random() * 11) + 1; // 1 to 12
      newEdges.push({
        id: `re${edgeCounter++}`,
        source: u.id,
        target: v.id,
        weight
      });
    }

    // Add extra random cross edges for density and interesting decisions
    const maxExtraEdges = nodeCount === 5 ? 3 : nodeCount === 6 ? 4 : 5;
    let addedExtra = 0;
    let attempts = 0;

    while (addedExtra < maxExtraEdges && attempts < 100) {
      const uIdx = Math.floor(Math.random() * nodeCount);
      const vIdx = Math.floor(Math.random() * nodeCount);
      attempts++;

      if (uIdx !== vIdx) {
        const u = newVertices[uIdx];
        const v = newVertices[vIdx];
        // Check if edge already exists
        const exists = newEdges.some(e => 
          (e.source === u.id && e.target === v.id) || 
          (e.source === v.id && e.target === u.id)
        );

        if (!exists) {
          const weight = Math.floor(Math.random() * 11) + 1;
          newEdges.push({
            id: `re${edgeCounter++}`,
            source: u.id,
            target: v.id,
            weight
          });
          addedExtra++;
        }
      }
    }

    onChange(newVertices, newEdges);
    setEditorMode('drag');
    setSelectedNodeId(null);
    setEditingEdge(null);
  };

  const clearGraph = () => {
    onChange([], []);
    setSelectedNodeId(null);
    setEditingEdge(null);
  };

  // SVG interactions
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (editorMode !== 'add_node') return;
    if (!svgRef.current) return;

    // Calculate click coordinates relative to SVG viewport
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Generate unique alphabetical label
    const usedLabels = vertices.map(v => v.label);
    let nextLabel = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
      if (!usedLabels.includes(alphabet[i])) {
        nextLabel = alphabet[i];
        break;
      }
    }
    if (!nextLabel) {
      nextLabel = `N${vertices.length + 1}`;
    }

    const newVertex: Vertex = {
      id: nextLabel,
      label: nextLabel,
      x,
      y
    };

    onChange([...vertices, newVertex], edges);
  };

  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editorMode === 'delete') {
      // Remove node and all associated edges
      const filteredVertices = vertices.filter(v => v.id !== nodeId);
      const filteredEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
      onChange(filteredVertices, filteredEdges);
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    } else if (editorMode === 'add_edge') {
      if (!selectedNodeId) {
        setSelectedNodeId(nodeId);
      } else if (selectedNodeId === nodeId) {
        setSelectedNodeId(null); // Deselect
      } else {
        // Connect selectedNodeId -> nodeId
        // Check if edge exists
        const exists = edges.some(edge => 
          (edge.source === selectedNodeId && edge.target === nodeId) ||
          (edge.source === nodeId && edge.target === selectedNodeId)
        );

        if (!exists) {
          const newEdge: Edge = {
            id: `e_${selectedNodeId}_${nodeId}`,
            source: selectedNodeId,
            target: nodeId,
            weight: 5 // Default weight
          };
          onChange(vertices, [...edges, newEdge]);
        }
        setSelectedNodeId(null);
      }
    } else if (editorMode === 'drag') {
      setDraggedNodeId(nodeId);
    }
  };

  const handleNodeTouchStart = (nodeId: string, e: React.TouchEvent) => {
    e.stopPropagation();
    if (editorMode === 'drag') {
      setDraggedNodeId(nodeId);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || editorMode !== 'drag' || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Keep nodes within safe boundaries
    const safeX = Math.max(25, Math.min(x, rect.width - 25));
    const safeY = Math.max(25, Math.min(y, rect.height - 25));

    const updatedVertices = vertices.map(v => 
      v.id === draggedNodeId ? { ...v, x: safeX, y: safeY } : v
    );
    onChange(updatedVertices, edges);
  };

  const handleSvgTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!draggedNodeId || editorMode !== 'drag' || !svgRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(touch.clientX - rect.left);
    const y = Math.round(touch.clientY - rect.top);

    const safeX = Math.max(25, Math.min(x, rect.width - 25));
    const safeY = Math.max(25, Math.min(y, rect.height - 25));

    const updatedVertices = vertices.map(v => 
      v.id === draggedNodeId ? { ...v, x: safeX, y: safeY } : v
    );
    onChange(updatedVertices, edges);
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleEdgeClick = (edge: Edge, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editorMode === 'delete') {
      const filteredEdges = edges.filter(eItem => eItem.id !== edge.id);
      onChange(vertices, filteredEdges);
    } else {
      setEditingEdge(edge);
      setEdgeWeightVal(edge.weight);
    }
  };

  const saveEdgeWeight = () => {
    if (!editingEdge) return;
    const updated = edges.map(eItem => 
      eItem.id === editingEdge.id ? { ...eItem, weight: Math.max(1, edgeWeightVal) } : eItem
    );
    onChange(vertices, updated);
    setEditingEdge(null);
  };

  // Import / Export JSON
  const exportGraphJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ vertices, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "mst_custom_graph.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importGraphJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.vertices) && Array.isArray(parsed.edges)) {
          onChange(parsed.vertices, parsed.edges);
        } else {
          alert("Invalid Graph JSON structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Export as PNG
  const downloadGraphPng = () => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = svgEl.clientWidth || 800;
    canvas.height = svgEl.clientHeight || 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = window.URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngURL = canvas.toDataURL("image/png");
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", pngURL);
      downloadAnchor.setAttribute("download", "mst_lab_graph.png");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.URL.revokeObjectURL(blobURL);
    };
    img.src = blobURL;
  };

  return (
    <div className="space-y-6">
      {/* Editor Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 text-slate-800 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mr-1">MODES:</span>
          
          <button
            onClick={() => { setEditorMode('drag'); setSelectedNodeId(null); }}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              editorMode === 'drag' 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "bg-slate-100 hover:bg-slate-250 text-slate-700"
            }`}
            title="Move vertices around the board"
          >
            <MousePointer className="w-3.5 h-3.5" /> Drag/Move
          </button>

          <button
            onClick={() => { setEditorMode('add_node'); setSelectedNodeId(null); }}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              editorMode === 'add_node' 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "bg-slate-100 hover:bg-slate-250 text-slate-700"
            }`}
            title="Click blank spots on canvas to add vertices"
          >
            <PlusCircle className="w-3.5 h-3.5" /> + Vertex
          </button>

          <button
            onClick={() => { setEditorMode('add_edge'); setSelectedNodeId(null); }}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              editorMode === 'add_edge' 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "bg-slate-100 hover:bg-slate-250 text-slate-700"
            }`}
            title="Click start node then end node to connect them"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> + Edge
          </button>

          <button
            onClick={() => { setEditorMode('delete'); setSelectedNodeId(null); }}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              editorMode === 'delete' 
                ? "bg-rose-600 text-white shadow-md shadow-rose-100" 
                : "bg-slate-100 hover:bg-slate-250 text-slate-700"
            }`}
            title="Click nodes or edges to remove them"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mr-1">PRESETS:</span>
          
          <button
            onClick={loadSampleGraph}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-500" /> Sample
          </button>

          <button
            onClick={generateRandomGraph}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-500" /> Random
          </button>

          <button
            onClick={clearGraph}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {/* Status Mode Indicator Banner */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-[10px] font-mono font-bold text-slate-600 flex items-center gap-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          {editorMode === 'drag' && "Drag Mode: Drag vertices freely."}
          {editorMode === 'add_node' && "Add Vertex Mode: Click canvas to spawn nodes."}
          {editorMode === 'add_edge' && "Add Edge Mode: Select start vertex then end vertex."}
          {editorMode === 'delete' && "Delete Mode: Click vertices or edges to remove."}
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-3 left-3 p-3 bg-slate-900/90 text-white rounded-xl text-[10px] font-mono space-y-1.5 z-20 max-w-xs border border-white/10 backdrop-blur-xs">
          <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-slate-300">INTERACTIVE LEGEND</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block border border-slate-400" />
            <span>Unvisited Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-300" />
            <span>Visited / MST Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-2 ring-blue-200 animate-pulse" />
            <span>Current Active Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-slate-300 inline-block" />
            <span>Standard Link</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 bg-blue-600 inline-block" />
            <span>MST Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-amber-500 inline-block" />
            <span>Candidate Edge (Prim)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-rose-400 border-dashed inline-block" />
            <span>Rejected (Cycle - Kruskal)</span>
          </div>
        </div>

        {/* Instructions Alert for empty graph */}
        {vertices.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-2xs z-10 pointer-events-none p-4 text-center">
            <Sparkles className="w-8 h-8 text-blue-500 animate-bounce mb-2" />
            <p className="text-slate-800 text-sm font-semibold">Graph is Empty</p>
            <p className="text-slate-400 text-xs mt-1">Click "Sample" or "Random" above, or use "+ Vertex" to design your custom graph!</p>
          </div>
        )}

        {/* SVG Drawing Board */}
        <svg
          ref={svgRef}
          className="w-full h-[360px] cursor-crosshair select-none bg-slate-50/20"
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleSvgTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* DEFINITIONS FOR SVG MARKERS (ARROWS / EFFECTS) */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw Edges */}
          {edges.map((edge) => {
            const sourceNode = vertices.find(v => v.id === edge.source);
            const targetNode = vertices.find(v => v.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isMST = mstEdges.includes(edge.id);
            const isCandidate = candidateEdges.includes(edge.id);
            const isRejected = rejectedEdges.includes(edge.id);
            const isCurrent = currentEdgeId === edge.id;

            // Compute center of edge for weight placing
            const cx = (sourceNode.x + targetNode.x) / 2;
            const cy = (sourceNode.y + targetNode.y) / 2;

            // Compute angle of line to rotate weight tag
            const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x) * 180 / Math.PI;

            let strokeColor = "#e2e8f0"; // slate-200
            let strokeWidth = "4";
            let strokeDash = "0";

            if (isMST) {
              strokeColor = "#3b82f6"; // blue-500
              strokeWidth = "6";
            } else if (isCandidate) {
              strokeColor = "#8b5cf6"; // purple-500
              strokeWidth = "6";
            } else if (isRejected) {
              strokeColor = "#cbd5e1"; // light grey line for rejected/cycle
              strokeWidth = "2";
              strokeDash = "4,4";
            } else if (isCurrent) {
              strokeColor = "#8b5cf6"; // purple-500
              strokeWidth = "6";
            }

            return (
              <g key={edge.id} className="group cursor-pointer">
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  onClick={(e) => handleEdgeClick(edge, e)}
                  className="transition-all duration-300"
                />
                
                {/* Thick invisible line to make hover easier */}
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="transparent"
                  strokeWidth="15"
                  onClick={(e) => handleEdgeClick(edge, e)}
                />

                {/* Weight badge tag */}
                <g transform={`translate(${cx}, ${cy})`}>
                  <rect
                    x="-12"
                    y="-10"
                    width="24"
                    height="18"
                    rx="4"
                    fill={isCurrent ? "#8b5cf6" : isMST ? "#3b82f6" : isCandidate ? "#8b5cf6" : "#64748b"}
                    className="transition-all shadow-sm"
                  />
                  <text
                    y="2"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Draw Vertices */}
          {vertices.map((node) => {
            const isVisited = visitedNodes.includes(node.id);
            const isCurrent = currentNodeId === node.id;
            const isSelectedForEdge = selectedNodeId === node.id;

            let fill = "white"; 
            let stroke = "#cbd5e1"; // slate-300
            let textColor = "#64748b"; // slate-500
            let r = "20";
            let strokeWidth = "3";
            let effectFilter = "";

            if (isCurrent) {
              fill = "#8b5cf6"; // purple-500
              stroke = "#7c3aed";
              textColor = "white";
              r = "22";
              strokeWidth = "4";
              effectFilter = "url(#glow)";
            } else if (isVisited) {
              fill = "#3b82f6"; // blue-500
              stroke = "#2563eb";
              textColor = "white";
              r = "20";
              strokeWidth = "3";
            } else if (isSelectedForEdge) {
              fill = "#a855f7"; // purple-500 (linking source)
              stroke = "#7e22ce";
              textColor = "white";
              r = "21";
              strokeWidth = "4";
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                onTouchStart={(e) => handleNodeTouchStart(node.id, e)}
                className="cursor-pointer group select-none"
              >
                {/* Node circle outline shadow */}
                <circle
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  filter={effectFilter}
                  className="transition-all duration-300 shadow-sm"
                />

                {/* Inner white core for nice branding */}
                {!isCurrent && !isVisited && !isSelectedForEdge && (
                  <circle r="4" fill="#cbd5e1" opacity="0.3" className="pointer-events-none" />
                )}

                {/* Text identifier */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill={textColor}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="pointer-events-none select-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Modal for Edge Weight Adjustment */}
        {editingEdge && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-30 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-5 rounded-2xl max-w-xs w-full shadow-xl border border-slate-100 space-y-4"
            >
              <div className="text-center space-y-1">
                <h5 className="text-sm font-bold text-slate-800">Edit Edge Weight</h5>
                <p className="text-[11px] text-slate-400 font-mono">
                  Link: {editingEdge.source} ↔ {editingEdge.target}
                </p>
              </div>

              <div className="flex items-center gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setEdgeWeightVal(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={edgeWeightVal}
                  onChange={(e) => setEdgeWeightVal(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-center font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setEdgeWeightVal(prev => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingEdge(null)}
                  className="w-1/2 py-2 border border-slate-150 text-slate-500 hover:bg-slate-50 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdgeWeight}
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* File Action Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <div className="flex gap-2">
          <button
            onClick={exportGraphJson}
            disabled={vertices.length === 0}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-50 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs"
            title="Download this layout as JSON configuration"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs"
            title="Upload a valid graph JSON"
          >
            <Upload className="w-3.5 h-3.5" /> Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importGraphJson}
            accept=".json"
            className="hidden"
          />
        </div>

        <button
          onClick={downloadGraphPng}
          disabled={vertices.length === 0}
          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 disabled:opacity-50 rounded-lg font-semibold flex items-center gap-1.5"
          title="Save visual graph illustration as a PNG image"
        >
          <Sparkles className="w-3.5 h-3.5" /> Save Graph as PNG
        </button>
      </div>
    </div>
  );
}
