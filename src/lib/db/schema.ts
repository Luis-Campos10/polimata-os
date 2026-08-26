import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 1. Las 18 Grandes Preguntas
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(), // Q01 - Q18
  number: integer('number').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
});

// 2. Question Ledger (Historial Inmutable de Posturas Filosoficas)
export const questionLedger = sqliteTable('question_ledger', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().references(() => questions.id),
  year: integer('year').notNull(),
  positionSummary: text('position_summary').notNull(),
  confidence: integer('confidence').notNull(), // 0 - 100
  argumentsJson: text('arguments_json'),
  objectionsJson: text('objections_json'),
  evidenceJson: text('evidence_json'),
  createdAt: text('created_at').notNull(),
});

// 3. Fase 0 - 16 Semanas (Con Recursos, Libros, Papers, Laboratorios y Productos MD exactos)
export const weeks = sqliteTable('weeks', {
  id: text('id').primaryKey(), // W01 - W16
  weekNumber: integer('week_number').notNull(),
  title: text('title').notNull(),
  purpose: text('purpose').notNull(),
  targetHours: text('target_hours').notNull(),
  guideQuestionsJson: text('guide_questions_json').notNull(),
  resourcesJson: text('resources_json').notNull(),
  laboratoryJson: text('laboratory_json').notNull(),
  productPrescription: text('product_prescription').notNull(),
  productDescription: text('product_description').notNull(),
  examSpecification: text('exam_specification').notNull(),
});

// 4. Canon de 170 Obras (Años 1 al 10)
export const works = sqliteTable('works', {
  id: text('id').primaryKey(),
  workNumber: integer('work_number').notNull(),
  year: integer('year').notNull(),
  author: text('author').notNull(),
  title: text('title').notNull(),
  level: text('level').notNull(),
  documentType: text('document_type').notNull(),
  prescribedReading: text('prescribed_reading').notNull(),
  primaryQuestionsJson: text('primary_questions_json').notNull(),
  secondaryQuestionsJson: text('secondary_questions_json').notNull(),
});

// 5. Nodos y Aristas del Grafo de Conocimiento
export const knowledgeNodes = sqliteTable('knowledge_nodes', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  nodeType: text('node_type').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull(),
});

export const knowledgeEdges = sqliteTable('knowledge_edges', {
  id: text('id').primaryKey(),
  sourceId: text('source_id').notNull().references(() => knowledgeNodes.id),
  targetId: text('target_id').notNull().references(() => knowledgeNodes.id),
  relationType: text('relation_type').notNull(),
  justification: text('justification'),
  approvedByUser: integer('approved_by_user').notNull().default(1),
  createdAt: text('created_at').notNull(),
});

// 6. Sesiones de Estudio
export const studySessions = sqliteTable('study_sessions', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
});

// 7. Intentos de Recuerdo Activo
export const attempts = sqliteTable('attempts', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  attemptType: text('attempt_type').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

// 8. Hallazgos de Auditoría
export const auditFindings = sqliteTable('audit_findings', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => attempts.id),
  errorType: text('error_type').notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
});

// 9. Calibración Metacognitiva
export const calibrationRecords = sqliteTable('calibration_records', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  predictedScore: integer('predicted_score').notNull(),
  actualScore: integer('actual_score').notNull(),
  calibrationError: integer('calibration_error').notNull(),
  bias: text('bias').notNull(),
  createdAt: text('created_at').notNull(),
});

// 10. Rúbrica de Dominio (100 Puntos)
export const masteryScores = sqliteTable('mastery_scores', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  recallScore: integer('recall_score').notNull(),
  reconstructionScore: integer('reconstruction_score').notNull(),
  conceptualPrecisionScore: integer('conceptual_precision_score').notNull(),
  argumentationScore: integer('argumentation_score').notNull(),
  transferScore: integer('transfer_score').notNull(),
  synthesisScore: integer('synthesis_score').notNull(),
  calibrationScore: integer('calibration_score').notNull(),
  totalScore: integer('total_score').notNull(),
  createdAt: text('created_at').notNull(),
});

// 11. Revisiones Diferidas
export const reviewSchedules = sqliteTable('review_schedules', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  intervalDays: integer('interval_days').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  completed: integer('completed').notNull().default(0),
  score: integer('score'),
  createdAt: text('created_at').notNull(),
});

// 12. Documentos PDF Guardados en la Biblioteca Local
export const pdfDocuments = sqliteTable('pdf_documents', {
  id: text('id').primaryKey(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: text('created_at').notNull(),
});

// 13. Glosario Personal Autogenerado desde el Diccionario
export const glossary = sqliteTable('glossary', {
  id: text('id').primaryKey(),
  term: text('term').notNull(),
  definition: text('definition').notNull(),
  etymology: text('etymology'),
  category: text('category').notNull().default('General'),
  example: text('example'),
  createdAt: text('created_at').notNull(),
});
