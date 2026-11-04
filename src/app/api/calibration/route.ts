import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    await initDb();
    const records = await db.select().from(schema.calibrationRecords).orderBy(desc(schema.calibrationRecords.createdAt));
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const {
      targetType = 'DIAGNOSTIC_EXAM',
      targetId = 'SOCRATIC_EXAM_01',
      predictedScore,
      actualScore,
      calibrationError,
      bias,
    } = body;

    if (predictedScore === undefined || actualScore === undefined) {
      return NextResponse.json({ error: 'Faltan predictedScore y actualScore' }, { status: 400 });
    }

    const calculatedError = calibrationError !== undefined
      ? Number(calibrationError)
      : Math.abs(Number(predictedScore) - Number(actualScore));

    const calculatedBias = bias || (
      Number(predictedScore) > Number(actualScore) + 5
        ? 'OVERCONFIDENCE'
        : Number(actualScore) > Number(predictedScore) + 5
        ? 'UNDERCONFIDENCE'
        : 'ACCURATE'
    );

    const id = `CAL_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    await db.insert(schema.calibrationRecords).values({
      id,
      targetType,
      targetId,
      predictedScore: Math.round(Number(predictedScore)),
      actualScore: Math.round(Number(actualScore)),
      calibrationError: Math.round(calculatedError),
      bias: calculatedBias,
      createdAt,
    });

    return NextResponse.json({
      success: true,
      calibrationId: id,
      calibrationError: Math.round(calculatedError),
      bias: calculatedBias,
    });
  } catch (error: any) {
    console.error('Error al guardar calibración:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
