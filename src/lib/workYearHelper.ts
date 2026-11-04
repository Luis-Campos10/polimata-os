/**
 * Utilidad histórica exhaustiva para obtener el año y el período histórico exacto
 * en que fue escrita / publicada cada una de las 200 obras del Canon 3.0.
 */

export interface WorkYearInfo {
  year: string;
  period: string;
  badgeText: string;
}

export interface YearDetail {
  title: string;
  integratingQuestion: string;
  focusQuestions: string[];
}

export const YEAR_DETAILS: Record<number, YearDetail> = {
  "1": {
    "title": "Fundamentos: asombro, realidad, virtud y primeras historias",
    "integratingQuestion": "¿De dónde proceden nuestras formas de entender el mundo?",
    "focusQuestions": [
      "Q01",
      "Q03",
      "Q10",
      "Q17"
    ]
  },
  "2": {
    "title": "Cómo justificamos ideas: ciencia, poder y comparación cultural",
    "integratingQuestion": "¿Qué hace que una explicación o un gobierno sea creíble?",
    "focusQuestions": [
      "Q02",
      "Q07",
      "Q11",
      "Q12"
    ]
  },
  "3": {
    "title": "Razón, lenguaje, biología y organización de la vida humana",
    "integratingQuestion": "¿Cómo surgen formas de razón, conocimiento y cooperación?",
    "focusQuestions": [
      "Q03",
      "Q05",
      "Q13",
      "Q15"
    ]
  },
  "4": {
    "title": "Conocimiento moderno, evolución y sociedad",
    "integratingQuestion": "¿Cómo cambia lo que sabemos sobre vida y sociedad?",
    "focusQuestions": [
      "Q01",
      "Q12",
      "Q15",
      "Q17"
    ]
  },
  "5": {
    "title": "Causalidad, revoluciones y economía histórica",
    "integratingQuestion": "¿Qué hace legítimas nuestras creencias y arreglos colectivos?",
    "focusQuestions": [
      "Q03",
      "Q11",
      "Q12",
      "Q17"
    ]
  },
  "6": {
    "title": "Identidad, modelos explicativos y culturas",
    "integratingQuestion": "¿Cómo emergen identidad, instituciones y explicaciones?",
    "focusQuestions": [
      "Q04",
      "Q05",
      "Q13",
      "Q14"
    ]
  },
  "7": {
    "title": "Instituciones, moralidad, ciencia y experiencia",
    "integratingQuestion": "¿Qué debemos a otros y qué podemos justificar?",
    "focusQuestions": [
      "Q06",
      "Q09",
      "Q11",
      "Q12"
    ]
  },
  "8": {
    "title": "Justicia, interpretación, crisis y diversidad",
    "integratingQuestion": "¿Cómo evaluar cultura, poder y teorías enfrentadas?",
    "focusQuestions": [
      "Q07",
      "Q14",
      "Q15",
      "Q17"
    ]
  },
  "9": {
    "title": "Complejidad, crítica de teorías y experiencia humana",
    "integratingQuestion": "¿Cómo afrontar la incertidumbre, el sufrimiento y el conocimiento?",
    "focusQuestions": [
      "Q03",
      "Q08",
      "Q15",
      "Q18"
    ]
  },
  "10": {
    "title": "Síntesis, incertidumbre y futuro de la humanidad",
    "integratingQuestion": "¿Qué síntesis y responsabilidades futuras podemos defender?",
    "focusQuestions": [
      "Q02",
      "Q04",
      "Q16",
      "Q18"
    ]
  }
};

const HISTORICAL_WORKS_DATA: Record<number, { year: string; period: string }> = {
  // --- AÑO 1: Fundamentos: asombro, realidad, virtud y primeras historias ---
  1: { year: '2004 d.C.', period: 'Historiografía de México' },
  2: { year: '2005 d.C.', period: 'Economía & Elección Pública' },
  3: { year: '~399 a.C.', period: 'Filosofía Clásica Griega (Socrática)' },
  4: { year: '~475 a.C.', period: 'Filosofía Oriental (China Clásica)' },
  5: { year: '2006 d.C.', period: 'Poblamiento Temprano de América' },
  6: { year: '1759 d.C.', period: 'Ilustración Escocesa & Filosofía Moral' },
  7: { year: '1980 d.C.', period: 'Astrofísica & Cosmología Divulgativa' },
  8: { year: '1637 d.C.', period: 'Racionalismo & Método Cartesiano' },
  9: { year: '~340 a.C.', period: 'Filosofía Clásica Griega (Aristotelismo)' },
  10: { year: '2008 d.C.', period: 'Pensamiento Sistémico & Cibernética Aplicada' },
  11: { year: '1949 d.C.', period: 'Historiografía (Escuela de los Annales)' },
  12: { year: '~750 a.C.', period: 'Épica Arcaica & Tragedia Humana' },
  13: { year: '1998 d.C.', period: 'Psicología Contemporánea' },
  14: { year: '~330 a.C.', period: 'Filosofía Clásica Griega (Política)' },
  15: { year: '2021 d.C.', period: 'Geología & Historia Planetaria' },
  16: { year: '~200 d.C.', period: 'Escepticismo Pirrónico Clásico' },
  17: { year: '~108 d.C.', period: 'Estoicismo Romano' },
  18: { year: '~500 a.C.', period: 'Estrategia Clásica Oriental' },
  19: { year: '~430 a.C.', period: 'Historiografía Clásica Griega' },
  20: { year: '~1554 d.C.', period: 'Literatura & Cosmovisión Maya-K\'iche\'' },

  // --- AÑO 2: Cómo justificamos ideas: ciencia, poder y comparación cultural ---
  21: { year: '1513 d.C.', period: 'Renacimiento & Ciencia Política Moderna' },
  22: { year: '1995 d.C.', period: 'Mesoamérica Indígena' },
  23: { year: '1620 d.C.', period: 'Revolución Científica & Empirismo' },
  24: { year: '~600 a.C.', period: 'Filosofía Oriental (Vedismo & Upanishads)' },
  25: { year: '~375 a.C.', period: 'Filosofía Clásica Griega (Platonismo)' },
  26: { year: '2008 d.C.', period: 'Biología Evolutiva & Paleontología' },
  27: { year: '~1377 d.C.', period: 'Filosofía de la Historia & Sociología Árabe' },
  28: { year: '1748 d.C.', period: 'Empirismo & Escepticismo Ilustrado' },
  29: { year: '~380 a.C.', period: 'Filosofía Clásica Griega (Platonismo)' },
  30: { year: '2009 d.C.', period: 'Ciencia de la Complejidad' },
  31: { year: '1890 d.C.', period: 'Psicología Experimental Temprana' },
  32: { year: '1651 d.C.', period: 'Contractualismo & Filosofía Política Moderna' },
  33: { year: '2001 d.C.', period: 'Historia & Cultura Química' },
  34: { year: '~400 a.C.', period: 'Historiografía & Realismo Político Clásico' },
  35: { year: '1907 d.C.', period: 'Pragmatismo Filosófico Americano' },
  36: { year: '1955 d.C.', period: 'Literatura Mexicana & Ficción Metafísica' },
  37: { year: '~400 a.C.', period: 'Taoísmo Clásico & Ontología del Vacío' },
  38: { year: '2019 d.C.', period: 'Inteligencia Artificial Contemporánea' },
  39: { year: '1934 d.C.', period: 'Psicología Socio-Histórica & Origen del Pensamiento' },
  40: { year: '1689 d.C.', period: 'Liberalismo Político & Propiedad Privada' },

  // --- AÑO 3: Razón, lenguaje, biología y organización de la vida humana ---
  41: { year: '2005 d.C.', period: 'Arqueología & Prehistoria' },
  42: { year: '2002 d.C.', period: 'Historia Antigua de la India' },
  43: { year: '1689 d.C.', period: 'Empirismo Clásico' },
  44: { year: '1762 d.C.', period: 'La Ilustración & Teoría Democrática' },
  45: { year: '1981 d.C.', period: 'Filosofía & Cultura Matemática' },
  46: { year: '~300 a.C.', period: 'Taoísmo Clásico' },
  47: { year: '1995 d.C.', period: 'Historia del Continente Africano' },
  48: { year: '1641 d.C.', period: 'Racionalismo & Epistemología Moderna' },
  49: { year: '1776 d.C.', period: 'Economía Política Clásica' },
  50: { year: '2016 d.C.', period: 'Genética & Biología Molecular' },
  51: { year: '1991 d.C.', period: 'Teoría de Juegos Estratégica' },
  52: { year: '~170 d.C.', period: 'Estoicismo Romano' },
  53: { year: '1601 d.C.', period: 'Teatro Isabelino & Tragedia Filosófica' },
  54: { year: '1957 d.C.', period: 'Racionalidad Limitada & Ciencias de la Decisión' },
  55: { year: '1974 d.C.', period: 'Historia de la Civilización Islámica' },
  56: { year: '~350 a.C.', period: 'Lógica Clásica & Silogística' },
  57: { year: '1859 d.C.', period: 'Liberalismo & Utilitarismo / Siglo XIX' },
  58: { year: '1995 d.C.', period: 'Escepticismo Científico & Pensamiento Crítico' },
  59: { year: '2007 d.C.', period: 'Epistemología de la Incertidumbre (Cisne Negro)' },
  60: { year: '~385 a.C.', period: 'Filosofía Clásica Griega (Platonismo)' },

  // --- AÑO 4: Conocimiento moderno, evolución y sociedad ---
  61: { year: '1990 d.C.', period: 'Historia de la China Moderna' },
  62: { year: '1835 d.C.', period: 'Sociología Política / Siglo XIX' },
  63: { year: '~335 a.C.', period: 'Filosofía Clásica Griega (Ontología)' },
  64: { year: '2004 d.C.', period: 'Historia Global / Siglo XIX' },
  65: { year: '~65 d.C.', period: 'Filosofía Moral Romana & Estoicismo' },
  66: { year: '1867 d.C.', period: 'Materialismo Histórico & Crítica de la Economía' },
  67: { year: '1632 d.C.', period: 'Revolución Científica & Heliocentrismo' },
  68: { year: '1714 d.C.', period: 'Racionalismo & Filosofía Monadológica' },
  69: { year: '1605 d.C.', period: 'Literatura Clásica Hispánica' },
  70: { year: '2007 d.C.', period: 'Historia Social del Atlántico' },
  71: { year: '44 a.C.', period: 'Filosofía del Derecho & Deber Republicano' },
  72: { year: '1968 d.C.', period: 'Teoría General de Sistemas' },
  73: { year: '2011 d.C.', period: 'Economía Conductual & Sesgos Cognitivos' },
  74: { year: '1905 d.C.', period: 'Sociología Clásica' },
  75: { year: '1859 d.C.', period: 'Biología Evolutiva & Selección Natural' },
  76: { year: '~150 d.C.', period: 'Budismo Mahāyāna & Mādhyamaka' },
  77: { year: '1692 d.C.', period: 'Barroco Novohispano & Epistemología Poética' },
  78: { year: '1983 d.C.', period: 'Teoría del Nacionalismo & Antropología Política' },
  79: { year: '~397 d.C.', period: 'Patrística & Filosofía Cristiana Antigua' },
  80: { year: '1999 d.C.', period: 'Arquitectura de Computadoras & Sistemas' },

  // --- AÑO 5: Causalidad, revoluciones y economía histórica ---
  81: { year: '1949 d.C.', period: 'Historia Estructural de Larga Duración' },
  82: { year: '1959 d.C.', period: 'Teoría Sociológica Crítica' },
  83: { year: '~1020 d.C.', period: 'Filosofía Islámica Clásica (Avicenismo)' },
  84: { year: '1962 d.C.', period: 'Historia Contemporánea (Era de la Revolución)' },
  85: { year: '1748 d.C.', period: 'Teoría Constitucional & Separación de Poderes' },
  86: { year: '~1078 d.C.', period: 'Escolástica Medieval (Argumento Ontológico)' },
  87: { year: '1866 d.C.', period: 'Genética Clásica' },
  88: { year: '1934 d.C.', period: 'Filosofía de la Ciencia (Falsacionismo)' },
  89: { year: '2012 d.C.', period: 'Psicología Moral' },
  90: { year: '1969 d.C.', period: 'Historiografía Latinoamericana Contemporánea' },
  91: { year: '1961 d.C.', period: 'Filosofía del Derecho & Positivismo Jurídico' },
  92: { year: '~1270 d.C.', period: 'Escolástica Medieval & Tomismo' },
  93: { year: '2011 d.C.', period: 'Revolución Científica & Historia de la Física' },
  94: { year: '2018 d.C.', period: 'Causalidad & Razonamiento Inferencial' },
  95: { year: '1972 d.C.', period: 'Crítica de Arte & Cultura Visual' },
  96: { year: '1962 d.C.', period: 'Filosofía de la Ciencia (Paradigmas)' },
  97: { year: '1930 d.C.', period: 'Psicoanálisis & Crítica Civilizatoria' },
  98: { year: '1988 d.C.', period: 'Sistemas Complejos & Arqueología del Colapso' },
  99: { year: '1977 d.C.', period: 'Filosofía de la Liberación Latinoamericana' },
  100: { year: '~1190 d.C.', period: 'Filosofía Medieval Judía' },

  // --- AÑO 6: Identidad, modelos explicativos y culturas ---
  101: { year: '1994 d.C.', period: 'Historia del Siglo XX Corto' },
  102: { year: '1781 d.C.', period: 'Idealismo Trascendental (Ilustración Alemana)' },
  103: { year: '1958 d.C.', period: 'Teoría Política / Posguerra' },
  104: { year: '1962 d.C.', period: 'Ecología Moderna & Medio Ambiente' },
  105: { year: '2017 d.C.', period: 'Leyes de Escalamiento Biológico y Urbano' },
  106: { year: '1106 d.C.', period: 'Epistemología Islámica & Autocrítica Racional' },
  107: { year: '2000 d.C.', period: 'Historia Económica Comparada' },
  108: { year: '1921 d.C.', period: 'Filosofía Analítica & Lógica' },
  109: { year: '1958 d.C.', period: 'Literatura Africana Postcolonial' },
  110: { year: '1951 d.C.', period: 'Análisis del Totalitarismo' },
  111: { year: '2014 d.C.', period: 'Ciencias Ambientales & Biodiversidad' },
  112: { year: '2000 d.C.', period: 'Historia de la Computabilidad' },
  113: { year: '1986 d.C.', period: 'Arquitectura de la Mente & Inteligencia Artificial' },
  114: { year: '1677 d.C.', period: 'Racionalismo / Ilustración Temprana' },
  115: { year: '~150 a.C.', period: 'Teoría Constitucional Romana & Ciclos de Gobierno' },
  116: { year: '1739 d.C.', period: 'Empirismo Radical & Escepticismo Psicológico' },
  117: { year: '1987 d.C.', period: 'Literatura Afroamericana & Memoria Histórica' },
  118: { year: '1958 d.C.', period: 'Filosofía Política Analítica (Dos Libertades)' },
  119: { year: '~55 a.C.', period: 'Atomismo Romano & Filosofía Epicúrea' },
  120: { year: '1960 d.C.', period: 'Estrategia del Conflicto & Teoría de Negociación' },

  // --- AÑO 7: Instituciones, moralidad, ciencia y experiencia ---
  121: { year: '2009 d.C.', period: 'Historia Global del Siglo XIX' },
  122: { year: '1779 d.C.', period: 'La Ilustración Escocesa' },
  123: { year: '1971 d.C.', period: 'Teoría de la Justicia & Filosofía Política' },
  124: { year: '1980 d.C.', period: 'Filosofía Africana Contemporánea' },
  125: { year: '1959 d.C.', period: 'Etnohistoria & Crónica Indígena de la Conquista' },
  126: { year: '1670 d.C.', period: 'Antropología Existencial & Paradoja Humana' },
  127: { year: '2009 d.C.', period: 'Filosofía de la Justicia & Enfoque de Capacidades' },
  128: { year: '1994 d.C.', period: 'Fundamentos de la Física' },
  129: { year: '1913 d.C.', period: 'Fenomenología Pura' },
  130: { year: '1997 d.C.', period: 'Geografía Evolutiva & Determinismo Ecológico' },
  131: { year: '2014 d.C.', period: 'Neurociencia de la Conciencia' },
  132: { year: '~1008 d.C.', period: 'Literatura Clásica Japonesa (Heian)' },
  133: { year: '1785 d.C.', period: 'Ética Deontológica Ilustrada' },
  134: { year: '2011 d.C.', period: 'Teoría & Cultura de la Información' },
  135: { year: '1975 d.C.', period: 'Filosofía del Poder & Arqueología del Saber' },
  136: { year: '1965 d.C.', period: 'Física Cuántica & Epistemología' },
  137: { year: '1953 d.C.', period: 'Filosofía del Lenguaje Ordinario' },
  138: { year: '1632 d.C.', period: 'Crónica Virreinal Novohispana' },
  139: { year: '1998 d.C.', period: 'Filosofía de la Mente & Cognición Extendida' },
  140: { year: '1967 d.C.', period: 'Realismo Mágico & Literatura Latinoamericana' },

  // --- AÑO 8: Justicia, interpretación, crisis y diversidad ---
  141: { year: '1522 d.C.', period: 'Crónicas de la Conquista de México' },
  142: { year: '1944 d.C.', period: 'Economía Institucional & Crítica del Mercado' },
  143: { year: '1843 d.C.', period: 'Existencialismo Cristiano & Salto de Fe' },
  144: { year: '1927 d.C.', period: 'Ontología Fundamental & Existencialismo' },
  145: { year: '1992 d.C.', period: 'Historia Cultural de la Conquista' },
  146: { year: '1936 d.C.', period: 'Macroeconomía Keynesiana' },
  147: { year: '1916 d.C.', period: 'Física Moderna (Relatividad Especial y General)' },
  148: { year: '1887 d.C.', period: 'Filosofía de la Sospecha / Siglo XIX' },
  149: { year: '1979 d.C.', period: 'Ciencia Cognitiva & Lógica Recursiva (GEB)' },
  150: { year: '1807 d.C.', period: 'Idealismo Alemán / Siglo XIX' },
  151: { year: '1958 d.C.', period: 'Filosofía de la Historia Mexicana' },
  152: { year: '1973 d.C.', period: 'Filosofía Jurídica & Orden Espontáneo' },
  153: { year: '1944 d.C.', period: 'Biofísica & Origen Físico de la Vida' },
  154: { year: '1902 d.C.', period: 'Psicología & Fenomenología Religiosa' },
  155: { year: '1832 d.C.', period: 'Filosofía de la Estrategia & Teoría de la Guerra' },
  156: { year: '1974 d.C.', period: 'Filosofía de la Mente & Subjetividad' },
  157: { year: '1819 d.C.', period: 'Pesimismo Filosófico / Siglo XIX' },
  158: { year: '1808 d.C.', period: 'Romanticismo & Tragedia del Conocimiento Fáustico' },
  159: { year: '1989 d.C.', period: 'Sociología Histórica de la Revolución Mexicana' },
  160: { year: '1990 d.C.', period: 'Nueva Economía Institucional' },

  // --- AÑO 9: Complejidad, crítica de teorías y experiencia humana ---
  161: { year: '1986 d.C.', period: 'Historia de la Revolución Mexicana' },
  162: { year: '1946 d.C.', period: 'Existencialismo Francés' },
  163: { year: '1970 d.C.', period: 'Metodología de Programas Científicos' },
  164: { year: '1990 d.C.', period: 'Gobernanza de Recursos Comunes (Nobel)' },
  165: { year: '1970 d.C.', period: 'Biología Molecular & Epistemología' },
  166: { year: '1972 d.C.', period: 'Análisis Político del México Contemporáneo' },
  167: { year: '1942 d.C.', period: 'Filosofía del Absurdo' },
  168: { year: '2024 d.C.', period: 'Crítica de Sistemas de Inteligencia Artificial' },
  169: { year: '1975 d.C.', period: 'Anarquismo Epistemológico' },
  170: { year: '2013 d.C.', period: 'Economía de la Desigualdad' },
  171: { year: '2017 d.C.', period: 'Energía & Dinámica de la Civilización' },
  172: { year: '1995 d.C.', period: 'El Problema Difícil de la Conciencia' },
  173: { year: '1950 d.C.', period: 'Historia del Arte Occidental' },
  174: { year: '1968 d.C.', period: 'Microhistoria Mexicana' },
  175: { year: '1949 d.C.', period: 'Teoría Crítica & Feminismo Existencial' },
  176: { year: '1950 d.C.', period: 'Cibernética & Sociedad' },
  177: { year: '1953 d.C.', period: 'Filosofía Analítica & Epistemología Naturalizada' },
  178: { year: '2012 d.C.', period: 'Economía Política & Desarrollo Institucional' },
  179: { year: '2003 d.C.', period: 'Sincronización & Dinámica No Lineal' },
  180: { year: '1945 d.C.', period: 'Fenomenología Corpórea & Percepción Encarnada' },

  // --- AÑO 10: Síntesis, incertidumbre y futuro de la humanidad ---
  181: { year: '2014 d.C.', period: 'Filosofía Náhuatl & Epistemología Indígena' },
  182: { year: '1972 d.C.', period: 'Lógica Modal & Filosofía del Lenguaje' },
  183: { year: '1946 d.C.', period: 'Psicología Humanista & Logoterapia' },
  184: { year: '1950 d.C.', period: 'Ensayo & Fenomenología de la Identidad' },
  185: { year: '1989 d.C.', period: 'Sociología de la Modernidad Líquida' },
  186: { year: '1960 d.C.', period: 'Hermenéutica Filosófica' },
  187: { year: '1984 d.C.', period: 'Identidad Personal & Ética Normativa' },
  188: { year: '1552 d.C.', period: 'Derecho Internacional Temprano & Crítica Colonial' },
  189: { year: '1958 d.C.', period: 'Lógica Matemática & Metamatemática' },
  190: { year: '1974 d.C.', period: 'Teoría del Sistema-Mundo & Economía Histórica' },
  191: { year: '1880 d.C.', period: 'Literatura Rusa & Filosofía Moral' },
  192: { year: '1998 d.C.', period: 'Consiliencia & Unificación del Conocimiento' },
  193: { year: '2016 d.C.', period: 'Física Teórica & Filosofía Natural' },
  194: { year: '1670 d.C.', period: 'Filosofía Política Moderna & Libertad de Expresión' },
  195: { year: '1902 d.C.', period: 'Historiografía Liberal & Evolución de México' },
  196: { year: '1979 d.C.', period: 'Termodinámica del No Equilibrio & Filosofía del Tiempo' },
  197: { year: '1974 d.C.', period: 'Filosofía Política Libertaria & Estado Mínimo' },
  198: { year: '1995 d.C.', period: 'Evolución de la Mente & Conciencia Darwiniana' },
  199: { year: '1790 d.C.', period: 'Estética & Teleología Ilustrada' },
  200: { year: '2014 d.C.', period: 'Alineamiento de Inteligencia Artificial & Riesgo Existencial' },

};

export function getWorkHistoricalData(workNumber: number): WorkYearInfo {
  const data = HISTORICAL_WORKS_DATA[workNumber];
  if (data) {
    return {
      year: data.year,
      period: data.period,
      badgeText: `✍️ ${data.year} · ${data.period}`
    };
  }
  return {
    year: 'Fecha histórica',
    period: 'Canon Interdisciplinario',
    badgeText: '✍️ Canon Interdisciplinario'
  };
}

export function getWorkPublicationYear(workNumber: number): string {
  return getWorkHistoricalData(workNumber).badgeText;
}
