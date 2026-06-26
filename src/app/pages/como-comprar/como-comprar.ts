import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PagoService } from '../../core/services/pago.service';
import { DatosTransferencia } from '../../core/models/varios.model';

/** Página explicativa: cómo comprar y formas de pago, con datos de transferencia. */
@Component({
  selector: 'app-como-comprar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './como-comprar.html',
  styleUrl: './como-comprar.css',
})
export class ComoComprar {
  private pagoService = inject(PagoService);
  readonly transferencia = signal<DatosTransferencia | null>(null);

  constructor() {
    this.pagoService.obtenerTransferencia().subscribe({
      next: (d) => this.transferencia.set(d),
      error: () => { /* opcional */ },
    });
  }
}
