/**
 * Configuración de entorno (desarrollo).
 *
 * - apiUrl: URL del backend Spring Boot.
 * - whatsappVendedor: número del vendedor con código país y SIN "+", usado para
 *   generar el link de WhatsApp del pedido (https://wa.me/<numero>?text=...).
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081',
  whatsappVendedor: '56912345678',
};
