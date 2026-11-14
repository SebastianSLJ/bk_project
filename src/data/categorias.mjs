// Single source for menu categories (used by the schema, the CSV script, and /menu).
// The order determines the sequence of the tabs. `id` serves as the anchor (/menu#tarde).
//
// Ordering of products within each tab (optional fields):
// orden: ['id-1', 'id-2'] → these products appear first, in that specific order (using the `id` from productos.json).
// All other products follow, in the order they appear in the JSON. If left empty, the JSON order is used.
// adicionesAlFinal: true → products labeled "Adición…" (Add-on) that are not included in `orden` will be placed at the end.
export const categorias = [
  {
    id: 'panaderia', label: 'Panadería', icon: 'bread', description: 'Pan artesanal y masas horneadas cada día.',
    orden: [],
  },
  {
    id: 'desayuno', label: 'Desayuno', icon: 'sunrise', description: 'Para empezar el día con sabor a casa.',
    orden: [],
  },
  {
    id: 'tarde', label: 'Tarde', icon: 'coffee', description: 'Platos, café y bebidas para el resto del día.',
    adicionesAlFinal: true,
    orden: ['envuelto-de-mazorca', 'tamal-grande'],
  },
  {
    id: 'bebidas', label: 'Bebidas', icon: 'drink', description: 'Café, jugos, infusiones y bebidas frías.',
    orden: [],
  },
  {
    id: 'reposteria', label: 'Repostería', icon: 'dessert', description: 'Algo dulce para cerrar bien.',
    orden: [],
  },
];

export const categoriaIds = categorias.map((c) => c.id);
