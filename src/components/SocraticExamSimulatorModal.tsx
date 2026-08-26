'use client';

import { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, ShieldCheck, X, Sparkles, Brain } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXAM_QUESTIONS: Question[] = [
  {
    id: 1,
    question: '¿Qué fenómeno empírico demuestra que evaluar la memoria produce más retención a largo plazo que releer?',
    options: ['Efecto Halo', 'Testing Effect (Efecto Evaluación)', 'Ilusión de Dominio', 'Efecto Primacía'],
    correctIndex: 1,
    explanation: 'Demostrado por Roediger & Karpicke (2006): recuperar la información activa la memoria a largo plazo.'
  },
  {
    id: 2,
    question: '¿En qué consiste la técnica de debate socrático denominada "Steelman"?',
    options: ['Atacar el punto más débil del oponente', 'Construir la versión más fuerte y defendible de la postura rival', 'Ignorar la evidencia empírica', 'Usar analogías emocionales'],
    correctIndex: 1,
    explanation: 'El Steelman requiere reconstruir con máxima justicia el argumento rival antes de refutarlo.'
  },
  {
    id: 3,
    question: '¿Qué diferencia existe entre rendimiento (performance) durante el estudio y aprendizaje (learning)?',
    options: ['Son idénticos', 'El rendimiento mide la fluidez inmediata; el aprendizaje mide la retención duradera', 'El aprendizaje es siempre más rápido que el rendimiento', 'El rendimiento no se puede medir'],
    correctIndex: 1,
    explanation: 'Dunlosky (2013): la fluidez momentánea engaña al estudiante creando ilusión de dominio.'
  },
  {
    id: 4,
    question: '¿Cuál es el criterio de demarcación científica introducido por Karl Popper?',
    options: ['Verificación inductiva', 'Falsacionismo (potencial refutabilidad empírica)', 'Aprobación por consenso', 'Complejidad matemática'],
    correctIndex: 1,
    explanation: 'Una teoría es científica solo si hace predicciones arriesgadas que puedan ser refutadas por experimentos.'
  }
];

export default function SocraticExamSimulatorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [predictedScore, setPredictedScore] = useState(85);
  const [currentStep, setCurrentStep] = useState<'predict' | 'test' | 'results'>('predict');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleStartTest = () => {
    setCurrentStep('test');
  };

  const handleSelectOption = (qId: number, oIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: oIdx }));
  };

  const handleFinishTest = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
    setFinalScore(calculatedScore);
    setCurrentStep('results');
  };

  const calibrationError = finalScore !== null ? Math.abs(predictedScore - finalScore) : 0;
  const biasType = finalScore !== null
    ? predictedScore > finalScore ? 'Sobreconfianza (Ilusión de Dominio)' : 'Subconfianza Metacognitiva'
    : '';

  return (
    <>
      <button
        type="button"
        onClick={() => { setIsOpen(true); setCurrentStep('predict'); }}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-sky-300 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer border border-sky-500/30 shadow-md active:scale-95"
      >
        <Brain className="w-4 h-4 text-sky-400" />
        <span>🧪 Iniciar Examen Diagnóstico Socrático & Calibración</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-sky-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-sky-400">
              <Brain className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-white">Examen Diagnóstico & Calibración</h3>
            </div>

            {currentStep === 'predict' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-sky-950/40 border border-sky-800/40 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-sky-300 uppercase font-bold">Paso 1: Predicción de Juicio de Aprendizaje (JOL)</span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Antes de ver las preguntas, evalúa tu nivel de confianza: **¿Qué porcentaje de aciertos (0 a 100%) estimas que obtendrás?**
                  </p>
                </div>

                <div className="space-y-2 text-center py-2">
                  <label className="text-3xl font-black text-amber-300 font-mono">{predictedScore}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={predictedScore}
                    onChange={(e) => setPredictedScore(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Predicción de Confianza Metacognitiva
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleStartTest}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-lg cursor-pointer active:scale-95"
                >
                  Comenzar Examen de 4 Preguntas →
                </button>
              </div>
            )}

            {currentStep === 'test' && (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto animate-fadeIn pr-1">
                {EXAM_QUESTIONS.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-bold text-sky-400 font-mono uppercase">Pregunta {q.id}</span>
                    <p className="text-xs text-slate-100 font-bold">{q.question}</p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full p-2.5 rounded-xl text-xs text-left transition border cursor-pointer font-mono ${
                            selectedAnswers[q.id] === oIdx
                              ? 'bg-sky-600 text-white border-sky-400 font-bold'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleFinishTest}
                  disabled={Object.keys(selectedAnswers).length < EXAM_QUESTIONS.length}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg cursor-pointer active:scale-95"
                >
                  Evaluar Examen & Calcular Calibración →
                </button>
              </div>
            )}

            {currentStep === 'results' && finalScore !== null && (
              <div className="space-y-4 animate-fadeIn text-center">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-bold px-3 py-1 bg-purple-950/60 rounded-full border border-purple-500/30">
                    Resultado de Calibración
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Predicho:</span>
                      <strong className="text-amber-300 text-lg">{predictedScore}%</strong>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">Real Demostrado:</span>
                      <strong className="text-sky-300 text-lg">{finalScore}%</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/40 text-xs text-purple-200">
                    <p className="font-bold">Error de Calibración: {calibrationError}%</p>
                    <p className="text-[11px] text-slate-300 mt-1">{biasType}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cerrar Examen
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
