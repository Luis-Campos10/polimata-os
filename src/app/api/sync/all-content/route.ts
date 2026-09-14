import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { getAllWeeks, getAllWorks, getAllQuestions } from '@/lib/db/queries';
import { getWorkHistoricalData } from '@/lib/workYearHelper';

export async function GET() {
  try {
    await initDb();

    const [weeksList, worksList, questionsList, glossaryList, ledgerList] = await Promise.all([
      getAllWeeks(),
      getAllWorks(),
      getAllQuestions(),
      db.select().from(schema.glossary),
      db.select().from(schema.questionLedger),
    ]);

    const enrichedWorks = worksList.map((w: any) => {
      const hist = getWorkHistoricalData(w.workNumber);
      return {
        ...w,
        historicalYear: hist.year,
        historicalPeriod: hist.period,
        badgeText: hist.badgeText,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        weeks: weeksList,
        works: enrichedWorks,
        questions: questionsList,
        glossary: glossaryList,
        ledger: ledgerList,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
