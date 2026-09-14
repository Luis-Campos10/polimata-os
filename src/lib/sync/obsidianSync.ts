/**
 * Motor de Sincronización e Integración con OBSIDIAN (PC y Móvil).
 * Soporta:
 * 1. File System Access API (Escribe automáticamente en la carpeta de tu Bóveda en PC)
 * 2. Obsidian URI (Abre y crea notas en la app de Obsidian en celular con 1 toque)
 * 3. Generador de Bóveda Completa (.ZIP) con enlaces [[Wikilinks]] y estructura de carpetas
 */

const IDB_NAME = 'polimata_external_sync';
const IDB_STORE = 'handles';
const VAULT_HANDLE_KEY = 'obsidian_vault_dir';

export interface ObsidianSyncData {
  weeks: any[];
  works: any[];
  questions: any[];
  glossary: any[];
  ledger: any[];
}

// ==========================================
// 1. FILE SYSTEM ACCESS API (PC / NAVEGADORES COMPATIBLES)
// ==========================================

export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

function openSyncDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeVaultHandle(handle: any): Promise<void> {
  const db = await openSyncDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.put(handle, VAULT_HANDLE_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getStoredVaultHandle(): Promise<any | null> {
  try {
    const db = await openSyncDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(VAULT_HANDLE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function clearStoredVaultHandle(): Promise<void> {
  const db = await openSyncDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.delete(VAULT_HANDLE_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function requestVaultDirectory(): Promise<any> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('Tu navegador actual no soporta File System Access API. Usa la opción de URI o descarga directa.');
  }
  const handle = await (window as any).showDirectoryPicker({
    mode: 'readwrite',
  });
  await storeVaultHandle(handle);
  return handle;
}

export async function verifyPermission(handle: any): Promise<boolean> {
  if (!handle) return false;
  const opts = { mode: 'readwrite' };
  if ((await handle.queryPermission(opts)) === 'granted') {
    return true;
  }
  return (await handle.requestPermission(opts)) === 'granted';
}

async function getOrCreateSubdir(rootHandle: any, pathParts: string[]): Promise<any> {
  let current = rootHandle;
  for (const part of pathParts) {
    current = await current.getDirectoryHandle(part, { create: true });
  }
  return current;
}

export async function writeVaultFile(
  rootHandle: any,
  subpath: string[],
  filename: string,
  content: string
): Promise<void> {
  const dirHandle = await getOrCreateSubdir(rootHandle, subpath);
  const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

// ==========================================
// 2. GENERADORES DE NOTAS MARKDOWN CON [[WIKILINKS]]
// ==========================================

export function formatWeekForObsidian(week: any): { filename: string; content: string } {
  const guideQuestions = week.guideQuestionsJson ? JSON.parse(week.guideQuestionsJson) : [];
  const resources = week.resourcesJson ? JSON.parse(week.resourcesJson) : [];

  const content = `---
type: fase-0
week: ${week.weekNumber}
title: "${week.title}"
target_hours: "${week.targetHours}"
tags:
  - polimata-os
  - fase-0
  - semana-${week.weekNumber}
---

# Semana ${week.weekNumber}: ${week.title}

> **Propósito Pedagógico:** ${week.purpose}
> **Tiempo Objetivo:** \`${week.targetHours}\`

---

## 🎯 Preguntas Guía de Estudio
${guideQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

---

## 📚 Recursos y Lecturas
${resources.map((r: string) => `- 📖 ${r}`).join('\n')}

---

## 🧪 Prescripción del Laboratorio Cognitivo
${week.laboratoryJson || 'Laboratorio semanal de adquisición y recuerdo activo.'}

---

## ✍️ Producto Entregable Esperado
${week.productPrescription}

${week.productDescription ? `### Descripción del Producto:\n${week.productDescription}` : ''}

---

## 🔗 Conexiones Interdisciplinarias
- [[00_Indice_Polimata_OS|Índice General de Polímata OS]]
- [[Grandes_Preguntas_Indice|18 Grandes Preguntas Núcleo]]
`;

  const safeTitle = week.title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_');
  return {
    filename: `Semana_${String(week.weekNumber).padStart(2, '0')}_${safeTitle}.md`,
    content,
  };
}

export function formatWorkForObsidian(work: any): { filename: string; content: string } {
  const primaryQuestions = work.primaryQuestionsJson ? JSON.parse(work.primaryQuestionsJson) : [];

  const content = `---
type: canon-obra
work_number: ${work.workNumber}
year_curriculum: ${work.year}
author: "${work.author}"
title: "${work.title}"
historical_year: "${work.historicalYear || 'Desconocido'}"
historical_period: "${work.historicalPeriod || 'Canon'}"
level: "${work.level}"
tags:
  - polimata-os
  - canon-170
  - ano-${work.year}
---

# #${work.workNumber}: ${work.title}
**Autor:** [[${work.author}]]  
**Año de Publicación:** \`${work.historicalYear || 'N/A'}\`  
**Período Cultural:** *${work.historicalPeriod || 'Canon'}*  
**Nivel:** \`${work.level}\` | **Año del Programa:** Año ${work.year}

---

## 📖 Prescripción de Lectura
> ${work.prescribedReading}

---

## ❓ Preguntas Primarias Abordadas
${primaryQuestions.map((q: string) => `- [[${q}_Pregunta|${q}]]`).join('\n')}

---

## 🌐 Puente Transdisciplinar
Esta obra conecta dialécticamente con los conceptos del [[Grafo_de_Conocimiento]] y las posiciones registradas en el [[Question_Ledger]].
`;

  const safeTitle = `${work.author}_-_${work.title}`.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_').substring(0, 60);
  return {
    filename: `${String(work.workNumber).padStart(3, '0')}_${safeTitle}.md`,
    content,
  };
}

export function formatQuestionForObsidian(q: any, ledgerEntries: any[]): { filename: string; content: string } {
  const matchingEntries = ledgerEntries.filter((e) => e.questionId === q.id);

  const content = `---
type: gran-pregunta
question_id: "${q.id}"
number: ${q.number}
title: "${q.title}"
tags:
  - polimata-os
  - grandes-preguntas
  - ${q.id}
---

# ${q.id}: ${q.title}

> ${q.description}

---

## 🏛️ Historial Inmutable del Question Ledger

${
  matchingEntries.length === 0
    ? '*Sin posiciones registradas aún en el Question Ledger.*'
    : matchingEntries
        .map(
          (e, idx) => `### Registro Año ${e.year} (Confianza: ${e.confidence}%)
**Posición Provisional:**
${e.positionSummary}

${e.argumentsJson && e.argumentsJson !== '[]' ? `**Argumento Principal:**\n- ${JSON.parse(e.argumentsJson).join('\n- ')}\n` : ''}
${e.objectionsJson && e.objectionsJson !== '[]' ? `**🔬 Criterio de Falsación (Karl Popper):**\n> ${JSON.parse(e.objectionsJson).join('\n> ')}\n` : ''}
*Fecha de Registro: ${new Date(e.createdAt).toLocaleDateString()}*
`
        )
        .join('\n---\n\n')
}

---
- [[00_Indice_Polimata_OS|Volver al Índice de Polímata OS]]
`;

  const safeTitle = `${q.id}_${q.title}`.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_').substring(0, 60);
  return {
    filename: `${safeTitle}.md`,
    content,
  };
}

// ==========================================
// 3. OBSIDIAN URI (MÓVIL ANDROID / IOS)
// ==========================================

export function openInObsidianApp(vaultName: string, filePath: string, content: string): void {
  const cleanVault = encodeURIComponent(vaultName.trim());
  const cleanFile = encodeURIComponent(filePath.trim());
  const cleanContent = encodeURIComponent(content);
  const uri = `obsidian://new?vault=${cleanVault}&file=${cleanFile}&content=${cleanContent}&overwrite=true`;
  window.location.href = uri;
}

// ==========================================
// 4. GENERADOR PURO DE BÓVEDA OBSIDIAN (.ZIP)
// ==========================================

// Tabla CRC32 para generación estándar de ZIP
const CRC_TABLE = (() => {
  let c;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function generateSimpleZip(files: Array<{ name: string; content: string }>): Uint8Array {
  const encoder = new TextEncoder();
  const fileEntries: Array<{
    nameBytes: Uint8Array;
    contentBytes: Uint8Array;
    crc: number;
    offset: number;
  }> = [];

  let offset = 0;
  const parts: Uint8Array[] = [];

  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const contentBytes = encoder.encode(f.content);
    const crc = crc32(contentBytes);

    // Local file header (30 bytes + name + content)
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true); // Version needed to extract
    view.setUint16(6, 0, true); // General purpose bit flag
    view.setUint16(8, 0, true); // Compression method (0 = uncompressed store)
    view.setUint16(10, 0, true); // Last mod file time
    view.setUint16(12, 0, true); // Last mod file date
    view.setUint32(14, crc, true); // CRC-32
    view.setUint32(18, contentBytes.length, true); // Compressed size
    view.setUint32(22, contentBytes.length, true); // Uncompressed size
    view.setUint16(26, nameBytes.length, true); // File name length
    view.setUint16(28, 0, true); // Extra field length
    header.set(nameBytes, 30);

    fileEntries.push({
      nameBytes,
      contentBytes,
      crc,
      offset,
    });

    parts.push(header);
    parts.push(contentBytes);
    offset += header.length + contentBytes.length;
  }

  const centralDirStart = offset;

  // Central Directory
  for (const entry of fileEntries) {
    const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(cdHeader.buffer);
    view.setUint32(0, 0x02014b50, true); // Central directory header signature
    view.setUint16(4, 20, true); // Version made by
    view.setUint16(6, 20, true); // Version needed to extract
    view.setUint16(8, 0, true); // General purpose bit flag
    view.setUint16(10, 0, true); // Compression method
    view.setUint16(12, 0, true); // Last mod file time
    view.setUint16(14, 0, true); // Last mod file date
    view.setUint32(16, entry.crc, true); // CRC-32
    view.setUint32(20, entry.contentBytes.length, true); // Compressed size
    view.setUint32(24, entry.contentBytes.length, true); // Uncompressed size
    view.setUint16(28, entry.nameBytes.length, true); // File name length
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // File comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal file attributes
    view.setUint32(38, 0, true); // External file attributes
    view.setUint32(42, entry.offset, true); // Relative offset of local header
    cdHeader.set(entry.nameBytes, 46);

    parts.push(cdHeader);
    offset += cdHeader.length;
  }

  const centralDirSize = offset - centralDirStart;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true); // End of central directory signature
  eocdView.setUint16(4, 0, true); // Number of this disk
  eocdView.setUint16(6, 0, true); // Number of disk with start of central dir
  eocdView.setUint16(8, fileEntries.length, true); // Total entries in central dir on this disk
  eocdView.setUint16(10, fileEntries.length, true); // Total entries in central dir
  eocdView.setUint32(12, centralDirSize, true); // Size of central directory
  eocdView.setUint32(16, centralDirStart, true); // Offset of start of central dir
  eocdView.setUint16(20, 0, true); // Comment length
  parts.push(eocd);

  // Unir todas las partes en un solo Uint8Array
  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    result.set(p, pos);
    pos += p.length;
  }

  return result;
}

/**
 * Descarga en el navegador o móvil el archivo ZIP completo de la Bóveda Obsidian
 */
export function downloadObsidianVaultZip(data: ObsidianSyncData): void {
  const files: Array<{ name: string; content: string }> = [];

  // Índice Maestro
  files.push({
    name: '00_Indice_Polimata_OS.md',
    content: `# Bóveda Polímata OS

Bienvenido a tu Bóveda de Conocimiento interconectada de Polímata OS.

## 🗂️ Módulos Principales:
- [[Fase_0_Aprender_a_aprender|00. Fase 0 — Aprender a Aprender (16 Semanas)]]
- [[Canon_170_Obras_Indice|01. Canon de 170 Obras (Años 1 al 10)]]
- [[Grandes_Preguntas_Indice|02. Las 18 Grandes Preguntas & Question Ledger]]

> *Cada nota contiene enlaces bidireccionales ([[ ]]) para activar el grafo visual de Obsidian.*
`,
  });

  // Fase 0 (16 Semanas)
  for (const w of data.weeks) {
    const formatted = formatWeekForObsidian(w);
    files.push({
      name: `00_Fase_0/${formatted.filename}`,
      content: formatted.content,
    });
  }

  // Canon de 170 Obras
  for (const work of data.works) {
    const formatted = formatWorkForObsidian(work);
    files.push({
      name: `01_Canon_170_Obras/${formatted.filename}`,
      content: formatted.content,
    });
  }

  // 18 Grandes Preguntas
  for (const q of data.questions) {
    const formatted = formatQuestionForObsidian(q, data.ledger);
    files.push({
      name: `02_Grandes_Preguntas/${formatted.filename}`,
      content: formatted.content,
    });
  }

  const zipBytes = generateSimpleZip(files);
  const blob = new Blob([zipBytes.buffer as ArrayBuffer], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Polimata_OS_Obsidian_Vault_${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
