import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

/** Muestra los toasts apilados en la esquina superior derecha. */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-wrap">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast toast--{{ t.tipo }}" (click)="toastService.cerrar(t.id)">
          <span class="toast__icon">
            @switch (t.tipo) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @default { ℹ }
            }
          </span>
          <span>{{ t.mensaje }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-wrap {
      position: fixed; top: calc(var(--header-h) + 12px); right: 16px;
      z-index: 1000; display: flex; flex-direction: column; gap: 10px;
      max-width: min(360px, calc(100vw - 32px));
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 13px 16px; border-radius: 12px; cursor: pointer;
      background: #fff; color: var(--ink);
      box-shadow: var(--shadow-lg); border: 1px solid var(--border);
      font-size: .9rem; font-weight: 500;
      animation: toastIn .3s ease both;
    }
    .toast__icon {
      flex: none; width: 24px; height: 24px; border-radius: 50%;
      display: grid; place-items: center; color: #fff; font-size: .8rem; font-weight: 700;
    }
    .toast--success { border-left: 4px solid var(--success); }
    .toast--success .toast__icon { background: var(--success); }
    .toast--error { border-left: 4px solid var(--danger); }
    .toast--error .toast__icon { background: var(--danger); }
    .toast--info { border-left: 4px solid var(--info); }
    .toast--info .toast__icon { background: var(--info); }
    @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
  `],
})
export class ToastContainer {
  toastService = inject(ToastService);
}
