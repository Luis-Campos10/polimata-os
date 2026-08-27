'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, FileText, Download, ExternalLink } from 'lucide-react';

interface MobilePdfViewerProps {
  pdfUrl: string; // Base64 data:application/pdf;base64,... o Blob URL
  fileName?: string;
  onClose?: () => void;
}

export default function MobilePdfCanvasViewer({ pdfUrl, fileName = 'Documento PDF', onClose }: MobilePdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Cargar PDF.js dinámicamente desde CDN si no existe en window
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

        // Cargar documento PDF desde Data URL o Blob URL
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
          setErrorMessage('No se pudo renderizar el PDF en el visor nativo. Haz clic en "Abrir Lector Externo" abajo.');
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

  // Renderizar la página actual en el Canvas de HTML5
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

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* BARRA SUPERIOR DE HERRAMIENTAS MÓVILES */}
      <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 shrink-0 text-xs">
        <div className="flex items-center space-x-2 truncate max-w-[180px] sm:max-w-xs">
          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-slate-200 font-mono truncate text-[11px]">{fileName}</span>
        </div>

        {/* NAVEGACIÓN Y ZOOM DE PÁGINAS */}
        <div className="flex items-center space-x-1 font-mono text-[11px]">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded cursor-pointer"
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

      {/* ÁREA PRINCIPAL CANVAS DE DIBUJO DE PÁGINAS PDF */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-start justify-center bg-slate-900/90 relative min-h-[350px]">
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
              Abrir PDF en Lector Externo
            </button>
          </div>
        ) : (
          <div className="shadow-2xl rounded border border-slate-800 overflow-hidden bg-white max-w-full">
            <canvas ref={canvasRef} className="max-w-full block h-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
