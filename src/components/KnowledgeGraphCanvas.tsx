'use client';

import { useState, useRef, useEffect } from 'react';
import { Network, Plus, Filter, Info, X, CheckCircle2, Sparkles, Move, Zap, RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  nodeType: string; // Author, Work, Concept, Question
  description?: string | null;
  x?: number;
  y?: number;
}

interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string; // SUPPORTS, CRITIQUES, CONTRADICTS, DEPENDS_ON, EVIDENCE_FOR, DEVELOPS
  justification?: string | null;
}

export default function KnowledgeGraphCanvas({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Modal para agregar nuevo nodo
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState('Concept');
  const [newNodeDesc, setNewNodeDesc] = useState('');

  // Modal para agregar nueva arista / conexión
  const [showAddEdgeModal, setShowAddEdgeModal] = useState(false);
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeRelation, setEdgeRelation] = useState('DEPENDS_ON');
  const [edgeJustification, setEdgeJustification] = useState('');

  const [zoom, setZoom] = useState<number>(0.85);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Auto-ajustar y centrar nodos según dimensiones reales del contenedor
  const recenterGraph = () => {
    const width = containerRef.current?.clientWidth || 360;
    const height = containerRef.current?.clientHeight || 450;
    const centerX = width / 2;
    const centerY = height / 2;

    const positionedNodes = initialNodes.map((node, index) => {
      const angle = (index / Math.max(1, initialNodes.length)) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35 + (index % 2) * 25;
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    setNodes(positionedNodes);
    setPanOffset({ x: 0, y: 0 });
    setZoom(width < 500 ? 0.75 : 0.95);
  };

  useEffect(() => {
    recenterGraph();
  }, [initialNodes]);

  // Arrastre 2D Mouse
  function handleMouseDown(nodeId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  }

  function handleSvgMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (draggingNodeId) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (draggingNodeId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / zoom;
      const y = (e.clientY - rect.top - panOffset.y) / zoom;

      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n))
      );
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  }

  function handleMouseUp() {
    setDraggingNodeId(null);
    setIsPanning(false);
  }

  function handleWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  }

  // Soporte Táctil Completo para Móviles (Touch Pan & Touch Drag)
  function handleTouchStart(nodeId: string, e: React.TouchEvent) {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  }

  function handleSvgTouchStart(e: React.TouchEvent<SVGSVGElement>) {
    if (draggingNodeId || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsPanning(true);
    setStartPan({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
  }

  function handleSvgTouchMove(e: React.TouchEvent<SVGSVGElement>) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (draggingNodeId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left - panOffset.x) / zoom;
      const y = (touch.clientY - rect.top - panOffset.y) / zoom;

      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n))
      );
    } else if (isPanning) {
      setPanOffset({
        x: touch.clientX - startPan.x,
        y: touch.clientY - startPan.y,
      });
    }
  }

  function handleSvgTouchEnd() {
    setDraggingNodeId(null);
    setIsPanning(false);
  }

  // Guardar nuevo nodo en SQLite
  async function handleAddNode() {
    if (!newNodeLabel.trim()) return;
    try {
      const res = await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addNode',
          node: {
            label: newNodeLabel,
            nodeType: newNodeType,
            description: newNodeDesc,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        const width = containerRef.current?.clientWidth || 360;
        const height = containerRef.current?.clientHeight || 450;
        const newNodeObj: Node = {
          id: data.nodeId,
          label: newNodeLabel,
          nodeType: newNodeType,
          description: newNodeDesc,
          x: width / 2 + (Math.random() - 0.5) * 80,
          y: height / 2 + (Math.random() - 0.5) * 80,
        };
        setNodes((prev) => [...prev, newNodeObj]);
        setShowAddNodeModal(false);
        setNewNodeLabel('');
        setNewNodeDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Guardar nueva conexión en SQLite
  async function handleAddEdge() {
    if (!edgeSource || !edgeTarget || edgeSource === edgeTarget) return;
    try {
      const res = await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addEdge',
          edge: {
            sourceId: edgeSource,
            targetId: edgeTarget,
            relationType: edgeRelation,
            justification: edgeJustification,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newEdgeObj: Edge = {
          id: data.edgeId,
          sourceId: edgeSource,
          targetId: edgeTarget,
          relationType: edgeRelation,
          justification: edgeJustification,
        };
        setEdges((prev) => [...prev, newEdgeObj]);
        setShowAddEdgeModal(false);
        setEdgeJustification('');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Nodos filtrados por tipo y término de búsqueda
  const filteredNodes = nodes.filter((n) => {
    const matchesType = selectedType === 'ALL' || n.nodeType === selectedType;
    const matchesSearch =
      !searchQuery.trim() ||
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Colores por tipo de nodo
  const nodeColors: Record<string, { bg: string; border: string; text: string; fill: string }> = {
    Author: { bg: 'bg-purple-950/90', border: 'border-purple-500', text: 'text-purple-300', fill: '#a855f7' },
    Work: { bg: 'bg-sky-950/90', border: 'border-sky-500', text: 'text-sky-300', fill: '#0284c7' },
    Concept: { bg: 'bg-emerald-950/90', border: 'border-emerald-500', text: 'text-emerald-300', fill: '#10b981' },
    Question: { bg: 'bg-amber-950/90', border: 'border-amber-500', text: 'text-amber-300', fill: '#f59e0b' },
  };

  return (
    <div ref={containerRef} className="space-y-2 w-full">
      {/* FILTROS Y CONTROLES ADAPTATIVOS PARA MÓVIL */}
      <div className="flex flex-col gap-2 bg-slate-900/95 p-2 sm:p-3 rounded-xl border border-slate-800 text-xs">
        
        {/* FILTROS DE TIPO HORIZONTAL CON SCROLL SUAVE */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full pb-1 font-mono no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          {['ALL', 'Author', 'Work', 'Concept', 'Question'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedType === type
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type === 'ALL' ? 'Todos' : type}
            </button>
          ))}
        </div>

        {/* BUSCADOR Y BOTONES DE ACCIÓN COMPACTOS */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono">
          <input
            type="text"
            placeholder="🔍 Buscar nodo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none w-32 sm:w-44"
          />

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
              className="p-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={recenterGraph}
              className="px-1.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 text-[10px] font-bold rounded border border-slate-800"
              title="Centrar Grafo"
            >
              Centrar
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
              className="p-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowAddNodeModal(true)}
              className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 shadow cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Nodo
            </button>

            <button
              type="button"
              onClick={() => setShowAddEdgeModal(true)}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 shadow cursor-pointer"
            >
              <Zap className="w-3 h-3" /> Conectar
            </button>
          </div>
        </div>
      </div>

      {/* CANVAS 2D SVG DEL GRAFO CON SOPORTE TÁCTIL MÓVIL */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl touch-none">
        <div className="absolute top-2 left-2 z-10 text-[9px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
          <Move className="w-2.5 h-2.5 text-sky-400" /> Arrastra fondo o nodos para mover ({Math.round(zoom * 100)}%)
        </div>

        <svg
          ref={svgRef}
          className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing select-none block"
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleSvgTouchStart}
          onTouchMove={handleSvgTouchMove}
          onTouchEnd={handleSvgTouchEnd}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>

          {/* DIBUJAR LÍNEAS / ARISTAS DE CONEXIÓN */}
          {edges.map((edge) => {
            const source = nodes.find((n) => n.id === edge.sourceId);
            const target = nodes.find((n) => n.id === edge.targetId);
            if (!source || !target || source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) return null;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  markerEnd="url(#arrow)"
                />
                {/* Etiqueta de la relación */}
                <rect
                  x={midX - 35}
                  y={midY - 9}
                  width="70"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                  stroke="#1e293b"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  fill="#94a3b8"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {edge.relationType}
                </text>
              </g>
            );
          })}

          {/* DIBUJAR NODOS 2D */}
          {filteredNodes.map((node) => {
            if (node.x === undefined || node.y === undefined) return null;
            const color = nodeColors[node.nodeType] || nodeColors.Concept;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                onTouchStart={(e) => handleTouchStart(node.id, e)}
                onClick={() => setSelectedNode(node)}
                className="cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
              >
                {/* Círculo exterior resplandeciente al seleccionar */}
                {isSelected && (
                  <circle r="30" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
                )}

                {/* Nodo Principal */}
                <circle
                  r="24"
                  fill={color.fill}
                  fillOpacity="0.25"
                  stroke={color.fill}
                  strokeWidth="2.5"
                />

                {/* Icono / Inicial */}
                <text
                  y="5"
                  fill="#f8fafc"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="middle"
                >
                  {node.label.charAt(0)}
                </text>

                {/* Etiqueta con el nombre debajo del nodo */}
                <rect
                  y="28"
                  x="-48"
                  width="96"
                  height="17"
                  rx="4"
                  fill="#020617"
                  stroke="#1e293b"
                />
                <text
                  y="40"
                  fill="#e2e8f0"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.label.length > 14 ? `${node.label.substring(0, 12)}...` : node.label}
                </text>
              </g>
            );
          })}
          </g>
        </svg>
      </div>

      {/* DETALLE DEL NODO SELECCIONADO */}
      {selectedNode && (
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 relative shadow-lg">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {selectedNode.nodeType}
            </span>
            <h4 className="text-xs font-bold text-slate-100">{selectedNode.label}</h4>
          </div>
          {selectedNode.description && (
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedNode.description}</p>
          )}
        </div>
      )}

      {/* MODAL CREAR NUEVO NODO */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-[100002] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-3 shadow-2xl relative text-xs">
            <button
              onClick={() => setShowAddNodeModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-slate-100">Agregar Nuevo Nodo al Grafo</h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nombre / Título del Nodo:</label>
              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Ej. Karl Popper, Epistemologia, Falsificacion..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tipo de Nodo:</label>
              <select
                value={newNodeType}
                onChange={(e) => setNewNodeType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
              >
                <option value="Author">Author (Autor / Pensador)</option>
                <option value="Work">Work (Obra / Libro / Paper)</option>
                <option value="Concept">Concept (Concepto / Modelo)</option>
                <option value="Question">Question (Pregunta)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Descripción corta:</label>
              <input
                type="text"
                value={newNodeDesc}
                onChange={(e) => setNewNodeDesc(e.target.value)}
                placeholder="Breve definición o contexto..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              onClick={handleAddNode}
              disabled={!newNodeLabel.trim()}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
            >
              Guardar Nodo en SQLite
            </button>
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVA CONEXIÓN / ARISTA */}
      {showAddEdgeModal && (
        <div className="fixed inset-0 z-[100002] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-3 shadow-2xl relative text-xs">
            <button
              onClick={() => setShowAddEdgeModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-slate-100">Conectar dos Nodos del Grafo</h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nodo Origen (Source):</label>
              <select
                value={edgeSource}
                onChange={(e) => setEdgeSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
              >
                <option value="">Selecciona nodo origen...</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.nodeType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tipo de Relación:</label>
              <select
                value={edgeRelation}
                onChange={(e) => setEdgeRelation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-mono"
              >
                <option value="DEPENDS_ON">DEPENDS_ON (Depende de)</option>
                <option value="EVIDENCE_FOR">EVIDENCE_FOR (Evidencia para)</option>
                <option value="DEVELOPS">DEVELOPS (Desarrolla)</option>
                <option value="SUPPORTS">SUPPORTS (Apoya)</option>
                <option value="CRITIQUES">CRITIQUES (Critica)</option>
                <option value="CONTRADICTS">CONTRADICTS (Contradice)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nodo Destino (Target):</label>
              <select
                value={edgeTarget}
                onChange={(e) => setEdgeTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
              >
                <option value="">Selecciona nodo destino...</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.nodeType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Justificación:</label>
              <input
                type="text"
                value={edgeJustification}
                onChange={(e) => setEdgeJustification(e.target.value)}
                placeholder="Explicación de la conexión..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
              />
            </div>

            <button
              onClick={handleAddEdge}
              disabled={!edgeSource || !edgeTarget || edgeSource === edgeTarget}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
            >
              Guardar Conexión en SQLite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
