import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrearPedidoRequest, EstadoPedido, Pedido } from '../models/pedido.model';

/** Acceso al API de pedidos. */
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/pedidos`;

  crear(datos: CrearPedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.base, datos);
  }

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.base);
  }

  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.base}/${id}`);
  }

  cambiarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.base}/${id}/estado`, { estado });
  }
}
