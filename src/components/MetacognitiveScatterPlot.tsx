'use client';

import { useState, useEffect } from 'react';
import { Target, ShieldCheck, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';

export interface CalibrationDataPoint {
  id?: string;
  discipline: string;
  predictedScore: number;
  actualScore: number;
  bias: 'OVERCONFIDENCE' | 'UNDERCONFIDENCE' | 'ACCURATE';
  calibrationError?: number;
}

export default function MetacognitiveScatterPlot({
  initialPoints,
}: {
  initialPoints?: CalibrationDataPoint[];
}) {
  const [dataPoints, setDataPoints] = useState<CalibrationDataPoint[]>(initialPoints || []);
  const [selectedPoint, setSelectedPoint] = useState<CalibrationDataPoint | null>(null);

  useEffect(() => {
    if (initialPoints && initialPoints.length > 0) {
      setDataPoints(initialPoints);
      setSelectedPoint(initialPoints[0]);
      return;
    }

    async function loadCalibrations() {
      try {
        const res = await fetch('/api/calibration');
        const json = await res.json();
        if (json.success && json.records && json.records.length > 0) {
          const mapped: CalibrationDataPoint[] = json.records.map((r: any) => ({
            id: r.id,
            discipline: r.targetId || 'Examen Socrático',
            predictedScore: r.predictedScore,
            actualScore: r.actualScore,
            bias: r.bias as any,
            calibrationError: r.calibrationError,
          }));
          setDataPoints(mapped);
          if (mapped.length > 0) setSelectedPoint(mapped[0]);
        }
      } catch (e) {
        console.error('Error cargando puntos de calibración:', e);
      }
    }

    loadCalibrations();
  }, [initialPoints]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Target className="w-4 h-4" />
          <span>Matriz & Gráfico Metacognitivo de Calibración</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded font-mono font-semibold">
          {dataPoints.length > 0 ? `${dataPoints.length} Evaluaciones` : 'Inicio Limpio (0 Datos)'}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Contrapone tu puntaje predicho antes del examen frente a tu puntaje real obtenido (0 - 100 pts) para identificar sesgos de sobreconfianza o subconfianza por disciplina.
      </p>

      {/* GRÁFICO DE PUNTOS / DISPERSIÓN */}
      <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 h-64 flex flex-col justify-between overflow-hidden">
        {/* Cuadrícula de referencia */}
        <div className="absolute inset-4 pointer-events-none opacity-20">
          <div className="w-full h-full border border-slate-700 grid grid-cols-4 grid-rows-4" />
        </div>

        {/* Línea Ideal de Calibración Perfecta (Diagonal 45 Grados) */}
        <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none overflow-visible">
          <line
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
            className="stroke-purple-500/40"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
        </svg>

        {dataPoints.length === 0 ? (
          /* Mensaje de Estado Inicial Cero */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-1.5 z-10">
            <Target className="w-8 h-8 text-slate-600" />
            <p className="text-xs font-bold text-slate-300">Sin Datos de Calibración Aún</p>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Al completar exámenes socráticos o evaluaciones de dominio, aquí se graficará de forma automática tu precisión metacognitiva real frente a la diagonal ideal.
            </p>
          </div>
        ) : (
          /* Lienzo con puntos reales */
          <div className="relative w-full h-full z-10">
            {dataPoints.map((pt, idx) => {
              // Clamp values between 5 and 95 so dots stay fully visible inside canvas
              const clampedX = Math.min(95, Math.max(5, pt.predictedScore));
              const clampedY = Math.min(95, Math.max(5, 100 - pt.actualScore));
              const isSelected = selectedPoint?.id === pt.id;

              const dotColor =
                pt.bias === 'ACCURATE'
                  ? 'bg-emerald-400 border-emerald-300 shadow-emerald-500/50'
                  : pt.bias === 'OVERCONFIDENCE'
                  ? 'bg-amber-400 border-amber-300 shadow-amber-500/50'
                  : 'bg-sky-400 border-sky-300 shadow-sky-500/50';

              return (
                <button
                  key={pt.id || idx}
                  type="button"
                  onClick={() => setSelectedPoint(pt)}
                  style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                  title={`${pt.discipline}: Predicho ${pt.predictedScore}%, Real ${pt.actualScore}%`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all transform hover:scale-125 shadow cursor-pointer ${dotColor} ${
                    isSelected ? 'ring-4 ring-purple-400/60 scale-125 z-20' : 'opacity-85'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Leyenda de los Ejes */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1 z-10">
          <span>0 (Predicho)</span>
          <span className="text-slate-400 font-semibold">Eje X: Predicho · Diagonal: Calibración Perfecta</span>
          <span>100 (Predicho)</span>
        </div>
      </div>

      {/* Leyenda de Sesgos */}
      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
        <div className="p-2 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300">
          ● Precisa (±5%)
        </div>
        <div className="p-2 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-300">
          ● Sobreconfianza
        </div>
        <div className="p-2 bg-sky-950/40 border border-sky-800/50 rounded-xl text-sky-300">
          ● Subconfianza
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
            {selectedPoint.calibrationError !== undefined && (
              <span className="block text-slate-500 text-[10px] mt-0.5">
                Desviación de calibración: {selectedPoint.calibrationError}%
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
