import { db, initDb, client } from './index';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

const QUESTIONS_DATA = [
  { id: 'Q01', number: 1, title: 'Origen', description: '¿De dónde vienen universo, Tierra, vida y nosotros?' },
  { id: 'Q02', number: 2, title: 'Realidad', description: '¿Qué existe?' },
  { id: 'Q03', number: 3, title: 'Conocimiento', description: '¿Qué podemos conocer y qué es verdad?' },
  { id: 'Q04', number: 4, title: 'Conciencia', description: '¿Qué es la conciencia y cómo se relaciona con cerebro/cuerpo/mundo?' },
  { id: 'Q05', number: 5, title: 'Identidad', description: '¿Qué soy y qué me hace persistir?' },
  { id: 'Q06', number: 6, title: 'Libertad', description: '¿Somos libres y responsables?' },
  { id: 'Q07', number: 7, title: 'Dios/trascendencia', description: '¿Existe Dios o alguna realidad última y qué podemos conocer de ella?' },
  { id: 'Q08', number: 8, title: 'Sentido/muerte/sufrimiento', description: '¿Qué hace significativa una vida frente al sufrimiento, absurdo y muerte?' },
  { id: 'Q09', number: 9, title: 'Amor', description: '¿Qué es amar y qué lugar tienen amor, amistad, deseo y cuidado?' },
  { id: 'Q10', number: 10, title: 'Vida buena', description: '¿Qué es vivir bien?' },
  { id: 'Q11', number: 11, title: 'Moralidad', description: '¿Qué debemos hacer y por qué?' },
  { id: 'Q12', number: 12, title: 'Justicia/poder', description: '¿Qué sociedad es justa y cuándo es legítimo el poder?' },
  { id: 'Q13', number: 13, title: 'Economía/cooperación', description: '¿Cómo producir, intercambiar, distribuir y cooperar?' },
  { id: 'Q14', number: 14, title: 'Belleza/arte', description: '¿Qué son belleza y arte y qué valor tienen?' },
  { id: 'Q15', number: 15, title: 'Ciencia', description: '¿Cómo funciona, qué explica y cuáles son sus límites?' },
  { id: 'Q16', number: 16, title: 'Tecnología/IA', description: '¿Cómo transforman nuestra agencia, conocimiento, trabajo y poder?' },
  { id: 'Q17', number: 17, title: 'Historia/civilización', description: '¿Por qué nacen, cambian, prosperar, chocan y colapsan sociedades?' },
  { id: 'Q18', number: 18, title: 'Futuro', description: '¿Qué debemos preservar, cambiar o crear?' }
];

// Detalle bibliográfico exacto de las 16 semanas de la Fase 0
const PHASE_0_DETAILED_WEEKS = [
  {
    id: 'W01',
    weekNumber: 1,
    title: 'Qué Significa Aprender',
    purpose: 'Construir una concepción científicamente defendible del aprendizaje. Distinguir exposición, familiaridad, comprensión momentánea, recuerdo, retención y dominio.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Qué diferencia existe entre rendimiento durante el estudio y aprendizaje duradero?',
      '¿Por me algo puede sentirse fácil y olvidarse rápidamente?',
      '¿Qué función cumple el conocimiento previo?',
      '¿Qué limitaciones tiene la memoria de trabajo?',
      '¿Por qué subrayar o releer produce ilusión de dominio sin garantizarlo?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'National Academies of Sciences',
        title: 'How People Learn II: Learners, Contexts, and Cultures (2018)',
        type: 'Informe / Libro académico',
        priority: 'NÚCLEO',
        whatToStudy: 'Summary, Introducción, secciones sobre memoria, conocimiento previo, metacognición y transferencia.',
        skill: 'REPORT/TEXTBOOK'
      },
      {
        author: 'Dunlosky, Rawson, Marsh, Nathan & Willingham',
        title: 'Improving Students’ Learning With Effective Learning Techniques (2013)',
        type: 'Revisión académica extensa',
        priority: 'NÚCLEO',
        whatToStudy: 'Secciones de practice testing, distributed practice, interleaved practice, self-explanation, rereading y highlighting.',
        skill: 'PAPER_REVIEW'
      },
      {
        author: 'Brown, Roediger & McDaniel',
        title: 'Make It Stick: The Science of Successful Learning',
        type: 'Libro de divulgación académica',
        priority: 'COMPLEMENTARIO',
        whatToStudy: 'Capítulos iniciales sobre retrieval, spacing, interleaving e ilusiones de saber.',
        skill: 'BOOK'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Experimento A/B de Retención (Lectura vs Retrieval)',
      conditionA: 'Leer, releer y releer (Condición pasiva)',
      conditionB: 'Leer, cerrar todo, recuperar activamente y corregir (Condición activa)',
      metrics: 'Medición inmediata, a 7 días y a 30 días.'
    }),
    productPrescription: 'SEM01_MODELO_PERSONAL_DE_APRENDIZAJE.md',
    productDescription: 'Documento personal con tu concepción científica del aprendizaje, hipótesis personales y resultados del experimento A/B.',
    examSpecification: '20 preguntas (8 recall, 4 explicación, 4 comparación, 4 aplicación). Dominio ≥85%.'
  },
  {
    id: 'W02',
    weekNumber: 2,
    title: 'Retrieval Practice (Recuperación Activa)',
    purpose: 'Convertir la recuperación activa en el núcleo operativo de estudio. Dominar free recall, cued recall y retrieval con feedback.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Por qué evaluar la memoria produce más retención que volver a estudiar?',
      '¿Qué diferencia hay entre recall libre e indirecto?',
      '¿Cómo diseñar preguntas de alto nivel cognitivo?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Roediger & Karpicke',
        title: 'Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention (2006)',
        type: 'Paper experimental',
        priority: 'NÚCLEO',
        whatToStudy: 'Paper completo. Análisis de pregunta, hipótesis, diseño, condiciones y retención a 7 días.',
        skill: 'PAPER_EMPIRICAL'
      },
      {
        author: 'Karpicke & Roediger',
        title: 'Repeated Retrieval During Learning Is the Key to Long-Term Retention (2008)',
        type: 'Paper experimental',
        priority: 'NÚCLEO',
        whatToStudy: 'Paper completo. Comparación con Roediger 2006.',
        skill: 'PAPER_EMPIRICAL'
      },
      {
        author: 'Karpicke & Blunt',
        title: 'Retrieval Practice Produces More Learning than Elaborative Studying with Concept Mapping (2011)',
        type: 'Paper experimental',
        priority: 'NÚCLEO',
        whatToStudy: 'Paper completo. Comparación entre práctica de recuperación y mapas conceptuales.',
        skill: 'PAPER_EMPIRICAL'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Práctica de Recall Cerrado y Clasificación de Errores',
      protocol: '10 min free recall -> 5 min comparación con fuente -> clasificar errores -> 5 min rescate.'
    }),
    productPrescription: 'PROTOCOLO_RETRIEVAL_POLIMATA_V1.md',
    productDescription: 'Protocolo ejecutable para diseñar preguntas ciegas, realizar free recall y clasificar hallazgos de auditoría.',
    examSpecification: '20 preguntas sobre mecanismos neurocognitivos del testing effect. Dominio ≥85%.'
  },
  {
    id: 'W03',
    weekNumber: 3,
    title: 'Spacing y Memoria a Largo Plazo',
    purpose: 'Diseñar memoria para años, no para la siguiente semana. Estructurar el modelo de tres niveles (FSRS, Reconstrucción, Localización).',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Cuál es el intervalo óptimo entre repasos para retener a 1 o 10 años?',
      '¿Qué contenidos deben ir a flashcards y cuáles a reconstrucción extensa?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Cepeda, Pashler, Vul, Wixted & Rohrer',
        title: 'Distributed Practice in Verbal Recall Tasks: A Review and Quantitative Synthesis (2006)',
        type: 'Revisión / Metaanálisis',
        priority: 'NÚCLEO',
        whatToStudy: 'Introducción, método general, resultados y discusión.',
        skill: 'META_ANALYSIS'
      },
      {
        author: 'Cepeda et al.',
        title: 'Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention (2008)',
        type: 'Paper experimental',
        priority: 'NÚCLEO',
        whatToStudy: 'Paper completo.',
        skill: 'PAPER_EMPIRICAL'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Clasificación de Conocimiento en Tres Niveles',
      levels: 'Nivel A (FSRS), Nivel B (Reconstrucción), Nivel C (Localización).'
    }),
    productPrescription: 'POLITICA_DE_MEMORIA_POLIMATA.md',
    productDescription: 'Reglas explícitas de qué entra a FSRS, qué requiere revisión mensual y qué requiere revisión anual.',
    examSpecification: 'Examen de diseño de intervalos y reglas FSRS. Dominio ≥85%.'
  },
  {
    id: 'W04',
    weekNumber: 4,
    title: 'Interleaving y Dificultades Deseables',
    purpose: 'Aprender a cultivar dificultades deseables en el estudio y alternar categorías para mejorar la discriminación de patrones.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Por qué la práctica en bloques se siente más fácil pero produce peor transferencia?',
      '¿Qué son las dificultades deseables según Bjork & Bjork?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Bjork & Bjork',
        title: 'Making Things Hard on Yourself, But in a Good Way: Creating Desirable Difficulties',
        type: 'Capítulo / Ensayo académico',
        priority: 'NÚCLEO',
        whatToStudy: 'Texto completo. Análisis de dificultades deseables vs indeseables.',
        skill: 'ESSAY'
      },
      {
        author: 'Dunlosky et al.',
        title: 'Sección sobre Interleaved Practice',
        type: 'Revisión académica',
        priority: 'NÚCLEO',
        whatToStudy: 'Sección de interleaving.',
        skill: 'PAPER_REVIEW'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Experimento Interleaving vs Blocking',
      protocol: 'Comparar secuencias AAAA-BBBB vs ACBABCCABA y medir exactitud diferida.'
    }),
    productPrescription: 'INTERLEAVING_EXPERIMENT.md',
    productDescription: 'Reporte experimental de aplicación de interleaving a conceptos de ciencia y filosofía.',
    examSpecification: 'Examen sobre discriminación de categorías y práctica intercalada. Dominio ≥85%.'
  },
  {
    id: 'W05',
    weekNumber: 5,
    title: 'Metacognición y Calibración',
    purpose: 'Desarrollar precisión metacognitiva: aprender a calibrar la diferencia entre la confianza predicha y la exactitud real.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Qué tan confiable es mi propia sensación de saber (Judgments of Learning)?',
      '¿Cómo corregir la sobreconfianza y la subconfianza?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Dunlosky & Metcalfe',
        title: 'Metacognition',
        type: 'Monografía académica',
        priority: 'NÚCLEO',
        whatToStudy: 'Capítulos de monitoring, judgments of learning, feeling of knowing y calibration.',
        skill: 'BOOK'
      },
      {
        author: 'Barry J. Zimmerman',
        title: 'Becoming a Self-Regulated Learner: An Overview',
        type: 'Artículo',
        priority: 'NÚCLEO',
        whatToStudy: 'Fases del aprendizaje autorregulado.',
        skill: 'PAPER_REVIEW'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Registro de 50 Predicciones Metacognitivas',
      metrics: 'Medición de confianza promedio, exactitud, error absoluto, sobreconfianza y subconfianza.'
    }),
    productPrescription: 'SEM05_PERFIL_METACOGNITIVO.md',
    productDescription: 'Análisis de tu sesgo metacognitivo y curva de calibración personal.',
    examSpecification: 'Examen de calibración con 20 estimaciones previas obligatorias. Dominio ≥85%.'
  },
  {
    id: 'W06',
    weekNumber: 6,
    title: 'Lectura Profunda Según Disciplina',
    purpose: 'Eliminar el método de lectura único. Adaptar la velocidad y análisis según la disciplina (Filosofía, Ciencia, Historia, Matemáticas).',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Cómo difiere la lectura analítica en Filosofía vs un Paper Empírico o Historia?',
      '¿Cuáles son los 4 niveles de lectura de Adler & Van Doren?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Adler & Van Doren',
        title: 'How to Read a Book',
        type: 'Libro clásico',
        priority: 'NÚCLEO',
        whatToStudy: 'Niveles de lectura analítica y sintópica.',
        skill: 'BOOK'
      },
      {
        author: 'Platón',
        title: 'Apología de Sócrates',
        type: 'Obra filosófica primaria',
        priority: 'NÚCLEO',
        whatToStudy: 'Lectura analítica filosófica completa.',
        skill: 'PHILOSOPHY'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Procesamiento Tripartito de Textos',
      disciplines: 'Filosofía (Platón), Ciencia (Paper Empírico), Historia (Capítulo del Año 1).'
    }),
    productPrescription: 'MODOS_DISCIPLINARES_DE_LECTURA.md',
    productDescription: 'Plantillas de lectura analítica por disciplina creadas por el estudiante.',
    examSpecification: 'Examen de extracción de premisas, metodologías e interpretaciones. Dominio ≥85%.'
  },
  {
    id: 'W07',
    weekNumber: 7,
    title: 'Lógica y Argumentación Estructurada',
    purpose: 'Reconstruir argumentos en forma estándar (Premisas -> Conclusión -> Supuestos -> Objeciones). Dominar modelo Toulmin.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Cuál es la diferencia entre validez formal y solidez sustantiva?',
      '¿Cómo identificar premisas implícitas y supuestos no declarados?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Anthony Weston',
        title: 'A Rulebook for Arguments',
        type: 'Manual de argumentación',
        priority: 'NÚCLEO',
        whatToStudy: 'Manual completo de reglas argumentales.',
        skill: 'BOOK'
      },
      {
        author: 'Stephen Toulmin',
        title: 'The Uses of Argument',
        type: 'Monografía filosófica',
        priority: 'NÚCLEO',
        whatToStudy: 'Secciones de Claim, Grounds, Warrant, Backing, Qualifier y Rebuttal.',
        skill: 'PHILOSOPHY'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Reconstrucción Estándar de 10 Argumentos Complejos',
      template: 'CLAIM, P1, P2, P3, SUPUESTOS, INFERENCIA, CONCLUSIÓN, OBJECIÓN, EVALUACIÓN.'
    }),
    productPrescription: 'ARGUMENT_MAP_STANDARD.md',
    productDescription: 'Mapeo estructurado de 10 argumentos centrales del canon filosófico.',
    examSpecification: 'Examen de detección de falacias y solidez lógica. Dominio ≥85%.'
  },
  {
    id: 'W08',
    weekNumber: 8,
    title: 'Epistemología Práctica y Evaluación de Evidencia',
    purpose: 'Clasificar afirmaciones en la taxonomía epistémica Polímata (Definición, Observación, Evidencia, Inferencia, Modelo, Hipótesis, Valor, Especulación).',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Qué convierte a una creencia en conocimiento justificado?',
      '¿Cómo evaluar la fortaleza de una evidencia en ciencias naturales vs sociales?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Duncan Pritchard',
        title: 'What Is This Thing Called Knowledge?',
        type: 'Libro académico',
        priority: 'NÚCLEO',
        whatToStudy: 'Capítulos sobre justificación, escepticismo y testimonio.',
        skill: 'PHILOSOPHY'
      },
      {
        author: 'Carl G. Hempel',
        title: 'Philosophy of Natural Science',
        type: 'Monografía',
        priority: 'NÚCLEO',
        whatToStudy: 'Confirmación, explicación científica y leyes.',
        skill: 'PHILOSOPHY'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Clasificación Epistémica de Afirmaciones',
      taxonomy: 'D (Definición), O (Observación), E (Evidencia), I (Inferencia), M (Modelo), H (Hipótesis), V (Valor), S (Especulación).'
    }),
    productPrescription: 'TAXONOMIA_EPISTEMICA_POLIMATA.md',
    productDescription: 'Matriz de análisis epistémico aplicada a 20 afirmaciones controvertidas.',
    examSpecification: 'Examen de justificación y evaluación epistémica. Dominio ≥85%.'
  },
  {
    id: 'W09',
    weekNumber: 9,
    title: 'Fuentes, Lectura Lateral y Múltiples Documentos',
    purpose: 'Practicar lectura lateral (Lateral Reading) y corroboración cruzada de fuentes independientes.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Quién afirma algo, con qué métodos y qué dicen fuentes independientes autorizadas?',
      '¿Cómo evitar la trampa de la lectura vertical aislada?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Wineburg & McGrew',
        title: 'Civic Online Reasoning & Lateral Reading Research',
        type: 'Papers empíricos',
        priority: 'NÚCLEO',
        whatToStudy: 'Artículos de investigación sobre lectura lateral en expertos.',
        skill: 'PAPER_EMPIRICAL'
      },
      {
        author: 'Mike Caulfield',
        title: 'Web Literacy for Student Fact-Checkers (SIFT Method)',
        type: 'Manual de verificación',
        priority: 'NÚCLEO',
        whatToStudy: 'Método SIFT (Stop, Investigate source, Find better coverage, Trace claims).',
        skill: 'BOOK'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Matriz de Corroboración Cruzada de Afirmaciones',
      fields: 'Fuente, Claim, Evidencia, Método, Expertise, Conflicto de interés.'
    }),
    productPrescription: 'CLAIM_SOURCE_MATRIX_TEMPLATE.md',
    productDescription: 'Análisis lateral de 5 temas con consenso científico disputado.',
    examSpecification: 'Examen de detección de sesgos y lectura lateral. Dominio ≥85%.'
  },
  {
    id: 'W10',
    weekNumber: 10,
    title: 'Estadística Intuitiva y Pensamiento Causal',
    purpose: 'Adquirir alfabetización cuantitativa: interpretar distribuciones, riesgo absoluto/relativo, tasa base y la escalera de la causalidad.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Qué diferencia existe entre riesgo absoluto y riesgo relativo?',
      '¿Por qué correlación no implica causalidad y qué es una variable confusora?',
      '¿Cuáles son los 3 peldaños de la escalera de la causalidad según Judea Pearl?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'OpenStax',
        title: 'Introductory Statistics',
        type: 'Textbook',
        priority: 'NÚCLEO',
        whatToStudy: 'Distribuciones, probabilidad, muestreo, intervalos y correlación/regresión.',
        skill: 'TEXTBOOK'
      },
      {
        author: 'David Spiegelhalter',
        title: 'The Art of Statistics: Learning from Data',
        type: 'Libro',
        priority: 'NÚCLEO',
        whatToStudy: 'Variación, incertidumbre, riesgo y comunicación de datos.',
        skill: 'BOOK'
      },
      {
        author: 'Judea Pearl & Dana Mackenzie',
        title: 'The Book of Why',
        type: 'Libro',
        priority: 'NÚCLEO',
        whatToStudy: 'Asociación, intervención y contrafactuales.',
        skill: 'BOOK'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Auditoría Cuantitativa de 5 Estudios Publicados',
      fields: 'Riesgo absoluto vs relativo, tamaño de efecto, n, confusores.'
    }),
    productPrescription: 'CHECKLIST_LECTURA_CUANTITATIVA.md',
    productDescription: 'Checklist para evaluar cualquier afirmación estadística en ciencia.',
    examSpecification: 'Examen de cálculo de riesgo, Bayes y causalidad. Dominio ≥85%.'
  },
  {
    id: 'W11',
    weekNumber: 11,
    title: 'Pensamiento Sistémico y Modelos Mentales',
    purpose: 'Aprender a pensar en sistemas: identificar acumuladores (stocks), flujos, bucles de retroalimentación y puntos de apalancamiento.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Cómo interactúan los bucles de retroalimentación positiva y negativa?',
      '¿Por qué las soluciones intuitivas a problemas complejos suelen fallar?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Donella Meadows',
        title: 'Thinking in Systems: A Primer',
        type: 'Libro fundamental',
        priority: 'NÚCLEO',
        whatToStudy: 'Stocks, flows, feedback, delays, trampas del sistema y puntos de apalancamiento.',
        skill: 'BOOK'
      },
      {
        author: 'Scott E. Page',
        title: 'The Model Thinker',
        type: 'Libro',
        priority: 'NÚCLEO',
        whatToStudy: 'Modelos de agregación, diversidad y redes.',
        skill: 'BOOK'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Diagramación de Sistema de Retroalimentación',
      fields: 'Variables, acumuladores, flujos, retrasos, puntos de apalancamiento.'
    }),
    productPrescription: 'MODEL_LEDGER.md',
    productDescription: 'Matriz de 10 modelos mentales universales explicados con mecanismos y límites.',
    examSpecification: 'Examen de análisis de dinámica de sistemas. Dominio ≥85%.'
  },
  {
    id: 'W12',
    weekNumber: 12,
    title: 'Transferencia Analógica y Solución de Problemas',
    purpose: 'Aplicar abstracciones profundas a dominios completamente diferentes sin caer en analogías superficiales.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Cómo identificar la estructura profunda (deep structure) frente a la superficie?',
      '¿Qué caracteriza a una analogía estructuralmente sólida?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'How People Learn II',
        title: 'Secciones sobre Transferencia de Conocimiento',
        type: 'Informe académico',
        priority: 'NÚCLEO',
        whatToStudy: 'Mecanismos de transferencia cercana y lejana.',
        skill: 'REPORT'
      },
      {
        author: 'Dedre Gentner',
        title: 'Structure-Mapping in Analogical Reasoning',
        type: 'Papers clásicos',
        priority: 'NÚCLEO',
        whatToStudy: 'Mapeo de estructuras relacionales.',
        skill: 'PAPER_EMPIRICAL'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Mapeo Analógico Cruzado',
      concepts: 'Selección natural, equilibrio termodinámico, incentivos económicos, retroalimentación.'
    }),
    productPrescription: 'MATRIZ_TRANSFERENCIA_ANALOGICA.md',
    productDescription: 'Análisis de transferencia de 5 modelos entre biología, física y economía.',
    examSpecification: 'Examen de resolución de casos nuevos por transferencia. Dominio ≥85%.'
  },
  {
    id: 'W13',
    weekNumber: 13,
    title: 'Escritura para Pensar y Síntesis Ejecutiva',
    purpose: 'Usar la escritura no como transcripción de lo ya sabido, sino como la herramienta principal para clarificar el pensamiento.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Por qué escribir obliga a detectar inconsistencias que el pensamiento oral oculta?',
      '¿Cómo estructurar una síntesis de una página sin perder precisión?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'William Zinsser',
        title: 'On Writing Well',
        type: 'Libro clásico de redacción',
        priority: 'NÚCLEO',
        whatToStudy: 'Principios de claridad, eliminación de jerga y estructura.',
        skill: 'BOOK'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Redacción de Síntesis Ejecutiva de 1 Página',
      constraints: 'Máximo 500 palabras, tesis clara, 3 argumentos, objeción y límite.'
    }),
    productPrescription: 'SINTESIS_EJECUTIVA_FASE0.md',
    productDescription: 'Síntesis de una página sobre el modelo de aprendizaje personal.',
    examSpecification: 'Evaluación de claridad, precisión y concisión. Dominio ≥85%.'
  },
  {
    id: 'W14',
    weekNumber: 14,
    title: 'Explicación, Enseñanza y Debate Estructurado',
    purpose: 'Explicar conceptos complejos para diferentes audiencias (Técnica Feynman) y representar justamente posiciones rivales (Steelman).',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Qué diferencia existe entre caricaturizar una postura (Strawman) y hacer Steelman?',
      '¿Cómo adaptar el nivel de explicación sin perder exactitud conceptual?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Daniel Dennett',
        title: 'Intuition Pumps and Other Tools for Thinking (Dennett’s Rules)',
        type: 'Libro de filosofía práctica',
        priority: 'NÚCLEO',
        whatToStudy: 'Las 4 reglas de Dennett para la crítica respetuosa y el debate.',
        skill: 'BOOK'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Debate socrático y Steelman de Postura Rival',
      protocol: 'Reconstruir la mejor versión posible de una tesis opuesta antes de criticarla.'
    }),
    productPrescription: 'STEELMAN_DEBATE_DOSSIER.md',
    productDescription: 'Dossier de argumentación contra la postura propia más fuerte.',
    examSpecification: 'Examen oral/escrito de explicación adaptable. Dominio ≥85%.'
  },
  {
    id: 'W15',
    weekNumber: 15,
    title: 'Uso de IA como Auditor y Adversario Cognitivo',
    purpose: 'Utilizar modelos de IA como tutores socráticos, auditores de errores y abogados del diablo, NUNCA como sustituto del pensamiento propio.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Por qué solicitar resúmenes directos a la IA degrada la retención a largo plazo?',
      '¿Cómo configurar la IA en modo Auditor (AI_AUDIT_UNLOCKED) tras el intento propio?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Polímata OS Core Specification',
        title: 'Regla Inviolable OWN_EFFORT_REQUIRED y Modos de IA',
        type: 'Especificación de software',
        priority: 'NÚCLEO',
        whatToStudy: 'Modos Auditor, Tutor Socrático, Examinador, Adversario y Steelman.',
        skill: 'REPORT'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Auditoría Cruzada con Asistente IA',
      protocol: 'Subir intento propio -> Solicitar detección de Omisión, Error, Distorsión y Confusión.'
    }),
    productPrescription: 'PROTOCOLO_IA_TUTOR_POLIMATA.md',
    productDescription: 'Prompt maestro personal para usar IA sin delegar el esfuerzo cognitivo.',
    examSpecification: 'Examen de evaluación de alucinaciones y auditoría. Dominio ≥85%.'
  },
  {
    id: 'W16',
    weekNumber: 16,
    title: 'Evaluación de Dominio Final y Graduación de Fase 0',
    purpose: 'Consolidar el Question Ledger inicial, integrar el grafo de conocimiento y certificar la graduación de la Fase 0 para iniciar el Año 1.',
    targetHours: '6–8 horas/semana',
    guideQuestionsJson: JSON.stringify([
      '¿Puedo planificar, adquirir, recuperar, auditar, calibrar y transferir conocimiento de forma autónoma?',
      '¿Están listas mis 18 preguntas núcleo en el Question Ledger?'
    ]),
    resourcesJson: JSON.stringify([
      {
        author: 'Polímata OS Matrix',
        title: 'Matriz Completa de Graduación de Fase 0 (16 Semanas)',
        type: 'Evaluación de dominio',
        priority: 'NÚCLEO',
        whatToStudy: 'Revisión sintópica de las 16 semanas.',
        skill: 'REPORT'
      }
    ]),
    laboratoryJson: JSON.stringify({
      name: 'Examen Integrador de Graduación de Fase 0',
      specs: 'Rúbrica de 100 puntos en las 7 dimensiones pedagógicas de Polímata.'
    }),
    productPrescription: 'CERTIFICADO_GRADUACION_FASE_0.md',
    productDescription: 'Informe final de graduación de Fase 0 con firma de compromiso para el Año 1 del canon.',
    examSpecification: 'Examen integrador global de 50 preguntas sin notas. Dominio ≥85%.'
  }
];

function parseV6Works(filePath: string) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const worksList: any[] = [];
  let currentYear = 1;
  
  const lines = content.split('\n');
  let currentWork: any = null;
  
  for (const line of lines) {
    const yearMatch = line.match(/^#\s+AÑO\s+(\d+)/i);
    if (yearMatch) {
      currentYear = parseInt(yearMatch[1], 10);
      continue;
    }

    const workMatch = line.match(/^##\s+(\d+)\.\s+(.*?)\s+---\s+\*(.*?)\*/);
    if (workMatch) {
      if (currentWork) {
        worksList.push(currentWork);
      }
      const num = parseInt(workMatch[1], 10);
      currentWork = {
        id: `WORK_${String(num).padStart(3, '0')}`,
        workNumber: num,
        year: currentYear,
        author: workMatch[2].trim(),
        title: workMatch[3].trim(),
        level: 'B',
        documentType: 'BOOK',
        prescribedReading: 'Obra completa o selecciones según plan.',
        primaryQuestionsJson: JSON.stringify(['Q01', 'Q02']),
        secondaryQuestionsJson: JSON.stringify([])
      };
    } else if (currentWork) {
      const levelMatch = line.match(/Nivel:\s*([A-C](\/[A-C])?)/i);
      if (levelMatch) {
        currentWork.level = levelMatch[1].trim();
      }
      const questionsMatch = line.match(/Preguntas:\s*`(.*?)`/i);
      if (questionsMatch) {
        const qList = questionsMatch[1].split(',').map(q => q.trim());
        currentWork.primaryQuestionsJson = JSON.stringify(qList.slice(0, 3));
        currentWork.secondaryQuestionsJson = JSON.stringify(qList.slice(3));
      }
      const readingMatch = line.match(/Qué leer:\s*(.*)/i);
      if (readingMatch) {
        currentWork.prescribedReading = readingMatch[1].trim();
      }
    }
  }
  if (currentWork) {
    worksList.push(currentWork);
  }
  return worksList;
}

export async function ensureSeeded() {
  try {
    const checkWeeks = await client.execute("SELECT COUNT(*) as cnt FROM weeks");
    const count = Number(checkWeeks.rows[0]?.cnt || 0);
    if (count === 0) {
      console.log('🌱 Base de datos vacía detectada. Sembrando datos automáticamente...');
      
      // 1. Sembrar Preguntas
      for (const q of QUESTIONS_DATA) {
        await db.insert(schema.questions).values(q).onConflictDoNothing();
      }

      // 2. Sembrar Entradas Iniciales del Question Ledger
      const initialLedger = [
        {
          id: 'QL_Q01_2026',
          questionId: 'Q01',
          year: 2026,
          positionSummary: 'El universo emergió hace 13.8 mil millones de años mediante el Big Bang. La vida surgió por abiogénesis en la Tierra primordial y evolucionó por selección natural.',
          confidence: 85,
          argumentsJson: JSON.stringify(['Radiación de fondo de microondas', 'Fósiles y secuenciación genómica']),
          objectionsJson: JSON.stringify(['Incertidumbre sobre el mecanismo exacto del origen del código genético']),
          evidenceJson: JSON.stringify(['Espectros estelares', 'Datación radiométrica']),
          createdAt: new Date().toISOString()
        },
        {
          id: 'QL_Q03_2026',
          questionId: 'Q03',
          year: 2026,
          positionSummary: 'El conocimiento requiere justificación empírica o deductiva robusta (FALSIFICABILIDAD de Popper + coherencia Bayesiana).',
          confidence: 78,
          argumentsJson: JSON.stringify(['Experimento controlado', 'Falsificación de Popper']),
          objectionsJson: JSON.stringify(['Problema de la inducción de Hume']),
          evidenceJson: JSON.stringify(['Éxito predictivo de la física moderna']),
          createdAt: new Date().toISOString()
        }
      ];

      for (const ql of initialLedger) {
        await db.insert(schema.questionLedger).values(ql).onConflictDoNothing();
      }

      // 3. Sembrar Semanas Detalladas de Fase 0 (16 Semanas)
      for (const w of PHASE_0_DETAILED_WEEKS) {
        await db.insert(schema.weeks).values(w).onConflictDoNothing();
      }

      // 4. Sembrar Obras del V6 Master (170 Obras)
      const v6Path = path.join(process.cwd(), 'PROYECTO_POLIMATA_V6_MASTER_EJECUTABLE_170 (1).md');
      const parsedWorks = parseV6Works(v6Path);

      if (parsedWorks.length > 0) {
        for (const w of parsedWorks) {
          await db.insert(schema.works).values(w).onConflictDoNothing();
        }
      }

      // 5. Sembrar Nodos y Aristas Iniciales del Grafo
      const initialNodes = [
        { id: 'NODE_PLATON', label: 'Platón', nodeType: 'Author', description: 'Filósofo griego clásico', createdAt: new Date().toISOString() },
        { id: 'NODE_APOLOGIA', label: 'Apología de Sócrates', nodeType: 'Work', description: 'Obra sobre la defensa de Sócrates', createdAt: new Date().toISOString() },
        { id: 'NODE_ROEDIGER', label: 'Roediger & Karpicke', nodeType: 'Author', description: 'Investigadores de ciencia cognitiva de la memoria', createdAt: new Date().toISOString() },
        { id: 'NODE_TESTING_EFFECT', label: 'Testing Effect (Efecto Evaluación)', nodeType: 'Concept', description: 'Recuperar información refuerza la memoria duradera más que releer', createdAt: new Date().toISOString() }
      ];

      for (const n of initialNodes) {
        await db.insert(schema.knowledgeNodes).values(n).onConflictDoNothing();
      }

      const initialEdges = [
        {
          id: 'EDGE_01',
          sourceId: 'NODE_PLATON',
          targetId: 'NODE_APOLOGIA',
          relationType: 'DEVELOPS',
          justification: 'Platón escribió la Apología representando el juicio de Sócrates.',
          approvedByUser: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 'EDGE_02',
          sourceId: 'NODE_ROEDIGER',
          targetId: 'NODE_TESTING_EFFECT',
          relationType: 'EVIDENCE_FOR',
          justification: 'Experimento de 2006 demostró la superioridad del testing activo.',
          approvedByUser: 1,
          createdAt: new Date().toISOString()
        }
      ];

      for (const e of initialEdges) {
        await db.insert(schema.knowledgeEdges).values(e).onConflictDoNothing();
      }

      console.log('✅ Auto-sembrado completado con éxito.');
    }
  } catch (err) {
    console.error('Error durante auto-sembrado:', err);
  }
}

export async function seedDatabase() {
  console.log('🌱 Reiniciando tablas y sembrando datos detallados de Polímata OS...');

  // Dropear tablas viejas para asegurar que las columnas coincidan
  await client.executeMultiple(`
    DROP TABLE IF EXISTS review_schedules;
    DROP TABLE IF EXISTS mastery_scores;
    DROP TABLE IF EXISTS calibration_records;
    DROP TABLE IF EXISTS audit_findings;
    DROP TABLE IF EXISTS attempts;
    DROP TABLE IF EXISTS study_sessions;
    DROP TABLE IF EXISTS knowledge_edges;
    DROP TABLE IF EXISTS knowledge_nodes;
    DROP TABLE IF EXISTS works;
    DROP TABLE IF EXISTS weeks;
    DROP TABLE IF EXISTS question_ledger;
    DROP TABLE IF EXISTS questions;
  `);

  await initDb();
  await ensureSeeded();
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase().catch(err => {
    console.error('❌ Error durante el sembrado:', err);
    process.exit(1);
  });
}


