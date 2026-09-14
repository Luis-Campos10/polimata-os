import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    await initDb();
    const list = await db.select().from(schema.argumentTrees).orderBy(desc(schema.argumentTrees.createdAt));
    return NextResponse.json({ success: true, trees: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();

    const { title, authorOrSource, workNumber, thesisStatement, nodes, edges, validityScore } = body;

    if (!title || !thesisStatement) {
      return NextResponse.json({ success: false, error: 'Título y Tesis son obligatorios' }, { status: 400 });
    }

    const newTree = {
      id: `TREE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      authorOrSource: authorOrSource?.trim() || 'Estudio Polímata',
      workNumber: workNumber ? Number(workNumber) : null,
      thesisStatement: thesisStatement.trim(),
      nodesJson: JSON.stringify(nodes || []),
      edgesJson: JSON.stringify(edges || []),
      validityScore: validityScore !== undefined ? Number(validityScore) : 100,
      createdAt: new Date().toISOString(),
    };

    await db.insert(schema.argumentTrees).values(newTree);

    return NextResponse.json({ success: true, tree: newTree });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });

    await db.delete(schema.argumentTrees).where(eq(schema.argumentTrees.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
