'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  X,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  Layers,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { formatFsrsInterval, FsrsRating } from '@/lib/fsrs';

interface CardItem {
  id: string;
  reviewScheduleId?: string | null;
  targetType: string;
  targetId: string;
  term: string;
  definition: string;
  etymology?: string;
  category: string;
  example?: string;
  currentInterval: number;
}

interface DailyFsrsReviewModalProps {
  buttonLabel?: string;
  className?: string;
}

export default function DailyFsrsReviewModal({
  buttonLabel = 'Iniciar Repaso Diario FSRS',
  className = '',
}: DailyFsrsReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar tarjetas pendientes
  const loadReviewCards = async () => {
    setIsLoading(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    try {
      const res = await fetch('/api/reviews/fsrs');
      const json = await res.json();
      if (json.success && json.data.cards) {
        setCards(json.data.cards);
      }
    } catch (e) {
      console.error('Error cargando tarjetas FSRS:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    loadReviewCards();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Manejo de teclado (Espacio para voltear, 1-4 para calificar)
  useEffect(() => {
    if (!isOpen || isFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped && !isSubmitting) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFlipped, isSubmitting, isFinished, currentIndex, cards]);

  const currentCard = cards[currentIndex];

  const handleRate = async (rating: FsrsRating) => {
    if (!currentCard || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/reviews/fsrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: currentCard.targetId,
          targetType: currentCard.targetType,
          rating,
          currentInterval: currentCard.currentInterval || 0,
        }),
      });

      setReviewedCount((prev) => prev + 1);

      if (currentIndex + 1 < cards.length) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        setIsFinished(true);
      }
    } catch (e) {
      console.error('Error enviando calificación FSRS:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Previsualización de intervalos según el intervalo actual
  const curInt = currentCard?.currentInterval || 0;
  const preview = {
    again: '1d',
    hard: formatFsrsInterval(Math.max(1, Math.round((curInt || 1) * 1.2))),
    good: formatFsrsInterval(curInt === 0 ? 1 : curInt === 1 ? 3 : Math.round(curInt * 2.4)),
    easy: formatFsrsInterval(curInt === 0 ? 3 : curInt === 1 ? 6 : Math.round(curInt * 3.6 + 2)),
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          className ||
          'px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95'
        }
      >
        <Brain className="w-4 h-4 text-sky-200" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
            {/* Cabecera del reproductor */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg">
                  <Brain className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    Repaso Activo FSRS
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded-full">
                      v4.5
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {cards.length > 0 && !isFinished
                      ? `Tarjeta ${currentIndex + 1} de ${cards.length}`
                      : 'Sesión diaria de retención'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de progreso */}
            {cards.length > 0 && !isFinished && (
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
              </div>
            )}

            {/* Contenido Principal */}
            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Sincronizando baraja FSRS con SQLite...</p>
              </div>
            ) : isFinished ? (
              // Pantalla de Felicitación / Completado
              <div className="py-10 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-slate-100">¡Repaso Diario Completado!</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Has completado exitosamente las {reviewedCount} tarjetas programadas para hoy.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 max-w-xs mx-auto space-y-1">
                  <div className="flex justify-between">
                    <span>Retención proyectada:</span>
                    <strong className="text-emerald-400">92% (FSRS)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Próximo ciclo diferido:</span>
                    <strong className="text-sky-300">Mañana a las 06:00</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
                >
                  Continuar con el Plan Diario
                </button>
              </div>
            ) : currentCard ? (
              // Tarjeta Interactiva con Volteo
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className={`min-h-[220px] p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                    isFlipped
                      ? 'bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-500/40 shadow-xl'
                      : 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-sky-500/30 shadow-md'
                  }`}
                >
                  {/* Badge de Categoría */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-sky-300 border border-slate-700">
                      {currentCard.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      {isFlipped ? 'Respuesta revelada' : 'Toca para voltear (Espacio)'}
                    </span>
                  </div>

                  {/* Frente / Dorso de la Tarjeta */}
                  <div className="py-4 text-center space-y-3">
                    <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                      {currentCard.term}
                    </h2>

                    {isFlipped && (
                      <div className="space-y-3 pt-2 text-left animate-fadeIn border-t border-slate-800/80">
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          {currentCard.definition}
                        </p>

                        {currentCard.etymology && (
                          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                            <strong className="text-sky-400 block mb-0.5">Etimología / Fuente:</strong>
                            {currentCard.etymology}
                          </div>
                        )}

                        {currentCard.example && (
                          <div className="p-2.5 bg-indigo-950/30 rounded-xl border border-indigo-900/40 text-[11px] text-indigo-200">
                            <strong className="text-indigo-400 block mb-0.5">Ejemplo / Contexto:</strong>
                            {currentCard.example}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pie de tarjeta */}
                  <div className="text-center text-[10px] text-slate-500">
                    {!isFlipped ? (
                      <span className="text-sky-400/90 font-medium">
                        Intenta recordar la definición sin mirar notas antes de voltear
                      </span>
                    ) : (
                      <span className="text-slate-400">¿Cómo fue tu recuperación activa?</span>
                    )}
                  </div>
                </div>

                {/* Botones de Calificación FSRS (1, 2, 3, 4) */}
                {isFlipped ? (
                  <div className="grid grid-cols-4 gap-2 pt-1 animate-fadeIn">
                    {/* Botón 1: De nuevo */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRate(1)}
                      className="p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 hover:border-rose-600 rounded-xl text-center transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-[10px] font-mono text-rose-300 font-bold block mb-0.5">
                        {preview.again}
                      </span>
                      <span className="text-xs font-bold text-rose-200 block">De nuevo</span>
                      <span className="text-[9px] text-rose-400/80 font-mono">[1]</span>
                    </button>

                    {/* Botón 2: Difícil */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRate(2)}
                      className="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 hover:border-amber-600 rounded-xl text-center transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-[10px] font-mono text-amber-300 font-bold block mb-0.5">
                        {preview.hard}
                      </span>
                      <span className="text-xs font-bold text-amber-200 block">Difícil</span>
                      <span className="text-[9px] text-amber-400/80 font-mono">[2]</span>
                    </button>

                    {/* Botón 3: Bueno */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRate(3)}
                      className="p-2.5 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 hover:border-sky-600 rounded-xl text-center transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-[10px] font-mono text-sky-300 font-bold block mb-0.5">
                        {preview.good}
                      </span>
                      <span className="text-xs font-bold text-sky-200 block">Bueno</span>
                      <span className="text-[9px] text-sky-400/80 font-mono">[3]</span>
                    </button>

                    {/* Botón 4: Fácil */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRate(4)}
                      className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 hover:border-emerald-600 rounded-xl text-center transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <span className="text-[10px] font-mono text-emerald-300 font-bold block mb-0.5">
                        {preview.easy}
                      </span>
                      <span className="text-xs font-bold text-emerald-200 block">Fácil</span>
                      <span className="text-[9px] text-emerald-400/80 font-mono">[4]</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-sky-950/60 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Mostrar Respuesta</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-700/60 rounded">
                      Espacio
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No hay tarjetas pendientes para hoy. ¡Todo al día!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
