import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, errorType, description } = body;

    if (!errorType || !description) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const id = `AUD_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = new Date().toISOString();

    await db.insert(schema.auditFindings).values({
      id,
      attemptId: attemptId || 'GENERAL_ATTEMPT',
      errorType,
      description,
      createdAt,
    });

    return NextResponse.json({ success: true, auditId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
