import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, desc, like } from 'drizzle-orm';

const PRESET_DICTIONARY: Record<string, { definition: string; etymology: string; category: string; example: string }> = {
  rendimiento: {
    definition: 'Proporción entre el producto o resultado obtenido y los recursos o esfuerzo invertidos. En ciencia cognitiva del aprendizaje (Dunlosky 2013), se distingue el rendimiento momentáneo durante el estudio del aprendizaje duradero a largo plazo.',
    etymology: 'Del latín reddere (devolver/rendir) y el sufijo -miento.',
    category: 'Ciencia Cognitiva & Aprendizaje',
    example: 'El rendimiento durante la relectura crea una ilusión de dominio sin garantizar retención.'
  },
  duradero: {
    definition: 'Que subsiste, permanece o produce efectos a lo largo del tiempo sin degradarse rápidamente.',
    etymology: 'Del verbo durar (del latín durare) y el sufijo -dero.',
    category: 'Vocabulario Académico',
    example: 'El objetivo de la recuperación activa es el aprendizaje duradero.'
  },
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
    example: 'La eudaimonía no es un estado placentero pasivo, sino una actividad del alma.'
  },
  falsacionismo: {
    definition: 'Criterio de demarcación científica de Popper: una hipótesis es científica solo si es potencialmente refutable por la experiencia.',
    etymology: 'Del latín falsus (falso) y el sufijo -ismo.',
    category: 'Filosofía de la Ciencia',
    example: 'Una teoría no falsable por ninguna observación no es científica.'
  },
  interleaving: {
    definition: 'Práctica intercalada que consiste en alternar diferentes categorías durante el estudio para mejorar la discriminación de patrones.',
    etymology: 'Del inglés interleave (intercalar).',
    category: 'Dificultades Deseables',
    example: 'Estudiar problemas de física, química y lógica intercalados.'
  },
  razón: {
    definition: 'Facultad humana de discurrir, juzgar y reflexionar para extraer conclusiones verdaderas mediante principios lógicos.',
    etymology: 'Del latín ratio (cálculo/razón).',
    category: 'Filosofía & Epistemología',
    example: 'Descartes fundamenta el conocimiento en el ejercicio de la razón pura.'
  },
  método: {
    definition: 'Procedimiento sistemático y estructurado seguido para alcanzar un objetivo cognoscitivo o demostración de verdad.',
    etymology: 'Del griego metá (hacia/a través) y hodos (camino).',
    category: 'Epistemología & Método',
    example: 'El método cartesiano consta de cuatro reglas de evidencia y análisis.'
  },
  memoria: {
    definition: 'Proceso cognitivo de codificación, almacenamiento y recuperación de información y experiencias previas.',
    etymology: 'Del latín memoria.',
    category: 'Ciencia Cognitiva',
    example: 'La memoria de trabajo tiene capacidad limitada frente a la memoria de largo plazo.'
  },
  hipótesis: {
    definition: 'Proposición provisional formulada para responder un problema que debe ser contrastada con la experiencia.',
    etymology: 'Del griego hypó (debajo) y thesis (posición/colocación).',
    category: 'Método Científico',
    example: 'Formular una hipótesis refutable es el primer paso de la contrastación.'
  },
  deducción: {
    definition: 'Forma de razonamiento que deriva una conclusión necesaria a partir de premisas generales dadas.',
    etymology: 'Del latín deductio (conducir desde).',
    category: 'Lógica & Filosofía',
    example: 'Si todas las premisas son verdaderas, la conclusión deductiva es necesariamente verdadera.'
  },
  inducción: {
    definition: 'Razonamiento que extrae principios generales a partir de la observación de casos particulares.',
    etymology: 'Del latín inductio (conducir hacia adentro).',
    category: 'Epistemología',
    example: 'Francis Bacon promovió la inducción empírica en el Novum Organum.'
  },
  dialéctica: {
    definition: 'Arte del diálogo y la confrontación de ideas opuestas (tesis y antítesis) para alcanzar una síntesis superior.',
    etymology: 'Del griego dialektikē (técnica conversacional).',
    category: 'Filosofía Socrática',
    example: 'La dialéctica socrática busca purgar la falsa sabiduría mediante preguntas.'
  },
  paradoja: {
    definition: 'Enunciado que parece conducir a una contradicción lógica o desafiar la intuición común pese a premisas válidas.',
    etymology: 'Del griego pará (contra) y doxa (opinión).',
    category: 'Lógica',
    example: 'La paradoja de Zenón cuestiona la naturaleza continua del movimiento.'
  },
  heurística: {
    definition: 'Atajo mental o estrategia simplificada de resolución de problemas sin garantía de solución óptima pero eficiente.',
    etymology: 'Del griego heuriskein (hallar/descubrir).',
    category: 'Ciencia Cognitiva & Sesgos',
    example: 'Las heurísticas cognitivas permiten decisiones rápidas pero pueden generar sesgos.'
  },
  sesgo: {
    definition: 'Desviación sistemática del juicio racional provocada por atajos cognitivos o distorsiones interpretativas.',
    etymology: 'Del provenzal sesgar (atravesar al sesgo).',
    category: 'Psicología Cognitiva',
    example: 'El sesgo de confirmación lleva a buscar solo evidencia que apoya la propia creencia.'
  },
  conciencia: {
    definition: 'Experiencia subjetiva directa de apercepción y darse cuenta de la propia existencia y el entorno.',
    etymology: 'Del latín conscientia (con conocimiento compartido).',
    category: 'Filosofía de la Mente',
    example: 'El "problema duro" de la conciencia indaga cómo la materia genera experiencia cualitativa.'
  },
  causa: {
    definition: 'Principio u origen que produce o da razón de la existencia de un efecto o fenómeno.',
    etymology: 'Del latín causa.',
    category: 'Metafísica & Física',
    example: 'Aristóteles distinguió cuatro causas: material, formal, eficiente y final.'
  },
  metafísica: {
    definition: 'Rama de la filosofía que estudia la naturaleza fundamental de la realidad, el ser y lo existente.',
    etymology: 'Del griego metá ta physiká (más allá de la física).',
    category: 'Filosofía',
    example: 'La ontología es la parte central de la metafísica.'
  },
  empirismo: {
    definition: 'Doctrina filosófica que sostiene que todo conocimiento deriva fundamentalmente de la experiencia sensorial.',
    etymology: 'Del griego empeiria (experiencia).',
    category: 'Epistemología',
    example: 'John Locke concibe la mente humana al nacer como una tabula rasa.'
  },
  racionalismo: {
    definition: 'Corriente filosófica que afirma que la razón es la fuente principal e independiente del conocimiento humano.',
    etymology: 'Del latín ratio (razón) y el sufijo -ismo.',
    category: 'Epistemología',
    example: 'Descartes y Spinoza son figuras señeras del racionalismo moderno.'
  },
  steelman: {
    definition: 'Técnica socrática que consiste en construir la versión más fuerte y defendible del argumento contrario antes de criticarlo.',
    etymology: 'Del inglés steel (acero) y man (hombre).',
    category: 'Argumentación',
    example: 'Hacer un steelman de la postura rival antes de refutarla.'
  }
};

async function fetchWikipediaDefinition(word: string) {
  try {
    const formattedWord = word.trim().toLowerCase();
    if (PRESET_DICTIONARY[formattedWord]) return PRESET_DICTIONARY[formattedWord];

    // 1. Probar consulta de búsqueda directa
    let url = `https://es.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(formattedWord)}&gsrlimit=3&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`;
    let res = await fetch(url, { headers: { 'User-Agent': 'PolimataOS/2.0' } });
    let data = await res.json();
    let pages = data?.query?.pages;

    let extract = '';
    if (pages) {
      for (const key of Object.keys(pages)) {
        const p = pages[key];
        if (p?.extract && !p.extract.toLowerCase().includes('puede referirse a:') && !p.extract.toLowerCase().includes('hace referencia a:')) {
          extract = p.extract;
          break;
        }
      }
    }

    if (!extract) return null;

    const paragraphs = extract.split('\n').filter((p) => p.trim().length > 20 && !p.toLowerCase().includes('puede referirse a'));
    const mainDef = paragraphs[0] || extract.slice(0, 350);

    const etymologyPara = paragraphs.find((p) => p.toLowerCase().includes('etimológicamente') || p.toLowerCase().includes('del latín') || p.toLowerCase().includes('del griego') || p.toLowerCase().includes('del verbo') || p.toLowerCase().includes('del sufijo'));
    const etymologyText = etymologyPara ? etymologyPara.slice(0, 220) : 'Origen etimológico y derivación conceptual en la enciclopedia académica.';

    return {
      definition: mainDef,
      etymology: etymologyText,
      category: 'Diccionario Enciclopédico Académico',
      example: `Uso de "${word}" en contextos académicos y disciplinares.`
    };
  } catch (err) {
    console.error('Error fetching Wikipedia definition:', err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase();

    if (query) {
      // 1. Buscar en Glosario Personal SQLite primero
      const savedMatch = await db.select().from(schema.glossary).where(like(schema.glossary.term, `%${query}%`));
      
      if (savedMatch.length > 0) {
        return NextResponse.json({ success: true, result: savedMatch[0] });
      }

      // 2. Buscar en Presets locales
      if (PRESET_DICTIONARY[query]) {
        const item = PRESET_DICTIONARY[query];
        return NextResponse.json({
          success: true,
          result: {
            id: `PRESET_${Date.now()}`,
            term: query.toUpperCase(),
            definition: item.definition,
            etymology: item.etymology,
            category: item.category,
            example: item.example,
            createdAt: new Date().toISOString()
          }
        });
      }

      // 3. Buscar en Wikipedia sin páginas de desambiguación
      const wikiData = await fetchWikipediaDefinition(query);
      if (wikiData) {
        return NextResponse.json({
          success: true,
          result: {
            id: `WIKI_${Date.now()}`,
            term: query.toUpperCase(),
            definition: wikiData.definition,
            etymology: wikiData.etymology,
            category: wikiData.category,
            example: wikiData.example,
            createdAt: new Date().toISOString()
          }
        });
      }

      // Fallback
      return NextResponse.json({
        success: true,
        result: {
          id: `FALLBACK_${Date.now()}`,
          term: query.toUpperCase(),
          definition: `Definición conceptual para "${query}": Término del plan de estudios Polímata.`,
          etymology: 'Origen etimológico registrado.',
          category: 'Vocabulario General',
          example: `Uso de ${query} en el plan de estudio.`,
          createdAt: new Date().toISOString()
        }
      });
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
    let etymology = body.etymology || 'Etimología académica';
    let category = body.category || 'General';
    let example = body.example || '';

    if (!definition && PRESET_DICTIONARY[termKey]) {
      const preset = PRESET_DICTIONARY[termKey];
      definition = preset.definition;
      etymology = preset.etymology;
      category = preset.category;
      example = preset.example;
    } else if (!definition) {
      const wiki = await fetchWikipediaDefinition(termKey);
      if (wiki) {
        definition = wiki.definition;
        etymology = wiki.etymology;
        category = wiki.category;
        example = wiki.example;
      } else {
        definition = `Definición para "${termRaw}": Concepto clave del plan de estudios Polímata.`;
      }
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
