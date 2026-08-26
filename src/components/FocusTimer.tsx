'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';

interface FocusTimerProps {
  targetType?: string;
  targetId?: string;
  onComplete?: () => void;
}

export default function FocusTimer({
  targetType = 'WEEK',
  targetId = 'FASE_0',
  onComplete,
}: FocusTimerProps) {
  const [initialMinutes, setInitialMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      setSessionCompleted(true);
      logCompletedSession();
      if (onComplete) onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const selectPreset = (mins: number) => {
    setIsActive(false);
    setInitialMinutes(mins);
    setSecondsLeft(mins * 60);
    setSessionCompleted(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
    setSessionCompleted(false);
  };

  const logCompletedSession = async () => {
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          durationMinutes: initialMinutes,
          notes: `Sesión Focus de ${initialMinutes} minutos completada con éxito.`,
        }),
      });
    } catch (err) {
      console.error('Error al registrar sesión:', err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((initialMinutes * 60 - secondsLeft) / (initialMinutes * 60)) * 100)
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Temporizador Focus / Pomodoro</span>
        </div>
        <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded font-mono">
          {isActive ? 'EN EJECUCIÓN' : 'PAUSADO'}
        </span>
      </div>

      {/* Preset Selectors */}
      <div className="flex gap-2">
        {[
          { mins: 10, label: '10 min Recall' },
          { mins: 25, label: '25 min Focus' },
          { mins: 50, label: '50 min Profundo' },
        ].map((preset) => (
          <button
            key={preset.mins}
            type="button"
            onClick={() => selectPreset(preset.mins)}
            className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition border cursor-pointer ${
              initialMinutes === preset.mins
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center py-2 space-y-2">
        <div className="text-4xl sm:text-5xl font-black font-mono text-slate-50 tracking-wider">
          {formatTime(secondsLeft)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={toggleTimer}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {isActive ? 'Pausar' : 'Iniciar Sesión'}
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 cursor-pointer"
          title="Reiniciar Temporizador"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {sessionCompleted && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center space-x-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>¡Sesión finalizada con éxito! Registrada en tu historial.</span>
        </div>
      )}
    </div>
  );
}
