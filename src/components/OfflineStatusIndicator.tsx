'use client';

import { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export default function OfflineStatusIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center space-x-2 backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4 text-emerald-400" />
      <span>📶 Modo Offline Activo (Guardado en memoria de tu celular)</span>
    </div>
  );
}
