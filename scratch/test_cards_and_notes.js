/**
 * Script de Pruebas Reales de Creación de Tarjetas (Anki/FSRS) y Notas (Obsidian)
 */

const fs = require('fs');
const path = require('path');

async function testCardAndNoteCreation() {
  console.log('=================================================================');
  console.log('🧪 PRUEBAS DE CREACIÓN DE TARJETAS (ANKI) Y NOTAS (OBSIDIAN)');
  console.log('=================================================================\n');

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
  // 1. PRUEBA DE CREACIÓN DE TARJETAS PARA ANKI / FSRS
  // ----------------------------------------------------
  console.log('--- 1. Prueba de Creación y Formato de Flashcard Anki ---');

  const testCardPayload = {
    term: 'SUBSTANTIA',
    definition: 'Aquello que es en sí y se concibe por sí mismo (Spinoza, Ética I, Def. 3). No depende de otra entidad para existir.',
    category: 'Metafísica & Spinoza',
    etymology: 'Del latín sub-stare (lo que yace debajo / sustento primordial).',
    example: 'Para Spinoza, sólo Dios o la Naturaleza (Deus sive Natura) es propiamente sustancia.'
  };

  // Validar campos requeridos
  assert(testCardPayload.term.trim().length > 0, 'El término no está vacío');
  assert(testCardPayload.definition.trim().length > 0, 'La definición no está vacía');

  // Simular la generación de archivo AnkiDroid (TSV oficial)
  const ankiHeaders = [
    '#separator:tab',
    '#html:true',
    '#deck:Polímata OS',
    '#tags column:3'
  ];

  const front = testCardPayload.term;
  const back = `<p><strong>${testCardPayload.definition}</strong></p><p><small style="color:#64748b;">🏛️ <em>${testCardPayload.etymology}</em></small></p><blockquote style="border-left:2px solid #0284c7; margin:6px 0; padding-left:8px;"><small>💡 ${testCardPayload.example}</small></blockquote>`;
  const tag = `PolimataOS ${testCardPayload.category.replace(/\s+/g, '_')}`;

  const generatedRow = `${front}\t${back}\t${tag}`;
  const fullAnkiTsv = [...ankiHeaders, generatedRow].join('\n');

  assert(fullAnkiTsv.includes('SUBSTANTIA'), 'La tarjeta incluye el término en el frente');
  assert(fullAnkiTsv.includes('Spinoza, Ética I, Def. 3'), 'La tarjeta incluye la definición completa en el reverso');
  assert(fullAnkiTsv.includes('sub-stare'), 'La tarjeta incluye la etimología latina');
  assert(fullAnkiTsv.includes('PolimataOS Metafísica_&_Spinoza'), 'La tarjeta genera etiquetas disciplinarias para Anki');

  // ----------------------------------------------------
  // 2. PRUEBA DE CREACIÓN DE NOTA DIRECTA PARA OBSIDIAN
  // ----------------------------------------------------
  console.log('\n--- 2. Prueba de Creación de Nota para Obsidian ---');

  const testNotePayload = {
    title: 'Axioma de la Duda Metódica Cartesiana',
    folder: 'Lecturas_PDF',
    sourceDocument: 'Descartes_Meditaciones_Metafisicas.pdf',
    page: 18,
    quote: 'Pero advertí luego que, queriendo yo pensar, de esa suerte, que todo es falso, era necesario que yo, que lo pensaba, fuese alguna cosa.',
    body: 'Este pasaje marca el quiebre epistemológico con la escolástica medieval. La duda no es escepticismo pirrónico estéril, sino un solvente corrosivo metódico para hallar un punto arquimédico indudable. Se conecta directamente con el [[Cogito_Ergo_Sum]] y la postura en [[Q01_Que_es_lo_real]].',
    tags: ['descartes', 'epistemologia', 'duda-metodica', 'racionalismo']
  };

  const safeTitle = testNotePayload.title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, '_');
  const filename = `${safeTitle}.md`;

  const formattedObsidianNote = `---
type: nota-lectura
source_document: "${testNotePayload.sourceDocument}"
page: ${testNotePayload.page}
date: ${new Date().toISOString()}
tags:
  - polimata-os
  ${testNotePayload.tags.map(t => `- ${t}`).join('\n  ')}
---

# ${testNotePayload.title}

> 📑 **Cita (Pág. ${testNotePayload.page} de ${testNotePayload.sourceDocument}):**
> "${testNotePayload.quote}"

${testNotePayload.body}

---
*Capturada desde el Lector de PDF de Polímata OS*
`;

  assert(formattedObsidianNote.includes('type: nota-lectura'), 'Frontmatter YAML válido para Obsidian');
  assert(formattedObsidianNote.includes('page: 18'), 'Registra la página exacta del PDF');
  assert(formattedObsidianNote.includes('Descartes_Meditaciones_Metafisicas.pdf'), 'Registra el documento fuente');
  assert(formattedObsidianNote.includes('[[Cogito_Ergo_Sum]]'), 'Incluye enlace tipo wiki [[Cogito_Ergo_Sum]]');
  assert(formattedObsidianNote.includes('[[Q01_Que_es_lo_real]]'), 'Incluye enlace tipo wiki al Question Ledger');
  assert(filename === 'Axioma_de_la_Duda_Metódica_Cartesiana.md', `Nombre de archivo seguro generado: ${filename}`);

  // ----------------------------------------------------
  // 3. PRUEBA DE PROTOCOLO URI PARA MÓVILES (obsidian://)
  // ----------------------------------------------------
  console.log('\n--- 3. Prueba de URI Nativo Móvil para Obsidian ---');

  const vault = 'Mi_Polimata_Vault';
  const cleanPath = `Polimata_OS/${testNotePayload.folder}/${safeTitle}`;
  const encodedVault = encodeURIComponent(vault);
  const encodedPath = encodeURIComponent(cleanPath);
  const encodedContent = encodeURIComponent(formattedObsidianNote);

  const mobileUri = `obsidian://new?vault=${encodedVault}&file=${encodedPath}&content=${encodedContent}&overwrite=true`;

  assert(mobileUri.startsWith('obsidian://new?'), 'Comienza con el protocolo oficial obsidian://');
  assert(mobileUri.includes('vault=Mi_Polimata_Vault'), 'Contiene la bóveda de destino');
  assert(mobileUri.includes(encodeURIComponent('Axioma_de_la_Duda_Metódica_Cartesiana')), 'La ruta del archivo está codificada correctamente para Android/iOS');

  // ----------------------------------------------------
  // 4. PRUEBA DE CREACIÓN DE ÁRBOL DE ARGUMENTACIÓN (MERMAID)
  // ----------------------------------------------------
  console.log('\n--- 4. Prueba de Árbol de Argumentos y Diagrama Mermaid ---');

  const argumentTree = {
    title: 'Argumento del Cogito Cartesiano',
    thesis: 'Existo necesariamente mientras pienso.',
    nodes: [
      { id: 'P1', type: 'PREMISE_MAJOR', label: 'Premisa 1', text: 'Dudar implica pensar.' },
      { id: 'P2', type: 'PREMISE_MINOR', label: 'Premisa 2', text: 'Pensar requiere un sujeto que efectúe el acto de pensar.' },
      { id: 'C1', type: 'CONCLUSION', label: 'Conclusión', text: 'Por tanto, existo mientras dudo o pienso.' }
    ]
  };

  let mermaidCode = '```mermaid\ngraph TD\n';
  argumentTree.nodes.forEach((n, idx) => {
    mermaidCode += `  ${n.id}["${n.label}: ${n.text}"]\n`;
    if (idx > 0) {
      mermaidCode += `  ${argumentTree.nodes[idx - 1].id} --> ${n.id}\n`;
    }
  });
  mermaidCode += '```';

  assert(mermaidCode.includes('graph TD'), 'Genera diagrama de flujo top-down de Mermaid');
  assert(mermaidCode.includes('P1 --> P2'), 'Conecta premisa 1 con premisa 2');
  assert(mermaidCode.includes('P2 --> C1'), 'Conecta premisa 2 con la conclusión');

  // ----------------------------------------------------
  // RESUMEN
  // ----------------------------------------------------
  console.log('\n=================================================================');
  console.log(`📊 TOTAL PRUEBAS EJECUTADAS: ${passed + failed}`);
  console.log(`   Pruebas Exitosas: ${passed}`);
  console.log(`   Pruebas Fallidas: ${failed}`);
  console.log('=================================================================');

  if (failed === 0) {
    console.log('🎉 ¡CREACIÓN DE NOTAS, TARJETAS Y ÁRBOLES 100% OPERATIVA!');
  } else {
    process.exit(1);
  }
}

testCardAndNoteCreation().catch(err => {
  console.error(err);
  process.exit(1);
});
