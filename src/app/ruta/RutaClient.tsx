'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, BookOpen, ChevronRight, Award, X, Play, Clock, CheckCircle2, HelpCircle, History, Calendar, Layers } from 'lucide-react';
import InteractiveTimeline from '@/components/InteractiveTimeline';
import { getWorkPublicationYear } from '@/lib/workYearHelper';

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  purpose: string;
}

interface Work {
  id: string;
  workNumber: number;
  year: number;
  author: string;
  title: string;
  level: string;
  documentType: string;
  prescribedReading: string;
  primaryQuestionsJson: string;
}

interface HistoricalEpoch {
  name: string;
  period: string;
  description: string;
  gradient: string;
  worksFilter: (w: Work) => boolean;
}

export default function RutaClient({
  weeks,
  works,
}: {
  weeks: Week[];
  works: Work[];
}) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'YEARS' | 'TIMELINE'>('YEARS');

  // Agrupar obras por Año (1 al 10)
  const worksByYear = Array.from({ length: 10 }, (_, i) => {
    const yearNum = i + 1;
    return {
      year: yearNum,
      works: works.filter((w) => w.year === yearNum),
    };
  });

  // Agrupar obras por Época Histórica
  const historicalEpochs: HistoricalEpoch[] = [
    {
      name: 'Antigüedad Clásica & Helenismo',
      period: '800 a.C. — 500 d.C.',
      description: 'Nacimiento de la filosofía socrática, la lógica aristotélica, la geometría euclidiana y el estoicismo.',
      gradient: 'from-amber-950/60 to-slate-900 border-amber-500/30 text-amber-300',
      worksFilter: (w) => {
        const a = w.author.toLowerCase();
        return a.includes('platón') || a.includes('platon') || a.includes('aristóteles') || a.includes('aristoteles') || a.includes('homero') || a.includes('séneca') || a.includes('seneca') || a.includes('epicteto') || a.includes('aurelio') || a.includes('euclides') || a.includes('lucrecio') || a.includes('tucídides');
      }
    },
    {
      name: 'Edad Media & Renacimiento',
      period: '500 — 1600',
      description: 'Escolástica, teología racional, humanismo renacentista y nacimiento de la ciencia política.',
      gradient: 'from-purple-950/60 to-slate-900 border-purple-500/30 text-purple-300',
      worksFilter: (w) => {
        const a = w.author.toLowerCase();
        return a.includes('agustín') || a.includes('agustin') || a.includes('aquino') || a.includes('dante') || a.includes('maquiavelo') || a.includes('montaigne') || a.includes('erasmo');
      }
    },
    {
      name: 'Revolución Científica & Ilustración',
      period: '1600 — 1800',
      description: 'El método empírico, el racionalismo cartesiano, la física newtoniana, el contrato social y la economía clásica.',
      gradient: 'from-sky-950/60 to-slate-900 border-sky-500/30 text-sky-300',
      worksFilter: (w) => {
        const a = w.author.toLowerCase();
        return a.includes('bacon') || a.includes('descartes') || a.includes('spinoza') || a.includes('locke') || a.includes('newton') || a.includes('hume') || a.includes('kant') || a.includes('smith') || a.includes('rousseau') || a.includes('leibniz');
      }
    },
    {
      name: 'Siglo XIX: Evolución & Modernidad',
      period: '1800 — 1900',
      description: 'Teoría de la evolución biológica, dialéctica materialista, electromagnetismo y crítica existencial.',
      gradient: 'from-emerald-950/60 to-slate-900 border-emerald-500/30 text-emerald-300',
      worksFilter: (w) => {
        const a = w.author.toLowerCase();
        return a.includes('darwin') || a.includes('marx') || a.includes('nietzsche') || a.includes('mill') || a.includes('maxwell') || a.includes('schopenhauer') || a.includes('dostoievski') || a.includes('tolstoi') || a.includes('frege');
      }
    },
    {
      name: 'Siglo XX & Era de la Información',
      period: '1900 — Actualidad',
      description: 'Relatividad, mecánica cuántica, computación teórica, teoría de la información y ciencia cognitiva.',
      gradient: 'from-blue-950/60 to-slate-900 border-blue-500/30 text-blue-300',
      worksFilter: (w) => {
        const a = w.author.toLowerCase();
        return a.includes('einstein') || a.includes('popper') || a.includes('turing') || a.includes('shannon') || a.includes('kahneman') || a.includes('feynman') || a.includes('neumann') || a.includes('wiener') || a.includes('gödel') || a.includes('godel') || a.includes('kuhn') || a.includes('rawls') || a.includes('taleb');
      }
    }
  ];

  async function handleStartWorkSession() {
    if (!selectedWork) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'WORK',
          targetId: selectedWork.id,
          durationMinutes: 30,
          notes: `Sesion de lectura iniciada para ${selectedWork.author} - ${selectedWork.title}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionStarted(true);
        setTimeout(() => {
          setSessionStarted(false);
          setSelectedWork(null);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="space-y-6 pb-16">
      {/* Cabecera */}
      <header className="relative overflow-hidden bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-sky-800/30 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold uppercase tracking-wider font-mono">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Mapa de Aprendizaje — 10 Años + Fase 0</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-50 tracking-tight">Ruta Interdisciplinaria</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          16 semanas preparatorias de laboratorio cognitivo + 170 obras núcleo organizadas año por año o por línea de tiempo histórica.
        </p>
      </header>

      {/* Seccion FASE 0 */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            FASE 0 — Aprender a Aprender (16 Semanas)
          </h2>
          <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-mono">
            Laboratorio Cognitivo
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {weeks.map((week) => (
            <Link
              key={week.id}
              href={`/ruta/fase-0/${week.id}`}
              className="group flex items-center justify-between p-4 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-extrabold text-xs shrink-0 font-mono">
                  W{week.weekNumber}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {week.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{week.purpose}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition-colors shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </section>

      {/* Seccion AÑOS 1 al 10 (170 OBRAS) CON SELECTOR DE VISTA */}
      <section className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              Canon de 170 Obras Núcleo
            </h2>
          </div>

          {/* BOTONES DE ALTERNANCIA DE VISTA: POR AÑOS VS LÍNEA DE TIEMPO */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('YEARS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'YEARS'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Por Años (1-10)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('TIMELINE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'TIMELINE'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Línea Histórica</span>
            </button>
          </div>
        </div>

        {/* VISTA 1: POR AÑOS DEL PROGRAMA (1 AL 10) */}
        {viewMode === 'YEARS' && (
          <div className="space-y-3">
            {worksByYear.map(({ year, works }) => (
              <details
                key={year}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden group shadow-sm"
                open={year === 1}
              >
                <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-800/70 transition list-none font-bold text-sm text-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center text-xs font-black border border-slate-700 font-mono">
                      A{year}
                    </span>
                    <span>AÑO {year} — Canon Principal</span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 font-mono">
                    {works.length} obras
                  </span>
                </summary>

                <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
                  {works.map((work) => (
                    <div
                      key={work.id}
                      onClick={() => setSelectedWork(work)}
                      className="p-4 bg-slate-900 rounded-xl border border-slate-800/90 hover:border-sky-500/40 transition cursor-pointer space-y-2 group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 font-mono">
                            <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                              #{work.workNumber}
                            </span>
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                              ✍️ {getWorkPublicationYear(work.workNumber)}
                            </span>
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              Nivel {work.level}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {work.documentType}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 mt-1.5 group-hover:text-sky-300 transition-colors">
                            {work.author} — <em className="text-sky-300 font-normal">{work.title}</em>
                          </h4>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono shrink-0">
                          {work.primaryQuestionsJson ? JSON.parse(work.primaryQuestionsJson).join(', ') : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-mono">
                        <strong className="text-slate-200">Qué leer:</strong> {work.prescribedReading}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}

        {/* VISTA 2: LÍNEA DE TIEMPO CRONOLÓGICA HISTÓRICA INTERACTIVA */}
        {viewMode === 'TIMELINE' && (
          <InteractiveTimeline
            works={works}
            onSelectWork={(w) => setSelectedWork(w)}
          />
        )}
      </section>

      {/* MODAL DETALLE DE OBRA DEL CANON */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedWork(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-1.5 font-mono">
              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                OBRA #{selectedWork.workNumber} · AÑO {selectedWork.year}
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                ✍️ Escrita en: {getWorkPublicationYear(selectedWork.workNumber)}
              </span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Nivel {selectedWork.level}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100">
              {selectedWork.author} — <em className="text-sky-300 font-normal">{selectedWork.title}</em>
            </h3>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div>
                <strong className="text-slate-200 text-[11px] uppercase font-bold block font-mono">Prescripción de Lectura:</strong>
                <p className="leading-relaxed mt-0.5">{selectedWork.prescribedReading}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400">Preguntas Primarias:</span>
                <span className="text-purple-300 font-bold">
                  {selectedWork.primaryQuestionsJson ? JSON.parse(selectedWork.primaryQuestionsJson).join(', ') : ''}
                </span>
              </div>

              {/* PUENTE TRANSDISCIPLINAR (DIÁLOGO ENTRE SIGLOS) */}
              <div className="pt-2 border-t border-slate-900 text-[11px] space-y-1">
                <span className="text-sky-400 font-bold font-mono flex items-center gap-1">
                  🌐 Puente Transdisciplinar:
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Esta obra conecta directamente con las preguntas ontológicas y epistemológicas analizadas en el <strong className="text-slate-200">Question Ledger</strong> y en el <strong className="text-slate-200">Grafo de Conocimiento</strong>.
                </p>
              </div>
            </div>

            {sessionStarted && (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sesión de lectura registrada en SQLite.
              </div>
            )}

            <button
              type="button"
              onClick={handleStartWorkSession}
              disabled={isSaving}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              {isSaving ? 'Registrando Sesión...' : 'Iniciar Sesión de Lectura para esta Obra'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
