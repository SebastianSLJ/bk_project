// Única fuente del número de WhatsApp. Formato: indicativo + número, sin "+" ni espacios.
// TODO: reemplazar por el número real.
export const contacto = {
  whatsapp: '57XXXXXXXXXX',
  mensajeDomicilio: 'Hola, quiero hacer un pedido a domicilio.',
  mensajeReserva: 'Hola, quiero reservar una mesa en Bukë Chía.',
};

export const whatsappUrl = (mensaje: string = contacto.mensajeDomicilio) =>
  `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`;
