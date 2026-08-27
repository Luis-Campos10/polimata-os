/**
 * Utilidad histórica para obtener el año en que fue escrita / publicada cada obra del canon.
 */

const HISTORICAL_YEAR_MAP: Record<number, string> = {
  // --- AÑO 1: Big History & Grecia Clásica ---
  1: '2016 d.C.', // OpenStax - Astronomy 2e
  2: '2021 d.C.', // Andrew H. Knoll - A Brief History of Earth
  3: '2005 d.C.', // Chris Scarre - The Human Past
  4: '2009 d.C.', // Richard G. Klein - The Human Career
  5: '2003 d.C.', // Steven Mithen - After the Ice
  6: '2005 d.C.', // Peter Bellwood - First Farmers
  7: '2004 d.C.', // Marc Van De Mieroop - A History of the Ancient Near East
  8: '2000 d.C.', // Ian Shaw - Oxford History of Ancient Egypt
  9: '2002 d.C.', // Romila Thapar - Early India
  10: '2007 d.C.', // Mark Edward Lewis - Early Chinese Empires
  11: '1996 d.C.', // Robin Osborne - Greece in the Making
  12: '~399 a.C.', // Platón - Apología de Sócrates
  13: '~385 a.C.', // Platón - Fedón
  14: '~380 a.C.', // Platón - Banquete
  15: '~375 a.C.', // Platón - República
  16: '~340 a.C.', // Aristóteles - Ética a Nicómaco

  // --- AÑO 2: Helenismo, Roma & Ciencia Clásica ---
  17: '~335 a.C.', // Aristóteles - Metafísica
  18: '~330 a.C.', // Aristóteles - Política
  19: '~350 a.C.', // Aristóteles - Analíticos primeros y segundos
  20: '~330 a.C.', // Aristóteles - Física
  21: '~325 a.C.', // Aristóteles - Poética
  22: '~108 d.C.', // Epicteto - Disertaciones + Enquiridión
  23: '~170 d.C.', // Marco Aurelio - Meditaciones
  24: '~65 d.C.', // Séneca - Epístolas morales a Lucilio
  25: '~400 a.C.', // Tucídides - Historia de la guerra del Peloponeso
  26: '~300 a.C.', // Euclides - Elementos
  27: '~250 a.C.', // Arquímedes - Sobre la esfera y el cilindro
  28: '~55 a.C.', // Lucrecio - De rerum natura
  29: '~150 d.C.', // Ptolomeo - Almagesto
  30: '~170 d.C.', // Galeno - Tratados médicos
  31: '~250 d.C.', // Plotino - Enéadas
  32: '~200 d.C.', // Sexto Empírico - Esbozos pirrónicos
  33: '~100 a.C.', // Sima Qian - Shiji (Memorias históricas)
  34: '~300 a.C.', // Kautilya - Arthashastra

  // --- AÑO 3: Escolástica, Edad Media & Teología ---
  35: '~397 d.C.', // San Agustín - Confesiones
  36: '~426 d.C.', // San Agustín - La ciudad de Dios
  37: '~524 d.C.', // Boecio - La consolación de la filosofía
  38: '~1078 d.C.', // San Anselmo - Proslogion
  39: '~1190 d.C.', // Maimónides - Guía de perplejos
  40: '~1180 d.C.', // Averroes - Tahafut al-Tahafut (Incoherencia de la incoherencia)
  41: '~1020 d.C.', // Avicena - Canon de medicina
  42: '~1270 d.C.', // Tomás de Aquino - Suma Teológica
  43: '~1260 d.C.', // Tomás de Aquino - Suma contra los gentiles
  44: '~1320 d.C.', // Dante Alighieri - Divina Comedia
  45: '~1320 d.C.', // Dante Alighieri - De Monarchia
  46: '~1324 d.C.', // Marsilio de Padua - Defensor Pacis
  47: '~1320 d.C.', // Guillermo de Ockham - Suma de lógica
  48: '~1377 d.C.', // Ibn Jaldún - Muqaddimah (Prolegómenos)
  49: '~1202 d.C.', // Fibonacci - Liber Abaci
  50: '~1440 d.C.', // Nicolás de Cusa - De docta ignorantia
  51: '1509 d.C.', // Erasmo de Rotterdam - Elogio de la locura

  // --- AÑO 4: Renacimiento & Revolución Científica ---
  52: '1513 d.C.', // Maquiavelo - El Príncipe
  53: '1517 d.C.', // Maquiavelo - Discursos sobre la primera década de Tito Livio
  54: '1516 d.C.', // Tomás Moro - Utopía
  55: '1543 d.C.', // Copérnico - De revolutionibus orbium coelestium
  56: '1543 d.C.', // Vesalio - De humani corporis fabrica
  57: '1580 d.C.', // Montaigne - Ensayos
  58: '1605 d.C.', // Francis Bacon - El avance del saber
  59: '1620 d.C.', // Francis Bacon - Novum Organum
  60: '1610 d.C.', // Galileo Galilei - Sidereus Nuncius
  61: '1632 d.C.', // Galileo Galilei - Diálogo sobre los dos máximos sistemas del mundo
  62: '1638 d.C.', // Galileo Galilei - Discursos y demostraciones matemáticas
  63: '1609 d.C.', // Johannes Kepler - Astronomia Nova
  64: '1619 d.C.', // Johannes Kepler - Harmonices Mundi
  65: '1628 d.C.', // William Harvey - De motu cordis
  66: '1637 d.C.', // René Descartes - Discurso del método
  67: '1641 d.C.', // René Descartes - Meditaciones metafísicas
  68: '1651 d.C.', // Thomas Hobbes - Leviatán

  // --- AÑO 5: La Ilustración & Revolución Newtoniana ---
  69: '1677 d.C.', // Baruch Spinoza - Ética
  70: '1670 d.C.', // Baruch Spinoza - Tratado teológico-político
  71: '1687 d.C.', // Isaac Newton - Principia Mathematica
  72: '1704 d.C.', // Isaac Newton - Opticks
  73: '1689 d.C.', // John Locke - Segundo tratado sobre el gobierno civil
  74: '1689 d.C.', // John Locke - Ensayo sobre el entendimiento humano
  75: '1714 d.C.', // Gottfried Leibniz - Monadología
  76: '1710 d.C.', // George Berkeley - Tratado sobre los principios del conocimiento humano
  77: '1739 d.C.', // David Hume - Tratado de la naturaleza humana
  78: '1748 d.C.', // David Hume - Investigación sobre el entendimiento humano
  79: '1748 d.C.', // Montesquieu - El espíritu de las leyes
  80: '1762 d.C.', // Jean-Jacques Rousseau - El contrato social
  81: '1762 d.C.', // Jean-Jacques Rousseau - Emilio, o De la educación
  82: '1776 d.C.', // Adam Smith - La riqueza de las naciones
  83: '1759 d.C.', // Adam Smith - Teoría de los sentimientos morales
  84: '1781 d.C.', // Immanuel Kant - Crítica de la razón pura
  85: '1788 d.C.', // Immanuel Kant - Crítica de la razón práctica

  // --- AÑO 6: Siglo XIX, Historia, Evolución & Pensamiento Crítico ---
  86: '1790 d.C.', // Immanuel Kant - Crítica del juicio
  87: '1807 d.C.', // G.W.F. Hegel - Fenomenología del espíritu
  88: '1821 d.C.', // G.W.F. Hegel - Filosofía del derecho
  89: '1819 d.C.', // Arthur Schopenhauer - El mundo como voluntad y representación
  90: '1970 d.C.', // Philip Curtin - Atlantic Slave Trade
  91: '1969 d.C.', // Tulio Halperín Donghi - Historia contemporánea de América Latina
  92: '1987 d.C.', // Paul Kennedy - The Rise and Fall of the Great Powers
  93: '1983 d.C.', // Benedict Anderson - Comunidades imaginadas
  94: '1988 d.C.', // Joseph Tainter - The Collapse of Complex Societies
  95: '1959 d.C.', // Miguel León-Portilla - Visión de los vencidos
  96: '1835 d.C.', // Alexis de Tocqueville - La democracia en América
  97: '1859 d.C.', // John Stuart Mill - Sobre la libertad
  98: '1861 d.C.', // John Stuart Mill - El utilitarismo
  99: '1848 d.C.', // Karl Marx & Engels - Manifiesto Comunista
  100: '1867 d.C.', // Karl Marx - El Capital (Tomo I)
  101: '1883 d.C.', // Friedrich Nietzsche - Así habló Zaratustra
  102: '1887 d.C.', // Friedrich Nietzsche - Genealogía de la moral

  // --- AÑO 7: Siglo XIX (Física, Termodinámica & Lógica) ---
  103: '1859 d.C.', // Charles Darwin - El origen de las especies
  104: '1871 d.C.', // Charles Darwin - El origen del hombre
  105: '1866 d.C.', // Gregor Mendel - Experimentos sobre hibridación de plantas
  106: '1824 d.C.', // Sadi Carnot - Reflexiones sobre la potencia motriz del fuego
  107: '1850 d.C.', // Rudolf Clausius - Sobre la fuerza motriz del calor
  108: '1873 d.C.', // James Clerk Maxwell - Tratado sobre electricidad y magnetismo
  109: '1877 d.C.', // Ludwig Boltzmann - Sobre la relación entre la segunda ley y la probabilidad
  110: '1879 d.C.', // Gottlob Frege - Begriffsschrift (Conceptografía)
  111: '1884 d.C.', // Gottlob Frege - Los fundamentos de la aritmética
  112: '1890 d.C.', // William James - Principios de psicología
  113: '1899 d.C.', // Sigmund Freud - La interpretación de los sueños
  114: '1880 d.C.', // Fiódor Dostoievski - Los hermanos Karamazov
  115: '1869 d.C.', // León Tolstói - Guerra y paz
  116: '1902 d.C.', // Henri Poincaré - La ciencia y la hipótesis
  117: '1905 d.C.', // Henri Poincaré - El valor de la ciencia
  118: '1910 d.C.', // Bertrand Russell & Whitehead - Principia Mathematica
  119: '1912 d.C.', // Bertrand Russell - Los problemas de la filosofía

  // --- AÑO 8: Siglo XX (Física Moderna, Relatividad & Cuántica) ---
  120: '1905 d.C.', // Albert Einstein - Sobre la electrodinámica de los cuerpos en movimiento
  121: '1915 d.C.', // Albert Einstein - Fundamentos de la teoría de la relatividad general
  122: '1900 d.C.', // Max Planck - Sobre la ley de distribución de energía del espectro normal
  123: '1913 d.C.', // Niels Bohr - Sobre la constitución de átomos y moléculas
  124: '1925 d.C.', // Werner Heisenberg - Reinterpretación mecánico-cuántica
  125: '1926 d.C.', // Erwin Schrödinger - Cuantización como problema de valores propios
  126: '1930 d.C.', // Paul Dirac - Principios de mecánica cuántica
  127: '1931 d.C.', // Kurt Gödel - Sobre proposiciones formalmente indecidibles
  128: '1921 d.C.', // Ludwig Wittgenstein - Tractatus Logico-Philosophicus
  129: '1953 d.C.', // Ludwig Wittgenstein - Investigaciones filosóficas
  130: '1934 d.C.', // Karl Popper - La lógica de la investigación científica
  131: '1945 d.C.', // Karl Popper - La sociedad abierta y sus enemigos
  132: '1962 d.C.', // Thomas Kuhn - La estructura de las revoluciones científicas
  133: '1970 d.C.', // Imre Lakatos - La metodología de los programas de investigación científica
  134: '1975 d.C.', // Paul Feyerabend - Contra el método
  135: '1965 d.C.', // Richard Feynman - El carácter de la ley física
  136: '1963 d.C.', // Richard Feynman - Lecciones de física de Feynman

  // --- AÑO 9: Lógica, Computación, Información & Biología Molecular ---
  137: '1936 d.C.', // Alan Turing - Sobre números computables con aplicación al Entscheidungsproblem
  138: '1950 d.C.', // Alan Turing - Maquinaria computacional e inteligencia
  139: '1948 d.C.', // Claude Shannon - Teoría matemática de la comunicación
  140: '1948 d.C.', // Norbert Wiener - Cibernética o el control y comunicación en animales y máquinas
  141: '1944 d.C.', // John von Neumann & Morgenstern - Teoría de juegos y comportamiento económico
  142: '1945 d.C.', // John von Neumann - Primer borrador de un informe sobre el EDVAC
  143: '1944 d.C.', // Erwin Schrödinger - ¿Qué es la vida?
  144: '1953 d.C.', // Watson & Crick - Estructura molecular de los ácidos nucleicos
  145: '1970 d.C.', // Jacques Monod - El azar y la necesidad
  146: '1976 d.C.', // Richard Dawkins - El gen egoísta
  147: '1985 d.C.', // David Deutsch - Teoría cuántica, principio de Church-Turing y computadoras universales
  148: '1979 d.C.', // Douglas Hofstadter - Gödel, Escher, Bach: un Eterno y Grácil Bucle
  149: '1957 d.C.', // Noam Chomsky - Estructuras sintácticas
  150: '1969 d.C.', // Herbert Simon - Las ciencias de lo artificial
  151: '1971 d.C.', // John Rawls - Teoría de la justicia
  152: '1974 d.C.', // Robert Nozick - Anarquía, estado y utopía
  153: '1981 d.C.', // Alasdair MacIntyre - Tras la virtud

  // --- AÑO 10: Sistemas Complejos, Cognición, IA & Antifragilidad ---
  154: '1963 d.C.', // Edward Lorenz - Flujo determinista no periódico (Efecto Mariposa)
  155: '1972 d.C.', // Philip W. Anderson - More Is Different (Emergencia)
  156: '1977 d.C.', // Ilya Prigogine - Estructuras disipativas y autoorganización
  157: '1982 d.C.', // John Hopfield - Redes neuronales y sistemas físicos
  158: '1986 d.C.', // Rumelhart, Hinton & Williams - Aprendizaje de representaciones por retropropagación
  159: '1998 d.C.', // Watts & Strogatz - Dinámica colectiva de redes de mundo pequeño
  160: '1999 d.C.', // Barabási & Albert - Emergencia del escalamiento en redes aleatorias
  161: '1974 d.C.', // Amos Tversky & Daniel Kahneman - Juicio bajo incertidumbre: heurísticas y sesgos
  162: '2011 d.C.', // Daniel Kahneman - Pensar rápido, pensar despacio
  163: '1995 d.C.', // Antonio Damasio - El error de Descartes
  164: '1998 d.C.', // Andy Clark & David Chalmers - La mente extendida
  165: '2007 d.C.', // Nassim Nicholas Taleb - El cisne negro
  166: '2012 d.C.', // Nassim Nicholas Taleb - Antifrágil: las cosas que se benefician del desorden
  167: '1997 d.C.', // Jared Diamond - Armas, gérmenes y acero
  168: '2011 d.C.', // Steven Pinker - Los ángeles que llevamos dentro
  169: '2018 d.C.', // Judea Pearl - El libro del porqué: la nueva ciencia de la causa y el efecto
  170: '2020 d.C.'  // Stuart Russell - Compatible con humanos: la IA y el problema del control
};

export function getWorkPublicationYear(workNumber: number): string {
  if (HISTORICAL_YEAR_MAP[workNumber]) {
    return HISTORICAL_YEAR_MAP[workNumber];
  }
  return 'Época histórica';
}
