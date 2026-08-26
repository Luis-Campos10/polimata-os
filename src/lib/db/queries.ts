import { db, QUESTIONS_DATA, PHASE_0_DETAILED_WEEKS } from './index';
import * as schema from './schema';
import { eq, asc, desc, and } from 'drizzle-orm';
import canonWorksStatic from './canon_works_static.json';

const INITIAL_NODES = [
  { id: 'NODE_PLATON', label: 'Platón', nodeType: 'Author', description: 'Filósofo griego clásico', createdAt: new Date().toISOString() },
  { id: 'NODE_APOLOGIA', label: 'Apología de Sócrates', nodeType: 'Work', description: 'Obra sobre la defensa de Sócrates', createdAt: new Date().toISOString() },
  { id: 'NODE_ROEDIGER', label: 'Roediger & Karpicke', nodeType: 'Author', description: 'Investigadores de ciencia cognitiva de la memoria', createdAt: new Date().toISOString() },
  { id: 'NODE_TESTING_EFFECT', label: 'Testing Effect (Efecto Evaluación)', nodeType: 'Concept', description: 'Recuperar información refuerza la memoria duradera más que releer', createdAt: new Date().toISOString() }
];

const INITIAL_EDGES = [
  { id: 'EDGE_01', sourceId: 'NODE_PLATON', targetId: 'NODE_APOLOGIA', relationType: 'DEVELOPS', justification: 'Platón escribió la Apología.', approvedByUser: 1, createdAt: new Date().toISOString() },
  { id: 'EDGE_02', sourceId: 'NODE_ROEDIGER', targetId: 'NODE_TESTING_EFFECT', relationType: 'EVIDENCE_FOR', justification: 'Experimento de 2006.', approvedByUser: 1, createdAt: new Date().toISOString() }
];

export async function getAllQuestions() {
  try {
    const res = await db.select().from(schema.questions).orderBy(asc(schema.questions.number));
    return res.length > 0 ? res : QUESTIONS_DATA as any;
  } catch (err) {
    console.warn('Fallback in-memory para getAllQuestions:', err);
    return QUESTIONS_DATA as any;
  }
}

export async function getQuestionLedger(questionId: string) {
  try {
    return await db.select()
      .from(schema.questionLedger)
      .where(eq(schema.questionLedger.questionId, questionId))
      .orderBy(desc(schema.questionLedger.year));
  } catch (err) {
    console.warn('Fallback in-memory para getQuestionLedger:', err);
    return [];
  }
}

export async function getAllWeeks() {
  try {
    const res = await db.select().from(schema.weeks).orderBy(asc(schema.weeks.weekNumber));
    return res.length > 0 ? res : PHASE_0_DETAILED_WEEKS as any;
  } catch (err) {
    console.warn('Fallback in-memory para getAllWeeks:', err);
    return PHASE_0_DETAILED_WEEKS as any;
  }
}

export async function getWeekById(id: string) {
  try {
    const results = await db.select().from(schema.weeks).where(eq(schema.weeks.id, id));
    if (results[0]) return results[0];
  } catch (err) {
    console.warn('Fallback in-memory para getWeekById:', err);
  }
  const match = PHASE_0_DETAILED_WEEKS.find(w => w.id === id);
  return (match || PHASE_0_DETAILED_WEEKS[0]) as any;
}

export async function getAllWorks() {
  try {
    const res = await db.select().from(schema.works).orderBy(asc(schema.works.workNumber));
    return res.length > 0 ? res : canonWorksStatic as any;
  } catch (err) {
    console.warn('Fallback in-memory para getAllWorks:', err);
    return canonWorksStatic as any;
  }
}

export async function getWorksByYear(year: number) {
  try {
    const res = await db.select().from(schema.works).where(eq(schema.works.year, year)).orderBy(asc(schema.works.workNumber));
    if (res.length > 0) return res;
  } catch (err) {
    console.warn('Fallback in-memory para getWorksByYear:', err);
  }
  return canonWorksStatic.filter(w => w.year === year) as any;
}

export async function getWorkById(id: string) {
  try {
    const results = await db.select().from(schema.works).where(eq(schema.works.id, id));
    if (results[0]) return results[0];
  } catch (err) {
    console.warn('Fallback in-memory para getWorkById:', err);
  }
  const match = canonWorksStatic.find(w => w.id === id);
  return (match || canonWorksStatic[0]) as any;
}

export async function getKnowledgeNodes() {
  try {
    const res = await db.select().from(schema.knowledgeNodes);
    return res.length > 0 ? res : INITIAL_NODES as any;
  } catch (err) {
    console.warn('Fallback in-memory para getKnowledgeNodes:', err);
    return INITIAL_NODES as any;
  }
}

export async function getKnowledgeEdges() {
  try {
    const res = await db.select().from(schema.knowledgeEdges);
    return res.length > 0 ? res : INITIAL_EDGES as any;
  } catch (err) {
    console.warn('Fallback in-memory para getKnowledgeEdges:', err);
    return INITIAL_EDGES as any;
  }
}

export async function getAttemptsForTarget(targetType: string, targetId: string) {
  try {
    return await db.select()
      .from(schema.attempts)
      .where(and(eq(schema.attempts.targetType, targetType), eq(schema.attempts.targetId, targetId)))
      .orderBy(desc(schema.attempts.createdAt));
  } catch (err) {
    return [];
  }
}

export async function getMasteryScore(targetType: string, targetId: string) {
  try {
    const results = await db.select()
      .from(schema.masteryScores)
      .where(and(eq(schema.masteryScores.targetType, targetType), eq(schema.masteryScores.targetId, targetId)))
      .orderBy(desc(schema.masteryScores.createdAt));
    return results[0] || null;
  } catch (err) {
    return null;
  }
}

export async function getPendingReviews() {
  try {
    return await db.select()
      .from(schema.reviewSchedules)
      .where(eq(schema.reviewSchedules.completed, 0));
  } catch (err) {
    return [];
  }
}
