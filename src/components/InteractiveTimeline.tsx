'use client';

import { useState } from 'react';
import { Clock, Calendar, BookOpen, ArrowRight, Sparkles, Compass, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface TimelineMilestone {
  eraId: string;
  yearRange: string;
  startYear: number;
  endYear: number;
  label: string;
  epochTitle: string;
  historicalContext: string;
  scientificRevolution: string;
  color: string;
  accentBorder: string;
  filterKeywords: string[];
}

const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    eraId: 'era-0',
    yearRange: 'Año 0 — 500 d.C.',
    startYear: 0,
    endYear: 500,
    label: 'Año 0 d.C.',
    epochTitle: 'Imperio Romano & Filosofía Helenística Tardía',
    historicalContext: 'Apogeo de Roma, Pax Romana y auge del estoicismo práctico como guía de vida ante la incertidumbre y el deber.',
    scientificRevolution: 'Geometría euclidiana, medicina galénica y consolidación de la ética de la virtud y la disciplina interior.',
    color: 'from-amber-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-amber-500/50',
    filterKeywords: ['séneca', 'seneca', 'epicteto', 'aurelio', 'agustín', 'agustin', 'lucrecio', 'euclides', 'platón', 'platon', 'aristóteles', 'aristoteles', 'tucídides']
  },
  {
    eraId: 'era-1000',
    yearRange: '500 — 1500 d.C.',
    startYear: 500,
    endYear: 1500,
    label: 'Año 1000',
    epochTitle: 'Edad Media, Escolástica & Primeras Universidades',
    historicalContext: 'Preservación del saber clásico en abadías y bibliotecas árabes. Fundación de las primeras universidades en Bolonia, París y Oxford.',
    scientificRevolution: 'Síntesis entre fe y razón aristotélica, óptica de Alhacén y nacimiento de la arquitectura gótica.',
    color: 'from-purple-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-purple-500/50',
    filterKeywords: ['aquino', 'dante', 'agustín', 'agustin', 'erasmo']
  },
  {
    eraId: 'era-1500',
    yearRange: '1500 — 1650 d.C.',
    startYear: 1500,
    endYear: 1650,
    label: 'Año 1500',
    epochTitle: 'Renacimiento, Humanismo & El Nacimiento del Método',
    historicalContext: 'Invención de la imprenta de tipos móviles, redescubrimiento del humanismo secular y fractura del monopolio del conocimiento.',
    scientificRevolution: 'Revolución copernicana heliocéntrica, anatomía de Vesalio y formulación del método inductivo empírico.',
    color: 'from-sky-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-sky-500/50',
    filterKeywords: ['maquiavelo', 'montaigne', 'bacon', 'descartes', 'hobbes']
  },
  {
    eraId: 'era-1700',
    yearRange: '1650 — 1800 d.C.',
    startYear: 1650,
    endYear: 1800,
    label: 'Año 1700',
    epochTitle: 'La Ilustración & La Revolución Newtoniana',
    historicalContext: 'La era de la razón, los enciclopedistas franceses, la Revolución Americana y la crítica a la autoridad dogmática.',
    scientificRevolution: 'Mecánica clásica de Newton (cálculo y gravitación), química moderna de Lavoisier y la economía política clásica.',
    color: 'from-teal-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-teal-500/50',
    filterKeywords: ['spinoza', 'locke', 'newton', 'hume', 'kant', 'smith', 'rousseau', 'leibniz']
  },
  {
    eraId: 'era-1850',
    yearRange: '1800 — 1900 d.C.',
    startYear: 1800,
    endYear: 1900,
    label: 'Año 1850',
    epochTitle: 'Siglo XIX: Evolución, Industria & Dinámica',
    historicalContext: 'Revolución industrial, urbanización masiva, crisis del idealismo y emergencia del pensamiento crítico moderno.',
    scientificRevolution: 'Teoría de la evolución por selección natural de Darwin, electromagnetismo de Maxwell y termodinámica estadística.',
    color: 'from-emerald-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-emerald-500/50',
    filterKeywords: ['darwin', 'marx', 'nietzsche', 'mill', 'maxwell', 'schopenhauer', 'dostoievski', 'tolstoi', 'frege']
  },
  {
    eraId: 'era-1950',
    yearRange: '1900 — 2000 d.C.',
    startYear: 1900,
    endYear: 2000,
    label: 'Año 1950',
    epochTitle: 'Siglo XX: Relatividad, Cuántica & Computación',
    historicalContext: 'Guerras mundiales, guerra fría, carrera espacial y la transición global a la sociedad de la información.',
    scientificRevolution: 'Relatividad de Einstein, mecánica cuántica, teoremas de Gödel, máquina de Turing, teoría de la información y ADN.',
    color: 'from-indigo-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-indigo-500/50',
    filterKeywords: ['einstein', 'popper', 'turing', 'shannon', 'feynman', 'neumann', 'wiener', 'gödel', 'godel', 'kuhn', 'rawls']
  },
  {
    eraId: 'era-2026',
    yearRange: '2000 — 2026+ (Actualidad)',
    startYear: 2000,
    endYear: 2026,
    label: 'Hoy (2026)',
    epochTitle: 'Era de la Inteligencia Artificial & Sistemas Complejos',
    historicalContext: 'Hiperconectividad digital, ciencia de redes globales y frontera del aprendizaje de máquinas y cognición humana.',
    scientificRevolution: 'Redes neuronales profundas, ciencia de la complejidad, epistemología de la incertidumbre y economía conductual.',
    color: 'from-rose-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-rose-500/50',
    filterKeywords: ['kahneman', 'taleb', 'complex', 'redes', 'inteligencia']
  }
];

export default function InteractiveTimeline({
  works,
  onSelectWork
}: {
  works: Work[];
  onSelectWork: (work: Work) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const activeMilestone = TIMELINE_MILESTONES[selectedIndex];

  // Filtrar obras asociadas al hito activo
  const matchingWorks = works.filter((w) => {
    const authorLower = w.author.toLowerCase();
    const titleLower = w.title.toLowerCase();
    return activeMilestone.filterKeywords.some((kw) => authorLower.includes(kw) || titleLower.includes(kw));
  });

  return (
    <div className="space-y-6">
      {/* 1. BARRA / DIAL DESLIZANTE INTERACTIVO DE ÉPOCAS */}
      <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-bold uppercase">
            <Clock className="w-4 h-4" />
            <span>Navegador Temporal Interactivo (Desde el Año 0 d.C.)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Hito {selectedIndex + 1} de {TIMELINE_MILESTONES.length}
          </span>
        </div>

        {/* DIAL DESLIZANTE CON BOTONES Y LÍNEA */}
        <div className="relative pt-2 pb-1">
          {/* LÍNEA DE FONDO */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
          
          {/* LÍNEA ACTIVA */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 via-sky-500 to-purple-500 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{ width: `${(selectedIndex / (TIMELINE_MILESTONES.length - 1)) * 100}%` }}
          />

          {/* BOTONES INTERACTIVOS DE HITOS */}
          <div className="relative flex justify-between items-center">
            {TIMELINE_MILESTONES.map((m, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={m.eraId}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold border-2 transition-all shadow-md ${
                      isSelected
                        ? 'bg-white text-slate-950 border-purple-400 shadow-purple-500/50 ring-4 ring-purple-500/20'
                        : idx < selectedIndex
                        ? 'bg-purple-950 text-purple-200 border-purple-500/60'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {idx === 0 ? '0' : m.label.replace('Año ', '')}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono mt-1.5 whitespace-nowrap transition-colors hidden sm:block ${
                      isSelected ? 'text-white font-bold' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTROLES ANTERIOR / SIGUIENTE PARA MÓVILES */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            disabled={selectedIndex === 0}
            onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1 cursor-pointer font-mono"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior Época
          </button>

          <span className="text-xs font-mono font-bold text-sky-400">
            {activeMilestone.yearRange}
          </span>

          <button
            type="button"
            disabled={selectedIndex === TIMELINE_MILESTONES.length - 1}
            onClick={() => setSelectedIndex((prev) => Math.min(TIMELINE_MILESTONES.length - 1, prev + 1))}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1 cursor-pointer font-mono"
          >
            Siguiente Época <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TARJETA PANORÁMICA DE LA ÉPOCA SELECCIONADA */}
      <section className={`p-6 rounded-3xl bg-gradient-to-br ${activeMilestone.color} border ${activeMilestone.accentBorder} space-y-4 shadow-2xl transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              {activeMilestone.yearRange}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {activeMilestone.epochTitle}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-black/60 text-xs font-mono font-bold text-slate-200 border border-white/10">
            {matchingWorks.length} obras en el canon
          </span>
        </div>

        {/* DETALLE HISTÓRICO Y CIENTÍFICO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
            <strong className="text-sky-300 font-mono text-[11px] block flex items-center gap-1">
              🏛️ Contexto Histórico & Filosófico:
            </strong>
            <p className="text-slate-200">{activeMilestone.historicalContext}</p>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
            <strong className="text-emerald-300 font-mono text-[11px] block flex items-center gap-1">
              🔬 Revolución Científica & Metódica:
            </strong>
            <p className="text-slate-200">{activeMilestone.scientificRevolution}</p>
          </div>
        </div>

        {/* 3. OBRAS DEL CANON PERTENECIENTES A ESTA ÉPOCA */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Obras Maestras del Programa en esta Época (Toca para ver ficha):
          </h4>

          {matchingWorks.length === 0 ? (
            <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-xs text-slate-400 italic">
              Las obras de este periodo se estudian en el contexto de sus preguntas primarias. Consulta la vista por años para más detalles.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingWorks.map((work) => (
                <div
                  key={work.id}
                  onClick={() => onSelectWork(work)}
                  className="p-4 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-white/10 hover:border-purple-500/50 transition cursor-pointer space-y-2 group shadow-md active:scale-98"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      Año {work.year} · #{work.workNumber}
                    </span>
                    <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Nivel {work.level}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {work.author}
                    </h5>
                    <p className="text-xs text-slate-300 italic font-serif mt-0.5">
                      {work.title}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 font-mono pt-1 border-t border-slate-800/80">
                    <strong className="text-slate-300">Lectura:</strong> {work.prescribedReading}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
