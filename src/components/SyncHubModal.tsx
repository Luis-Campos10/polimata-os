'use client';

import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Download, 
  FolderSync, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Cpu, 
  Smartphone, 
  Laptop, 
  X,
  Database
} from 'lucide-react';
import { 
  checkAnkiConnect, 
  syncCardsToAnkiConnect, 
  downloadAnkiDeckFile, 
  AnkiCardItem 
} from '@/lib/sync/ankiSync';
import { 
  isFileSystemAccessSupported, 
  getStoredVaultHandle, 
  requestVaultDirectory, 
  clearStoredVaultHandle, 
  verifyPermission, 
  writeVaultFile, 
  formatWeekForObsidian, 
  formatWorkForObsidian, 
  formatQuestionForObsidian, 
  openInObsidianApp, 
  downloadObsidianVaultZip,
  ObsidianSyncData
} from '@/lib/sync/obsidianSync';

export default function SyncHubModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'obsidian' | 'anki'>('obsidian');

  // Estados de Obsidian
  const [hasVaultHandle, setHasVaultHandle] = useState<boolean>(false);
  const [vaultHandleName, setVaultHandleName] = useState<string>('');
  const [obsidianVaultName, setObsidianVaultName] = useState<string>('Polimata_Vault');
  const [isSyncingObsidian, setIsSyncingObsidian] = useState<boolean>(false);
  const [obsidianStatus, setObsidianStatus] = useState<{ text: string; isError?: boolean } | null>(null);

  // Estados de Anki
  const [isAnkiOnline, setIsAnkiOnline] = useState<boolean>(false);
  const [ankiVersion, setAnkiVersion] = useState<number | undefined>();
  const [ankiDeckName, setAnkiDeckName] = useState<string>('Polímata OS');
  const [isSyncingAnki, setIsSyncingAnki] = useState<boolean>(false);
  const [ankiStatus, setAnkiStatus] = useState<{ text: string; isError?: boolean } | null>(null);
  const [cardsCount, setCardsCount] = useState<number>(0);

  // Cargar estado inicial y comprobar conexiones
  useEffect(() => {
    if (!isOpen) return;

    // Comprobar Vault de Obsidian en IndexedDB
    getStoredVaultHandle().then((handle) => {
      if (handle) {
        setHasVaultHandle(true);
        setVaultHandleName(handle.name || 'Carpeta Vinculada');
      } else {
        setHasVaultHandle(false);
      }
    });

    // Cargar nombre de vault guardado para móvil
    const savedVault = localStorage.getItem('polimata_obsidian_vault_name');
    if (savedVault) setObsidianVaultName(savedVault);

    // Comprobar AnkiConnect
    checkAnkiConnect().then((res) => {
      setIsAnkiOnline(res.isOnline);
      setAnkiVersion(res.version);
    });

    // Obtener cantidad de tarjetas del glosario
    fetch('/api/glossary')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.glossary)) {
          setCardsCount(d.glossary.length);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Obtener todos los datos necesarios para sincronizar
  const fetchAllData = async (): Promise<ObsidianSyncData | null> => {
    try {
      const res = await fetch('/api/sync/all-content');
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  // --- ACCIONES OBSIDIAN ---

  const handleSelectVaultFolder = async () => {
    try {
      setObsidianStatus(null);
      const handle = await requestVaultDirectory();
      setHasVaultHandle(true);
      setVaultHandleName(handle.name);
      setObsidianStatus({ text: `¡Bóveda "${handle.name}" vinculada con éxito! Ya puedes sincronizar automáticamente.` });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setObsidianStatus({ text: err.message || 'Error al vincular carpeta', isError: true });
      }
    }
  };

  const handleUnlinkVaultFolder = async () => {
    await clearStoredVaultHandle();
    setHasVaultHandle(false);
    setVaultHandleName('');
    setObsidianStatus({ text: 'Bóveda desvinculada de Polímata OS.' });
  };

  const handleSyncToObsidianFolder = async () => {
    setIsSyncingObsidian(true);
    setObsidianStatus(null);
    try {
      const handle = await getStoredVaultHandle();
      if (!handle) {
        setObsidianStatus({ text: 'Primero vincula la carpeta de tu Bóveda.', isError: true });
        return;
      }

      const hasPerm = await verifyPermission(handle);
      if (!hasPerm) {
        setObsidianStatus({ text: 'Permiso denegado para escribir en la carpeta de Obsidian.', isError: true });
        return;
      }

      const data = await fetchAllData();
      if (!data) {
        setObsidianStatus({ text: 'Error al obtener el contenido de Polímata OS.', isError: true });
        return;
      }

      // Escribir Índice Maestro
      await writeVaultFile(handle, ['Polimata_OS'], '00_Indice_Polimata_OS.md', `# Bóveda Polímata OS\n\nBienvenido a tu sistema de estudio interdisciplinario.`);

      // Escribir Semanas de Fase 0
      for (const w of data.weeks) {
        const item = formatWeekForObsidian(w);
        await writeVaultFile(handle, ['Polimata_OS', '00_Fase_0'], item.filename, item.content);
      }

      // Escribir 170 Obras del Canon
      for (const work of data.works) {
        const item = formatWorkForObsidian(work);
        await writeVaultFile(handle, ['Polimata_OS', '01_Canon_170_Obras'], item.filename, item.content);
      }

      // Escribir 18 Grandes Preguntas & Question Ledger
      for (const q of data.questions) {
        const item = formatQuestionForObsidian(q, data.ledger);
        await writeVaultFile(handle, ['Polimata_OS', '02_Grandes_Preguntas'], item.filename, item.content);
      }

      setObsidianStatus({ text: `✅ ¡Sincronización completa! Se actualizaron 170 obras, 16 semanas y las Grandes Preguntas directamente en tu carpeta de Obsidian.` });
    } catch (err: any) {
      setObsidianStatus({ text: `Error al sincronizar: ${err.message}`, isError: true });
    } finally {
      setIsSyncingObsidian(false);
    }
  };

  const handleDownloadVaultZip = async () => {
    setIsSyncingObsidian(true);
    try {
      const data = await fetchAllData();
      if (data) {
        downloadObsidianVaultZip(data);
        setObsidianStatus({ text: '📦 Descarga iniciada: Descomprime el archivo .zip dentro de tu bóveda de Obsidian.' });
      } else {
        setObsidianStatus({ text: 'No se pudo generar la bóveda.', isError: true });
      }
    } catch (err: any) {
      setObsidianStatus({ text: err.message, isError: true });
    } finally {
      setIsSyncingObsidian(false);
    }
  };

  const handleTestMobileObsidian = () => {
    if (!obsidianVaultName.trim()) return;
    localStorage.setItem('polimata_obsidian_vault_name', obsidianVaultName.trim());
    openInObsidianApp(
      obsidianVaultName.trim(),
      'Polimata_OS/Prueba_Conexion',
      `# Prueba de Conexión Polímata OS ➔ Obsidian\n\nConexión establecida con éxito desde tu celular. [[00_Indice_Polimata_OS]]`
    );
  };

  // --- ACCIONES ANKI ---

  const handleSyncAnkiConnect = async () => {
    setIsSyncingAnki(true);
    setAnkiStatus(null);
    try {
      const data = await fetchAllData();
      if (!data || !Array.isArray(data.glossary) || data.glossary.length === 0) {
        setAnkiStatus({ text: 'No hay tarjetas creadas aún en tu glosario para sincronizar.', isError: true });
        return;
      }

      const cards: AnkiCardItem[] = data.glossary.map((g: any) => ({
        term: g.term,
        definition: g.definition,
        category: g.category,
        etymology: g.etymology,
        example: g.example,
      }));

      const res = await syncCardsToAnkiConnect(cards, ankiDeckName.trim() || 'Polímata OS');
      if (res.success) {
        setAnkiStatus({ text: `⚡ ¡Éxito! Se añadieron ${res.added} tarjetas nuevas a tu mazo "${ankiDeckName}" en Anki Desktop.` });
      } else {
        setAnkiStatus({ text: res.errors.join(' ') || 'Error al sincronizar con AnkiConnect', isError: true });
      }
    } catch (err: any) {
      setAnkiStatus({ text: err.message, isError: true });
    } finally {
      setIsSyncingAnki(false);
    }
  };

  const handleDownloadAnkiDroid = async () => {
    try {
      const data = await fetchAllData();
      if (!data || !Array.isArray(data.glossary) || data.glossary.length === 0) {
        setAnkiStatus({ text: 'No hay tarjetas creadas aún para exportar.', isError: true });
        return;
      }

      const cards: AnkiCardItem[] = data.glossary.map((g: any) => ({
        term: g.term,
        definition: g.definition,
        category: g.category,
        etymology: g.etymology,
        example: g.example,
      }));

      downloadAnkiDeckFile(cards, ankiDeckName.trim() || 'Polímata OS');
      setAnkiStatus({ text: '📲 Archivo generado. En tu celular, abre el archivo descargado y selecciona AnkiDroid para importar tu mazo.' });
    } catch (err: any) {
      setAnkiStatus({ text: err.message, isError: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto p-5 sm:p-7 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* BOTÓN CERRAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABECERA */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono">
            <FolderSync className="w-3.5 h-3.5 text-purple-400" />
            <span>Sincronización Externa Dual</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Conectar Obsidian & Anki
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sincroniza en tiempo real tus notas, entregables y 170 obras con Obsidian, y tus tarjetas de recuerdo activo con Anki (PC y Celular).
          </p>
        </div>

        {/* SELECTOR DE PESTAÑA: OBSIDIAN VS ANKI */}
        <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('obsidian')}
            className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'obsidian'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>💎 Obsidian (Notas & Grafo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('anki')}
            className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'anki'
                ? 'bg-sky-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎴 Anki (Flashcards FSRS)</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* PESTAÑA 1: OBSIDIAN */}
        {/* ========================================================= */}
        {activeTab === 'obsidian' && (
          <div className="space-y-5">
            {/* NOTIFICACIÓN DE ESTADO */}
            {obsidianStatus && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 font-mono ${
                  obsidianStatus.isError
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                }`}
              >
                {obsidianStatus.isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{obsidianStatus.text}</span>
              </div>
            )}

            {/* SECCIÓN PC: FILE SYSTEM ACCESS API */}
            <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Sincronización Automática en PC (Directa a Carpeta)</h3>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasVaultHandle ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {hasVaultHandle ? '🟢 Vinculada' : '⚪ No vinculada'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Selecciona la carpeta de tu Bóveda en tu computadora una sola vez. Polímata OS escribirá directamente tus notas, el canon de 170 obras con <strong className="text-purple-300">[[Wikilinks]]</strong> y tus preguntas guía.
              </p>

              {hasVaultHandle ? (
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-purple-300 flex justify-between items-center">
                    <span>📁 Carpeta: {vaultHandleName}</span>
                    <button
                      type="button"
                      onClick={handleUnlinkVaultFolder}
                      className="text-slate-400 hover:text-rose-400 text-[11px] underline cursor-pointer"
                    >
                      Desvincular
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncToObsidianFolder}
                    disabled={isSyncingObsidian}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingObsidian ? 'animate-spin' : ''}`} />
                    <span>{isSyncingObsidian ? 'Sincronizando Archivos...' : 'Sincronizar Todo a Obsidian Ahora'}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectVaultFolder}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-200 font-bold text-xs rounded-xl transition border border-purple-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FolderSync className="w-4 h-4 text-purple-400" />
                  <span>Vincular Carpeta de mi Bóveda de Obsidian</span>
                </button>
              )}
            </div>

            {/* SECCIÓN MÓVIL: PROTOCOLO OBSIDIAN URI */}
            <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Sincronización en Móvil (Android / iOS)</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Usa el protocolo nativo <code className="text-sky-300 bg-slate-950 px-1 py-0.5 rounded">obsidian://</code> para enviar tus notas directamente a tu aplicación instalada en el celular.
              </p>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-slate-400">
                  Nombre exacto de tu Bóveda en Obsidian:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={obsidianVaultName}
                    onChange={(e) => setObsidianVaultName(e.target.value)}
                    placeholder="Ej. Mi_Vault o Polimata"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestMobileObsidian}
                    className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 font-bold text-xs rounded-xl border border-sky-500/30 transition flex items-center gap-1.5 cursor-pointer font-mono shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Probar Apertura</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN EXPORTACIÓN UNIVERSAL (.ZIP) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDownloadVaultZip}
                disabled={isSyncingObsidian}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Descargar Bóveda Completa en .ZIP (Copia Portátil)</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 2: ANKI */}
        {/* ========================================================= */}
        {activeTab === 'anki' && (
          <div className="space-y-5">
            {/* NOTIFICACIÓN DE ESTADO */}
            {ankiStatus && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 font-mono ${
                  ankiStatus.isError
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                }`}
              >
                {ankiStatus.isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{ankiStatus.text}</span>
              </div>
            )}

            {/* SECCIÓN PC: ANKICONNECT */}
            <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">Anki Desktop en PC (AnkiConnect)</h3>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isAnkiOnline ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {isAnkiOnline ? `🟢 Detectado (v${ankiVersion})` : '⚪ No detectado'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Si tienes Anki Desktop abierto en tu computadora con el plugin <strong className="text-sky-300">AnkiConnect</strong>, tus flashcards de lectura se envían de forma instantánea y en segundo plano sin descargar nada.
              </p>

              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-slate-400">
                  Nombre del Mazo de Destino en Anki:
                </label>
                <input
                  type="text"
                  value={ankiDeckName}
                  onChange={(e) => setAnkiDeckName(e.target.value)}
                  placeholder="Polímata OS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSyncAnkiConnect}
                disabled={isSyncingAnki || !isAnkiOnline}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingAnki ? 'animate-spin' : ''}`} />
                <span>{isSyncingAnki ? 'Sincronizando...' : `⚡ Enviar ${cardsCount} Tarjetas a Anki Desktop`}</span>
              </button>

              {!isAnkiOnline && (
                <p className="text-[11px] text-slate-500 font-mono">
                  💡 Abre tu Anki Desktop en tu PC para activar la sincronización automática instantánea.
                </p>
              )}
            </div>

            {/* SECCIÓN MÓVIL: ANKIDROID (ANDROID / IOS) */}
            <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">AnkiDroid en Celular (1 Toque)</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Genera el archivo con encabezados oficiales de Anki. Al descargarlo en tu teléfono Android, tócalo y elige <strong className="text-emerald-300">"Abrir con AnkiDroid"</strong>: todas tus tarjetas, conceptos y etiquetas se importan automáticamente al mazo.
              </p>

              <button
                type="button"
                onClick={handleDownloadAnkiDroid}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>📲 Descargar Mazo Listo para AnkiDroid ({cardsCount} Tarjetas)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
