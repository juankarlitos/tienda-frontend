import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

/**
 * Rutas de la aplicación. Las páginas se cargan de forma diferida (lazy) para
 * mantener liviano el bundle inicial.
 *
 * - "" usa el layout público (header + footer).
 * - "admin" usa el layout admin (sidebar) y está protegido por adminGuard.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo), title: 'InostraTech — Catálogo' },
      { path: 'producto/:id', loadComponent: () => import('./pages/producto-detalle/producto-detalle').then((m) => m.ProductoDetalle), title: 'Detalle — InostraTech' },
      { path: 'carrito', loadComponent: () => import('./pages/carrito/carrito').then((m) => m.Carrito), title: 'Carrito — InostraTech' },
      { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout), title: 'Finalizar compra — InostraTech' },
      { path: 'como-comprar', loadComponent: () => import('./pages/como-comprar/como-comprar').then((m) => m.ComoComprar), title: 'Cómo comprar — InostraTech' },
      { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login), title: 'Ingresar — InostraTech' },
      { path: 'registro', loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro), title: 'Crear cuenta — InostraTech' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout').then((m) => m.AdminLayout),
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard), title: 'Dashboard — Admin' },
      { path: 'productos', loadComponent: () => import('./pages/admin/productos/admin-productos').then((m) => m.AdminProductos), title: 'Productos — Admin' },
      { path: 'pedidos', loadComponent: () => import('./pages/admin/pedidos/admin-pedidos').then((m) => m.AdminPedidos), title: 'Pedidos — Admin' },
      { path: 'pago', loadComponent: () => import('./pages/admin/pago/admin-pago').then((m) => m.AdminPago), title: 'Datos de pago — Admin' },
    ],
  },
  { path: '**', redirectTo: '' },
];
