import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ConfigPublica { whatsappVendedor: string; }

/**
 * Configuración pública leída del backend (ej: número de WhatsApp del vendedor),
 * para no hardcodearla en el frontend. Se cachea tras la primera carga.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private http = inject(HttpClient);
  readonly whatsappVendedor = signal<string>(environment.whatsappVendedor);

  /** Carga la config del backend; si falla, deja el valor por defecto del environment. */
  cargar(): void {
    this.http.get<ConfigPublica>(`${environment.apiUrl}/api/config`).subscribe({
      next: (c) => { if (c?.whatsappVendedor) this.whatsappVendedor.set(c.whatsappVendedor); },
      error: () => { /* se mantiene el valor por defecto */ },
    });
  }
}
