import Link from 'next/link';
import { getAllWeeks, getPendingReviews } from '@/lib/db/queries';
import { initDb } from '@/lib/db';
import { Calendar, Play, CheckCircle2, Clock, Brain, AlertCircle, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default async function HoyPage() {
  await initDb();
  const weeks = await getAllWeeks();
  const currentWeek = weeks.length > 0 ? weeks[0] : null;
  const pendingReviews = await getPendingReviews();

  return (
    <main className="space-y-6 pb-12">
      {/* Saludo y Cabecera */}
      <header className="relative overflow-hidden bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-sky-800/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Plan Diario — Polímata OS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-50">¿Qué estudiamos hoy?</h1>
          <p className="text-xs text-slate-300">Plan personalizado según tus revisiones y avances.</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl text-center shadow-inner self-stretch sm:self-auto">
          <span className="text-2xl font-black text-sky-400">47</span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">min previstos</span>
        </div>
      </header>

      {/* Módulo Activo Actual */}
      {currentWeek && (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/50 p-6 rounded-2xl border border-sky-700/40 shadow-lg space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/40">
              FASE 0 — SEMANA {currentWeek.weekNumber}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {currentWeek.targetHours}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-100">{currentWeek.title}</h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{currentWeek.purpose}</p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Estado: <strong className="text-emerald-300">En progreso</strong></span>
            </div>
            <Link
              href={`/ruta/fase-0/${currentWeek.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-sky-950/50 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Continuar Semana
            </Link>
          </div>
        </section>
      )}

      {/* Secuencia Priorizada de Tareas para Hoy */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-sky-400" />
          Secuencia de Estudio Recomendada
        </h3>

        <div className="space-y-3">
          {/* Tarea 1: Recuerdo Activo / Recall */}
          <div className="flex items-center justify-between p-4 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-200">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Recuerdo Activo Cerrado (Free Recall)</h4>
                <p className="text-xs text-slate-400">Sin notas ni IA · 10 min</p>
              </div>
            </div>
            {currentWeek && (
              <Link
                href={`/ruta/fase-0/${currentWeek.id}?step=recall`}
                className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-bold rounded-xl transition border border-purple-500/30 shrink-0"
              >
                Empezar
              </Link>
            )}
          </div>

          {/* Tarea 2: Lectura Guiada */}
          <div className="flex items-center justify-between p-4 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all duration-200">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Adquisición y Lectura Disciplinar</h4>
                <p className="text-xs text-slate-400">Lectura focalizada · 25 min</p>
              </div>
            </div>
            {currentWeek && (
              <Link
                href={`/ruta/fase-0/${currentWeek.id}?step=reading`}
                className="px-3.5 py-2 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 text-xs font-bold rounded-xl transition border border-sky-500/30 shrink-0"
              >
                Empezar
              </Link>
            )}
          </div>

          {/* Tarea 3: Revisiones Diferidas */}
          <div className="flex items-center justify-between p-4 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-200">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Revisiones Diferidas (+7 / +30 días)</h4>
                <p className="text-xs text-slate-400">
                  {pendingReviews.length} revisiones pendientes · 12 min
                </p>
              </div>
            </div>
            <Link
              href="/yo"
              className="px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 text-xs font-bold rounded-xl transition border border-amber-500/30 shrink-0"
            >
              Revisar
            </Link>
          </div>
        </div>
      </section>

      {/* Regla Pedagógica Visible */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400">
        <AlertCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200 block mb-0.5">Regla Polímata OS (Inviolable):</strong>
          Primero realiza tu esfuerzo propio sin consultar notas. La auditoría e IA solo se desbloquearán tras guardar tu primer intento.
        </p>
      </div>
    </main>
  );
}
