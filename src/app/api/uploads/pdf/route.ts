import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
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
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const targetId = (formData.get('targetId') as string) || 'W01';
    const targetType = (formData.get('targetType') as string) || 'WEEK';
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos PDF' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedDocs = [];

    for (const file of files) {
      if (!file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generar nombre de archivo único para evitar colisiones
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFileName = `${Date.now()}_${safeName}`;
      const filePathOnDisk = path.join(uploadDir, uniqueFileName);
      const publicUrl = `/uploads/pdfs/${uniqueFileName}`;

      fs.writeFileSync(filePathOnDisk, buffer);

      const docId = `PDF_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const createdAt = new Date().toISOString();

      db.insert(schema.pdfDocuments).values({
        id: docId,
        targetType,
        targetId,
        fileName: file.name,
        filePath: publicUrl,
        fileSize: file.size,
        createdAt,
      }).run();

      savedDocs.push({
        id: docId,
        fileName: file.name,
        filePath: publicUrl,
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de documento requerido' }, { status: 400 });
    }

    const doc = db.select().from(schema.pdfDocuments).where(eq(schema.pdfDocuments.id, id)).get();
    if (doc) {
      // Eliminar archivo físico si existe en public/uploads/pdfs
      const relativePath = doc.filePath.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      db.delete(schema.pdfDocuments).where(eq(schema.pdfDocuments.id, id)).run();
    }

    return NextResponse.json({ success: true, message: 'Documento PDF eliminado permanentemente.' });
  } catch (error: any) {
    console.error('Error al eliminar PDF:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar PDF' }, { status: 500 });
  }
}
