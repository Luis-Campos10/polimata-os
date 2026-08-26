import { Suspense } from 'react';
import { getWeekById } from '@/lib/db/queries';
import { initDb, PHASE_0_DETAILED_WEEKS } from '@/lib/db';
import WeekWorkspaceClient from './WeekWorkspaceClient';
import { notFound } from 'next/navigation';

export default async function WeekWorkspacePage({
  params
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;

  try {
    await initDb();
    const week = await getWeekById(weekId);

    if (!week) {
      const fallback = PHASE_0_DETAILED_WEEKS.find(w => w.id === weekId);
      if (!fallback) return notFound();
      return <WeekWorkspaceClient week={fallback as any} />;
    }

    return (
      <Suspense fallback={<div className="p-6 text-xs text-slate-400">Cargando Workspace de la Semana...</div>}>
        <WeekWorkspaceClient week={week} />
      </Suspense>
    );
  } catch (err) {
    console.error('Error en WeekWorkspacePage:', err);
    const fallback = PHASE_0_DETAILED_WEEKS.find(w => w.id === weekId) || PHASE_0_DETAILED_WEEKS[0];
    return <WeekWorkspaceClient week={fallback as any} />;
  }
}
