import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Logo } from '../shared/components/logo/logo';

/** Estructura del panel admin: barra lateral de navegación + contenido. */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private router = inject(Router);
  auth = inject(AuthService);
  readonly sidebarAbierto = signal(false);

  toggle(): void { this.sidebarAbierto.update((v) => !v); }
  cerrar(): void { this.sidebarAbierto.set(false); }

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
