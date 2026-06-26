import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ClpPipe } from '../../shared/pipes/clp.pipe';

/** Carrito de compras: lista de ítems, cantidades editables y total. */
@Component({
  selector: 'app-carrito',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ClpPipe],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  cart = inject(CartService);

  cambiar(productoId: number, stock: number, actual: number, delta: number): void {
    const nueva = Math.max(1, Math.min(actual + delta, stock));
    this.cart.fijarCantidad(productoId, nueva);
  }
}
