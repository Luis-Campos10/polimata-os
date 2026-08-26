import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { getQuestionLedger } from '@/lib/db/queries';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    if (!questionId) {
      return NextResponse.json({ error: 'Falta questionId' }, { status: 400 });
    }
    const entries = await getQuestionLedger(questionId);
    return NextResponse.json({ entries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, positionSummary, confidence, argument } = body;

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
      objectionsJson: JSON.stringify([]),
      evidenceJson: JSON.stringify([]),
      createdAt,
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
