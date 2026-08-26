# Esquema de Base de Datos — Polímata OS

Polímata OS utiliza un esquema relacional optimizado para SQLite.

## Entidades Principales

### 1. `questions` (18 Grandes Preguntas)
- `id`: `Q01` ... `Q18`
- `title`: Título de la pregunta (ej. Origen, Realidad, Conocimiento...)
- `description`: Formulación completa de la pregunta.

### 2. `question_ledger_entries` (Historial Inmutable del Ledger)
- `id`: string/uuid
- `question_id`: foreign key a `questions.id`
- `year`: año del registro (ej. 2026, 2027...)
- `position_summary`: texto de postura personal provisional.
- `confidence`: valor 0-100.
- `arguments`: JSON con mejores argumentos.
- `objections`: JSON con objeciones conocidas.
- `created_at`: timestamp.

### 3. `phases` & `weeks` (Fase 0: 16 Semanas)
- `weeks.id`: `W01` ... `W16`
- `title`: Título de la semana (ej. Metacognición, Lectura Crítica...)
- `objectives`: Objetivos específicos.
- `activities`: JSON con lista de actividades.
- `materials`: JSON con lecturas/materiales.
- `rubric`: JSON con dimensiones de rúbrica.

### 4. `works` (170 Obras Núcleo - Años 1 al 10)
- `id`: string (ej. `WORK_001` ... `WORK_170`)
- `year`: 1 a 10
- `author`: Nombre del autor
- `title`: Título de la obra/ruta
- `level`: `A`, `B` o `C`
- `document_type`: `BOOK`, `TEXTBOOK`, `REPORT`, `PAPER_EMPIRICAL`, `ESSAY`...
- `prescribed_reading`: texto de capítulos/secciones a leer.
- `primary_questions`: JSON array (ej. `["Q01", "Q02"]`)
- `secondary_questions`: JSON array

### 5. `attempts` (Registro de Intentos & Bloqueo Pedagógico)
- `id`: string/uuid
- `target_type`: `WEEK` o `WORK`
- `target_id`: id de la semana u obra
- `attempt_type`: `FREE_RECALL`, `EXAM`, `TRANSFER`, `RECONSTRUCTION`
- `content`: texto ingresado por el usuario sin notas.
- `status`: `OWN_EFFORT_COMPLETED` (desbloquea auditoría).
- `created_at`: timestamp.

### 6. `audit_findings` (Perfil de Errores)
- `attempt_id`: foreign key a `attempts.id`
- `error_type`: `OMISION`, `ERROR`, `DISTORSION`, `CONFUSION`, `CONEXION_NO_JUSTIFICADA`
- `description`: detalle del hallazgo.

### 7. `review_schedules` (Revisiones Diferidas +7, +30, +90, +365)
- `id`: string/uuid
- `target_id`: id de semana u obra
- `scheduled_date`: fecha programada
- `completed`: booleano
- `score`: calificación obtenida en la revisión.
