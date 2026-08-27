'use client';

import { useState } from 'react';
import { Clock, Calendar, BookOpen, ArrowRight, Sparkles, Compass, ChevronLeft, ChevronRight, Search, Layers } from 'lucide-react';

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
  label: string;
  epochTitle: string;
  historicalContext: string;
  scientificRevolution: string;
  color: string;
  accentBorder: string;
  yearsIncluded: number[];
}

const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    eraId: 'era-origins-antiquity',
    yearRange: 'Origen del Cosmos ➔ Antigüedad Clásica (Año 0)',
    label: 'Orígenes & Año 0',
    epochTitle: 'Cosmología, Prehistoria & Filosofía Clásica',
    historicalContext: 'Big History, geología de la Tierra, origen del Homo sapiens, revolución agrícola y nacimiento de la filosofía socrática y helenística.',
    scientificRevolution: 'Astrofísica, evolución geológica, geometría euclidiana, lógica aristotélica y ética de la virtud.',
    color: 'from-amber-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-amber-500/50',
    yearsIncluded: [1, 2] // Años 1 y 2 del programa (Obras #1 a #34)
  },
  {
    eraId: 'era-middle-ages',
    yearRange: '500 — 1500 d.C.',
    label: 'Año 1000 d.C.',
    epochTitle: 'Edad Media, Escolástica & Primeras Universidades',
    historicalContext: 'Preservación del saber en monasterios y casas de sabiduría árabes. Fundación de las universidades de Bolonia, París y Oxford.',
    scientificRevolution: 'Síntesis entre fe y razón aristotélica, teología sistemática, matemáticas medievales y óptica.',
    color: 'from-purple-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-purple-500/50',
    yearsIncluded: [3] // Año 3 del programa (Obras #35 a #51)
  },
  {
    eraId: 'era-renaissance',
    yearRange: '1500 — 1650 d.C.',
    label: 'Año 1500 d.C.',
    epochTitle: 'Renacimiento, Humanismo & El Método Científico',
    historicalContext: 'Imprenta de tipos móviles, redescubrimiento del humanismo secular, viajes globales y emergencia del estado moderno.',
    scientificRevolution: 'Revolución copernicana heliocéntrica, método empírico de Bacon, geometría analítica y duda cartesiana.',
    color: 'from-sky-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-sky-500/50',
    yearsIncluded: [4] // Año 4 del programa (Obras #52 a #68)
  },
  {
    eraId: 'era-enlightenment',
    yearRange: '1650 — 1800 d.C.',
    label: 'Año 1700 d.C.',
    epochTitle: 'La Ilustración & La Revolución Newtoniana',
    historicalContext: 'La era de la razón, los enciclopedistas, los derechos individuales, la Revolución Americana y la economía clásica.',
    scientificRevolution: 'Mecánica clásica de Newton (cálculo y gravitación universal), empirismo de Locke/Hume y criticismo kantiano.',
    color: 'from-teal-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-teal-500/50',
    yearsIncluded: [5] // Año 5 del programa (Obras #69 a #85)
  },
  {
    eraId: 'era-19th-century',
    yearRange: '1800 — 1900 d.C.',
    label: 'Año 1850 d.C.',
    epochTitle: 'Siglo XIX: Evolución, Industria & Dinámica',
    historicalContext: 'Revolución industrial, urbanización, surgimiento de la crítica social, termodinámica y debate sobre el progreso humano.',
    scientificRevolution: 'Teoría de la evolución de Darwin, electromagnetismo de Maxwell, termodinámica estadística y fundamentos lógicos de Frege.',
    color: 'from-emerald-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-emerald-500/50',
    yearsIncluded: [6, 7] // Años 6 y 7 del programa (Obras #86 a #119)
  },
  {
    eraId: 'era-20th-century',
    yearRange: '1900 — 2000 d.C.',
    label: 'Año 1950 d.C.',
    epochTitle: 'Siglo XX: Relatividad, Cuántica & Computación',
    historicalContext: 'Revoluciones científicas masivas, guerra fría, carrera espacial y transición a la sociedad digital e interconectada.',
    scientificRevolution: 'Relatividad de Einstein, física cuántica, máquina universal de Turing, cibernética de Wiener y teoría de la información de Shannon.',
    color: 'from-indigo-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-indigo-500/50',
    yearsIncluded: [8, 9] // Años 8 y 9 del programa (Obras #120 a #153)
  },
  {
    eraId: 'era-contemporary',
    yearRange: '2000 — 2026+ (Actualidad)',
    label: 'Hoy (2026)',
    epochTitle: 'Era de la Inteligencia Artificial & Sistemas Complejos',
    historicalContext: 'Sociedad red globalizada, modelos masivos de lenguaje, epistemología de la incertidumbre y ciencia de la mente.',
    scientificRevolution: 'Ciencia de redes complejas, economía conductual de Kahneman, heurística y sesgos, antifragilidad y polimatía.',
    color: 'from-rose-950/80 via-slate-900 to-slate-950',
    accentBorder: 'border-rose-500/50',
    yearsIncluded: [10] // Año 10 del programa (Obras #154 a #170)
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const activeMilestone = TIMELINE_MILESTONES[selectedIndex];

  // Filtrar obras asociadas a los años de la época activa
  const worksInActiveEra = works.filter((w) => activeMilestone.yearsIncluded.includes(w.year));

  // Aplicar búsqueda si el usuario escribe en el buscador
  const displayWorks = searchQuery.trim()
    ? works.filter((w) => {
        const q = searchQuery.toLowerCase();
        return (
          w.author.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          w.prescribedReading.toLowerCase().includes(q) ||
          String(w.workNumber) === q
        );
      })
    : worksInActiveEra;

  return (
    <div className="space-y-6">
      {/* 1. BARRA / DIAL DESLIZANTE INTERACTIVO DE ÉPOCAS */}
      <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-bold uppercase">
            <Clock className="w-4 h-4" />
            <span>Navegador Temporal Interactivo (170 Obras desde el Origen)</span>
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
                  onClick={() => {
                    setSelectedIndex(idx);
                    setSearchQuery('');
                  }}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono text-[9px] sm:text-xs font-bold border-2 transition-all shadow-md ${
                      isSelected
                        ? 'bg-white text-slate-950 border-purple-400 shadow-purple-500/50 ring-4 ring-purple-500/20'
                        : idx < selectedIndex
                        ? 'bg-purple-950 text-purple-200 border-purple-500/60'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {idx === 0 ? '0' : m.label.replace('Año ', '').replace(' d.C.', '')}
                  </div>
                  <span
                    className={`text-[8px] sm:text-[10px] font-mono mt-1.5 whitespace-nowrap transition-colors hidden sm:block ${
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

        {/* CONTROLES ANTERIOR / SIGUIENTE Y BUSCADOR RÁPIDO */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
          <div className="flex justify-between items-center gap-2">
            <button
              type="button"
              disabled={selectedIndex === 0}
              onClick={() => {
                setSelectedIndex((prev) => Math.max(0, prev - 1));
                setSearchQuery('');
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1 cursor-pointer font-mono"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Anterior
            </button>

            <span className="text-xs font-mono font-bold text-sky-400 text-center">
              {activeMilestone.yearRange}
            </span>

            <button
              type="button"
              disabled={selectedIndex === TIMELINE_MILESTONES.length - 1}
              onClick={() => {
                setSelectedIndex((prev) => Math.min(TIMELINE_MILESTONES.length - 1, prev + 1));
                setSearchQuery('');
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1 cursor-pointer font-mono"
            >
              Siguiente <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar obra o autor (#1 OpenStax, Darwin...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
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
            {displayWorks.length} obras en esta vista
          </span>
        </div>

        {/* DETALLE HISTÓRICO Y CIENTÍFICO */}
        {!searchQuery && (
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
        )}

        {/* 3. CATÁLOGO COMPLETO DE OBRAS MAESTRAS DEL PROGRAMA */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Obras del Canon ({displayWorks.length} obras · Toca para ver ficha):
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayWorks.map((work) => (
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
        </div>
      </section>
    </div>
  );
}
