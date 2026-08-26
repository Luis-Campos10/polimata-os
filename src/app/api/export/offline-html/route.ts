import { NextResponse } from 'next/server';
import { getAllWeeks, getAllWorks, getAllQuestions, getKnowledgeNodes, getKnowledgeEdges } from '@/lib/db/queries';

export async function GET() {
  try {
    const weeks = await getAllWeeks();
    const works = await getAllWorks();
    const questions = await getAllQuestions();
    const nodes = await getKnowledgeNodes();
    const edges = await getKnowledgeEdges();

    const offlineHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polímata OS — Edición Offline Standalone</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    .glass-card { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 1rem; }
  </style>
</head>
<body className="p-4 max-w-2xl mx-auto pb-24">
  <header className="glass-card p-5 mb-4 text-center space-y-1 border-sky-500/40">
    <div className="inline-block px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-bold uppercase mb-1">
      📶 100% Offline Standalone (Sin Servidor / Sin Wi-Fi / Sin Datos)
    </div>
    <h1 className="text-xl font-extrabold text-white">Polímata OS 2.0</h1>
    <p className="text-xs text-slate-300">Sistema Operativo Personal de Aprendizaje (10 Años + Fase 0)</p>
  </header>

  <!-- PESTAÑAS PRINCIPALES -->
  <nav className="flex justify-around bg-slate-900 border border-slate-800 p-2 rounded-2xl mb-4 font-bold text-xs">
    <button onclick="showTab('ruta')" id="tab-btn-ruta" className="px-4 py-2 rounded-xl text-sky-400 bg-slate-800">🗺️ Ruta</button>
    <button onclick="showTab('saber')" id="tab-btn-saber" className="px-4 py-2 rounded-xl text-slate-400">🧠 Saber</button>
    <button onclick="showTab('yo')" id="tab-btn-yo" className="px-4 py-2 rounded-xl text-slate-400">👤 Yo</button>
  </nav>

  <!-- VISTA RUTA -->
  <main id="tab-ruta" className="space-y-4">
    <div className="glass-card p-4">
      <h2 className="text-sm font-bold text-sky-400 mb-2 uppercase">FASE 0 — Aprender a Aprender (${weeks.length} Semanas)</h2>
      <div className="space-y-2">
        ${weeks.map((w: any) => `
          <details className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <summary className="font-bold text-xs text-slate-200 cursor-pointer flex justify-between">
              <span>W${w.weekNumber}: ${w.title}</span>
              <span className="text-sky-400 text-[10px]">Ver Detalle ▼</span>
            </summary>
            <div className="pt-2 text-xs space-y-2 text-slate-300 border-t border-slate-800/80 mt-2">
              <p><strong>Propósito:</strong> ${w.purpose}</p>
              <p className="font-mono text-[11px] text-amber-300"><strong>Entregable:</strong> ${w.productPrescription}</p>
            </div>
          </details>
        `).join('')}
      </div>
    </div>

    <div className="glass-card p-4">
      <h2 className="text-sm font-bold text-purple-400 mb-2 uppercase">CANON DE ${works.length} OBRAS (Años 1 al 10)</h2>
      <div className="space-y-2">
        ${works.slice(0, 30).map((work: any) => `
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between font-bold text-slate-200">
              <span>#${work.workNumber} · Año ${work.year}: ${work.author}</span>
              <span className="text-purple-400">Nivel ${work.level}</span>
            </div>
            <p className="text-sky-300 italic">${work.title}</p>
            <p className="text-slate-400 text-[11px]"><strong>Qué leer:</strong> ${work.prescribedReading}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </main>

  <!-- VISTA SABER (18 PREGUNTAS) -->
  <main id="tab-saber" className="space-y-4 hidden">
    <div className="glass-card p-4">
      <h2 className="text-sm font-bold text-amber-400 mb-2 uppercase">18 Grandes Preguntas Núcleo</h2>
      <div className="space-y-2">
        ${questions.map((q: any) => `
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
            <h3 className="font-bold text-slate-100">Q${q.number}: ${q.title}</h3>
            <p className="text-slate-300 leading-relaxed">${q.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </main>

  <!-- VISTA YO -->
  <main id="tab-yo" className="space-y-4 hidden">
    <div className="glass-card p-4 space-y-2 text-center">
      <h2 className="text-sm font-bold text-emerald-400 uppercase">Perfil Polímata Offline</h2>
      <p className="text-xs text-slate-300">Este archivo HTML funciona 100% de forma autónoma sin internet en cualquier celular.</p>
    </div>
  </main>

  <script>
    function showTab(tabName) {
      document.getElementById('tab-ruta').classList.add('hidden');
      document.getElementById('tab-saber').classList.add('hidden');
      document.getElementById('tab-yo').classList.add('hidden');

      document.getElementById('tab-btn-ruta').className = 'px-4 py-2 rounded-xl text-slate-400';
      document.getElementById('tab-btn-saber').className = 'px-4 py-2 rounded-xl text-slate-400';
      document.getElementById('tab-btn-yo').className = 'px-4 py-2 rounded-xl text-slate-400';

      document.getElementById('tab-' + tabName).classList.remove('hidden');
      document.getElementById('tab-btn-' + tabName).className = 'px-4 py-2 rounded-xl text-sky-400 bg-slate-800';
    }
  </script>
</body>
</html>`;

    return new NextResponse(offlineHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Polimata_OS_Offline.html"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
