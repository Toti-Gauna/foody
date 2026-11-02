#!/usr/bin/env node
// Kit de deploy de Eclipse para restaurantes (Foody). Pregunta todo por consola, construye el sitio estático y deja en
// la carpeta de salida lo necesario para subirlo a Hostinger y configurar Render y GitHub. No publica nada: solo arma
// archivos. Uso (desde la raíz del repo, en Codespaces):
//   docker build -t foody-kit -f deploy/Dockerfile .
//   docker run -it --rm -v "$PWD/deploy-out:/out" foody-kit
// Sin Docker: `node deploy/kit.mjs --out deploy-out`. `--yes` acepta los valores por defecto (y los KIT_* del entorno).
import { execFileSync } from 'node:child_process';
import { chmodSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';
import { htaccess } from './htaccess.mjs';

const args = process.argv.slice(2);
const AUTO = args.includes('--yes');
const outArg = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const OUT = resolve(outArg || (existsSync('/out') ? '/out' : 'deploy-out'));
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const TTY = !!process.stdin.isTTY;
const rl = AUTO ? null : readline.createInterface({ input: process.stdin, output: process.stdout, terminal: TTY });
let muted = false;
if (rl && TTY) {
  // Hide what is typed for the password.
  const write = rl._writeToOutput?.bind(rl);
  rl._writeToOutput = (s) => {
    if (!muted || s.includes('\n')) write?.(s);
  };
}
// Answers queue up as lines arrive, so typing and piping (`printf '…' | node deploy/kit.mjs`) both work.
const lines = [];
const waiting = [];
let ended = false;
rl?.on('line', (l) => (waiting.length ? waiting.shift()(l) : lines.push(l)));
rl?.on('close', () => {
  ended = true;
  while (waiting.length) waiting.shift()('');
});
const nextLine = () => new Promise((done) => (lines.length ? done(lines.shift()) : ended ? done('') : waiting.push(done)));

async function ask(q, def = '', { secret = false, env } = {}) {
  const preset = env ? process.env[env] : undefined;
  if (AUTO || !rl) return preset ?? def;
  const hint = def && !secret ? ` [${def}]` : '';
  process.stdout.write(`${q}${hint}: `);
  muted = secret;
  const a = await nextLine();
  muted = false;
  if (!TTY || secret) process.stdout.write(secret ? '\n' : `${a}\n`);
  return a.trim() || def;
}

const clean = (url) => url.trim().replace(/\/$/, '');
const isUrl = (s) => /^https?:\/\/[^\s/]+/.test(s);
async function askUrl(q, def, env, optional = false) {
  for (;;) {
    const v = clean(await ask(q, def, { env }));
    if ((optional && !v) || isUrl(v)) return v;
    if (AUTO) throw new Error(`${q}: «${v}» no es una URL`);
    console.log('  Tiene que empezar con https:// (o http:// para probar local).');
  }
}

console.log(`
Eclipse para restaurantes · kit de deploy
Te pido los datos, construyo el sitio y dejo todo en ${OUT}.
No publico nada: subir y configurar lo hacés vos con los archivos que quedan.
Enter acepta el valor entre corchetes.
`);

console.log('— El sitio');
const domain = (await ask('Dominio del sitio', 'foody.eclipse-business.com', { env: 'KIT_DOMAIN' })).replace(/^https?:\/\//, '').replace(/\/.*$/, '');
let basePath = (await ask('Path base (vacío si el sitio va en la raíz del subdominio)', '', { env: 'KIT_BASE_PATH' })).trim().replace(/\/$/, '');
if (basePath && !basePath.startsWith('/')) basePath = `/${basePath}`;
const api = await askUrl('URL del backend en Render (vacío = sin backend)', '', 'KIT_API_URL', true);
const eclipse = await askUrl('URL de Eclipse («Volver a Eclipse»)', 'https://eclipse-business.com', 'KIT_ECLIPSE_URL');
const roofy = await askUrl('URL de Roofy («Otros negocios»)', 'https://toti-gauna.github.io/roofy', 'KIT_ROOFY_URL');
const whatsapp = (await ask('WhatsApp para los planes (con 549 y sin espacios)', '5492234467881', { env: 'KIT_WHATSAPP' })).replace(/\D/g, '');

console.log('\n— Hostinger (para el deploy por FTPS desde GitHub; vacío si lo subís a mano)');
const ftpHost = (await ask('Servidor FTP (ej. ftp.eclipse-business.com)', '', { env: 'KIT_FTP_HOST' })).trim();
const ftpUser = ftpHost ? (await ask('Usuario FTP', '', { env: 'KIT_FTP_USER' })).trim() : '';
const ftpPass = ftpHost ? await ask('Contraseña FTP (no se muestra)', '', { secret: true, env: 'KIT_FTP_PASSWORD' }) : '';
const ftpDir = ftpHost ? (await ask('Carpeta del subdominio en el servidor', 'public_html', { env: 'KIT_FTP_DIR' })).trim().replace(/\/$/, '') : '';
const repo = (await ask('Repo del sitio en GitHub', 'Toti-Gauna/foody', { env: 'KIT_REPO' })).trim();
rl?.close();

const site = `https://${domain}`;
const env = {
  NEXT_PUBLIC_SITE_URL: site,
  NEXT_PUBLIC_BASE_PATH: basePath,
  NEXT_PUBLIC_API_URL: api,
  NEXT_PUBLIC_ECLIPSE_URL: eclipse,
  NEXT_PUBLIC_ROOFY_URL: roofy,
  NEXT_PUBLIC_WHATSAPP: whatsapp,
};
const envLines = Object.entries(env)
  .map(([k, v]) => `${k}=${v}`)
  .join('\n');

console.log('\nConstruyendo el sitio (npm run build)…');
execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env, NEXT_TELEMETRY_DISABLED: '1' } });

mkdirSync(OUT, { recursive: true, mode: 0o700 });
const siteDir = join(OUT, 'site');
rmSync(siteDir, { recursive: true, force: true });
cpSync(join(ROOT, 'out'), siteDir, { recursive: true });
writeFileSync(join(siteDir, '.htaccess'), htaccess(basePath));

const zip = join(OUT, 'foody-sitio.zip');
rmSync(zip, { force: true });
let zipped = true;
try {
  execFileSync('zip', ['-qr', zip, '.'], { cwd: siteDir });
} catch {
  zipped = false;
  console.log('  (Sin `zip` en este equipo: subí la carpeta site/ tal cual.)');
}

const write = (name, text, secret = false) => {
  const p = join(OUT, name);
  writeFileSync(p, text, { mode: secret ? 0o600 : 0o644 });
  if (secret) chmodSync(p, 0o600);
};
write('.env.production', `# Variables públicas del sitio (todas NEXT_PUBLIC_*: ninguna es secreta). Generado por deploy/kit.mjs.\n${envLines}\n`);
const origins = [site, 'https://toti-gauna.github.io'].join(',');
write('render.env', `# Variables del servicio foody-be en Render (Environment). Ninguna es secreta.\nNODE_VERSION=22\nALLOWED_ORIGINS=${origins}\n`);
write(
  'github-secrets.txt',
  ftpHost
    ? `# Secretos y variables para GitHub → ${repo} → Settings → Secrets and variables → Actions.
# Este archivo tiene la contraseña FTP: no lo subas a ningún repo y borralo cuando termines.

## Secrets (pestaña «Secrets»)
FTP_SERVER=${ftpHost}
FTP_USERNAME=${ftpUser}
FTP_PASSWORD=${ftpPass}
FTP_DIR=${ftpDir}

## Variables (pestaña «Variables»)
${envLines}
`
    : `# Sin datos de FTP: el sitio se sube a mano (ver PASOS.md). Variables para GitHub → Settings → Variables, por si
# después usás el workflow «Deploy a Hostinger»:
${envLines}
`,
  true,
);
write('PASOS.md', steps());

console.log(`
Listo. En ${OUT}:
  site/                el sitio construido, con .htaccess${zipped ? '\n  foody-sitio.zip      lo mismo, para el Administrador de archivos de Hostinger' : ''}
  .env.production      las variables del sitio
  render.env           las variables de foody-be en Render
  github-secrets.txt   secretos y variables de GitHub (permiso 600${ftpHost ? ', tiene la contraseña FTP' : ''})
  PASOS.md             qué hacer con cada cosa
`);

function steps() {
  const sub = domain.split('.')[0];
  const parent = domain.split('.').slice(1).join('.');
  return `# Deploy de Eclipse para restaurantes

Generado por \`deploy/kit.mjs\` para **${site}${basePath}**.

## 1. Backend en Render (foody-be)
${
  api
    ? `URL: ${api}. Verificá que ande: ${api}/health`
    : `1. Render → New → Blueprint → repo **Toti-Gauna/Foody-be** (lee su \`render.yaml\`).
2. Cuando esté arriba, volvé a correr este kit con su URL (\`https://foody-be-….onrender.com\`).`
}

En Render → foody-be → Environment, dejá lo mismo que \`render.env\`.

## 2. Subdominio en Hostinger
1. hPanel → Dominios → Subdominios → crear **${sub}** sobre ${parent}.
2. Anotá la carpeta que te asigna (por ejemplo \`public_html/${sub}\` o \`domains/${domain}/public_html\`).
3. hPanel → Seguridad → SSL: activá el certificado para ${domain}.

## 3. Subir el sitio
**A mano:** Administrador de archivos → la carpeta del subdominio → subí \`foody-sitio.zip\` → Extraer. Tienen que quedar
\`index.html\` y \`.htaccess\` directamente en esa carpeta (no dentro de otra).

**Desde GitHub (opcional):** cargá \`github-secrets.txt\` en ${repo} → Settings → Secrets and variables → Actions, creá el
environment **hostinger** (Settings → Environments) y corré a mano el workflow **Deploy a Hostinger** escribiendo
PUBLICAR. Sube \`out/\` por FTPS a ${ftpDir || 'la carpeta del subdominio'}. Nunca corre solo.

## 4. Probar
- ${site}${basePath}/ → elige idioma y muestra el sitio.
- ${site}${basePath}/es/demo/ → Lucero. Con backend: en la compu, «Pedí desde tu celular» y escaneá el QR.
- ${site}${basePath}/es/demo/?plan=75 → Juegos para la mesa → Dibujá y adiviná: abrí el link en otro celular.

## Sigue sin indexar
Las páginas llevan \`noindex\`, \`robots.txt\` dice \`Disallow: /\` y el \`.htaccess\` manda \`X-Robots-Tag\`. Se abre en el
lanzamiento comercial, con un cambio en el código (no en este kit).

## Al terminar
Borrá \`github-secrets.txt\`: tiene la contraseña FTP.
`;
}
