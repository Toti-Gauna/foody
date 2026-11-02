// QA of the games layer (local): plan 50 → order → modal with the wheel and the solo games → play → food arrives.
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
await p.goto(`${base}/es/demo/?plan=50`);
await p.waitForTimeout(1200);
await p.getByRole('button', { name: 'Agregar Provoleta' }).click();
await p.getByRole('button', { name: 'Ver mi pedido' }).click();
await p.getByRole('button', { name: 'Mandar a la cocina' }).click();
await p.waitForTimeout(2600);
await p.screenshot({ path: `${out}/games-1-modal.png` });
const modal = await p.locator('.gl').count();
await p.getByRole('button', { name: 'Girar la ruleta' }).click();
await p.waitForTimeout(4800);
await p.screenshot({ path: `${out}/games-2-wheel.png` });
const wheel = await p.locator('.ru-result').innerText().catch(() => '');
for (const g of ['Ninja', 'Combinaciones', 'Catapulta']) {
  await p.locator('.gl-card', { hasText: g }).click();
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/games-3-${g}.png` });
  const canvas = await p.locator('.gh canvas').count();
  console.log(g, 'canvas', canvas);
  await p.getByRole('button', { name: 'Cerrar el juego' }).click();
  await p.waitForTimeout(400);
}
await p.locator('.gl-card', { hasText: 'Ninja' }).click();
await p.waitForTimeout(12000);
await p.screenshot({ path: `${out}/games-4-arrived.png` });
const arrived = await p.locator('.gh-arrived').count();
console.log('modal', modal, '| wheel:', wheel.replace(/\n/g, ' '), '| arrived banner', arrived, '| errors', JSON.stringify(errors));
await browser.close();
