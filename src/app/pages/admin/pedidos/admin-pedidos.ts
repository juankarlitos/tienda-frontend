import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PedidoService } from '../../../core/services/pedido.service';
import { ToastService } from '../../../core/services/toast.service';
import { ESTADOS_PEDIDO, EstadoPedido, Pedido } from '../../../core/models/pedido.model';
import { Spinner } from '../../../shared/components/spinner/spinner';
import { ClpPipe } from '../../../shared/pipes/clp.pipe';
import { DatePipe } from '@angular/common';
import { mensajeDeError } from '../../../core/utils/errores';

/** Administración de pedidos: lista, detalle y cambio de estado. */
@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Spinner, ClpPipe, DatePipe],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
})
export class AdminPedidos {
  private pedidoService = inject(PedidoService);
  private toast = inject(ToastService);

  readonly pedidos = signal<Pedido[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly seleccionado = signal<Pedido | null>(null);
  readonly cambiandoEstado = signal(false);

  readonly estados = ESTADOS_PEDIDO;

  constructor() { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.pedidoService.listar().subscribe({
      next: (data) => { this.pedidos.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }

  verDetalle(p: Pedido): void { this.seleccionado.set(p); }
  cerrarDetalle(): void { this.seleccionado.set(null); }

  claseEstado(estado: EstadoPedido): string {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'CONFIRMADO': return 'info';
      case 'ENTREGADO': return 'success';
      case 'CANCELADO': return 'danger';
    }
  }

  cambiarEstado(p: Pedido, nuevo: EstadoPedido): void {
    if (nuevo === p.estado) return;
    this.cambiandoEstado.set(true);
    this.pedidoService.cambiarEstado(p.id, nuevo).subscribe({
      next: (actualizado) => {
        this.pedidos.update((lista) => lista.map((x) => x.id === actualizado.id ? actualizado : x));
        if (this.seleccionado()?.id === actualizado.id) this.seleccionado.set(actualizado);
        this.cambiandoEstado.set(false);
        this.toast.exito(`Pedido #${p.id} → ${nuevo}`);
      },
      error: (err) => { this.cambiandoEstado.set(false); this.toast.error(mensajeDeError(err)); },
    });
  }

  alCambiarSelect(p: Pedido, evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value as EstadoPedido;
    this.cambiarEstado(p, valor);
  }
}
