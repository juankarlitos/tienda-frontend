import { Injectable, signal } from '@angular/core';

export type TipoToast = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: TipoToast;
}

/** Notificaciones temporales (toasts) que se muestran arriba a la derecha. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private contador = 0;

  exito(mensaje: string): void { this.mostrar(mensaje, 'success'); }
  error(mensaje: string): void { this.mostrar(mensaje, 'error'); }
  info(mensaje: string): void { this.mostrar(mensaje, 'info'); }

  private mostrar(mensaje: string, tipo: TipoToast): void {
    const id = ++this.contador;
    this.toasts.update((t) => [...t, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), 3500);
  }

  cerrar(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
