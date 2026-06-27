/**
 * Configuración de entorno (producción).
 * apiUrl apunta al backend desplegado en Render.
 * El número de WhatsApp del vendedor se obtiene en runtime desde /api/config;
 * el valor de aquí es solo un respaldo.
 */
export const environment = {
  production: true,
  apiUrl: 'https://tienda-backend-xn22.onrender.com',
  whatsappVendedor: '56957046074',
};
