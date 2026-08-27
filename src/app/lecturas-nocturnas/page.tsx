'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen, Volume2, Sparkles, ChevronRight, Calendar, FileText, Upload } from 'lucide-react';
import MobilePdfCanvasViewer from '@/components/MobilePdfCanvasViewer';

interface Resource {
  title: string;
  author: string;
  type: string;
  priority?: string;
  whatToStudy: string;
}

interface WeekOption {
  id: string;
  weekNumber: number;
  title: string;
  purpose: string;
  resources: Resource[];
}

// Datos de las 16 Semanas de la Fase 0 para Lectura Nocturna
const PHASE0_WEEKS: WeekOption[] = [
  {
    id: 'W01',
    weekNumber: 1,
    title: 'Aprender a Aprender & Metacognición',
    purpose: 'Bases biológicas y cognitivas del aprendizaje duradero vs ilusión de dominio.',
    resources: [
      {
        title: 'How People Learn II: Learners, Contexts, and Cultures',
        author: 'National Academies of Sciences',
        type: 'Informe / Libro académico',
        priority: 'NÚCLEO',
        whatToStudy: 'Summary, Introducción, secciones sobre memoria, conocimiento previo, metacognición y transferencia.'
      },
      {
        title: 'Discurso del Método (Partes I, II y IV)',
        author: 'René Descartes',
        type: 'Obra filosófica clásica',
        priority: 'NÚCLEO',
        whatToStudy: 'Duda metódica, reglas del método y Cogito ergo sum.'
      },
      {
        title: 'Abre tu mente a los números (Mindshift & Chunking)',
        author: 'Barbara Oakley',
        type: 'Divulgación cognitiva',
        priority: 'COMPLEMENTARIO',
        whatToStudy: 'Modo enfocado vs modo difuso, formación de Chunks y superación de la procrastinación.'
      }
    ]
  },
  {
    id: 'W02',
    weekNumber: 2,
    title: 'Dificultades Deseables & FSRS',
    purpose: 'Testing effect, interleaving, generación activa y espaciamiento óptimo.',
    resources: [
      {
        title: 'Make It Stick: The Science of Successful Learning',
        author: 'Brown, Roediger & Karpicke',
        type: 'Libro científico',
        priority: 'NÚCLEO',
        whatToStudy: 'Efecto evaluación, práctica intercalada y esfuerzo propio sin notas.'
      },
      {
        title: 'Enquiridión (Manual de Vida)',
        author: 'Epicteto',
        type: 'Filosofía Estoica',
        priority: 'NÚCLEO',
        whatToStudy: 'Dicotomía del control y fortaleza mental.'
      }
    ]
  },
  {
    id: 'W03',
    weekNumber: 3,
    title: 'Epistemología & Falsacionismo',
    purpose: 'Criterio popperiano, construcción de hipótesis y demolición de sesgos.',
    resources: [
      {
        title: 'La Lógica de la Investigación Científica',
        author: 'Karl Popper',
        type: 'Filosofía de la Ciencia',
        priority: 'NÚCLEO',
        whatToStudy: 'Demarcación científica y falsabilidad empírica.'
      },
      {
        title: 'Meditaciones (Libros II, IV y VIII)',
        author: 'Marco Aurelio',
        type: 'Filosofía Estoica',
        priority: 'NÚCLEO',
        whatToStudy: 'Ciudadela interior y serenidad nocturna.'
      }
    ]
  }
];

export default function LecturasNocturnasPage() {
  const [warmMode, setWarmMode] = useState(true);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [selectedResourceIndex, setSelectedResourceIndex] = useState<number>(0);
  const [readingPdfUrl, setReadingPdfUrl] = useState<string | null>(null);

  // Estado para libros nocturnos personalizados añadidos por el usuario
  const [customNightBooks, setCustomNightBooks] = useState<Record<number, Resource[]>>({});
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookWeek, setNewBookWeek] = useState<number>(1);
  const [newBookNotes, setNewBookNotes] = useState('');

  // Cargar libros nocturnos personalizados desde localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('polimata_custom_night_books');
        if (saved) {
          setCustomNightBooks(JSON.parse(saved));
        }
      }
    } catch (e) {}
  }, []);

  // Motor de Auto-Etiquetado Inteligente para Libros Nocturnos
  const handleAutoTagAndAddBook = () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;

    const fullText = `${newBookTitle} ${newBookAuthor} ${newBookNotes}`.toLowerCase();

    // 1. Determinar Tipo y Categoría Automáticamente
    let type = 'Libro Académico';
    if (fullText.includes('descartes') || fullText.includes('popper') || fullText.includes('aristóteles') || fullText.includes('platón') || fullText.includes('filosofía') || fullText.includes('ética')) {
      type = 'Obra Filosófica Clásica';
    } else if (fullText.includes('marco aurelio') || fullText.includes('séneca') || fullText.includes('epicteto') || fullText.includes('estoico')) {
      type = 'Filosofía Estoica Nocturna';
    } else if (fullText.includes('ciencia') || fullText.includes('física') || fullText.includes('química') || fullText.includes('biología') || fullText.includes('cerebro')) {
      type = 'Divulgación Científica';
    }

    // 2. Determinar Prioridad por Auto-Etiquetado
    const priority = fullText.includes('clave') || fullText.includes('núcleo') || fullText.includes('esencial') ? 'NÚCLEO' : 'COMPLEMENTARIO';

    // 3. Generar Estrategia de Lectura Automática
    const whatToStudy = newBookNotes.trim()
      ? newBookNotes.trim()
      : `Lectura nocturna pausada de ${newBookTitle}. Enfócate en la tesis principal del autor y realiza una breve pausa de recuerdo activo al cerrar el libro.`;

    const newResource: Resource = {
      title: newBookTitle.trim(),
      author: newBookAuthor.trim(),
      type,
      priority,
      whatToStudy
    };

    const updatedWeekBooks = [...(customNightBooks[newBookWeek] || []), newResource];
    const updatedAllCustom = { ...customNightBooks, [newBookWeek]: updatedWeekBooks };
    setCustomNightBooks(updatedAllCustom);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('polimata_custom_night_books', JSON.stringify(updatedAllCustom));
      }
    } catch (e) {}

    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookNotes('');
    setShowAddBookModal(false);
  };

  const baseWeek = PHASE0_WEEKS.find((w) => w.weekNumber === selectedWeekNumber) || PHASE0_WEEKS[0];
  const weekCustomResources = customNightBooks[selectedWeekNumber] || [];
  const currentWeek = {
    ...baseWeek,
    resources: [...weekCustomResources, ...baseWeek.resources]
  };
  const currentResource = currentWeek.resources[selectedResourceIndex] || currentWeek.resources[0];

  const speakText = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // Voz pausada nocturna
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
      warmMode ? 'bg-[#0c0a07] text-[#e6d5bc]' : 'bg-slate-950 text-slate-200'
    }`}>
      {/* CABECERA MODO NOCHE Y BOTÓN AGREGAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-900/30 pb-4">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-amber-400 animate-pulse" />
          <h1 className="text-lg font-bold font-serif tracking-wide">Lecturas Nocturnas por Semana</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddBookModal(true)}
            className="px-3.5 py-1.5 rounded-full border border-amber-500/40 text-xs font-bold font-mono transition flex items-center gap-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-100 cursor-pointer shadow-lg active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>➕ Añadir Libro Nocturno</span>
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

      {/* SELECTOR DE SEMANA Y CAMBIO FLUIDO */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-amber-900/30">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold font-mono">Seleccionar Semana:</span>
          <select
            value={selectedWeekNumber}
            onChange={(e) => {
              setSelectedWeekNumber(parseInt(e.target.value, 10));
              setSelectedResourceIndex(0);
            }}
            className="bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-1 text-xs text-amber-200 font-mono font-bold focus:outline-none cursor-pointer"
          >
            {PHASE0_WEEKS.map((w) => (
              <option key={w.id} value={w.weekNumber}>
                Semana {String(w.weekNumber).padStart(2, '0')} — {w.title}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] font-mono text-amber-300/80 italic">
          {currentWeek.purpose}
        </span>
      </div>

      {/* LISTA DE LIBROS DE LA SEMANA SELECCIONADA */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-amber-400 block">
          Libros y Obras Prescritas para la Semana {currentWeek.weekNumber}:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentWeek.resources.map((res, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedResourceIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                selectedResourceIndex === idx
                  ? 'bg-amber-950/70 border-amber-500/70 text-amber-100 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/50 border-amber-900/20 text-slate-300 hover:border-amber-700/40'
              }`}
            >
              <div>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30">
                  {res.priority || 'NÚCLEO'}
                </span>
                <h3 className="text-xs font-bold pt-2">{res.author}</h3>
                <p className="text-[11px] italic text-amber-200/90 leading-tight">{res.title}</p>
              </div>

              <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Ver Plan Nocturno
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DETALLE Y LECTOR CÁLIDO DEL LIBRO SELECCIONADO */}
      <div className="p-6 bg-slate-900/60 rounded-3xl border border-amber-900/40 space-y-5 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
              {currentResource.type}
            </span>
            <h2 className="text-xl font-bold font-serif text-amber-100 pt-1">{currentResource.author}</h2>
            <h3 className="text-sm text-amber-300/80 italic font-serif">{currentResource.title}</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => speakText(`${currentResource.title} de ${currentResource.author}. Qué estudiar: ${currentResource.whatToStudy}`)}
              className="p-2 bg-amber-950/60 hover:bg-amber-900 text-amber-300 rounded-full border border-amber-500/30 cursor-pointer shadow"
              title="Escuchar guía de lectura en voz pausada"
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

        <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30 space-y-1 font-serif text-xs text-amber-200/90">
          <strong className="text-amber-300 font-sans uppercase text-[10px] tracking-wider block">Qué Estudiar Esta Noche:</strong>
          <p className="leading-relaxed">{currentResource.whatToStudy}</p>
        </div>

        {/* LECTOR PDF CANVAS CON FILTRO CÁLIDO INTEGRADO */}
        {readingPdfUrl && (
          <div className="h-[480px] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl">
            <MobilePdfCanvasViewer pdfUrl={readingPdfUrl} fileName={currentResource.title} />
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO AÑADIR NUEVO LIBRO NOCTURNO CON AUTO-ETIQUETADO */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-amber-100">
            <button
              type="button"
              onClick={() => setShowAddBookModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-amber-100 font-serif">Añadir Libro Nocturno con Auto-Etiquetado</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-amber-300 mb-1 font-bold">Título del Libro:</label>
                <input
                  type="text"
                  placeholder="Ej. Meditaciones, Discurso del Método..."
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Autor:</label>
                <input
                  type="text"
                  placeholder="Ej. René Descartes, Marco Aurelio..."
                  value={newBookAuthor}
                  onChange={(e) => setNewBookAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Semana a Asociar:</label>
                <select
                  value={newBookWeek}
                  onChange={(e) => setNewBookWeek(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {PHASE0_WEEKS.map((w) => (
                    <option key={w.id} value={w.weekNumber}>
                      Semana {String(w.weekNumber).padStart(2, '0')} — {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-amber-300 mb-1 font-bold">Notas o Qué Estudiar (Opcional):</label>
                <textarea
                  rows={2}
                  placeholder="Instrucción de lectura nocturna..."
                  value={newBookNotes}
                  onChange={(e) => setNewBookNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-900/60 rounded-xl p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-[11px] text-amber-200">
                <span className="font-bold block text-amber-300 mb-0.5">✨ Auto-Etiquetado Inteligente:</span>
                Asignará automáticamente la prioridad (NÚCLEO/COMPLEMENTARIO) y la categoría temática del libro.
              </div>

              <button
                type="button"
                onClick={handleAutoTagAndAddBook}
                disabled={!newBookTitle.trim() || !newBookAuthor.trim()}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95"
              >
                Auto-Etiquetar & Añadir Libro
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
