import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea un monto en pesos chilenos: 19990 -> "$ 19.990".
 * Sin decimales y con punto como separador de miles.
 */
@Pipe({ name: 'clp' })
export class ClpPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return '$ 0';
    }
    const entero = Math.round(valor);
    return '$ ' + entero.toLocaleString('es-CL');
  }
}
