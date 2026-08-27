/**
 * Utilidad histórica exhaustiva para obtener el año y el período histórico exacto
 * en que fue escrita / publicada cada una de las 170 obras del canon.
 */

export interface WorkYearInfo {
  year: string;
  period: string;
  badgeText: string;
}

const HISTORICAL_WORKS_DATA: Record<number, { year: string; period: string }> = {
  // --- AÑO 1: Cosmología, Orígenes & Filosofía Antigua ---
  1: { year: '2016 d.C.', period: 'Astrofísica & Cosmología' },
  2: { year: '2021 d.C.', period: 'Geología & Historia Planetaria' },
  3: { year: '2005 d.C.', period: 'Arqueología & Prehistoria' },
  4: { year: '2009 d.C.', period: 'Evolución Humana & Paleoantropología' },
  5: { year: '2003 d.C.', period: 'Paleolítico & Holoceno' },
  6: { year: '2005 d.C.', period: 'Revolución Neolítica' },
  7: { year: '2006 d.C.', period: 'Poblamiento Temprano de América' },
  8: { year: '1995 d.C.', period: 'Mesoamérica Indígena' },
  9: { year: '2004 d.C.', period: 'Historiografía de México' },
  10: { year: '~475 a.C.', period: 'Filosofía Oriental (China Clásica)' },
  11: { year: '~600 a.C.', period: 'Filosofía Oriental (Vedismo & Upanishads)' },
  12: { year: '~399 a.C.', period: 'Filosofía Clásica Griega (Socrática)' },
  13: { year: '~385 a.C.', period: 'Filosofía Clásica Griega (Platonismo)' },
  14: { year: '~380 a.C.', period: 'Filosofía Clásica Griega (Platonismo)' },
  15: { year: '~375 a.C.', period: 'Filosofía Clásica Griega (Platonismo)' },
  16: { year: '~340 a.C.', period: 'Filosofía Clásica Griega (Aristotelismo)' },

  // --- AÑO 2: Helenismo, Roma, Ciencia Antigua & Escolástica Temprana ---
  17: { year: '~335 a.C.', period: 'Filosofía Clásica Griega (Ontología)' },
  18: { year: '~330 a.C.', period: 'Filosofía Clásica Griega (Política)' },
  19: { year: '~350 a.C.', period: 'Lógica Clásica & Silogística' },
  20: { year: '~300 a.C.', period: 'Taoísmo Clásico' },
  21: { year: '~150 d.C.', period: 'Budismo Mahāyāna & Mādhyamaka' },
  22: { year: '~108 d.C.', period: 'Estoicismo Romano' },
  23: { year: '~170 d.C.', period: 'Estoicismo Romano' },
  24: { year: '~430 a.C.', period: 'Historiografía Clásica Griega' },
  25: { year: '~400 a.C.', period: 'Historiografía & Realismo Político Clásico' },
  26: { year: '~300 a.C.', period: 'Geometría Clásica Alejandrina' },
  27: { year: '~397 d.C.', period: 'Patrística & Filosofía Cristiana Antigua' },
  28: { year: '~1078 d.C.', period: 'Escolástica Medieval (Argumento Ontológico)' },
  29: { year: '~1270 d.C.', period: 'Escolástica Medieval & Tomismo' },
  30: { year: '~1020 d.C.', period: 'Filosofía Islámica Clásica (Avicenismo)' },
  31: { year: '~1190 d.C.', period: 'Filosofía Medieval Judía' },

  // --- AÑO 3: Renacimiento, Revolución Científica & La Ilustración ---
  32: { year: '~1377 d.C.', period: 'Filosofía de la Historia & Sociología Árabe' },
  33: { year: '1513 d.C.', period: 'Renacimiento & Ciencia Política Moderna' },
  34: { year: '1620 d.C.', period: 'Revolución Científica & Empirismo' },
  35: { year: '1632 d.C.', period: 'Revolución Científica & Heliocentrismo' },
  36: { year: '1637 d.C.', period: 'Racionalismo & Método Cartesiano' },
  37: { year: '1641 d.C.', period: 'Racionalismo & Epistemología Moderna' },
  38: { year: '1651 d.C.', period: 'Contractualismo & Filosofía Política Moderna' },
  39: { year: '1677 d.C.', period: 'Racionalismo / Ilustración Temprana' },
  40: { year: '1689 d.C.', period: 'Empirismo Clásico' },
  41: { year: '1714 d.C.', period: 'Racionalismo & Filosofía Monadológica' },
  42: { year: '1687 d.C.', period: 'Mecánica Clásica & Revolución Newtoniana' },
  43: { year: '1748 d.C.', period: 'Empirismo & Escepticismo Ilustrado' },
  44: { year: '1779 d.C.', period: 'La Ilustración Escocesa' },
  45: { year: '1762 d.C.', period: 'La Ilustración & Teoría Democrática' },
  46: { year: '1759 d.C.', period: 'Ilustración Escocesa & Filosofía Moral' },
  47: { year: '1776 d.C.', period: 'Economía Política Clásica' },
  48: { year: '1781 d.C.', period: 'Idealismo Trascendental (Ilustración Alemana)' },
  49: { year: '1785 d.C.', period: 'Ética Deontológica Ilustrada' },
  50: { year: '1790 d.C.', period: 'Estética & Teleología Ilustrada' },

  // --- AÑO 4: Siglo XIX (Idealismo, Evolución, Industria & Crítica) ---
  51: { year: '1807 d.C.', period: 'Idealismo Alemán / Siglo XIX' },
  52: { year: '1819 d.C.', period: 'Pesimismo Filosófico / Siglo XIX' },
  53: { year: '1859 d.C.', period: 'Liberalismo & Utilitarismo / Siglo XIX' },
  54: { year: '1867 d.C.', period: 'Materialismo Histórico & Crítica de la Economía' },
  55: { year: '1817 d.C.', period: 'Economía Clásica & Teoría del Valor' },
  56: { year: '1835 d.C.', period: 'Sociología Política / Siglo XIX' },
  57: { year: '1847 d.C.', period: 'Existencialismo Cristiano / Siglo XIX' },
  58: { year: '1887 d.C.', period: 'Filosofía de la Sospecha / Siglo XIX' },
  59: { year: '1886 d.C.', period: 'Crítica de la Moral / Siglo XIX' },
  60: { year: '1859 d.C.', period: 'Biología Evolutiva & Selección Natural' },
  61: { year: '1866 d.C.', period: 'Genética Clásica' },
  62: { year: '1949 d.C.', period: 'Historiografía (Escuela de los Annales)' },
  63: { year: '1907 d.C.', period: 'Pragmatismo Filosófico Americano' },
  64: { year: '1902 d.C.', period: 'Psicología & Fenomenología Religiosa' },
  65: { year: '1890 d.C.', period: 'Psicología Experimental Temprana' },
  66: { year: '1905 d.C.', period: 'Sociología Clásica' },
  67: { year: '1922 d.C.', period: 'Sociología Comprensiva' },

  // --- AÑO 5: Siglo XX (Fenomenología, Lógica, Existencialismo & Mente) ---
  68: { year: '1913 d.C.', period: 'Fenomenología Pura' },
  69: { year: '1927 d.C.', period: 'Ontología Fundamental & Existencialismo' },
  70: { year: '1921 d.C.', period: 'Filosofía Analítica & Lógica' },
  71: { year: '1953 d.C.', period: 'Filosofía del Lenguaje Ordinario' },
  72: { year: '1946 d.C.', period: 'Existencialismo Francés' },
  73: { year: '1942 d.C.', period: 'Filosofía del Absurdo' },
  74: { year: '1949 d.C.', period: 'Teoría Crítica & Feminismo Existencial' },
  75: { year: '1946 d.C.', period: 'Psicología Humanista & Logoterapia' },
  76: { year: '1936 d.C.', period: 'Psicología del Desarrollo Cognitivo' },
  77: { year: '1957 d.C.', period: 'Racionalidad Limitada & Ciencias de la Decisión' },
  78: { year: '2011 d.C.', period: 'Economía Conductual & Sesgos Cognitivos' },
  79: { year: '2012 d.C.', period: 'Psicología Moral' },
  80: { year: '1949 d.C.', period: 'Historia Estructural de Larga Duración' },
  81: { year: '2002 d.C.', period: 'Historia Antigua de la India' },
  82: { year: '1974 d.C.', period: 'Historia de la Civilización Islámica' },
  83: { year: '1995 d.C.', period: 'Historia del Continente Africano' },
  84: { year: '1990 d.C.', period: 'Historia de la China Moderna' },
  85: { year: '2004 d.C.', period: 'Historia Global / Siglo XIX' },

  // --- AÑO 6: Historia Global, América Latina & Colapso de Sistemas ---
  86: { year: '2009 d.C.', period: 'Historia Global del Siglo XIX' },
  87: { year: '1962 d.C.', period: 'Historia Contemporánea (Era de la Revolución)' },
  88: { year: '1994 d.C.', period: 'Historia del Siglo XX Corto' },
  89: { year: '2000 d.C.', period: 'Historia Económica Comparada' },
  90: { year: '1969 d.C.', period: 'Historia del Comercio Atlántico' },
  91: { year: '1969 d.C.', period: 'Historiografía Latinoamericana Contemporánea' },
  92: { year: '1987 d.C.', period: 'Geopolítica & Gran Estrategia' },
  93: { year: '1983 d.C.', period: 'Teoría del Nacionalismo & Antropología Política' },
  94: { year: '1988 d.C.', period: 'Sistemas Complejos & Arqueología del Colapso' },
  95: { year: '1959 d.C.', period: 'Etnohistoria & Crónica Indígena de la Conquista' },
  96: { year: '1632 d.C.', period: 'Crónica Virreinal Novohispana' },
  97: { year: '1522 d.C.', period: 'Crónicas de la Conquista de México' },
  98: { year: '1992 d.C.', period: 'Historia Cultural de la Conquista' },
  99: { year: '1958 d.C.', period: 'Filosofía de la Historia Mexicana' },
  100: { year: '1971 d.C.', period: 'Historia Económica Colonial Novohispana' },
  101: { year: '2002 d.C.', period: 'Historiografía de las Identidades Mexicanas' },
  102: { year: '1968 d.C.', period: 'Historia de las Ideas Políticas en México' },

  // --- AÑO 7: Siglo XX (Guerra, Revolución & Filosofía Política) ---
  103: { year: '1989 d.C.', period: 'Sociología Histórica de la Revolución Mexicana' },
  104: { year: '1986 d.C.', period: 'Historia de la Revolución Mexicana' },
  105: { year: '1972 d.C.', period: 'Análisis Político del México Contemporáneo' },
  106: { year: '1968 d.C.', period: 'Microhistoria Mexicana' },
  107: { year: '1950 d.C.', period: 'Ensayo & Fenomenología de la Identidad' },
  108: { year: '2014 d.C.', period: 'Filosofía Náhuatl & Epistemología Indígena' },
  109: { year: '2013 d.C.', period: 'Historia Política Contemporánea de México' },
  110: { year: '1977 d.C.', period: 'Filosofía de la Liberación Latinoamericana' },
  111: { year: '1980 d.C.', period: 'Filosofía Africana Contemporánea' },
  112: { year: '1958 d.C.', period: 'Teoría Política / Posguerra' },
  113: { year: '1951 d.C.', period: 'Análisis del Totalitarismo' },
  114: { year: '1958 d.C.', period: 'Filosofía Política Analítica (Dos Libertades)' },
  115: { year: '1971 d.C.', period: 'Teoría de la Justicia & Filosofía Política' },
  116: { year: '2009 d.C.', period: 'Filosofía de la Justicia & Enfoque de Capacidades' },
  117: { year: '1975 d.C.', period: 'Filosofía del Poder & Arqueología del Saber' },
  118: { year: '1944 d.C.', period: 'Economía Institucional & Crítica del Mercado' },
  119: { year: '1936 d.C.', period: 'Macroeconomía Keynesiana' },
  120: { year: '1942 d.C.', period: 'Teoría Económica & Destrucción Creativa' },

  // --- AÑO 8: Epistemología, Economía & Ciencias Naturales Modernas ---
  121: { year: '1973 d.C.', period: 'Filosofía Jurídica & Orden Espontáneo' },
  122: { year: '1962 d.C.', period: 'Economía Neoliberal / Monetarismo' },
  123: { year: '1990 d.C.', period: 'Nueva Economía Institucional' },
  124: { year: '1990 d.C.', period: 'Gobernanza de Recursos Comunes (Nobel)' },
  125: { year: '2013 d.C.', period: 'Economía de la Desigualdad' },
  126: { year: '2012 d.C.', period: 'Economía Política & Desarrollo Institucional' },
  127: { year: '1934 d.C.', period: 'Filosofía de la Ciencia (Falsacionismo)' },
  128: { year: '1962 d.C.', period: 'Filosofía de la Ciencia (Paradigmas)' },
  129: { year: '1970 d.C.', period: 'Metodología de Programas Científicos' },
  130: { year: '1975 d.C.', period: 'Anarquismo Epistemológico' },
  131: { year: '1944 d.C.', period: 'Biofísica & Origen Físico de la Vida' },
  132: { year: '1970 d.C.', period: 'Biología Molecular & Epistemología' },
  133: { year: '1916 d.C.', period: 'Física Moderna (Relatividad Especial y General)' },
  134: { year: '1965 d.C.', period: 'Física Cuántica & Epistemología' },
  135: { year: '1962 d.C.', period: 'Ecología Moderna & Medio Ambiente' },
  136: { year: '2017 d.C.', period: 'Energía & Dinámica de la Civilización' },

  // --- AÑO 9: Lógica Matemática, Computación, IA & Mente ---
  137: { year: '1931 d.C.', period: 'Lógica Matemática (Teoremas de Incompletitud)' },
  138: { year: '1936 d.C.', period: 'Computación Teórica (Máquina de Turing)' },
  139: { year: '1948 d.C.', period: 'Teoría Matemática de la Información' },
  140: { year: '1948 d.C.', period: 'Cibernética & Teoría del Control' },
  141: { year: '1985 d.C.', period: 'Estructura e Interpretación de Programas (MIT)' },
  142: { year: '2018 d.C.', period: 'Causalidad & Razonamiento Inferencial' },
  143: { year: '1995 d.C.', period: 'Inteligencia Artificial Clásica y Moderna' },
  144: { year: '2016 d.C.', period: 'Física Teórica & Filosofía Natural' },
  145: { year: '2015 d.C.', period: 'Redes Neuronales Artificiales & Deep Learning' },
  146: { year: '1979 d.C.', period: 'Ciencia Cognitiva & Lógica Recursiva (GEB)' },
  147: { year: '1986 d.C.', period: 'Arquitectura de la Mente & Inteligencia Artificial' },
  148: { year: '2014 d.C.', period: 'Neurociencia de la Conciencia' },
  149: { year: '1998 d.C.', period: 'Filosofía de la Mente & Cognición Extendida' },
  150: { year: '1974 d.C.', period: 'Filosofía de la Mente & Subjetividad' },
  151: { year: '1995 d.C.', period: 'El Problema Difícil de la Conciencia' },
  152: { year: '1984 d.C.', period: 'Identidad Personal & Ética Normativa' },
  153: { year: '1953 d.C.', period: 'Filosofía Analítica & Epistemología Naturalizada' },

  // --- AÑO 10: Sistemas Complejos, Redes, Antifragilidad & Futuro ---
  154: { year: '1972 d.C.', period: 'Lógica Modal & Filosofía del Lenguaje' },
  155: { year: '1960 d.C.', period: 'Hermenéutica Filosófica' },
  156: { year: '2008 d.C.', period: 'Pensamiento Sistémico & Cibernética Aplicada' },
  157: { year: '1968 d.C.', period: 'Teoría General de Sistemas' },
  158: { year: '2009 d.C.', period: 'Ciencia de la Complejidad' },
  159: { year: '2003 d.C.', period: 'Sincronización & Dinámica No Lineal' },
  160: { year: '2017 d.C.', period: 'Leyes de Escalamiento Biológico y Urbano' },
  161: { year: '2007 d.C.', period: 'Epistemología de la Incertidumbre (Cisne Negro)' },
  162: { year: '2012 d.C.', period: 'Sistemas Complejos & Antifragilidad' },
  163: { year: '~500 a.C.', period: 'Estrategia Clásica Oriental' },
  164: { year: '1832 d.C.', period: 'Filosofía de la Estrategia & Teoría de la Guerra' },
  165: { year: '1944 d.C.', period: 'Teoría de Juegos & Modelado Estratégico' },
  166: { year: '1960 d.C.', period: 'Estrategia del Conflicto & Teoría de Negociación' },
  167: { year: '1989 d.C.', period: 'Sociología de la Modernidad Líquida' },
  168: { year: '1998 d.C.', period: 'Consiliencia & Unificación del Conocimiento' },
  169: { year: '1990 d.C.', period: 'Organizaciones de Aprendizaje & Pensamiento Sistémico' },
  170: { year: '1995 d.C.', period: 'Evolución de la Mente & Conciencia Darwiniana' }
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
