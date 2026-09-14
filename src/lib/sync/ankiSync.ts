/**
 * Motor de Sincronización e Integración con ANKI (PC y Móvil).
 * Soporta:
 * 1. AnkiConnect (Automático en segundo plano para PC vía http://127.0.0.1:8765)
 * 2. AnkiDroid / AnkiMobile (Generador de archivo importable para móvil con 1 toque)
 */

export interface AnkiCardItem {
  term: string;
  definition: string;
  category?: string;
  etymology?: string;
  example?: string;
}

const DEFAULT_DECK = 'Polímata OS';

/**
 * Comprueba si Anki Desktop está abierto con el plugin AnkiConnect activo
 */
export async function checkAnkiConnect(port = 8765): Promise<{ isOnline: boolean; version?: number; error?: string }> {
  if (typeof window === 'undefined') return { isOnline: false };
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`http://127.0.0.1:${port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'version', version: 6 }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Respuesta no satisfactoria');
    const data = await res.json();
    return { isOnline: true, version: data.result };
  } catch (err: any) {
    return { isOnline: false, error: err.message || 'AnkiConnect no detectado' };
  }
}

/**
 * Crea o asegura la existencia de un mazo en Anki Desktop vía AnkiConnect
 */
async function ensureAnkiDeck(deckName: string, port = 8765): Promise<boolean> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createDeck',
        version: 6,
        params: { deck: deckName },
      }),
    });
    const data = await res.json();
    return !data.error;
  } catch {
    return false;
  }
}

/**
 * Envía tarjetas automáticamente a Anki Desktop vía AnkiConnect
 */
export async function syncCardsToAnkiConnect(
  cards: AnkiCardItem[],
  deckName = DEFAULT_DECK,
  port = 8765
): Promise<{ success: boolean; added: number; errors: string[] }> {
  const status = await checkAnkiConnect(port);
  if (!status.isOnline) {
    return {
      success: false,
      added: 0,
      errors: ['Anki Desktop no está abierto o no tiene instalado el complemento AnkiConnect (código: 2055492159).'],
    };
  }

  await ensureAnkiDeck(deckName, port);

  const notes = cards.map((c) => {
    const frontHtml = `<div style="font-family: sans-serif; font-size: 1.25rem; font-weight: bold; color: #0284c7; text-align: center; padding: 10px;">${c.term}</div>`;
    const backParts = [
      `<div style="font-family: sans-serif; font-size: 1rem; color: #1e293b; line-height: 1.5; padding: 10px;">`,
      `<p style="margin-bottom: 8px;"><strong>Definición:</strong> ${c.definition}</p>`,
    ];

    if (c.etymology && c.etymology !== 'Etimología académica') {
      backParts.push(`<p style="color: #64748b; font-size: 0.85rem; font-style: italic; margin-bottom: 6px;">🏛️ <strong>Etimología:</strong> ${c.etymology}</p>`);
    }

    if (c.example) {
      backParts.push(`<p style="background: #f1f5f9; padding: 6px 10px; border-left: 3px solid #0284c7; border-radius: 4px; font-size: 0.85rem; color: #334155;">💡 <em>${c.example}</em></p>`);
    }

    backParts.push(`</div>`);

    const cleanCategory = (c.category || 'General').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

    return {
      deckName,
      modelName: 'Basic',
      fields: {
        Front: frontHtml,
        Back: backParts.join(''),
      },
      tags: ['PolimataOS', cleanCategory],
      options: {
        allowDuplicate: false,
        duplicateScope: 'deck',
      },
    };
  });

  try {
    const res = await fetch(`http://127.0.0.1:${port}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addNotes',
        version: 6,
        params: { notes },
      }),
    });

    const data = await res.json();
    if (data.error) {
      return { success: false, added: 0, errors: [data.error] };
    }

    const addedCount = Array.isArray(data.result) ? data.result.filter((id: any) => id !== null).length : 0;
    return { success: true, added: addedCount, errors: [] };
  } catch (err: any) {
    return { success: false, added: 0, errors: [err.message] };
  }
}

/**
 * Genera el archivo de texto TSV oficial para importar en AnkiDroid (Celular) o Anki Desktop
 */
export function generateAnkiTsvFile(cards: AnkiCardItem[], deckName = DEFAULT_DECK): string {
  const lines: string[] = [
    '#separator:tab',
    '#html:true',
    `#deck:${deckName}`,
    '#tags column:3',
  ];

  for (const c of cards) {
    const front = c.term.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const backLines = [`<p><strong>${c.definition}</strong></p>`];

    if (c.etymology && c.etymology !== 'Etimología académica') {
      backLines.push(`<p><small style="color:#64748b;">🏛️ <em>${c.etymology}</em></small></p>`);
    }

    if (c.example) {
      backLines.push(`<blockquote style="border-left:2px solid #0284c7; margin:6px 0; padding-left:8px;"><small>💡 ${c.example}</small></blockquote>`);
    }

    const back = backLines.join('').replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const tag = `PolimataOS ${(c.category || 'General').replace(/\s+/g, '_')}`;

    lines.push(`${front}\t${back}\t${tag}`);
  }

  return lines.join('\n');
}

/**
 * Descarga en el navegador o celular el archivo compatible con AnkiDroid
 */
export function downloadAnkiDeckFile(cards: AnkiCardItem[], deckName = DEFAULT_DECK): void {
  const tsv = generateAnkiTsvFile(cards, deckName);
  const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Polimata_OS_Anki_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
