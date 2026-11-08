import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { categoriaIds } from './data/categorias.mjs';

const productos = defineCollection({
  loader: file('src/data/productos.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string().min(1),
      codigo: z.string().optional(),
      nombre: z.string().min(1),
      // Un producto puede aparecer en varias categorías (ej. Desayuno y Tarde).
      categorias: z.array(z.enum(categoriaIds as [string, ...string[]])).min(1),
      precio: z.number().int().positive(),
      imagen: image().optional(),
      descripcion: z.string().optional(),
      destacado: z.boolean().default(false),
      disponible: z.boolean().default(true),
    }),
});

export const collections = { productos };
