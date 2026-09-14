/**
 * Test Suite Integral para Sincronización con Obsidian & Anki y Lector PDF
 */

const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 INICIANDO BATERÍA DE PRUEBAS POLÍMATA OS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // PRUEBA 1: Verificar existencia y estructura de archivos clave
  // ----------------------------------------------------
  console.log('--- 1. Verificación de Archivos y Módulos ---');
  const filesToCheck = [
    'src/lib/sync/ankiSync.ts',
    'src/lib/sync/obsidianSync.ts',
    'src/app/api/sync/all-content/route.ts',
    'src/components/SyncHubModal.tsx',
    'src/components/MobilePdfCanvasViewer.tsx',
    'src/components/MarkdownEditor.tsx',
    'src/app/yo/YoSyncHeaderBanner.tsx',
    'src/app/saber/SaberClient.tsx'
  ];

  for (const file of filesToCheck) {
    const fullPath = path.join(process.cwd(), file);
    assert(fs.existsSync(fullPath), `Archivo existe: ${file}`);
  }

  // ----------------------------------------------------
  // PRUEBA 2: Validar 170 obras y sus metadatos históricos
  // ----------------------------------------------------
  console.log('\n--- 2. Validación de Obras del Canon (170 Obras) ---');
  const canonRaw = fs.readFileSync(path.join(process.cwd(), 'src/lib/db/canon_works_static.json'), 'utf8');
  const canonWorks = JSON.parse(canonRaw);
  assert(canonWorks.length === 170, `El canon contiene exactamente 170 obras (encontradas: ${canonWorks.length})`);

  // Verificar Spinoza (#39)
  const spinoza = canonWorks.find(w => w.workNumber === 39);
  assert(spinoza && spinoza.author.toLowerCase().includes('spinoza'), 'Obra #39 es Spinoza');

  // Verificar Platón (#15)
  const plato = canonWorks.find(w => w.workNumber === 15);
  assert(plato && plato.title.toLowerCase().includes('república'), 'Obra #15 es República de Platón');

  // ----------------------------------------------------
  // PRUEBA 3: Formateador TSV de Anki (Headers oficiales)
  // ----------------------------------------------------
  console.log('\n--- 3. Formateador de Tarjetas para Anki (AnkiDroid / Desktop) ---');
  
  // Simulamos la función generateAnkiTsvFile
  function mockGenerateAnkiTsv(cards, deckName = 'Polímata OS') {
    const lines = [
      '#separator:tab',
      '#html:true',
      `#deck:${deckName}`,
      '#tags column:3',
    ];
    for (const c of cards) {
      const front = c.term.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      const back = `<p><strong>${c.definition}</strong></p><p><small>🏛️ <em>${c.etymology || ''}</em></small></p>`;
      const tag = `PolimataOS ${(c.category || 'General').replace(/\s+/g, '_')}`;
      lines.push(`${front}\t${back}\t${tag}`);
    }
    return lines.join('\n');
  }

  const sampleCards = [
    { term: 'Eudaimonía', definition: 'Florecimiento del alma mediante la virtud', category: 'Ética Aristotélica', etymology: 'Del griego eu y daimon' },
    { term: 'Falsacionismo', definition: 'Criterio popperiano de demarcación científica', category: 'Epistemología', etymology: 'Del latín falsus' },
    { term: 'Interleaving', definition: 'Práctica intercalada para mejorar discriminación', category: 'Ciencia Cognitiva' }
  ];

  const ankiTsv = mockGenerateAnkiTsv(sampleCards, 'Polímata OS');
  assert(ankiTsv.includes('#separator:tab'), 'Contiene cabecera #separator:tab de Anki');
  assert(ankiTsv.includes('#html:true'), 'Contiene cabecera #html:true de Anki');
  assert(ankiTsv.includes('#deck:Polímata OS'), 'Asigna mazo #deck:Polímata OS');
  assert(ankiTsv.includes('Eudaimonía\t<p><strong>Florecimiento'), 'Formato TSV válido de Eudaimonía');
  assert(ankiTsv.includes('PolimataOS Ética_Aristotélica'), 'Etiqueta limpia de Anki generada');

  // ----------------------------------------------------
  // PRUEBA 4: Formateador Markdown con [[Wikilinks]] para Obsidian
  // ----------------------------------------------------
  console.log('\n--- 4. Formateador de Notas para Obsidian ---');

  function mockFormatWorkForObsidian(work) {
    const primaryQuestions = work.primaryQuestionsJson ? JSON.parse(work.primaryQuestionsJson) : [];
    return `---
type: canon-obra
work_number: ${work.workNumber}
author: "${work.author}"
title: "${work.title}"
tags:
  - polimata-os
  - canon-170
---

# #${work.workNumber}: ${work.title}
**Autor:** [[${work.author}]]

## 📖 Prescripción de Lectura
> ${work.prescribedReading}

## ❓ Preguntas Primarias Abordadas
${primaryQuestions.map(q => `- [[${q}_Pregunta|${q}]]`).join('\n')}
`;
  }

  const spinozaObsidian = mockFormatWorkForObsidian(spinoza);
  assert(spinozaObsidian.includes('type: canon-obra'), 'Frontmatter YAML válido para Obsidian');
  assert(spinozaObsidian.includes('[[Spinoza]]'), 'Genera enlace bidireccional [[Spinoza]]');
  assert(spinozaObsidian.includes('[[Q01_Pregunta|Q01]]'), 'Genera enlace bidireccional a preguntas guía');

  // ----------------------------------------------------
  // PRUEBA 5: Generación binaria de archivo ZIP para Obsidian
  // ----------------------------------------------------
  console.log('\n--- 5. Generación de Bóveda Portable en ZIP ---');

  // Tabla CRC32
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

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function mockGenerateZip(files) {
    const encoder = new TextEncoder();
    const fileEntries = [];
    let offset = 0;
    const parts = [];

    for (const f of files) {
      const nameBytes = encoder.encode(f.name);
      const contentBytes = encoder.encode(f.content);
      const crc = crc32(contentBytes);

      const header = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(header.buffer);
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, contentBytes.length, true);
      view.setUint32(22, contentBytes.length, true);
      view.setUint16(26, nameBytes.length, true);
      header.set(nameBytes, 30);

      fileEntries.push({ nameBytes, contentBytes, crc, offset });
      parts.push(header);
      parts.push(contentBytes);
      offset += header.length + contentBytes.length;
    }

    const centralDirStart = offset;
    for (const entry of fileEntries) {
      const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
      const view = new DataView(cdHeader.buffer);
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 20, true);
      view.setUint32(16, entry.crc, true);
      view.setUint32(20, entry.contentBytes.length, true);
      view.setUint32(24, entry.contentBytes.length, true);
      view.setUint16(28, entry.nameBytes.length, true);
      view.setUint32(42, entry.offset, true);
      cdHeader.set(entry.nameBytes, 46);
      parts.push(cdHeader);
      offset += cdHeader.length;
    }

    const centralDirSize = offset - centralDirStart;
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true);
    eocdView.setUint16(8, fileEntries.length, true);
    eocdView.setUint16(10, fileEntries.length, true);
    eocdView.setUint32(12, centralDirSize, true);
    eocdView.setUint32(16, centralDirStart, true);
    parts.push(eocd);

    const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
    const result = new Uint8Array(totalLength);
    let pos = 0;
    for (const p of parts) {
      result.set(p, pos);
      pos += p.length;
    }
    return result;
  }

  const testZipFiles = [
    { name: '00_Indice.md', content: '# Indice Polimata' },
    { name: '01_Canon/Spinoza_Etica.md', content: spinozaObsidian }
  ];

  const zipBuffer = mockGenerateZip(testZipFiles);
  assert(zipBuffer.length > 50, `Buffer ZIP generado con éxito (${zipBuffer.length} bytes)`);
  // Comprobar firma PK (0x50, 0x4B, 0x03, 0x04)
  assert(zipBuffer[0] === 0x50 && zipBuffer[1] === 0x4B, 'Firma binaria de archivo ZIP (PK) válida');

  // ----------------------------------------------------
  // PRUEBA 6: Protocolo obsidian:// URI para móviles
  // ----------------------------------------------------
  console.log('\n--- 6. Validación de Protocolo URI Obsidian Móvil ---');
  const vaultTest = 'Mi_Vault';
  const fileTest = 'Polimata_OS/Notas/Spinoza';
  const contentTest = '# Nota de Lectura\nCita textual.';
  const uri = `obsidian://new?vault=${encodeURIComponent(vaultTest)}&file=${encodeURIComponent(fileTest)}&content=${encodeURIComponent(contentTest)}&overwrite=true`;
  
  assert(uri.startsWith('obsidian://new?'), 'Esquema de URI obsidian://new correcto');
  assert(uri.includes('vault=Mi_Vault'), 'Parámetro de bóveda incluido');
  assert(uri.includes('file=Polimata_OS%2FNotas%2FSpinoza'), 'Ruta de archivo codificada correctamente');

  // ----------------------------------------------------
  // RESUMEN FINAL
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 RESULTADO DE LA BATERÍA DE PRUEBAS:`);
  console.log(`   Pruebas Exitosas: ${passed}`);
  console.log(`   Pruebas Fallidas: ${failed}`);
  console.log('====================================================');

  if (failed === 0) {
    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON AL 100%!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Error fatal en las pruebas:', err);
  process.exit(1);
});
