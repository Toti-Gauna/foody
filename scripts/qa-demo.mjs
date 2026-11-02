// QA of the Lucero demo (local, not part of the build): the whole order loop on a phone and on a computer.
// Usage: NODE_PATH=$(npm root -g) node scripts/qa-demo.mjs http://localhost:4100 .lab-shots
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
const shot = (p, name) => p.screenshot({ path: `${out}/${name}.png` });

// Phone: carta → comanda → pedido, the plate comes back on its own.
{
  const ctx = await browser.newContext({ ...devices['iPhone 14'] });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`phone: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`phone console: ${m.text()}`));
  await p.goto(`${base}/es/demo/?plan=50`);
  await p.waitForTimeout(1500);
  await shot(p, 'demo-m-1-menu');
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await p.getByRole('button', { name: 'Agregar Sorrentinos' }).click();
  await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Agregar Bife de chorizo' }).click();
  await p.waitForTimeout(900);
  await shot(p, 'demo-m-2-added');
  await p.getByRole('button', { name: 'Ver mi pedido' }).click();
  await p.waitForTimeout(700);
  await shot(p, 'demo-m-3-comanda');
  await p.getByRole('button', { name: 'Mandar a la cocina' }).click();
  await p.waitForTimeout(1200);
  await shot(p, 'demo-m-4-sent');
  await p.waitForTimeout(4000);
  await shot(p, 'demo-m-5-kitchen');
  await p.waitForTimeout(9000);
  await shot(p, 'demo-m-6-ready');
  await p.waitForTimeout(5500);
  await shot(p, 'demo-m-7-delivered');
  const status = await p.locator('.lc-done').innerText();
  console.log('phone overflowX', overflow, '| final:', status.replace(/\n/g, ' / '));
  await p.getByRole('button', { name: 'Seguir pidiendo' }).click();
  await p.locator('.ld-switch button', { hasText: 'CRM del local' }).click();
  await p.waitForTimeout(600);
  await shot(p, 'demo-m-8-crm');
  await ctx.close();
}

// Computer: CRM + docked phone; the order shows up in the kitchen and moves.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`desk: ${e.message}`));
  await p.goto(`${base}/es/demo/?plan=25&vista=crm&area=cocina`);
  await p.waitForTimeout(1500);
  const phone = p.locator('.ld-phone');
  await phone.getByRole('button', { name: 'Agregar Provoleta' }).click();
  await phone.getByRole('button', { name: 'Ver mi pedido' }).click();
  await phone.getByRole('button', { name: 'Mandar a la cocina' }).click();
  await p.waitForTimeout(1500);
  await shot(p, 'demo-d-1-kitchen');
  const mine = await p.locator('.crm-ticket[data-mine]').count();
  await p.locator('.crm-nav button', { hasText: 'Juegos y ruleta' }).click();
  await p.waitForTimeout(400);
  await shot(p, 'demo-d-2-locked');
  console.log('desk: my tickets in kitchen', mine);
  await ctx.close();
}
console.log('errors', JSON.stringify(errors));
await browser.close();
