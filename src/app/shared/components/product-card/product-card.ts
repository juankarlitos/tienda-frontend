import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../core/models/producto.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { ClpPipe } from '../../pipes/clp.pipe';

/** Tarjeta de producto para la grilla del catálogo. */
@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ClpPipe],
  template: `
    <article class="pcard fade-in-up">
      <a class="pcard__media" [routerLink]="['/producto', producto.id]">
        @if (producto.imagenUrl) {
          <img [src]="producto.imagenUrl" [alt]="producto.nombre" loading="lazy" />
        } @else {
          <div class="pcard__placeholder">📦</div>
        }
        @if (producto.stock <= 0) {
          <span class="pcard__tag pcard__tag--out">Agotado</span>
        } @else if (producto.stock <= 3) {
          <span class="pcard__tag">¡Últimas {{ producto.stock }}!</span>
        }
      </a>
      <div class="pcard__body">
        @if (producto.categoriaNombre) {
          <span class="pcard__cat">{{ producto.categoriaNombre }}</span>
        }
        <a class="pcard__name" [routerLink]="['/producto', producto.id]">{{ producto.nombre }}</a>
        <div class="pcard__foot">
          <span class="precio pcard__price">{{ producto.precio | clp }}</span>
          <button
            class="btn btn-primary btn-sm pcard__add"
            [disabled]="producto.stock <= 0"
            (click)="agregar()"
            aria-label="Agregar al carrito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .pcard {
      display: flex; flex-direction: column;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
      transition: transform .2s ease, box-shadow .25s ease, border-color .2s ease;
    }
    .pcard:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: transparent; }
    .pcard__media {
      position: relative; aspect-ratio: 4 / 3; background: #f1f1f7;
      display: block; overflow: hidden;
    }
    .pcard__media img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
    .pcard:hover .pcard__media img { transform: scale(1.06); }
    .pcard__placeholder { width: 100%; height: 100%; display: grid; place-items: center; font-size: 3rem; opacity: .5; }
    .pcard__tag {
      position: absolute; top: 10px; left: 10px;
      background: var(--accent); color: #1a1206;
      font-size: .72rem; font-weight: 700; padding: 4px 9px; border-radius: 999px;
    }
    .pcard__tag--out { background: var(--ink); color: #fff; }
    .pcard__body { padding: 14px 15px 16px; display: flex; flex-direction: column; gap: 7px; flex: 1; }
    .pcard__cat { font-size: .72rem; font-weight: 600; color: var(--brand-2); text-transform: uppercase; letter-spacing: .04em; }
    .pcard__name {
      font-weight: 600; font-size: .98rem; color: var(--ink); line-height: 1.3;
      display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      min-height: 2.6em;
    }
    .pcard__name:hover { color: var(--brand-2); }
    .pcard__foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 4px; }
    .pcard__price { font-size: 1.15rem; }
    .pcard__add { padding-inline: 12px; }
    @media (max-width: 420px) {
      .pcard__add span, .pcard__add { font-size: .8rem; }
    }
  `],
})
export class ProductCard {
  @Input({ required: true }) producto!: Producto;
  private cart = inject(CartService);
  private toast = inject(ToastService);

  agregar(): void {
    this.cart.agregar(this.producto);
    this.toast.exito(`"${this.producto.nombre}" agregado al carrito`);
  }
}
