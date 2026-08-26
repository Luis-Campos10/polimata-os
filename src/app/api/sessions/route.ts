import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetType, targetId, durationMinutes, notes } = body;

    if (!notes) {
      return NextResponse.json({ error: 'Falta contenido de notas' }, { status: 400 });
    }

    const id = `SES_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    await db.insert(schema.studySessions).values({
      id,
      targetType: targetType || 'QUICK_NOTE',
      targetId: targetId || 'GENERAL',
      durationMinutes: Number(durationMinutes) || 25,
      notes,
      createdAt,
    });

    return NextResponse.json({ success: true, sessionId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
