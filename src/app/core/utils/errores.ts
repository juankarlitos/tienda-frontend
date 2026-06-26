import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrae un mensaje legible (en español) de un error HTTP del backend.
 * El backend responde { mensaje: "..." } o { errores: { campo: "..." } }.
 */
export function mensajeDeError(err: unknown, porDefecto = 'Ocurrió un error. Intenta nuevamente.'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }
    const cuerpo = err.error;
    if (cuerpo) {
      if (typeof cuerpo === 'string') return cuerpo;
      if (cuerpo.mensaje) return cuerpo.mensaje;
      if (cuerpo.errores) {
        const valores = Object.values(cuerpo.errores as Record<string, string>);
        if (valores.length) return valores.join('. ');
      }
    }
    if (err.status === 403) return 'No tienes permisos para realizar esta acción.';
    if (err.status === 401) return 'Sesión expirada o inválida. Inicia sesión nuevamente.';
  }
  return porDefecto;
}
