# Deploy

El sitio es un export estático (`out/`). Va a Hostinger, en `foody.eclipse-business.com`. El backend (`Toti-Gauna/Foody-be`)
va a Render. Nada se publica sin el OK de Ignacio.

## Kit con Docker (Codespaces)

```bash
docker build -t foody-kit -f deploy/Dockerfile .
mkdir -p deploy-out
docker run -it --rm -v "$PWD/deploy-out:/out" foody-kit
```

Sin Docker: `node deploy/kit.mjs --out deploy-out` (después de `npm ci`).

Pregunta por consola:
- dominio, path base y URL del backend en Render;
- URLs de Eclipse y Roofy, y el WhatsApp;
- datos FTP de Hostinger (opcionales; la contraseña no se muestra al escribirla). La carpeta tiene que ser la del
  subdominio: la subida borra lo que sobra ahí, y el kit no acepta `public_html` ni la raíz.

Después construye el sitio y deja en `deploy-out/` (ignorada por git):

| Archivo | Qué es |
|---|---|
| `site/` y `foody-sitio.zip` | El sitio construido, con su `.htaccess` (HTTPS, caché, cabeceras, `X-Robots-Tag: noindex`). |
| `.env.production` | Las variables `NEXT_PUBLIC_*` del sitio (ninguna es secreta). |
| `render.env` | `NODE_VERSION` y `ALLOWED_ORIGINS` para foody-be en Render. |
| `github-secrets.txt` | Secrets (FTP) y variables para GitHub Actions. Permiso 600: borralo al terminar. |
| `PASOS.md` | El paso a paso con los valores cargados. |

## Subir

- **A mano:** en el Administrador de archivos de Hostinger, subí `foody-sitio.zip` a la carpeta del subdominio y extraelo.
- **Desde GitHub:** el workflow **Deploy a Hostinger** (`.github/workflows/hostinger.yml`) solo corre a mano y pide
  escribir `PUBLICAR`. Usa el environment `hostinger`: construye con las variables del repo y sube `out/` por FTPS, con
  el certificado verificado.

## Backend

Render → New → Blueprint → `Toti-Gauna/Foody-be` (lee su `render.yaml`). Con su URL en `NEXT_PUBLIC_API_URL`:
- las salas de juego pasan por el relay y andan en cualquier red;
- en la compu aparece «Pedí desde tu celular»: un QR que conecta la carta del celular con el CRM de esa pantalla;
- la palabra de «Dibujá y adiviná» le llega solo al que dibuja.

Sin backend, todo sigue andando: salas por WebRTC y sincronización solo entre pestañas.
