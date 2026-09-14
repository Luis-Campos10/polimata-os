'use client';

import { useState } from 'react';
import { Download, FileText, Eye, Edit3, Bold, Italic, Heading, List, Code, Quote, Save, CheckCircle2 } from 'lucide-react';

interface MarkdownEditorProps {
  initialValue?: string;
  prescriptionTitle?: string;
  filename?: string;
  onSave?: (content: string) => Promise<void> | void;
}

export default function MarkdownEditor({
  initialValue = '',
  prescriptionTitle = 'Producto Semanal Prescrito',
  filename = 'ENTREGABLE_SEMANAL.md',
  onSave,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [obsidianFeedback, setObsidianFeedback] = useState<string | null>(null);

  // Insertar formato Markdown en la posición del cursor o al final
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}Texto${suffix}`);
  };

  // Descargar archivo .md en la máquina local del usuario
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Enviar a Obsidian (PC con File System Handle o Móvil vía obsidian://)
  const handleSendToObsidian = async () => {
    try {
      const { getStoredVaultHandle, verifyPermission, writeVaultFile, openInObsidianApp } = await import('@/lib/sync/obsidianSync');
      const handle = await getStoredVaultHandle();

      if (handle) {
        const hasPerm = await verifyPermission(handle);
        if (hasPerm) {
          const safeName = filename.endsWith('.md') ? filename : `${filename}.md`;
          await writeVaultFile(handle, ['Polimata_OS', 'Entregables'], safeName, content);
          setObsidianFeedback(`¡Guardado directamente en tu Bóveda "${handle.name}/Polimata_OS/Entregables/${safeName}"!`);
          setTimeout(() => setObsidianFeedback(null), 4000);
          return;
        }
      }

      // Fallback móvil / App Obsidian
      const vaultName = localStorage.getItem('polimata_obsidian_vault_name') || 'Polimata_Vault';
      const cleanPath = `Polimata_OS/Entregables/${filename.replace(/\.md$/, '')}`;
      openInObsidianApp(vaultName, cleanPath, content);
      setObsidianFeedback(`Abriendo en la app de Obsidian (Bóveda: ${vaultName})...`);
      setTimeout(() => setObsidianFeedback(null), 4000);
    } catch (err: any) {
      setObsidianFeedback(`Error al conectar con Obsidian: ${err.message}`);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error al guardar borrador:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
      {/* Cabecera del Editor */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-950/80 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-100 font-mono">{filename}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono">
            {prescriptionTitle}
          </span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Pestañas Editar / Previsualizar */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Prevista
            </button>
          </div>

          {/* Enviar a Obsidian */}
          <button
            type="button"
            onClick={handleSendToObsidian}
            title="Enviar a Obsidian (App o Bóveda)"
            className="px-2.5 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 rounded-xl transition border border-purple-500/30 flex items-center gap-1 text-xs font-mono font-bold cursor-pointer"
          >
            <span>💎 Obsidian</span>
          </button>

          {/* Descargar Markdown */}
          <button
            type="button"
            onClick={handleDownload}
            title="Descargar archivo .md"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {obsidianFeedback && (
        <div className="p-2.5 bg-purple-950/90 border-b border-purple-800 text-purple-200 text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            {obsidianFeedback}
          </span>
          <button
            type="button"
            onClick={() => setObsidianFeedback(null)}
            className="text-purple-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Barra de Herramientas de Formato (en modo editar) */}
      {activeTab === 'edit' && (
        <div className="flex items-center gap-1.5 p-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            title="Negrita"
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            title="Cursiva"
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('### ')}
            title="Encabezado"
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            title="Lista"
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            title="Cita"
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```\n', '\n```')}
            title="Bloque de Código"
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ÁREA DE CONTENIDO */}
      {activeTab === 'edit' ? (
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`# ${prescriptionTitle}\n\nEscribe aquí tu ensayo, modelo o informe Markdown...`}
          className="w-full bg-slate-950 p-4 text-xs font-mono text-slate-200 focus:outline-none leading-relaxed border-none resize-y"
        />
      ) : (
        <div className="p-5 bg-slate-950 text-xs text-slate-200 leading-relaxed min-h-[250px] font-sans prose prose-invert max-w-none">
          {content ? (
            <div className="space-y-3 whitespace-pre-wrap font-mono text-xs">
              {content}
            </div>
          ) : (
            <span className="text-slate-500 italic">Previsualización vacía. Escribe algo en la pestaña Editar.</span>
          )}
        </div>
      )}

      {/* Pie con Guardado */}
      <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center">
        <span className="text-[11px] text-slate-400 font-mono">
          {content.length} caracteres · {content.split(/\s+/).filter(Boolean).length} palabras
        </span>

        {onSave && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                ¡Entregable Guardado!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Guardando...' : 'Guardar Entregable'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
