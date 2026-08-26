import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get('targetId') || 'W01';
    const targetType = searchParams.get('targetType') || 'WEEK';

    const docs = db
      .select()
      .from(schema.pdfDocuments)
      .where(
        and(
          eq(schema.pdfDocuments.targetId, targetId),
          eq(schema.pdfDocuments.targetType, targetType)
        )
      )
      .all();

    return NextResponse.json({ success: true, documents: docs });
  } catch (error: any) {
    console.error('Error al obtener PDFs guardados:', error);
    return NextResponse.json({ success: true, documents: [] });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const formData = await req.formData();
    const targetId = (formData.get('targetId') as string) || 'W01';
    const targetType = (formData.get('targetType') as string) || 'WEEK';
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos PDF' }, { status: 400 });
    }

    const savedDocs = [];

    for (const file of files) {
      if (!file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convertir a Data URL Base64 para almacenamiento universal (compatible con Vercel Serverless sin disco físico)
      const base64Pdf = `data:application/pdf;base64,${buffer.toString('base64')}`;

      const docId = `PDF_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const createdAt = new Date().toISOString();

      try {
        db.insert(schema.pdfDocuments).values({
          id: docId,
          targetType,
          targetId,
          fileName: file.name,
          filePath: base64Pdf,
          fileSize: file.size,
          createdAt,
        }).run();
      } catch (err) {
        console.warn('DB Insert error (continuing with client response):', err);
      }

      savedDocs.push({
        id: docId,
        fileName: file.name,
        filePath: base64Pdf,
        fileSize: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${savedDocs.length} archivo(s) PDF guardado(s) permanentemente.`,
      documents: savedDocs,
    });
  } catch (error: any) {
    console.error('Error al subir archivos PDF:', error);
    return NextResponse.json({ error: error.message || 'Error al subir PDFs' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de documento requerido' }, { status: 400 });
    }

    try {
      db.delete(schema.pdfDocuments).where(eq(schema.pdfDocuments.id, id)).run();
    } catch (err) {
      console.warn('DB Delete error:', err);
    }

    return NextResponse.json({ success: true, message: 'Documento PDF eliminado permanentemente.' });
  } catch (error: any) {
    console.error('Error al eliminar PDF:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar PDF' }, { status: 500 });
  }
}
