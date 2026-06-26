import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Logo de la marca "InostraTech": monograma "IT" en un cuadrado con degradado
 * más el wordmark. Usar [light]="true" sobre fondos oscuros.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [class.logo--light]="light">
      <svg class="logo__mark" viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
        <defs>
          <linearGradient [attr.id]="gradId" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7c3aed" />
            <stop offset="1" stop-color="#4f46e5" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" [attr.fill]="'url(#' + gradId + ')'" />
        <path d="M22 20h4v24h-4z" fill="#fff" />
        <path d="M30 20h14v4h-5v20h-4V24h-5z" fill="#fff" />
      </svg>
      <span class="logo__text">Inostra<span class="logo__accent">Tech</span></span>
    </span>
  `,
  styles: [`
    .logo { display: inline-flex; align-items: center; gap: 10px; }
    .logo__mark { flex: none; filter: drop-shadow(0 4px 8px rgba(79,70,229,.3)); }
    .logo__text {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -.02em;
      color: var(--ink);
    }
    .logo__accent { color: var(--brand-2); }
    .logo--light .logo__text { color: #fff; }
    .logo--light .logo__accent { color: #c4b5fd; }
  `],
})
export class Logo {
  @Input() light = false;
  /** Id único del degradado para evitar colisiones si hay varios logos. */
  readonly gradId = 'logo-grad-' + Math.random().toString(36).slice(2, 8);
}
