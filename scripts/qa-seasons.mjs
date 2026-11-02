// QA of the special dates: the loading screen, and the carta / CRM / a game in each season, on a phone and a computer.
// Usage: NODE_PATH=$(npm root -g) node scripts/qa-seasons.mjs [base] [outDir]
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
const watch = (p, tag) => {
  p.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`${tag}: ${m.text()}`));
};
const phone = await browser.newContext({ ...devices['iPhone 14'] });
const pc = await browser.newContext({ viewport: { width: 1440, height: 900 } });
for (const season of ['clasica', 'halloween', 'navidad', 'sanvalentin']) {
  const p = await phone.newPage();
  watch(p, season);
  await p.goto(`${base}/es/demo/?plan=75&temporada=${season}`);
  await p.waitForTimeout(350);
  await p.screenshot({ path: `${out}/season-${season}-0-loading.png` });
  await p.waitForSelector('.ls', { state: 'detached', timeout: 8000 });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/season-${season}-1-carta.png` });
  const decor = await p.locator('.sd').count();
  const html = await p.evaluate(() => document.documentElement.dataset.season);
  await p.close();
  const d = await pc.newPage();
  watch(d, `${season}-pc`);
  await d.goto(`${base}/es/demo/?plan=75&temporada=${season}`);
  await d.waitForSelector('.ls', { state: 'detached', timeout: 8000 });
  await d.waitForTimeout(400);
  await d.screenshot({ path: `${out}/season-${season}-2-pc.png` });
  await d.close();
  console.log(season, '| decor', decor, '| html', html);
}
// A game in Halloween colours, mid-play.
const g = await phone.newPage();
watch(g, 'game');
await g.goto(`${base}/es/demo/?plan=50&temporada=halloween`);
await g.waitForSelector('.ls', { state: 'detached', timeout: 8000 });
await g.getByRole('button', { name: 'Agregar Provoleta' }).click();
await g.getByRole('button', { name: 'Ver mi pedido' }).click();
await g.getByRole('button', { name: 'Mandar a la cocina' }).click();
await g.waitForTimeout(1600);
await g.getByRole('button', { name: 'Ahora no' }).click();
await g.waitForTimeout(500);
await g.locator('.gl-card', { hasText: 'Combinaciones' }).click();
await g.waitForTimeout(1500);
await g.locator('.sn-skin-play').click();
await g.waitForTimeout(4500);
await g.screenshot({ path: `${out}/season-game-combinaciones.png` });
console.log('errors', JSON.stringify(errors));
await browser.close();
