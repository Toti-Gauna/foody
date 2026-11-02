// QA of table rooms (local): two tabs of one browser over BroadcastChannel (?red=local).
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const watch = (p, tag) => {
  p.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`${tag} console: ${m.text()}`));
};
const a = await ctx.newPage();
watch(a, 'host');
const RED = process.env.RED ?? 'local';
await a.goto(`${base}/es/demo/?plan=75${RED === 'local' ? '&red=local' : ''}`);
await a.waitForTimeout(1200);
await a.getByRole('button', { name: 'Agregar Provoleta' }).click();
await a.getByRole('button', { name: 'Ver mi pedido' }).click();
await a.getByLabel('¿A nombre de quién?').fill('Sofi');
await a.getByRole('button', { name: 'Mandar a la cocina' }).click();
await a.waitForTimeout(1800);
await a.getByRole('button', { name: 'Ahora no' }).click(); // the wheel comes first
await a.waitForTimeout(600);
await a.locator('.gl-card', { hasText: 'Dibujá y adiviná' }).click();
await a.waitForTimeout(1200);
await a.screenshot({ path: `${out}/mesa-1-lobby.png` });
const link = (await a.locator('.ms-link').innerText()).trim();
console.log('join link', link);

const b = await ctx.newPage();
watch(b, 'guest');
await b.goto(link);
await b.waitForTimeout(800);
await b.getByLabel('Tu nombre').fill('Martín');
await b.getByRole('button', { name: 'Entrar a la sala' }).click();
await b.waitForTimeout(2500);
const inRoom = await a.locator('.ms-players li').count();
await a.screenshot({ path: `${out}/mesa-2-lobby2.png` });
await a.getByRole('button', { name: 'Empezar' }).click();
await a.waitForTimeout(1200);
await a.screenshot({ path: `${out}/mesa-3-choose.png` });
// Host draws first: pick the easy word.
await a.locator('.dj-choose button').first().click();
await a.waitForTimeout(600);
const word = (await a.locator('.dj-word b').innerText()).trim();
const box = await a.locator('.dj-canvas').boundingBox();
await a.mouse.move(box.x + 40, box.y + 40);
await a.mouse.down();
for (let i = 0; i < 12; i++) await a.mouse.move(box.x + 40 + i * 18, box.y + 60 + Math.sin(i) * 30, { steps: 2 });
await a.mouse.up();
await a.waitForTimeout(900);
await b.screenshot({ path: `${out}/mesa-4-guest-sees.png` });
const guestPixels = await b.evaluate(() => {
  const c = document.querySelector('.dj-canvas');
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  let dark = 0;
  for (let i = 0; i < d.length; i += 16) if (d[i] < 120) dark++;
  return dark;
});
await b.getByLabel('Tu respuesta').fill('nada');
await b.getByRole('button', { name: 'Mandar' }).click();
await b.getByLabel('Tu respuesta').fill(word);
await b.getByRole('button', { name: 'Mandar' }).click();
await b.waitForTimeout(900);
await b.screenshot({ path: `${out}/mesa-5-guessed.png` });
const scores = await a.locator('.dj-scores').innerText();
console.log('players in room', inRoom, '| word', word, '| guest dark pixels', guestPixels, '| scores', scores.replace(/\n/g, ' '));
await a.screenshot({ path: `${out}/mesa-6-host.png` });

// Hockey: host vs guest, then vs Gus.
await a.getByRole('button', { name: 'Salir de la sala' }).click();
await a.locator('.gl-card', { hasText: 'Hockey' }).click();
await a.waitForTimeout(1000);
const hlink = (await a.locator('.ms-link').innerText()).trim();
const c = await ctx.newPage();
watch(c, 'hockey-guest');
await c.goto(hlink);
await c.getByLabel('Tu nombre').fill('Lucía');
await c.getByRole('button', { name: 'Entrar a la sala' }).click();
await c.waitForTimeout(2200);
await a.getByRole('button', { name: 'Empezar' }).click();
await a.waitForTimeout(800);
const hb = await a.locator('.hk-canvas').boundingBox();
await a.mouse.move(hb.x + hb.width / 2, hb.y + hb.height * 0.85);
await a.mouse.down();
await a.mouse.move(hb.x + hb.width / 2, hb.y + hb.height * 0.45, { steps: 6 });
await a.mouse.up();
await a.waitForTimeout(1200);
await a.waitForTimeout(3500); // two roster beats: the score must not reset
console.log('hockey host', (await a.locator('.hk-score').innerText()).replace(/\n/g, ' '), '| guest', (await c.locator('.hk-score').innerText()).replace(/\n/g, ' '));
await a.screenshot({ path: `${out}/mesa-7-hockey-host.png` });
await c.screenshot({ path: `${out}/mesa-8-hockey-guest.png` });
console.log('errors', JSON.stringify(errors));
await browser.close();
