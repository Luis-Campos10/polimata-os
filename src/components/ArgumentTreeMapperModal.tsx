'use client';

import { useState, useEffect } from 'react';
import { 
  GitFork, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  BookOpen, 
  Sparkles, 
  X, 
  ArrowDown, 
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Copy,
  Save
} from 'lucide-react';
import { openInObsidianApp, getStoredVaultHandle, verifyPermission, writeVaultFile } from '@/lib/sync/obsidianSync';

export type NodeType = 'PREMISE_MAJOR' | 'PREMISE_MINOR' | 'INFERENCE' | 'OBJECTION' | 'REBUTTAL' | 'CONCLUSION';

export interface ArgumentNode {
  id: string;
  type: NodeType;
  label: string;
  text: string;
}

export interface ArgumentTreeTemplate {
  id: string;
  title: string;
  author: string;
  workReference: string;
  thesis: string;
  nodes: ArgumentNode[];
}

const PRESET_ARGUMENTS: ArgumentTreeTemplate[] = [
  {
    id: 'SPINOZA_ETICA_P1',
    title: 'Prioridad Ontológica de la Sustancia (Spinoza)',
    author: 'Baruch Spinoza',
    workReference: 'Ética demostrada según el orden geométrico (1677 d.C.)',
    thesis: 'La sustancia es por naturaleza anterior a sus afecciones o modos.',
    nodes: [
      {
        id: 'n1',
        type: 'PREMISE_MAJOR',
        label: 'Axioma / Def. 3',
        text: 'Por sustancia entiendo lo que es en sí y se concibe por sí: aquello cuyo concepto no necesita del concepto de otra cosa para formarse.'
      },
      {
        id: 'n2',
        type: 'PREMISE_MINOR',
        label: 'Definición 5',
        text: 'Por modo entiendo las afecciones de una sustancia, o aquello que es en otro y por otro se concibe.'
      },
      {
        id: 'n3',
        type: 'INFERENCE',
        label: 'Deducción Geométrica',
        text: 'Lo que subsiste por sí mismo posee anterioridad lógica y ontológica respecto a lo que sólo puede existir y ser pensado como modificación de otro.'
      },
      {
        id: 'n4',
        type: 'OBJECTION',
        label: 'Objeción Empirista',
        text: '¿No conocemos acaso primero los modos fenoménicos individuales antes de inferir la sustancia subyacente?'
      },
      {
        id: 'n5',
        type: 'REBUTTAL',
        label: 'Respuesta Escolástica',
        text: 'El orden epistémico del descubrimiento humano (cognitio humana) no altera el orden causal y ontológico de la realidad (ordo essendi).'
      },
      {
        id: 'n6',
        type: 'CONCLUSION',
        label: 'Proposición 1',
        text: 'Por tanto, la sustancia es ontológicamente anterior a cualquiera de sus modos o afecciones.'
      }
    ]
  },
  {
    id: 'DESCARTES_COGITO',
    title: 'Duda Metódica y Certeza Indubitable (Descartes)',
    author: 'René Descartes',
    workReference: 'Meditaciones Metafísicas (1641 d.C.)',
    thesis: 'Aunque un genio maligno me engañe en todo lo sensible, mi propia existencia como ser pensante es absolutamente indudable.',
    nodes: [
      {
        id: 'n1',
        type: 'PREMISE_MAJOR',
        label: 'Premisa Mayor',
        text: 'Los sentidos engañan ocasionalmente, y no puedo distinguir con absoluta certeza empírica la vigilia del sueño.'
      },
      {
        id: 'n2',
        type: 'PREMISE_MINOR',
        label: 'Axioma de Conciencia',
        text: 'Incluso en el caso extremo de que un genio maligno todopoderoso distorsione mis percepciones y las verdades matemáticas, para ser engañado o dudar debo estar operando conscientemente.'
      },
      {
        id: 'n3',
        type: 'INFERENCE',
        label: 'Inferencia Deductiva',
        text: 'El acto de dudar es una forma de pensar; y el pensar exige ontológicamente la existencia del sujeto que piensa.'
      },
      {
        id: 'n4',
        type: 'CONCLUSION',
        label: 'Tesis Demostrada',
        text: 'Cogito, ergo sum: Pienso, por lo tanto existo en cada instante que pronuncio o concibo esta verdad.'
      }
    ]
  },
  {
    id: 'POPPER_FALSACION',
    title: 'Asimetría Lógica de la Demarcación Científica (Popper)',
    author: 'Karl Popper',
    workReference: 'La lógica de la investigación científica (1934 d.C.)',
    thesis: 'Las teorías empíricas no pueden verificarse inductivamente, solo pueden falsarse por deducción (Modus Tollens).',
    nodes: [
      {
        id: 'n1',
        type: 'PREMISE_MAJOR',
        label: 'Problema de la Inducción',
        text: 'Ningún número finito de observaciones particulares de cisnes blancos puede demostrar deductivamente el enunciado universal: "Todos los cisnes son blancos".'
      },
      {
        id: 'n2',
        type: 'PREMISE_MINOR',
        label: 'Asimetría Lógica (Modus Tollens)',
        text: 'Una sola observación de un cisne negro (¬q) deduce formalmente y con certeza apodíctica la falsedad de la ley universal (¬p).'
      },
      {
        id: 'n3',
        type: 'CONCLUSION',
        label: 'Criterio Demarcatorio',
        text: 'Por consiguiente, el estatus científico de una teoría radica en su falsabilidad empírica, no en su acumulabilidad verificadora.'
      }
    ]
  }
];

export default function ArgumentTreeMapperModal({
  isOpen,
  onClose,
  initialBookTitle,
  initialPageNumber
}: {
  isOpen: boolean;
  onClose: () => void;
  initialBookTitle?: string;
  initialPageNumber?: number;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<ArgumentTreeTemplate>(PRESET_ARGUMENTS[0]);
  const [currentNodes, setCurrentNodes] = useState<ArgumentNode[]>(PRESET_ARGUMENTS[0].nodes);
  const [currentThesis, setCurrentThesis] = useState<string>(PRESET_ARGUMENTS[0].thesis);
  const [currentTitle, setCurrentTitle] = useState<string>(PRESET_ARGUMENTS[0].title);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Formulario para nuevo nodo
  const [showAddNode, setShowAddNode] = useState<boolean>(false);
  const [newNodeType, setNewNodeType] = useState<NodeType>('PREMISE_MINOR');
  const [newNodeLabel, setNewNodeLabel] = useState<string>('');
  const [newNodeText, setNewNodeText] = useState<string>('');

  // Si se abre desde el lector de PDF, inicializar con contexto de lectura
  useEffect(() => {
    if (initialBookTitle && isOpen) {
      setCurrentTitle(`Mapeo Lógico: ${initialBookTitle} (Pág. ${initialPageNumber || 1})`);
    }
  }, [initialBookTitle, initialPageNumber, isOpen]);

  if (!isOpen) return null;

  // Cargar una plantilla
  const handleSelectTemplate = (template: ArgumentTreeTemplate) => {
    setSelectedTemplate(template);
    setCurrentTitle(template.title);
    setCurrentThesis(template.thesis);
    setCurrentNodes(template.nodes);
  };

  // Crear nuevo árbol en blanco
  const handleCreateBlank = () => {
    setCurrentTitle(initialBookTitle ? `Argumento de ${initialBookTitle}` : 'Nuevo Árbol Argumentativo');
    setCurrentThesis('');
    setCurrentNodes([
      {
        id: 'n1',
        type: 'PREMISE_MAJOR',
        label: 'Premisa Mayor',
        text: 'Escribe el principio o axioma de partida...'
      },
      {
        id: 'n2',
        type: 'PREMISE_MINOR',
        label: 'Evidencia / Cita',
        text: 'Escribe el hecho o evidencia observada...'
      },
      {
        id: 'n3',
        type: 'CONCLUSION',
        label: 'Conclusión Lógica',
        text: 'Escribe la conclusión deducida de las premisas...'
      }
    ]);
  };

  // Agregar nuevo nodo
  const handleAddNode = () => {
    if (!newNodeText.trim()) return;
    const newNode: ArgumentNode = {
      id: `node_${Date.now()}`,
      type: newNodeType,
      label: newNodeLabel.trim() || getNodeTypeName(newNodeType),
      text: newNodeText.trim()
    };
    setCurrentNodes([...currentNodes, newNode]);
    setNewNodeText('');
    setNewNodeLabel('');
    setShowAddNode(false);
  };

  // Eliminar nodo
  const handleDeleteNode = (id: string) => {
    setCurrentNodes(currentNodes.filter(n => n.id !== id));
  };

  // Actualizar texto de un nodo
  const handleUpdateNodeText = (id: string, text: string) => {
    setCurrentNodes(currentNodes.map(n => n.id === id ? { ...n, text } : n));
  };

  // Auditor de validez lógica
  const calculateValidity = () => {
    const hasMajor = currentNodes.some(n => n.type === 'PREMISE_MAJOR');
    const hasMinor = currentNodes.some(n => n.type === 'PREMISE_MINOR' || n.type === 'INFERENCE');
    const hasConclusion = currentNodes.some(n => n.type === 'CONCLUSION');
    const objections = currentNodes.filter(n => n.type === 'OBJECTION');
    const rebuttals = currentNodes.filter(n => n.type === 'REBUTTAL');

    let score = 50;
    if (hasMajor) score += 20;
    if (hasMinor) score += 15;
    if (hasConclusion) score += 15;
    if (objections.length > 0 && rebuttals.length < objections.length) {
      score -= 20; // Penalizar objeciones no contestadas
    }
    return Math.max(0, Math.min(100, score));
  };

  const validityScore = calculateValidity();

  // Generar código Mermaid para Obsidian
  const generateMermaidCode = () => {
    let mermaid = '```mermaid\ngraph TD\n';
    currentNodes.forEach((node, idx) => {
      const cleanText = node.text.replace(/"/g, "'").substring(0, 70);
      const icon = getNodeIconSymbol(node.type);
      mermaid += `  ${node.id}["${icon} ${node.label}:<br/>${cleanText}"]\n`;
      if (idx > 0 && node.type !== 'OBJECTION') {
        const prev = currentNodes[idx - 1];
        mermaid += `  ${prev.id} --> ${node.id}\n`;
      }
    });

    // Conectar objeciones si existen
    const objections = currentNodes.filter(n => n.type === 'OBJECTION');
    const conclusions = currentNodes.filter(n => n.type === 'CONCLUSION');
    if (conclusions.length > 0 && objections.length > 0) {
      objections.forEach(obj => {
        mermaid += `  ${obj.id} -.->|cuestiona| ${conclusions[0].id}\n`;
      });
    }

    mermaid += '```';
    return mermaid;
  };

  // Guardar y exportar a Obsidian
  const handleExportToObsidian = async () => {
    try {
      const mermaidCode = generateMermaidCode();
      const markdownContent = `---
type: arbol-argumento-logico
title: "${currentTitle}"
validity_score: ${validityScore}
date: ${new Date().toISOString()}
tags:
  - polimata-os
  - logica-deductiva
  - argumentacion
---

# 🌳 ${currentTitle}

> **Tesis Central:** ${currentThesis || 'Conclusión demostrada.'}
> **Nivel de Solidez Deductiva:** \`${validityScore}% / 100%\`

---

## 📊 Diagrama de Flujo Lógico (Mermaid)

${mermaidCode}

---

## 📜 Desglose Estructurado de Premisas

${currentNodes.map((n, i) => `### ${i + 1}. ${getNodeTypeName(n.type)} (${n.label})
> ${n.text}
`).join('\n')}

---
*Mapeado con el Analizador Lógico de Polímata OS*
`;

      const safeTitle = currentTitle.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_');
      const filename = `Argumento_${safeTitle}.md`;

      const handle = await getStoredVaultHandle();
      if (handle) {
        const hasPerm = await verifyPermission(handle);
        if (hasPerm) {
          await writeVaultFile(handle, ['Polimata_OS', 'Arboles_Logicos'], filename, markdownContent);
          setFeedbackToast(`💎 ¡Árbol guardado directamente en tu Bóveda de Obsidian!`);
          setTimeout(() => setFeedbackToast(null), 3000);
          return;
        }
      }

      // Móvil
      const vault = (typeof window !== 'undefined' && localStorage.getItem('polimata_obsidian_vault_name')) || 'Polimata_Vault';
      openInObsidianApp(vault, `Polimata_OS/Arboles_Logicos/${safeTitle}`, markdownContent);
      setFeedbackToast(`💎 Enviando diagrama a la app de Obsidian...`);
      setTimeout(() => setFeedbackToast(null), 3000);
    } catch (err: any) {
      alert(`Error al exportar: ${err.message}`);
    }
  };

  // Guardar en SQLite
  const handleSaveToDatabase = async () => {
    try {
      const res = await fetch('/api/arguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTitle,
          thesisStatement: currentThesis || 'Tesis argumentada',
          nodes: currentNodes,
          edges: [],
          validityScore
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackToast('✅ ¡Árbol argumentativo guardado con éxito en SQLite!');
        setTimeout(() => setFeedbackToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto p-5 sm:p-7 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* BOTÓN CERRAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABECERA */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <GitFork className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mapeo Lógico & Silogístico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Árbol de Premisas y Argumentación Lógica
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Descompón razonamientos complejos en axiomas, premisas y deducciones. Detecta saltos lógicos y exporta diagramas nativos a Obsidian.
          </p>
        </div>

        {/* SELECTOR DE PLANTILLAS HISTÓRICAS */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-bold">Plantillas de Demostración Filosófica:</span>
            <button
              type="button"
              onClick={handleCreateBlank}
              className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
            >
              + Crear Nuevo en Blanco
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_ARGUMENTS.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                  selectedTemplate.id === template.id
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {template.author}: {template.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* TITULO Y TESIS DEL ARGUMENTO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-[11px] font-mono text-slate-400">Título de la Demostración:</label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-slate-400">Solidez Deductiva:</label>
            <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl">
              <ShieldCheck className={`w-5 h-5 ${validityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div className="font-mono">
                <span className="text-sm font-black text-white">{validityScore}%</span>
                <span className="text-[10px] text-slate-400 ml-1">
                  {validityScore >= 80 ? 'Válido' : 'Revisar Objeciones'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TESIS CENTRAL */}
        <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1">
          <label className="block text-[11px] font-mono text-emerald-400 uppercase font-bold">
            👑 Tesis Central / Conclusión a Demostrar:
          </label>
          <input
            type="text"
            value={currentThesis}
            onChange={(e) => setCurrentThesis(e.target.value)}
            placeholder="Escribe la tesis central que este árbol sostiene..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* FLUJO SECUENCIAL DE PREMISAS (ÁRBOL VERTICAL) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase font-mono text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Cadena de Premisas & Deducción ({currentNodes.length} Nodos)</span>
            </h3>

            <button
              type="button"
              onClick={() => setShowAddNode(!showAddNode)}
              className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 font-mono text-xs font-bold rounded-xl border border-emerald-500/30 transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddNode ? 'Cancelar' : 'Añadir Premisa'}</span>
            </button>
          </div>

          {/* FORMULARIO AGREGAR NODO */}
          {showAddNode && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Tipo de Nodo:</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as NodeType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PREMISE_MAJOR">🏛️ Premisa Mayor (Axioma / Principio)</option>
                    <option value="PREMISE_MINOR">📖 Premisa Menor (Evidencia / Cita)</option>
                    <option value="INFERENCE">⚙️ Inferencia Lógica (Deducción intermedia)</option>
                    <option value="OBJECTION">⚠️ Objeción / Contraargumento</option>
                    <option value="REBUTTAL">🛡️ Refutación / Respuesta</option>
                    <option value="CONCLUSION">👑 Conclusión Final</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Etiqueta Breve:</label>
                  <input
                    type="text"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="Ej. Axioma 1 o Cita de Locke"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Proposición o Argumento:</label>
                <textarea
                  rows={3}
                  value={newNodeText}
                  onChange={(e) => setNewNodeText(e.target.value)}
                  placeholder="Escribe la premisa o el argumento con precisión conceptual..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleAddNode}
                disabled={!newNodeText.trim()}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl font-mono cursor-pointer transition shadow"
              >
                + Insertar en la Cadena Lógica
              </button>
            </div>
          )}

          {/* LISTA VISUAL DE NODOS CONECTADOS */}
          <div className="space-y-2">
            {currentNodes.map((node, index) => {
              const borderColors = getNodeBorderColor(node.type);
              const iconSymbol = getNodeIconSymbol(node.type);

              return (
                <div key={node.id} className="space-y-1.5">
                  <div className={`p-4 rounded-2xl border ${borderColors} transition-all shadow-sm space-y-2`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{iconSymbol}</span>
                        <span className="text-[11px] font-mono font-bold text-slate-200 uppercase">
                          {node.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                          {getNodeTypeName(node.type)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteNode(node.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                        title="Eliminar este nodo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={node.text}
                      onChange={(e) => handleUpdateNodeText(node.id, e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  {/* Flecha conectora entre nodos */}
                  {index < currentNodes.length - 1 && (
                    <div className="flex justify-center py-0.5 text-slate-600">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TOAST FEEDBACK */}
        {feedbackToast && (
          <div className="p-3 bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* BOTONES DE ACCIÓN: EXPORTAR A OBSIDIAN Y GUARDAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportToObsidian}
            className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer font-mono"
          >
            <span>💎 Exportar Diagrama a Obsidian (Mermaid.js)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToDatabase}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer font-mono"
          >
            <Save className="w-4 h-4" />
            <span>Guardar en Base de Datos Local</span>
          </button>
        </div>

      </div>
    </div>
  );
}

function getNodeTypeName(type: NodeType): string {
  switch (type) {
    case 'PREMISE_MAJOR': return 'Axioma / Premisa Mayor';
    case 'PREMISE_MINOR': return 'Evidencia / Cita';
    case 'INFERENCE': return 'Inferencia Intermedia';
    case 'OBJECTION': return 'Objeción Crítica';
    case 'REBUTTAL': return 'Refutación';
    case 'CONCLUSION': return 'Conclusión Demostrada';
  }
}

function getNodeIconSymbol(type: NodeType): string {
  switch (type) {
    case 'PREMISE_MAJOR': return '🏛️';
    case 'PREMISE_MINOR': return '📖';
    case 'INFERENCE': return '⚙️';
    case 'OBJECTION': return '⚠️';
    case 'REBUTTAL': return '🛡️';
    case 'CONCLUSION': return '👑';
  }
}

function getNodeBorderColor(type: NodeType): string {
  switch (type) {
    case 'PREMISE_MAJOR': return 'bg-sky-950/40 border-sky-500/40';
    case 'PREMISE_MINOR': return 'bg-blue-950/40 border-blue-500/40';
    case 'INFERENCE': return 'bg-purple-950/40 border-purple-500/40';
    case 'OBJECTION': return 'bg-amber-950/50 border-amber-500/50';
    case 'REBUTTAL': return 'bg-teal-950/40 border-teal-500/40';
    case 'CONCLUSION': return 'bg-emerald-950/50 border-emerald-500/60 shadow-emerald-950/30';
  }
}
