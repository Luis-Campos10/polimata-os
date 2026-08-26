import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, desc, like, or } from 'drizzle-orm';

// Diccionario Integrado de Conceptos Polímatas (Filosofía, Cognición, Ciencia, Epistemología)
const PRESET_DICTIONARY: Record<string, { definition: string; etymology: string; category: string; example: string }> = {
  metacognición: {
    definition: 'Capacidad de autoregular el propio aprendizaje: monitorear la brecha entre la confianza predicha y el conocimiento real.',
    etymology: 'Del griego metá (más allá) y el latín cognitio (conocimiento).',
    category: 'Ciencia Cognitiva',
    example: 'Evaluar mi juicio de aprendizaje (JOL) antes de un examen.'
  },
  epistemología: {
    definition: 'Rama de la filosofía que estudia la naturaleza, origen, límites y validez del conocimiento y la verdad.',
    etymology: 'Del griego epistēmē (conocimiento/ciencia) y logos (estudio/tratado).',
    category: 'Filosofía',
    example: 'El principio de falsacionismo de Karl Popper es un pilar epistemológico.'
  },
  eudaimonía: {
    definition: 'Concepto ético aristotélico que define el florecimiento humano y la vida buena guiada por la virtud racional.',
    etymology: 'Del griego eu (bueno) y daimōn (espíritu/guía).',
    category: 'Ética & Filosofía',
    example: 'La eudaimonía no es un estado placentero pasivo, sino una actividad del alma en concordancia con la virtud.'
  },
  falsacionismo: {
    definition: 'Criterio de demarcación científica introducido por Karl Popper: una hipótesis es científica solo si es potencialmente refutable por la experiencia.',
    etymology: 'Del latín falsus (falso) y el sufijo -ismo.',
    category: 'Filosofía de la Ciencia',
    example: 'Una teoría que explica absolutamente cualquier resultado posible no es falsable y por ende no es científica.'
  },
  'testing effect': {
    definition: 'Fenómeno cognitivo empíricamente demostrado (Roediger & Karpicke 2006): autoevaluarse y recuperar información de la memoria fortalece la retención a largo plazo mucho más que releer.',
    etymology: 'Del inglés test (evaluación) y effect (efecto).',
    category: 'Memoria & Aprendizaje',
    example: 'Hacer free recall sin notas desencadena el testing effect.'
  },
  interleaving: {
    definition: 'Práctica intercalada que consiste en alternar diferentes categorías o dominios durante el estudio para mejorar la discriminación de patrones.',
    etymology: 'Del inglés interleave (intercalar).',
    category: 'Dificultades Deseables',
    example: 'Estudiar problemas de física, química y lógica intercalados en lugar de bloques masivos.'
  },
  steelman: {
    definition: 'Técnica de debate socrático que consiste en construir la mejor versión posible del argumento contrario antes de criticarlo (opuesto a Strawman/Hombre de Paja).',
    etymology: 'Del inglés steel (acero) y man (hombre).',
    category: 'Argumentación',
    example: 'Aplicar las 4 reglas de Dennett para hacer un steelman de la postura rival.'
  },
  abiogénesis: {
    definition: 'Proceso natural por el cual la vida surgió a partir de materia inanimada o compuestos orgánicos simples en la Tierra primordial.',
    etymology: 'Del griego a- (sin), bios (vida) y genesis (origen).',
    category: 'Biología & Origen',
    example: 'El experimento de Miller-Urey simuló las condiciones de la abiogénesis.'
  }
};

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase();

    if (query) {
      // Buscar en Glosario Personal SQLite primero
      const savedMatch = await db.select().from(schema.glossary).where(like(schema.glossary.term, `%${query}%`));
      
      let foundDefinition = savedMatch[0] || null;

      if (!foundDefinition && PRESET_DICTIONARY[query]) {
        const item = PRESET_DICTIONARY[query];
        foundDefinition = {
          id: `GLOSS_${Date.now()}`,
          term: query.toUpperCase(),
          definition: item.definition,
          etymology: item.etymology,
          category: item.category,
          example: item.example,
          createdAt: new Date().toISOString()
        };
      }

      return NextResponse.json({ success: true, result: foundDefinition });
    }

    // Retornar todo el Glosario Personal guardado
    const allTerms = await db.select().from(schema.glossary).orderBy(desc(schema.glossary.createdAt));
    return NextResponse.json({ success: true, glossary: allTerms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const termRaw = (body.term || '').trim();
    if (!termRaw) {
      return NextResponse.json({ error: 'El término es obligatorio' }, { status: 400 });
    }

    const termKey = termRaw.toLowerCase();
    let definition = body.definition;
    let etymology = body.etymology || 'Etimología no especificada';
    let category = body.category || 'General';
    let example = body.example || '';

    // Si no se proveyó definición manual, consultar diccionario de presets
    if (!definition && PRESET_DICTIONARY[termKey]) {
      const preset = PRESET_DICTIONARY[termKey];
      definition = preset.definition;
      etymology = preset.etymology;
      category = preset.category;
      example = preset.example;
    } else if (!definition) {
      definition = `Concepto clave registrado en el Glosario de Polímata OS sobre "${termRaw}".`;
    }

    const newDoc = {
      id: `GLOSS_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      term: termRaw.toUpperCase(),
      definition,
      etymology,
      category,
      example,
      createdAt: new Date().toISOString()
    };

    await db.insert(schema.glossary).values(newDoc).onConflictDoNothing();

    return NextResponse.json({
      success: true,
      message: `¡"${termRaw.toUpperCase()}" ha sido añadido a tu Glosario Personal!`,
      entry: newDoc
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await db.delete(schema.glossary).where(eq(schema.glossary.id, id));
    return NextResponse.json({ success: true, message: 'Término eliminado del Glosario.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
