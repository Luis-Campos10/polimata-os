import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { calculateMasteryScore, calculateCalibration, getDeferredReviewDates } from '@/lib/pedagogy/pedagogy';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      targetType,
      targetId,
      rubric,
      predictedScore
    } = body;

    const { totalScore, status } = calculateMasteryScore(rubric);
    const createdAt = new Date().toISOString();

    // Guardar Mastery Score
    const masteryId = `MST_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.insert(schema.masteryScores).values({
      id: masteryId,
      targetType,
      targetId,
      recallScore: rubric.recallScore,
      reconstructionScore: rubric.reconstructionScore,
      conceptualPrecisionScore: rubric.conceptualPrecisionScore,
      argumentationScore: rubric.argumentationScore,
      transferScore: rubric.transferScore,
      synthesisScore: rubric.synthesisScore,
      calibrationScore: rubric.calibrationScore,
      totalScore,
      createdAt
    }).run();

    // Calcular calibración metacognitiva si se indicó predicción
    let currentBias: 'OVERCONFIDENCE' | 'UNDERCONFIDENCE' | 'ACCURATE' | undefined;
    if (predictedScore !== undefined) {
      const { calibrationError, bias } = calculateCalibration({
        predictedScore: Number(predictedScore),
        actualScore: totalScore
      });
      currentBias = bias;

      const calibId = `CAL_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      db.insert(schema.calibrationRecords).values({
        id: calibId,
        targetType,
        targetId,
        predictedScore: Number(predictedScore),
        actualScore: totalScore,
        calibrationError,
        bias,
        createdAt
      }).run();
    }

    // Programar Revisiones Diferidas FSRS-4.5 Adaptativas
    const reviewDates = getDeferredReviewDates(new Date(), totalScore, body.errorTypes || [], currentBias);
    for (const r of reviewDates) {
      const revId = `REV_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      db.insert(schema.reviewSchedules).values({
        id: revId,
        targetType,
        targetId,
        intervalDays: r.intervalDays,
        scheduledDate: r.scheduledDate,
        completed: 0,
        createdAt
      }).run();
    }

    return NextResponse.json({
      success: true,
      masteryId,
      totalScore,
      status,
      scheduledReviewsCount: reviewDates.length
    });
  } catch (error: any) {
    console.error('Error al evaluar dominio:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}

