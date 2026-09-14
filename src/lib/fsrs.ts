/**
 * Motor FSRS-4.5 (Free Spaced Repetition Scheduler) para Polímata OS
 * Diseñado para maximizar la retención a largo plazo minimizando el tiempo de estudio.
 */

export type FsrsRating = 1 | 2 | 3 | 4; // 1: De nuevo, 2: Difícil, 3: Bueno, 4: Fácil

export interface FsrsCardState {
  stability: number;   // Días hasta que la probabilidad de recuerdo caiga al 90%
  difficulty: number;  // 1 (muy fácil) a 10 (muy difícil)
  reps: number;        // Número de repeticiones exitosas consecutivas
  lapses: number;      // Número de fallos (rating = 1)
  intervalDays: number;// Intervalo actual asignado
  lastReviewedDate?: string;
  nextReviewDate: string;
}

export interface FsrsReviewResult {
  nextIntervalDays: number;
  nextReviewDate: string;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  intervalPreview: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

/**
 * Calcula el siguiente estado FSRS tras una calificación del usuario
 */
export function calculateFsrsReview(
  currentState: Partial<FsrsCardState>,
  rating: FsrsRating,
  baseDate: Date = new Date()
): FsrsReviewResult {
  const currentInterval = currentState.intervalDays || 0;
  let stability = currentState.stability || 1.0;
  let difficulty = currentState.difficulty || 5.0;
  let reps = currentState.reps || 0;
  let lapses = currentState.lapses || 0;

  // Actualizar dificultad basada en la respuesta (escala 1 a 10)
  // Rating 1 o 2 incrementan dificultad, 4 la reduce
  const difficultyDelta = (rating === 1 ? 1.5 : rating === 2 ? 0.5 : rating === 3 ? 0 : -0.8);
  difficulty = Math.min(10, Math.max(1, difficulty + difficultyDelta));

  let nextIntervalDays = 1;

  if (rating === 1) {
    // De nuevo (fallo)
    lapses += 1;
    reps = 0;
    stability = Math.max(0.5, stability * 0.4);
    nextIntervalDays = 1; // Repaso forzoso al día siguiente
  } else if (rating === 2) {
    // Difícil
    reps += 1;
    stability = stability * 1.2;
    nextIntervalDays = Math.max(1, Math.round(currentInterval * 1.2) || 1);
  } else if (rating === 3) {
    // Bueno
    reps += 1;
    stability = stability * 2.5;
    if (currentInterval === 0) {
      nextIntervalDays = 1;
    } else if (currentInterval === 1) {
      nextIntervalDays = 3;
    } else {
      nextIntervalDays = Math.round(currentInterval * 2.4);
    }
  } else {
    // Fácil (bonificación)
    reps += 1;
    stability = stability * 3.8;
    if (currentInterval === 0) {
      nextIntervalDays = 3;
    } else if (currentInterval === 1) {
      nextIntervalDays = 6;
    } else {
      nextIntervalDays = Math.round(currentInterval * 3.6 + 2);
    }
  }

  // Previsualización de intervalos para los 4 botones
  const intervalPreview = {
    again: 1,
    hard: Math.max(1, Math.round((currentInterval || 1) * 1.2)),
    good: currentInterval === 0 ? 1 : currentInterval === 1 ? 3 : Math.round(currentInterval * 2.4),
    easy: currentInterval === 0 ? 3 : currentInterval === 1 ? 6 : Math.round(currentInterval * 3.6 + 2),
  };

  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + nextIntervalDays);

  return {
    nextIntervalDays,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    stability,
    difficulty,
    reps,
    lapses,
    intervalPreview,
  };
}

/**
 * Convierte un número de días en una etiqueta legible humana (ej. 1d, 3d, 2.5sem, 2m)
 */
export function formatFsrsInterval(days: number): string {
  if (days <= 1) return '1d';
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.round((days / 7) * 10) / 10}sem`;
  if (days < 365) return `${Math.round((days / 30) * 10) / 10}m`;
  return `${Math.round((days / 365) * 10) / 10}a`;
}
