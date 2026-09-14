import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { calculateFsrsReview, FsrsRating } from '@/lib/fsrs';

// Conceptos de respaldo esenciales de Fase 0 por si la base está vacía
const FALLBACK_CORE_CARDS = [
  {
    id: 'CORE_01',
    term: 'Efecto de Prueba (Testing Effect)',
    definition: 'Fenómeno cognitivo por el cual recuperar activamente información de la memoria fortalece las vías neurales de retención de manera significativamente superior a la relectura pasiva.',
    etymology: 'Del latín testari (dar testimonio). Evidencia de Roediger & Karpicke (2006).',
    category: 'Metacognición & Memoria',
    example: 'Hacer free recall cerrando el libro produce hasta 300% mayor retención a 7 días que releer el texto 4 veces.',
  },
  {
    id: 'CORE_02',
    term: 'Carga Cognitiva Intrínseca vs Extraña',
    definition: 'La carga intrínseca es la dificultad inherente del material (complejidad de elementos interrelacionados); la extraña es el esfuerzo mental desperdiciado por mal diseño didáctico o distracciones.',
    etymology: 'Teoría formulada por John Sweller (1988).',
    category: 'Arquitectura Cognitiva',
    example: 'Tener notificaciones de móvil activas mientras se lee a Kant añade carga extraña y satura la memoria de trabajo.',
  },
  {
    id: 'CORE_03',
    term: 'Criterio de Demarcación (Popper)',
    definition: 'Criterio epistemológico que distingue a la ciencia genuina de la pseudociencia: una teoría es científica solo si formula predicciones que puedan ser empíricamente falsadas o refutadas.',
    etymology: 'Karl Popper, La lógica de la investigación científica (1934).',
    category: 'Epistemología & Ciencia',
    example: 'El psicoanálisis ad-hoc no es falsable; la teoría de la relatividad predijo la curvatura de la luz observable en eclipses.',
  },
  {
    id: 'CORE_04',
    term: 'Ilusión de Dominio (Illusion of Explanatory Depth)',
    definition: 'Sesgo metacognitivo consistente en creer erróneamente que se comprende a fondo un sistema complejo hasta que se nos exige explicarlo causalmente sin notas.',
    etymology: 'Demostrado por Rozenblit & Keil (2002).',
    category: 'Metacognición & Sesgos',
    example: 'Creer saber cómo funciona un velocímetro o una cremallera hasta que intentas dibujar sus engranajes.',
  },
  {
    id: 'CORE_05',
    term: 'Eudaimonía (Aristóteles)',
    definition: 'El fin supremo de la vida humana, traducido no como mero placer sensorial pasajero, sino como florecimiento activo del alma conforme a la virtud (areté) a lo largo de una vida completa.',
    etymology: 'Del griego eu (bueno) + daimon (espíritu divino). Ética Nicomáquea.',
    category: 'Filosofía Moral & Ética',
    example: 'Cultivar la prudencia (frónesis) y la justicia en el actuar diario como realización del potencial humano.',
  }
];

export async function GET() {
  try {
    await initDb();

    // 1. Obtener todas las tarjetas de glosario de SQLite
    const glossaryItems = await db.select().from(schema.glossary).orderBy(desc(schema.glossary.createdAt));

    // 2. Obtener revisiones programadas
    const schedules = await db.select().from(schema.reviewSchedules).where(eq(schema.reviewSchedules.completed, 0));

    // Mapear tarjetas disponibles
    let cards: any[] = [];

    if (glossaryItems.length > 0) {
      cards = glossaryItems.map((item) => {
        const sched = schedules.find((s) => s.targetId === item.id);
        return {
          id: item.id,
          reviewScheduleId: sched?.id || null,
          targetType: 'GLOSSARY',
          targetId: item.id,
          term: item.term,
          definition: item.definition,
          etymology: item.etymology || undefined,
          category: item.category || 'General',
          example: item.example || undefined,
          currentInterval: sched?.intervalDays || 0,
          scheduledDate: sched?.scheduledDate || new Date().toISOString().split('T')[0],
        };
      });
    }

    // Si aún hay pocas tarjetas en la base, enriquecer con las tarjetas núcleo de Fase 0
    if (cards.length < 5) {
      FALLBACK_CORE_CARDS.forEach((fc) => {
        if (!cards.some((c) => c.term.toLowerCase() === fc.term.toLowerCase())) {
          cards.push({
            id: fc.id,
            reviewScheduleId: null,
            targetType: 'CORE_CONCEPT',
            targetId: fc.id,
            term: fc.term,
            definition: fc.definition,
            etymology: fc.etymology,
            category: fc.category,
            example: fc.example,
            currentInterval: 0,
            scheduledDate: new Date().toISOString().split('T')[0],
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalDue: cards.length,
        cards,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const { targetId, targetType = 'GLOSSARY', rating = 3, currentInterval = 0 } = body;

    const validRating = (Number(rating) >= 1 && Number(rating) <= 4 ? Number(rating) : 3) as FsrsRating;

    // Calcular próximo estado FSRS
    const fsrsResult = calculateFsrsReview({ intervalDays: Number(currentInterval) }, validRating);

    const nowIso = new Date().toISOString();
    const newScheduleId = `REV_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Marcar revisiones anteriores como completadas
    if (targetId) {
      await db
        .update(schema.reviewSchedules)
        .set({ completed: 1, score: validRating })
        .where(eq(schema.reviewSchedules.targetId, targetId));
    }

    // Insertar nueva fecha programada en SQLite
    await db.insert(schema.reviewSchedules).values({
      id: newScheduleId,
      targetType: targetType,
      targetId: targetId || 'GENERAL',
      intervalDays: fsrsResult.nextIntervalDays,
      scheduledDate: fsrsResult.nextReviewDate,
      completed: 0,
      score: null,
      createdAt: nowIso,
    });

    return NextResponse.json({
      success: true,
      data: {
        nextIntervalDays: fsrsResult.nextIntervalDays,
        nextReviewDate: fsrsResult.nextReviewDate,
        intervalPreview: fsrsResult.intervalPreview,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
