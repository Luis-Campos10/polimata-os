'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, ExternalLink, Moon, BookOpen, Search, Sparkles } from 'lucide-react';

interface MobilePdfViewerProps {
  pdfUrl: string; // Base64 data:application/pdf;base64,... o Blob URL
  fileName?: string;
  onClose?: () => void;
}

export default function MobilePdfCanvasViewer({ pdfUrl, fileName = 'Documento PDF', onClose }: MobilePdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textLayerRef = useRef<HTMLDivElement | null>(null);

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Estados Adicionales de UX Móvil
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [showDictionaryPopup, setShowDictionaryPopup] = useState<boolean>(false);

  // Cargar PDF.js dinámicamente desde CDN
  useEffect(() => {
    let isMounted = true;

    const loadPdfJs = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('No se pudo cargar la librería PDF.js'));
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        if (isMounted) {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setCurrentPage(1);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Error al renderizar PDF en Canvas Android:', err);
        if (isMounted) {
          setErrorMessage('No se pudo renderizar el PDF en el visor nativo. Haz clic en "Pestaña Completa".');
          setIsLoading(false);
        }
      }
    };

    if (pdfUrl) {
      loadPdfJs();
    }

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  // Renderizar la página actual en Canvas + Capa de Texto
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;

        // Renderizar Capa de Texto para permitir la selección de palabras táctil
        if (textLayerRef.current && (window as any).pdfjsLib) {
          const textLayerDiv = textLayerRef.current;
          textLayerDiv.innerHTML = '';
          textLayerDiv.style.height = `${viewport.height}px`;
          textLayerDiv.style.width = `${viewport.width}px`;

          const textContent = await page.getTextContent();
          const pdfjsLib = (window as any).pdfjsLib;

          if (pdfjsLib.renderTextLayer) {
            pdfjsLib.renderTextLayer({
              textContent: textContent,
              container: textLayerDiv,
              viewport: viewport,
              textDivs: []
            });
          }
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Error al dibujar página en canvas:', err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale]);

  // Capturar gestos táctiles de deslizamiento (Swipe Left / Swipe Right)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance && currentPage < numPages) {
      // Deslizar a la izquierda -> Página Siguiente
      setCurrentPage((p) => Math.min(numPages, p + 1));
    } else if (distance < -minSwipeDistance && currentPage > 1) {
      // Deslizar a la derecha -> Página Anterior
      setCurrentPage((p) => Math.max(1, p - 1));
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Capturar selección de texto táctil para abrir Diccionario al instante
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text.length > 1) {
        setSelectedWord(text);
        setShowDictionaryPopup(true);
      }
    }
  };

  const triggerDictionaryLookup = (word: string) => {
    window.dispatchEvent(new CustomEvent('polimata_search_word', { detail: word }));
    setShowDictionaryPopup(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* BARRA SUPERIOR DE HERRAMIENTAS MÓVILES */}
      <div className="p-2 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 shrink-0 text-xs">
        <div className="flex items-center space-x-2 truncate max-w-[150px] sm:max-w-xs">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-slate-200 font-mono truncate text-[11px]">{fileName}</span>
        </div>

        {/* CONTROLES DE NAVEGACIÓN Y MODO NOCHE */}
        <div className="flex items-center space-x-1 font-mono text-[11px]">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded cursor-pointer"
            title="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 text-sky-300 font-bold">
            {currentPage} / {numPages || '--'}
          </span>

          <button
            type="button"
            disabled={currentPage >= numPages || isLoading}
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded cursor-pointer"
            title="Página Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
            title="Reducir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setNightMode(!nightMode)}
            className={`p-1 rounded cursor-pointer border transition ${
              nightMode
                ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Invertir colores a Modo Noche"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => window.open(pdfUrl, '_blank')}
          className="px-2 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 text-[10px] font-bold rounded border border-sky-500/40 cursor-pointer flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="hidden sm:inline">Pestaña Completa</span>
        </button>
      </div>

      {/* AVISO DESLIZAMIENTO TÁCTIL (GESTO SWIPE) */}
      <div className="bg-slate-900/90 text-slate-400 text-[10px] py-1 px-3 border-b border-slate-800 text-center font-mono flex items-center justify-between shrink-0">
        <span>👈 Desliza hacia los lados para pasar de hoja 👉</span>

        <div className="flex items-center space-x-1">
          <BookOpen className="w-3 h-3 text-purple-400" />
          <input
            type="text"
            placeholder="🔍 Buscar palabra..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                triggerDictionaryLookup(e.currentTarget.value.trim());
              }
            }}
            className="bg-slate-950 border border-purple-500/40 rounded px-1.5 py-0.5 text-[10px] text-slate-100 font-mono w-28 focus:outline-none"
          />
        </div>
      </div>

      {/* ÁREA PRINCIPAL CANVAS PDF CON SOPORTE GESTOS Y CAPA DE TEXTO */}
      <div
        className="flex-1 overflow-auto p-2 sm:p-4 flex items-start justify-center bg-slate-900/90 relative min-h-[380px] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleTextSelection}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-sky-400 text-xs space-y-2 z-10">
            <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="font-bold font-mono">Renderizando PDF en pantalla móvil...</span>
          </div>
        )}

        {errorMessage ? (
          <div className="p-6 text-center space-y-3 max-w-sm">
            <p className="text-xs text-rose-300 font-bold">{errorMessage}</p>
            <button
              type="button"
              onClick={() => window.open(pdfUrl, '_blank')}
              className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Abrir PDF en Lector Nativo
            </button>
          </div>
        ) : (
          <div
            className={`shadow-2xl rounded border border-slate-800 overflow-hidden relative max-w-full transition-all duration-300 ${
              nightMode ? 'invert contrast-125 bg-black' : 'bg-white'
            }`}
          >
            <canvas ref={canvasRef} className="max-w-full block h-auto" />
            <div
              ref={textLayerRef}
              className="absolute inset-0 textLayer opacity-25 select-text pointer-events-auto"
            />
          </div>
        )}
      </div>

      {/* POPUP AUTOMÁTICO AL SELECCIONAR O TOCAR UNA PALABRA */}
      {showDictionaryPopup && selectedWord && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[99999] bg-gradient-to-r from-purple-900 to-sky-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-purple-400/50 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Definir "<strong className="text-amber-300">{selectedWord}</strong>"</span>
          <button
            type="button"
            onClick={() => triggerDictionaryLookup(selectedWord)}
            className="px-3 py-1 bg-white text-purple-950 rounded-full text-[11px] font-extrabold hover:bg-slate-100 shadow cursor-pointer"
          >
            Buscar en Diccionario
          </button>
          <button
            type="button"
            onClick={() => setShowDictionaryPopup(false)}
            className="text-slate-300 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
