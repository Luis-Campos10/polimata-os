import { User, BarChart3, Clock, Target, AlertTriangle, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { initDb } from '@/lib/db';
import { getUserRealMetrics } from '@/lib/db/queries';
import YoBackupActions from './YoBackupActions';
import YoSyncHeaderBanner from './YoSyncHeaderBanner';
import MetacognitiveScatterPlot from '@/components/MetacognitiveScatterPlot';
import RetentionBadges from '@/components/RetentionBadges';
import GraduationCertificateModal from '@/components/GraduationCertificateModal';
import InterdisciplinaryRadarChart from '@/components/InterdisciplinaryRadarChart';
import SocraticExamSimulatorModal from '@/components/SocraticExamSimulatorModal';

export default async function YoPage() {
  await initDb();
  const metrics = await getUserRealMetrics();

  const hasMastery = metrics.averageMastery > 0 || metrics.totalEvaluationsCount > 0;
  const hasStudyHours = metrics.totalStudyMinutes > 0;
  const hasCalibrations = metrics.calibrationRecordCount > 0;
  const hasRetention = metrics.completedReviewsCount > 0 || metrics.retentionRate > 0;

  return (
    <main className="space-y-6 pb-12">
      {/* Cabecera / Perfil */}
      <header className="relative overflow-hidden bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-sky-800/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-xl shadow-inner font-mono">
            P
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-50">Estudiante Polímata</h1>
            <p className="text-xs text-slate-300">
              Año 1 · Fase 0 ({metrics.completedWeeksCount} de 16 semanas dominadas)
            </p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 bg-sky-500/10 text-sky-300 text-xs font-bold rounded-xl border border-sky-500/30 font-mono">
          {metrics.completedWeeksCount >= 16 ? 'Fase 0 Graduado' : 'Fase 0 En Curso'}
        </span>
      </header>

      {/* Acceso Rápido Prominente a Obsidian & Anki */}
      <YoSyncHeaderBanner />

      {/* Grid de Métricas Reales (No Vanity Metrics) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dominio Promedio */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Dominio Promedio Real</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-3xl font-black font-mono ${hasMastery ? 'text-emerald-400' : 'text-slate-400'}`}>
            {metrics.averageMastery} / 100
          </div>
          <p className="text-xs text-slate-500">
            {hasMastery
              ? `Calculado sobre ${metrics.totalEvaluationsCount} evaluaciones pedagógicas`
              : 'Sin evaluaciones completadas aún'}
          </p>
        </div>

        {/* Calibración Metacognitiva */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Calibración Metacognitiva</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className={`text-3xl font-black font-mono ${hasCalibrations ? 'text-purple-300' : 'text-slate-400'}`}>
            {metrics.calibrationBiasText}
          </div>
          <p className="text-xs text-slate-500">
            {hasCalibrations
              ? `${metrics.calibrationRecordCount} juicios JOL evaluados empíricamente`
              : 'Sin evaluaciones para medir sesgos'}
          </p>
        </div>

        {/* Retención FSRS */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Retención Comprobada FSRS</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className={`text-3xl font-black font-mono ${hasRetention ? 'text-sky-400' : 'text-slate-400'}`}>
            {metrics.retentionRate}%
          </div>
          <p className="text-xs text-slate-500">
            {hasRetention
              ? `${metrics.completedReviewsCount} repasos realizados · ${metrics.pendingReviewsCount} pendientes`
              : `${metrics.pendingReviewsCount} revisiones diferidas en espera`}
          </p>
        </div>

        {/* Horas de Estudio */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Horas de Estudio Real</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-3xl font-black font-mono ${hasStudyHours ? 'text-amber-300' : 'text-slate-400'}`}>
            {metrics.studyHoursText} h
          </div>
          <p className="text-xs text-slate-500">
            {hasStudyHours
              ? `${metrics.totalStudyMinutes} min acumulados en sesiones de foco`
              : 'Tiempo acumulado en el temporizador Focus'}
          </p>
        </div>

        {/* ÍNDICE DE DIVERSIDAD INTELECTUAL (ENTROPÍA DE SHANNON) */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span className="flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" /> Índice de Diversidad Intelectual (Shannon Entropy)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
              {metrics.shannonDiversityScore} / 100 · {metrics.shannonDiversityScore > 50 ? 'Polimatía Equilibrada' : 'En Construcción'}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
            <div
              className="bg-gradient-to-r from-sky-500 via-purple-500 to-amber-500 h-full transition-all duration-700"
              style={{ width: `${Math.max(5, metrics.shannonDiversityScore)}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Mide la amplitud interdisciplinaria cruzada entre las 18 Grandes Preguntas y las 170 obras del canon mediante la entropía de Shannon.
          </p>
        </div>
      </section>

      {/* Generador y Exportador de Certificado de Graduación PDF */}
      <GraduationCertificateModal
        userName="Estudiante Polímata"
        completedWeeks={metrics.completedWeeksCount}
        retentionRate={metrics.retentionRate > 0 ? metrics.retentionRate : 85}
        calibrationBias={metrics.calibrationBiasText !== '± 0.0%' ? `Calibración ${metrics.calibrationBiasText}` : 'En evaluación'}
      />

      {/* Simulador de Examen Diagnóstico Socrático & Calibración Metacognitiva */}
      <SocraticExamSimulatorModal />

      {/* Gráfico de Radar de Dominio Interdisciplinario */}
      <InterdisciplinaryRadarChart
        averageMastery={metrics.averageMastery}
        hasEvaluations={hasMastery}
      />

      {/* Gráfico Metacognitivo de Dispersión */}
      <MetacognitiveScatterPlot />

      {/* Matriz & Logros de Retención Real */}
      <RetentionBadges
        completedAttemptsCount={metrics.totalEvaluationsCount > 0 ? metrics.totalEvaluationsCount : (metrics.totalStudyMinutes > 0 ? 1 : 0)}
        evaluationsCount={metrics.calibrationRecordCount}
        avgCalibrationError={metrics.avgCalibrationError}
        completedReviewsCount={metrics.completedReviewsCount}
        connectedNodesCount={4 + (metrics.completedWeeksCount * 2)}
      />

      {/* Perfil de Errores Recurrentes - Datos Reales */}
      <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Perfil de Errores Recurrentes
          </h2>
          <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded font-mono">
            {metrics.errorCounts.total > 0 ? `${metrics.errorCounts.total} Hallazgos` : 'Limpio (Sin errores registrados)'}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-200 font-medium mb-1.5">
              <span>Omisión de Supuestos y Estructura</span>
              <span className="font-mono text-slate-300">
                {metrics.errorPercentages.omision}% ({metrics.errorCounts.omision})
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.errorPercentages.omision}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-200 font-medium mb-1.5">
              <span>Conexiones No Justificadas / Falta de Evidencia</span>
              <span className="font-mono text-slate-300">
                {metrics.errorPercentages.conexionNoJustificada}% ({metrics.errorCounts.conexionNoJustificada})
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.errorPercentages.conexionNoJustificada}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-200 font-medium mb-1.5">
              <span>Distorsión de Definiciones y Absolutismos</span>
              <span className="font-mono text-slate-300">
                {metrics.errorPercentages.distorsion}% ({metrics.errorCounts.distorsion})
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.errorPercentages.distorsion}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portabilidad y Respaldos */}
      <YoBackupActions />
    </main>
  );
}
