import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas /admin: solo permite el acceso a usuarios con rol ADMIN.
 * Si no hay sesión redirige a /login; si hay sesión sin permisos, al catálogo.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.esAdmin()) {
    return true;
  }
  if (!auth.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }
  return router.createUrlTree(['/']);
};
