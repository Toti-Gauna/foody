// Accessibility pass with axe-core (already in node_modules through eslint-plugin-jsx-a11y): WCAG 2 A and AA rules.
// Usage: NODE_PATH=$(npm root -g) node scripts/qa-axe.mjs [base]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axePath = require.resolve('axe-core/axe.min.js');
const [base = 'http://localhost:4100'] = process.argv.slice(2);
const PAGES = ['/es/', '/en/', '/es/demo/?plan=75', '/es/demo/?plan=75&vista=crm&area=servicio', '/es/demo/?plan=75&vista=crm&area=cocina', '/es/demo/?plan=75&vista=crm&area=clientes', '/es/demo/?plan=50&vista=crm&area=juegos', '/es/demo/?plan=75&vista=crm&area=academy', '/es/demo/?plan=25&vista=crm&area=academy', '/es/sala/?c=ABCD&j=dibujo&red=local'];
const browser = await chromium.launch();
let total = 0;
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  for (const path of PAGES) {
    await p.goto(base + path, { waitUntil: 'networkidle' });
    await p.waitForSelector('.ls', { state: 'detached', timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(500);
    await p.addScriptTag({ path: axePath });
    const res = await p.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
    for (const v of res.violations) {
      total++;
      console.log(`${path} @${w} [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log('   ', n.target.join(' '), '|', (n.failureSummary ?? '').split('\n')[1]?.trim());
    }
  }
  await p.close();
}
console.log(total ? `${total} violations` : 'no violations');
await browser.close();
