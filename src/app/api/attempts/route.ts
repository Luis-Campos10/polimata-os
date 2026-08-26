import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { getDeferredReviewDates } from '@/lib/pedagogy/pedagogy';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetType, targetId, attemptType, content } = body;

    if (!targetType || !targetId || !content) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    const id = `ATT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    // Guardar intento con estado OWN_EFFORT_COMPLETED para desbloquear auditoria
    db.insert(schema.attempts).values({
      id,
      targetType,
      targetId,
      attemptType: attemptType || 'FREE_RECALL',
      content,
      status: 'OWN_EFFORT_COMPLETED',
      createdAt
    }).run();

    // Programar automáticamente revisiones diferidas (+7, +30, +90, +365) si no existen
    const reviewDates = getDeferredReviewDates(new Date());
    for (const rd of reviewDates) {
      const revId = `REV_${Date.now()}_${rd.intervalDays}_${Math.random().toString(36).substring(2, 5)}`;
      db.insert(schema.reviewSchedules).values({
        id: revId,
        targetType,
        targetId,
        intervalDays: rd.intervalDays,
        scheduledDate: rd.scheduledDate,
        completed: 0,
        createdAt
      }).run();
    }

    return NextResponse.json({ success: true, attemptId: id, status: 'OWN_EFFORT_COMPLETED' });
  } catch (error: any) {
    console.error('Error al guardar intento:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
