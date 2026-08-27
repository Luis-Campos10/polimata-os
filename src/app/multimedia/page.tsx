'use client';

import { useState, useEffect } from 'react';
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
  },
  {
    id: 'M07',
    title: 'Vinland Saga',
    category: 'Anime',
    discipline: 'Ética Estoica, Violencia & Filosofía Política',
    description: 'Un joven vikingo busca venganza pero descubre la filosofía de la no-violencia y la búsqueda de una sociedad justa sin esclavitud.',
    whatToObserve: 'Contrasta la ética de la fuerza bruta con el pacifismo activo de Thorfinn y la filosofía de Canuto sobre el amor divino.',
    socraticQuestions: [
      '¿Es la venganza un acto de justicia o una prisión psicológica?',
      '¿Qué constituye a un "verdadero guerrero" en sentido socrático?'
    ],
    coverGradient: 'from-amber-950 to-slate-900 border-amber-600/40'
  },
  {
    id: 'M08',
    title: 'Ghost in the Shell: Stand Alone Complex',
    category: 'Anime',
    discipline: 'Posthumanismo, Filosofía de la Mente & Ciberseguridad',
    description: 'En una sociedad donde la mente (Ghost) se conecta a cuerpos sintéticos (Shell), la mayor Kusanagi investiga crímenes informáticos e identidad.',
    whatToObserve: 'Analiza el concepto de "fenómeno emergente no planificado" en el episodio de los Laughing Man.',
    socraticQuestions: [
      'Si se reemplazan todos tus recuerdos con datos digitales, ¿sigues siendo la misma persona?',
      '¿Dónde reside la frontera entre el organismo y la herramienta?'
    ],
    coverGradient: 'from-cyan-950 to-slate-900 border-cyan-500/40'
  },
  {
    id: 'M09',
    title: 'Monster (Naoki Urasawa)',
    category: 'Anime',
    discipline: 'Psicología Forense, Ética Médica & Existencialismo',
    description: 'El neurocirujano Kenzo Tenma salva la vida de un niño que años más tarde se convierte en un sociópata brillante.',
    whatToObserve: 'Examina el imperativo categórico kantiano: "Todas las vidas humanas tienen valor equivalente".',
    socraticQuestions: [
      '¿Tiene un médico el deber de salvar a cualquier paciente sin juzgar sus actos futuros?',
      '¿Nace el monstruo por naturaleza o por condicionamiento psicológico?'
    ],
    coverGradient: 'from-slate-950 to-slate-900 border-slate-700/60'
  },
  {
    id: 'M10',
    title: 'Serial Experiments Lain',
    category: 'Anime',
    discipline: 'Ontología, Redes Digitales & Solipsismo',
    description: 'Una joven solitaria explora "The Wired", la red informática global, donde las fronteras entre realidad y conciencia se disuelven.',
    whatToObserve: 'Observa la profecía de 1998 sobre las redes sociales, la conciencia colectiva y la memoria digital.',
    socraticQuestions: [
      'Si una persona existe solo en la memoria de los demás, ¿está viva?',
      '¿Es la red un reflejo o un sustituto de la realidad empírica?'
    ],
    coverGradient: 'from-teal-950 to-slate-900 border-teal-500/40'
  },
  {
    id: 'M11',
    title: 'The Ascent of Man (Jacob Bronowski)',
    category: 'Documental',
    discipline: 'Historia de la Ciencia & Antropología',
    description: 'Serie documental seminal de la BBC que recorre la evolución del conocimiento humano desde la agricultura hasta la física nuclear.',
    whatToObserve: 'Presta atención al episodio en Göttingen y Auschwitz: la advertencia de Bronowski sobre el dogmatismo absoluto.',
    socraticQuestions: [
      '¿Por qué el conocimiento científico requiere la duda constante frente al dogma?',
      '¿Cómo el dominio del fuego y la geometría transformó la mente humana?'
    ],
    coverGradient: 'from-amber-900 to-slate-900 border-amber-500/40'
  },
  {
    id: 'M12',
    title: 'Connections (James Burke)',
    category: 'Documental',
    discipline: 'Pensamiento Interdisciplinario & Grafo de Invenciones',
    description: 'Demuestra cómo inventos aparentemente desconectados en la historia se unen para generar revoluciones tecnológicas no anticipadas.',
    whatToObserve: 'Observa cómo la rueda de agua condujo a la imprenta, las tarjetas perforadas y la computadora moderna.',
    socraticQuestions: [
      '¿Existen descubrimientos aislados o todo avance es un nodo en una red previa?',
      '¿Por qué el polímata conecta ideas mejor que el especialista aislado?'
    ],
    coverGradient: 'from-sky-950 to-slate-900 border-sky-500/40'
  },
  {
    id: 'M13',
    title: 'Mind Field (Michael Stevens / Vsauce)',
    category: 'Documental',
    discipline: 'Psicología Cognitiva & Neurociencia',
    description: 'Experimentos rigurosos sobre aislamiento sensorial, ilusión de libre albedrío, la obediencia y la memoria falsa.',
    whatToObserve: 'Examina la maleabilidad de la memoria humana y la facilidad con que se implantan falsos recuerdos.',
    socraticQuestions: [
      '¿Es fiable nuestra propia memoria autobiográfica sin registros externos?',
      '¿Hasta qué punto la autoridad altera el juicio ético personal?'
    ],
    coverGradient: 'from-violet-950 to-slate-900 border-violet-500/40'
  },
  {
    id: 'M14',
    title: 'Good Will Hunting (La Mente Indomable)',
    category: 'Pelicula',
    discipline: 'Genio Autodidacta, Matemáticas & Psicología',
    description: 'Un joven conserje con inteligencia matemática prodigiosa aprende a superar traumas mediante la honestidad emocional con su terapeuta.',
    whatToObserve: 'Compara la lectura memorística de libros con la experiencia viva y la calibración emocional.',
    socraticQuestions: [
      '¿Es suficiente la erudición teórica sin experiencia humana vivida?',
      '¿Qué distingue el talento bruto de la maestría cultivada?'
    ],
    coverGradient: 'from-emerald-950 to-slate-900 border-emerald-500/40'
  },
  {
    id: 'M15',
    title: 'Blade Runner (1982 / Ridley Scott)',
    category: 'Pelicula',
    discipline: 'Filosofía Existencial, Empatía & Posthumanismo',
    description: 'Un cazador de androides Replicantes cuestiona su propia humanidad al enfrentar a seres creados artificialmente que anhelan vivir.',
    whatToObserve: 'Analiza el famoso monólogo "Lágrimas en la lluvia" de Roy Batty y la prueba Voight-Kampff de empatía.',
    socraticQuestions: [
      '¿Qué define a un ser humano: la biología o la capacidad de sentir empatía y amar?',
      '¿Es la mortalidad la condición que otorga significado a la vida?'
    ],
    coverGradient: 'from-rose-950 to-slate-900 border-rose-500/40'
  },
  {
    id: 'M16',
    title: 'Primer (Shane Carruth)',
    category: 'Pelicula',
    discipline: 'Física Teórica, Lógica Causal & Paradojas',
    description: 'Dos ingenieros descubren accidentalmente cómo construir un bucle temporal en un garaje, enfrentando contradicciones lógicas complejas.',
    whatToObserve: 'Examina la coherencia lógica de las líneas temporales y las fallas de comunicación humana.',
    socraticQuestions: [
      '¿Se puede alterar el pasado sin destruir la causalidad del presente?',
      '¿Por qué el secreto y la ambición destruyen las alianzas científicas?'
    ],
    coverGradient: 'from-zinc-900 to-slate-900 border-zinc-700/60'
  },
  {
    id: 'M17',
    title: 'Gattaca (Andrew Niccol)',
    category: 'Pelicula',
    discipline: 'Genética, Bioética & Determinismo',
    description: 'En una sociedad donde los hijos son seleccionados genéticamente, un joven concebido naturalmente desafía el sistema para ser astronauta.',
    whatToObserve: 'Observa la lucha entre el determinismo biológico y la fuerza de la voluntad humana ("No dejé nada para el viaje de regreso").',
    socraticQuestions: [
      '¿Determina el ADN el límite absoluto del logro humano?',
      '¿Qué riesgos éticos conlleva la discriminación genética (eugenesia social)?'
    ],
    coverGradient: 'from-blue-950 to-slate-900 border-blue-500/40'
  }
];

export default function PolimataMultimediaPage() {
  const [filter, setFilter] = useState<'TODOS' | 'Anime' | 'Documental' | 'Pelicula'>('TODOS');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Estado para custom multimedia agregados por el usuario
  const [customCatalog, setCustomCatalog] = useState<MediaItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Anime' | 'Documental' | 'Pelicula'>('Anime');
  const [newDescription, setNewDescription] = useState('');

  // Cargar multimedia guardados por el usuario desde localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('polimata_custom_multimedia');
        if (saved) {
          setCustomCatalog(JSON.parse(saved));
        }
      }
    } catch (e) {}
  }, []);

  // Motor de Auto-Etiquetado Inteligente por Análisis de Palabras Clave
  const handleAutoTagAndAddMedia = () => {
    if (!newTitle.trim()) return;

    const fullText = `${newTitle} ${newDescription}`.toLowerCase();

    // 1. Determinar Disciplina por Palabras Clave
    let discipline = 'Análisis Interdisciplinario & Filosofía';
    if (fullText.includes('física') || fullText.includes('química') || fullText.includes('ciencia') || fullText.includes('espacio') || fullText.includes('universo')) {
      discipline = 'Física, Química & Método Científico';
    } else if (fullText.includes('ética') || fullText.includes('moral') || fullText.includes('guerra') || fullText.includes('justicia')) {
      discipline = 'Ética, Filosofía Moral & Justicia';
    } else if (fullText.includes('mente') || fullText.includes('psicología') || fullText.includes('cerebro') || fullText.includes('memoria') || fullText.includes('sesgo')) {
      discipline = 'Psicología Cognitiva & Neurociencia';
    } else if (fullText.includes('ia') || fullText.includes('robot') || fullText.includes('futuro') || fullText.includes('tecnología') || fullText.includes('digital')) {
      discipline = 'Inteligencia Artificial & Posthumanismo';
    } else if (fullText.includes('historia') || fullText.includes('sociedad') || fullText.includes('política') || fullText.includes('poder')) {
      discipline = 'Filosofía Política & Historia Social';
    }

    // 2. Generar Preguntas Socráticas Automáticas
    const socraticQuestions = [
      `¿Qué principios fundamentales de ${discipline.split('&')[0]} se ponen a prueba en "${newTitle}"?`,
      `¿Cómo desafía esta obra las suposiciones tradicionales del observador?`
    ];

    const newItem: MediaItem = {
      id: `CUSTOM_M_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      discipline,
      description: newDescription.trim() || `Obra ${newCategory} añadida al catálogo polímata.`,
      whatToObserve: `Observa la aplicación práctica de los conceptos de ${discipline} a lo largo del desarrollo de la trama.`,
      socraticQuestions,
      coverGradient: newCategory === 'Anime'
        ? 'from-purple-950 to-slate-900 border-purple-500/50'
        : newCategory === 'Documental'
        ? 'from-sky-950 to-slate-900 border-sky-500/50'
        : 'from-amber-950 to-slate-900 border-amber-500/50'
    };

    const updatedCatalog = [newItem, ...customCatalog];
    setCustomCatalog(updatedCatalog);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('polimata_custom_multimedia', JSON.stringify(updatedCatalog));
      }
    } catch (e) {}

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const allItems = [...customCatalog, ...MEDIA_CATALOG];
  const filteredItems = allItems.filter((item) => filter === 'TODOS' || item.category === filter);

  return (
    <main className="space-y-6 pb-16">
      {/* CABECERA Y TITULO CON BOTÓN AGREGAR */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-800/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold uppercase">
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span>Polímata Multimedia & Cine de Ideas</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Catálogo de Anime, Películas y Documentales</h1>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>➕ Añadir Obra con Auto-Etiquetado</span>
          </button>
        </div>

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

      {/* MODAL FORMULARIO AÑADIR NUEVA OBRA MULTIMEDIA CON AUTO-ETIQUETADO */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-purple-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-bold text-white">Añadir Obra Multimedia con Auto-Etiquetado</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">Título de la Obra:</label>
                <input
                  type="text"
                  placeholder="Ej. Attack on Titan, Interstellar..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Categoría:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Anime">Anime</option>
                  <option value="Documental">Documental</option>
                  <option value="Pelicula">Película</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Descripción u Observaciones:</label>
                <textarea
                  rows={3}
                  placeholder="Describe brevemente la trama o conceptos que trata (ej: ética, mente, física, historia)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/40 text-[11px] text-purple-200">
                <span className="font-bold block text-amber-300 mb-0.5">✨ Motor de Auto-Etiquetado Inteligente:</span>
                Al guardar, la app analizará las palabras clave para asignar la disciplina, generar preguntas socráticas y el gradiente visual.
              </div>

              <button
                type="button"
                onClick={handleAutoTagAndAddMedia}
                disabled={!newTitle.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95"
              >
                Auto-Etiquetar & Añadir al Catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
