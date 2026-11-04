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

export async function getAllCalibrationRecords() {
  try {
    return await db.select().from(schema.calibrationRecords).orderBy(desc(schema.calibrationRecords.createdAt));
  } catch (err) {
    return [];
  }
}

export async function getAllMasteryScores() {
  try {
    return await db.select().from(schema.masteryScores).orderBy(desc(schema.masteryScores.createdAt));
  } catch (err) {
    return [];
  }
}

export async function getAllStudySessions() {
  try {
    return await db.select().from(schema.studySessions).orderBy(desc(schema.studySessions.createdAt));
  } catch (err) {
    return [];
  }
}

export async function getAllAuditFindings() {
  try {
    return await db.select().from(schema.auditFindings).orderBy(desc(schema.auditFindings.createdAt));
  } catch (err) {
    return [];
  }
}

export async function getAllQuestionLedgerEntries(questionId?: string) {
  try {
    if (questionId) {
      return await db.select()
        .from(schema.questionLedger)
        .where(eq(schema.questionLedger.questionId, questionId))
        .orderBy(desc(schema.questionLedger.year));
    }
    return await db.select().from(schema.questionLedger).orderBy(desc(schema.questionLedger.createdAt));
  } catch (err) {
    return [];
  }
}

export async function getAllReviewSchedules() {
  try {
    return await db.select().from(schema.reviewSchedules);
  } catch (err) {
    return [];
  }
}

export interface UserRealMetrics {
  totalStudyMinutes: number;
  studyHoursText: string;
  averageMastery: number;
  completedWeeksCount: number;
  totalEvaluationsCount: number;
  calibrationRecordCount: number;
  avgCalibrationError: number;
  calibrationBiasText: string;
  retentionRate: number;
  completedReviewsCount: number;
  pendingReviewsCount: number;
  errorCounts: {
    omision: number;
    conexionNoJustificada: number;
    distorsion: number;
    total: number;
  };
  errorPercentages: {
    omision: number;
    conexionNoJustificada: number;
    distorsion: number;
  };
  shannonDiversityScore: number;
  activeWeekId: string;
}

export async function getUserRealMetrics(): Promise<UserRealMetrics> {
  const [sessions, masteries, calibrations, reviews, findings, weeks] = await Promise.all([
    getAllStudySessions(),
    getAllMasteryScores(),
    getAllCalibrationRecords(),
    getAllReviewSchedules(),
    getAllAuditFindings(),
    getAllWeeks(),
  ]);

  // 1. Horas de Estudio Real
  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const studyHoursText = (totalStudyMinutes / 60).toFixed(1);

  // 2. Dominio Promedio Real (0 a 100)
  const averageMastery = masteries.length > 0
    ? Math.round(masteries.reduce((acc, m) => acc + m.totalScore, 0) / masteries.length)
    : 0;

  // Semanas completadas con dominio >= 70
  const masteredWeekIds = new Set(
    masteries.filter((m) => m.targetType === 'WEEK' && m.totalScore >= 70).map((m) => m.targetId)
  );
  const completedWeeksCount = masteredWeekIds.size;

  // Semana activa: la primera semana que no esté dominada aún
  const uncompletedWeek = (weeks as any[]).find((w: any) => !masteredWeekIds.has(w.id));
  const activeWeekId = uncompletedWeek ? uncompletedWeek.id : (weeks[0]?.id || 'W01');

  // 3. Calibración Metacognitiva Real
  const calibrationRecordCount = calibrations.length;
  let avgCalibrationError = 0;
  let calibrationBiasText = '± 0.0%';

  if (calibrations.length > 0) {
    const sumError = calibrations.reduce((acc, c) => acc + c.calibrationError, 0);
    avgCalibrationError = parseFloat((sumError / calibrations.length).toFixed(1));
    
    // Contar sobre vs subconfianza
    let over = 0;
    let under = 0;
    calibrations.forEach((c) => {
      if (c.bias === 'OVERCONFIDENCE' || c.predictedScore > c.actualScore) over++;
      else if (c.bias === 'UNDERCONFIDENCE' || c.actualScore > c.predictedScore) under++;
    });

    const sign = over > under ? '+' : under > over ? '-' : '±';
    calibrationBiasText = `${sign}${avgCalibrationError}%`;
  }

  // 4. Retención FSRS Real (+30 / +90 días)
  const completedReviews = reviews.filter((r) => r.completed === 1);
  const pendingReviews = reviews.filter((r) => r.completed === 0);
  let retentionRate = 0;

  if (reviews.length > 0) {
    // Si hay revisiones completadas con puntuación
    const ratedReviews = completedReviews.filter((r) => r.score !== null && r.score !== undefined);
    if (ratedReviews.length > 0) {
      // Score en FSRS va de 1 a 4; 3 (Bien) y 4 (Fácil) cuentan como retención exitosa (>=3)
      const passed = ratedReviews.filter((r) => (r.score as number) >= 3).length;
      retentionRate = Math.round((passed / ratedReviews.length) * 100);
    } else if (completedReviews.length > 0) {
      retentionRate = Math.round((completedReviews.length / reviews.length) * 100);
    }
  }

  // 5. Perfil de Errores Recurrentes (Heurístico)
  let omision = 0;
  let conexion = 0;
  let distorsion = 0;

  findings.forEach((f) => {
    const t = (f.errorType || '').toUpperCase();
    if (t.includes('OMISION') || t.includes('ESTRUCTURA')) omision++;
    else if (t.includes('CONEXION') || t.includes('EVIDENCIA') || t.includes('JUSTIFICADA')) conexion++;
    else if (t.includes('DISTORSION') || t.includes('SESGO') || t.includes('CONFUSION')) distorsion++;
    else omision++; // fallback
  });

  const totalErrors = omision + conexion + distorsion;
  const errorPercentages = {
    omision: totalErrors > 0 ? Math.round((omision / totalErrors) * 100) : 0,
    conexionNoJustificada: totalErrors > 0 ? Math.round((conexion / totalErrors) * 100) : 0,
    distorsion: totalErrors > 0 ? Math.round((distorsion / totalErrors) * 100) : 0,
  };

  // 6. Diversidad Intelectual (Shannon Entropy Approximation)
  // Medida según diversidad de disciplinas y objetivos estudiados
  const distinctTargets = new Set(sessions.map((s) => s.targetType || s.targetId));
  masteries.forEach((m) => distinctTargets.add(m.targetId));
  const categoryCount = distinctTargets.size;
  // Escala a 0 - 100 con curva logarítmica
  const shannonDiversityScore = categoryCount > 0 ? Math.min(100, Math.round(Math.log2(categoryCount + 1) * 28)) : 0;

  return {
    totalStudyMinutes,
    studyHoursText,
    averageMastery,
    completedWeeksCount,
    totalEvaluationsCount: masteries.length,
    calibrationRecordCount,
    avgCalibrationError,
    calibrationBiasText,
    retentionRate,
    completedReviewsCount: completedReviews.length,
    pendingReviewsCount: pendingReviews.length,
    errorCounts: {
      omision,
      conexionNoJustificada: conexion,
      distorsion,
      total: totalErrors,
    },
    errorPercentages,
    shannonDiversityScore,
    activeWeekId,
  };
}
