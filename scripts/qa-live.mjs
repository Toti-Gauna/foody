// QA of «Local en vivo»: four phones of one browser over BroadcastChannel (?red=local): owner, table 5, kitchen, waiter.
// Usage: NODE_PATH=$(npm root -g) node scripts/qa-live.mjs [base] [outDir]
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const errors = [];
const page = async (tag) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`${tag}: ${m.text()}`));
  return p;
};
const ready = (p) => p.waitForSelector('.ls', { state: 'detached', timeout: 9000 }).catch(() => {});
const log = (...a) => console.log(...a);

// 1) The owner opens the venue.
const owner = await page('owner');
await owner.goto(`${base}/es/local/?red=local`);
await owner.waitForTimeout(600);
await owner.screenshot({ path: `${out}/live-0-landing.png` });
await owner.getByRole('button', { name: 'Abrir mi local' }).click();
await owner.waitForURL(/s=/);
const code = new URL(owner.url()).searchParams.get('s');
await ready(owner);
log('venue', code);

// 2) Table 5, kitchen and waiter come in with their links.
const table = await page('table');
await table.goto(`${base}/es/local/?s=${code}&rol=mesa&mesa=5&red=local`);
const kitchen = await page('kitchen');
await kitchen.goto(`${base}/es/local/?s=${code}&rol=cocina&red=local`);
const waiter = await page('waiter');
await waiter.goto(`${base}/es/local/?s=${code}&rol=mesero&red=local`);
await Promise.all([ready(table), ready(kitchen), ready(waiter)]);
await table.waitForTimeout(1200);
await table.getByRole('button', { name: 'Ahora no' }).click().catch(() => {});
await table.getByRole('button', { name: 'Agregar Provoleta' }).click();
await table.getByRole('button', { name: 'Ver mi pedido' }).click();
await table.getByLabel('¿A nombre de quién?').fill('Ana');
await table.getByRole('button', { name: 'Mandar a la cocina' }).click();
await table.waitForTimeout(2200);
await table.keyboard.press('Escape');
await table.screenshot({ path: `${out}/live-1-table-sent.png` });

// 3) The kitchen gets it.
await kitchen.waitForTimeout(800);
const kNew = await kitchen.locator('.lv-col[data-status="sent"] .k-ticket').count();
await kitchen.screenshot({ path: `${out}/live-2-kitchen.png` });
await kitchen.getByRole('button', { name: 'Empezar' }).first().click();
await kitchen.waitForTimeout(600);
await kitchen.getByRole('button', { name: 'Listo' }).first().click();
await kitchen.waitForTimeout(800);
const tableStatus1 = await table.locator('.lc-done').innerText();

// 4) The waiter takes it out.
await waiter.waitForTimeout(500);
await waiter.screenshot({ path: `${out}/live-3-waiter-room.png` });
await waiter.getByRole('tab', { name: /A servir/ }).click();
await waiter.screenshot({ path: `${out}/live-4-waiter-ready.png` });
await waiter.getByRole('button', { name: 'Entregado' }).click();
await table.waitForTimeout(1200);
const tableStatus2 = await table.locator('.lc-done').innerText();

// 5) The table calls the waiter; the waiter answers.
await table.getByRole('button', { name: 'Llamar al mozo' }).click();
await waiter.waitForTimeout(1000);
await waiter.getByRole('tab', { name: /Llamados/ }).click();
const calls = await waiter.locator('.lv-call').count();
await waiter.screenshot({ path: `${out}/live-5-waiter-calls.png` });
await waiter.getByRole('button', { name: 'Atendido' }).first().click();
await waiter.waitForTimeout(600);
const callsAfter = await waiter.locator('.lv-call').count();

// 6) The waiter takes an order for table 3 at the table.
await waiter.getByRole('tab', { name: /Tomar pedido/ }).click();
await waiter.getByRole('button', { name: 'Mesa siguiente' }).click();
await waiter.getByRole('button', { name: 'Mesa siguiente' }).click();
await waiter.getByRole('button', { name: 'Sumar Provoleta' }).click();
await waiter.getByRole('button', { name: 'Sumar Rabas' }).click();
await waiter.screenshot({ path: `${out}/live-6-waiter-take.png` });
await waiter.getByRole('button', { name: 'Mandar a la cocina' }).click();
await kitchen.waitForTimeout(1200);
const kAfter = await kitchen.locator('.lv-col[data-status="sent"] .k-ticket').count();

// 7) The owner sees everyone and the numbers.
await owner.waitForTimeout(3500);
const roster = await owner.locator('.lv-people li').count();
const kpi = (await owner.locator('.lv-kpis').innerText()).replace(/\n/g, ' ');
await owner.screenshot({ path: `${out}/live-7-owner.png`, fullPage: true });
await owner.getByRole('tab', { name: /CRM/ }).click();
await owner.waitForTimeout(600);
await owner.screenshot({ path: `${out}/live-8-owner-crm.png` });

// 8) The owner reloads: the venue comes back (kept on the owner's phone).
await owner.reload();
await ready(owner);
await owner.waitForTimeout(800);
const kpiAfterReload = (await owner.locator('.lv-kpis').innerText()).replace(/\n/g, ' ');
log('after owner reload:', kpiAfterReload);
log('kitchen new', kNew, '| table after ready:', tableStatus1.replace(/\n/g, ' '), '| after delivered:', tableStatus2.replace(/\n/g, ' '));
log('calls', calls, '→', callsAfter, '| kitchen after waiter order', kAfter, '| roster', roster, '| kpis', kpi);
log('errors', JSON.stringify(errors));
await browser.close();
