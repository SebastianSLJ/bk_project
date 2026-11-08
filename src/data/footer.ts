import { contacto as contactoWhatsApp, whatsappUrl } from './contacto';

export type IconoValor = 'pan' | 'parqueadero' | 'mascota' | 'domicilio';
export type IconoRed = 'facebook' | 'instagram' | 'tiktok';

export interface Valor {
  titulo: string;
  texto: string;
  icono: IconoValor;
}

export interface EnlaceFooter {
  label: string;
  href: string;
}

export interface ColumnaFooter {
  titulo: string;
  enlaces: EnlaceFooter[];
}

export interface RedSocial {
  nombre: 'Facebook' | 'Instagram' | 'TikTok';
  href: string;
  icono: IconoRed;
}

export interface ContactoFooter {
  direccion: string;
  referencia: string;
  /** Texto del teléfono. Vacío = no se muestra (el contacto va por WhatsApp). */
  telefono: string;
  /** Vacío = no se muestra. */
  correo: string;
  horario: { dias: string; horas: string }[];
  whatsappHref: string;
}

export const marca = 'Bukë';
export const eslogan = 'Sabores artesanales, para disfrutar todos los días.';

export const valores: Valor[] = [
  { titulo: 'Horneado a diario', texto: 'Pan y repostería recién salidos del horno.', icono: 'pan' },
  { titulo: 'Parqueadero gratis', texto: 'Llega con calma, tenemos espacio para ti.', icono: 'parqueadero' },
  { titulo: 'Pet friendly', texto: 'Tu mejor amigo también es bienvenido.', icono: 'mascota' },
  { titulo: 'Domicilios', texto: 'Llevamos Bukë hasta tu casa u oficina.', icono: 'domicilio' },
];

// Rutas absolutas desde la raíz para que funcionen igual en / y en /menu.
export const columnas: ColumnaFooter[] = [
  {
    titulo: 'Menú',
    enlaces: [
      { label: 'Ver todo el menú', href: '/menu' },
      { label: 'Panadería', href: '/menu#panaderia' },
      { label: 'Desayuno', href: '/menu#desayuno' },
      { label: 'Tarde', href: '/menu#tarde' },
      { label: 'Bebidas', href: '/menu#bebidas' },
      { label: 'Repostería', href: '/menu#reposteria' },
    ],
  },
  {
    titulo: 'Bukë',
    enlaces: [
      { label: 'Favoritos', href: '/#panaderia' },
      { label: 'Celebraciones', href: '/#celebraciones' },
      { label: 'Pet friendly', href: '/#mascotas' },
      { label: 'Ubicación y horarios', href: '/#ubicacion' },
    ],
  },
];

// TODO: reemplazar "#" por las URLs reales de cada red.
export const redes: RedSocial[] = [
  { nombre: 'Facebook', href: '#', icono: 'facebook' },
  { nombre: 'Instagram', href: '#', icono: 'instagram' },
  { nombre: 'TikTok', href: '#', icono: 'tiktok' },
];

// Dirección y horarios copiados de la sección "Encuéntranos" de index.astro.
// TODO: si cambian allá, actualizar también aquí.
export const contacto: ContactoFooter = {
  direccion: 'Km 2, Chía, Cundinamarca',
  referencia: '200 mts antes de C.C. Fontanar',
  telefono: '', // TODO: teléfono real (hoy solo existe el WhatsApp placeholder en contacto.ts)
  correo: '', // TODO: correo real
  horario: [
    { dias: 'Lunes a jueves', horas: '7:00 a.m. a 7:00 p.m.' },
    { dias: 'Viernes y sábado', horas: '7:00 a.m. a 8:00 p.m.' },
    { dias: 'Domingos y festivos', horas: '7:00 a.m. a 7:00 p.m.' },
  ],
  whatsappHref: whatsappUrl(contactoWhatsApp.mensajeDomicilio),
};

// Sin enlaces legales: hoy no existen páginas de privacidad ni términos.
// Cuando existan, agrégalos aquí como { label, href } y el Footer los mostrará.
export const legal: EnlaceFooter[] = [];
