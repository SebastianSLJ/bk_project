// Única fuente de las categorías del menú (la usan el schema, el script CSV y /menu).
// El orden define el orden de las pestañas. `id` es el ancla (/menu#tarde).
export const categorias = [
  { id: 'panaderia', label: 'Panadería', icon: 'bread', description: 'Pan artesanal y masas horneadas cada día.' },
  { id: 'desayuno', label: 'Desayuno', icon: 'sunrise', description: 'Para empezar el día con sabor a casa.' },
  { id: 'tarde', label: 'Tarde', icon: 'coffee', description: 'Platos, café y bebidas para el resto del día.' },
  { id: 'bebidas', label: 'Bebidas', icon: 'drink', description: 'Café, jugos, infusiones y bebidas frías.' },
  { id: 'reposteria', label: 'Repostería', icon: 'dessert', description: 'Algo dulce para cerrar bien.' },
];

export const categoriaIds = categorias.map((c) => c.id);
