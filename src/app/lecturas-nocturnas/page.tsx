'use client';

import { useState } from 'react';
import { Moon, Sun, BookOpen, Volume2, Sparkles, Heart } from 'lucide-react';

interface BedtimeRead {
  id: string;
  author: string;
  work: string;
  theme: string;
  content: string;
  reflectionQuestion: string;
}

const BEDTIME_READS: BedtimeRead[] = [
  {
    id: 'LN01',
    author: 'Marco Aurelio',
    work: 'Meditaciones (Libro II, 1 & Libro IV, 3)',
    theme: 'Serenidad Interior & La Ciudadela del Alma',
    content: `Al amanecer, dite a ti mismo: me tropezaré con el indiscreto, el ingrato, el insolente, el mentiroso, el envidioso. Todos estos males les ocurren por su ignorancia del bien y del mal. Pero yo, que he observado la naturaleza del bien (que es lo bello) y del mal (que es lo feo), no puedo recibir daño de ninguno de ellos.

Busca un retiro para ti mismo en la mente. En ninguna parte se retira el hombre con más tranquilidad y calma que en su propia alma, sobre todo si posee en su interior bienes cuya contemplación le proporciona una paz inmediata. Concédete, pues, continuamente este retiro y renruévate.`,
    reflectionQuestion: '¿Qué pensamiento de esta noche puedes soltar antes de cerrar los ojos para despertar con mente limpia?'
  },
  {
    id: 'LN02',
    author: 'Séneca',
    work: 'De la Brevedad de la Vida (Cap. I & III)',
    theme: 'El Valor Inestimable del Tiempo',
    content: `No tenemos un tiempo escaso, sino que perdemos mucho. La vida es lo bastante larga y para la realización de las cosas más importantes se nos ha dado con generosidad, si toda ella se empleara bien. Pero cuando se disipa en el lujo y la apatía, cuando no se invierte en nada bueno, apremiando finalmente la última necesidad, sentimos que ha pasado la vida que no entendimos que estaba pasando.

Así es: no recibimos una vida corta, sino que la hacemos corta, y no somos penuriosos de ella, sino pródigos. Igual que riquezas reales y soberbias, si caen en manos de un mal dueño, se disipan en un momento, mientras que, aunque modestas, si se entregan a un buen custodio aumentan con el uso, así nuestra existencia se extiende mucho para quien la dispone bien.`,
    reflectionQuestion: '¿En qué actividad irrelevante gastaste hoy energía que podrías recuperar mañana para tus metas de aprendizaje?'
  },
  {
    id: 'LN03',
    author: 'Epicteto',
    work: 'Enquiridión (Manual de Vida, §1)',
    theme: 'La Dicotomía del Control',
    content: `De las cosas que existen, algunas dependen de nosotros y otras no dependen de nosotros. Dependen de nosotros nuestros juicios, nuestros deseos, nuestras aversiones y, en una palabra, cuantas son nuestros propios actos. No dependen de nosotros el cuerpo, la riqueza, las opiniones de los demás y cuanto no es acto propio.

Las cosas que dependen de nosotros son por naturaleza libres, sin impedimento; las que no dependen de nosotros son débiles, esclavas, sujetas a impedimento y ajenas. Recuerda, pues, que si consideras libre lo que por naturaleza es esclavo y propio lo que es ajeno, te verás impedido, te afligirás y culparás a los dioses y a los hombres.`,
    reflectionQuestion: 'Identifica una preocupación de esta noche: ¿depende de ti o está fuera de tu control?'
  }
];

export default function LecturasNocturnasPage() {
  const [warmMode, setWarmMode] = useState(true);
  const [selectedReadIndex, setSelectedReadIndex] = useState(0);

  const currentRead = BEDTIME_READS[selectedReadIndex];

  const speakReading = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // Ritmo pausado y relajante para la noche
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className={`min-h-screen p-4 sm:p-6 rounded-3xl transition-colors duration-500 space-y-6 pb-20 ${
      warmMode ? 'bg-[#0f0c08] text-[#e6d5bc]' : 'bg-slate-950 text-slate-200'
    }`}>
      {/* CABECERA MODO NOCHE */}
      <div className="flex justify-between items-center border-b border-amber-900/30 pb-4">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-amber-400 animate-pulse" />
          <h1 className="text-lg font-bold font-serif tracking-wide">Lecturas Nocturnas de Reflexión</h1>
        </div>

        <button
          type="button"
          onClick={() => setWarmMode(!warmMode)}
          className="px-3 py-1.5 rounded-full border border-amber-500/30 text-xs font-bold font-mono transition flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/50 cursor-pointer"
        >
          {warmMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-purple-300" />}
          <span>{warmMode ? 'Filtro Ámbar Cálido Activo' : 'Modo Oscuro Estándar'}</span>
        </button>
      </div>

      {/* SELECCIÓN DE LECTURA */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {BEDTIME_READS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedReadIndex(idx)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedReadIndex === idx
                ? 'bg-amber-900/60 text-amber-200 border-amber-500/60 shadow-lg'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {item.author} — {item.work.split('(')[0]}
          </button>
        ))}
      </div>

      {/* ÁREA PRINCIPAL DE LECTURA SOSEGADA */}
      <div className="p-6 sm:p-8 bg-slate-900/60 rounded-3xl border border-amber-900/30 space-y-6 shadow-2xl relative">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 block">
              {currentRead.theme}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100 pt-1">{currentRead.author}</h2>
            <h3 className="text-xs text-amber-300/80 italic font-serif">{currentRead.work}</h3>
          </div>

          <button
            type="button"
            onClick={() => speakReading(currentRead.content)}
            className="p-2 bg-amber-950/60 hover:bg-amber-900 text-amber-300 rounded-full border border-amber-500/30 cursor-pointer shadow"
            title="Escuchar lectura en voz baja y pausada"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed font-serif text-slate-200/90 whitespace-pre-line border-t border-amber-900/20 pt-4">
          {currentRead.content}
        </div>

        <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/30 space-y-1 font-serif text-xs text-amber-200/90">
          <strong className="text-amber-300 font-sans uppercase text-[10px] tracking-wider block">Reflexión Socrática de la Noche:</strong>
          <p className="italic">{currentRead.reflectionQuestion}</p>
        </div>
      </div>
    </main>
  );
}
