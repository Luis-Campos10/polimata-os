'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  X,
  Sparkles,
  Layers,
  GitBranch,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Canon 170' | 'Fase 0' | '18 Preguntas' | 'Glosario' | 'Argumentos';
  url: string;
  description: string;
  keywords?: string;
  badge?: string;
}

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [database, setDatabase] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Escuchar atajo global Ctrl+K / Cmd+K
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

  // Enfocar input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadFullCatalog();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Cargar catálogo completo desde la API
  const loadFullCatalog = async () => {
    if (database.length > 0) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/sync/all-content');
      const json = await res.json();
      if (json.success && json.data) {
        const items: SearchItem[] = [];

        // 1. Fase 0 (16 Semanas)
        if (Array.isArray(json.data.weeks)) {
          json.data.weeks.forEach((w: any) => {
            items.push({
              id: `WEEK_${w.id}`,
              title: `Semana ${w.weekNumber}: ${w.title}`,
              subtitle: `Fase 0 · ${w.targetHours || 'Aprender a Aprender'}`,
              category: 'Fase 0',
              url: `/ruta/fase-0/${w.id}`,
              description: w.purpose || 'Semana núcleo de formación metacognitiva.',
              keywords: `${w.title} ${w.purpose || ''} semana ${w.weekNumber}`,
              badge: `S${w.weekNumber}`,
            });
          });
        }

        // 2. Canon 170 Obras
        if (Array.isArray(json.data.works)) {
          json.data.works.forEach((w: any) => {
            const period = w.badgeText || w.historicalPeriod || (w.historicalYear ? `Año ${w.historicalYear}` : `Año ${w.year}`);
            items.push({
              id: `WORK_${w.id || w.workNumber}`,
              title: `Obra #${w.workNumber}: ${w.title}`,
              subtitle: `${w.author} · ${period}`,
              category: 'Canon 170',
              url: `/ruta?work=${w.id || 'WORK_' + String(w.workNumber).padStart(3, '0')}`,
              description: w.prescribedReading || `Nivel ${w.level || 'B'} · Canon Interdisciplinario`,
              keywords: `${w.title} ${w.author} obra ${w.workNumber} año ${w.year} ${period}`,
              badge: `#${w.workNumber}`,
            });
          });
        }

        // 3. 18 Grandes Preguntas
        if (Array.isArray(json.data.questions)) {
          json.data.questions.forEach((q: any) => {
            items.push({
              id: `Q_${q.id}`,
              title: `Q${q.number}: ${q.title}`,
              subtitle: `Gran Pregunta Filosófica #${q.number}`,
              category: '18 Preguntas',
              url: `/saber?q=${q.id}`,
              description: q.description || '',
              keywords: `pregunta ${q.number} ${q.title} ${q.description}`,
              badge: `Q${q.number}`,
            });
          });
        }

        // 4. Glosario de Conceptos
        if (Array.isArray(json.data.glossary)) {
          json.data.glossary.forEach((g: any) => {
            items.push({
              id: `GLOSS_${g.id}`,
              title: `Concepto: ${g.term}`,
              subtitle: `Glosario · ${g.category || 'General'}`,
              category: 'Glosario',
              url: `/saber`,
              description: g.definition || '',
              keywords: `${g.term} ${g.definition} ${g.category}`,
              badge: 'Glosario',
            });
          });
        }

        // 5. Árboles de Argumentos Lógicos
        if (Array.isArray(json.data.argumentTrees)) {
          json.data.argumentTrees.forEach((t: any) => {
            items.push({
              id: `TREE_${t.id}`,
              title: `Árbol Lógico: ${t.title}`,
              subtitle: `${t.authorOrSource ? 'Fuente: ' + t.authorOrSource : 'Deducción propia'}`,
              category: 'Argumentos',
              url: `/saber`,
              description: t.thesisStatement || 'Estructura silogística y premisas.',
              keywords: `${t.title} ${t.thesisStatement} argumento silogismo`,
              badge: 'Árbol',
            });
          });
        }

        setDatabase(items);
      }
    } catch (e) {
      console.warn('No se pudo cargar el catálogo de búsqueda completo:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado reactivo
  const filteredResults = useMemo(() => {
    let list = database;
    if (selectedCategory !== 'Todos') {
      list = list.filter((i) => i.category === selectedCategory);
    }
    const q = query.trim().toLowerCase();
    if (!q) {
      return list.slice(0, 15);
    }
    return list
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          (item.keywords && item.keywords.toLowerCase().includes(q))
      )
      .slice(0, 40);
  }, [database, query, selectedCategory]);

  // Manejo de flechas del teclado y Enter
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].url);
      }
    }
  };

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  const categories = ['Todos', 'Canon 170', 'Fase 0', '18 Preguntas', 'Glosario', 'Argumentos'];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Fase 0':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Canon 170':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case '18 Preguntas':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Glosario':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Argumentos':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <>
      {/* Botón flotante accesible desde móvil o desktop */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 p-3 bg-sky-600 hover:bg-sky-500 text-white rounded-full shadow-2xl transition-all border border-sky-400/40 flex items-center gap-2 cursor-pointer active:scale-95 group shadow-sky-950/80"
        title="Buscador Universal (Ctrl+K)"
        aria-label="Abrir buscador global"
      >
        <Search className="w-5 h-5 group-hover:rotate-6 transition-transform" />
        <span className="hidden sm:inline text-xs font-bold font-mono pr-1">Buscar (Ctrl+K)</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-20 p-3 sm:p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 space-y-3 shadow-2xl relative flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownList}
          >
            {/* Barra de entrada de búsqueda */}
            <div className="flex items-center space-x-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 focus-within:border-sky-500/50 shadow-inner">
              <Search className="w-5 h-5 text-sky-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Busca por autor (Aristóteles, Kahneman), obra, semana, pregunta o concepto..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas de filtrado por categoría */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedIndex(0);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition text-xs border ${
                    selectedCategory === cat
                      ? 'bg-sky-600/30 text-sky-300 border-sky-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Lista de Resultados con Scroll */}
            <div ref={listRef} className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {isLoading && database.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Indexando 170 obras, semanas, preguntas y glosario...</span>
                </div>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.url)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex justify-between items-center group ${
                        isSelected
                          ? 'bg-sky-950/40 border-sky-600/50 text-sky-100'
                          : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800/80'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 min-w-0 pr-3">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getCategoryBadgeClass(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition truncate">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] font-medium text-sky-400/90 truncate">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected
                            ? 'text-sky-400 translate-x-1'
                            : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 space-y-1 text-slate-500">
                  <p className="text-xs">No se encontraron resultados para &quot;{query}&quot;</p>
                  <p className="text-[11px] text-slate-600">
                    Prueba buscando &quot;Popper&quot;, &quot;Memoria&quot;, &quot;Q03&quot; o &quot;Glosario&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Pie de diálogo con atajos y conteo */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2 px-1">
              <div className="flex items-center space-x-2">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                    ↑↓
                  </kbd>{' '}
                  navegar
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                    Enter
                  </kbd>{' '}
                  abrir
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                    Esc
                  </kbd>{' '}
                  cerrar
                </span>
              </div>
              <span className="text-sky-400/80 font-bold">
                {database.length > 0 ? `${database.length} elementos indexados` : 'Polímata OS'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
