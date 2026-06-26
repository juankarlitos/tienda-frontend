export type Rol = 'ADMIN' | 'USER';

/** Respuesta de login/registro del backend. */
export interface AuthResponse {
  token: string;
  tipo: string;
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

/** Usuario autenticado guardado en el cliente. */
export interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}
