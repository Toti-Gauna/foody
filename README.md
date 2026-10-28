# Eclipse para locales de comida · Eclipse V6

**Eclipse para locales de comida** (en Eclipse-Web figura como «Foody», nombre provisorio). Plataforma para locales de comida de Mar del Plata, empezando por un restó-bar: carta y pedido desde la mesa por QR, reservas, juegos de mesa, pasaporte de fidelidad, personajes de marca y visor 3D. **Powered by Eclipse.**

Demo en línea: **https://toti-gauna.github.io/foody/** (La carta de Gus, se publica sola desde `main` con GitHub Actions).

Estado: **planificación**. Todavía no hay código de aplicación. Este repo reúne la dirección visual, los personajes y el roadmap.

## Documentos

| Archivo | Contenido |
|---|---|
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Roadmap v5 por tandas de plan, con modelo, esfuerzo y tamaño por fase |
| [`docs/SDD-0.1-DESCUBRIMIENTO.md`](docs/SDD-0.1-DESCUBRIMIENTO.md) | SDD de la fase 0.1: decisiones, flujos, estados, alcance de Contact, juegos por plan, proveedores y preguntas abiertas |
| [`docs/0.2-CONTRATO-VISUAL.md`](docs/0.2-CONTRATO-VISUAL.md) | Fase 0.2: contrato visual de la página (dirección, secciones, movimiento, presupuesto, rúbrica, enlace con Eclipse-Web) |
| [`docs/EXPERIENCIA-CARTA-GUS.md`](docs/EXPERIENCIA-CARTA-GUS.md) | La carta del comensal con Gus: guion, estados, poses nuevas y prompts. Prototipo en `prototipos/carta-gus/` |
| [`docs/PERSONAJES.md`](docs/PERSONAJES.md) | Selección de personaje, poses, reacciones y reglas |
| [`docs/PORTAL-CUENTA.md`](docs/PORTAL-CUENTA.md) | Portal Mi Eclipse, datos de cobro, Academy, Media y Utilería |
| [`docs/PROMPT-IMAGENES.md`](docs/PROMPT-IMAGENES.md) | Prompt completo v4 (estética Efemérides) para generar todas las imágenes |

## Assets

```
assets/
  referencias/            dirección visual (no son capturas publicables)
    sitio-comercial/      T01–T14, T21
    marcas-storyboards/   T15–T20
    demos/                alba, neon-21, grano, gelato-pop (home, producto, panel)
    variantes/            versiones iniciales
  ui/
    comida/  iconos/  fondos/  mockups/
  personajes/             20 personajes, 4 comercios
    <comercio>/<personaje>/acciones_15.jpg, secuencias_50/
    personajes.json       manifiesto para el selector
    INDICE_1000_POSES.csv índice de poses
    exploraciones-anteriores/
```

Los personajes son **referencias**: no son sprites ni animaciones. Ver `docs/PERSONAJES.md`, sección de producción.
