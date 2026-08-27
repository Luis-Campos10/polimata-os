'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen, Volume2, Sparkles, ChevronRight, Calendar, FileText, Upload } from 'lucide-react';
import MobilePdfCanvasViewer from '@/components/MobilePdfCanvasViewer';

interface NightNovel {
  title: string;
  author: string;
  genre: 'Novela Ligera' | 'Novela Filosófica' | 'Cuento de Ideas' | 'Ciencia Ficción Especulativa';
  connectionToWeek: string;
  bedtimeReflection: string;
  synopsis: string;
}

interface WeekNightPlan {
  id: string;
  weekNumber: number;
  weekTheme: string;
  coreConcept: string;
  novels: NightNovel[];
}

const PHASE0_NIGHT_NOVELS: WeekNightPlan[] = [
  {
    id: 'W01',
    weekNumber: 1,
    weekTheme: 'Aprender a Aprender & Metacognición',
    coreConcept: 'Bases de la memoria, abstracción conceptual vs sobrecarga informativa.',
    novels: [
      {
        title: 'Funes el memorioso',
        author: 'Jorge Luis Borges',
        genre: 'Cuento de Ideas',
        connectionToWeek: 'Ilustra por qué la memoria fotográfica perfecta impide pensar: pensar es olvidar diferencias, es generalizar y abstraer.',
        bedtimeReflection: '¿Qué detalles innecesarios del día puedes soltar para quedarte solo con los principios esenciales?',
        synopsis: 'Ireneo Funes sufre un accidente que le otorga una memoria infalible: recuerda cada hoja de cada árbol que vio en 1886, pero es incapaz de pensamiento platónico o abstracto.'
      },
      {
        title: 'Kino no Tabi: El País de los Libros (Los Viajes de Kino)',
        author: 'Keiichi Sigsawa',
        genre: 'Novela Ligera',
        connectionToWeek: 'Contrasta la ilusión de acumular libros con la verdadera comprensión metacognitiva y la experiencia viva.',
        bedtimeReflection: '¿Leíste hoy para acumular páginas o para transformar tu modelo mental?',
        synopsis: 'La viajera Kino llega a una nación donde los ciudadanos se encierran a escribir y compilar millones de libros interminables que nadie lee ni pone en práctica.'
      },
      {
        title: 'La Biblioteca de Babel',
        author: 'Jorge Luis Borges',
        genre: 'Cuento de Ideas',
        connectionToWeek: 'Metáfora sobre la sobrecarga de información: una biblioteca infinita donde la verdad está sepultada en ruido aleatorio.',
        bedtimeReflection: 'Ante un mar infinito de estímulos digitales, ¿cómo seleccionas las señales de alto valor?',
        synopsis: 'Un universo compuesto por galerías hexagonales que contiene todos los libros posibles en todas las combinaciones de letras, donde los bibliotecarios enloquecen buscando el catálogo verdadero.'
      }
    ]
  },
  {
    id: 'W02',
    weekNumber: 2,
    weekTheme: 'Dificultades Deseables & FSRS',
    coreConcept: 'Testing effect, generación activa sin notas y práctica deliberada.',
    novels: [
      {
        title: 'Flores para Algernon',
        author: 'Daniel Keyes',
        genre: 'Ciencia Ficción Especulativa',
        connectionToWeek: 'Explora la plasticidad cerebral, la curva de retención y la fragilidad del conocimiento si no se consolida.',
        bedtimeReflection: 'El conocimiento no es un estado permanente, sino una llama que requiere reactivación constante.',
        synopsis: 'Charlie Gordon, un hombre con discapacidad intelectual, se somete a una cirugía experimental que triplica su coeficiente intelectual, registrando su metamorfosis en diarios.'
      },
      {
        title: 'El Juego de Ender',
        author: 'Orson Scott Card',
        genre: 'Novela Filosófica',
        connectionToWeek: 'Práctica deliberada bajo condiciones de máxima dificultad deseable y teoría de juegos.',
        bedtimeReflection: '¿Cómo las dificultades deliberadas de hoy construyen tu maestría del mañana?',
        synopsis: 'Ender Wiggin es entrenado en la Escuela de Batalla en gravedad cero mediante juegos tácticos que cambian constantemente las reglas para forzar adaptación cognitiva extrema.'
      }
    ]
  },
  {
    id: 'W03',
    weekNumber: 3,
    weekTheme: 'Epistemología & Falsacionismo',
    coreConcept: 'Demarcación científica, falsabilidad popperiana y navaja de Ockham.',
    novels: [
      {
        title: 'El Nombre de la Rosa',
        author: 'Umberto Eco',
        genre: 'Novela Filosófica',
        connectionToWeek: 'Uso de la deducción semiótica y la duda racional frente al dogmatismo religioso.',
        bedtimeReflection: '¿Qué creencia tuya considerabas infalible pero necesita ser contrastada con la evidencia?',
        synopsis: 'El fraile franciscano Guillermo de Baskerville investiga una serie de misteriosas muertes en una abadía medieval utilizando la lógica aristotélica y el método empírico.'
      },
      {
        title: 'Solaris',
        author: 'Stanislaw Lem',
        genre: 'Ciencia Ficción Especulativa',
        connectionToWeek: 'Los límites epistemológicos de la ciencia humana cuando enfrenta un fenómeno que escapa a sus categorías antropomórficas.',
        bedtimeReflection: 'Reconocer los límites de nuestra propia mente es el primer paso hacia la verdadera sabiduría.',
        synopsis: 'Científicos orbitan un planeta cubierto por un océano coloidal vivo que materializa los recuerdos y culpas más ocultas de sus tripulantes.'
      }
    ]
  },
  {
    id: 'W04',
    weekNumber: 4,
    weekTheme: 'Modelos Mentales & Primeros Principios',
    coreConcept: 'Razonamiento desde axiomas fundamentales y descomposición analítica.',
    novels: [
      {
        title: 'Planilandia: Un romance en muchas dimensiones',
        author: 'Edwin A. Abbott',
        genre: 'Novela Filosófica',
        connectionToWeek: 'Explica cómo los modelos mentales limitados por nuestra dimensión sensorial nos ciegan ante verdades superiores.',
        bedtimeReflection: '¿Qué dimensión o perspectiva estás omitiendo al juzgar los problemas de tu entorno?',
        synopsis: 'Un Cuadrado habitante de un mundo bidimensional es visitado por una Esfera tridimensional que intenta explicarle la existencia de una tercera dimensión invisible para sus ojos.'
      },
      {
        title: 'El Aleph',
        author: 'Jorge Luis Borges',
        genre: 'Cuento de Ideas',
        connectionToWeek: 'El problema de cómo el lenguaje lineal y sucesivo intenta describir una realidad multidimensional simultánea.',
        bedtimeReflection: 'Toda explicación es un modelo simplificado de una realidad infinita.',
        synopsis: 'En el sótano de una vieja casa en Buenos Aires existe un punto en el espacio que contiene todos los puntos y momentos del universo sin superposición.'
      }
    ]
  },
  {
    id: 'W05',
    weekNumber: 5,
    weekTheme: 'Sesgos Cognitivos & Pensamiento Crítico',
    coreConcept: 'Sesgo de confirmación, falacias lógicas y desmantelamiento de prejuicios.',
    novels: [
      {
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        genre: 'Novela Filosófica',
        connectionToWeek: 'Muestra cómo la distracción sensorial ubicua y la censura del pensamiento incómodo generan una sociedad infantilizada.',
        bedtimeReflection: '¿Cultivaste hoy tu capacidad de silencio y lectura atenta o te dejaste llevar por el ruido digital?',
        synopsis: 'Guy Montag es un bombero cuya misión es quemar libros en una sociedad donde la lectura está prohibida porque genera discrepancias y tristeza existencial.'
      },
      {
        title: 'El Extranjero',
        author: 'Albert Camus',
        genre: 'Novela Filosófica',
        connectionToWeek: 'El juicio social a quien no finge emociones normativas y el enfrentamiento con el absurdo.',
        bedtimeReflection: 'La autenticidad racional frente a la presión del consenso social.',
        synopsis: 'Meursault comete un crimen en una playa argelina y es juzgado en los tribunales no solo por el acto, sino por no haber llorado en el entierro de su madre.'
      }
    ]
  },
  {
    id: 'W06',
    weekNumber: 6,
    weekTheme: 'Sistemas Complejos & Dinámica de Redes',
    coreConcept: 'No-linealidad, bucles de retroalimentación y propiedades emergentes.',
    novels: [
      {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Ciencia Ficción Especulativa',
        connectionToWeek: 'Obra maestra sobre la ecología como sistema de redes interdependientes, la política feudal y el peligro de los líderes carismáticos.',
        bedtimeReflection: 'En un sistema complejo, una pequeña perturbación en un nodo puede desatar tormentas en toda la red.',
        synopsis: 'Paul Atreides llega al planeta desértico Arrakis, único productor de la especia melange, donde la ecología de los gusanos de arena y el agua gobiernan el destino del imperio.'
      },
      {
        title: 'Exhalación',
        author: 'Ted Chiang',
        genre: 'Cuento de Ideas',
        connectionToWeek: 'Exploración de la segunda ley de la termodinámica (entropía) a través de una civilización de autómatas de aire comprimido.',
        bedtimeReflection: 'Cada pensamiento y acción disipa energía en el cosmos; haz que cada ciclo cuente.',
        synopsis: 'Un anatomista mecánico disecciona su propio cerebro neumático y descubre que el aire de su mundo se está igualando en presión, sellando el fin de todo movimiento y conciencia.'
      }
    ]
  },
  {
    id: 'W07',
    weekNumber: 7,
    weekTheme: 'Teoría de Juegos & Cooperación',
    coreConcept: 'Dilema del prisionero, equilibrio de Nash y estrategias recíprocas (Tit for Tat).',
    novels: [
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Novela Filosófica',
        connectionToWeek: 'El control del lenguaje (Neolengua), el doblepensar y el quiebre de la confianza mutua entre individuos.',
        bedtimeReflection: 'La libertad es la libertad de decir que dos más dos son cuatro.',
        synopsis: 'Winston Smith trabaja en el Ministerio de la Verdad reescribiendo la historia mientras intenta rebelarse contra la vigilancia omnipresente del Gran Hermano.'
      },
      {
        title: 'La historia de tu vida',
        author: 'Ted Chiang',
        genre: 'Ciencia Ficción Especulativa',
        connectionToWeek: 'Lingüística, teleología vs causalidad y teoría de la elección frente al conocimiento del futuro.',
        bedtimeReflection: 'Aceptar el desenlace completo de una vida sin dejar de abrazar el presente.',
        synopsis: 'La lingüista Louise Banks aprende el idioma no lineal de una especie extraterrestre, lo que reconfigura su cerebro para percibir el tiempo de forma simultánea.'
      }
    ]
  },
  {
    id: 'W08',
    weekNumber: 8,
    weekTheme: 'Ética Estoica & Autodominio',
    coreConcept: 'Dicotomía del control, serenidad en la adversidad y juicio de valor.',
    novels: [
      {
        title: 'La Muerte de Iván Ilich',
        author: 'León Tolstói',
        genre: 'Novela Filosófica',
        connectionToWeek: 'Reflexión sobre el examen de conciencia: vivir conforme a las apariencias vs vivir una vida con sentido real.',
        bedtimeReflection: '¿Has vivido hoy de acuerdo con tus principios genuinos o conforme a las expectativas ajenas?',
        synopsis: 'Un respetado magistrado ruso enfrenta una enfermedad terminal y descubre la hipocresía de su matrimonio y la superficialidad de toda su carrera.'
      },
      {
        title: 'Un Mundo Feliz',
        author: 'Aldous Huxley',
        genre: 'Novela Filosófica',
        connectionToWeek: 'La pérdida de la virtud y la grandeza humana a cambio de placer hedonista superficial sin esfuerzo.',
        bedtimeReflection: 'El bienestar real nace de superar dificultades deseadas, no de la anestesia del confort constante.',
        synopsis: 'En una sociedad futurista donde el soma elimina toda tristeza y los bebés nacen en probetas categorizados por castas, el Salvaje John reivindica el derecho a sufrir y a pensar.'
      }
    ]
  }
];

export default function LecturasNocturnasPage() {
  const [warmMode, setWarmMode] = useState(true);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [selectedNovelIndex, setSelectedNovelIndex] = useState<number>(0);
  const [readingPdfUrl, setReadingPdfUrl] = useState<string | null>(null);

  // Custom novelas agregadas por el usuario
  const [customNovels, setCustomNovels] = useState<Record<number, NightNovel[]>>({});
  const [showAddNovelModal, setShowAddNovelModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState<any>('Novela Ligera');
  const [newWeek, setNewWeek] = useState<number>(1);
  const [newSynopsis, setNewSynopsis] = useState('');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('polimata_custom_night_novels');
        if (saved) {
          setCustomNovels(JSON.parse(saved));
        }
      }
    } catch (e) {}
  }, []);

  const handleAutoTagAndAddNovel = () => {
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const fullText = `${newTitle} ${newAuthor} ${newSynopsis}`.toLowerCase();

    let connectionToWeek = 'Obra literaria seleccionada para reflexión filosófica y metacognitiva nocturna.';
    let bedtimeReflection = `Al cerrar las páginas de "${newTitle}", reflexiona sobre qué decisión de vida puedes calibrar con mayor lucidez mañana.`;

    if (fullText.includes('memoria') || fullText.includes('mente') || fullText.includes('tiempo')) {
      connectionToWeek = 'Explora la plasticidad de la memoria, la percepción del tiempo y los límites de la mente humana.';
      bedtimeReflection = '¿Qué pensamiento de esta noche puedes transformar en un modelo mental duradero?';
    } else if (fullText.includes('ética') || fullText.includes('justicia') || fullText.includes('sociedad')) {
      connectionToWeek = 'Analiza los dilemas morales, el contrato social y la búsqueda de justicia individual.';
      bedtimeReflection = '¿Actuaste hoy con rectitud y serenidad frente a las presiones del entorno?';
    }

    const newNovelItem: NightNovel = {
      title: newTitle.trim(),
      author: newAuthor.trim(),
      genre: newGenre,
      connectionToWeek,
      bedtimeReflection,
      synopsis: newSynopsis.trim() || `Novela añadida al repertorio nocturno de la Semana ${newWeek}.`
    };

    const updatedWeekNovels = [...(customNovels[newWeek] || []), newNovelItem];
    const updatedAll = { ...customNovels, [newWeek]: updatedWeekNovels };
    setCustomNovels(updatedAll);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('polimata_custom_night_novels', JSON.stringify(updatedAll));
      }
    } catch (e) {}

    setNewTitle('');
    setNewAuthor('');
    setNewSynopsis('');
    setShowAddNovelModal(false);
  };

  const baseWeek = PHASE0_NIGHT_NOVELS.find((w) => w.weekNumber === selectedWeekNumber) || PHASE0_NIGHT_NOVELS[0];
  const userWeekNovels = customNovels[selectedWeekNumber] || [];
  const currentWeek = {
    ...baseWeek,
    novels: [...userWeekNovels, ...baseWeek.novels]
  };
  const currentNovel = currentWeek.novels[selectedNovelIndex] || currentWeek.novels[0];

  const speakText = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // Voz pausada relajante
    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:application/pdf;base64,${buffer.toString('base64')}`;
    setReadingPdfUrl(base64Data);
  };

  return (
    <main className={`min-h-screen p-4 sm:p-6 rounded-3xl transition-colors duration-500 space-y-6 pb-24 ${
      warmMode ? 'bg-[#0b0907] text-[#e6d5bc]' : 'bg-slate-950 text-slate-200'
    }`}>
      {/* CABECERA MODO NOCHE Y BOTÓN AGREGAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-900/30 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-amber-400 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-bold font-serif tracking-wide">
              Lecturas Nocturnas: Novelas Ligeras & Ficción Filosófica
            </h1>
          </div>
          <p className="text-xs text-amber-300/80 font-serif italic">
            Literatura especulativa, novelas ligeras y cuentos de ideas sincronizados con el tema de tu semana.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddNovelModal(true)}
            className="px-3.5 py-1.5 rounded-full border border-amber-500/40 text-xs font-bold font-mono transition flex items-center gap-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-100 cursor-pointer shadow-lg active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>➕ Añadir Novela Nocturna</span>
          </button>

          <button
            type="button"
            onClick={() => setWarmMode(!warmMode)}
            className="px-3 py-1.5 rounded-full border border-amber-500/30 text-xs font-bold font-mono transition flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/50 cursor-pointer"
          >
            {warmMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-purple-300" />}
            <span>{warmMode ? 'Filtro Ámbar Activo' : 'Modo Oscuro'}</span>
          </button>
        </div>
      </div>

      {/* SELECTOR DE SEMANA */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-amber-900/30">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold font-mono">Semana de tu Ruta:</span>
          <select
            value={selectedWeekNumber}
            onChange={(e) => {
              setSelectedWeekNumber(parseInt(e.target.value, 10));
              setSelectedNovelIndex(0);
            }}
            className="bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-1 text-xs text-amber-200 font-mono font-bold focus:outline-none cursor-pointer"
          >
            {PHASE0_NIGHT_NOVELS.map((w) => (
              <option key={w.id} value={w.weekNumber}>
                Semana {String(w.weekNumber).padStart(2, '0')} — {w.weekTheme}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] font-mono text-amber-300/90 italic">
          💡 {currentWeek.coreConcept}
        </span>
      </div>

      {/* LISTA DE NOVELAS LIGERAS & CUENTOS DE LA SEMANA */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-amber-400 block">
          Novelas y Ficción Filosófica de la Semana {currentWeek.weekNumber}:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentWeek.novels.map((novel, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedNovelIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                selectedNovelIndex === idx
                  ? 'bg-amber-950/70 border-amber-500/70 text-amber-100 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/50 border-amber-900/20 text-slate-300 hover:border-amber-700/40'
              }`}
            >
              <div>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30">
                  {novel.genre}
                </span>
                <h3 className="text-sm font-bold font-serif pt-2">{novel.title}</h3>
                <p className="text-xs text-amber-200/80 italic font-serif">{novel.author}</p>
              </div>

              <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Ver Ficha & Lectura
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DETALLE DE LA NOVELA SELECCIONADA */}
      <div className="p-6 bg-slate-900/60 rounded-3xl border border-amber-900/40 space-y-5 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
              {currentNovel.genre}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100 pt-1">{currentNovel.title}</h2>
            <h3 className="text-sm text-amber-300/80 italic font-serif">por {currentNovel.author}</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => speakText(`${currentNovel.title} de ${currentNovel.author}. ${currentNovel.synopsis}. Reflexión: ${currentNovel.bedtimeReflection}`)}
              className="p-2 bg-amber-950/60 hover:bg-amber-900 text-amber-300 rounded-full border border-amber-500/30 cursor-pointer shadow"
              title="Escuchar sinopsis y reflexión en voz pausada"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <label className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 text-xs font-bold rounded-xl border border-amber-500/40 transition cursor-pointer flex items-center gap-1.5 shadow">
              <Upload className="w-3.5 h-3.5" />
              <span>Cargar PDF del Libro</span>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* SINOPSIS Y CONEXIÓN CON EL TEMA DE LA SEMANA */}
        <div className="space-y-3 font-serif text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-amber-900/30 pt-4">
          <p className="leading-relaxed"><strong className="text-amber-300 font-sans uppercase text-[10px] tracking-wider block mb-1">Sinopsis de la Obra:</strong>{currentNovel.synopsis}</p>
          
          <div className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-900/40 text-xs text-amber-200/90 font-mono">
            <strong className="text-amber-400 block mb-0.5">🧠 Conexión con tu Semana de Estudio:</strong>
            {currentNovel.connectionToWeek}
          </div>

          <div className="p-3.5 bg-amber-900/30 rounded-2xl border border-amber-500/40 text-xs text-amber-100 font-serif italic">
            <strong className="text-amber-300 font-sans not-italic uppercase text-[10px] tracking-wider block mb-0.5">🌙 Reflexión Socrática Antes de Dormir:</strong>
            "{currentNovel.bedtimeReflection}"
          </div>
        </div>

        {/* LECTOR PDF CANVAS CON FILTRO CÁLIDO INTEGRADO */}
        {readingPdfUrl && (
          <div className="h-[480px] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl">
            <MobilePdfCanvasViewer pdfUrl={readingPdfUrl} fileName={currentNovel.title} />
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO AÑADIR NUEVA NOVELA NOCTURNA */}
      {showAddNovelModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-amber-100">
            <button
              type="button"
              onClick={() => setShowAddNovelModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-amber-100 font-serif">Añadir Novela Ligera o Ficción Filosófica</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-amber-300 mb-1 font-bold">Título de la Obra:</label>
                <input
                  type="text"
                  placeholder="Ej. Funes el memorioso, Solaris, Planilandia..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Autor:</label>
                <input
                  type="text"
                  placeholder="Ej. Jorge Luis Borges, Stanislaw Lem, Kafka..."
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Género:</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value as any)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Novela Ligera">Novela Ligera</option>
                  <option value="Novela Filosófica">Novela Filosófica</option>
                  <option value="Cuento de Ideas">Cuento de Ideas</option>
                  <option value="Ciencia Ficción Especulativa">Ciencia Ficción Especulativa</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Semana a Asociar:</label>
                <select
                  value={newWeek}
                  onChange={(e) => setNewWeek(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {PHASE0_NIGHT_NOVELS.map((w) => (
                    <option key={w.id} value={w.weekNumber}>
                      Semana {String(w.weekNumber).padStart(2, '0')} — {w.weekTheme}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Sinopsis o Resumen Breve:</label>
                <textarea
                  rows={3}
                  placeholder="Describe la trama o idea central de la novela..."
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-[11px] text-amber-200">
                <span className="font-bold block text-amber-300 mb-0.5">✨ Auto-Etiquetado Socrático:</span>
                Al guardar, la app generará la conexión temática con la semana y la pregunta de reflexión para antes de dormir.
              </div>

              <button
                type="button"
                onClick={handleAutoTagAndAddNovel}
                disabled={!newTitle.trim() || !newAuthor.trim()}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95"
              >
                Auto-Etiquetar & Añadir Novela
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
