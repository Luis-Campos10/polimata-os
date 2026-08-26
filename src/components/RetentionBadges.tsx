'use client';

import { Award, ShieldCheck, Brain, Network, Zap, CheckCircle2, Lock } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: string;
}

export default function RetentionBadges() {
  const badges: Badge[] = [
    {
      id: 'B01',
      title: 'Guardián del Esfuerzo Propio',
      category: 'REGLA INVIOLABLE',
      description: '100% de los intentos iniciados sin consultar notas ni IA previas.',
      icon: Lock,
      unlocked: false,
      progress: '0 / Intento 1 Pendiente',
    },
    {
      id: 'B02',
      title: 'Calibrador Metacognitivo',
      category: 'PRECISIÓN',
      description: 'Error de predicción inferior al ±5% en 5 evaluaciones seguidas.',
      icon: ShieldCheck,
      unlocked: false,
      progress: '0/5 Evaluaciones',
    },
    {
      id: 'B03',
      title: 'Maestro FSRS (+90 Días)',
      category: 'RETENCIÓN',
      description: 'Demostró retención activa sostenida en revisiones diferidas a 90 días.',
      icon: Brain,
      unlocked: false,
      progress: '0 Repasos Diferidos',
    },
    {
      id: 'B04',
      title: 'Polímata Integrador',
      category: 'CONEXIONES',
      description: 'Conectó exitosamente más de 10 conceptos con las 18 Grandes Preguntas.',
      icon: Network,
      unlocked: false,
      progress: '0/10 Nodos Conectados',
    },
  ];


  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Matriz & Logros de Retención Real</span>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded font-mono">
          Sin Vanity Metrics
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Reconocimientos otorgados estrictamente por **retención comprobada**, **precisión metacognitiva** y adherencia al **esfuerzo propio**, no por consumo pasivo de lectura.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((badge) => {
          const IconComp = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                badge.unlocked
                  ? 'bg-slate-950 border-amber-500/40 text-slate-100 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  badge.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                <IconComp className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-100">{badge.title}</h4>
                  {badge.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">
                  {badge.category}
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{badge.description}</p>
                <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                  Progreso: <strong className="text-amber-300">{badge.progress}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
