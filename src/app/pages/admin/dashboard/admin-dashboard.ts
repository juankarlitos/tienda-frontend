import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Dashboard } from '../../../core/models/varios.model';
import { Spinner } from '../../../shared/components/spinner/spinner';
import { ClpPipe } from '../../../shared/pipes/clp.pipe';
import { mensajeDeError } from '../../../core/utils/errores';

interface BarraVendido { nombre: string; cantidad: number; pct: number; }

/** Dashboard admin: tarjetas de métricas + gráfico de productos más vendidos. */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Spinner, ClpPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private dashboardService = inject(DashboardService);

  readonly data = signal<Dashboard | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  /** Estados con etiqueta y clase de color para las tarjetas. */
  readonly estados = computed(() => {
    const d = this.data();
    const pe = d?.pedidosPorEstado ?? {};
    return [
      { key: 'PENDIENTE', label: 'Pendientes', clase: 'warning', valor: pe['PENDIENTE'] ?? 0 },
      { key: 'CONFIRMADO', label: 'Confirmados', clase: 'info', valor: pe['CONFIRMADO'] ?? 0 },
      { key: 'ENTREGADO', label: 'Entregados', clase: 'success', valor: pe['ENTREGADO'] ?? 0 },
      { key: 'CANCELADO', label: 'Cancelados', clase: 'danger', valor: pe['CANCELADO'] ?? 0 },
    ];
  });

  /** Barras del gráfico, normalizadas al máximo. */
  readonly barras = computed<BarraVendido[]>(() => {
    const lista = this.data()?.productosMasVendidos ?? [];
    const max = Math.max(1, ...lista.map((p) => p.cantidadVendida));
    return lista.map((p) => ({
      nombre: p.nombre,
      cantidad: p.cantidadVendida,
      pct: Math.round((p.cantidadVendida / max) * 100),
    }));
  });

  constructor() { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.dashboardService.obtener().subscribe({
      next: (d) => { this.data.set(d); this.cargando.set(false); },
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }
}
