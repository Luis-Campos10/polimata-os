'use client';

import { useState } from 'react';
import { BookOpen, HelpCircle, History, Network, ArrowRight, X, Plus, ShieldCheck, CheckCircle2, Sparkles, Layers, Compass, Brain, Filter, Search } from 'lucide-react';
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

interface MentalModel {
  id: string;
  title: string;
  discipline: 'Física & Mecánica' | 'Biología & Evolución' | 'Sistemas Complejos' | 'Economía & Estrategia' | 'Matemáticas & Probabilidad' | 'Filosofía & Epistemología' | 'Psicología & Aprendizaje';
  coreIdea: string;
  practicalApplication: string;
  gradient: string;
}

const MENTAL_MODELS: MentalModel[] = [
  {
    id: 'MM01',
    title: 'Razonamiento por Primeros Principios',
    discipline: 'Física & Mecánica',
    coreIdea: 'Descomponer un problema complejo en sus verdades más básicas e indudables y razonar hacia arriba desde ahí, en lugar de razonar por analogía o imitación.',
    practicalApplication: 'Úsalo para cuestionar suposiciones heredadas ("siempre se ha hecho así") y crear soluciones innovadoras desde cero.',
    gradient: 'from-sky-950 to-slate-900 border-sky-500/40'
  },
  {
    id: 'MM02',
    title: 'Entropía (Segunda Ley de la Termodinámica)',
    discipline: 'Física & Mecánica',
    coreIdea: 'En cualquier sistema cerrado, el desorden y la energía no utilizable tienden a aumentar naturalmente con el tiempo. El orden requiere inyección deliberada de energía y trabajo.',
    practicalApplication: 'Tus conocimientos, rutinas y proyectos decaen sin mantenimiento deliberado (repasos espaciados FSRS).',
    gradient: 'from-amber-950 to-slate-900 border-amber-500/40'
  },
  {
    id: 'MM03',
    title: 'Puntos de Apoyo y Palancas',
    discipline: 'Física & Mecánica',
    coreIdea: 'Una pequeña fuerza aplicada en el punto correcto produce un impacto desproporcionado ("Dadme un punto de apoyo y moveré el mundo" - Arquímedes).',
    practicalApplication: 'Identifica la habilidad o hábito núcleo (keystone habit) que automatiza y facilita todo lo demás.',
    gradient: 'from-emerald-950 to-slate-900 border-emerald-500/40'
  },
  {
    id: 'MM04',
    title: 'Selección Natural y Presión de Adaptación',
    discipline: 'Biología & Evolución',
    coreIdea: 'Los rasgos que favorecen la supervivencia y reproducción en un entorno específico se preservan; los desfavorables desaparecen ante la presión selectiva.',
    practicalApplication: 'Somete tus ideas a pruebas empíricas reales de falsación: las que sobreviven a la crítica son más robustas.',
    gradient: 'from-emerald-950 to-slate-900 border-emerald-600/40'
  },
  {
    id: 'MM05',
    title: 'Bucles de Retroalimentación (+/-)',
    discipline: 'Sistemas Complejos',
    coreIdea: 'Los bucles positivos amplifican el cambio (crecimiento exponencial o espirales descendentes); los negativos autorregulan y restauran el equilibrio homeostático.',
    practicalApplication: 'Diseña bucles de retroalimentación inmediata en tu estudio para corregir errores antes de que se consoliden.',
    gradient: 'from-indigo-950 to-slate-900 border-indigo-500/40'
  },
  {
    id: 'MM06',
    title: 'Propiedades Emergentes',
    discipline: 'Sistemas Complejos',
    coreIdea: 'Comportamientos o características de un sistema colectivo que no existen en ninguna de sus partes individuales aisladas ("El todo es más que la suma de sus partes").',
    practicalApplication: 'La polimatía y la creatividad nacen de conectar múltiples disciplinas: la intuición no surge de una materia aislada.',
    gradient: 'from-purple-950 to-slate-900 border-purple-500/40'
  },
  {
    id: 'MM07',
    title: 'Costo de Oportunidad',
    discipline: 'Economía & Estrategia',
    coreIdea: 'El valor de la mejor alternativa a la que renuncias al tomar una decisión. Cada "sí" es un "no" implícito a todo lo demás.',
    practicalApplication: 'Evalúa qué lecturas o proyectos de bajo valor estás pagando con el tiempo que podrías dedicar a las 170 obras núcleo.',
    gradient: 'from-amber-950 to-slate-900 border-amber-600/40'
  },
  {
    id: 'MM08',
    title: 'Teoría de Juegos: Dilema del Prisionero & Tit-for-Tat',
    discipline: 'Economía & Estrategia',
    coreIdea: 'En interacciones repetidas, la estrategia óptima de cooperación es empezar cooperando y luego replicar la acción previa del otro participante con perdón rápido.',
    practicalApplication: 'Construye relaciones a largo plazo basadas en transparencia y reciprocidad calibrada.',
    gradient: 'from-rose-950 to-slate-900 border-rose-500/40'
  },
  {
    id: 'MM09',
    title: 'Pensamiento Inverso (Invertir Siempre)',
    discipline: 'Matemáticas & Probabilidad',
    coreIdea: 'En lugar de preguntarte cómo tener éxito, pregúntate cómo garantizar el fracaso rotundo y evita esas condiciones deliberadamente (Carl Jacobi / Charlie Munger).',
    practicalApplication: '¿Cómo garantizar no aprender nada en 10 años? (Procrastinar, no hacer recall, leer pasivamente). Evita eso.',
    gradient: 'from-cyan-950 to-slate-900 border-cyan-500/40'
  },
  {
    id: 'MM10',
    title: 'Actualización Bayesiana de Creencias',
    discipline: 'Matemáticas & Probabilidad',
    coreIdea: 'Actualizar la probabilidad de que una hipótesis sea cierta conforme aparece nueva evidencia empírica, combinando la probabilidad previa con la fuerza del nuevo dato.',
    practicalApplication: 'Ajusta tu nivel de certeza en el Question Ledger de forma proporcional a la evidencia, sin aferrarte a dogmas.',
    gradient: 'from-blue-950 to-slate-900 border-blue-500/40'
  },
  {
    id: 'MM11',
    title: 'Navaja de Ockham',
    discipline: 'Filosofía & Epistemología',
    coreIdea: 'En igualdad de condiciones explicativas, la teoría más simple que requiere menor cantidad de supuestos no demostrados suele ser la correcta.',
    practicalApplication: 'Elimina explicaciones conspirativas o hipercomplejas cuando un modelo simple explica los datos observados.',
    gradient: 'from-teal-950 to-slate-900 border-teal-500/40'
  },
  {
    id: 'MM12',
    title: 'Falsacionismo Popperiano',
    discipline: 'Filosofía & Epistemología',
    coreIdea: 'Una teoría solo es científica si especifica qué observación empírica concreta demostraría que es falsa. El conocimiento avanza refutando conjeturas.',
    practicalApplication: 'Busca activamente contraejemplos a tus opiniones más queridas en lugar de buscar solo confirmaciones.',
    gradient: 'from-purple-950 to-slate-900 border-purple-600/40'
  },
  {
    id: 'MM13',
    title: 'Testing Effect & Dificultades Deseables (Bjork)',
    discipline: 'Psicología & Aprendizaje',
    coreIdea: 'El esfuerzo deliberado de recuperar información de la memoria (Active Recall) fortalece las vías neurales mucho más que la relectura pasiva y fluida.',
    practicalApplication: 'Cierra el libro e intenta escribir o explicar lo leído antes de volver a mirar las notas.',
    gradient: 'from-sky-950 to-slate-900 border-sky-600/40'
  },
  {
    id: 'MM14',
    title: 'Sesgo de Confirmación & Disonancia Cognitiva',
    discipline: 'Psicología & Aprendizaje',
    coreIdea: 'La tendencia automática del cerebro humano a notar y recordar datos que confirman sus creencias previas mientras ignora o descarta evidencia contraria.',
    practicalApplication: 'Anota de inmediato cualquier dato que contradiga tu postura filosófica para contrarrestar el olvido selectivo.',
    gradient: 'from-rose-950 to-slate-900 border-rose-600/40'
  },
  {
    id: 'MM15',
    title: 'Skin in the Game (Riesgo Compartido / Asimetría)',
    discipline: 'Economía & Estrategia',
    coreIdea: 'Nunca confíes en el juicio o consejo de quien no sufre las consecuencias negativas de equivocarse (Nassim Nicholas Taleb).',
    practicalApplication: 'Filtra las opiniones académicas de teóricos que no tienen consecuencias reales frente a quienes operan en la realidad.',
    gradient: 'from-amber-950 to-slate-900 border-amber-500/40'
  }
];

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
  const [showModelsModal, setShowModelsModal] = useState(false);

  // Filtros de Modelos Mentales
  const [selectedModelCategory, setSelectedModelCategory] = useState<string>('TODOS');
  const [modelSearch, setModelSearch] = useState<string>('');
  const [selectedDetailModel, setSelectedDetailModel] = useState<MentalModel | null>(null);

  // Formulario para nueva posición
  const [newPosition, setNewPosition] = useState('');
  const [newConfidence, setNewConfidence] = useState(75);
  const [newArgument, setNewArgument] = useState('');
  const [newFalsationCriteria, setNewFalsationCriteria] = useState('');
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
          falsationCriteria: newFalsationCriteria,
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
          setNewFalsationCriteria('');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const filteredModels = MENTAL_MODELS.filter((m) => {
    const matchesCat = selectedModelCategory === 'TODOS' || m.discipline === selectedModelCategory;
    const matchesSearch = !modelSearch.trim() || m.title.toLowerCase().includes(modelSearch.toLowerCase()) || m.coreIdea.toLowerCase().includes(modelSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="space-y-6 pb-16">
      {/* Cabecera Principal */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-800/30 shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Base de Conocimiento & Question Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
            Saber, Modelos & Preguntas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Registro longitudinal de tu evolución intelectual, Question Ledger inmutable, modelos mentales y grafo 2D.
          </p>
        </div>
      </header>

      {/* Tarjetas de Accesos Rápidos INTERACTIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. QUESTION LEDGER */}
        <button
          type="button"
          onClick={() => setShowLedgerModal(true)}
          className="group text-left p-5 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
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
              <span className="inline-flex items-center text-[11px] font-semibold text-purple-400 pt-1 font-mono">
                Abrir Question Ledger <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </button>

        {/* 2. CAJA DE MODELOS MENTALES */}
        <button
          type="button"
          onClick={() => setShowModelsModal(true)}
          className="group text-left p-5 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                🧭 Modelos Mentales Fundamentales
              </h3>
              <p className="text-xs text-slate-400">
                Catálogo de 15 modelos de física, biología, teoría de juegos y epistemología.
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold text-sky-400 pt-1 font-mono">
                Explorar Modelos <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </button>

        {/* 3. GRAFO DE CONOCIMIENTO 2D */}
        <button
          type="button"
          onClick={() => setShowGraphModal(true)}
          className="group text-left p-5 bg-slate-900/90 hover:bg-slate-800/90 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Grafo de Conocimiento 2D
              </h3>
              <p className="text-xs text-slate-400">
                Visualiza {nodes.length} nodos y {edges.length} relaciones en un lienzo táctil e interactivo.
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400 pt-1 font-mono">
                Abrir Grafo 2D <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </button>

        {/* 4. POLÍMATA MULTIMEDIA */}
        <a
          href="/multimedia"
          className="group text-left p-5 bg-purple-950/40 hover:bg-purple-950/70 rounded-2xl border border-purple-800/40 transition-all duration-300 shadow-md active:scale-98"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                🎬 Polímata Multimedia (36 Obras)
              </h3>
              <p className="text-xs text-slate-300">
                Anime científico, documentales y cine de ideas con preguntas socráticas.
              </p>
              <span className="inline-flex items-center text-[11px] font-semibold text-purple-300 pt-1 font-mono">
                Explorar Catálogo <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </a>
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
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 w-fit font-mono">
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
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold text-sm flex items-center justify-center font-mono">
                    {q.id}
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-100">{q.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{q.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuestion(q);
                      setShowNewPositionModal(true);
                    }}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-bold rounded-lg border border-purple-500/30 transition cursor-pointer"
                  >
                    + Registrar Postura
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: CAJA DE MODELOS MENTALES FUNDAMENTALES */}
      {showModelsModal && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-slate-950 border border-sky-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl relative text-slate-100">
            <button
              type="button"
              onClick={() => setShowModelsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase font-mono">
                <Compass className="w-4 h-4" />
                <span>Enrejado de Pensamiento Interdisciplinario</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Caja de Modelos Mentales Fundamentales</h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Catálogo de modelos de física, biología, economía y epistemología para analizar problemas multidimensionales.
              </p>
            </div>

            {/* BUSCADOR Y FILTROS */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center pt-2">
              <input
                type="text"
                placeholder="🔍 Buscar modelo o concepto..."
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono w-full sm:w-64"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-[10px]">
                {['TODOS', 'Física & Mecánica', 'Biología & Evolución', 'Sistemas Complejos', 'Economía & Estrategia', 'Matemáticas & Probabilidad', 'Filosofía & Epistemología', 'Psicología & Aprendizaje'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedModelCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
                      selectedModelCategory === cat
                        ? 'bg-sky-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat === 'TODOS' ? 'Todos' : cat.split('&')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* GRID DE MODELOS MENTALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {filteredModels.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedDetailModel(m)}
                  className={`p-4 rounded-2xl bg-gradient-to-b ${m.gradient} border cursor-pointer hover:scale-[1.02] transition shadow-lg flex flex-col justify-between space-y-2`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-sky-300 block">
                      {m.discipline}
                    </span>
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{m.coreIdea}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-sky-400 font-bold">
                    <span>Ver Aplicación Práctica</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* DETALLE DEL MODELO MENTAL SELECCIONADO */}
      {selectedDetailModel && (
        <div className="fixed inset-0 z-[100001] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-sky-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedDetailModel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-sky-400 block">
              {selectedDetailModel.discipline}
            </span>
            <h2 className="text-xl font-bold text-white">{selectedDetailModel.title}</h2>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-1">
              <strong className="text-sky-300 block text-[11px] font-mono">💡 Idea Núcleo:</strong>
              <p>{selectedDetailModel.coreIdea}</p>
            </div>

            <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed space-y-1 font-mono">
              <strong className="text-emerald-300 block text-[11px]">🛠️ Cómo Aplicarlo en tu Estudio:</strong>
              <p>{selectedDetailModel.practicalApplication}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDetailModel(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: QUESTION LEDGER INMUTABLE */}
      {showLedgerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowLedgerModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Question Ledger Longitudinal Inmutable</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">Registro de Posiciones Filosóficas</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ninguna posición se sobrescribe. Cada año se añade una nueva capa para medir cómo evolucionó tu pensamiento.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-slate-200 block text-sm">Estado del Ledger:</span>
              <p>
                Tienes <strong className="text-purple-300">18 preguntas maestras</strong> activas. Al finalizar cada año del currículo, el sistema te invitará a responder de nuevo sin consultar tus respuestas del año anterior para medir tu calibración real.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLedgerModal(false);
                setShowNewPositionModal(true);
              }}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Registrar Nueva Posición Anual
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: GRAFO DE CONOCIMIENTO 2D VISUAL */}
      {showGraphModal && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[96vh] overflow-y-auto p-4 sm:p-6 space-y-3 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowGraphModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase font-mono">
                <Network className="w-4 h-4" />
                <span>Visualizador Gráfico 2D del Grafo</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">Grafo de Conocimiento Interactivo (2D Canvas)</h2>
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Mejor Argumento Principal:
              </label>
              <input
                type="text"
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                placeholder="Ej. Evidencia empírica, lógica o estudio..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1 font-mono">
                🔬 Criterio de Falsación (Karl Popper):
              </label>
              <textarea
                rows={2}
                value={newFalsationCriteria}
                onChange={(e) => setNewFalsationCriteria(e.target.value)}
                placeholder="¿Qué hecho, descubrimiento o evidencia concreta demostraría que tu postura actual es errónea?"
                className="w-full bg-slate-950 border border-purple-800/40 rounded-xl p-2.5 text-xs text-purple-200 font-mono focus:outline-none focus:border-purple-400 placeholder:text-slate-600"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Posición registrada inmutablemente en SQLite.
              </div>
            )}

            <button
              type="button"
              onClick={handleSavePosition}
              disabled={isSaving || !newPosition.trim()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
            >
              {isSaving ? 'Guardando en SQLite...' : 'Guardar Posición en Ledger'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
