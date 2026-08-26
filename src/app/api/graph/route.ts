import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { getKnowledgeNodes, getKnowledgeEdges } from '@/lib/db/queries';

export async function GET() {
  try {
    const nodes = await getKnowledgeNodes();
    const edges = await getKnowledgeEdges();
    return NextResponse.json({ nodes, edges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, node, edge } = body;

    if (action === 'addNode' && node) {
      const id = `NODE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await db.insert(schema.knowledgeNodes).values({
        id,
        label: node.label,
        nodeType: node.nodeType || 'Concept',
        description: node.description || '',
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, nodeId: id });
    }

    if (action === 'addEdge' && edge) {
      const id = `EDGE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await db.insert(schema.knowledgeEdges).values({
        id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relationType: edge.relationType || 'DEPENDS_ON',
        justification: edge.justification || '',
        approvedByUser: 1,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, edgeId: id });
    }

    if (action === 'autoExtract' && body.text) {
      const sampleText = body.text.toLowerCase();
      const extractedNodes = [];

      if (sampleText.includes('memoria') || sampleText.includes('retención')) {
        extractedNodes.push({ label: 'Consolidación de Memoria', nodeType: 'Concept', description: 'Proceso neurológico de estabilización de huellas mnémicas.' });
      }
      if (sampleText.includes('metacognición') || sampleText.includes('calibración')) {
        extractedNodes.push({ label: 'Calibración Metacognitiva', nodeType: 'Concept', description: 'Evaluación consciente del grado de precisión del propio conocimiento.' });
      }
      if (sampleText.includes('recuerdo') || sampleText.includes('testing')) {
        extractedNodes.push({ label: 'Efecto de Recuperación (Testing Effect)', nodeType: 'Concept', description: 'Fortalecimiento de la memoria mediante evocación activa.' });
      }

      if (extractedNodes.length === 0) {
        extractedNodes.push({ label: `Modelo Mental: ${body.text.substring(0, 25)}...`, nodeType: 'Concept', description: 'Concepto extraído automáticamente del recuerdo activo.' });
      }

      return NextResponse.json({ success: true, suggestedNodes: extractedNodes });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
