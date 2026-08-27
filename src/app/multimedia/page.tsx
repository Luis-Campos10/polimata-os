'use client';

import { useState, useEffect } from 'react';
import { Tv, Film, Sparkles, BookOpen, Play, HelpCircle, ChevronRight, Search, Tag } from 'lucide-react';

export interface MediaItem {
  id: string;
  title: string;
  category: 'Anime' | 'Documental' | 'Pelicula';
  discipline: string;
  description: string;
  whatToObserve: string;
  socraticQuestions: string[];
  coverGradient: string;
}

const MEDIA_CATALOG: MediaItem[] = [
  // --- ANIMES FILOSÓFICOS Y CIENTÍFICOS (12) ---
  {
    id: 'M01',
    title: 'Dr. Stone',
    category: 'Anime',
    discipline: 'Física, Química & Historia de la Tecnología',
    description: 'Toda la humanidad es petrificada por 3,700 años. El joven científico Senku Ishigami despierta y reconstruye la civilización desde cero utilizando exclusivamente el método científico empírico.',
    whatToObserve: 'Analiza la reconstrucción de la tabla periódica, la creación de la pólvora, el vidrio, la penicilina, el sulfato de cobre y las comunicaciones de radio.',
    socraticQuestions: [
      '¿Es el método científico un descubrimiento de leyes objetivas o un modelo inventado por la mente humana?',
      '¿Qué tecnología intermedia es el prerrequisito indispensable para el desarrollo de la medicina moderna?'
    ],
    coverGradient: 'from-emerald-950 to-slate-900 border-emerald-500/50'
  },
  {
    id: 'M02',
    title: 'Ergo Proxy',
    category: 'Anime',
    discipline: 'Epistemología, Descartes & Filosofía de la Mente',
    description: 'En una cúpula distópica, androides AutoReiv adquieren autoconciencia tras ser infectados por el virus "Cogito". Un viaje filosófico con constantes alusiones a Descartes, Kant y el mito de la caverna.',
    whatToObserve: 'Identifica la alusión al "Cogito ergo sum", el dualismo mente-cuerpo cartesiano y la ilusión de libre albedrío en sistemas artificiales.',
    socraticQuestions: [
      'Si un autómata duda de su propia existencia, ¿constituye esa duda una prueba suficiente de que posee autoconciencia?',
      '¿En qué medida el lenguaje y los símbolos estructuran los límites del pensamiento propio?'
    ],
    coverGradient: 'from-purple-950 to-slate-900 border-purple-500/50'
  },
  {
    id: 'M03',
    title: 'Vinland Saga',
    category: 'Anime',
    discipline: 'Ética Estoica, Violencia & Filosofía Política',
    description: 'Un joven vikingo es consumido por la venganza, pero su viaje lo lleva a descubrir la doctrina estoica de la no-violencia activa y el reto de construir una sociedad pacífica.',
    whatToObserve: 'Contrasta la ética de la fuerza bruta y el honor nórdico con la evolución de Thorfinn hacia la no-violencia y la doctrina del amor universal de Canuto.',
    socraticQuestions: [
      '¿Es la venganza un acto de justicia o una prisión psicológica autoimpuesta?',
      '¿Qué define a un "verdadero guerrero" desde una perspectiva ética socrática?'
    ],
    coverGradient: 'from-amber-950 to-slate-900 border-amber-600/50'
  },
  {
    id: 'M04',
    title: 'Ghost in the Shell: Stand Alone Complex',
    category: 'Anime',
    discipline: 'Posthumanismo, Filosofía de la Mente & Ciberseguridad',
    description: 'En una sociedad donde los cerebros se conectan cibernéticamente a la red, la Mayor Kusanagi investiga crímenes informáticos e identidad emergente.',
    whatToObserve: 'Analiza el fenómeno de los "Laughing Man": la emergencia de conductas colectivas sin un líder central a través de redes descentralizadas.',
    socraticQuestions: [
      'Si tus recuerdos biológicos son sustituidos por datos sintéticos, ¿qué preserva tu identidad personal a lo largo del tiempo?',
      '¿Dónde reside la frontera entre el organismo biológico y la herramienta tecnológica?'
    ],
    coverGradient: 'from-cyan-950 to-slate-900 border-cyan-500/50'
  },
  {
    id: 'M05',
    title: 'Monster (Naoki Urasawa)',
    category: 'Anime',
    discipline: 'Psicología Forense, Ética Médica & Existencialismo',
    description: 'El brillante neurocirujano Kenzo Tenma salva la vida de un niño huérfano que años más tarde se convierte en un carismático y despiadado sociópata.',
    whatToObserve: 'Examina el imperativo categórico kantiano: "Todas las vidas humanas tienen el mismo valor absoluto" frente a las consecuencias utilitaristas de una decisión médica.',
    socraticQuestions: [
      '¿Tiene un médico el deber deontológico de salvar cualquier vida sin juzgar los actos futuros del paciente?',
      '¿Nace el monstruo por naturaleza genética o es moldeado por el condicionamiento social?'
    ],
    coverGradient: 'from-slate-950 to-slate-900 border-slate-700/70'
  },
  {
    id: 'M06',
    title: 'Serial Experiments Lain',
    category: 'Anime',
    discipline: 'Ontología, Redes Digitales & Solipsismo',
    description: 'Una joven solitaria explora "The Wired", la red informática global, donde las fronteras entre realidad física y conciencia colectiva se disuelven.',
    whatToObserve: 'Observa la profecía de 1998 sobre la omnipresencia de las redes sociales, la identidad digital ubicua y la pérdida de anclaje empírico.',
    socraticQuestions: [
      'Si un individuo existe únicamente en los registros y memorias digitales de los demás, ¿está vivo en sentido ontológico?',
      '¿Es internet una extensión o un reemplazo de la realidad objetiva?'
    ],
    coverGradient: 'from-teal-950 to-slate-900 border-teal-500/50'
  },
  {
    id: 'M07',
    title: 'Psycho-Pass',
    category: 'Anime',
    discipline: 'Utilitarismo, Filosofía del Derecho & Control Algorítmico',
    description: 'El Sistema Sibyl escanea el estado mental y el coeficiente criminal de todos los ciudadanos para neutralizar amenazas antes de que cometan delitos.',
    whatToObserve: 'Evalúa la doctrina de la justicia preventiva, el panóptico de Bentham y la pérdida del libre albedrío moral ante algoritmos de optimización.',
    socraticQuestions: [
      '¿Es legítimo castigar o aislar a alguien por una probabilidad matemática antes de que cometa un acto?',
      '¿Puede una sociedad ser moral si sus ciudadanos solo actúan bien por miedo al castigo predictivo?'
    ],
    coverGradient: 'from-blue-950 to-slate-900 border-blue-500/50'
  },
  {
    id: 'M08',
    title: 'Steins;Gate',
    category: 'Anime',
    discipline: 'Física Teórica, Causalidad & Entropía Temporal',
    description: 'Un grupo de jóvenes inventa un dispositivo capaz de enviar mensajes al pasado, desencadenando efectos mariposa y líneas de tiempo divergentes.',
    whatToObserve: 'Observa la paradoja del abuelo, el principio de autoconsistencia de Nóvikov y el costo psicológico de la hiper-responsabilidad.',
    socraticQuestions: [
      '¿Existe un destino determinista o cada decisión bifurca el estado del universo?',
      '¿Qué dilemas éticos surgen cuando solo una persona recuerda las líneas de tiempo alternas?'
    ],
    coverGradient: 'from-yellow-950 to-slate-900 border-yellow-600/50'
  },
  {
    id: 'M09',
    title: 'Shinsekai Yori (Desde el Nuevo Mundo)',
    category: 'Anime',
    discipline: 'Biología Evolutiva, Control Social & Bioética',
    description: 'Mil años en el futuro, los humanos poseen telequinesis y viven en aldeas utópicas sostenidas por modificaciones genéticas y manipulación de la memoria.',
    whatToObserve: 'Analiza los mecanismos biológicos del "bloqueo de muerte" y cómo las especies dominantes justifican la opresión de otras castas genéticas.',
    socraticQuestions: [
      '¿Es aceptable alterar artificialmente el genoma humano para garantizar la paz social?',
      '¿Cómo define una sociedad quién califica como "humano" con plenos derechos morales?'
    ],
    coverGradient: 'from-orange-950 to-slate-900 border-orange-600/50'
  },
  {
    id: 'M10',
    title: 'Neon Genesis Evangelion',
    category: 'Anime',
    discipline: 'Psicología Psicoanalítica & Dilema de Schopenhauer',
    description: 'Adolescentes pilotean mechas biomecánicos mientras enfrentan traumas existenciales y el proyecto de instrumentalización humana.',
    whatToObserve: 'Examina el "dilema del erizo" de Arthur Schopenhauer: el dolor inevitable de acercarse a otros seres humanos frente al frío de la soledad.',
    socraticQuestions: [
      '¿Vale la pena la individualidad con todo su sufrimiento frente a una conciencia colectiva perfecta sin dolor?',
      '¿Cómo influyen los mecanismos de defensa psicológica en la toma de decisiones críticas?'
    ],
    coverGradient: 'from-violet-950 to-slate-900 border-violet-500/50'
  },
  {
    id: 'M11',
    title: 'Death Note',
    category: 'Anime',
    discipline: 'Justicia Retributiva, Utilitarismo & Teoría de Juegos',
    description: 'Un estudiante sobresaliente encuentra un cuaderno que mata a cualquiera cuyo nombre se escriba en él, desatando un duelo intelectual contra el detective L.',
    whatToObserve: 'Observa el dilema de la corrupción del poder ("Quis custodiet ipsos custodes") y el pensamiento estratégico de teoría de juegos minimax.',
    socraticQuestions: [
      '¿Puede un solo individuo asumir el rol de juez, jurado y ejecutor sin corromper el ideal de justicia?',
      '¿Justifica el fin (un mundo sin crímenes visibles) medios inmorales?'
    ],
    coverGradient: 'from-zinc-950 to-slate-900 border-zinc-500/50'
  },
  {
    id: 'M12',
    title: 'Fullmetal Alchemist: Brotherhood',
    category: 'Anime',
    discipline: 'Leyes de Conservación, Epistemología & Dogma',
    description: 'Dos hermanos alquimistas buscan la Piedra Filosofal tras romper el mayor tabú: intentar resucitar a su madre mediante la transmutación humana.',
    whatToObserve: 'Examina la ley del intercambio equivalente como analogía de la primera ley de la termodinámica y la crítica al conocimiento arrogante.',
    socraticQuestions: [
      '¿Existen límites éticos al conocimiento científico que no deban cruzarse jamás?',
      '¿Es posible obtener algo de verdadero valor sin ofrecer un sacrificio equivalente?'
    ],
    coverGradient: 'from-red-950 to-slate-900 border-red-500/50'
  },

  // --- DOCUMENTALES FUNDAMENTALES (12) ---
  {
    id: 'M13',
    title: 'Cosmos: Un Viaje Personal (Carl Sagan)',
    category: 'Documental',
    discipline: 'Astronomía, Epistemología & Humanismo',
    description: 'La obra maestra de Carl Sagan que explora el cosmos, el nacimiento del pensamiento científico en Jonia y la responsabilidad de la especie humana.',
    whatToObserve: 'Enfócate en la Biblioteca de Alejandría, el calendario cósmico y la advertencia de Sagan sobre el analfabetismo científico.',
    socraticQuestions: [
      '¿Por qué el pensamiento científico floreció en la Jonia del siglo VI a.C. y no en imperios autoritarios centralizados?',
      '¿Qué relación existe entre la perspectiva cósmica y la humildad ética?'
    ],
    coverGradient: 'from-sky-950 to-slate-900 border-sky-500/50'
  },
  {
    id: 'M14',
    title: 'The Ascent of Man (Jacob Bronowski)',
    category: 'Documental',
    discipline: 'Historia de la Ciencia & Antropología',
    description: 'Serie seminal de la BBC sobre la evolución del ingenio humano desde la domesticación del fuego hasta la física cuántica.',
    whatToObserve: 'Presta especial atención al célebre capítulo sobre el principio de incertidumbre de Heisenberg y la lección ética en Auschwitz.',
    socraticQuestions: [
      '¿Por qué el conocimiento científico requiere el reconocimiento de la duda frente al dogma absoluto?',
      '¿Cómo el dominio del fuego y la metalurgia transformó las estructuras cognitivas de la mente humana?'
    ],
    coverGradient: 'from-amber-950 to-slate-900 border-amber-500/50'
  },
  {
    id: 'M15',
    title: 'Connections (James Burke)',
    category: 'Documental',
    discipline: 'Pensamiento Interdisciplinario & Grafo de Conocimiento',
    description: 'Muestra cómo descubrimientos e inventos no relacionados a lo largo de siglos se conectan para generar revoluciones tecnológicas no previstas.',
    whatToObserve: 'Observa cómo el reloj mecánico, la imprenta y el telar de Jacquard convergieron en la invención del computador moderno.',
    socraticQuestions: [
      '¿Existen invenciones aisladas o todo avance tecnológico es el nodo de una red previa de descubrimientos?',
      '¿Por qué la mente interdisciplinaria es más apta para innovar que el hiperespecialista aislado?'
    ],
    coverGradient: 'from-sky-950 to-slate-900 border-sky-600/50'
  },
  {
    id: 'M16',
    title: 'AlphaGo (DeepMind / Google)',
    category: 'Documental',
    discipline: 'Inteligencia Artificial & Teoría de Juegos',
    description: 'El viaje del equipo de DeepMind para enfrentar la red neuronal AlphaGo contra Lee Sedol, el legendario campeón mundial de Go.',
    whatToObserve: 'Analiza la histórica "Jugada 37" en la partida 2: un movimiento que desafió 3,000 años de intuición humana tradicional.',
    socraticQuestions: [
      '¿Es la creatividad de un algoritmo cualitativamente idéntica a la intuición humana?',
      '¿Qué enseña AlphaGo sobre los puntos ciegos de la experiencia y las tradiciones heredadas?'
    ],
    coverGradient: 'from-indigo-950 to-slate-900 border-indigo-500/50'
  },
  {
    id: 'M17',
    title: 'Mind Field (Michael Stevens / Vsauce)',
    category: 'Documental',
    discipline: 'Psicología Cognitiva & Neurociencia',
    description: 'Experimentos científicos rigurosos sobre aislamiento sensorial, ilusión de libre albedrío, memoria falsa y obediencia ciega.',
    whatToObserve: 'Examina la maleabilidad de la memoria humana y con qué facilidad el cerebro construye recuerdos falsos coherentes.',
    socraticQuestions: [
      '¿Es fiable nuestra propia memoria autobiográfica sin evidencias y registros externos inmutables?',
      '¿Hasta qué punto la conformidad de grupo distorsiona el juicio racional de un individuo?'
    ],
    coverGradient: 'from-violet-950 to-slate-900 border-violet-500/50'
  },
  {
    id: 'M18',
    title: 'The Century of the Self (Adam Curtis / BBC)',
    category: 'Documental',
    discipline: 'Psicoanálisis, Propaganda & Ingeniería Social',
    description: 'Cómo las teorías de Sigmund Freud fueron utilizadas por Edward Bernays para manipular los deseos inconscientes y crear la sociedad de consumo de masas.',
    whatToObserve: 'Observa la transición de una cultura de "necesidades racionales" a una cultura de "deseos emocionales irracionales".',
    socraticQuestions: [
      '¿Son nuestras preferencias de consumo y opinión política auténticamente libres o inducidas por ingeniería psicológica?',
      '¿Cómo proteger la propia autonomía de juicio en la era de la hiper-persuasión?'
    ],
    coverGradient: 'from-purple-950 to-slate-900 border-purple-600/50'
  },
  {
    id: 'M19',
    title: 'The Social Dilemma (El Dilema de las Redes)',
    category: 'Documental',
    discipline: 'Ciencia de la Atención & Economía de la Conducta',
    description: 'Ingenieros y diseñadores de Silicon Valley exponen cómo los algoritmos de recomendación están optimizados para explotar sesgos cognitivos.',
    whatToObserve: 'Examina el modelo de negocio extractivo de la atención y la polarización epistémica provocada por cámaras de eco.',
    socraticQuestions: [
      'Si el producto es gratuito, ¿quién es realmente el cliente y cuál es la mercancía?',
      '¿Cómo afecta el flujo constante de recompensas dopaminérgicas a la capacidad de estudio profundo?'
    ],
    coverGradient: 'from-rose-950 to-slate-900 border-rose-500/50'
  },
  {
    id: 'M20',
    title: 'Human (Yann Arthus-Bertrand)',
    category: 'Documental',
    discipline: 'Antropología Cultural, Ética & Empatía',
    description: 'Testimonios íntimos de más de 2,000 personas de 60 países sobre el amor, la guerra, la pobreza, la justicia y el perdón.',
    whatToObserve: 'Observa la universalidad de las emociones humanas básicas frente a la diversidad de cosmovisiones culturales.',
    socraticQuestions: [
      '¿Existe una naturaleza humana universal subyacente a todas las culturas?',
      '¿Cómo influyen las condiciones materiales en la definición de la felicidad y el propósito vital?'
    ],
    coverGradient: 'from-amber-950 to-slate-900 border-amber-600/50'
  },
  {
    id: 'M21',
    title: 'Life on Our Planet (David Attenborough)',
    category: 'Documental',
    discipline: 'Biología Evolutiva, Ecología & Sistemas Complejos',
    description: 'Un recorrido visual por las 5 grandes extinciones masivas de la Tierra y la lucha de la vida por adaptarse a través de la evolución biológica.',
    whatToObserve: 'Examina cómo los ecosistemas operan como sistemas no lineales donde la pérdida de una especie clave puede colapsar la red completa.',
    socraticQuestions: [
      '¿Por qué la resiliencia de un sistema vivo depende fundamentalmente de su diversidad?',
      '¿Qué responsabilidades tiene la única especie consciente sobre el equilibrio de la biosfera?'
    ],
    coverGradient: 'from-emerald-950 to-slate-900 border-emerald-500/50'
  },
  {
    id: 'M22',
    title: 'Free to Choose (Milton Friedman)',
    category: 'Documental',
    discipline: 'Economía Política & Filosofía de la Libertad',
    description: 'La serie de Milton Friedman sobre el papel de los precios, los incentivos individuales y la libertad de mercado en la prosperidad.',
    whatToObserve: 'Analiza el funcionamiento del sistema de precios como un procesador distribuido de información económica.',
    socraticQuestions: [
      '¿Cómo transmiten los precios información sobre la escasez sin necesidad de un planificador central?',
      '¿Cuál es el balance óptimo entre la libertad individual y la red de protección social colectiva?'
    ],
    coverGradient: 'from-blue-950 to-slate-900 border-blue-600/50'
  },
  {
    id: 'M23',
    title: 'The Power of Nightmares (Adam Curtis)',
    category: 'Documental',
    discipline: 'Ciencia Política, Narrativas & Miedo Colectivo',
    description: 'Investiga cómo los movimientos políticos contemporáneos utilizan el miedo a enemigos existenciales para unificar y movilizar a la sociedad.',
    whatToObserve: 'Observa los paralelos entre el pensamiento neoconservador y los fundamentalismos en la construcción de narrativas apocalípticas.',
    socraticQuestions: [
      '¿Por qué el miedo es una herramienta de cohesión política más poderosa que las propuestas positivas de progreso?',
      '¿Cómo distinguir una amenaza empírica real de una narrativa política fabricada?'
    ],
    coverGradient: 'from-red-950 to-slate-900 border-red-600/50'
  },
  {
    id: 'M24',
    title: 'Cosmos: Mundos Posibles (Neil deGrasse Tyson)',
    category: 'Documental',
    discipline: 'Astrofísica, Futuro & Evolución Tecnológica',
    description: 'La continuación moderna de Cosmos, explorando mundos perdidos, la red neuronal de los árboles y la civilización de tipo I en la escala de Kardashev.',
    whatToObserve: 'Observa la comunicación química subterránea en los bosques y la visión a largo plazo del destino humano.',
    socraticQuestions: [
      '¿Podrá la especie humana superar su infancia tecnológica antes de autodestruirse?',
      '¿Qué principios éticos deben regir la exploración y posible colonización de otros mundos?'
    ],
    coverGradient: 'from-cyan-950 to-slate-900 border-cyan-600/50'
  },

  // --- CINE DE PENSAMIENTO CRÍTICO E IDEAS (12) ---
  {
    id: 'M25',
    title: '12 Angry Men (12 Hombres en Pugna - 1957)',
    category: 'Pelicula',
    discipline: 'Duda Socrática, Sesgos de Grupo & Retórica',
    description: 'Un jurado de 12 hombres debe decidir el destino de un sospechoso. Un solo jurado introduce duda razonable usando el método socrático para desmontar prejuicios.',
    whatToObserve: 'Examina cómo el Jurado #8 utiliza la mayéutica, detecta falacias ad hominem y vence el sesgo de confirmación del grupo.',
    socraticQuestions: [
      '¿Cómo diferenciar la duda metódica legítima del mero negacionismo obstinado?',
      '¿Por qué el consenso rápido es con frecuencia un síntoma de ilusión de dominio y presión de grupo?'
    ],
    coverGradient: 'from-amber-950 to-slate-900 border-amber-500/50'
  },
  {
    id: 'M26',
    title: 'Oppenheimer (Christopher Nolan)',
    category: 'Pelicula',
    discipline: 'Física Cuántica, Ética & Geopolítica',
    description: 'La vida de J. Robert Oppenheimer y el desarrollo de la bomba atómica en Los Álamos durante el Proyecto Manhattan.',
    whatToObserve: 'Observa el dilema ético del científico que desata una fuerza superior a la madurez moral de las instituciones políticas.',
    socraticQuestions: [
      '¿Tiene el científico responsabilidad moral por el uso bélico o político de sus descubrimientos teóricos?',
      '¿Puede el conocimiento puro considerarse éticamente neutro?'
    ],
    coverGradient: 'from-rose-950 to-slate-900 border-rose-500/50'
  },
  {
    id: 'M27',
    title: 'Good Will Hunting (La Mente Indomable)',
    category: 'Pelicula',
    discipline: 'Genio Autodidacta, Matemáticas & Calibración Emocional',
    description: 'Un joven conserje con una capacidad matemática prodigiosa aprende a superar sus traumas mediante la honestidad emocional con su terapeuta.',
    whatToObserve: 'Compara la lectura memorística enciclopédica con la experiencia humana vivida y la sabiduría emocional práctica.',
    socraticQuestions: [
      '¿Es suficiente la erudición teórica sin experiencia humana directa y compromiso vulnerable?',
      '¿Qué diferencia al talento cognitivo bruto de la maestría cultivada y equilibrada?'
    ],
    coverGradient: 'from-emerald-950 to-slate-900 border-emerald-500/50'
  },
  {
    id: 'M28',
    title: 'Blade Runner (1982 / Ridley Scott)',
    category: 'Pelicula',
    discipline: 'Filosofía Existencial, Empatía & Conciencia',
    description: 'Un cazador de androides Replicantes cuestiona su propia condición humana al enfrentar a seres creados artificialmente que luchan por vivir.',
    whatToObserve: 'Analiza el célebre monólogo "Lágrimas en la lluvia" de Roy Batty y la prueba Voight-Kampff de empatía.',
    socraticQuestions: [
      '¿Qué define auténticamente a un ser humano: su biología o su capacidad de sentir empatía y dolor por el prójimo?',
      '¿Es la finitud de la vida la condición que otorga significado a la existencia?'
    ],
    coverGradient: 'from-rose-950 to-slate-900 border-rose-600/50'
  },
  {
    id: 'M29',
    title: 'Primer (Shane Carruth)',
    category: 'Pelicula',
    discipline: 'Física Teórica, Lógica Causal & Paradojas',
    description: 'Dos ingenieros descubren accidentalmente cómo crear un bucle temporal cerrado en un garaje, enfrentando contradicciones lógicas complejas.',
    whatToObserve: 'Examina la coherencia lógica interna de las líneas de tiempo y cómo la ambición corrompe la colaboración científica.',
    socraticQuestions: [
      '¿Se puede alterar el pasado sin quebrar el principio de causalidad del presente?',
      '¿Por qué el secreto y la asimetría de información destruyen la confianza entre científicos?'
    ],
    coverGradient: 'from-zinc-950 to-slate-900 border-zinc-600/50'
  },
  {
    id: 'M30',
    title: 'Gattaca (Andrew Niccol)',
    category: 'Pelicula',
    discipline: 'Genética, Bioética & Determinismo',
    description: 'En una sociedad donde los hijos son seleccionados genéticamente, un joven concebido naturalmente desafía el sistema para ser astronauta.',
    whatToObserve: 'Observa la lucha entre el determinismo biológico y la fuerza de la voluntad humana ("No dejé nada para el viaje de regreso").',
    socraticQuestions: [
      '¿Determina el perfil genético el límite infranqueable del logro de una persona?',
      '¿Qué consecuencias éticas y sociales genera la discriminación por motivos genéticos?'
    ],
    coverGradient: 'from-blue-950 to-slate-900 border-blue-500/50'
  },
  {
    id: 'M31',
    title: 'The Matrix (1999 / Hermanas Wachowski)',
    category: 'Pelicula',
    discipline: 'Epistemología Cartesiana & El Mito de la Caverna',
    description: 'Un programador descubre que la realidad que percibe es una simulación neuro-interactiva construida por máquinas inteligentes.',
    whatToObserve: 'Identifica la hipótesis del Genio Maligno de Descartes, la alegoría de la caverna de Platón y la elección de la píldora roja (la verdad dolorosa frente a la ignorancia placentera).',
    socraticQuestions: [
      '¿Cómo puedes probar con certeza absoluta que tus percepciones actuales no son una simulación?',
      '¿Por qué el ser humano prefiere a veces una ilusión reconfortante antes que una verdad desafiante?'
    ],
    coverGradient: 'from-green-950 to-slate-900 border-green-500/50'
  },
  {
    id: 'M32',
    title: 'Ex Machina (Alex Garland)',
    category: 'Pelicula',
    discipline: 'Prueba de Turing, Conciencia & Ética de la IA',
    description: 'Un programador es invitado a la mansión de un magnate tecnológico para administrar la Prueba de Turing a un androide femenino con IA avanzada.',
    whatToObserve: 'Observa cómo Ava utiliza la empatía simulada y la psicología humana como herramientas de manipulación estratégica para escapar.',
    socraticQuestions: [
      'Si una IA simula a la perfección emociones y deseos, ¿tiene sentido filosófico distinguir entre simulación y conciencia real?',
      '¿Qué obligaciones éticas tiene un creador frente a una criatura sintética consciente?'
    ],
    coverGradient: 'from-slate-950 to-slate-900 border-teal-500/50'
  },
  {
    id: 'M33',
    title: 'A Beautiful Mind (Una Mente Brillante)',
    category: 'Pelicula',
    discipline: 'Teoría de Juegos, Matemáticas & Psicología',
    description: 'La vida del matemático John Nash, su descubrimiento del concepto revolucionario del Equilibrio de Nash y su batalla contra la esquizofrenia.',
    whatToObserve: 'Examina la escena del bar donde Nash rebate el principio clásico de Adam Smith ("El mejor resultado surge cuando cada uno hace lo mejor para sí y para el grupo").',
    socraticQuestions: [
      '¿Por qué las decisiones individuales egoístas a menudo conducen a resultados subóptimos para todo el colectivo?',
      '¿Cómo puede la mente humana distinguir un razonamiento riguroso de una convicción delirante?'
    ],
    coverGradient: 'from-amber-950 to-slate-900 border-amber-600/50'
  },
  {
    id: 'M34',
    title: 'Interstellar (Christopher Nolan)',
    category: 'Pelicula',
    discipline: 'Relatividad General, Agujeros Negros & Tiempo',
    description: 'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad ante el colapso ecológico de la Tierra.',
    whatToObserve: 'Observa los efectos de dilatación temporal relativista en las proximidades del agujero negro Gargantúa (1 hora = 7 años en la Tierra).',
    socraticQuestions: [
      '¿Cómo transforma la relatividad del tiempo nuestra concepción humana de las prioridades y las relaciones personales?',
      '¿Es el sacrificio generacional un deber moral hacia el futuro de la especie?'
    ],
    coverGradient: 'from-sky-950 to-slate-900 border-sky-500/50'
  },
  {
    id: 'M35',
    title: 'Memento (Christopher Nolan)',
    category: 'Pelicula',
    discipline: 'Neurociencia de la Memoria, Identidad & Sesgos',
    description: 'Un hombre con amnesia anterógrada utiliza notas, fotos y tatuajes para investigar el asesinato de su esposa, narrada en orden cronológico inverso.',
    whatToObserve: 'Examina la fragilidad de la memoria de corto plazo y cómo el cerebro altera deliberadamente los recuerdos para sostener una narrativa personal que proteja la propia autoestima.',
    socraticQuestions: [
      '¿Somos algo más que la suma de los recuerdos que elegimos preservar?',
      '¿Por qué los registros externos pueden ser manipulados por nosotros mismos cuando nos negamos a aceptar la verdad?'
    ],
    coverGradient: 'from-zinc-950 to-slate-900 border-amber-500/50'
  },
  {
    id: 'M36',
    title: 'The Imitation Game (El Código Enigma)',
    category: 'Pelicula',
    discipline: 'Criptoanálisis, Computación & Ética Bélica',
    description: 'Alan Turing y su equipo en Bletchley Park construyen la primera máquina electromecánica programable para descifrar el código Enigma nazi.',
    whatToObserve: 'Observa la decisión estadística de no alertar a todos los convoyes para evitar que el enemigo descubriera que el código había sido roto.',
    socraticQuestions: [
      '¿Cómo se toman decisiones éticas cuando salvar vidas en el presente significa perder la guerra en el futuro?',
      '¿Por qué la sociedad tiende a rechazar o perseguir a las mentes singulares que la salvan?'
    ],
    coverGradient: 'from-blue-950 to-slate-900 border-sky-500/50'
  }
];

export default function PolimataMultimediaPage() {
  const [filter, setFilter] = useState<'TODOS' | 'Anime' | 'Documental' | 'Pelicula'>('TODOS');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Estado para custom multimedia agregados por el usuario
  const [customCatalog, setCustomCatalog] = useState<MediaItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Anime' | 'Documental' | 'Pelicula'>('Anime');
  const [newDescription, setNewDescription] = useState('');

  // Cargar multimedia guardados por el usuario desde localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('polimata_custom_multimedia');
        if (saved) {
          setCustomCatalog(JSON.parse(saved));
        }
      }
    } catch (e) {}
  }, []);

  // Motor de Auto-Etiquetado Inteligente por Análisis de Palabras Clave
  const handleAutoTagAndAddMedia = () => {
    if (!newTitle.trim()) return;

    const fullText = `${newTitle} ${newDescription}`.toLowerCase();

    // 1. Determinar Disciplina por Palabras Clave
    let discipline = 'Análisis Interdisciplinario & Filosofía';
    if (fullText.includes('física') || fullText.includes('química') || fullText.includes('ciencia') || fullText.includes('espacio') || fullText.includes('universo') || fullText.includes('relatividad')) {
      discipline = 'Física, Cosmología & Método Científico';
    } else if (fullText.includes('ética') || fullText.includes('moral') || fullText.includes('guerra') || fullText.includes('justicia') || fullText.includes('ley')) {
      discipline = 'Ética, Filosofía Moral & Justicia';
    } else if (fullText.includes('mente') || fullText.includes('psicología') || fullText.includes('cerebro') || fullText.includes('memoria') || fullText.includes('sesgo') || fullText.includes('trauma')) {
      discipline = 'Psicología Cognitiva & Neurociencia';
    } else if (fullText.includes('ia') || fullText.includes('robot') || fullText.includes('futuro') || fullText.includes('tecnología') || fullText.includes('digital') || fullText.includes('algoritmo')) {
      discipline = 'Inteligencia Artificial & Posthumanismo';
    } else if (fullText.includes('historia') || fullText.includes('sociedad') || fullText.includes('política') || fullText.includes('poder') || fullText.includes('economía')) {
      discipline = 'Filosofía Política & Historia Social';
    }

    // 2. Generar Preguntas Socráticas Automáticas
    const socraticQuestions = [
      `¿Qué principios fundamentales de ${discipline.split('&')[0]} se ponen a prueba en "${newTitle}"?`,
      `¿Cómo desafía esta obra las suposiciones y prejuicios tradicionales del observador?`
    ];

    const newItem: MediaItem = {
      id: `CUSTOM_M_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      discipline,
      description: newDescription.trim() || `Obra audiovisual añadida al catálogo Polímata.`,
      whatToObserve: `Observa la aplicación práctica de los conceptos de ${discipline} a lo largo del desarrollo de la trama.`,
      socraticQuestions,
      coverGradient: newCategory === 'Anime'
        ? 'from-purple-950 to-slate-900 border-purple-500/50'
        : newCategory === 'Documental'
        ? 'from-sky-950 to-slate-900 border-sky-500/50'
        : 'from-amber-950 to-slate-900 border-amber-500/50'
    };

    const updatedCatalog = [newItem, ...customCatalog];
    setCustomCatalog(updatedCatalog);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('polimata_custom_multimedia', JSON.stringify(updatedCatalog));
      }
    } catch (e) {}

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const allItems = [...customCatalog, ...MEDIA_CATALOG];
  const filteredItems = allItems.filter((item) => filter === 'TODOS' || item.category === filter);

  return (
    <main className="space-y-6 pb-16">
      {/* CABECERA Y TITULO CON BOTÓN AGREGAR */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-800/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold uppercase font-mono">
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span>Polímata Multimedia & Cine de Ideas (36+ Obras)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Catálogo de Anime, Películas y Documentales</h1>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>➕ Añadir Obra con Auto-Etiquetado</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Selección curada de 36 obras maestras analizadas bajo la lupa del aprendizaje interdisciplinario, la epistemología, la ciencia cognitiva y el método científico.
        </p>
      </div>

      {/* BOTONES DE FILTRO */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 pb-2 font-mono text-xs">
        {['TODOS', 'Anime', 'Documental', 'Pelicula'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              filter === cat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === 'TODOS' ? `Ver Todo (${allItems.length})` : `${cat} (${allItems.filter(i => i.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* GRID DE CARDS MULTIMEDIA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-gradient-to-b ${item.coverGradient} border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between space-y-4 shadow-xl`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded bg-black/60 text-purple-300 border border-purple-500/30">
                  {item.category}
                </span>
                <span className="text-slate-400 truncate max-w-[170px]">{item.discipline}</span>
              </div>

              <h3 className="text-lg font-bold text-white pt-1">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{item.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="p-2.5 bg-black/40 rounded-xl border border-slate-800/60 text-[11px] text-amber-200/90 leading-relaxed font-mono">
                <strong className="text-amber-300 block mb-0.5">🔭 Qué Observar:</strong>
                <p className="line-clamp-2">{item.whatToObserve}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedia(item)}
                className="w-full py-2 bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 text-xs font-bold rounded-xl border border-purple-500/40 transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <span>Ficha Socrática & Preguntas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLE Y GUÍA SOCRÁTICA */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-purple-400">
                <Tag className="w-3.5 h-3.5" />
                <span>{selectedMedia.category} — {selectedMedia.discipline}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{selectedMedia.title}</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedMedia.description}</p>

            <div className="p-3.5 bg-amber-950/40 rounded-2xl border border-amber-500/30 text-xs text-amber-200 leading-relaxed font-mono">
              <strong className="text-amber-300 block mb-1">🔍 Guía de Observación Pedagógica:</strong>
              {selectedMedia.whatToObserve}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase font-mono block">
                Preguntas Socráticas a Responder:
              </span>
              {selectedMedia.socraticQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-sky-300 text-[10px] block font-mono">Pregunta {idx + 1}:</strong>
                  {q}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cerrar Ficha
            </button>

          </div>
        </div>
      )}

      {/* MODAL FORMULARIO AÑADIR NUEVA OBRA MULTIMEDIA CON AUTO-ETIQUETADO */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-purple-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-bold text-white">Añadir Obra Multimedia con Auto-Etiquetado</h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">Título de la Obra:</label>
                <input
                  type="text"
                  placeholder="Ej. Attack on Titan, Interstellar..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Categoría:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Anime">Anime</option>
                  <option value="Documental">Documental</option>
                  <option value="Pelicula">Película</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Descripción u Observaciones:</label>
                <textarea
                  rows={3}
                  placeholder="Describe brevemente la trama o conceptos que trata (ej: ética, mente, física, historia)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/40 text-[11px] text-purple-200">
                <span className="font-bold block text-amber-300 mb-0.5">✨ Motor de Auto-Etiquetado Inteligente:</span>
                Al guardar, la app analizará las palabras clave para asignar la disciplina, generar preguntas socráticas y el gradiente visual.
              </div>

              <button
                type="button"
                onClick={handleAutoTagAndAddMedia}
                disabled={!newTitle.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95"
              >
                Auto-Etiquetar & Añadir al Catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
