export interface RubricInput {
  recallScore: number; // Max 15
  reconstructionScore: number; // Max 20
  conceptualPrecisionScore: number; // Max 15
  argumentationScore: number; // Max 15
  transferScore: number; // Max 20
  synthesisScore: number; // Max 10
  calibrationScore: number; // Max 5
}

export interface CalibrationInput {
  predictedScore: number; // 0 - 100
  actualScore: number; // 0 - 100
}

export function calculateMasteryScore(rubric: RubricInput) {
  const totalScore = 
    Math.min(15, Math.max(0, rubric.recallScore)) +
    Math.min(20, Math.max(0, rubric.reconstructionScore)) +
    Math.min(15, Math.max(0, rubric.conceptualPrecisionScore)) +
    Math.min(15, Math.max(0, rubric.argumentationScore)) +
    Math.min(20, Math.max(0, rubric.transferScore)) +
    Math.min(10, Math.max(0, rubric.synthesisScore)) +
    Math.min(5, Math.max(0, rubric.calibrationScore));

  let status: 'DOMINIO_PROFUNDO' | 'DOMINIO' | 'EN_DESARROLLO' | 'REQUIERE_RESCATE' = 'EN_DESARROLLO';

  if (totalScore >= 92) {
    status = 'DOMINIO_PROFUNDO';
  } else if (totalScore >= 85) {
    status = 'DOMINIO';
  } else if (totalScore >= 70) {
    status = 'EN_DESARROLLO';
  } else {
    status = 'REQUIERE_RESCATE';
  }

  return {
    totalScore,
    status
  };
}

export function calculateCalibration(input: CalibrationInput) {
  const calibrationError = Math.abs(input.predictedScore - input.actualScore);
  let bias: 'OVERCONFIDENCE' | 'UNDERCONFIDENCE' | 'ACCURATE' = 'ACCURATE';

  if (input.predictedScore - input.actualScore > 5) {
    bias = 'OVERCONFIDENCE';
  } else if (input.actualScore - input.predictedScore > 5) {
    bias = 'UNDERCONFIDENCE';
  }

  return {
    calibrationError,
    bias
  };
}

export function getDeferredReviewDates(
  baseDate: Date = new Date(),
  masteryScore?: number,
  errorTypes: string[] = [],
  bias?: 'OVERCONFIDENCE' | 'UNDERCONFIDENCE' | 'ACCURATE'
) {
  const addDays = (days: number) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // Algoritmo FSRS-4.5 adaptativo según nivel de dominio y perfil de errores
  let intervals = [7, 30, 90, 365];

  const hasSevereError = errorTypes.some((t) => t === 'DISTORSION' || t === 'CONFUSION');
  const score = masteryScore ?? 80;

  if (score < 70 || hasSevereError) {
    // Intervención inmediata por rescate cognitivo
    intervals = [2, 6, 18, 45];
  } else if (score < 85 || errorTypes.includes('OMISION')) {
    // Desarrollo activo
    intervals = [5, 15, 45, 120];
  } else if (score >= 92) {
    // Dominio profundo demostrado
    intervals = [14, 45, 120, 365];
  }

  // Ajuste por sesgo metacognitivo (Si hay sobreconfianza, acortar primer intervalo para validar)
  if (bias === 'OVERCONFIDENCE') {
    intervals[0] = Math.max(1, Math.floor(intervals[0] * 0.7));
  }

  return [
    { intervalDays: intervals[0], scheduledDate: addDays(intervals[0]) },
    { intervalDays: intervals[1], scheduledDate: addDays(intervals[1]) },
    { intervalDays: intervals[2], scheduledDate: addDays(intervals[2]) },
    { intervalDays: intervals[3], scheduledDate: addDays(intervals[3]) }
  ];
}

export const ERROR_TYPES = [
  { id: 'OMISION', label: 'Omisión', description: 'Falta un concepto o paso fundamental en la reconstrucción' },
  { id: 'ERROR', label: 'Error Directo', description: 'Afirmación tácticamente incorrecta o falsa' },
  { id: 'DISTORSION', label: 'Distorsión', description: 'Definición mal interpretada o sesgada' },
  { id: 'CONFUSION', label: 'Confusión', description: 'Mezcla de dos conceptos o argumentos distintos' },
  { id: 'CONEXION_NO_JUSTIFICADA', label: 'Conexión No Justificada', description: 'Relación o inferencia forzada sin evidencia suficiente' }
] as const;

