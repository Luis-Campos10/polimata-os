import { db } from './index';
import * as schema from './schema';
import { eq, asc, desc, and } from 'drizzle-orm';

export async function getAllQuestions() {
  return await db.select().from(schema.questions).orderBy(asc(schema.questions.number));
}

export async function getQuestionLedger(questionId: string) {
  return await db.select()
    .from(schema.questionLedger)
    .where(eq(schema.questionLedger.questionId, questionId))
    .orderBy(desc(schema.questionLedger.year));
}

export async function getAllWeeks() {
  return await db.select().from(schema.weeks).orderBy(asc(schema.weeks.weekNumber));
}

export async function getWeekById(id: string) {
  const results = await db.select().from(schema.weeks).where(eq(schema.weeks.id, id));
  return results[0] || null;
}

export async function getAllWorks() {
  return await db.select().from(schema.works).orderBy(asc(schema.works.workNumber));
}

export async function getWorksByYear(year: number) {
  return await db.select().from(schema.works).where(eq(schema.works.year, year)).orderBy(asc(schema.works.workNumber));
}

export async function getWorkById(id: string) {
  const results = await db.select().from(schema.works).where(eq(schema.works.id, id));
  return results[0] || null;
}

export async function getKnowledgeNodes() {
  return await db.select().from(schema.knowledgeNodes);
}

export async function getKnowledgeEdges() {
  return await db.select().from(schema.knowledgeEdges);
}

export async function getAttemptsForTarget(targetType: string, targetId: string) {
  return await db.select()
    .from(schema.attempts)
    .where(and(eq(schema.attempts.targetType, targetType), eq(schema.attempts.targetId, targetId)))
    .orderBy(desc(schema.attempts.createdAt));
}

export async function getMasteryScore(targetType: string, targetId: string) {
  const results = await db.select()
    .from(schema.masteryScores)
    .where(and(eq(schema.masteryScores.targetType, targetType), eq(schema.masteryScores.targetId, targetId)))
    .orderBy(desc(schema.masteryScores.createdAt));
  return results[0] || null;
}

export async function getPendingReviews() {
  return await db.select()
    .from(schema.reviewSchedules)
    .where(eq(schema.reviewSchedules.completed, 0));
}
