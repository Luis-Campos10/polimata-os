import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export async function GET() {
  try {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      questions: db.select().from(schema.questions).all(),
      questionLedger: db.select().from(schema.questionLedger).all(),
      weeks: db.select().from(schema.weeks).all(),
      works: db.select().from(schema.works).all(),
      knowledgeNodes: db.select().from(schema.knowledgeNodes).all(),
      knowledgeEdges: db.select().from(schema.knowledgeEdges).all(),
      studySessions: db.select().from(schema.studySessions).all(),
      attempts: db.select().from(schema.attempts).all(),
      auditFindings: db.select().from(schema.auditFindings).all(),
      calibrationRecords: db.select().from(schema.calibrationRecords).all(),
      masteryScores: db.select().from(schema.masteryScores).all(),
      reviewSchedules: db.select().from(schema.reviewSchedules).all(),
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=polimata_os_backup_${new Date().toISOString().split('T')[0]}.json`,
      },
    });
  } catch (error: any) {
    console.error('Error al exportar respaldo:', error);
    return NextResponse.json({ error: error.message || 'Error al exportar' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data || !data.version) {
      return NextResponse.json({ error: 'Formato de respaldo no válido' }, { status: 400 });
    }

    // Restaurar tablas si existen en el JSON de respaldo
    if (Array.isArray(data.questionLedger)) {
      for (const item of data.questionLedger) {
        db.insert(schema.questionLedger).values(item).onConflictDoNothing().run();
      }
    }

    if (Array.isArray(data.knowledgeNodes)) {
      for (const item of data.knowledgeNodes) {
        db.insert(schema.knowledgeNodes).values(item).onConflictDoNothing().run();
      }
    }

    if (Array.isArray(data.knowledgeEdges)) {
      for (const item of data.knowledgeEdges) {
        db.insert(schema.knowledgeEdges).values(item).onConflictDoNothing().run();
      }
    }

    if (Array.isArray(data.studySessions)) {
      for (const item of data.studySessions) {
        db.insert(schema.studySessions).values(item).onConflictDoNothing().run();
      }
    }

    if (Array.isArray(data.attempts)) {
      for (const item of data.attempts) {
        db.insert(schema.attempts).values(item).onConflictDoNothing().run();
      }
    }

    if (Array.isArray(data.masteryScores)) {
      for (const item of data.masteryScores) {
        db.insert(schema.masteryScores).values(item).onConflictDoNothing().run();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Base de datos restaurada correctamente desde el respaldo.',
    });
  } catch (error: any) {
    console.error('Error al importar respaldo:', error);
    return NextResponse.json({ error: error.message || 'Error al restaurar' }, { status: 500 });
  }
}
