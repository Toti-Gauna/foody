"""Recorta las 8 láminas de Gus (fondo verde #00FF00) en 38 PNG transparentes.

Uso: python3 tools/recortar-laminas.py assets/personajes/cafe/mesero/laminas assets/personajes/cafe/mesero/png

Todas las poses quedan en el mismo lienzo cuadrado, con los pies sobre la misma línea y la cadera
sobre el mismo eje, para que al cambiar de pose el personaje no salte. Requiere numpy, pillow y scipy.
"""
import sys, json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
NAMES = [
  ['01-saludar','02-agradecer','03-presentar-carta','04-servir','05-esperar'],
  ['06-irse-con-cuenta','07-anotar','08-sorpresa','09-triste','10-celular'],
  ['11-celebrar','12-pensar','13-senalar','14-caminar-con-cuenta','15-limpiar'],
  ['saludo-f1','saludo-f2','asoma','mareado','busto'],
  ['anota-f1','anota-f2','anota-f3','bandeja-tapada','espia'],
  ['camina-tapada-f1','camina-tapada-f2','camina-tapada-f3','camina-tapada-f4','camina-tapada-f5'],
  ['corre-tapada-f1','corre-tapada-f2','corre-tapada-f3','corre-tapada-f4','corre-tapada-f5'],
  ['campana-f1','campana-f2','campana-f3'],
]
# face height measured on every pose: sheets 1-5 ~134 px; these differ
SHEET_SCALE = {6: 1.045, 7: 1.17, 8: 0.97}
SCALE = {'asoma': 0.91, 'busto': 0.74}
figs = []
for si, names in enumerate(NAMES):
    im = np.asarray(Image.open(f'{src}/Gus_lamina_0{si+1}.png').convert('RGB')).astype(np.float32)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    d = g - np.maximum(r, b)                       # greenness
    a = np.clip((150 - d) / (150 - 45), 0, 1)       # soft key
    # despill: no channel-green excess left on the edge
    g2 = np.minimum(g, np.maximum(r, b) + 6)
    rgb = np.stack([r, g2, b], -1)
    solid = a > 0.5
    lab, n = ndi.label(ndi.binary_dilation(solid, iterations=3))
    sizes = ndi.sum(solid, lab, range(1, n + 1))
    W = im.shape[1]; colw = W / 5
    cols = {}
    for k, s in enumerate(sizes, 1):
        if s < 400: continue
        ys, xs = np.nonzero(lab == k)
        c = int(xs.mean() // colw)
        cols.setdefault(c, []).append(k)
    for c, name in enumerate(names):
        ks = cols.get(c, [])
        m = np.isin(lab, ks) & (a > 0)
        ys, xs = np.nonzero(m)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        alpha = (a * m)[y0:y1, x0:x1]
        crop = np.dstack([rgb[y0:y1, x0:x1], alpha * 255]).clip(0, 255).astype(np.uint8)
        sc = SCALE.get(name, SHEET_SCALE.get(si + 1, 1.0))
        if sc != 1.0:
            im2 = Image.fromarray(crop, 'RGBA').convert('RGBa')
            im2 = im2.resize((round(crop.shape[1] * sc), round(crop.shape[0] * sc)), Image.LANCZOS).convert('RGBA')
            crop = np.asarray(im2); alpha = crop[..., 3] / 255.0
        h, w = crop.shape[:2]
        # anchor: x centroid of the band 30-55% up from the feet (hips/thighs)
        band = alpha[int(h * 0.45):int(h * 0.70)] > 0.5
        bx = np.nonzero(band)[1]
        ax = bx.mean() if len(bx) else crop.shape[1] / 2
        figs.append(dict(name=name, sheet=si + 1, crop=crop, h=h, w=w, ax=ax, bottom=y1, n=len(ks)))
# canvas: same scale for all, feet on one baseline, hips on one vertical axis
left = max(f['ax'] for f in figs); right = max(f['w'] - f['ax'] for f in figs)
H = max(f['h'] for f in figs)
half = int(max(left, right)) + 24
S = int(np.ceil(max(2 * half, H + 48) / 8) * 8)
base = S - 24
meta = {'canvas': S, 'baseline': base, 'axis': S // 2, 'poses': {}}
for f in figs:
    cv = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    x = int(round(S / 2 - f['ax'])); y = base - f['h']
    cv.alpha_composite(Image.fromarray(f['crop'], 'RGBA'), (x, y))
    cv.save(f"{out}/gus-{f['name']}.png", optimize=True)
    meta['poses'][f['name']] = dict(sheet=f['sheet'], parts=f['n'], w=int(f['w']), h=int(f['h']))
json.dump(meta, open(f'{out}/manifest.json', 'w'), indent=1)
print('canvas', S, 'figures', len(figs))
for f in figs: print(f['name'], f['w'], f['h'], 'parts', f['n'])
