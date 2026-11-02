// QA of the demo on two devices through Foody-be (build with NEXT_PUBLIC_API_URL and run the backend first):
// a computer opens the CRM and its pairing QR, a phone opens the link and orders, the CRM sees the order.
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base = 'http://localhost:4100', out = '.lab-shots'] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
const watch = (p, tag) => {
  p.on('pageerror', (e) => errors.push(`${tag}: ${e}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`${tag}: ${m.text()}`));
};
const pc = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
watch(pc, 'pc');
await pc.goto(`${base}/es/demo/?plan=75&vista=crm&area=cocina`);
await pc.waitForTimeout(1000);
await pc.getByRole('button', { name: 'Pedí desde tu celular' }).click();
await pc.waitForTimeout(800);
const link = (await pc.locator('.ld-sync-dialog .ms-link').innerText()).trim();
await pc.screenshot({ path: `${out}/sync-1-qr.png` });
await pc.keyboard.press('Escape');
const before = await pc.locator('.crm-ticket').count();
const phone = await (await browser.newContext({ ...devices['iPhone 14'] })).newPage();
watch(phone, 'phone');
await phone.goto(link);
await phone.waitForTimeout(1500);
await phone.getByRole('button', { name: 'Agregar Provoleta' }).click();
await phone.getByRole('button', { name: 'Ver mi pedido' }).click();
await phone.getByRole('button', { name: 'Mandar a la cocina' }).click();
await pc.waitForTimeout(1500);
const after = await pc.locator('.crm-ticket').count();
await pc.screenshot({ path: `${out}/sync-2-crm.png` });
// And back: the kitchen accepts it on the computer, the phone sees it move.
console.log('link', link, '| tickets before', before, 'after', after, '| errors', JSON.stringify(errors));
await browser.close();
