'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Brain, Clock, CheckCircle2, Send } from 'lucide-react';

export default function NuevoClient() {
  const [selectedAction, setSelectedAction] = useState<'session' | 'idea' | null>('session');
  const [noteContent, setNoteContent] = useState('');
  const [duration, setDuration] = useState(25);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!noteContent.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: selectedAction === 'session' ? 'STUDY_SESSION' : 'QUICK_IDEA',
          targetId: 'GENERAL',
          durationMinutes: duration,
          notes: noteContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setNoteContent('');
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs text-sky-400 hover:underline gap-1 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Volver a Hoy
        </Link>
        <span className="text-xs font-bold text-slate-400 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Acción Rápida
        </span>
      </div>

      <header className="relative overflow-hidden bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-sky-800/30 shadow-xl space-y-1">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold uppercase tracking-wider">
          <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Polímata OS</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-50 tracking-tight">Crear o Registrar</h1>
        <p className="text-xs text-slate-300">Captura rápida de avances, sesiones de estudio o reflexiones.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setSelectedAction('session')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 shadow-sm ${
            selectedAction === 'session'
              ? 'bg-sky-950/80 border-sky-500 text-sky-200 ring-2 ring-sky-500/40'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200'
          }`}
        >
          <Clock className="w-7 h-7 text-sky-400 mb-3" />
          <h3 className="text-sm font-bold">Registrar Sesión de Estudio</h3>
          <p className="text-xs text-slate-400 mt-1">Tiempo de lectura o ejercicio</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedAction('idea')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 shadow-sm ${
            selectedAction === 'idea'
              ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-2 ring-purple-500/40'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200'
          }`}
        >
          <Brain className="w-7 h-7 text-purple-400 mb-3" />
          <h3 className="text-sm font-bold">Capturar Idea o Argumento</h3>
          <p className="text-xs text-slate-400 mt-1">Concepto o contraejemplo</p>
        </button>
      </div>

      {selectedAction && (
        <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {selectedAction === 'session' ? 'Registrar Sesión de Estudio' : 'Capturar Nueva Idea'}
          </h3>

          {selectedAction === 'session' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duración de la Sesión (minutos):
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notas o Reflexiones:
            </label>
            <textarea
              rows={5}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Escribe el contenido aquí..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono leading-relaxed"
            />
          </div>

          {saved && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Registro guardado exitosamente en SQLite.
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !noteContent.trim()}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSaving ? 'Guardando en SQLite...' : 'Guardar Registro en Polímata OS'}
          </button>
        </section>
      )}
    </main>
  );
}
