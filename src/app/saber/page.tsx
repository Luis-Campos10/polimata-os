import { getAllQuestions, getKnowledgeNodes, getKnowledgeEdges } from '@/lib/db/queries';
import { initDb } from '@/lib/db';
import SaberClient from './SaberClient';

export default async function SaberPage() {
  await initDb();
  const questions = await getAllQuestions();
  const nodes = await getKnowledgeNodes();
  const edges = await getKnowledgeEdges();

  return (
    <SaberClient
      questions={questions}
      nodes={nodes}
      edges={edges}
    />
  );
}
