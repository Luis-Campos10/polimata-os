import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { getQuestionLedger, getAllQuestionLedgerEntries } from '@/lib/db/queries';

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    const entries = questionId
      ? await getQuestionLedger(questionId)
      : await getAllQuestionLedgerEntries();
    return NextResponse.json({ entries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const { questionId, positionSummary, confidence, argument, falsationCriteria } = body;

    if (!questionId || !positionSummary) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    const id = `QL_${questionId}_${Date.now()}`;
    const year = new Date().getFullYear();
    const createdAt = new Date().toISOString();

    await db.insert(schema.questionLedger).values({
      id,
      questionId,
      year,
      positionSummary,
      confidence: Number(confidence) || 75,
      argumentsJson: argument ? JSON.stringify([argument]) : JSON.stringify([]),
      objectionsJson: falsationCriteria ? JSON.stringify([falsationCriteria]) : JSON.stringify([]),
      evidenceJson: JSON.stringify([]),
      createdAt,
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
