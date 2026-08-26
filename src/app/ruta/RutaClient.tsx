'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, BookOpen, ChevronRight, Award, X, Play, Clock, CheckCircle2, HelpCircle } from 'lucide-react';

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

  // Agrupar obras por Año (1 al 10)
  const worksByYear = Array.from({ length: 10 }, (_, i) => {
    const yearNum = i + 1;
    return {
      year: yearNum,
      works: works.filter((w) => w.year === yearNum),
    };
  });

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
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Mapa de Aprendizaje — 10 Años + Fase 0</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-50 tracking-tight">Ruta Interdisciplinaria</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          16 semanas preparatorias de laboratorio cognitivo + 170 obras/rutas núcleo organizadas año por año. Haz clic en cualquier obra para abrir su ficha de lectura.
        </p>
      </header>

      {/* Seccion FASE 0 */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            FASE 0 — Aprender a Aprender (16 Semanas)
          </h2>
          <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
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
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-extrabold text-xs shrink-0">
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

      {/* Seccion AÑOS 1 al 10 (170 OBRAS) */}
      <section className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
            CANON DE 170 OBRAS (Años 1 al 10)
          </h2>
        </div>

        <div className="space-y-3">
          {worksByYear.map(({ year, works }) => (
            <details
              key={year}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden group shadow-sm"
              open={year === 1}
            >
              <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-800/70 transition list-none font-bold text-sm text-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center text-xs font-black border border-slate-700">
                    A{year}
                  </span>
                  <span>AÑO {year} — Canon Principal</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
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
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                            #{work.workNumber}
                          </span>
                          <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            Nivel {work.level}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
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
                    <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                      <strong className="text-slate-200">Qué leer:</strong> {work.prescribedReading}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* MODAL DETALLE DE OBRA DEL CANON */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedWork(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-mono">
                OBRA #{selectedWork.workNumber} · AÑO {selectedWork.year}
              </span>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-mono">
                Nivel {selectedWork.level}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100">
              {selectedWork.author} — <em className="text-sky-300 font-normal">{selectedWork.title}</em>
            </h3>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <div>
                <strong className="text-slate-200 text-[11px] uppercase font-bold block">Prescripción de Lectura:</strong>
                <p className="leading-relaxed mt-0.5">{selectedWork.prescribedReading}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Preguntas Primarias:</span>
                <span className="font-mono text-purple-300 font-bold">
                  {selectedWork.primaryQuestionsJson ? JSON.parse(selectedWork.primaryQuestionsJson).join(', ') : ''}
                </span>
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
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
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
