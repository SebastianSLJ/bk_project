// Para usar fotos reales: reemplaza `src` (ruta en /public o URL) y ajusta `alt`, `width` y `height`.
// Mantén la proporción 4:5; el componente recorta con object-fit: cover.
export interface PetFriendlyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const petFriendlyImages: PetFriendlyImage[] = [
  { src: '/images/petfriendly/placeholder-1.svg', alt: 'Mascota acompañando a su dueño en Bukë (foto por definir)', width: 800, height: 1000 },
  { src: '/images/petfriendly/placeholder-2.svg', alt: 'Terraza de Bukë con mascotas (foto por definir)', width: 800, height: 1000 },
  { src: '/images/petfriendly/placeholder-3.svg', alt: 'Perro disfrutando de la visita a Bukë (foto por definir)', width: 800, height: 1000 },
  { src: '/images/petfriendly/placeholder-4.svg', alt: 'Mesa con café y panadería junto a una mascota (foto por definir)', width: 800, height: 1000 },
];


export const petFriendlyContent = {
  title: 'Pet Friendly',
  paragraph:
    'En Buke tu mejor amigo tambien es bienvenido. Disfruten juntos de un desayuno, un cafe o una tarde tranquila. Ademas, tenemos snacks especiales para consentirlo.',
  features: [
    { label: 'Snacks especiales', icon: 'paw' },
    { label: 'Espacio al aire libre', icon: 'terrace' },
    { label: 'Agua para tu mascota', icon: 'drop' }, 
  ],
};
