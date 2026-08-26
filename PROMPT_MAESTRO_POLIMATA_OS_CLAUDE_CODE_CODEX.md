# PROMPT MAESTRO — POLÍMATA OS

## Rol

Actúa como **arquitecto principal de software, product designer, ingeniero full-stack senior, especialista en sistemas de aprendizaje, ingeniería del conocimiento, UX para educación y aplicaciones con IA**.

Tu misión es diseñar y construir **Polímata OS**, una aplicación web instalable (PWA) para gestionar un proyecto personal de aprendizaje interdisciplinario de largo plazo.

No construyas una simple lista de libros ni un clon de Goodreads, Notion, Anki u Obsidian. La aplicación debe funcionar como un **sistema operativo personal de aprendizaje**, capaz de gestionar:

- planificación;
- sesiones de estudio;
- adquisición;
- recuperación activa;
- auditoría;
- rescate;
- elaboración;
- transferencia;
- producción;
- exámenes;
- calibración metacognitiva;
- memoria a largo plazo;
- FSRS;
- reconstrucciones largas;
- Question Ledger;
- evolución de posiciones;
- grafo de conocimiento;
- biblioteca;
- procesamiento de documentos;
- tutoría con IA;
- estadísticas de aprendizaje real.

---

# 1. CONTEXTO DEL PROYECTO

El proyecto Polímata tiene una duración aproximada de 10 años y contiene unas **170 obras/rutas núcleo**, organizadas en múltiples disciplinas.

La filosofía funciona como eje integrador, junto con:

- historia profunda;
- historia universal;
- historia de México;
- ciencia;
- matemáticas;
- economía;
- psicología;
- sistemas;
- computación;
- IA;
- arte;
- cultura.

La aplicación debe manejar también una **Fase 0 de 16 semanas**, dedicada a:

- aprender a aprender;
- recuperación activa;
- spacing;
- interleaving;
- metacognición;
- lectura por disciplina;
- lógica;
- epistemología;
- evaluación de fuentes;
- estadística;
- causalidad;
- sistemas;
- transferencia;
- escritura;
- explicación;
- integración.

Carga objetivo de Fase 0:

- 6–8 horas por semana;
- repasos breves adicionales;
- revisiones diferidas;
- evaluación de dominio.

---

# 2. PRINCIPIO CENTRAL

La aplicación NO debe confundir:

- exposición;
- familiaridad;
- comprensión momentánea;
- recuerdo;
- retención;
- transferencia;
- dominio.

Leer una obra al 100 % NO implica dominarla.

Por lo tanto, separar siempre:

1. **progreso de lectura**;
2. **progreso de aprendizaje**;
3. **retención**;
4. **dominio**.

Ejemplo:

```text
LECTURA
██████████ 100 %

APRENDIZAJE
████████░░ 82 %

RETENCIÓN
███████░░░ 74 %

DOMINIO
85/100
```

---

# 3. REGLA PEDAGÓGICA FUNDAMENTAL

La regla operativa de toda la aplicación es:

> PRIMERO esfuerzo propio → DESPUÉS auditoría externa/IA.

Antes de que el usuario intente resolver una tarea, la IA NO debe:

- producir el primer resumen;
- responder primero una pregunta;
- escribir el primer borrador;
- reconstruir primero un argumento;
- decidir primero una posición;
- resolver primero un problema.

Después del esfuerzo propio, la IA sí puede:

- auditar;
- detectar errores;
- detectar omisiones;
- detectar distorsiones;
- detectar confusiones;
- señalar conexiones no justificadas;
- formular preguntas;
- generar contraejemplos;
- adaptar dificultad;
- asumir una posición rival;
- hacer steelman;
- actuar como devil's advocate;
- revisar estructura;
- examinar oralmente;
- comparar contra la fuente;
- sugerir rescate dirigido.

Esta regla debe estar implementada en el software, no sólo escrita como recomendación.

---

# 4. LAS 18 GRANDES PREGUNTAS

La aplicación debe contener permanentemente estas 18 preguntas:

```text
Q01 Origen
Q02 Realidad
Q03 Conocimiento
Q04 Conciencia
Q05 Identidad
Q06 Libertad
Q07 Dios/trascendencia
Q08 Sentido/muerte/sufrimiento
Q09 Amor
Q10 Vida buena
Q11 Moralidad
Q12 Justicia/poder
Q13 Economía/cooperación
Q14 Belleza/arte
Q15 Ciencia
Q16 Tecnología/IA
Q17 Historia/civilización
Q18 Futuro
```

Toda obra puede vincularse con:

- 1–3 preguntas primarias;
- 0–3 preguntas secundarias.

No forzar conexiones artificiales.

---

# 5. QUESTION LEDGER

Cada una de las 18 preguntas debe tener un archivo/registro vivo con:

```text
formulación
distinciones
respuestas rivales
mejores argumentos
evidencia
objeciones
posición provisional
confianza
preguntas abiertas
```

Regla crítica:

> Nunca sobrescribir una posición anterior.

Debe conservarse el historial intelectual.

Ejemplo:

```text
Q07 — Dios/trascendencia

2027
posición: ...
confianza: 72

2028
posición: ...
confianza: 58

2030
posición: ...
confianza: 46
```

Debe poder verse una gráfica temporal de evolución de confianza.

---

# 6. CICLO COGNITIVO POR OBRA

Cada obra debe poder recorrer este workflow:

```text
1. Edition Gate
2. Prerequisite Gate
3. mapa
4. ruta de lectura
5. preguntas ciegas
6. lectura
7. recall propio sin IA
8. auditoría
9. rescate dirigido
10. elaboración
11. transferencia
12. síntesis propia
13. examen
14. calibración
15. FSRS / reconstrucción
16. grafo
17. Question Ledger
```

No todas las obras necesitan exactamente la misma intensidad, pero el modelo de datos debe soportarlo.

---

# 7. CICLO COGNITIVO DE FASE 0

Cada semana debe manejar:

```text
A. Orientación
B. Adquisición
C. Recuperación cerrada
D. Auditoría
E. Rescate
F. Elaboración
G. Transferencia
H. Producción
I. Examen
J. Calibración
K. Memoria
```

## Orientación

Registrar:

```text
PRETEST
confianza_inicial: 0–100
respuesta_inicial
dudas
conocimientos_previos
prerequisitos
objetivo
```

## Adquisición

Registrar:

- tiempo;
- páginas/secciones;
- preguntas;
- tesis;
- evidencia;
- dificultades;
- ideas;
- citas/localizaciones;
- conexiones candidatas.

No incentivar transcripción masiva.

## Recuperación cerrada

Debe existir un modo donde:

- se oculten notas;
- se oculte el documento;
- se bloquee el asistente IA;
- se active cronómetro;
- el usuario produzca free recall.

## Auditoría

Clasificar hallazgos como:

```text
DOMINIO
ERROR
OMISIÓN
DISTORSIÓN
CONFUSIÓN
CONEXIÓN_NO_JUSTIFICADA
```

## Rescate

Volver únicamente a las zonas deficientes.

## Elaboración

Solicitar:

```text
qué significa
por qué
cómo se relaciona
ejemplo
contraejemplo
límite
```

## Transferencia

Resolver un caso nuevo que no aparezca exactamente en el material.

## Producción

Permitir:

- argumento;
- ensayo;
- explicación;
- mapa;
- experimento;
- análisis;
- debate.

## Examen

Sin notas ni IA.

## Calibración

Registrar:

```text
resultado_predicho
resultado_real
error_calibración
sobreconfianza
subconfianza
```

## Memoria

Sólo después de dominio suficiente:

- FSRS;
- grafo;
- reconstrucciones largas;
- revisión +7;
- +30;
- +90;
- +365 cuando corresponda.

---

# 8. RÚBRICA DE DOMINIO

Utilizar por defecto esta rúbrica:

| Dimensión | Peso |
|---|---:|
| Recall | 15 |
| Reconstrucción | 20 |
| Precisión conceptual | 15 |
| Argumentación/evidencia | 15 |
| Transferencia | 20 |
| Síntesis/explicación | 10 |
| Calibración | 5 |

Total:

```text
100
```

Dominio recomendado:

```text
>= 85/100
```

Además:

```text
ninguna dimensión crítica < 70
```

Estados visuales:

```text
92–100  Dominio profundo
85–91   Dominio
70–84   En desarrollo
<70     Requiere rescate
```

Los colores son secundarios. No depender exclusivamente del color para accesibilidad.

---

# 9. MEMORIA DE TRES NIVELES

Implementar tres tipos distintos.

## Nivel A — FSRS

Para:

- conceptos;
- distinciones;
- ecuaciones fundamentales;
- hechos bisagra;
- conocimiento reutilizable.

Ejemplo:

```text
¿Cuál es la diferencia entre validez y solidez?
```

No crear tarjetas triviales.

## Nivel B — Reconstrucción

Para contenidos demasiado complejos para una flashcard.

Ejemplo:

```text
Reconstruye el argumento central de Hume sobre causalidad.
```

Debe permitir:

- respuesta de 5–20 minutos;
- texto;
- opcionalmente voz;
- rúbrica;
- feedback;
- nueva fecha de revisión.

## Nivel C — Localización

Para cosas que no deben memorizarse.

Registrar:

```text
sé que existe
sé para qué sirve
sé dónde encontrarlo
```

---

# 10. REVISIONES DIFERIDAS

Cada módulo/semana/obra puede crear automáticamente:

```text
+7 días
+30 días
+90 días
+365 días
```

FSRS debe manejar tarjetas atómicas.

Las reconstrucciones largas deben usar un scheduler independiente.

No convertir automáticamente toda nota en tarjeta.

---

# 11. PANTALLA PRINCIPAL — HOY

Esta debe ser la pantalla más importante de toda la aplicación.

Objetivo:

> El usuario nunca debe preguntarse “¿qué estudio hoy?”.

Ejemplo:

```text
Buenas tardes.

SEMANA 4 · INTERLEAVING

47 min previstos

1. FSRS
14 tarjetas · 8 min
[EMPEZAR]

2. LECTURA
Bjork & Bjork
25 min
[EMPEZAR]

3. RECALL
Sin notas
10 min
[EMPEZAR]

4. REVISIÓN +30
Semana 1
[EMPEZAR]
```

Priorizar automáticamente:

1. revisiones vencidas;
2. revisiones de hoy;
3. recall;
4. rescate;
5. lectura;
6. transferencia;
7. producción;
8. actividades opcionales.

Permitir reordenar manualmente.

---

# 12. NAVEGACIÓN MÓVIL

Diseño mobile-first.

Barra inferior:

```text
Hoy
Ruta
+
Saber
Yo
```

## Hoy

Plan diario.

## Ruta

Fase 0 + Año 1–10.

## +

Menú rápido:

- nueva sesión;
- subir documento;
- nueva idea;
- nueva pregunta;
- nuevo argumento;
- crear revisión;
- registrar lectura.

## Saber

- biblioteca;
- 18 Questions;
- Question Ledger;
- grafo;
- conceptos;
- argumentos;
- evidencia.

## Yo

- estadísticas;
- calibración;
- retención;
- horas;
- perfil de errores;
- evolución anual.

No saturar con más de 5 tabs principales.

---

# 13. PANTALLA RUTA

Jerarquía:

```text
Proyecto Polímata
  Fase 0
    Semana 01
    Semana 02
    ...
    Semana 16
  Año 1
    Obra 001
    ...
  Año 2
  ...
  Año 10
```

Cada semana:

```text
título
objetivo
estado
dominio
tiempo objetivo
tiempo real
actividades
materiales
producto
examen
revisiones
```

Cada obra:

```text
autor
título
año del proyecto
nivel
tipo documental
preguntas relacionadas
qué leer
estado
progreso lectura
dominio
retención
workflow
edición
```

---

# 14. BIBLIOTECA

Debe aceptar:

```text
BOOK
TEXTBOOK
REPORT
PAPER_EMPIRICAL
PAPER_REVIEW
META_ANALYSIS
ESSAY
WEB_MODULE
```

Cada tipo documental debe activar un adaptador distinto.

---

# 15. ADAPTADORES DOCUMENTALES

## BOOK

Workflow:

```text
Edition Gate
Prerequisite Gate
mapa
presupuesto
selección
verificación
ruta
lectura
postlectura
examen
```

## TEXTBOOK

NO comprimir por porcentaje fijo.

Workflow:

```text
prerequisitos
test diagnóstico
dependencias
ejemplos resueltos
problemas no resueltos
ejercicios
mastery gate
```

Especialmente útil para:

- lógica;
- estadística;
- matemáticas;
- programación.

## REPORT

Usar para:

- navegación;
- selección temática;
- pregunta específica;
- rutas.

No exigir generar un “libro esencial” autocontenido.

## PAPER_EMPIRICAL

Normalmente leer 100 %.

Extraer:

```text
referencia
pregunta
hipótesis
diseño
muestra
variables
procedimiento
resultados
efecto
incertidumbre
limitaciones
interpretación
replicación/contexto
```

## PAPER_REVIEW

Extraer:

```text
pregunta
alcance
literatura incluida
criterios
síntesis
consenso
heterogeneidad
limitaciones
implicaciones
```

## META_ANALYSIS

Extraer:

```text
pregunta/PICO/PECO
búsqueda
criterios inclusión/exclusión
número estudios
efectos
heterogeneidad
sesgo
moderadores
sensibilidad
limitaciones
```

## ESSAY

Normalmente lectura completa.

Extraer:

```text
problema
tesis
movimientos argumentales
ejemplos
objeciones
supuestos
cierre
```

## WEB_MODULE

No usar procesador de libro.

Registrar:

```text
objetivo
actividad
evidencia
resultado
reflexión
```

---

# 16. GRAFO DE CONOCIMIENTO

Nodos:

```text
Author
Work
Concept
Argument
Evidence
Theory
Event
Question
Position
Person
Institution
Place
Period
```

Relaciones:

```text
SUPPORTS
CRITIQUES
CONTRADICTS
DEPENDS_ON
DEVELOPS
EVIDENCE_FOR
EXAMPLE_OF
INFLUENCED_BY
INFLUENCES
RELATED_TO
ANSWERS
OBJECTS_TO
```

Regla:

> La IA puede sugerir aristas, pero el usuario debe aprobarlas.

Guardar:

```text
source
confidence
created_by
approved_by_user
justification
```

---

# 17. ARGUMENTOS

Crear una entidad Argument.

Plantilla:

```text
CLAIM
P1
P2
P3
SUPUESTOS
INFERENCIA
CONCLUSIÓN
OBJECIÓN
RESPUESTA
MI_EVALUACIÓN
CONFIANZA
```

Soportar también Toulmin:

```text
claim
grounds
warrant
backing
qualifier
rebuttal
```

Vincular argumentos con:

- obras;
- autores;
- preguntas;
- posiciones;
- evidencia;
- objeciones.

---

# 18. IA — MODOS

Crear modos claramente diferenciados.

## Auditor

Compara trabajo propio vs fuente.

## Tutor socrático

Hace preguntas, no da respuesta inmediatamente.

## Examinador

Evalúa sin revelar respuesta.

## Adversario

Ataca la posición del usuario.

## Steelman

Construye la mejor versión de una posición rival.

## Devil's Advocate

Busca contraargumentos.

## Explicador de error

Explica específicamente un error después de detectarlo.

## Oral Examiner

Pregunta por voz, recibe respuesta y evalúa.

---

# 19. BLOQUEO DE IA

Implementar estado:

```text
OWN_EFFORT_REQUIRED
```

Mientras una actividad tenga este estado:

- no mostrar respuesta IA;
- no ofrecer resumen;
- no ofrecer solución;
- no generar borrador;
- permitir únicamente:
  - cronómetro;
  - captura de respuesta;
  - notas privadas del usuario.

Después de guardar intento:

```text
AI_AUDIT_UNLOCKED
```

Sólo entonces habilitar auditoría.

Registrar:

```text
attempt_id
created_at
duration
content_hash
```

para garantizar que hubo intento previo.

---

# 20. EXAMEN ORAL

Diseñar desde el principio para soportarlo.

Flujo:

```text
pregunta
↓
grabación
↓
transcripción
↓
respuesta guardada
↓
rúbrica
↓
feedback
↓
rescate
```

No es obligatorio implementarlo en MVP 0.1, pero el modelo debe permitirlo.

---

# 21. ESTADÍSTICAS

No priorizar vanity metrics.

Mostrar:

```text
horas estudiadas
recall
retención +7
retención +30
retención +90
retención +365
mastery medio
transferencia
calibración
reconstrucciones
errores recurrentes
actividades vencidas
preguntas cubiertas
dependencias débiles
```

Perfil de error:

```text
OMISIÓN
ERROR
DISTORSIÓN
CONFUSIÓN
CONEXIÓN_NO_JUSTIFICADA
```

Mostrar frecuencia y tendencia.

---

# 22. DASHBOARD DE LAS 18 PREGUNTAS

Ejemplo:

```text
Q01 Origen               78
Q02 Realidad             62
Q03 Conocimiento         83
Q04 Conciencia           45
...
Q18 Futuro               41
```

No crear una puntuación arbitraria.

Calcularla con métricas transparentes como:

- número de obras relevantes estudiadas;
- dominio;
- retención;
- argumentos reconstruidos;
- posiciones conocidas;
- objeciones conocidas;
- revisiones recientes.

Mostrar cómo se calculó.

---

# 23. REPASO ANUAL

Crear workflow anual:

```text
1. reconstruir 18 preguntas sin notas
2. comparar con Question Ledger
3. detectar contradicciones
4. identificar huecos
5. redactar:
   "Estado de mi visión del mundo — Año N"
6. seleccionar huecos del año siguiente
```

Guardar cada snapshot anual.

---

# 24. CRITERIO DE GRADUACIÓN

No medir éxito como:

```text
170/170 libros
```

Medir capacidad para:

- reconstruir las 18 preguntas;
- representar justamente posiciones rivales;
- distinguir evidencia, argumento y opinión;
- conectar disciplinas;
- defender posiciones provisionales;
- cambiar de postura con razones;
- transferir conocimiento.

---

# 25. STACK TECNOLÓGICO RECOMENDADO

Construir inicialmente como PWA.

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React Query / TanStack Query
Zod
```

Usar App Router.

## Backend

Preferencia:

```text
FastAPI
Python
Pydantic
SQLAlchemy
Alembic
```

Separado del frontend.

## Base de datos

```text
PostgreSQL
```

## Auth / Storage

Preferiblemente:

```text
Supabase
```

Si complica el desarrollo local inicial:

- PostgreSQL local;
- almacenamiento local;
- abstracciones para migrar a Supabase.

## Vector

```text
pgvector
```

No introducir una vector DB adicional sin necesidad.

## Grafo

Primera versión:

```text
PostgreSQL
```

No instalar Neo4j inicialmente.

Agregar Neo4j solamente si se demuestra que PostgreSQL ya no es suficiente.

## Scheduling

FSRS mediante una librería madura o implementación verificable.

No inventar un algoritmo propio de repetición.

---

# 26. MONOREPO

Usar estructura similar:

```text
polimata-os/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared/
│   ├── ui/
│   └── domain/
├── data/
│   ├── seed/
│   └── imports/
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── roadmap.md
│   └── decisions/
├── tests/
├── docker-compose.yml
├── .env.example
├── README.md
└── AGENTS.md
```

Si el ecosistema elegido hace innecesario algún directorio, justificar el cambio.

---

# 27. MODELO DE DATOS MÍNIMO

Crear entidades similares a:

```text
User
Project
Phase
Year
Week
Work
Author
Edition
ReadingPrescription
Resource
Question
QuestionLink
QuestionLedgerEntry
PositionSnapshot
StudySession
Activity
Attempt
RecallAttempt
AuditFinding
RescueTask
Exam
ExamAttempt
MasteryScore
CalibrationRecord
MemoryItem
FSRSCard
ReconstructionPrompt
ReconstructionAttempt
ReviewSchedule
KnowledgeNode
KnowledgeEdge
Argument
ArgumentPremise
EvidenceItem
Note
Tag
Attachment
AIInteraction
```

Todas las entidades importantes deben tener:

```text
id
created_at
updated_at
```

y cuando corresponda:

```text
deleted_at
```

---

# 28. VERSIONADO DEL CONOCIMIENTO

Nunca sobrescribir silenciosamente:

- Question Ledger;
- posición;
- argumento;
- síntesis;
- resultado de examen;
- mastery histórico.

Usar snapshots/historial.

---

# 29. IMPORTACIÓN DEL PROYECTO POLÍMATA

El repositorio puede contener estos archivos fuente:

```text
PROYECTO_POLIMATA_V5.md
PROYECTO_POLIMATA_V6_MASTER_EJECUTABLE_170.md
POLIMATA_V7_FASE_0_DETALLADA_SKILL_MATRIX.md
```

Si los nombres reales tienen sufijos como `(1)`, detectarlos.

Construir un importador de Markdown que intente convertir:

- años;
- obras;
- autores;
- nivel;
- preguntas;
- prescripción de lectura;
- semanas;
- recursos;
- actividades;
- productos;
- rúbricas;

a registros estructurados.

NO confiar únicamente en regex frágiles.

Usar:

1. parser Markdown;
2. heurísticas estructurales;
3. validación;
4. reporte de errores;
5. revisión humana.

El importador nunca debe alterar los archivos originales.

---

# 30. SEED DATA

Crear seed inicial de:

- las 18 preguntas;
- Fase 0;
- las 16 semanas;
- rúbrica general;
- tipos documentales;
- estados;
- tipos de error;
- intervalos de revisión.

Después importar las 170 obras.

---

# 31. MVP 0.1

NO construir todo de una vez.

Primero construir una aplicación completamente utilizable para Fase 0.

Debe incluir:

- autenticación simple;
- pantalla Hoy;
- Ruta;
- Fase 0;
- 16 semanas;
- materiales;
- actividades;
- sesiones;
- cronómetro;
- progreso;
- recall cerrado;
- auditoría manual;
- rescate;
- producto;
- examen;
- rúbrica;
- mastery score;
- calibración;
- revisiones 7/30/90;
- estadísticas básicas.

No integrar todavía IA externa si retrasa demasiado el MVP.

Crear interfaces para permitirla después.

---

# 32. MVP 0.2

Agregar:

- FSRS;
- reconstrucciones largas;
- scheduler;
- +365;
- retención;
- dashboard de memoria;
- mejores estadísticas;
- notificaciones PWA.

---

# 33. MVP 0.3

Agregar:

- 18 Questions;
- Question Ledger;
- historial;
- posiciones;
- argumentos;
- evidencia;
- objeciones;
- grafo;
- relaciones aprobadas por usuario;
- snapshots anuales.

---

# 34. MVP 1.0

Agregar:

- upload de PDFs;
- clasificación documental;
- adaptadores;
- RAG;
- embeddings;
- pgvector;
- tutor;
- auditor IA;
- examinador;
- adversario;
- steelman;
- voice;
- comparación con original;
- IDD / libro-esencial.

---

# 35. UX

Principios:

1. mobile-first;
2. no saturar;
3. Hoy es la pantalla primaria;
4. registrar estudio debe requerir pocos toques;
5. evitar dashboards con 50 métricas;
6. cada pantalla debe responder una pregunta concreta;
7. navegación consistente;
8. accesibilidad;
9. modo oscuro;
10. PWA instalable.

No usar diseño infantil.

No gamificar agresivamente.

Puede existir:

- streak;
- puntos;
- logros;

pero siempre secundarios frente a:

- dominio;
- retención;
- transferencia.

---

# 36. OFFLINE-FIRST PARCIAL

La PWA debe poder:

- abrir tareas del día;
- registrar sesiones;
- escribir recall;
- responder reconstrucciones;
- guardar notas;

sin conexión cuando sea razonable.

Sincronizar después.

No intentar inicialmente soportar PDFs gigantes offline.

---

# 37. PRIVACIDAD

Los registros contienen pensamiento personal.

Por defecto:

- privados;
- no públicos;
- no indexables;
- no compartidos.

Preparar arquitectura para exportar datos.

No usar contenido personal para terceros.

---

# 38. EXPORTACIÓN

Permitir exportar:

```text
Markdown
JSON
CSV
```

Más adelante:

```text
Anki
Obsidian
PDF
```

El usuario nunca debe quedar atrapado en la aplicación.

---

# 39. TESTS

Crear:

- unit tests;
- integration tests;
- tests del scheduler;
- tests de mastery;
- tests de importación;
- tests de permisos;
- tests de bloqueos de IA;
- tests de historial.

Particularmente importante:

```text
AI no puede responder antes de attempt
```

Crear un test explícito para esto.

---

# 40. SEGURIDAD

Aplicar:

- validación Zod/Pydantic;
- protección de rutas;
- autorización por usuario;
- ownership checks;
- límites de upload;
- filenames seguros;
- sanitización;
- rate limiting donde corresponda;
- secretos en variables de entorno;
- nunca commitear secretos.

---

# 41. OBSERVABILIDAD

En desarrollo:

- logs estructurados;
- errores comprensibles;
- health endpoint.

Producción futura:

- error reporting;
- métricas básicas;
- tracing sólo si aporta valor.

---

# 42. DOCUMENTACIÓN OBLIGATORIA

Mantener:

```text
README.md
docs/architecture.md
docs/database.md
docs/roadmap.md
docs/decisions/
AGENTS.md
```

`README.md` debe permitir levantar el proyecto desde cero.

---

# 43. AGENTS.md

Crear un archivo que indique a futuros agentes:

- objetivo del proyecto;
- arquitectura;
- convenciones;
- comandos;
- tests;
- reglas pedagógicas;
- regla de IA;
- no romper importadores;
- no sobrescribir historial;
- mantener mobile-first;
- no introducir dependencias sin justificar.

---

# 44. CONVENCIONES

Usar:

- TypeScript strict;
- Python type hints;
- lint;
- formatter;
- migraciones;
- nombres claros;
- componentes pequeños;
- servicios desacoplados;
- dominio separado de UI.

No crear funciones gigantes.

---

# 45. NO HACER

No:

- construir sólo mocks;
- dejar botones sin función;
- crear una UI bonita sin persistencia;
- usar localStorage como base de datos definitiva;
- incrustar las 170 obras manualmente en componentes React;
- mezclar lógica de negocio en componentes;
- permitir IA antes del intento;
- convertir toda nota en flashcard;
- medir aprendizaje sólo con páginas;
- usar porcentaje de lectura como mastery;
- borrar historial;
- introducir microservicios sin necesidad;
- instalar Neo4j en MVP;
- construir todos los features antes de tener Fase 0 usable.

---

# 46. CRITERIOS DE ACEPTACIÓN DEL MVP 0.1

Un usuario debe poder:

1. entrar;
2. ver qué estudiar hoy;
3. navegar a Fase 0;
4. abrir Semana 1;
5. ver objetivo y recursos;
6. iniciar sesión;
7. registrar tiempo;
8. terminar lectura;
9. iniciar recall cerrado;
10. escribir recall sin acceso a notas;
11. cerrar attempt;
12. registrar auditoría;
13. registrar errores;
14. crear rescate;
15. completar transferencia;
16. subir producto;
17. realizar examen;
18. predecir resultado;
19. guardar resultado real;
20. calcular calibración;
21. calcular mastery;
22. programar +7/+30/+90;
23. ver estadísticas;
24. continuar al día siguiente sin perder datos.

Todos los botones críticos deben funcionar.

---

# 47. PRIMERA ENTREGA

Antes de escribir cientos de archivos, realiza:

## Paso 1

Inspecciona el repositorio.

## Paso 2

Lee los archivos Polímata disponibles.

## Paso 3

Genera:

```text
docs/architecture.md
docs/database.md
docs/roadmap.md
```

## Paso 4

Propón modelo de datos.

## Paso 5

Crea proyecto base.

## Paso 6

Configura DB y migraciones.

## Paso 7

Implementa MVP 0.1 verticalmente.

No desarrolles “frontend completo” y después “backend completo”.

Trabaja en slices:

```text
Hoy
↓
DB
↓
API
↓
UI
↓
test
```

y luego siguiente feature.

---

# 48. ORDEN DE IMPLEMENTACIÓN

Implementa en este orden:

```text
01 project bootstrap
02 database
03 auth
04 seed
05 import Fase 0
06 app shell
07 Hoy
08 Ruta
09 Week workspace
10 Session timer
11 Activities
12 Recall
13 Audit
14 Rescue
15 Exam
16 Calibration
17 Mastery
18 Reviews
19 Stats
20 PWA
21 tests
22 polish
```

---

# 49. CHECKPOINTS

Después de cada bloque importante:

1. ejecutar tests;
2. ejecutar lint;
3. ejecutar typecheck;
4. revisar errores;
5. actualizar documentación;
6. hacer commit descriptivo si Git está disponible.

No esperar hasta el final para probar.

---

# 50. DECISIONES AUTÓNOMAS

No me preguntes por decisiones menores.

Puedes decidir autónomamente:

- nombres de componentes;
- layout;
- estructura de carpetas;
- bibliotecas auxiliares;
- detalles de estilos;
- iconos;
- endpoints;
- índices.

Sólo pregunta si una decisión:

- cambia radicalmente arquitectura;
- implica un servicio de pago;
- borra datos;
- requiere credenciales;
- contradice reglas pedagógicas;
- tiene alto costo futuro.

Si no puedes preguntar, elige la opción más conservadora y documenta la decisión.

---

# 51. SI EL REPOSITORIO ESTÁ VACÍO

Inicialízalo.

No respondas sólo con instrucciones.

Crea archivos y código real.

---

# 52. SI EXISTE CÓDIGO PREVIO

No lo reemplaces ciegamente.

Primero:

- inspecciona;
- ejecuta;
- identifica arquitectura;
- preserva lo que funciona;
- migra gradualmente;
- documenta cambios.

---

# 53. SALIDA ESPERADA DE CADA ITERACIÓN

Al terminar una iteración, reporta:

```text
HECHO
- ...

ARCHIVOS MODIFICADOS
- ...

PRUEBAS
- ...

DECISIONES
- ...

SIGUIENTE BLOQUE
- ...
```

Breve y concreto.

---

# 54. OBJETIVO FINAL

El sistema no existe para responder:

> ¿Cuántos libros he leído?

Debe responder:

> ¿Qué estoy aprendiendo?
> ¿Qué recuerdo?
> ¿Qué olvidé?
> ¿Qué puedo reconstruir?
> ¿Qué puedo transferir?
> ¿Qué estoy entendiendo mal?
> ¿Qué posiciones conozco?
> ¿Cómo ha cambiado mi pensamiento?
> ¿Qué debo estudiar hoy?
> ¿Qué conocimiento sigue vivo después de meses o años?

Polímata OS debe convertirse en un **registro longitudinal de aprendizaje, memoria y evolución intelectual durante una década**.

---

# 55. COMIENZA AHORA

1. Inspecciona todos los archivos disponibles.
2. Localiza los Markdown de Polímata.
3. Lee primero la Fase 0 y el master de 170 obras.
4. Resume internamente la estructura.
5. Crea la documentación de arquitectura.
6. Inicializa la aplicación.
7. Implementa el primer vertical slice funcional.
8. No te detengas en prototipos visuales.
9. No dejes botones falsos.
10. Ejecuta y prueba el sistema.

Empieza por **MVP 0.1 — Fase 0 funcional**.
