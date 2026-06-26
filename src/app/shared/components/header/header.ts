import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Logo } from '../logo/logo';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

/** Cabecera fija: logo, navegación responsive (hamburguesa) y carrito. */
@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  cart = inject(CartService);
  auth = inject(AuthService);

  readonly menuAbierto = signal(false);

  toggleMenu(): void { this.menuAbierto.update((v) => !v); }
  cerrarMenu(): void { this.menuAbierto.set(false); }

  cerrarSesion(): void {
    this.auth.logout();
    this.cerrarMenu();
    this.router.navigate(['/']);
  }

  /** Cierra el menú móvil al cambiar a escritorio. */
  @HostListener('window:resize')
  alRedimensionar(): void {
    if (window.innerWidth > 860 && this.menuAbierto()) {
      this.cerrarMenu();
    }
  }
}
