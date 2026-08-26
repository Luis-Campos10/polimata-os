'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PwaRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ Service Worker de Polímata OS registrado exitosamente:', reg.scope);
          
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🚀 Nueva actualización de Polímata OS disponible.');
                  setUpdateAvailable(true);
                }
              };
            }
          };
        })
        .catch((err) => {
          console.error('Error al registrar Service Worker:', err);
        });
    }
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-gradient-to-r from-purple-600 to-sky-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-white/40 flex items-center gap-2 animate-bounce cursor-pointer">
      <RefreshCw className="w-4 h-4 animate-spin" />
      <span>¡Nueva versión disponible! Toca para actualizar la aplicación</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="ml-2 px-2.5 py-1 bg-white text-purple-900 rounded-full text-[10px] font-black hover:bg-slate-100"
      >
        Actualizar
      </button>
    </div>
  );
}
