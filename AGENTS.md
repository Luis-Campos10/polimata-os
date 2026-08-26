# AGENTS.md — Polímata OS

Este archivo establece las directrices para cualquier agente de Inteligencia Artificial que trabaje en este repositorio.

## Objetivo del Proyecto
Polímata OS es un sistema operativo personal de aprendizaje diseñado para acompañar un programa interdisciplinario de 10 años (170 obras/rutas núcleo) más una Fase 0 de 16 semanas ("Aprender a aprender").

## Reglas Pedagógicas Fundamentales (Inviolables)
1. **Regla de Esfuerzo Propio (`OWN_EFFORT_REQUIRED`):** La IA NO debe generar resúmenes, respuestas directas, borradores ni solucionar ejercicios ANTES de que el usuario haya guardado su intento propio de recuerdo activo o respuesta sin notas.
2. **Medición Real:** El éxito no se mide por porcentaje de lectura consumida, sino por **Dominio (Rúbrica de 100 pts)**, **Retención activa (FSRS / Repasos diferidos)** y **Calibración metacognitiva**.
3. **Inmutabilidad Histórica:** Nunca sobrescribir silenciosamente el *Question Ledger*, las posiciones filosóficas anteriores ni los resultados de exámenes pasados.

## Convenciones de Código y Arquitectura
- **Mobile-First PWA:** Interfaz pensada para dispositivos móviles y de escritorio.
- **Next.js (App Router) + TypeScript Strict + Tailwind CSS + Lucide Icons**.
- **Persistencia SQLite / Drizzle ORM:** Garantizar funcionamiento local offline-first.
- **Sin Botones Falsos:** Todos los elementos interactivos deben estar respaldados por lógica de negocio y persistencia.

## Estructura de Navegación (5 Tabs Principales)
1. `Hoy`: Plan diario priorizado (FSRS, Lectura, Recall, Revisiones +7/+30/+90).
2. `Ruta`: Jerarquía completa de Fase 0 (Semanas 1-16) y Años 1 al 10 (170 Obras).
3. `+`: Acciones rápidas (nueva sesión, idea, recall, registro).
4. `Saber`: Biblioteca, 18 Grandes Preguntas, Question Ledger y Grafo.
5. `Yo`: Estadísticas reales, retención, perfil de errores y calibración.
