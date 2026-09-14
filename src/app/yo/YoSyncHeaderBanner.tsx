'use client';

import { useState } from 'react';
import { FolderSync, ArrowRight } from 'lucide-react';
import SyncHubModal from '@/components/SyncHubModal';

export default function YoSyncHeaderBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-left p-4 sm:p-5 bg-gradient-to-r from-purple-900/70 via-slate-900 to-sky-900/70 hover:from-purple-800/80 hover:to-sky-800/80 rounded-2xl border border-purple-500/40 hover:border-sky-400/60 transition-all duration-300 shadow-xl flex items-center justify-between gap-4 cursor-pointer group"
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl group-hover:scale-105 transition-transform shrink-0">
            <FolderSync className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                💎 Obsidian & 🎴 Anki (Sincronización)
              </h2>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30 font-mono font-bold">
                Activar
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Conectar tu Bóveda local de Obsidian y sincronizar tus tarjetas de repaso FSRS con Anki.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono text-xs font-bold">
          <span>Abrir</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      <SyncHubModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
