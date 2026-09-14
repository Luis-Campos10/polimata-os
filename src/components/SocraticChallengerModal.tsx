'use client';

import { useState } from 'react';
import {
  Scale,
  X,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface SocraticChallengerModalProps {
  questionId: string;
  questionTitle: string;
  currentPosition?: string;
  currentArgument?: string;
  currentConfidence?: number;
  onSavedRefinement?: () => void;
}

export default function SocraticChallengerModal({
  questionId,
  questionTitle,
  currentPosition = '',
  currentArgument = '',
  currentConfidence = 75,
  onSavedRefinement,
}: SocraticChallengerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [openObjectionIndex, setOpenObjectionIndex] = useState<number | null>(0);
  const [refinedThesis, setRefinedThesis] = useState('');
  const [newConfidence, setNewConfidence] = useState(currentConfidence);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activePosition, setActivePosition] = useState(currentPosition);
  const [activeArgument, setActiveArgument] = useState(currentArgument);
  const [activeConfidence, setActiveConfidence] = useState(currentConfidence);

  const handleOpen = async () => {
    setIsOpen(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    let pos = currentPosition;
    let arg = currentArgument;
    let conf = currentConfidence;

    // Si no se pasó postura por prop, buscar la más reciente en SQLite para esta pregunta
    if (!pos || pos.trim().length < 15) {
      setIsLoading(true);
      try {
        const ledgerRes = await fetch(`/api/ledger?questionId=${questionId}`);
        const ledgerJson = await ledgerRes.json();
        if (ledgerJson.entries && ledgerJson.entries.length > 0) {
          const latest = ledgerJson.entries[0];
          pos = latest.positionSummary;
          let parsedArgs = [];
          try {
            parsedArgs = JSON.parse(latest.argumentsJson || '[]');
          } catch (e) {}
          arg = parsedArgs[0] || '';
          conf = latest.confidence || 75;
          setActivePosition(pos);
          setActiveArgument(arg);
          setActiveConfidence(conf);
          setNewConfidence(conf);
        }
      } catch (e) {
        console.warn('No se pudo verificar el ledger:', e);
      }
    } else {
      setActivePosition(pos);
      setActiveArgument(arg);
      setActiveConfidence(conf);
    }

    if (!pos || pos.trim().length < 15) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/socratic-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          questionTitle,
          positionSummary: pos,
          argument: arg,
          confidence: conf,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setChallengeData(json.data);
      } else {
        setErrorMessage(json.error || 'No se pudieron generar las objeciones socráticas.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Error al conectar con el Abogado del Diablo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRefined = async () => {
    if (!refinedThesis.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          positionSummary: refinedThesis.trim(),
          confidence: newConfidence,
          argument: `Refinamiento dialéctico frente a objeciones de ${challengeData?.counterTheorist || 'Abogado del Diablo'}.`,
          falsationCriteria: challengeData?.probingQuestions?.[0] || 'Criterio revisado.',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        if (onSavedRefinement) onSavedRefinement();
        setTimeout(() => {
          setIsOpen(false);
          setRefinedThesis('');
        }, 2500);
      }
    } catch (e) {
      setErrorMessage('Error al guardar en el Question Ledger.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 text-xs font-bold rounded-lg border border-rose-800/50 hover:border-rose-600 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        title="Poner a prueba mi postura con el Abogado del Diablo"
      >
        <Scale className="w-3.5 h-3.5 text-rose-400" />
        <span>Abogado del Diablo</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-slate-900 border border-rose-900/40 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl relative text-slate-100 flex flex-col">
            {/* Cabecera */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase font-mono">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Modo Dialéctica Socrática</span>
                </div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Abogado del Diablo: {questionId}
                </h2>
                <p className="text-xs text-slate-400">{questionTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verificación de Regla Pedagógica de Esfuerzo Propio */}
            {!currentPosition || currentPosition.trim().length < 15 ? (
              <div className="py-8 px-4 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-200">
                  Regla Pedagógica: Esfuerzo Propio Requerido
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Para que el Abogado del Diablo pueda desafiarte, primero debes haber registrado tu
                  propia postura en el <strong>Question Ledger</strong>. La IA no puede debatir con
                  un vacío.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Entendido, registraré mi postura primero
                </button>
              </div>
            ) : isLoading ? (
              <div className="py-14 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-mono">
                  Formulando objeciones ontológicas y contraejemplos dialécticos...
                </p>
              </div>
            ) : challengeData ? (
              <div className="space-y-4">
                {/* Postura actual del usuario */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                    Tu Postura Actual Registrada ({currentConfidence}% de Certeza):
                  </span>
                  <p className="text-slate-200 italic font-serif leading-relaxed">
                    &ldquo;{challengeData.userThesis}&rdquo;
                  </p>
                </div>

                {/* Acordeón de 3 Objeciones Duras */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Scale className="w-3.5 h-3.5" />
                    3 Objeciones Filosóficas Rigurosas
                  </h4>

                  {challengeData.objections.map((obj: any, idx: number) => {
                    const isOpenObj = openObjectionIndex === idx;
                    return (
                      <div
                        key={obj.id}
                        className="bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden transition"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenObjectionIndex(isOpenObj ? null : idx)}
                          className="w-full p-3 text-left flex justify-between items-center hover:bg-slate-800/40 transition"
                        >
                          <div className="space-y-0.5 pr-2">
                            <span className="text-xs font-bold text-rose-200 block">{obj.title}</span>
                            <span className="text-[11px] text-slate-400 block">{obj.subtitle}</span>
                          </div>
                          {isOpenObj ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isOpenObj && (
                          <div className="p-3.5 pt-0 border-t border-slate-900 text-xs text-slate-300 space-y-2 leading-relaxed font-sans animate-fadeIn">
                            <p>{obj.content}</p>
                            <span className="inline-block text-[10px] font-mono text-rose-400/90 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/40">
                              {obj.counterTarget}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dilema de Frontera */}
                {challengeData.dilemma && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-950/30 to-rose-950/30 rounded-xl border border-amber-800/40 text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-bold font-mono text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dilema Ético / Epistémico Límite:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{challengeData.dilemma}</p>
                  </div>
                )}

                {/* Preguntas de Interrogatorio */}
                {challengeData.probingQuestions && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-bold block">
                      Interrogatorio Socrático:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      {challengeData.probingQuestions.map((q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sección de Refinamiento Inmutable */}
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-200 block">
                      Refina tu Tesis (Defensa o Modificación tras las Objeciones):
                    </label>
                    <span className="text-[10px] font-mono text-purple-400">
                      Nueva versión inmutable
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={refinedThesis}
                    onChange={(e) => setRefinedThesis(e.target.value)}
                    placeholder="Tras considerar las objeciones de Popper y Hume, refino mi postura sosteniendo que..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                      <span>Nueva Certeza Calibrada:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newConfidence}
                        onChange={(e) => setNewConfidence(Number(e.target.value))}
                        className="w-24 accent-purple-500"
                      />
                      <strong className="text-purple-300">{newConfidence}%</strong>
                    </div>

                    <button
                      type="button"
                      disabled={isSaving || !refinedThesis.trim()}
                      onClick={handleSaveRefined}
                      className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isSaving ? 'Guardando...' : 'Guardar Tesis Refinada'}</span>
                    </button>
                  </div>

                  {savedSuccess && (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-mono animate-fadeIn">
                      ¡Nueva versión registrada con éxito en el Question Ledger sin alterar tu historial previo!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-rose-400">
                {errorMessage || 'No se pudo cargar el debate.'}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
