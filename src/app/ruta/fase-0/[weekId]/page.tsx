import { Suspense } from 'react';
import { getWeekById } from '@/lib/db/queries';
import { initDb } from '@/lib/db';
import WeekWorkspaceClient from './WeekWorkspaceClient';
import { notFound } from 'next/navigation';

export default async function WeekWorkspacePage({
  params
}: {
  params: Promise<{ weekId: string }>;
}) {
  await initDb();
  const { weekId } = await params;
  const week = await getWeekById(weekId);

  if (!week) {
    return notFound();
  }

  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Cargando Workspace de la Semana...</div>}>
      <WeekWorkspaceClient week={week} />
    </Suspense>
  );
}
