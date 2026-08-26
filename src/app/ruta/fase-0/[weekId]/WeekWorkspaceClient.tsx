'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, Lock, Unlock, Play, ShieldAlert, Award, FileText, Send, Sparkles, BookOpen, HelpCircle, FlaskConical, ChevronRight, X, AlertCircle, Upload, Trash2, Mic, MicOff, Quote, PlusCircle } from 'lucide-react';
import MarkdownEditor from '@/components/MarkdownEditor';
import FocusTimer from '@/components/FocusTimer';
import { savePdfToIndexedDb, getPdfsFromIndexedDb, deletePdfFromIndexedDb } from '@/lib/pdfIndexedDb';


interface WeekData {
  id: string;
  weekNumber: number;
  title: string;
  purpose: string;
  targetHours: string;
  guideQuestionsJson: string;
  resourcesJson: string;
  laboratoryJson: string;
  productPrescription: string;
  productDescription: string;
  examSpecification: string;
}

export default function WeekWorkspaceClient({ week }: { week: WeekData }) {
  const searchParams = useSearchParams();
  const initialStepParam = searchParams.get('step');

  // Parsear JSONs de la base de datos
  const guideQuestions: string[] = week.guideQuestionsJson ? JSON.parse(week.guideQuestionsJson) : [];
  const resources: any[] = week.resourcesJson ? JSON.parse(week.resourcesJson) : [];
  const laboratory = week.laboratoryJson ? JSON.parse(week.laboratoryJson) : null;

  // Determinar paso inicial basado en la URL
  const getInitialStep = () => {
    if (initialStepParam === 'reading' || initialStepParam === 'resources') return 'resources';
    if (initialStepParam === 'recall') return 'recall';
    if (initialStepParam === 'audit') return 'audit';
    if (initialStepParam === 'exam') return 'exam';
    if (initialStepParam === 'mastery') return 'mastery';
    return 'orient';
  };

  // Estados del Flujo Cognitivo
  const [activeStep, setActiveStep] = useState<'orient' | 'resources' | 'recall' | 'audit' | 'exam' | 'mastery'>(getInitialStep());
  const [freeRecallText, setFreeRecallText] = useState('');
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [auditSaved, setAuditSaved] = useState<string | null>(null);

  // Estado Auditoría Inteligente & Entregables Markdown
  const [aiAuditResult, setAiAuditResult] = useState<{
    findings: Array<{ errorType: string; label: string; description: string }>;
    challengeQuestion: string;
    reconstructionQuality: string;
  } | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [deliverableContent, setDeliverableContent] = useState(`# ${week.productPrescription}\n\n## 1. Contexto & Hipótesis\nEscribe aquí tus observaciones...\n\n## 2. Desarrollo del Modelo\n...`);

  // Estado del Visor PDF & Biblioteca Persistente
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  const getExecutablePdfUrl = (rawUrl: string | null): string | null => {
    if (!rawUrl) return null;
    if (!rawUrl.startsWith('data:')) return rawUrl;
    try {
      const parts = rawUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      return URL.createObjectURL(blob);
    } catch (e) {
      return rawUrl;
    }
  };


  // Estado Recuerdo Activo por Voz (Speech-to-Text Feynman)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  // Estado Citas Extractoras PDF & Nodos Grafo Sugeridos
  const [pdfQuoteText, setPdfQuoteText] = useState('');
  const [suggestedNodes, setSuggestedNodes] = useState<Array<{ label: string; nodeType: string; description: string }>>([]);
  const [insertedNodesSuccess, setInsertedNodesSuccess] = useState(false);

  // Función para dictado por voz (Speech Recognition API)
  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta la Web Speech API de reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    if (isRecordingAudio) {
      setIsRecordingAudio(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsRecordingAudio(true);
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setFreeRecallText((prev) => `${prev} ${transcript}`.trim());
        };

        recognition.onerror = () => setIsRecordingAudio(false);
        recognition.onend = () => setIsRecordingAudio(false);
        recognition.start();
      } catch (err) {
        console.error('Error al iniciar reconocimiento de voz:', err);
        setIsRecordingAudio(false);
      }
    }
  };

  // Función para insertar cita PDF al borrador Markdown
  const handleInsertPdfQuoteToDeliverable = () => {
    if (!pdfQuoteText.trim()) return;
    const formattedQuote = `\n\n> 📑 **Cita Extraída (${pdfFileName || 'PDF'}):**\n> "${pdfQuoteText.trim()}"\n`;
    setDeliverableContent((prev) => prev + formattedQuote);
    setPdfQuoteText('');
    alert('¡Cita insertada correctamente en el borrador Markdown!');
  };

  // Función para solicitar auto-extracción de nodos del Grafo 2D
  const handleAutoExtractGraphNodes = async () => {
    try {
      const res = await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'autoExtract', text: freeRecallText || deliverableContent }),
      });
      const data = await res.json();
      if (data.success && data.suggestedNodes) {
        setSuggestedNodes(data.suggestedNodes);
      }
    } catch (err) {
      console.error('Error al extraer nodos:', err);
    }
  };

  // Guardar nodos sugeridos en el Grafo 2D SQLite
  const handleSaveSuggestedNode = async (node: { label: string; nodeType: string; description: string }) => {
    try {
      await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addNode', node }),
      });
      setInsertedNodesSuccess(true);
      setTimeout(() => setInsertedNodesSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar nodo:', err);
    }
  };

  // Biblioteca de PDFs Guardados Permanentemente en IndexedDB y SQLite
  const [savedPdfDocs, setSavedPdfDocs] = useState<Array<{ id: string; fileName: string; filePath: string; fileSize: number }>>([]);
  const [isUploadingPdfs, setIsUploadingPdfs] = useState(false);

  useEffect(() => {
    fetchSavedPdfs();
    restoreLastReadingPosition();
  }, [week.id]);

  const restoreLastReadingPosition = () => {
    try {
      if (typeof window === 'undefined') return;
      const key = `polimata_last_reading_${week.id}`;
      const savedState = localStorage.getItem(key);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.filePath && parsed.fileName) {
          setPdfBlobUrl(parsed.filePath);
          setPdfFileName(parsed.fileName);
          setShowPdfViewer(true);
        }
      }
    } catch (e) {}
  };

  const saveReadingPosition = (filePath: string, fileName: string) => {
    try {
      if (typeof window === 'undefined') return;
      const key = `polimata_last_reading_${week.id}`;
      localStorage.setItem(key, JSON.stringify({
        filePath,
        fileName,
        timestamp: Date.now()
      }));
    } catch (e) {}
  };

  const fetchSavedPdfs = async () => {
    try {
      // 1. Cargar PDFs almacenados localmente en IndexedDB (inmune a cierres de navegador en celular)
      const localPdfs = await getPdfsFromIndexedDb(week.id);
      
      // 2. Cargar PDFs de la base de datos API
      const res = await fetch(`/api/uploads/pdf?targetId=${week.id}&targetType=WEEK`);
      const data = await res.json();
      const remotePdfs = data.success ? data.documents || [] : [];

      // Combinar sin duplicados
      const mergedMap = new Map();
      localPdfs.forEach(doc => mergedMap.set(doc.id, doc));
      remotePdfs.forEach((doc: any) => mergedMap.set(doc.id, doc));

      const mergedDocs = Array.from(mergedMap.values());
      setSavedPdfDocs(mergedDocs);

      if (mergedDocs.length > 0 && !pdfBlobUrl) {
        const first = mergedDocs[0];
        setPdfBlobUrl(first.filePath);
        setPdfFileName(first.fileName);
        saveReadingPosition(first.filePath, first.fileName);
      }
    } catch (err) {
      console.error('Error al cargar biblioteca de PDFs:', err);
    }
  };

  const handleMultiplePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPdfs(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = `data:application/pdf;base64,${buffer.toString('base64')}`;
        
        const docId = `PDF_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        
        const newDoc = {
          id: docId,
          targetId: week.id,
          targetType: 'WEEK',
          fileName: file.name,
          filePath: base64Data,
          fileSize: file.size,
          createdAt: new Date().toISOString()
        };

        // Guardar PERMANENTEMENTE en IndexedDB en el celular
        await savePdfToIndexedDb(newDoc);

        if (i === 0) {
          setPdfBlobUrl(base64Data);
          setPdfFileName(file.name);
          setShowPdfViewer(true);
          saveReadingPosition(base64Data, file.name);
        }
      }

      await fetchSavedPdfs();
    } catch (err) {
      console.error('Error al guardar PDFs en celular:', err);
    } finally {
      setIsUploadingPdfs(false);
    }
  };

  const handleDeleteSavedPdf = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deletePdfFromIndexedDb(docId);
      await fetch(`/api/uploads/pdf?id=${docId}`, { method: 'DELETE' });
      
      setSavedPdfDocs(prev => prev.filter(d => d.id !== docId));
      if (pdfBlobUrl && pdfBlobUrl.includes(docId)) {
        setPdfBlobUrl(null);
        setPdfFileName(null);
        localStorage.removeItem(`polimata_last_reading_${week.id}`);
      }
    } catch (err) {
      console.error('Error al eliminar PDF:', err);
    }
  };





  // Actualizar paso si cambia la URL
  useEffect(() => {
    if (initialStepParam === 'reading' || initialStepParam === 'resources') setActiveStep('resources');
    else if (initialStepParam === 'recall') setActiveStep('recall');
    else if (initialStepParam === 'audit') setActiveStep('audit');
    else if (initialStepParam === 'exam') setActiveStep('exam');
    else if (initialStepParam === 'mastery') setActiveStep('mastery');
  }, [initialStepParam]);

  // Calibración y Rúbrica
  const [predictedScore, setPredictedScore] = useState(85);
  const [rubricScores, setRubricScores] = useState({
    recallScore: 14,
    reconstructionScore: 17,
    conceptualPrecisionScore: 13,
    argumentationScore: 14,
    transferScore: 18,
    synthesisScore: 8,
    calibrationScore: 4,
  });

  const [masteryResult, setMasteryResult] = useState<{ totalScore: number; status: string } | null>(null);

  // Guardar intento de Recuerdo Activo (Desbloquea Auditoria & Analiza con IA)
  async function handleSubmitAttempt() {
    if (!freeRecallText.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'WEEK',
          targetId: week.id,
          attemptType: 'FREE_RECALL',
          content: freeRecallText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAttemptSubmitted(true);
        setAttemptId(data.attemptId);
        setActiveStep('audit');
        runAiAnalysis();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  async function runAiAnalysis() {
    setIsAnalyzingAi(true);
    try {
      const res = await fetch('/api/audit/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptContent: freeRecallText,
          weekTitle: week.title,
          guideQuestions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAuditResult({
          findings: data.findings || [],
          challengeQuestion: data.challengeQuestion || '',
          reconstructionQuality: data.reconstructionQuality || 'MEDIA',
        });
      }
    } catch (err) {
      console.error('Error al analizar intento con IA:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  }

  // Guardar Entregable Markdown
  async function handleSaveDeliverable(content: string) {
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'WEEK',
          targetId: week.id,
          attemptType: 'DELIVERABLE',
          content,
        }),
      });
      setDeliverableContent(content);
    } catch (err) {
      console.error('Error al guardar entregable:', err);
    }
  }


  // Registrar hallazgo de auditoría en SQLite
  async function handleRegisterAuditFinding(errorType: string, label: string) {
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attemptId || 'WEEK_ATTEMPT',
          errorType,
          description: `Hallazgo registrado para ${week.id}: ${label}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditSaved(errorType);
        setTimeout(() => setAuditSaved(null), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Evaluar Dominio (0-100 pts)
  async function handleEvaluateMastery() {
    setIsSaving(true);
    try {
      const res = await fetch('/api/mastery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'WEEK',
          targetId: week.id,
          rubric: rubricScores,
          predictedScore,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMasteryResult({
          totalScore: data.totalScore,
          status: data.status,
        });
        setActiveStep('mastery');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="space-y-6 pb-16">
      {/* Botón de Retorno y Cabecera */}
      <div className="flex items-center justify-between">
        <Link href="/ruta" className="inline-flex items-center text-xs font-semibold text-sky-400 hover:underline gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver a la Ruta
        </Link>
        <span className="text-xs font-bold text-slate-300 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Semana Workspace — W{String(week.weekNumber).padStart(2, '0')}
        </span>
      </div>

      {/* Titulo y Meta */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center">
          <span className="px-2.5 py-0.5 bg-sky-500/10 text-sky-400 text-xs font-bold rounded border border-sky-500/20">
            FASE 0 — SEMANA {week.weekNumber}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            {week.targetHours}
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-100">{week.title}</h1>
        <p className="text-xs text-slate-300 leading-relaxed">{week.purpose}</p>
      </div>

      {/* Navegación por Pasos del Ciclo Cognitivo */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 pb-2">
        {[
          { id: 'orient', label: '1. Preguntas Guía' },
          { id: 'resources', label: '2. Libros & Papers' },
          { id: 'recall', label: '3. Recuerdo Activo' },
          { id: 'audit', label: '4. Auditoría & Errores' },
          { id: 'exam', label: '5. Examen & Calibración' },
          { id: 'mastery', label: '6. Dominio' },
        ].map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              activeStep === step.id
                ? 'bg-sky-600 text-white ring-2 ring-sky-400/50'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* PASO 1: PREGUNTAS GUÍA */}
      {activeStep === 'orient' && (
        <section className="space-y-4">
          <FocusTimer targetType="WEEK" targetId={week.id} onComplete={() => setActiveStep('recall')} />

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>Preguntas Guía de la Semana</span>
            </div>

            <p className="text-xs text-slate-300">
              Revisa las preguntas fundamentales que debes poder responder al finalizar el estudio de esta semana:
            </p>

            <div className="space-y-2">
              {guideQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-500/20">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveStep('resources')}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-md active:scale-95 cursor-pointer"
            >
              Ver Libros y Documentos a Leer →
            </button>
          </div>
        </section>
      )}

      {/* PASO 2: LIBROS & PAPERS EXACTOS PREACRITOS */}
      {activeStep === 'resources' && (
        <section className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-400" /> Mi Biblioteca de PDFs Guardados ({savedPdfDocs.length})
              </span>
              <p className="text-[11px] text-slate-400">
                Puedes subir varios archivos PDF a la vez. Quedarán almacenados permanentemente en tu base de datos local.
              </p>
            </div>

            <label className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow cursor-pointer shrink-0">
              <Upload className="w-4 h-4" />
              <span>{isUploadingPdfs ? 'Guardando PDFs...' : 'Subir Varios PDFs a la vez'}</span>
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleMultiplePdfUpload}
                disabled={isUploadingPdfs}
                className="hidden"
              />
            </label>
          </div>

          {/* Galería de PDFs Guardados Permanentemente */}
          {savedPdfDocs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {savedPdfDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setPdfBlobUrl(doc.filePath);
                    setPdfFileName(doc.fileName);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                    pdfBlobUrl === doc.filePath
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 hover:border-sky-500/40 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <h4 className="text-xs font-bold truncate">{doc.fileName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB · Guardado
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteSavedPdf(doc.id, e)}
                    title="Eliminar PDF de la biblioteca permanente"
                    className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {resources.map((res, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                      {res.priority || 'NÚCLEO'}
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 ml-2">
                      {res.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-1.5">
                      {res.author} — <em className="text-sky-300 font-normal">{res.title}</em>
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <strong className="text-slate-200 text-[11px] block uppercase font-bold">Qué Estudiar:</strong>
                  <p className="text-xs leading-relaxed">{res.whatToStudy}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedResource(res)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition border border-slate-700 cursor-pointer"
                  >
                    Ver Ficha de Lectura
                  </button>

                  <label className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold rounded-lg transition border border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer text-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir & Asociar PDF</span>
                    <input
                      type="file"
                      multiple
                      accept="application/pdf"
                      onChange={(e) => {
                        handleMultiplePdfUpload(e);
                        setSelectedResource(res);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>


          {/* VISOR PDF ABAJO (INLINE PLAYER PARA LIBROS Y PAPERS DE CUALQUIER TAMAÑO) */}
          {pdfBlobUrl && (
            <div className="bg-slate-950 border border-emerald-800/60 rounded-2xl p-4 space-y-3 shadow-2xl">
              <div className="flex flex-wrap justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800 gap-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-100">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Documento Cargado: <em className="text-emerald-300 font-mono font-normal">{pdfFileName}</em></span>
                </div>

                <div className="flex items-center space-x-2">
                  {pdfBlobUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const execUrl = getExecutablePdfUrl(pdfBlobUrl);
                        if (execUrl) window.open(execUrl, '_blank');
                      }}
                      className="px-3 py-1.5 bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 text-xs font-bold rounded-lg border border-sky-500/40 transition cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>↗️ Abrir en Pestaña Completa / Lector Nativo</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { setPdfBlobUrl(null); setPdfFileName(null); }}
                    className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/30 transition cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar PDF</span>
                  </button>
                </div>
              </div>

              <div className="w-full h-[550px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                {(() => {
                  const execUrl = getExecutablePdfUrl(pdfBlobUrl);
                  if (!execUrl) return null;
                  return (
                    <object data={execUrl} type="application/pdf" className="w-full h-full">
                      <iframe src={execUrl} className="w-full h-full" title="Visor Lector PDF Integrado Abajo" />
                    </object>
                  );
                })()}
              </div>
            </div>
          )}


          {/* Laboratorio de la Semana */}
          {laboratory && (
            <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-800/40 space-y-2">
              <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold uppercase">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span>Laboratorio Semanal de Práctica</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{laboratory.name || 'Laboratorio Cognitivo'}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {laboratory.protocol || laboratory.conditionA || JSON.stringify(laboratory)}
              </p>
            </div>
          )}

          {/* Editor & Visor Markdown de Entregable Prescrito */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
              Redacción del Entregable Obligatorio
            </span>
            <MarkdownEditor
              initialValue={deliverableContent}
              prescriptionTitle={week.productDescription}
              filename={week.productPrescription}
              onSave={handleSaveDeliverable}
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveStep('recall')}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition shadow-md active:scale-95 cursor-pointer"
          >
            Iniciar Recuerdo Activo (Free Recall) →
          </button>
        </section>
      )}

      {/* PASO 3: RECUERDO ACTIVO (RECALL CERRADO) */}
      {activeStep === 'recall' && (
        <section className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex justify-between items-center bg-purple-950/40 p-3.5 rounded-xl border border-purple-800/40">
            <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Modo Recuperación Cerrada (`OWN_EFFORT_REQUIRED`)</span>
            </div>
            <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2.5 py-0.5 rounded-full font-mono border border-purple-500/30">
              Notas & IA Bloqueadas
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Escribe o habla todo lo que recuerdes de las lecturas prescritas **sin mirar tus notas ni consultar la fuente**. Puedes escribir manualmente o usar el micrófono para hablar en voz alta (Técnica Feynman).
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-2 cursor-pointer shadow ${
                isRecordingAudio
                  ? 'bg-rose-600 animate-pulse text-white border-rose-400'
                  : 'bg-purple-900/40 hover:bg-purple-900/70 text-purple-300 border-purple-500/40'
              }`}
            >
              {isRecordingAudio ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-400" />}
              <span>{isRecordingAudio ? '🔴 Grabando Voz (Habla en voz alta)...' : '🎙️ Dictar por Voz (Técnica Feynman)'}</span>
            </button>
          </div>

          <textarea
            rows={8}
            value={freeRecallText}
            onChange={(e) => setFreeRecallText(e.target.value)}
            placeholder="Comienza a escribir o dictar por voz tu recuerdo libre sobre las lecturas..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
          />

          <button
            type="button"
            onClick={handleSubmitAttempt}
            disabled={isSaving || !freeRecallText.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {isSaving ? 'Guardando Intento...' : 'Guardar Intento & Desbloquear Auditoría'}
          </button>

        </section>
      )}

      {/* PASO 4: AUDITORÍA & CLASIFICACIÓN DE ERRORES */}
      {activeStep === 'audit' && (
        <section className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
          {!attemptSubmitted && (
            <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-amber-300 font-bold uppercase">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Auditoría de Errores (`OWN_EFFORT_REQUIRED`)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Para garantizar un aprendizaje real, debes registrar primero tu recuerdo libre sin notas en el **Paso 3**. Sin embargo, también puedes clasificar errores preventivos a continuación:
              </p>
            </div>
          )}

          {/* Tarjeta de Auditoría Pedagógica Inteligente IA */}
          {aiAuditResult && (
            <div className="p-4 bg-gradient-to-br from-purple-950/60 via-slate-950 to-slate-950 border border-purple-800/50 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold uppercase">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Auditoría Pedagógica Post-Esfuerzo</span>
                </div>
                <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded font-mono border border-purple-500/30">
                  Calidad: {aiAuditResult.reconstructionQuality}
                </span>
              </div>

              {aiAuditResult.challengeQuestion && (
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl text-xs space-y-1">
                  <strong className="text-purple-300 font-bold block text-[11px] uppercase">
                    Desafío Advocatus Diaboli (Steelman):
                  </strong>
                  <p className="text-slate-200 italic leading-relaxed">
                    "{aiAuditResult.challengeQuestion}"
                  </p>
                </div>
              )}

              {aiAuditResult.findings.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Sugerencias de Omisión/Error:</span>
                  {aiAuditResult.findings.map((f, i) => (
                    <div key={i} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs flex justify-between items-start gap-2">
                      <div>
                        <strong className="text-amber-400 text-[11px] block">{f.label}</strong>
                        <p className="text-[11px] text-slate-300">{f.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRegisterAuditFinding(f.errorType, f.label)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[10px] font-bold rounded border border-amber-500/30 shrink-0 cursor-pointer"
                      >
                        Aceptar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN AUTO-EXTRACCIÓN NODOS GRAFO 2D */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-sky-400" /> Auto-Extracción para el Grafo 2D
              </span>
              <button
                type="button"
                onClick={handleAutoExtractGraphNodes}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition shadow cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Extraer Nodos
              </button>
            </div>

            {insertedNodesSuccess && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl animate-fadeIn text-center">
                ✓ ¡Nodo guardado exitosamente en tu Grafo 2D en SQLite!
              </div>
            )}

            {suggestedNodes.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] text-slate-400 font-mono block">Nodos conceptuales detectados en tu ensayo/recuerdo:</span>
                {suggestedNodes.map((n, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                        {n.nodeType}
                      </span>
                      <h5 className="font-bold text-slate-100 mt-1">{n.label}</h5>
                      <p className="text-[11px] text-slate-400">{n.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveSuggestedNode(n)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1 shadow"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Guardar al Grafo 2D
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="flex justify-between items-center bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/40">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span>Clasificación de Perfil de Errores</span>
            </div>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              SQLite Activo
            </span>
          </div>


          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Clasifica tus Hallazgos / Perfil de Errores</h3>

          <div className="grid gap-2.5">
            {[
              { type: 'OMISION', label: 'Omisión', desc: 'Falta un concepto o autor clave en tu recuerdo' },
              { type: 'ERROR', label: 'Error Directo', desc: 'Afirmación incorrecta sobre los experimentos o fechas' },
              { type: 'DISTORSION', label: 'Distorsión', desc: 'Definición mal interpretada' },
              { type: 'CONFUSION', label: 'Confusión', desc: 'Mezcla de dos teorías o papers' },
              { type: 'CONEXION_NO_JUSTIFICADA', label: 'Conexión No Justificada', desc: 'Inferencia forzada sin evidencia' },
            ].map((err) => (
              <div key={err.type} className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{err.label}</h4>
                  <p className="text-[10px] text-slate-400">{err.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRegisterAuditFinding(err.type, err.label)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold rounded-lg transition border border-slate-700 cursor-pointer"
                >
                  {auditSaved === err.type ? '✓ Guardado' : '+ Registrar'}
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveStep('exam')}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition active:scale-95 cursor-pointer"
          >
            Continuar a Examen & Calibración →
          </button>
        </section>
      )}

      {/* PASO 5: EXAMEN & CALIBRACIÓN METACOGNITIVA */}
      {activeStep === 'exam' && (
        <section className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-100">Examen & Calibración Metacognitiva</h2>
          <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <strong>Especificación:</strong> {week.examSpecification}
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Resultado Predicho (0 - 100 Puntos):
            </label>
            <input
              type="number"
              value={predictedScore}
              onChange={(e) => setPredictedScore(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-bold"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase">Dimensiones de la Rúbrica Polímata (Max 100)</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Recall (Max 15)</label>
                <input
                  type="number"
                  max={15}
                  value={rubricScores.recallScore}
                  onChange={(e) => setRubricScores({ ...rubricScores, recallScore: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reconstrucción (Max 20)</label>
                <input
                  type="number"
                  max={20}
                  value={rubricScores.reconstructionScore}
                  onChange={(e) => setRubricScores({ ...rubricScores, reconstructionScore: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Precisión (Max 15)</label>
                <input
                  type="number"
                  max={15}
                  value={rubricScores.conceptualPrecisionScore}
                  onChange={(e) => setRubricScores({ ...rubricScores, conceptualPrecisionScore: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transferencia (Max 20)</label>
                <input
                  type="number"
                  max={20}
                  value={rubricScores.transferScore}
                  onChange={(e) => setRubricScores({ ...rubricScores, transferScore: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEvaluateMastery}
            disabled={isSaving}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg active:scale-95 cursor-pointer"
          >
            Calcular Dominio & Programar Revisiones →
          </button>
        </section>
      )}

      {/* PASO 6: RÚBRICA DE DOMINIO RESULTADO */}
      {activeStep === 'mastery' && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-emerald-800/40 space-y-5 text-center shadow-xl">
          <Award className="w-14 h-14 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-100">Evaluación de Dominio (Rúbrica Polímata)</h2>
          
          {masteryResult ? (
            <div className="space-y-4">
              <div className="text-5xl font-black text-emerald-400">{masteryResult.totalScore} / 100</div>
              <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                {masteryResult.status}
              </span>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Las revisiones diferidas (+7, +30, +90, +365 días) han sido programadas automáticamente en tu plan diario.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-xs text-slate-300 leading-relaxed">
                Puedes calcular tu puntaje de dominio (0 - 100 pts) evaluando las 7 dimensiones pedagógicas de Polímata OS:
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                <div>Recall: <strong className="text-emerald-400">{rubricScores.recallScore}/15</strong></div>
                <div>Reconstrucción: <strong className="text-emerald-400">{rubricScores.reconstructionScore}/20</strong></div>
                <div>Precisión: <strong className="text-emerald-400">{rubricScores.conceptualPrecisionScore}/15</strong></div>
                <div>Transferencia: <strong className="text-emerald-400">{rubricScores.transferScore}/20</strong></div>
              </div>

              <button
                type="button"
                onClick={handleEvaluateMastery}
                disabled={isSaving}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg active:scale-95 cursor-pointer"
              >
                {isSaving ? 'Evaluando...' : 'Calcular Dominio Ahora (85 / 100)'}
              </button>
            </div>
          )}

          <Link
            href="/"
            className="inline-block py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700"
          >
            Volver a la Pantalla Hoy
          </Link>
        </section>
      )}

      {/* MODAL FICHA DE LECTURA CON ESTRATEGIA IDD Y VISOR PDF */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => { setSelectedResource(null); setShowPdfViewer(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                {selectedResource.type}
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase">
                {selectedResource.priority || 'NÚCLEO'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100">
              {selectedResource.author} — <em className="text-sky-300 font-normal">{selectedResource.title}</em>
            </h3>

            {/* Estrategia de Lectura (Lectura Completa vs Skill IDD / Inspeccional) */}
            <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
                {selectedResource.whatToStudy && (selectedResource.whatToStudy.toLowerCase().includes('seccion') || selectedResource.whatToStudy.toLowerCase().includes('summary') || selectedResource.whatToStudy.toLowerCase().includes('introduccion')) ? (
                  <>🔍 Estrategia: Lectura Inspeccional / IDD (Inspección & Desglose)</>
                ) : (
                  <>📖 Estrategia: Lectura Completa Obligatoria</>
                )}
              </span>
              <p className="text-[11px] text-slate-300">
                {selectedResource.whatToStudy && (selectedResource.whatToStudy.toLowerCase().includes('seccion') || selectedResource.whatToStudy.toLowerCase().includes('summary') || selectedResource.whatToStudy.toLowerCase().includes('introduccion'))
                  ? 'Aplica la Skill IDD: enfócate en el índice, resumen ejecutivo, introducción y las secciones prescritas sin leer de portada a portada.'
                  : 'Esta obra requiere lectura sistemática de principio a fin según la rúbrica del Canon.'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <strong className="text-slate-200 text-[11px] block uppercase font-bold">Qué Estudiar Exactamente:</strong>
              <p className="leading-relaxed font-mono text-[11px]">{selectedResource.whatToStudy}</p>
            </div>

            {/* Visor PDF Integrado */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> Visor Lector de PDF Integrado
                </span>
                <button
                  type="button"
                  onClick={() => setShowPdfViewer(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg border border-emerald-400/30 transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Abrir Lector a Pantalla Completa
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setSelectedResource(null); setShowPdfViewer(false); }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}

      {/* MODO LECTURA PROFUNDA A PANTALLA COMPLETA (PDF + PREGUNTAS GUÍA & SKILL IDD) */}
      {showPdfViewer && selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col sm:flex-row overflow-hidden">
          {/* Columna Izquierda: Visor PDF amplio */}
          <div className="flex-1 flex flex-col h-full bg-slate-900 border-r border-slate-800">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-100 truncate max-w-xs font-mono">
                  {selectedResource.author} — {selectedResource.title}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg border border-emerald-400/30 flex items-center gap-1 cursor-pointer shadow">
                  <Upload className="w-3.5 h-3.5" />
                  <span>📂 Seleccionar PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleMultiplePdfUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  placeholder="O pega un enlace de PDF web..."
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono w-40 sm:w-56"
                />
                <button
                  type="button"
                  onClick={() => setShowPdfViewer(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                  title="Salir de Pantalla Completa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-2 overflow-hidden">
              {(pdfBlobUrl || pdfUrl) ? (
                <iframe src={pdfBlobUrl || pdfUrl} className="w-full h-full rounded-lg border border-slate-800" title="Visor PDF" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-3 p-6 text-center">
                  <FileText className="w-12 h-12 text-slate-600" />
                  <p className="font-bold text-slate-300 text-sm">Modo Lectura Enfocada Activo</p>
                  <p className="max-w-md text-slate-400 text-xs">
                    Haz clic en <strong className="text-emerald-300">📂 Seleccionar PDF</strong> arriba para abrir cualquier archivo PDF de tu computadora o teléfono.
                  </p>
                  <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl border border-emerald-400/30 flex items-center gap-2 cursor-pointer shadow-lg active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Seleccionar Archivo PDF Ahora</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleMultiplePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

          </div>

          {/* Columna Derecha (Panel de Orientación Pedagógica & Skill IDD) */}
          <div className="w-full sm:w-80 md:w-96 bg-slate-900 p-4 space-y-4 overflow-y-auto border-t sm:border-t-0 sm:border-l border-slate-800 shrink-0">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Panel de Guiado Pedagógico
              </span>
              <button
                type="button"
                onClick={() => setShowPdfViewer(false)}
                className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            {/* Estrategia de Lectura & Skill IDD */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Estrategia / Skill IDD Prescrita:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {selectedResource.whatToStudy}
              </p>
            </div>

            {/* EXTRACTOR DE CITAS AL BORRADOR MARKDOWN */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <Quote className="w-3.5 h-3.5 text-emerald-400" /> Extractor de Citas al Borrador
              </span>
              <textarea
                rows={3}
                placeholder="Copia/pega o escribe aquí un fragmento relevante del PDF..."
                value={pdfQuoteText}
                onChange={(e) => setPdfQuoteText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
              <button
                type="button"
                onClick={handleInsertPdfQuoteToDeliverable}
                disabled={!pdfQuoteText.trim()}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Insertar Cita en Entregable .MD
              </button>
            </div>


            {/* Preguntas Guía de la Semana */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Preguntas a Responder Durante la Lectura:
              </span>
              <div className="space-y-2">
                {guideQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 text-xs text-slate-300 space-y-1">
                    <strong className="text-sky-400 text-[10px] block font-mono">Pregunta {idx + 1}:</strong>
                    <p className="leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
