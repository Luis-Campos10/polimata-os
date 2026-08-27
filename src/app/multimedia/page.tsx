'use client';

import { useState } from 'react';
import { Tv, Film, Sparkles, BookOpen, Play, HelpCircle, ChevronRight, Search, Tag } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  category: 'Anime' | 'Documental' | 'Pelicula';
  discipline: string;
  description: string;
  whatToObserve: string;
  socraticQuestions: string[];
  coverGradient: string;
}

const MEDIA_CATALOG: MediaItem[] = [
  {
    id: 'M01',
    title: 'Dr. Stone',
    category: 'Anime',
    discipline: 'Física, Química & Historia de la Tecnología',
    description: 'Toda la humanidad es petrificada por 3,700 años. El joven científico Senku Ishigami despierta y reconstruye la civilización desde cero utilizando exclusivamente el método científico.',
    whatToObserve: 'Analiza la reconstrucción de la tabla periódica, la creación de la pólvora, el vidrio, la penicilina y la comunicación de ondas de radio.',
    socraticQuestions: [
      '¿Es el método científico un descubrimiento o un invento humano?',
      '¿Qué tecnología intermedia es el prerrequisito indispensable para la medicina moderna?'
    ],
    coverGradient: 'from-emerald-900 to-slate-900 border-emerald-500/40'
  },
  {
    id: 'M02',
    title: 'Ergo Proxy',
    category: 'Anime',
    discipline: 'Epistemología, Descartes & Filosofía de la Mente',
    description: 'En un futuro distópico, androides AutoReiv adquieren autoconciencia por el virus "Cogito". Un viaje filosófico lleno de alusiones a Descartes, Kant y el mito de la caverna.',
    whatToObserve: 'Identifica la alusión al "Cogito ergo sum", el problema mente-cuerpo de Descartes y la ilusión de la libre voluntad.',
    socraticQuestions: [
      'Si un autómata duda de su propia existencia, ¿demuestra que posee mente propia?',
      '¿En qué medida el lenguaje moldea la autoconciencia?'
    ],
    coverGradient: 'from-purple-900 to-slate-900 border-purple-500/40'
  },
  {
    id: 'M03',
    title: 'Cosmos: Un Viaje Personal (Carl Sagan)',
    category: 'Documental',
    discipline: 'Astronomía, Epistemología & Humanismo',
    description: 'La obra maestra de Carl Sagan que explora el universo, el nacimiento de la ciencia en Jonia y la responsabilidad del ser humano como polvo de estrellas consciente.',
    whatToObserve: 'Enfócate en la Biblioteca de Alejandría, el calendario cósmico y la paradoja de Fermi.',
    socraticQuestions: [
      '¿Por qué el pensamiento científico floreció en la Jonia del siglo VI a.C. y no en un imperio centralizado?',
      '¿Qué relación existe entre la humildad cósmica y la ética humana?'
    ],
    coverGradient: 'from-sky-900 to-slate-900 border-sky-500/40'
  },
  {
    id: 'M04',
    title: '12 Angry Men (12 Hombres en Pugna - 1957)',
    category: 'Pelicula',
    discipline: 'Argumentación Socrática, Sesgos & Psicología',
    description: 'Un jurado de 12 hombres debe decidir el destino de un sospechoso. Un solo jurado introduce duda razonable utilizando el método socrático para desmantelar prejuicios.',
    whatToObserve: 'Examina cómo el Jurado #8 utiliza la duda metódica, identifica falacias ad hominem y vence el sesgo de confirmación del grupo.',
    socraticQuestions: [
      '¿Cómo diferenciar la duda razonable legítima del mero negacionismo obstinado?',
      '¿Por qué el consenso rápido es a menudo un indicador de ilusión de dominio?'
    ],
    coverGradient: 'from-amber-900 to-slate-900 border-amber-500/40'
  },
  {
    id: 'M05',
    title: 'AlphaGo (DeepMind / Google)',
    category: 'Documental',
    discipline: 'Inteligencia Artificial, Intuición & Teoría de Juegos',
    description: 'El viaje del equipo de DeepMind para enfrentar la red neuronal AlphaGo contra Lee Sedol, el campeón mundial de Go.',
    whatToObserve: 'Observa la célebre "Jugada 37" en la partida 2: un movimiento que desafió 3,000 años de conocimiento humano tradicional.',
    socraticQuestions: [
      '¿Es la creatividad de un algoritmo cualitativamente distinta a la intuición humana?',
      '¿Qué enseña AlphaGo sobre los puntos ciegos de la experiencia heredada?'
    ],
    coverGradient: 'from-indigo-900 to-slate-900 border-indigo-500/40'
  },
  {
    id: 'M06',
    title: 'Oppenheimer (Christopher Nolan)',
    category: 'Pelicula',
    discipline: 'Física Cuántica, Ética & Geopolítica',
    description: 'La vida de J. Robert Oppenheimer y el desarrollo de la bomba atómica en el Proyecto Manhattan.',
    whatToObserve: 'Observa el dilema ético del científico al liberar una fuerza que escapa al control de la razón humana.',
    socraticQuestions: [
      '¿Tiene el científico responsabilidad moral sobre el uso político de sus descubrimientos?',
      '¿Puede el conocimiento ser éticamente neutro?'
    ],
    coverGradient: 'from-rose-900 to-slate-900 border-rose-500/40'
  }
];

export default function PolimataMultimediaPage() {
  const [filter, setFilter] = useState<'TODOS' | 'Anime' | 'Documental' | 'Pelicula'>('TODOS');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredItems = MEDIA_CATALOG.filter((item) => filter === 'TODOS' || item.category === filter);

  return (
    <main className="space-y-6 pb-16">
      {/* CABECERA Y TITULO */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-800/40 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold uppercase">
          <Tv className="w-3.5 h-3.5 text-purple-400" />
          <span>Polímata Multimedia & Cine de Ideas</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Catálogo de Anime, Películas y Documentales</h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Selección curada de obras audiovisuales analizadas bajo la lupa del aprendizaje interdisciplinario, la epistemología y el método científico.
        </p>
      </div>

      {/* BOTONES DE FILTRO */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 pb-2 font-mono text-xs">
        {['TODOS', 'Anime', 'Documental', 'Pelicula'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              filter === cat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === 'TODOS' ? 'Ver Todo el Catálogo' : cat}
          </button>
        ))}
      </div>

      {/* GRID DE CARDS MULTIMEDIA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className={`p-5 bg-gradient-to-b ${item.coverGradient} rounded-2xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col justify-between space-y-4 shadow-xl`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-black/60 text-purple-300 border border-purple-400/30 uppercase">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  {item.discipline}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{item.description}</p>
            </div>

            <button
              type="button"
              className="w-full py-2 bg-slate-900/90 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition border border-slate-700 flex items-center justify-center gap-1.5 shadow"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Ficha & Preguntas Socráticas</span>
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE DE OBRA MULTIMEDIA */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                {selectedMedia.category} · {selectedMedia.discipline}
              </span>
              <h2 className="text-xl font-bold text-white pt-1">{selectedMedia.title}</h2>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <strong className="text-purple-300 text-[11px] uppercase block font-mono">Sinopsis Pedagógica:</strong>
              <p className="leading-relaxed">{selectedMedia.description}</p>
            </div>

            <div className="p-3.5 bg-purple-950/40 rounded-2xl border border-purple-800/40 text-xs text-slate-200 space-y-1">
              <strong className="text-amber-300 text-[11px] uppercase block font-mono">Qué Observar al Verla:</strong>
              <p className="leading-relaxed font-mono">{selectedMedia.whatToObserve}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase font-mono block">
                Preguntas Socráticas a Responder:
              </span>
              {selectedMedia.socraticQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-sky-300 text-[10px] block font-mono">Pregunta {idx + 1}:</strong>
                  {q}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cerrar Ficha
            </button>

          </div>
        </div>
      )}
    </main>
  );
}
