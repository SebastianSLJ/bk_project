// Single source for menu categories (used by the schema, the CSV script, and /menu).
// The order determines the sequence of the tabs. `id` serves as the anchor (/menu#tarde).
//
// Ordering of products within each tab (optional fields):
// orden: ['id-1', 'id-2'] → these products appear first, in that specific order (using the `id` from productos.json).
// All other products follow, in the order they appear in the JSON. If left empty, the JSON order is used.
// adicionesAlFinal: true → products labeled "Adición…" (Add-on) that are not included in `orden` will be placed at the end.
export const categorias = [
  {
    id: 'panaderia', label: 'Panadería', icon: 'bread', description: 'Descubre nuestra seleccion de panaderia artesanal:',
    orden: [],
  },
  {
    id: 'desayuno', label: 'Desayuno', icon: 'sunrise', description: 'El desayuno no deberìa tener horario:',
    adicionesAlFinal: true, 
    orden: [],
  },
  {
    id: 'tarde', label: 'Tarde', icon: 'coffee', description: 'Encuentra opciones artesanales, sabores caseros y antojos para disfrutar sin afan:',
    adicionesAlFinal: true,
    orden: ['envuelto-de-mazorca', 'tamal-grande'],
  },
  {
    id: 'bebidas', label: 'Bebidas', icon: 'drink', description: 'Encuentra tu bebida favorita y hazla parte de tu momento Buke',
    orden: [],
  },
  {
    id: 'reposteria', label: 'Repostería', icon: 'dessert', description: 'Descubre nuestra selecciòn artesanal o encuentra tu favorito',
    orden: [],
  },
];

export const categoriaIds = categorias.map((c) => c.id);
