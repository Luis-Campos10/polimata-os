/**
 * Test de Consultas a la Base de Datos SQLite y Helper Histórico
 */

const { getWorkHistoricalData } = require('../src/lib/workYearHelper.ts');

async function testDbAndHelpers() {
  console.log('--- Probando Mapeo Histórico y Consultas ---');

  // Probar Spinoza (#39)
  const spinoza = getWorkHistoricalData(39);
  console.log('Spinoza #39:', spinoza);
  if (!spinoza.year.includes('1677') || !spinoza.period.includes('Racionalismo')) {
    throw new Error('Mapeo de Spinoza incorrecto');
  }

  // Probar Platón (#15)
  const platon = getWorkHistoricalData(15);
  console.log('Platón #15:', platon);
  if (!platon.year.includes('375 a.C.') || !platon.period.includes('Platonismo')) {
    throw new Error('Mapeo de Platón incorrecto');
  }

  // Probar Nassim Taleb (#161)
  const taleb = getWorkHistoricalData(161);
  console.log('Taleb #161:', taleb);
  if (!taleb.year.includes('2007') || !taleb.period.includes('Cisne Negro')) {
    throw new Error('Mapeo de Taleb incorrecto');
  }

  console.log('✅ Todos los helpers históricos responden con exactitud.');
}
