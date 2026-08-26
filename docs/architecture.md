# Arquitectura de Polímata OS

## Visión General
Polímata OS es una aplicación PWA (Progressive Web App) construida con Next.js (App Router), TypeScript y Tailwind CSS, diseñada para servir como sistema operativo de aprendizaje a largo plazo (10 años + Fase 0).

## Componentes de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    UI (Next.js PWA)                     │
│  [Hoy]  │  [Ruta]  │  [+]  │  [Saber]  │  [Yo (Stats)] │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Motor Pedagógico                     │
│  - Attempt Lock Engine (OWN_EFFORT_REQUIRED)            │
│  - Rubric Evaluator (Dominio 0-100)                     │
│  - Calibration Calculator (Metacognición)               │
│  - Deferred Review Scheduler (+7, +30, +90, +365)       │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                 Importador & Seeder                     │
│  - Markdown Structural Parsers (V5, V6, V7)            │
│  - Seed Engine for Phase 0 (16 Semanas) & 170 Works    │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│               Persistencia (SQLite DB)                  │
└─────────────────────────────────────────────────────────┘
```

## Flujo de Trabajo Pedagógico Integrado

1. **Orientación (Pre-test & Expectativas)**
2. **Adquisición (Sesión de Estudio & Lectura)**
3. **Recuerdo Activo Cerrado (`OWN_EFFORT_REQUIRED`)** -> *Bloqueado hasta registrar intento propio.*
4. **Auditoría & Clasificación de Errores** (Omisión, Error, Distorsión, Confusión, Conexión no justificada).
5. **Rescate Dirigido & Elaboración**
6. **Examen & Calibración Metacognitiva** (Diferencia entre predicción y resultado real).
7. **Consolidación en Memoria:** FSRS y Repasos diferidos (+7, +30, +90, +365 días).
