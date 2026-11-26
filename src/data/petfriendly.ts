// Para agregar o cambiar fotos: importa el archivo desde src/images/Pets y añade una entrada a la lista.
// Astro lee el ancho/alto reales de cada imagen, así que no hace falta escribirlos.
// El componente recorta a proporción 4:5 con object-fit: cover.
import type { ImageMetadata } from 'astro';
import jack from '../images/Pets/Jack.jpg';
import mila from '../images/Pets/Mila.JPG';
import rob from '../images/Pets/Rob.JPG';
import comodin from '../images/Pets/Contraluz - Comodin.jpg';

export interface PetFriendlyImage {
  src: ImageMetadata;
  alt: string;
  /** Punto de la foto que se conserva al recortar: "horizontal vertical". Sin valor, el centro. */
  focus?: string;
  /** Acercamiento: 1 = sin zoom. */
  zoom?: number;
  /** Corrección de luz y color (filtros CSS) para que la foto se parezca a las demás. */
  filter?: string;
}

// El encuadre busca que los ojos de cada mascota queden a la misma altura (cerca del 24 % de la tarjeta).
export const petFriendlyImages: PetFriendlyImage[] = [
  { src: jack, alt: 'Perro pequeño de pelaje claro lamiéndose la nariz dentro de Bukë', focus: '50% 19%', filter: 'brightness(0.96) saturate(0.88)' },
  { src: mila, alt: 'Perra blanca de ojos azules sentada y sonriendo en el salón de Bukë', focus: '50% 43%', filter: 'sepia(0.1)' },
  { src: rob, alt: 'Perro blanco con manchas grises sentado sobre el piso de madera de Bukë', focus: '50% 51%' },
  { src: comodin, alt: 'Perro bernés de montaña sentado en la terraza de Bukë, rodeado de plantas', focus: '77% 44%', zoom: 1.3, filter: 'brightness(1.08) sepia(0.15)' },
];


export const petFriendlyContent = {
  title: 'Pet Friendly',
  paragraph:
    'En Bukë tu mejor amigo también es bienvenido. Disfruten juntos de un desayuno, un café o una tarde tranquila. Además, tenemos snacks especiales para consentirlo.',
  features: [
    { label: 'Snacks\nespeciales', icon: 'paw' }, // \n = salto de línea solo en móvil
    { label: 'Espacio al aire\nlibre', icon: 'terrace' },
    { label: 'Agua para tu mascota', icon: 'drop' }, 
  ],
};
