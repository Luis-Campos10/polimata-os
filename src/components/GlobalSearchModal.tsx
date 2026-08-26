'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, HelpCircle, FileText, X, Sparkles, Command } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: 'Fase 0' | 'Canon 170' | 'Gran Pregunta' | 'Grafo';
  url: string;
  description: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  { id: 'W01', title: 'Semana 1: Qué Significa Aprender', category: 'Fase 0', url: '/ruta/fase-0/W01', description: 'Metacognición, recuerdo activo, ilusión de dominio.' },
  { id: 'W02', title: 'Semana 2: Atención y Memoria de Trabajo', category: 'Fase 0', url: '/ruta/fase-0/W02', description: 'Carga cognitiva, límites de la memoria de trabajo.' },
  { id: 'W03', title: 'Semana 3: Codificación Profunda y Elaboración', category: 'Fase 0', url: '/ruta/fase-0/W03', description: 'Modelos mentales, auto-explicación, elaboración.' },
  { id: 'W04', title: 'Semana 4: Recuperación Activa y Práctica Distribuida', category: 'Fase 0', url: '/ruta/fase-0/W04', description: 'Algoritmo FSRS-4.5, intervalos óptimos de repetición.' },
  { id: 'Q01', title: 'Q01: ¿De dónde vienen universo, Tierra, vida y nosotros?', category: 'Gran Pregunta', url: '/saber?q=Q01', description: 'Origen del universo, física y cosmología.' },
  { id: 'Q03', title: 'Q03: ¿Qué podemos conocer y qué es verdad?', category: 'Gran Pregunta', url: '/saber?q=Q03', description: 'Epistemología, criterio de demarcación, Popper.' },
  { id: 'Q10', title: 'Q10: ¿Qué es vivir bien?', category: 'Gran Pregunta', url: '/saber?q=Q10', description: 'Ética nicomáquea, estoicismo, eudaimonía.' },
  { id: 'Q15', title: 'Q15: ¿Cómo funciona la ciencia y cuáles son sus límites?', category: 'Gran Pregunta', url: '/saber?q=Q15', description: 'Filosofía de la ciencia, paradigmas de Kuhn.' },
  { id: 'C01', title: 'Aristóteles — Ética Nicomáquea', category: 'Canon 170', url: '/ruta?work=C01', description: 'Año 1 · Filosofía moral y virtud.' },
  { id: 'C02', title: 'Karl Popper — La lógica de la investigación científica', category: 'Canon 170', url: '/ruta?work=C02', description: 'Año 1 · Falsacionismo y método.' },
  { id: 'C03', title: 'Thomas Kuhn — La estructura de las revoluciones científicas', category: 'Canon 170', url: '/ruta?work=C03', description: 'Año 1 · Paradigmas y cambio científico.' },
  { id: 'C04', title: 'Daniel Kahneman — Pensar rápido, pensar despacio', category: 'Canon 170', url: '/ruta?work=C04', description: 'Año 1 · Sistema 1 vs Sistema 2 y sesgos.' },
];

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = query.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_DATABASE.slice(0, 5);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <>
      {/* Botón flotante rápido o activador Ctrl+K */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 p-3 bg-sky-600 hover:bg-sky-500 text-white rounded-full shadow-2xl transition border border-sky-400/40 flex items-center gap-2 cursor-pointer active:scale-95 group"
        title="Buscar en todo Polímata OS (Ctrl+K)"
      >
        <Search className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold font-mono">Buscar (Ctrl+K)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-4 space-y-4 shadow-2xl relative">
            <div className="flex items-center space-x-3 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Busca semanas, obras del Canon, 18 preguntas o conceptos (Ctrl+K)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="p-3 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl border border-slate-800 transition cursor-pointer flex justify-between items-center group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                            item.category === 'Fase 0'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                              : item.category === 'Canon 170'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">No se encontraron resultados para "{query}"</p>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2 px-1">
              <span>Presiona <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Esc</kbd> para cerrar</span>
              <span>Polímata OS 2.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
