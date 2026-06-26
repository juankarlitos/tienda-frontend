import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem } from '../models/varios.model';
import { Producto } from '../models/producto.model';

const KEY_CART = 'inostratech_cart';

/**
 * Carrito de compras. El estado vive en señales y se persiste en localStorage
 * para que no se pierda al recargar la página.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  /** Ítems del carrito. */
  readonly items = signal<CartItem[]>(this.leer());

  /** Cantidad total de unidades (para el contador del header). */
  readonly cantidadTotal = computed(() =>
    this.items().reduce((acc, it) => acc + it.cantidad, 0));

  /** Monto total del carrito. */
  readonly montoTotal = computed(() =>
    this.items().reduce((acc, it) => acc + it.producto.precio * it.cantidad, 0));

  constructor() {
    // Persiste automáticamente cada vez que cambian los ítems.
    effect(() => {
      localStorage.setItem(KEY_CART, JSON.stringify(this.items()));
    });
  }

  /** Agrega un producto (o suma cantidad si ya está), respetando el stock. */
  agregar(producto: Producto, cantidad = 1): void {
    this.items.update((items) => {
      const existente = items.find((it) => it.producto.id === producto.id);
      if (existente) {
        const nueva = Math.min(existente.cantidad + cantidad, producto.stock);
        return items.map((it) =>
          it.producto.id === producto.id ? { ...it, cantidad: nueva } : it);
      }
      return [...items, { producto, cantidad: Math.min(cantidad, producto.stock) }];
    });
  }

  /** Fija la cantidad exacta de un producto (entre 1 y su stock). */
  fijarCantidad(productoId: number, cantidad: number): void {
    this.items.update((items) =>
      items.map((it) => {
        if (it.producto.id !== productoId) return it;
        const c = Math.max(1, Math.min(cantidad, it.producto.stock));
        return { ...it, cantidad: c };
      }));
  }

  quitar(productoId: number): void {
    this.items.update((items) => items.filter((it) => it.producto.id !== productoId));
  }

  vaciar(): void {
    this.items.set([]);
  }

  private leer(): CartItem[] {
    try {
      const raw = localStorage.getItem(KEY_CART);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
