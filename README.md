# InostraTech — Frontend (Angular)

Interfaz web de la tienda **InostraTech**: catálogo, carrito, checkout con
comprobante y botón de WhatsApp, y panel de administración. Se conecta a la API
REST del backend (repo `tienda-backend`).

## Stack
- Angular 21 (standalone components, signals, rutas lazy)
- Diseño propio (CSS), mobile-first, sin librerías de UI pesadas
- Autenticación JWT con interceptor + guard de rol ADMIN

## Funcionalidades
- Catálogo con hero, búsqueda y filtro por categoría.
- Detalle de producto con **galería** de imágenes (principal + miniaturas).
- Carrito persistido en `localStorage`.
- Checkout sin pago en línea: genera un **comprobante** (n.º de pedido, detalle,
  total en CLP) + **botón de WhatsApp** prellenado + datos de transferencia.
- Panel admin: dashboard con métricas y gráfico, CRUD de productos con subida de
  **múltiples fotos**, gestión de pedidos y datos de pago.

## Ejecutar en local
Requisitos: **Node.js 20+**.

```bash
npm install
npm start          # equivale a: ng serve
```
Abre `http://localhost:4200`. Necesita el backend corriendo (por defecto en
`http://localhost:8081`).

## Configuración (URL del backend)
La configuración vive en `src/environments/`:
- `environment.ts` → desarrollo (`apiUrl: 'http://localhost:8081'`).
- `environment.prod.ts` → producción. **Antes de desplegar**, cambia `apiUrl`
  por la URL pública del backend en Render, por ejemplo:
  ```ts
  apiUrl: 'https://tu-backend.onrender.com',
  ```

> El número de WhatsApp del vendedor se obtiene del backend (`/api/config`), no
> se hardcodea aquí; el valor en `environment` es solo un respaldo.

No hay claves ni secretos en el frontend.

## Desplegar en Vercel
El repo incluye **`vercel.json`** (build + rewrites para SPA). Pasos:
1. Importa este repo en Vercel (detecta Angular automáticamente).
2. Build Command: `npm run build` · Output: `dist/tienda-frontend/browser`
   (ya definido en `vercel.json`).
3. Asegúrate de haber puesto la URL del backend en `environment.prod.ts`.
4. Deploy. Las rutas profundas (`/admin/...`) funcionan gracias a los *rewrites*.

## Build de producción
```bash
npm run build
# salida en dist/tienda-frontend/browser
```
