'use client';

import { useState, useEffect } from 'react';
import { BookMarked, Search, Plus, Trash2, X, Sparkles, Brain, CheckCircle2, RotateCw, ChevronRight, Layers } from 'lucide-react';
import TextSelectionDictionary from './TextSelectionDictionary';

interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  etymology?: string | null;
  category: string;
  example?: string | null;
  createdAt: string;
}

export default function DictionaryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<GlossaryItem | null>(null);
  const [userGlossary, setUserGlossary] = useState<GlossaryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // MODO FLASHCARDS EN EL DICCIONARIO
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchUserGlossary = async () => {
    try {
      const res = await fetch('/api/glossary');
      const data = await res.json();
      if (data.success) {
        setUserGlossary(data.glossary || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserGlossary();
    }
  }, [isOpen]);

  const searchSpecificWord = async (wordToSearch: string) => {
    if (!wordToSearch.trim()) return;
    setQuery(wordToSearch);
    setIsOpen(true);
    setIsSearching(true);
    try {
      const res = await fetch(`/api/glossary?q=${encodeURIComponent(wordToSearch)}`);
      const data = await res.json();
      if (data.success && data.result) {
        setSearchResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchWord = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    await searchSpecificWord(query);
  };

  const handleSaveToGlossary = async (itemToSave?: GlossaryItem) => {
    const item = itemToSave || searchResult;
    if (!item) return;

    try {
      const res = await fetch('/api/glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: item.term,
          definition: item.definition,
          etymology: item.etymology,
          category: item.category,
          example: item.example
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
        fetchUserGlossary();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFromGlossary = async (id: string) => {
    try {
      const res = await fetch(`/api/glossary?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchUserGlossary();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentFlashcard = userGlossary[currentCardIndex] || null;

  return (
    <>
      {/* COMPONENTE DE SELECCIÓN DE TEXTO AL LEER EN CUALQUIER PARTE */}
      <TextSelectionDictionary onSearchWord={searchSpecificWord} />

      {/* BOTÓN FLOTANTE DICCIONARIO & GLOSARIO */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl transition border border-purple-400/40 flex items-center gap-2 cursor-pointer active:scale-95 group"
        title="Diccionario & Glosario Personal"
      >
        <BookMarked className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold font-mono">Diccionario & Glosario</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <BookMarked className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-slate-100">Diccionario Interdisciplinario & Glosario</h3>
            </div>

            {/* BARRA DE BÚSQUEDA DEL DICCIONARIO */}
            <form onSubmit={handleSearchWord} className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe una palabra o concepto (ej: alma, ciencia, epistemología, eudaimonía)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
              </button>
            </form>

            {/* RESULTADO DE BÚSQUEDA */}
            {searchResult && (
              <div className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/30 font-bold uppercase">
                      {searchResult.category}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-1">{searchResult.term}</h4>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleSaveToGlossary()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Guardar a mi Glosario</span>
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  {searchResult.definition}
                </p>

                {searchResult.etymology && (
                  <p className="text-[11px] text-amber-300 italic">
                    📌 <strong>Etimología:</strong> {searchResult.etymology}
                  </p>
                )}
              </div>
            )}

            {savedSuccess && (
              <div className="p-3 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-500/40 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>¡Palabra guardada exitosamente en tu Glosario Personal SQLite!</span>
              </div>
            )}

            {/* SECCIÓN MODO FLASHCARDS */}
            {showFlashcards && userGlossary.length > 0 ? (
              <div className="p-5 bg-slate-950 border border-purple-800/60 rounded-2xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> Tarjetas de Memoria FSRS ({currentCardIndex + 1} / {userGlossary.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFlashcards(false)}
                    className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    Volver al Glosario ✕
                  </button>
                </div>

                {currentFlashcard && (
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/40 rounded-2xl min-h-[160px] flex flex-col justify-center items-center text-center cursor-pointer transition-all hover:scale-[1.01] shadow-2xl space-y-2"
                  >
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-bold px-2 py-0.5 bg-purple-500/20 rounded border border-purple-500/30">
                      {isFlipped ? 'Respuesta & Definición' : 'Frente (Pregunta / Concepto)'}
                    </span>

                    {!isFlipped ? (
                      <h3 className="text-lg font-black text-slate-100 tracking-wide">{currentFlashcard.term}</h3>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-200 font-mono leading-relaxed">{currentFlashcard.definition}</p>
                        {currentFlashcard.etymology && (
                          <p className="text-[11px] text-amber-300 italic">{currentFlashcard.etymology}</p>
                        )}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono pt-2">
                      (Toca la tarjeta para voltear)
                    </span>
                  </div>
                )}

                {/* BOTONES DE REPASO FSRS */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: 'Repetir', days: '1d', color: 'bg-rose-600/30 text-rose-300 border-rose-500/40 hover:bg-rose-600/50' },
                    { label: 'Difícil', days: '3d', color: 'bg-amber-600/30 text-amber-300 border-amber-500/40 hover:bg-amber-600/50' },
                    { label: 'Bueno', days: '7d', color: 'bg-sky-600/30 text-sky-300 border-sky-500/40 hover:bg-sky-600/50' },
                    { label: 'Fácil', days: '15d', color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/50' },
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIndex((prev) => (prev + 1) % userGlossary.length);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${btn.color}`}
                    >
                      <span>{btn.label}</span>
                      <span className="text-[9px] opacity-80 font-mono">{btn.days}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* VISTA LISTA DE GLOSARIO PERSONAL */
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 uppercase">
                    <Layers className="w-4 h-4 text-purple-400" /> Mi Glosario Personal ({userGlossary.length} Términos)
                  </h4>
                  
                  {userGlossary.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowFlashcards(true)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>🎴 Estudiar con Flashcards</span>
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {userGlossary.length > 0 ? (
                    userGlossary.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs relative group">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/30 uppercase font-bold">
                              {item.category}
                            </span>
                            <h5 className="font-bold text-slate-100 mt-1">{item.term}</h5>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteFromGlossary(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                            title="Eliminar de mi glosario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{item.definition}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-xs text-slate-500 italic">
                      Tu glosario personal está vacío. Selecciona cualquier palabra mientras lees o búscala arriba para guardarla.
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
