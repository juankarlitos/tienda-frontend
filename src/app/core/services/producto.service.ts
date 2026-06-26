import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoRequest } from '../models/producto.model';

/** Acceso al API de productos. */
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/productos`;

  listar(busqueda?: string, categoriaId?: number | null): Observable<Producto[]> {
    let params = new HttpParams();
    if (busqueda) params = params.set('busqueda', busqueda);
    if (categoriaId) params = params.set('categoriaId', categoriaId);
    return this.http.get<Producto[]>(this.base, { params });
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  crear(datos: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.base, datos);
  }

  actualizar(id: number, datos: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** Sube una imagen y devuelve su URL pública. */
  subirImagen(archivo: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post<{ url: string }>(`${this.base}/imagen`, form);
  }

  /** Sube varias imágenes (hasta 10) y devuelve sus URLs. */
  subirImagenes(archivos: File[]): Observable<{ urls: string[] }> {
    const form = new FormData();
    for (const archivo of archivos) form.append('archivos', archivo);
    return this.http.post<{ urls: string[] }>(`${this.base}/imagenes`, form);
  }
}
