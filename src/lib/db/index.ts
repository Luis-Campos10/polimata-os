import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'polimata.db');

export const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });

export async function initDb() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS question_ledger (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      position_summary TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      arguments_json TEXT,
      objections_json TEXT,
      evidence_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );

    CREATE TABLE IF NOT EXISTS weeks (
      id TEXT PRIMARY KEY,
      week_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      purpose TEXT NOT NULL,
      target_hours TEXT NOT NULL,
      guide_questions_json TEXT NOT NULL,
      resources_json TEXT NOT NULL,
      laboratory_json TEXT NOT NULL,
      product_prescription TEXT NOT NULL,
      product_description TEXT NOT NULL,
      exam_specification TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      work_number INTEGER NOT NULL,
      year INTEGER NOT NULL,
      author TEXT NOT NULL,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      document_type TEXT NOT NULL,
      prescribed_reading TEXT NOT NULL,
      primary_questions_json TEXT NOT NULL,
      secondary_questions_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS knowledge_nodes (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      node_type TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS knowledge_edges (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation_type TEXT NOT NULL,
      justification TEXT,
      approved_by_user INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (source_id) REFERENCES knowledge_nodes(id),
      FOREIGN KEY (target_id) REFERENCES knowledge_nodes(id)
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      attempt_type TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_findings (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      error_type TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id)
    );

    CREATE TABLE IF NOT EXISTS calibration_records (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      predicted_score INTEGER NOT NULL,
      actual_score INTEGER NOT NULL,
      calibration_error INTEGER NOT NULL,
      bias TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mastery_scores (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      recall_score INTEGER NOT NULL,
      reconstruction_score INTEGER NOT NULL,
      conceptual_precision_score INTEGER NOT NULL,
      argumentation_score INTEGER NOT NULL,
      transfer_score INTEGER NOT NULL,
      synthesis_score INTEGER NOT NULL,
      calibration_score INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS review_schedules (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      interval_days INTEGER NOT NULL,
      scheduled_date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      score INTEGER,
      created_at TEXT NOT NULL
    );
  `);
}
