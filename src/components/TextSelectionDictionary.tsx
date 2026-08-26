'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface TextSelectionDictionaryProps {
  onSearchWord: (word: string) => void;
}

export default function TextSelectionDictionary({ onSearchWord }: TextSelectionDictionaryProps) {
  const [selectedWord, setSelectedWord] = useState('');
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let timeoutId: any = null;

    const checkSelection = () => {
      if (typeof window === 'undefined') return;
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed) {
        setCoords(null);
        setSelectedWord('');
        return;
      }

      const text = selection.toString().trim();
      // Limpiar puntuación inicial/final
      const cleanWord = text.replace(/^[^\wáéíóúñÁÉÍÓÚÑ]+|[^\wáéíóúñÁÉÍÓÚÑ]+$/g, '');

      if (cleanWord.length >= 2 && cleanWord.length <= 40 && cleanWord.split(/\s+/).length <= 2) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            setCoords({
              x: Math.max(10, Math.min(window.innerWidth - 170, rect.left + rect.width / 2 - 75)),
              y: Math.max(10, rect.top - 50 + window.scrollY),
            });
            setSelectedWord(cleanWord);
          }
        } catch (e) {
          // Ignorar errores de selección fuera de ventana
        }
      }
    };

    const handleDeferredSelection = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSelection, 200);
    };

    // Escuchar eventos táctiles en celulares (touchend), ratón (mouseup), doble clic y cambio de selección
    document.addEventListener('selectionchange', handleDeferredSelection);
    document.addEventListener('mouseup', handleDeferredSelection);
    document.addEventListener('touchend', handleDeferredSelection);
    document.addEventListener('dblclick', handleDeferredSelection);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('selectionchange', handleDeferredSelection);
      document.removeEventListener('mouseup', handleDeferredSelection);
      document.removeEventListener('touchend', handleDeferredSelection);
      document.removeEventListener('dblclick', handleDeferredSelection);
    };
  }, []);

  if (!coords || !selectedWord) return null;

  return (
    <div
      style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
      className="fixed z-[9999] animate-bounce cursor-pointer pointer-events-auto"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSearchWord(selectedWord);
          setCoords(null);
          setSelectedWord('');
        }}
        className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white text-xs font-bold rounded-full shadow-2xl border-2 border-purple-300/60 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
      >
        <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
        <span>📖 Definir "{selectedWord.length > 12 ? selectedWord.slice(0, 12) + '...' : selectedWord}"</span>
      </button>
    </div>
  );
}
