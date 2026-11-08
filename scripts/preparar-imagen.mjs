// Prepara una foto de producto para el catálogo: recorta el fondo blanco, la centra con margen
// en un lienzo blanco 720x900 (4:5) y la exporta a .webp.
// Uso: npm run img -- <ruta-entrada> <slug> [--out <carpeta>]
// Salida por defecto: src/assets/productos/<slug>.webp (la carpeta que lee BouquetsCatalogo.astro con astro:assets).
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CANVAS_W = 720;
const CANVAS_H = 900;
const MAX_W = 0.8; // el contenido ocupa como máximo el 80 % del ancho
const MAX_H = 0.84; // y el 84 % del alto
const QUALITY = 85;
// Un píxel es "contenido" si algún canal baja de este valor (el fondo ronda 253–255;
// 250 conserva la sombra suave sin arrastrar el ruido del fondo).
const BG_THRESHOLD = 250;
// Holgura extra (px del original) alrededor del recuadro para no cortar el degradado final de la sombra.
const PAD = 6;

const fail = (msg) => {
  console.error(`Error: ${msg}`);
  process.exit(1);
};

const args = process.argv.slice(2);
let outDir = resolve(root, 'src/assets/productos');
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') {
    if (!args[i + 1]) fail('--out necesita una carpeta.');
    outDir = resolve(args[++i]);
  } else positional.push(args[i]);
}
const [input, slug] = positional;
if (!input || !slug) fail('Uso: npm run img -- <ruta-entrada> <slug> [--out <carpeta>]');
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(`El slug "${slug}" no es kebab-case. Usa solo minúsculas, números y guiones simples, sin espacios, tildes ni guiones al inicio/final (ej. girasoles-valle, rosas-jardin).`);

const inputPath = resolve(input);
if (!existsSync(inputPath)) fail(`No existe el archivo de entrada: ${inputPath}`);

/** Recuadro de los píxeles que no son fondo blanco en un buffer RGB(A) -> RGB de 3 canales. */
async function contentBox(source) {
  const { data, info } = await sharp(source)
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    const row = y * width * 3;
    for (let x = 0; x < width; x++) {
      const o = row + x * 3;
      if (data[o] < BG_THRESHOLD || data[o + 1] < BG_THRESHOLD || data[o + 2] < BG_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  // Nivel del fondo: percentil 10 del valor mínimo por canal en el marco exterior de la foto.
  const hist = new Array(256).fill(0);
  let total = 0;
  const sample = (px, py) => {
    const o = (py * width + px) * 3;
    hist[Math.min(data[o], data[o + 1], data[o + 2])]++;
    total++;
  };
  for (let px = 0; px < width; px++) { sample(px, 0); sample(px, height - 1); }
  for (let py = 1; py < height - 1; py++) { sample(0, py); sample(width - 1, py); }
  let acc = 0, bg = 255;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= total * 0.1) { bg = v; break; }
  }
  return { left: minX, top: minY, right: maxX, bottom: maxY, width, height, bg };
}

let box;
try {
  box = await contentBox(inputPath);
} catch (err) {
  fail(`No se pudo leer la imagen (${err.message}).`);
}
if (!box) fail('La imagen es completamente blanca: no se detectó contenido.');

const touches = [];
if (box.left === 0) touches.push('izquierdo');
if (box.right === box.width - 1) touches.push('derecho');
if (box.top === 0) touches.push('superior');
if (box.bottom === box.height - 1) touches.push('inferior');
if (touches.length) console.warn(`Aviso: el contenido toca el borde ${touches.join(', ')} de la imagen original; puede venir ya recortado.`);

const left = Math.max(0, box.left - PAD);
const top = Math.max(0, box.top - PAD);
const right = Math.min(box.width - 1, box.right + PAD);
const bottom = Math.min(box.height - 1, box.bottom + PAD);
const crop = { left, top, width: right - left + 1, height: bottom - top + 1 };

const scale = Math.min((CANVAS_W * MAX_W) / crop.width, (CANVAS_H * MAX_H) / crop.height);
const w = Math.round(crop.width * scale);
const h = Math.round(crop.height * scale);
const x = Math.round((CANVAS_W - w) / 2);
const y = Math.round((CANVAS_H - h) / 2);

// El fondo de las fotos IA no es 255 puro (ej. 253–254): se escala para que sea #FFFFFF y no se vea un
// rectángulo sobre el lienzo (ni con mix-blend-multiply sobre el fondo paper).
if (box.bg < 240) console.warn(`Aviso: el fondo de la foto es poco claro (${box.bg}); puede no ser un fondo blanco.`);
const bg = Math.max(box.bg, 240);

const resized = await sharp(inputPath)
  .flatten({ background: '#ffffff' })
  .extract(crop)
  .linear(255 / bg, 0)
  .resize(w, h, { kernel: 'lanczos3' })
  .toBuffer();

const canvas = await sharp({
  create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: '#ffffff' },
})
  .composite([{ input: resized, left: x, top: y }])
  .png()
  .toBuffer();

// Márgenes medidos sobre el lienzo final (contenido + sombra detectados con el mismo umbral).
const out = await contentBox(canvas);
const pct = (px, total) => ((px / total) * 100).toFixed(1);
const margins = {
  izquierda: pct(out.left, CANVAS_W),
  derecha: pct(CANVAS_W - 1 - out.right, CANVAS_W),
  arriba: pct(out.top, CANVAS_H),
  abajo: pct(CANVAS_H - 1 - out.bottom, CANVAS_H),
};

mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, `${slug}.webp`);
await sharp(canvas).webp({ quality: QUALITY }).toFile(outPath);

const meta = await sharp(outPath).metadata();
console.log(`Entrada:  ${relative(root, inputPath)} (${box.width}x${box.height})`);
console.log(`Recorte:  ${crop.width}x${crop.height} px (contenido + sombra) -> ${w}x${h} px en el lienzo`);
console.log(`Salida:   ${relative(root, outPath)} (${meta.width}x${meta.height}, webp q${QUALITY})`);
console.log(`Márgenes: izquierda ${margins.izquierda}% | derecha ${margins.derecha}% | arriba ${margins.arriba}% | abajo ${margins.abajo}%`);
if (Object.values(margins).some((m) => Number(m) < 8)) console.warn('Aviso: algún margen es menor al 8 %.');
