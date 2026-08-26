import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'polimata.db');

export const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });

const QUESTIONS_DATA = [
  { id: 'Q01', number: 1, title: 'Origen', description: '¿De dónde vienen universo, Tierra, vida y nosotros?' },
  { id: 'Q02', number: 2, title: 'Realidad', description: '¿Qué existe?' },
  { id: 'Q03', number: 3, title: 'Conocimiento', description: '¿Qué podemos conocer y qué es verdad?' },
  { id: 'Q04', number: 4, title: 'Conciencia', description: '¿Qué es la conciencia y cómo se relaciona con cerebro/cuerpo/mundo?' },
  { id: 'Q05', number: 5, title: 'Identidad', description: '¿Qué soy y qué me hace persistir?' },
  { id: 'Q06', number: 6, title: 'Libertad', description: '¿Somos libres y responsables?' },
  { id: 'Q07', number: 7, title: 'Dios/trascendencia', description: '¿Existe Dios o alguna realidad última y qué podemos conocer de ella?' },
  { id: 'Q08', number: 8, title: 'Sentido/muerte/sufrimiento', description: '¿Qué hace significativa una vida frente al sufrimiento, absurdo y muerte?' },
  { id: 'Q09', number: 9, title: 'Amor', description: '¿Qué es amar y qué lugar tienen amor, amistad, deseo y cuidado?' },
  { id: 'Q10', number: 10, title: 'Vida buena', description: '¿Qué es vivir bien?' },
  { id: 'Q11', number: 11, title: 'Moralidad', description: '¿Qué debemos hacer y por qué?' },
  { id: 'Q12', number: 12, title: 'Justicia/poder', description: '¿Qué sociedad es justa y cuándo es legítimo el poder?' },
  { id: 'Q13', number: 13, title: 'Economía/cooperación', description: '¿Cómo producir, intercambiar, distribuir y cooperar?' },
  { id: 'Q14', number: 14, title: 'Belleza/arte', description: '¿Qué son belleza y arte y qué valor tienen?' },
  { id: 'Q15', number: 15, title: 'Ciencia', description: '¿Cómo funciona, qué explica y cuáles son sus límites?' },
  { id: 'Q16', number: 16, title: 'Tecnología/IA', description: '¿Cómo transforman nuestra agencia, conocimiento, trabajo y poder?' },
  { id: 'Q17', number: 17, title: 'Historia/civilización', description: '¿Por qué nacen, cambian, prosperar, chocan y colapsan sociedades?' },
  { id: 'Q18', number: 18, title: 'Futuro', description: '¿Qué debemos preservar, cambiar o crear?' }
];

const PHASE_0_DETAILED_WEEKS = [
  {
    id: 'W01',
    weekNumber: 1,
    title: 'Qué Significa Aprender',
    purpose: 'Construir una concepción científicamente defendible del aprendizaje. Distinguir exposición, familiaridad, comprensión momentánea, recuerdo, retención y dominio.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Qué diferencia existe entre rendimiento durante el estudio y aprendizaje duradero?',
      '¿Por qué subrayar o releer produce ilusión de dominio sin garantizarlo?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'National Academies of Sciences',
        title: 'How People Learn II: Learners, Contexts, and Cultures (2018)',
        type: 'Informe / Libro académico',
        priority: 'NÚCLEO',
        whatToStudy: 'Summary, Introducción, secciones sobre memoria, conocimiento previo, metacognición y transferencia.',
        skill: 'REPORT/TEXTBOOK'
      },
      {
        author: 'Dunlosky et al.',
        title: 'Improving Students’ Learning With Effective Learning Techniques (2013)',
        type: 'Revisión académica extensa',
        priority: 'NÚCLEO',
        whatToStudy: 'Secciones de practice testing, distributed practice, interleaved practice, self-explanation.',
        skill: 'PAPER_REVIEW'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Experimento A/B de Retención (Lectura vs Retrieval)',
      conditionA: 'Lectura pasiva',
      conditionB: 'Recuperación activa libre'
    }),
    productPrescription: 'SEM01_MODELO_PERSONAL_DE_APRENDIZAJE.md',
    productDescription: 'Documento personal con tu concepción científica del aprendizaje.',
    examSpecification: '20 preguntas sobre metacognición y memoria. Dominio ≥85%.'
  },
  {
    id: 'W02',
    weekNumber: 2,
    title: 'Retrieval Practice (Recuperación Activa)',
    purpose: 'Convertir la recuperación activa en el núcleo operativo de estudio. Dominar free recall, cued recall y retrieval con feedback.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Por qué evaluar la memoria produce más retención que volver a estudiar?',
      '¿Cómo diseñar preguntas de alto nivel cognitivo?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Roediger & Karpicke',
        title: 'Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention (2006)',
        type: 'Paper experimental',
        priority: 'NÚCLEO',
        whatToStudy: 'Paper completo.',
        skill: 'PAPER_EMPIRICAL'
      }
    ]),
    laboratoryJson: JSON.stringify({ name: 'Práctica de Recall Cerrado' }),
    productPrescription: 'PROTOCOLO_RETRIEVAL_POLIMATA_V1.md',
    productDescription: 'Protocolo ejecutable para preguntas ciegas y free recall.',
    examSpecification: '20 preguntas sobre testing effect.'
  }
];

function parseV6Works(filePath: string) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const worksList: any[] = [];
  let currentYear = 1;
  const lines = content.split('\n');
  let currentWork: any = null;

  for (const line of lines) {
    const yearMatch = line.match(/^#\s+AÑO\s+(\d+)/i);
    if (yearMatch) {
      currentYear = parseInt(yearMatch[1], 10);
      continue;
    }

    const workMatch = line.match(/^##\s+(\d+)\.\s+(.*?)\s+---\s+\*(.*?)\*/);
    if (workMatch) {
      if (currentWork) worksList.push(currentWork);
      const num = parseInt(workMatch[1], 10);
      currentWork = {
        id: `WORK_${String(num).padStart(3, '0')}`,
        workNumber: num,
        year: currentYear,
        author: workMatch[2].trim(),
        title: workMatch[3].trim(),
        level: 'B',
        documentType: 'BOOK',
        prescribedReading: 'Obra completa o selecciones según plan.',
        primaryQuestionsJson: JSON.stringify(['Q01', 'Q02']),
        secondaryQuestionsJson: JSON.stringify([])
      };
    } else if (currentWork) {
      const levelMatch = line.match(/Nivel:\s*([A-C](\/[A-C])?)/i);
      if (levelMatch) currentWork.level = levelMatch[1].trim();
      const questionsMatch = line.match(/Preguntas:\s*`(.*?)`/i);
      if (questionsMatch) {
        const qList = questionsMatch[1].split(',').map(q => q.trim());
        currentWork.primaryQuestionsJson = JSON.stringify(qList.slice(0, 3));
      }
      const readingMatch = line.match(/Qué leer:\s*(.*)/i);
      if (readingMatch) currentWork.prescribedReading = readingMatch[1].trim();
    }
  }
  if (currentWork) worksList.push(currentWork);
  return worksList;
}

export async function initDb() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS question_ledger (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      position_summary TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      arguments_json TEXT,
      objections_json TEXT,
      evidence_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );

    CREATE TABLE IF NOT EXISTS weeks (
      id TEXT PRIMARY KEY,
      week_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      purpose TEXT NOT NULL,
      target_hours TEXT NOT NULL,
      guide_questions_json TEXT NOT NULL,
      resources_json TEXT NOT NULL,
      laboratory_json TEXT NOT NULL,
      product_prescription TEXT NOT NULL,
      product_description TEXT NOT NULL,
      exam_specification TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      work_number INTEGER NOT NULL,
      year INTEGER NOT NULL,
      author TEXT NOT NULL,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      document_type TEXT NOT NULL,
      prescribed_reading TEXT NOT NULL,
      primary_questions_json TEXT NOT NULL,
      secondary_questions_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS knowledge_nodes (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      node_type TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS knowledge_edges (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation_type TEXT NOT NULL,
      justification TEXT,
      approved_by_user INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (source_id) REFERENCES knowledge_nodes(id),
      FOREIGN KEY (target_id) REFERENCES knowledge_nodes(id)
    );

    CREATE TABLE IF NOT EXISTS pdf_documents (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      attempt_type TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_findings (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      error_type TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id)
    );

    CREATE TABLE IF NOT EXISTS calibration_records (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      predicted_score INTEGER NOT NULL,
      actual_score INTEGER NOT NULL,
      calibration_error INTEGER NOT NULL,
      bias TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mastery_scores (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      recall_score INTEGER NOT NULL,
      reconstruction_score INTEGER NOT NULL,
      conceptual_precision_score INTEGER NOT NULL,
      argumentation_score INTEGER NOT NULL,
      transfer_score INTEGER NOT NULL,
      synthesis_score INTEGER NOT NULL,
      calibration_score INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS review_schedules (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      interval_days INTEGER NOT NULL,
      scheduled_date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      score INTEGER,
      created_at TEXT NOT NULL
    );
  `);

  // AUTO-SEED SI LA BASE DE DATOS ESTÁ VACÍA (EN VERCEL / PRODUCCIÓN)
  try {
    const checkWorks = await client.execute('SELECT COUNT(*) as count FROM works');
    const count = Number(checkWorks.rows[0]?.count || 0);

    if (count === 0) {
      console.log('🌱 Auto-sembrando base de datos inicial para Vercel...');

      for (const q of QUESTIONS_DATA) {
        await db.insert(schema.questions).values(q).onConflictDoNothing();
      }

      for (const w of PHASE_0_DETAILED_WEEKS) {
        await db.insert(schema.weeks).values(w).onConflictDoNothing();
      }

      const v6Path = path.join(process.cwd(), 'PROYECTO_POLIMATA_V6_MASTER_EJECUTABLE_170 (1).md');
      const parsedWorks = parseV6Works(v6Path);

      for (const w of parsedWorks) {
        await db.insert(schema.works).values(w).onConflictDoNothing();
      }

      const initialNodes = [
        { id: 'NODE_PLATON', label: 'Platón', nodeType: 'Author', description: 'Filósofo griego clásico', createdAt: new Date().toISOString() },
        { id: 'NODE_APOLOGIA', label: 'Apología de Sócrates', nodeType: 'Work', description: 'Obra sobre la defensa de Sócrates', createdAt: new Date().toISOString() },
        { id: 'NODE_ROEDIGER', label: 'Roediger & Karpicke', nodeType: 'Author', description: 'Investigadores de ciencia cognitiva', createdAt: new Date().toISOString() },
        { id: 'NODE_TESTING_EFFECT', label: 'Testing Effect', nodeType: 'Concept', description: 'Recuperar información refuerza la memoria duradera', createdAt: new Date().toISOString() }
      ];

      for (const n of initialNodes) {
        await db.insert(schema.knowledgeNodes).values(n).onConflictDoNothing();
      }

      const initialEdges = [
        { id: 'EDGE_01', sourceId: 'NODE_PLATON', targetId: 'NODE_APOLOGIA', relationType: 'DEVELOPS', justification: 'Platón escribió la Apología.', approvedByUser: 1, createdAt: new Date().toISOString() },
        { id: 'EDGE_02', sourceId: 'NODE_ROEDIGER', targetId: 'NODE_TESTING_EFFECT', relationType: 'EVIDENCE_FOR', justification: 'Experimento de 2006.', approvedByUser: 1, createdAt: new Date().toISOString() }
      ];

      for (const e of initialEdges) {
        await db.insert(schema.knowledgeEdges).values(e).onConflictDoNothing();
      }

      console.log('✅ Auto-sembrado completado con éxito.');
    }
  } catch (err) {
    console.error('Error en auto-sembrado:', err);
  }
}
