# Bukë (Astro + Tailwind)

## Imágenes

| Carpeta | Qué va ahí | Cómo se usa |
|---|---|---|
| `src/assets/` | Todo lo que se importa desde código (fotos de productos, etc.). | `astro:assets` (`<Image />`), que las optimiza. |
| `public/` | Solo archivos que necesitan una URL fija: favicon, og-image, robots.txt, PDFs. | Ruta directa (`/favicon.svg`). |
| `assets-originales/` (raíz) | Originales sin procesar (fotos de IA, PNG pesados). Nunca se importan. | Solo como entrada de `npm run img`. |

- Nombres en minúsculas y kebab-case, iguales al slug del producto (`rosas-jardin.webp`).
- Fotos de productos (bouquets y comida): `src/assets/productos/<slug>.webp`.

### Preparar la foto de un producto

```bash
npm run img -- <ruta-de-la-foto-original> <slug>
# ej.: npm run img -- assets-originales/productos/Orange.png rosas-jardin
```

Recorta el fondo blanco, centra el ramo con margen en un lienzo blanco de 720×900 (4:5) y escribe `src/assets/productos/<slug>.webp`. El slug debe ser kebab-case; si no, el script falla con un mensaje claro.

Para mostrar un producto oculto en el catálogo de bouquets, procese su foto y borre `visible: false` en [BouquetsCatalogo.astro](src/components/BouquetsCatalogo.astro).

## Productos del menú

Edite `data-source/productos.csv`, ponga la foto en `src/assets/productos/` y ejecute `npm run productos`.
