'use client';

import { useState } from 'react';
import { Compass, Sparkles, Award } from 'lucide-react';

interface RadarData {
  axis: string;
  value: number;
}

export default function InterdisciplinaryRadarChart() {
  const data: RadarData[] = [
    { axis: 'Filosofía & Ética', value: 88 },
    { axis: 'Ciencia Cognitiva', value: 94 },
    { axis: 'Epistemología', value: 90 },
    { axis: 'Biología & Origen', value: 85 },
    { axis: 'Historia & Sociedad', value: 82 },
    { axis: 'Argumentación', value: 91 },
  ];

  const size = 260;
  const center = size / 2;
  const radius = center - 40;
  const totalAxes = data.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Calcular coordenadas SVG para cada eje y valor
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const points = data
    .map((d, i) => {
      const { x, y } = getCoordinates(d.value, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Radar de Dominio Interdisciplinario</span>
        </div>
        <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-0.5 rounded font-mono font-bold">
          88.3 Pts Promedio
        </span>
      </div>

      <div className="flex flex-col items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Telaraña de fondo (Niveles 25%, 50%, 75%, 100%) */}
          {[0.25, 0.5, 0.75, 1].map((level, levelIdx) => {
            const levelPoints = data
              .map((_, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                const r = level * radius;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(' ');
            return (
              <polygon
                key={levelIdx}
                points={levelPoints}
                className="fill-none stroke-slate-800"
                strokeWidth="1"
                strokeDasharray={levelIdx === 3 ? 'none' : '2,2'}
              />
            );
          })}

          {/* Ejes desde el centro */}
          {data.map((_, i) => {
            const { x, y } = getCoordinates(100, i);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="stroke-slate-800"
                strokeWidth="1"
              />
            );
          })}

          {/* Área Polígono del Aprendiz */}
          <polygon
            points={points}
            className="fill-sky-500/25 stroke-sky-400 transition-all duration-500"
            strokeWidth="2.5"
          />

          {/* Puntos en cada vértice */}
          {data.map((d, i) => {
            const { x, y } = getCoordinates(d.value, i);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                className="fill-amber-400 stroke-slate-950"
                strokeWidth="2"
              />
            );
          })}

          {/* Etiquetas de los Ejes */}
          {data.map((d, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const labelRadius = radius + 22;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-300 text-[9px] font-mono font-bold"
              >
                {d.axis}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
        {data.map((item, idx) => (
          <div key={idx} className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-400 block truncate">{item.axis}</span>
            <strong className="text-sky-300 text-xs">{item.value}% Dominio</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
