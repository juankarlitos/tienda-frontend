import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast/toast-container';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ToastContainer],
  template: `
    <router-outlet />
    <app-toast-container />
  `,
  styles: [':host { display: block; }'],
})
export class App {
  constructor() {
    // Carga la configuración pública (ej: WhatsApp del vendedor) al iniciar.
    inject(ConfigService).cargar();
  }
}
