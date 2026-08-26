'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function OledThemeToggle() {
  const [isOledMode, setIsOledMode] = useState(false);

  useEffect(() => {
    if (isOledMode) {
      document.documentElement.classList.add('oled-pitch-black');
    } else {
      document.documentElement.classList.remove('oled-pitch-black');
    }
  }, [isOledMode]);

  return (
    <button
      type="button"
      onClick={() => setIsOledMode(!isOledMode)}
      className={`fixed top-4 right-4 z-40 p-2.5 rounded-full transition border shadow-xl flex items-center justify-center cursor-pointer ${
        isOledMode
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
      }`}
      title={isOledMode ? 'Desactivar Modo Nocturno OLED' : 'Activar Modo Lectura Nocturna OLED (Negro Puro)'}
    >
      {isOledMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
