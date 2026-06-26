import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatosTransferencia } from '../models/varios.model';

/** Acceso al API de datos de transferencia. */
@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/pago`;

  obtenerTransferencia(): Observable<DatosTransferencia> {
    return this.http.get<DatosTransferencia>(`${this.base}/transferencia`);
  }

  actualizarTransferencia(datos: DatosTransferencia): Observable<DatosTransferencia> {
    return this.http.put<DatosTransferencia>(`${this.base}/transferencia`, datos);
  }
}
