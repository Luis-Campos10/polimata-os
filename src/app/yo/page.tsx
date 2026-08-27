import { User, BarChart3, Clock, Target, AlertTriangle, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import YoBackupActions from './YoBackupActions';
import MetacognitiveScatterPlot from '@/components/MetacognitiveScatterPlot';
import RetentionBadges from '@/components/RetentionBadges';
import GraduationCertificateModal from '@/components/GraduationCertificateModal';
import InterdisciplinaryRadarChart from '@/components/InterdisciplinaryRadarChart';
import SocraticExamSimulatorModal from '@/components/SocraticExamSimulatorModal';

export default function YoPage() {
  return (
    <main className="space-y-6 pb-12">
      {/* Cabecera / Perfil */}
      <header className="relative overflow-hidden bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-sky-800/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-xl shadow-inner">
            P
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-50">Estudiante Polímata</h1>
            <p className="text-xs text-slate-300">Año 1 · Fase 0 (Semana 1 en curso)</p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 bg-sky-500/10 text-sky-300 text-xs font-bold rounded-xl border border-sky-500/30">
          Nivel Activo
        </span>
      </header>

      {/* Grid de Métricas Reales (No Vanity Metrics) - Estado Inicial en Cero */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Dominio Promedio</span>
            <Target className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-400">0 / 100</div>
          <p className="text-xs text-slate-500">Sin evaluaciones completadas aún</p>
        </div>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Calibración Metacognitiva</span>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-400">± 0.0%</div>
          <p className="text-xs text-slate-500">Sin evaluaciones para medir sesgos</p>
        </div>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Retención +30 Días</span>
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-400">0%</div>
          <p className="text-xs text-slate-500">Sin revisiones diferidas programadas</p>
        </div>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Horas de Estudio Real</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-400">0.0 h</div>
          <p className="text-xs text-slate-500">Tiempo acumulado en el temporizador Focus</p>
        </div>

        {/* ÍNDICE DE DIVERSIDAD INTELECTUAL (ENTROPÍA DE SHANNON) - INICIO LIMPIO EN CERO */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span className="flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-slate-500" /> Índice de Diversidad Intelectual (Shannon Entropy)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono text-[11px]">
              0 / 100 · Sin lecturas registradas
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
            <div className="bg-slate-700 h-full" style={{ width: '0%' }} />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Comienza a registrar sesiones de lectura y flashcards en diversas disciplinas para calcular la entropía y el balance de tu polimatía.
          </p>
        </div>
      </section>

      {/* Generador y Exportador de Certificado de Graduación PDF */}
      <GraduationCertificateModal />

      {/* Simulador de Examen Diagnóstico Socrático & Calibración Metacognitiva */}
      <SocraticExamSimulatorModal />


      {/* Gráfico de Radar de Dominio Interdisciplinario */}
      <InterdisciplinaryRadarChart />


      {/* Gráfico Metacognitivo de Dispersión */}
      <MetacognitiveScatterPlot />


      {/* Matriz & Logros de Retención Real */}
      <RetentionBadges />

      {/* Perfil de Errores Recurrentes - Estado Inicial */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Perfil de Errores Recurrentes (Inicio Limpio)
        </h2>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-200 font-medium mb-1.5">
              <span>Omisión de Supuestos</span>
              <span className="font-mono text-slate-500">0%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-200 font-medium mb-1.5">
              <span>Conexiones No Justificadas</span>
              <span className="font-mono text-slate-500">0%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-200 font-medium mb-1.5">
              <span>Distorsión de Definiciones</span>
              <span className="font-mono text-slate-500">0%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Portabilidad y Respaldos */}
      <YoBackupActions />
    </main>
  );
}


