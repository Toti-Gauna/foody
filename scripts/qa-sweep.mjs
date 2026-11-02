// QA sweep (local, not part of the build): every page at the seven widths, with and without reduced motion.
// Checks: no horizontal scroll, no console errors, noindex, at most one solid main button in view, touch targets,
// and the plan lens (what each plan shows in the demo).
// Usage: NODE_PATH=$(npm root -g) node scripts/qa-sweep.mjs [base] [outDir]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const SIZES = [[360, 760], [390, 844], [768, 1024], [1024, 768], [1366, 657], [1440, 900], [1920, 1080]];
const PAGES = ['/es/', '/en/', '/pt/', '/es/demo/?plan=25', '/es/demo/?plan=50&vista=crm&area=juegos', '/es/demo/?plan=75&vista=crm&area=academy', '/en/demo/?plan=75', '/es/sala/?c=ABCD&j=dibujo&red=local'];
const browser = await chromium.launch();
const problems = [];
let checked = 0;
for (const reduced of [false, true]) {
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    for (const path of PAGES) {
      const p = await ctx.newPage();
      const tag = `${path} @${w}${reduced ? ' reduced' : ''}`;
      p.on('pageerror', (e) => problems.push(`${tag}: pageerror ${e}`));
      p.on('console', (m) => m.type() === 'error' && problems.push(`${tag}: console ${m.text()}`));
      await p.goto(base + path, { waitUntil: 'networkidle' });
      await p.waitForTimeout(600);
      const r = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
        const visible = (el) => {
          const b = el.getBoundingClientRect();
          const st = getComputedStyle(el);
          return b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight && st.visibility !== 'hidden' && !el.closest('[aria-hidden="true"],[inert],[hidden]');
        };
        const mains = [...document.querySelectorAll('.lc-btn-main, .btn-primary, [data-primary]')].filter(visible);
        const small = [...document.querySelectorAll('a, button, input, select, [role="tab"]')]
          .filter(visible)
          .filter((el) => !el.closest('p, li > span, .crm-feed, figcaption, .ms-link') || el.tagName !== 'A')
          .map((el) => ({ el, b: el.getBoundingClientRect() }))
          .filter(({ el, b }) => (b.height < 44 && b.width < 44) && !['checkbox', 'radio'].includes(el.type))
          .map(({ el, b }) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ${Math.round(b.width)}x${Math.round(b.height)}`);
        return { overflow: document.documentElement.scrollWidth - vw, robots, mains: mains.length, small: [...new Set(small)].slice(0, 5) };
      });
      checked++;
      if (r.overflow > 0) problems.push(`${tag}: horizontal scroll ${r.overflow}px`);
      if (!r.robots.includes('noindex')) problems.push(`${tag}: no noindex`);
      if (r.mains > 1) problems.push(`${tag}: ${r.mains} main buttons in view`);
      if (r.small.length && !reduced) problems.push(`${tag}: small targets ${r.small.join(', ')}`);
      if (!reduced && [360, 1440].includes(w)) await p.screenshot({ path: `${out}/sweep-${path.replace(/[^a-z0-9]+/gi, '_')}-${w}.png` });
      await p.close();
    }
    await ctx.close();
  }
}

// Plan lens: the games modal after ordering, per plan.
const lens = {};
for (const plan of ['25', '50', '75']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${base}/es/demo/?plan=${plan}`);
  await p.waitForTimeout(1200);
  await p.getByRole('button', { name: 'Agregar Provoleta' }).click();
  await p.getByRole('button', { name: 'Ver mi pedido' }).click();
  await p.getByRole('button', { name: 'Mandar a la cocina' }).click();
  await p.waitForTimeout(2000);
  const ruleta = await p.locator('.rs').count();
  if (ruleta) await p.getByRole('button', { name: 'Ahora no' }).click();
  await p.waitForTimeout(600);
  lens[plan] = {
    ruleta,
    modal: await p.locator('.gl').count(),
    solo: await p.locator('.gl-card').filter({ hasNotText: /Hockey|Dibujá/ }).count(),
    table: await p.locator('.gl-card').filter({ hasText: /Hockey|Dibujá/ }).count(),
    crm: await p.locator('.crm-nav li').count(),
  };
  await ctx.close();
}
console.log('plan lens', JSON.stringify(lens));
if (lens['25'].modal !== 0 || lens['25'].ruleta !== 0 || lens['25'].crm !== 4) problems.push('plan 25 lens wrong');
if (lens['50'].table !== 0 || lens['50'].solo < 3 || !lens['50'].ruleta || lens['50'].crm !== 5) problems.push('plan 50 lens wrong');
if (lens['75'].table < 2 || lens['75'].crm !== 6) problems.push('plan 75 lens wrong');
console.log(`checked ${checked} page views`);
console.log(problems.length ? problems.join('\n') : 'no problems');
await browser.close();
