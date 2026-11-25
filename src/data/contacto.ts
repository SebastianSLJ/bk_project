// Única fuente del número de WhatsApp. Formato: indicativo + número, sin "+" ni espacios.
export const contacto = {
  whatsapp: '573219851910',
  mensajeDomicilio: 'Hola, quiero hacer un pedido a domicilio.',
  mensajeReserva: 'Hola, quiero reservar una mesa en Bukë Chía.',
  coords: '4.880111, -74.037445', // Coordenadas de Google Maps
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${contacto.coords}`;

export const whatsappUrl = (mensaje: string = contacto.mensajeDomicilio) =>
  `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
