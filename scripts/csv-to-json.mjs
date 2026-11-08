// CSV -> src/data/productos.json
// Uso: npm run productos
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import { categoriaIds } from '../src/data/categorias.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSV_PATH = resolve(root, 'data-source/productos.csv');
const OUT_PATH = resolve(root, 'src/data/productos.json');
const IMAGES_DIR = resolve(root, 'src/assets/productos');
// Ruta con la que el loader `file()` resuelve imágenes: relativa al JSON.
const IMAGE_REF_PREFIX = '../assets/productos/';

// Categorías para filas sin categoría (ej. bebidas embotelladas). Se avisa por consola.
const DEFAULT_CATEGORIAS = ['desayuno', 'tarde'];
// Valores de "imagen" que significan "sin foto" (el export de Notion trae "iCloud").
const NO_IMAGE = new Set(['', 'icloud']);

// Encabezados aceptados -> campo interno (el formato del spec y el export original).
const HEADERS = {
  id: 'id', item: 'codigo', codigo: 'codigo',
  nombre: 'nombre', producto: 'nombre',
  categoria: 'categorias', categorias: 'categorias', 'seleccion multiple': 'categorias',
  precio: 'precio',
  imagen: 'imagen', fotografia: 'imagen',
  descripcion: 'descripcion',
  destacado: 'destacado', disponible: 'disponible',
};

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const slugify = (s) => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

function parseBool(value, field) {
  const v = fold(value ?? '');
  if (v === '') return undefined; // vacío = default del schema
  if (['si', 'true', '1'].includes(v)) return true;
  if (['no', 'false', '0'].includes(v)) return false;
  throw new Error(`"${field}" debe ser si/no/true/false/1/0 (recibido "${value}")`);
}

function parsePrecio(value) {
  const v = clean(value);
  if (!v) throw new Error('precio vacío');
  // Acepta "$24.200", "24,200", "24200", "$ 1.234.567". Rechaza cualquier otra cosa.
  if (!/^\$?\s*\d{1,3}([.,]\d{3})+$|^\$?\s*\d+$/.test(v)) {
    throw new Error(`precio no numérico: "${value}"`);
  }
  const n = Number(v.replace(/\D/g, ''));
  if (!Number.isInteger(n) || n <= 0) throw new Error(`precio debe ser un entero positivo (recibido "${value}")`);
  return n;
}

function parseCategorias(value) {
  const parts = (value ?? '').split(/[,;|]/).map(fold).filter(Boolean);
  if (parts.length === 0) return { list: DEFAULT_CATEGORIAS, defaulted: true };
  const invalid = parts.filter((p) => !categoriaIds.includes(p));
  if (invalid.length) {
    throw new Error(`categoría inválida "${invalid.join('", "')}". Válidas: ${categoriaIds.join(', ')}`);
  }
  return { list: [...new Set(parts)], defaulted: false };
}

const errors = [];
const warnings = [];
const fail = (line, nombre, msg) => errors.push(`  fila ${line}${nombre ? ` (${nombre})` : ''}: ${msg}`);

if (!existsSync(CSV_PATH)) {
  console.error(`No existe ${CSV_PATH}`);
  process.exit(1);
}

const raw = readFileSync(CSV_PATH, 'utf8').replace(/^﻿/, '');
const records = parse(raw, {
  columns: (header) =>
    header.map((h) => {
      const key = HEADERS[fold(h)];
      if (!key) throw new Error(`Encabezado desconocido: "${h}". Válidos: ${Object.keys(HEADERS).join(', ')}`);
      return key;
    }),
  skip_empty_lines: true,
  relax_column_count: false,
});

const seen = new Map();
const items = [];

records.forEach((row, i) => {
  const line = i + 2; // +1 encabezado, +1 base 1
  const nombre = clean(row.nombre);
  const label = nombre || undefined;
  try {
    if (!nombre) throw new Error('falta nombre');

    const id = clean(row.id) ? slugify(row.id) : slugify(nombre);
    if (!id) throw new Error('no se pudo generar un id');
    if (seen.has(id)) throw new Error(`id duplicado "${id}" (ya usado en fila ${seen.get(id)})`);
    seen.set(id, line);

    const precio = parsePrecio(row.precio);
    const { list: categorias, defaulted } = parseCategorias(row.categorias);
    if (defaulted) warnings.push(`  fila ${line} (${nombre}): sin categoría, se usa ${DEFAULT_CATEGORIAS.join(' + ')}`);

    const item = { id, nombre, categorias, precio };
    if (clean(row.codigo)) item.codigo = clean(row.codigo);

    const img = clean(row.imagen);
    if (!NO_IMAGE.has(fold(img))) {
      if (!existsSync(resolve(IMAGES_DIR, img))) throw new Error(`imagen no existe en src/assets/productos/: "${img}"`);
      item.imagen = IMAGE_REF_PREFIX + img;
    }

    const descripcion = clean(row.descripcion);
    if (descripcion) item.descripcion = descripcion;

    const destacado = parseBool(row.destacado, 'destacado');
    if (destacado !== undefined) item.destacado = destacado;
    const disponible = parseBool(row.disponible, 'disponible');
    if (disponible !== undefined) item.disponible = disponible;

    items.push(item);
  } catch (e) {
    fail(line, label, e.message);
  }
});

if (errors.length) {
  console.error(`✖ ${errors.length} error(es) en ${CSV_PATH}:\n${errors.join('\n')}`);
  process.exit(1);
}

// Orden por código ("001" < "025" < "025-1" < "026"); sin código, al final.
items.sort((a, b) => (a.codigo ?? '￿').localeCompare(b.codigo ?? '￿', 'es', { numeric: true }));

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(items, null, 2) + '\n', 'utf8');

if (warnings.length) console.warn(`⚠ ${warnings.length} aviso(s):\n${warnings.join('\n')}`);
console.log(`✔ ${items.length} productos -> ${OUT_PATH}`);
