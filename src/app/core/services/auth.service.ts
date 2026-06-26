import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse, LoginRequest, RegisterRequest, UsuarioSesion,
} from '../models/auth.model';

const KEY_TOKEN = 'inostratech_token';
const KEY_USER = 'inostratech_user';

/**
 * Maneja la autenticación con JWT. Guarda el token y el usuario en localStorage
 * para mantener la sesión al recargar. Expone señales reactivas del estado.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/auth`;

  /** Usuario actual (null si no hay sesión). */
  readonly usuario = signal<UsuarioSesion | null>(this.leerUsuario());
  readonly estaAutenticado = computed(() => this.usuario() !== null);
  readonly esAdmin = computed(() => this.usuario()?.rol === 'ADMIN');

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, datos)
      .pipe(tap((resp) => this.guardarSesion(resp)));
  }

  registrar(datos: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, datos)
      .pipe(tap((resp) => this.guardarSesion(resp)));
  }

  logout(): void {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    this.usuario.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(KEY_TOKEN);
  }

  private guardarSesion(resp: AuthResponse): void {
    const usuario: UsuarioSesion = {
      id: resp.id, nombre: resp.nombre, email: resp.email, rol: resp.rol,
    };
    localStorage.setItem(KEY_TOKEN, resp.token);
    localStorage.setItem(KEY_USER, JSON.stringify(usuario));
    this.usuario.set(usuario);
  }

  private leerUsuario(): UsuarioSesion | null {
    try {
      const raw = localStorage.getItem(KEY_USER);
      return raw ? (JSON.parse(raw) as UsuarioSesion) : null;
    } catch {
      return null;
    }
  }
}
