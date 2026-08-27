'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Moon, BookOpen, Search, Sparkles, RotateCw, Maximize, Minimize, HelpCircle, Quote, X } from 'lucide-react';

interface MobilePdfViewerProps {
  pdfUrl: string; // Base64 data:application/pdf;base64,... o Blob URL
  fileName?: string;
  onOpenDictionary?: () => void;
  onOpenQuestions?: () => void;
  onOpenExtractor?: () => void;
  onClose?: () => void;
}

export default function MobilePdfCanvasViewer({
  pdfUrl,
  fileName = 'Documento PDF',
  onOpenDictionary,
  onOpenQuestions,
  onOpenExtractor,
  onClose
}: MobilePdfViewerProps) {
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
  const [showSelectionPopup, setShowSelectionPopup] = useState<boolean>(false);
  const [isLandscapeForced, setIsLandscapeForced] = useState<boolean>(false);

  // Restaurar página guardada en localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && fileName) {
        const savedPage = localStorage.getItem(`polimata_pdf_page_${fileName}`);
        if (savedPage) {
          const pageNum = parseInt(savedPage, 10);
          if (!isNaN(pageNum) && pageNum > 0) {
            setCurrentPage(pageNum);
          }
        }
      }
    } catch (e) {}
  }, [fileName]);

  // Guardar página actual en localStorage al cambiar de página
  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    try {
      if (typeof window !== 'undefined' && fileName) {
        localStorage.setItem(`polimata_pdf_page_${fileName}`, newPage.toString());
      }
    } catch (e) {}
  };

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
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Error al renderizar PDF en Canvas Android:', err);
        if (isMounted) {
          setErrorMessage('No se pudo renderizar el PDF en el visor nativo. Intenta recargar la página.');
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

        const currentScale = isLandscapeForced ? scale * 1.3 : scale;
        const viewport = page.getViewport({ scale: currentScale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;

        // Renderizar Capa de Texto
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
  }, [pdfDoc, currentPage, scale, isLandscapeForced]);

  // Forzar Modo Horizontal con Fullscreen API + Screen Orientation + CSS Fallback
  const toggleScreenOrientation = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }

      if (window.screen && (window.screen as any).orientation && (window.screen as any).orientation.lock) {
        const orientation = (window.screen as any).orientation;
        if (orientation.type.includes('portrait')) {
          await orientation.lock('landscape').catch(() => {});
        } else {
          await orientation.lock('portrait').catch(() => {});
        }
      }
    } catch (e) {}

    // Fallback de expansión de ancho horizontal CSS
    setIsLandscapeForced((prev) => !prev);
  };

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
      changePage(Math.min(numPages, currentPage + 1));
    } else if (distance < -minSwipeDistance && currentPage > 1) {
      changePage(Math.max(1, currentPage - 1));
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Capturar selección de texto táctil
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text.length > 1) {
        setSelectedWord(text);
        setShowSelectionPopup(true);
      }
    }
  };

  const triggerDictionaryLookup = (word: string) => {
    window.dispatchEvent(new CustomEvent('polimata_search_word', { detail: word }));
    setShowSelectionPopup(false);
  };

  const triggerQuoteExtraction = (text: string) => {
    window.dispatchEvent(new CustomEvent('polimata_extract_quote', { detail: text }));
    setShowSelectionPopup(false);
    if (onOpenExtractor) onOpenExtractor();
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* BARRA SUPERIOR DE HERRAMIENTAS: DICCIONARIO, PREGUNTAS, EXTRACTOR, MODO NOCHE, GIRAR */}
      <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 shrink-0 text-xs">
        
        {/* TITULO Y PÁGINA */}
        <div className="flex items-center space-x-2 truncate max-w-[140px] sm:max-w-xs">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-slate-200 font-mono truncate text-[11px]">{fileName}</span>
        </div>

        {/* NAVEGACIÓN DE PÁGINAS Y ZOOM */}
        <div className="flex items-center space-x-1 font-mono text-[11px]">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => changePage(Math.max(1, currentPage - 1))}
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
            onClick={() => changePage(Math.min(numPages, currentPage + 1))}
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
            onClick={toggleScreenOrientation}
            className={`px-2 py-1 font-bold rounded border cursor-pointer flex items-center gap-1 text-[10px] transition ${
              isLandscapeForced
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Girar Pantalla Horizontal"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isLandscapeForced ? 'Horizontal Activo' : 'Girar Horizontal'}</span>
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

        {/* BOTONES DIRECTOS: DICCIONARIO, PREGUNTAS, EXTRACTOR */}
        <div className="flex items-center space-x-1.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => {
              if (onOpenDictionary) onOpenDictionary();
              else window.dispatchEvent(new CustomEvent('polimata_search_word', { detail: ' ' }));
            }}
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition flex items-center gap-1 shadow cursor-pointer text-[10px]"
            title="Abrir Diccionario"
          >
            <BookOpen className="w-3 h-3" />
            <span>Diccionario</span>
          </button>

          {onOpenQuestions && (
            <button
              type="button"
              onClick={onOpenQuestions}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition flex items-center gap-1 shadow cursor-pointer text-[10px]"
              title="Ver Preguntas Guía"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Preguntas</span>
            </button>
          )}

          {onOpenExtractor && (
            <button
              type="button"
              onClick={onOpenExtractor}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1 shadow cursor-pointer text-[10px]"
              title="Abrir Extractor de Citas"
            >
              <Quote className="w-3 h-3" />
              <span>Extractor</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-500/30 cursor-pointer"
              title="Cerrar Lector"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* AVISO DE DESLIZAMIENTO TÁCTIL Y BUSCADOR DIRECTO */}
      <div className="bg-slate-900/95 text-slate-400 text-[10px] py-1 px-3 border-b border-slate-800 text-center font-mono flex items-center justify-between shrink-0">
        <span>👈 Desliza para cambiar página 👉</span>

        <div className="flex items-center space-x-1">
          <BookOpen className="w-3 h-3 text-purple-400" />
          <input
            type="text"
            placeholder="📖 Definir palabra..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                triggerDictionaryLookup(e.currentTarget.value.trim());
              }
            }}
            className="bg-slate-950 border border-purple-500/40 rounded px-1.5 py-0.5 text-[10px] text-slate-100 font-mono w-28 sm:w-36 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* ÁREA PRINCIPAL CANVAS PDF */}
      <div
        className="flex-1 overflow-auto p-2 sm:p-4 flex items-start justify-center bg-slate-900/90 relative min-h-[420px] touch-pan-y"
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

      {/* POPUP FLOTANTE DE OPCIONES AL SELECCIONAR TEXTO */}
      {showSelectionPopup && selectedWord && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[99999] bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-purple-400/50 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="truncate max-w-[120px]">"{selectedWord}"</span>

          <button
            type="button"
            onClick={() => triggerDictionaryLookup(selectedWord)}
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-[10px] font-extrabold shadow cursor-pointer flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Diccionario</span>
          </button>

          <button
            type="button"
            onClick={() => triggerQuoteExtraction(selectedWord)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-extrabold shadow cursor-pointer flex items-center gap-1"
          >
            <Quote className="w-3 h-3" />
            <span>Citar</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSelectionPopup(false)}
            className="text-slate-400 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
