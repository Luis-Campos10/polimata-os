import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { attemptContent, weekTitle, guideQuestions } = await req.json();

    if (!attemptContent || typeof attemptContent !== 'string') {
      return NextResponse.json({ error: 'Contenido de intento requerido' }, { status: 400 });
    }

    const textLower = attemptContent.toLowerCase();
    const wordCount = attemptContent.trim().split(/\s+/).length;

    // Análisis heurístico-pedagógico avanzado post-esfuerzo
    const findings: Array<{ errorType: string; label: string; description: string }> = [];

    if (wordCount < 40) {
      findings.push({
        errorType: 'OMISION',
        label: 'Omisión Crítica de Estructura',
        description: 'Tu reconstrucción es breve. Faltan detalles experimentales, autores principales o mecanismos clave.'
      });
    }

    // Detectar si menciona causalidad / sesgos
    if (!textLower.includes('porque') && !textLower.includes('evidencia') && !textLower.includes('experimento')) {
      findings.push({
        errorType: 'CONEXION_NO_JUSTIFICADA',
        label: 'Falta de Justificación Evidencial',
        description: 'Expones afirmaciones sin explicitar el mecanismo ni los experimentos o evidencias que las respaldan.'
      });
    }

    if (textLower.includes('siempre') || textLower.includes('nunca') || textLower.includes('obvio')) {
      findings.push({
        errorType: 'DISTORSION',
        label: 'Generalización o Sesgo Absoluto',
        description: 'Se detectan términos categóricos ("siempre", "nunca") donde la literatura sugiere matices contextuales.'
      });
    }

    // Pregunta socrática / Steelman adaptativa
    let challengeQuestion = '¿De qué manera podría un crítico rival invalidar tu premisa principal y qué experimento o evidencia usarías para refutarlo?';
    if (guideQuestions && Array.isArray(guideQuestions) && guideQuestions.length > 0) {
      challengeQuestion = `Respecto a "${guideQuestions[0]}": ¿Qué hipótesis alternativa explicaría los mismos hechos y por qué la descartas?`;
    }

    return NextResponse.json({
      success: true,
      findings,
      challengeQuestion,
      wordCount,
      reconstructionQuality: wordCount > 80 ? 'ALTA' : wordCount > 35 ? 'MEDIA' : 'INCIPIENTE',
      message: 'Auditoría inteligente completada con éxito.'
    });
  } catch (error: any) {
    console.error('Error en auditoría IA:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
