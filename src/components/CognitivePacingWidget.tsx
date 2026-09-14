'use client';

import { useState, useEffect } from 'react';
import {
  Gauge,
  Clock,
  BookOpen,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Coffee,
  Brain,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface PacingConfig {
  dailyMinutes: number;
  density: 'AGIL' | 'ACADEMICO' | 'DENSO';
  totalPages: number;
  readPages: number;
  currentWorkTitle: string;
}

const DENSITY_RATES = {
  AGIL: { minPerPage: 1.5, label: 'Divulgación / Ensayo Ágil', desc: '~1.5 min/página' },
  ACADEMICO: { minPerPage: 2.5, label: 'Manual Académico', desc: '~2.5 min/página' },
  DENSO: { minPerPage: 4.0, label: 'Tratado Filosófico Denso', desc: '~4.0 min/página' },
};

export default function CognitivePacingWidget() {
  const [config, setConfig] = useState<PacingConfig>({
    dailyMinutes: 45,
    density: 'ACADEMICO',
    totalPages: 90,
    readPages: 18,
    currentWorkTitle: 'Semana 1 · How People Learn II',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  // Cargar configuración guardada en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('polimata_cognitive_pacing');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('No se pudo cargar la configuración de ritmo previa:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar reactivamente en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('polimata_cognitive_pacing', JSON.stringify(config));
    } catch (e) {}
  }, [config, isLoaded]);

  const minPerPage = DENSITY_RATES[config.density].minPerPage;
  const pagesTargetToday = Math.max(1, Math.floor(config.dailyMinutes / minPerPage));
  const remainingPages = Math.max(0, config.totalPages - config.readPages);
  const daysToFinish = pagesTargetToday > 0 ? Math.ceil(remainingPages / pagesTargetToday) : 0;
  const progressPercent =
    config.totalPages > 0 ? Math.min(100, Math.round((config.readPages / config.totalPages) * 100)) : 0;

  // Evaluación de fatiga neurocognitiva
  const getFatigueLevel = () => {
    if (config.dailyMinutes <= 45) {
      return {
        level: 'OPTIMO',
        label: 'Zona Óptima de Asimilación',
        colorText: 'text-emerald-400',
        colorBg: 'bg-emerald-500/10 border-emerald-500/30',
        recommendation: 'Memoria operativa en máxima plasticidad. 1 bloque con consolidación pasiva.',
        pomodoro: '1 bloque de 40 min + 5 min de descanso total.',
      };
    } else if (config.dailyMinutes <= 75) {
      return {
        level: 'EXIGENTE',
        label: 'Alta Carga Cognitiva',
        colorText: 'text-amber-300',
        colorBg: 'bg-amber-500/10 border-amber-500/30',
        recommendation: 'Requiere desconexión sensorial intermedia para evitar interferencia proactiva.',
        pomodoro: '2 bloques de 25 min con 5-10 min de descanso activo.',
      };
    } else {
      return {
        level: 'RIESGO_BURNOUT',
        label: 'Riesgo de Sobrecarga Mental',
        colorText: 'text-rose-400',
        colorBg: 'bg-rose-500/10 border-rose-500/30',
        recommendation: 'La curva de retención decae tras 80 min continuos. Divide la sesión en mañana y tarde.',
        pomodoro: '3 bloques de 25 min espaciados con hidratación y caminata.',
      };
    }
  };

  const fatigue = getFatigueLevel();

  const handleLogProgress = (delta: number) => {
    setConfig((prev) => ({
      ...prev,
      readPages: Math.min(prev.totalPages, Math.max(0, prev.readPages + delta)),
    }));
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  return (
    <section className="p-5 sm:p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-5 shadow-lg relative overflow-hidden">
      {/* Cabecera del Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
            <Gauge className="w-4 h-4" />
            <span>Ritmo & Carga Cognitiva (Anti-Burnout)</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            Dosificación Diaria Sostenible
          </h3>
        </div>

        {/* Indicador de estado neurocognitivo */}
        <div
          className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 self-start sm:self-auto ${fatigue.colorBg} ${fatigue.colorText}`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{fatigue.label}</span>
        </div>
      </div>

      {/* Selectores Interactivos: Minutos y Densidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector de Minutos Disponibles Hoy */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Tiempo Disponible Hoy:
            </span>
            <strong className="text-sky-400 font-mono text-xs">{config.dailyMinutes} min</strong>
          </label>

          <div className="grid grid-cols-5 gap-1.5">
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, dailyMinutes: mins }))}
                className={`py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  config.dailyMinutes === mins
                    ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Densidad del Texto */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Densidad del Material:
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {DENSITY_RATES[config.density].desc}
            </span>
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            {(['AGIL', 'ACADEMICO', 'DENSO'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, density: d }))}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition border cursor-pointer truncate ${
                  config.density === d
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={DENSITY_RATES[d].label}
              >
                {d === 'AGIL' ? 'Ágil' : d === 'ACADEMICO' ? 'Académico' : 'Filosófico'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tarjetas de Resultados Clave en Tiempo Real */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Meta Diaria de Páginas */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
            Meta de Hoy
          </span>
          <div className="text-2xl font-black text-sky-400 tracking-tight">
            {pagesTargetToday}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">págs</span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            a ritmo de {minPerPage} min/pág
          </span>
        </div>

        {/* Días Estimados para Concluir */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
            Días Restantes
          </span>
          <div className="text-2xl font-black text-indigo-300 tracking-tight">
            ~{daysToFinish}{' '}
            <span className="text-xs font-normal text-slate-400 font-sans">días</span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {remainingPages} págs pendientes
          </span>
        </div>

        {/* Estructura de Pausas Recomendada */}
        <div className="col-span-2 sm:col-span-1 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono flex items-center justify-center gap-1">
            <Coffee className="w-3 h-3 text-amber-400" />
            Estructura
          </span>
          <div className="text-xs font-bold text-slate-200 pt-1 leading-snug">
            {fatigue.pomodoro}
          </div>
        </div>
      </div>

      {/* Progreso de la Lectura en Curso y Botones Rápidos de Registro */}
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-semibold truncate pr-2">
            {config.currentWorkTitle}
          </span>
          <span className="text-slate-400 font-mono text-[11px] shrink-0">
            {config.readPages} / {config.totalPages} págs ({progressPercent}%)
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] text-slate-400">
            {justLogged ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-3 h-3" /> ¡Páginas registradas!
              </span>
            ) : (
              'Registrar avance:'
            )}
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => handleLogProgress(5)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 5 págs
            </button>
            <button
              type="button"
              onClick={() => handleLogProgress(pagesTargetToday)}
              className="px-2.5 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 text-xs font-bold rounded-lg border border-sky-500/40 transition cursor-pointer active:scale-95"
            >
              Cumplir Meta (+{pagesTargetToday}p)
            </button>
          </div>
        </div>
      </div>

      {/* Regla Anti-Burnout Informativa */}
      <div className="flex items-start space-x-2 text-[11px] text-slate-400 pt-1">
        <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Principio Anti-Burnout:</strong> Es preferible una
          dosis diaria constante de 30-45 minutos que maratones esporádicas de 4 horas con amnesia y
          fatiga en memoria operativa.
        </p>
      </div>
    </section>
  );
}
