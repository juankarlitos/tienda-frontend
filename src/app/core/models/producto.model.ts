/** Producto tal como lo devuelve el backend. */
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  /** Imagen principal (la primera de la lista), por conveniencia. */
  imagenUrl: string | null;
  /** Todas las imágenes (la primera es la principal). */
  imagenes: string[];
  categoriaId: number | null;
  categoriaNombre: string | null;
  activo: boolean;
  fechaCreacion: string;
}

/** Datos para crear o editar un producto (admin). */
export interface ProductoRequest {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  /** Lista de URLs de imágenes (hasta 10); la primera es la principal. */
  imagenes: string[];
  categoriaId?: number | null;
  activo?: boolean;
}
