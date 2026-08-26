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
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setCoords(null);
        setSelectedWord('');
        return;
      }

      const text = selection.toString().trim();
      // Filtrar a palabras individuales o frases de 1 a 3 palabras
      if (text.length > 1 && text.length < 50 && text.split(/\s+/).length <= 3) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setCoords({
          x: Math.max(10, Math.min(window.innerWidth - 180, rect.left + rect.width / 2 - 80)),
          y: Math.max(10, rect.top - 45 + window.scrollY),
        });
        setSelectedWord(text);
      } else {
        setCoords(null);
        setSelectedWord('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  if (!coords || !selectedWord) return null;

  return (
    <div
      style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
      className="absolute z-50 animate-bounce cursor-pointer"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSearchWord(selectedWord);
          setCoords(null);
        }}
        className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white text-xs font-bold rounded-full shadow-2xl border border-purple-300/40 flex items-center gap-1.5 active:scale-95 transition"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
        <span>📖 Definir "{selectedWord.length > 15 ? selectedWord.slice(0, 15) + '...' : selectedWord}"</span>
      </button>
    </div>
  );
}
