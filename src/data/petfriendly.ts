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

// TODO: textos provisionales. Validar con Bukë que reflejen la política real de mascotas.
export const petFriendlyContent = {
  title: 'Pet Friendly',
  paragraph:
    'En Bukë también hay lugar para tu mascota. Disfruta de tu café y tu panadería recién horneada en compañía de tu mejor amigo, en un ambiente tranquilo y relajado. Consulta con nosotros las condiciones antes de venir.',
  features: [
    { label: 'Mascotas bienvenidas', icon: 'paw' },
    { label: 'Espacio al aire libre', icon: 'terrace' },
    { label: 'Agua para tu mascota', icon: 'drop' },
    { label: 'Reserva con anticipación', icon: 'calendar' },
  ],
  cta: 'Reservar con mi mascota',
  whatsappMessage: 'Hola, quiero reservar una mesa en Bukë Chía y voy a ir con mi mascota. ¿Me ayudan con las condiciones?',
};
