'use client';

import { useState } from 'react';
import { Download, Upload, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function YoBackupActions() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/backup');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `polimata_os_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatusMessage({ text: 'Respaldo exportado correctamente en formato JSON.' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: 'Error al exportar respaldo', isError: true });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: '¡Base de datos restaurada con éxito desde el respaldo!' });
      } else {
        setStatusMessage({ text: data.error || 'Error al restaurar respaldo', isError: true });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: 'Archivo JSON inválido o con formato erróneo', isError: true });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
      <div className="flex items-center space-x-2 text-slate-100 font-bold text-sm uppercase tracking-wide">
        <Database className="w-4 h-4 text-sky-400" />
        <span>Portabilidad Total & Copias de Seguridad</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Polímata OS almacena todos tus datos localmente en SQLite. Puedes exportar o restaurar una copia de seguridad en JSON en cualquier momento para respaldar tu Question Ledger y estadísticas.
      </p>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            statusMessage.isError
              ? 'bg-rose-950/60 border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          {statusMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exportando...' : 'Exportar Copia JSON'}
        </button>

        <label className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer text-center">
          <Upload className="w-4 h-4 text-purple-400" />
          <span>{isImporting ? 'Restaurando...' : 'Restaurar Respaldo JSON'}</span>
          <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <div className="pt-2">
        <a
          href="/api/export/offline-html"
          download="Polimata_OS_Offline.html"
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg border border-emerald-400/30 text-center block"
        >
          <Download className="w-4 h-4" />
          📥 Descargar Polímata OS Autónomo (.html sin Wi-Fi ni Datos)
        </a>
      </div>
    </section>
  );
}

