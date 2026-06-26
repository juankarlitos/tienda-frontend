import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Producto } from '../../core/models/producto.model';
import { Spinner } from '../../shared/components/spinner/spinner';
import { ClpPipe } from '../../shared/pipes/clp.pipe';
import { mensajeDeError } from '../../core/utils/errores';

/** Página de detalle de un producto. */
@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Spinner, ClpPipe],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private cart = inject(CartService);
  private toast = inject(ToastService);

  readonly producto = signal<Producto | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly cantidad = signal(1);

  /** Imagen mostrada en grande dentro de la galería. */
  readonly imagenActiva = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.obtener(id).subscribe({
      next: (p) => {
        this.producto.set(p);
        this.imagenActiva.set(p.imagenes?.length ? p.imagenes[0] : p.imagenUrl);
        this.cargando.set(false);
      },
      error: (err) => { this.error.set(mensajeDeError(err, 'No se encontró el producto.')); this.cargando.set(false); },
    });
  }

  seleccionarImagen(url: string): void {
    this.imagenActiva.set(url);
  }

  cambiarCantidad(delta: number): void {
    const p = this.producto();
    if (!p) return;
    this.cantidad.update((c) => Math.max(1, Math.min(c + delta, p.stock)));
  }

  agregar(): void {
    const p = this.producto();
    if (!p) return;
    this.cart.agregar(p, this.cantidad());
    this.toast.exito(`"${p.nombre}" agregado al carrito`);
  }
}
