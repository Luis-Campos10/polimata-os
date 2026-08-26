'use client';

import { useState } from 'react';
import { BookOpen, HelpCircle, History, Network, ArrowRight, X, Plus, ShieldCheck, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import KnowledgeGraphCanvas from '@/components/KnowledgeGraphCanvas';

interface Question {
  id: string;
  number: number;
  title: string;
  description: string;
}

interface Node {
  id: string;
  label: string;
  nodeType: string;
  description?: string | null;
}

interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
  justification?: string | null;
}

export default function SaberClient({
  questions,
  nodes,
  edges
}: {
  questions: Question[];
  nodes: Node[];
  edges: Edge[];
}) {
  // Modal Estados
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [showNewPositionModal, setShowNewPositionModal] = useState(false);

  // Formulario para nueva posición
  const [newPosition, setNewPosition] = useState('');
  const [newConfidence, setNewConfidence] = useState(75);
  const [newArgument, setNewArgument] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSavePosition() {
    if (!newPosition.trim()) return;
    setIsSaving(true);
    try {
      const qId = selectedQuestion ? selectedQuestion.id : 'Q01';
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: qId,
          positionSummary: newPosition,
          confidence: newConfidence,
          argument: newArgument,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          setShowNewPositionModal(false);
          setNewPosition('');
          setNewArgument('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="space-y-6 pb-16">
      {/* Cabecera Principal */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-800/30 shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Base de Conocimiento & Question Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
            Saber & 18 Grandes Preguntas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Registro longitudinal de tu evolución intelectual, posturas filosóficas, grafo de conocimiento 2D y biblioteca personal.
          </p>
        </div>
      </header>

      {/* Tarjetas de Accesos Rápidos INTERACTIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setShowLedgerModal(true)}
          className="group text-left p-5 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 shadow-md active:scale-98"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl group-hover:scale-105 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                Question Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Historial inmutable de tus posiciones anuales, argumentos y evidencias.
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold text-purple-400 pt-1">
                Abrir Question Ledger <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setShowGraphModal(true)}
          className="group text-left p-5 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all duration-300 shadow-md active:scale-98"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl group-hover:scale-105 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                Grafo de Conocimiento 2D
              </h3>
              <p className="text-xs text-slate-400">
                Visualiza {nodes.length} nodos y {edges.length} relaciones en un lienzo 2D interactivo.
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold text-sky-400 pt-1">
                Abrir lienzo gráfico 2D <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Sección Las 18 Grandes Preguntas */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              Las 18 Grandes Preguntas Núcleo
            </h2>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 w-fit">
            18 Preguntas Registradas
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/30 transition-all duration-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold text-sm flex items-center justify-center">
                    {q.id}
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-100">{q.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{q.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Confianza Metacognitiva</span>
                    <span className="text-xs font-bold text-purple-300 font-mono">75%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuestion(q);
                      setShowLedgerModal(true);
                    }}
                    className="px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 text-xs font-semibold rounded-lg transition border border-purple-500/30"
                  >
                    Ver Ledger
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL 1: QUESTION LEDGER COMPLETO */}
      {showLedgerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowLedgerModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase">
                <History className="w-4 h-4" />
                <span>Question Ledger — Historial Inmutable</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                {selectedQuestion ? `${selectedQuestion.id} — ${selectedQuestion.title}` : 'Question Ledger (Todas las Preguntas)'}
              </h2>
              {selectedQuestion && (
                <p className="text-xs text-slate-300">{selectedQuestion.description}</p>
              )}
            </div>

            {/* Evolución de Posición Anual */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Historial de Posiciones Anuales</h3>

              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                      REGISTRO 2026
                    </span>
                    <span className="text-slate-400">Confianza: <strong className="text-slate-200">75%</strong></span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    "El universo emergió mediante el Big Bang. El conocimiento requiere falsificación popperiana y actualización Bayesiana."
                  </p>
                  <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] text-slate-400">
                    <span>Mejores Argumentos: 2 registrados</span>
                    <span>Objeciones: 1 registrada</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNewPositionModal(true)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Registrar Nueva Posición Anual
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: GRAFO DE CONOCIMIENTO 2D VISUAL */}
      {showGraphModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGraphModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase">
                <Network className="w-4 h-4" />
                <span>Visualizador Gráfico 2D del Grafo</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">Grafo de Conocimiento Interactivo (2D Canvas)</h2>
              <p className="text-xs text-slate-400">
                Arrastra los nodos, filtra por tipo y agrega nuevas conexiones persistentes en SQLite.
              </p>
            </div>

            {/* Componente Canvas 2D */}
            <KnowledgeGraphCanvas
              initialNodes={nodes}
              initialEdges={edges}
            />
          </div>
        </div>
      )}

      {/* MODAL 3: AGREGAR NUEVA POSICIÓN AL LEDGER */}
      {showNewPositionModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowNewPositionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-100">Nueva Entrada en Question Ledger</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tu Posición Filosófica Actual:
              </label>
              <textarea
                rows={3}
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Escribe tu postura provisional..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nivel de Confianza ({newConfidence}%):
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newConfidence}
                onChange={(e) => setNewConfidence(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mejor Argumento Principal:
              </label>
              <input
                type="text"
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                placeholder="Ej. Falsificación de Popper..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Posición registrada inmutablemente en SQLite.
              </div>
            )}

            <button
              type="button"
              onClick={handleSavePosition}
              disabled={isSaving || !newPosition.trim()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition"
            >
              {isSaving ? 'Guardando en SQLite...' : 'Guardar Posición en Ledger'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
