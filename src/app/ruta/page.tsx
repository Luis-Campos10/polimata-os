import { getAllWeeks, getAllWorks } from '@/lib/db/queries';
import { initDb } from '@/lib/db';
import RutaClient from './RutaClient';

export default async function RutaPage() {
  await initDb();
  const weeks = await getAllWeeks();
  const works = await getAllWorks();

  return <RutaClient weeks={weeks} works={works} />;
}
