'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ Service Worker de Polímata OS registrado exitosamente:', reg.scope);
        })
        .catch((err) => {
          console.error('Error al registrar Service Worker:', err);
        });
    }
  }, []);

  return null;
}
