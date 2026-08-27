'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Brain, Clock, CheckCircle2, Send, Play, Pause, RotateCcw, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function NuevoClient() {
  const [selectedAction, setSelectedAction] = useState<'timer' | 'flashcard' | 'idea' | 'book'>('timer');

  // --- ESTADOS DEL TEMPORIZADOR POMODORO FOCUS ---
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedDurationPreset, setSelectedDurationPreset] = useState(25);
  const [timerTopic, setTimerTopic] = useState('');
  const timerIntervalRef = useRef<any>(null);

  // --- ESTADOS DE FLASHCARD ---
  const [cardTerm, setCardTerm] = useState('');
  const [cardDef, setCardDef] = useState('');
  const [cardCategory, setCardCategory] = useState('Epistemología & Método');

  // --- ESTADOS DE IDEA / NOTA ---
  const [ideaContent, setIdeaContent] = useState('');
  const [ideaTag, setIdeaTag] = useState('Modelo Mental');

  // --- ESTADOS DE NUEVO LIBRO ---
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookDiscipline, setBookDiscipline] = useState('Filosofía & Ciencia');

  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Lógica del Temporizador
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            handleAutoSaveSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleSetPreset = (minutes: number) => {
    setIsTimerRunning(false);
    setSelectedDurationPreset(minutes);
    setTimerSeconds(minutes * 60);
  };

  const handleAutoSaveSession = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'STUDY_SESSION',
          targetId: 'POMODORO_FOCUS',
          durationMinutes: selectedDurationPreset,
          notes: `Sesión de foco completada: ${timerTopic || 'Estudio general polímata'}.`,
        }),
      });
      setSavedMessage(`¡Sesión de ${selectedDurationPreset} min guardada con éxito en tu historial!`);
      setTimeout(() => setSavedMessage(null), 4000);
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar Flashcard FSRS
  const handleSaveFlashcard = async () => {
    if (!cardTerm.trim() || !cardDef.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: cardTerm.trim(),
          definition: cardDef.trim(),
          category: cardCategory
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedMessage(`¡Flashcard "${cardTerm}" guardada en tu mazo de repetición FSRS!`);
        setCardTerm('');
        setCardDef('');
        setTimeout(() => setSavedMessage(null), 4000);
      }
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar Idea Rápida
  const handleSaveIdea = async () => {
    if (!ideaContent.trim()) return;
    setIsSaving(true);
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'QUICK_IDEA',
          targetId: ideaTag,
          durationMinutes: 5,
          notes: ideaContent.trim(),
        }),
      });
      setSavedMessage(`¡Idea registrada con éxito en tu bitácora de pensamiento!`);
      setIdeaContent('');
      setTimeout(() => setSavedMessage(null), 4000);
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar Libro en Biblioteca
  const handleSaveBook = async () => {
    if (!bookTitle.trim() || !bookAuthor.trim()) return;
    setIsSaving(true);
    try {
      await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addNode',
          node: {
            label: `${bookTitle} (${bookAuthor})`,
            nodeType: 'Work',
            description: `Obra añadida a biblioteca personal: ${bookDiscipline}.`
          }
        })
      });
      setSavedMessage(`¡Obra "${bookTitle}" añadida a tu grafo de conocimiento y biblioteca!`);
      setBookTitle('');
      setBookAuthor('');
      setTimeout(() => setSavedMessage(null), 4000);
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main className="space-y-6 pb-20">
      {/* CABECERA Y RETORNO */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs text-sky-400 hover:underline gap-1 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Volver a Hoy
        </Link>
        <span className="text-xs font-bold text-slate-400 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800 font-mono">
          Acción Rápida Polímata
        </span>
      </div>

      <header className="relative overflow-hidden bg-gradient-to-r from-sky-950/70 via-slate-900 to-purple-950/70 p-6 rounded-2xl border border-sky-800/40 shadow-xl space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold uppercase tracking-wider font-mono">
          <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Centro de Creación Rápida</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Acciones y Registro en Vivo</h1>
        <p className="text-xs text-slate-300">Temporizador de foco, creación de tarjetas FSRS, notas o nuevas obras.</p>
      </header>

      {/* SELECTOR DE 4 ACCIONES RÁPIDAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedAction('timer')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            selectedAction === 'timer'
              ? 'bg-sky-950/80 border-sky-500 text-sky-200 ring-2 ring-sky-500/30 shadow-lg scale-[1.02]'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-100">Foco Pomodoro</h3>
            <p className="text-[10px] text-slate-400">Temporizador 25/50m</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('flashcard')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            selectedAction === 'flashcard'
              ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-2 ring-amber-500/30 shadow-lg scale-[1.02]'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-100">Crear Flashcard</h3>
            <p className="text-[10px] text-slate-400">Mazo FSRS activo</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('idea')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            selectedAction === 'idea'
              ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-2 ring-purple-500/30 shadow-lg scale-[1.02]'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Brain className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-100">Capturar Idea</h3>
            <p className="text-[10px] text-slate-400">Concepto o nota</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('book')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            selectedAction === 'book'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30 shadow-lg scale-[1.02]'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-100">Añadir Obra</h3>
            <p className="text-[10px] text-slate-400">Al grafo y biblioteca</p>
          </div>
        </button>
      </div>

      {/* TOAST DE ÉXITO */}
      {savedMessage && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs rounded-2xl flex items-center gap-2 font-bold shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* SECCIÓN 1: TEMPORIZADOR POMODORO EN VIVO */}
      {selectedAction === 'timer' && (
        <section className="bg-slate-900 p-6 rounded-3xl border border-sky-800/40 space-y-6 shadow-2xl text-center">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Temporizador Focus / Pomodoro Inmersivo</h2>
            <p className="text-xs text-slate-400">Estudio continuo sin distracciones. Al terminar se guarda automáticamente.</p>
          </div>

          {/* DISPLAY DEL RELOJ */}
          <div className="py-6 bg-slate-950 rounded-3xl border border-sky-500/30 max-w-xs mx-auto shadow-inner">
            <span className="text-5xl sm:text-6xl font-black font-mono text-sky-400 tracking-wider">
              {formatTimer(timerSeconds)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-1 uppercase">
              {isTimerRunning ? '🔥 Foco Profundo en Marcha' : '⏸ En Pausa'}
            </span>
          </div>

          {/* SELECTOR DE PRESETS (15m, 25m, 50m, 90m) */}
          <div className="flex justify-center items-center gap-2 font-mono text-xs">
            {[15, 25, 50, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSetPreset(mins)}
                className={`px-3 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
                  selectedDurationPreset === mins
                    ? 'bg-sky-600 text-white border-sky-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tema de la sesión (ej. Lectura Cap. 3 Barbara Oakley...)"
              value={timerTopic}
              onChange={(e) => setTimerTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 text-center font-mono"
            />
          </div>

          {/* CONTROLES DE INICIO / PAUSA / REINICIO */}
          <div className="flex justify-center items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xl transition cursor-pointer active:scale-95 ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isTimerRunning ? 'Pausar Temporizador' : 'Comenzar Sesión Focus'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetPreset(selectedDurationPreset)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 cursor-pointer"
              title="Reiniciar Temporizador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* SECCIÓN 2: CREAR FLASHCARD FSRS */}
      {selectedAction === 'flashcard' && (
        <section className="bg-slate-900 p-6 rounded-3xl border border-amber-800/40 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Crear Nueva Flashcard para Repaso FSRS</h2>
            <p className="text-xs text-slate-400">Guarda conceptos clave para repasarlos en sus momentos óptimos de retención.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-amber-300 font-bold mb-1">Concepto o Pregunta:</label>
              <input
                type="text"
                placeholder="Ej. ¿Qué es el Testing Effect?"
                value={cardTerm}
                onChange={(e) => setCardTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-amber-300 font-bold mb-1">Definición o Respuesta:</label>
              <textarea
                rows={3}
                placeholder="Escribe la explicación en tus propias palabras para mayor retención..."
                value={cardDef}
                onChange={(e) => setCardDef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Categoría o Disciplina:</label>
              <select
                value={cardCategory}
                onChange={(e) => setCardCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Epistemología & Método">Epistemología & Método Científico</option>
                <option value="Psicología Cognitiva">Psicología Cognitiva & Memoria</option>
                <option value="Filosofía Moral">Filosofía Moral & Ética</option>
                <option value="Sistemas Complejos">Sistemas Complejos & Redes</option>
                <option value="Modelos Mentales">Modelos Mentales Generales</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSaveFlashcard}
              disabled={isSaving || !cardTerm.trim() || !cardDef.trim()}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Guardar en Mazo FSRS</span>
            </button>
          </div>
        </section>
      )}

      {/* SECCIÓN 3: CAPTURAR IDEA O NOTA */}
      {selectedAction === 'idea' && (
        <section className="bg-slate-900 p-6 rounded-3xl border border-purple-800/40 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Capturar Idea o Conexión Interdisciplinaria</h2>
            <p className="text-xs text-slate-400">Registra insights repentinos, contraejemplos o analogías entre disciplinas.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-purple-300 font-bold mb-1">Etiqueta de la Idea:</label>
              <input
                type="text"
                placeholder="Ej. Analogía entre Termodinámica y Economía..."
                value={ideaTag}
                onChange={(e) => setIdeaTag(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-300 font-bold mb-1">Contenido del Pensamiento:</label>
              <textarea
                rows={5}
                placeholder="Desarrolla tu argumento o insight aquí..."
                value={ideaContent}
                onChange={(e) => setIdeaContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveIdea}
              disabled={isSaving || !ideaContent.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Guardar en Bitácora Polímata</span>
            </button>
          </div>
        </section>
      )}

      {/* SECCIÓN 4: AÑADIR OBRA A BIBLIOTECA */}
      {selectedAction === 'book' && (
        <section className="bg-slate-900 p-6 rounded-3xl border border-emerald-800/40 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Añadir Nueva Obra a Biblioteca & Grafo</h2>
            <p className="text-xs text-slate-400">Incorpora un libro, paper o ensayo a tu grafo de conocimiento persistente.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-emerald-300 font-bold mb-1">Título de la Obra:</label>
              <input
                type="text"
                placeholder="Ej. Thinking, Fast and Slow..."
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-bold mb-1">Autor / Investigador:</label>
              <input
                type="text"
                placeholder="Ej. Daniel Kahneman..."
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Campo de Estudio:</label>
              <input
                type="text"
                placeholder="Ej. Economía Conductual & Psicología Cognitiva..."
                value={bookDiscipline}
                onChange={(e) => setBookDiscipline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveBook}
              disabled={isSaving || !bookTitle.trim() || !bookAuthor.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Añadir al Grafo & Biblioteca</span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
