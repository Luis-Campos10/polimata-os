'use client';

import { useState } from 'react';
import { Award, Printer, Download, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface CertificateProps {
  userName?: string;
  completedWeeks?: number;
  retentionRate?: number;
  calibrationBias?: string;
}

export default function GraduationCertificateModal({
  userName = 'Polímata Autodidacta',
  completedWeeks = 16,
  retentionRate = 92,
  calibrationBias = 'Excelente Calibración (+2.1%)',
}: CertificateProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-gradient-to-r from-amber-600 via-purple-600 to-sky-600 hover:from-amber-500 hover:to-sky-500 text-white font-bold text-xs rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40 active:scale-95"
      >
        <Award className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>📜 Generar Certificado de Graduación & Reporte PDF</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center text-slate-100 print:border-none print:shadow-none print:bg-white print:text-black">
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 print:hidden cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* MARCO DIPLOMA DE HONOR */}
            <div className="border-4 border-double border-amber-500/60 p-6 rounded-2xl space-y-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 print:bg-white print:border-amber-700">
              <div className="flex justify-center items-center space-x-2 text-amber-400">
                <Award className="w-10 h-10 print:text-amber-600" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                PROGRAMA INTERDISCIPLINARIO DE 10 AÑOS — POLÍMATA OS
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif print:text-black">
                CERTIFICADO DE GRADUACIÓN
              </h2>

              <p className="text-xs text-slate-300 italic">
                Se otorga el presente diploma de honor con mención en Metacognición y Ciencia del Aprendizaje a:
              </p>

              <div className="py-2">
                <h3 className="text-xl sm:text-2xl font-black text-amber-300 underline decoration-amber-500 underline-offset-8 font-mono print:text-amber-800">
                  {userName}
                </h3>
              </div>

              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                Por haber completado exitosamente las <strong>16 Semanas de la Fase 0 ("Aprender a aprender")</strong>, demostrando dominio en práctica de recuperación activa sin notas (Free Recall), diseño de dificultades deseables, calibración metacognitiva y defensa socrática de postulados.
              </p>

              {/* MÉTRICAS DE VERIFICACIÓN */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-amber-500/30 text-left font-mono text-[11px]">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Fase 0 Completa:</span>
                  <strong className="text-emerald-400 text-xs">{completedWeeks} / 16 Semanas</strong>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Retención FSRS:</span>
                  <strong className="text-sky-400 text-xs">{retentionRate}% Dominio</strong>
                </div>

                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Calibración:</span>
                  <strong className="text-amber-300 text-[10px] truncate block">{calibrationBias}</strong>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-end border-t border-slate-800 text-[10px] text-slate-400">
                <div className="text-left space-y-0.5">
                  <span>Sello de Validación Inmutable SQLite</span>
                  <span className="block font-mono text-[9px] text-slate-500">ID: POLIMATA-CERT-{Date.now()}</span>
                </div>
                <div className="text-right">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 ml-auto" />
                  <span className="font-bold text-slate-200">Polímata OS Core</span>
                </div>
              </div>
            </div>

            {/* BOTONES DE IMPRESIÓN Y DESCARGA */}
            <div className="flex gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar como PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
