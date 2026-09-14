import { NextResponse } from 'next/server';

interface ChallengeTemplate {
  domain: string;
  counterTheorist: string;
  objectionTitle: string;
  argumentText: string;
  edgeCaseDilemma: string;
  probingQuestions: string[];
}

const DOMAIN_CHALLENGES: Record<string, ChallengeTemplate> = {
  Q01: {
    domain: 'Cosmología & Metafísica del Origen',
    counterTheorist: 'David Hume & Immanuel Kant',
    objectionTitle: 'La antinomia del tiempo y el salto causal infundado',
    argumentText: 'Si afirmas un origen absoluto (ex nihilo o singularidad física), postulas un evento que viola el principio de razón suficiente; pero si postulas una regresión infinita de causas, vuelves imposible que el presente haya sido alcanzado temporalmente. ¿Cómo evita tu tesis caer en una petición de principio causal?',
    edgeCaseDilemma: 'Si las leyes de la física surgieron CON el universo, ¿qué gobernó la transición misma desde el "no-ser" al "ser"? Y si existía un multiverso cuántico preexistente, ¿no estás meramente desplazando el problema del origen un nivel más atrás?',
    probingQuestions: [
      '¿Tu modelo presupone un tiempo cósmico de fondo independiente de la materia/energía?',
      '¿Qué evidencia empírica concreta te obligaría a abandonar tu premisa fundacional?'
    ]
  },
  Q03: {
    domain: 'Epistemología & Verdad',
    counterTheorist: 'Karl Popper & Willard Van Orman Quine',
    objectionTitle: 'El Trilema de Münchhausen y el holismo de la confirmación',
    argumentText: 'Toda justificación epistémica tropieza inevitablemente con el trilema: o caes en una regresión infinita de justificaciones, o en una circularidad lógica, o en un dogmatismo axiomático arbitrario. Además, según Quine, ninguna hipótesis se contrasta aislada, sino dentro de una red holística de creencias donde siempre es posible salvar la conjetura alterando supuestos auxiliares.',
    edgeCaseDilemma: 'Si una observación contradice una ley física establecida, ¿cómo decides con certeza si la ley es falsa, si el instrumento de medición falló, o si operó una variable no considerada sin recurrir al dogma?',
    probingQuestions: [
      '¿Tu concepto de verdad depende de la correspondencia empírica, la coherencia interna o el pragmatismo instrumental?',
      '¿Bajo qué condiciones exactas admitirías que tu afirmación más segura sobre el conocimiento es en realidad un sesgo cognitivo del Sistema 1?'
    ]
  },
  Q06: {
    domain: 'Determinismo, Libre Albedrío & Responsabilidad',
    counterTheorist: 'Baruch Spinoza & Robert Sapolsky',
    objectionTitle: 'La ilusión de la causa incausada y la biología determinista',
    argumentText: 'Los seres humanos son conscientes de sus deseos pero ignorantes de las causas neuronales, genéticas y epigenéticas que los determinan. Si el universo es determinista a nivel macroscópico, toda deliberación es el resultado inexorable del estado previo del sistema; y si el indeterminismo cuántico rige, la acción es producto del azar estocástico, no de tu agencia deliberada.',
    edgeCaseDilemma: 'Si un tumor en la corteza prefrontal altera por completo la inhibición moral de un individuo haciéndolo cometer un crimen, ¿en qué punto exacto termina la neuropatología y comienza la "auténtica culpa moral"?',
    probingQuestions: [
      '¿Tu definición de libertad requiere la capacidad ontológica de haber actuado de otro modo bajo idénticas condiciones iniciales?',
      '¿Cómo justificas el castigo penal retributivo si las condiciones previas escapan al control último del agente?'
    ]
  },
  Q10: {
    domain: 'Ética & Eudaimonía (Vivir Bien)',
    counterTheorist: 'Friedrich Nietzsche & Arthur Schopenhauer',
    objectionTitle: 'El sesgo moralizante y la trampa del confort vs grandeza',
    argumentText: 'Definir el "vivir bien" como armonía, calma o ausencia de conflicto presupone una moral reactiva de rebaño que suprime el impulso trágico y creador. Para Schopenhauer, la vida oscila inevitablemente entre el dolor del deseo insatisfecho y el tedio de la saciedad; para Nietzsche, las virtudes clásicas domesticadas castran las tensiones que engendran las obras maestras del espíritu.',
    edgeCaseDilemma: '¿Preferirías una vida serena, moderada y equilibrada sin trascendencia, o una vida atormentada por la obsesión creadora que lega una revolución intelectual para la humanidad?',
    probingQuestions: [
      '¿Tu concepción de bienestar es universalizable o es un privilegio condicionado por tu clase socioeconómica y época?',
      '¿Qué lugar le otorgas al dolor y a la contradicción en tu fórmula de la vida buena?'
    ]
  },
  Q11: {
    domain: 'Filosofía Moral & Deber',
    counterTheorist: 'Immanuel Kant vs John Stuart Mill',
    objectionTitle: 'La contradicción entre el imperativo categórico y las consecuencias reales',
    argumentText: 'Si fundamentas el deber en mandatos absolutos sin excepciones, condenas al inocente cuando la verdad acarrea la muerte (el clásico dilema del asesino en la puerta de Kant). Pero si fundamentas la moral en el utilitarismo de las consecuencias, permites el sacrificio instrumental de minorías si el cálculo de bienestar colectivo resulta positivo.',
    edgeCaseDilemma: 'En un escenario límite donde torturar a una persona inocente salvaría a un millón de ciudadanos de una catástrofe, ¿tu principio moral te exige actuar o abstenerte? Ambos caminos violan un pilar básico de la conciencia.',
    probingQuestions: [
      '¿Existe algún principio en tu moral que jamás quebrantarías, sin importar cuán catastróficas fueran las consecuencias reales?',
      '¿Cómo demuestras que tus juicios morales no son meras racionalizaciones evolutivas de emociones adaptativas de cooperación tribal?'
    ]
  },
  Q15: {
    domain: 'Filosofía de la Ciencia',
    counterTheorist: 'Thomas Kuhn & Paul Feyerabend',
    objectionTitle: 'Inconmensurabilidad paradigmática y el mito del método único',
    argumentText: 'La ciencia no progresa por acumulación neutral de verdades objetivas, sino por rupturas sociológicas y cambios de paradigma (Kuhn). Los datos experimentales siempre están cargados de teoría (theory-laden), lo que significa que el marco conceptual determina lo que cuenta como evidencia válida.',
    edgeCaseDilemma: 'Cuando dos paradigmas incompatibles (ej. física clásica vs relatividad general) explican los mismos fenómenos con axiomas mutuamente excluyentes, ¿qué tribunal exterior e incontaminado de presupuestos dictamina cuál es el "verdadero"?',
    probingQuestions: [
      '¿Es la ciencia una descripción exacta de la realidad en sí, o meramente el instrumento predictivo más eficaz que tenemos?',
      '¿Cómo distingues una conjetura teórica fértil de una anomalía recalcitrante sin caer en sesgo de confirmación retrospectivo?'
    ]
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, questionTitle, positionSummary, argument, confidence } = body;

    // Regla pedagógica estricta de Esfuerzo Propio (OWN_EFFORT_REQUIRED)
    if (!positionSummary || positionSummary.trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          error: 'OWN_EFFORT_REQUIRED: Debes formular y redactar tu propia postura argumentada (mínimo 15 caracteres) antes de que el Abogado del Diablo pueda desafiarte dialécticamente.',
        },
        { status: 400 }
      );
    }

    const template = DOMAIN_CHALLENGES[questionId] || {
      domain: 'Filosofía Interdisciplinaria & Epistemología',
      counterTheorist: 'Sexto Empírico & Immanuel Kant',
      objectionTitle: 'El desafío escéptico radical a los supuestos no examinados',
      argumentText: 'Tu postura asume implícitamente la validez de categorías conceptuales que no han sido justificadas a priori. ¿Cómo sabes que tu conclusión no es un artefacto de la estructura del lenguaje con el que piensas más que un hecho de la realidad?',
      edgeCaseDilemma: 'Si cambiáramos el marco axiológico de partida, ¿tu argumento se sostendría o colapsaría por falta de anclaje empírico independiente?',
      probingQuestions: [
        '¿Cuál es la premisa más vulnerable e indemostrable de tu argumento?',
        'Si tu peor adversario intelectual tuviera que refutar tu postura en 3 frases, ¿qué punto débil atacaría?'
      ]
    };

    // Construir 3 objeciones dialécticas precisas analizando la postura del usuario
    const objections = [
      {
        id: 'OBJ_01',
        title: `1. Objeción Metodológica (${template.counterTheorist})`,
        subtitle: template.objectionTitle,
        content: template.argumentText,
        counterTarget: `Frente a tu afirmación: "${positionSummary.substring(0, 100)}${positionSummary.length > 100 ? '...' : ''}"`,
      },
      {
        id: 'OBJ_02',
        title: '2. Contraejemplo Empírico o Paradoja Histórica',
        subtitle: 'El límite de la generalización inductiva',
        content: `La historia del pensamiento demuestra que posturas con ${confidence || 75}% de confianza subjetiva como la tuya han fallado al enfrentarse a anomalías de frontera. Tu argumento "${argument || 'basado en tu razonamiento'}" no especifica qué hecho observable obligaría a declarar tu tesis como refutada.`,
        counterTarget: 'Exigencia popperiana de falsabilidad estricta',
      },
      {
        id: 'OBJ_03',
        title: '3. Falacia Oculta o Sesgo de Reduccionismo',
        subtitle: 'El riesgo de ignorar variables de disciplinas contiguas',
        content: '¿Estás reduciendo un problema inherentemente multidimensional a una sola variable que dominas? (ej. biologizar lo social, o psicologizar lo estructural). Un enfoque polímata exige comprobar si tu respuesta sobrevive al prisma de la teoría de sistemas complejos y la emergencia.',
        counterTarget: 'Prueba de integración interdisciplinaria',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        domain: template.domain,
        counterTheorist: template.counterTheorist,
        userThesis: positionSummary,
        objections,
        dilemma: template.edgeCaseDilemma,
        probingQuestions: template.probingQuestions,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
