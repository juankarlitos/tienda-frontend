import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Indicador de carga con mensaje opcional. */
@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-box">
      <div class="spinner"></div>
      @if (mensaje) { <p>{{ mensaje }}</p> }
    </div>
  `,
})
export class Spinner {
  @Input() mensaje = 'Cargando…';
}
