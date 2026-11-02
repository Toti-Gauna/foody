// QA of Eclipse Academy (plan 75) and its lock on plan 50, at phone and desktop width.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.env.QA_OUT ?? 'qa-shots';
const b = await chromium.launch();
const errors = [];
for (const [w, h] of [[360, 760], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto('http://localhost:4100/es/demo/?plan=75&vista=crm&area=academy');
  await p.waitForTimeout(900);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  await p.screenshot({ path: `${out}/ac-${w}.png` });
  await p.locator('.ac-card[data-kind=doc]').first().click();
  await p.waitForTimeout(300);
  const open = await p.locator('dialog.ac-dialog[open]').count();
  const steps = await p.locator('.ac-steps li').count();
  await p.screenshot({ path: `${out}/ac-${w}-doc.png` });
  await p.keyboard.press('Escape');
  await p.getByRole('tab', { name: /físico/ }).click();
  await p.getByRole('button', { name: 'Fotos' }).click();
  const photos = await p.locator('.ac-card').count();
  await p.locator('.ac-card').first().click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/ac-${w}-photo.png` });
  console.log(w, 'scrollWidth', sw, 'dialog', open, 'steps', steps, 'photos', photos);
  await p.goto('http://localhost:4100/es/demo/?plan=50&vista=crm&area=academy');
  await p.waitForTimeout(700);
  console.log(w, 'plan 50 locked:', await p.locator('.crm-locked').count(), await p.locator('.crm-locked p').innerText());
}
console.log('errors', JSON.stringify(errors));
await b.close();
