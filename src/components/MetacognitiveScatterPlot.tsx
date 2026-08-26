'use client';

import { useState } from 'react';
import { Target, ShieldCheck, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';

interface CalibrationDataPoint {
  discipline: string;
  predictedScore: number;
  actualScore: number;
  bias: 'OVERCONFIDENCE' | 'UNDERCONFIDENCE' | 'ACCURATE';
}

const SAMPLE_CALIBRATION_DATA: CalibrationDataPoint[] = [
  { discipline: 'Fase 0 — Metacognición', predictedScore: 85, actualScore: 88, bias: 'ACCURATE' },
  { discipline: 'Filosofía del Conocimiento', predictedScore: 92, actualScore: 78, bias: 'OVERCONFIDENCE' },
  { discipline: 'Lógica & Epistemología', predictedScore: 70, actualScore: 82, bias: 'UNDERCONFIDENCE' },
  { discipline: 'Ciencia & Método', predictedScore: 88, actualScore: 86, bias: 'ACCURATE' },
  { discipline: 'Psicología Cognitiva', predictedScore: 95, actualScore: 84, bias: 'OVERCONFIDENCE' },
];

export default function MetacognitiveScatterPlot() {
  const [selectedPoint, setSelectedPoint] = useState<CalibrationDataPoint | null>(null);
  const dataPoints: CalibrationDataPoint[] = [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Matriz & Gráfico Metacognitivo de Calibración</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-0.5 rounded font-mono">
          Inicio Limpio (0 Datos)
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Contrapone tu puntaje predicho antes del examen frente a tu puntaje real obtenido (0 - 100 pts) para identificar sesgos de sobreconfianza o subconfianza por disciplina.
      </p>

      {/* GRÁFICO DE PUNTOS / DISPERSIÓN */}
      <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 h-56 flex flex-col justify-between overflow-hidden">
        {/* Línea Ideal de Calibración Perfecta (45 Grados) */}
        <div className="absolute inset-0 p-4 pointer-events-none flex items-center justify-center opacity-10">
          <div className="w-full h-full border-b border-l border-slate-700 relative">
            <div className="absolute inset-0 border-t border-purple-500 transform -rotate-45 origin-bottom-left border-dashed" />
          </div>
        </div>

        {/* Mensaje de Estado Inicial Cero */}
        <div className="h-full flex flex-col items-center justify-center text-center space-y-1.5 z-10">
          <Target className="w-8 h-8 text-slate-600" />
          <p className="text-xs font-bold text-slate-300">Sin Datos de Calibración Aún</p>
          <p className="text-[11px] text-slate-500 max-w-xs">
            Al completar tus primeros exámenes semanales, aquí se graficará de forma automática tu precisión metacognitiva real.
          </p>
        </div>

        {/* Leyenda del Eje */}
        <div className="flex justify-between text-[10px] font-mono text-slate-600 border-t border-slate-800/80 pt-1">
          <span>0 (Bajo Predicho)</span>
          <span>Eje X: Puntaje Predicho (0-100)</span>
          <span>100 (Alto Predicho)</span>
        </div>
      </div>


      {/* Leyenda de Sesgos */}
      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
        <div className="p-2 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300">
          ● Calibración Precisa (±5%)
        </div>
        <div className="p-2 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-300">
          ● Sobreconfianza (+Sesgo)
        </div>
        <div className="p-2 bg-sky-950/40 border border-sky-800/50 rounded-xl text-sky-300">
          ● Subconfianza (-Sesgo)
        </div>
      </div>

      {/* Detalle del Punto Seleccionado */}
      {selectedPoint && (
        <div className="p-3.5 bg-slate-950 rounded-xl border border-purple-500/30 text-xs space-y-1 animate-fadeIn">
          <div className="flex justify-between items-center font-bold text-slate-200">
            <span>{selectedPoint.discipline}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                selectedPoint.bias === 'ACCURATE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : selectedPoint.bias === 'OVERCONFIDENCE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {selectedPoint.bias}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Predicción del estudiante: <strong className="text-purple-300">{selectedPoint.predictedScore} pts</strong> | Resultado Real Obtenido: <strong className="text-emerald-300">{selectedPoint.actualScore} pts</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
