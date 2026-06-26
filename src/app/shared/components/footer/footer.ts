import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../logo/logo';

/** Pie de página: marca, navegación, contacto y formas de pago. */
@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo],
  template: `
    <footer class="ftr">
      <div class="container ftr__grid">
        <div class="ftr__brand">
          <app-logo [light]="true" />
          <p>Catálogo online. Compra fácil y paga en efectivo o por transferencia cuando te juntes con el vendedor.</p>
        </div>

        <div class="ftr__col">
          <h4>Navegación</h4>
          <a routerLink="/">Catálogo</a>
          <a routerLink="/como-comprar">Cómo comprar</a>
          <a routerLink="/carrito">Carrito</a>
        </div>

        <div class="ftr__col">
          <h4>Contacto</h4>
          <a href="mailto:jc.inostrozach@gmail.com">jc.inostrozach&#64;gmail.com</a>
          <span>Región Metropolitana, Chile</span>
        </div>

        <div class="ftr__col">
          <h4>Formas de pago</h4>
          <div class="ftr__pays">
            <span class="pay">💵 Efectivo</span>
            <span class="pay">🏦 Transferencia</span>
          </div>
          <small>Sin pago en línea. El pago se coordina con el vendedor.</small>
        </div>
      </div>

      <div class="ftr__bottom">
        <div class="container">
          © {{ anio }} InostraTech · Hecho en Chile 🇨🇱
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .ftr { background: #0f1424; color: #cbd2e0; margin-top: 40px; }
    .ftr__grid {
      display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.2fr; gap: 32px;
      padding: 48px 20px 34px;
    }
    .ftr__brand p { margin: 14px 0 0; font-size: .9rem; color: #94a0b8; max-width: 320px; }
    .ftr__col { display: flex; flex-direction: column; gap: 10px; }
    .ftr__col h4 { color: #fff; font-size: .95rem; margin: 0 0 4px; }
    .ftr__col a, .ftr__col span { color: #94a0b8; font-size: .9rem; transition: color .15s ease; }
    .ftr__col a:hover { color: #fff; }
    .ftr__pays { display: flex; flex-wrap: wrap; gap: 8px; }
    .pay {
      background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
      padding: 7px 11px; border-radius: 999px; font-size: .85rem !important; color: #e2e8f0 !important;
    }
    .ftr__col small { color: #6b768f; font-size: .78rem; }
    .ftr__bottom { border-top: 1px solid rgba(255,255,255,.08); padding: 18px 0; font-size: .85rem; color: #6b768f; }
    @media (max-width: 760px) {
      .ftr__grid { grid-template-columns: 1fr 1fr; gap: 26px; padding-top: 36px; }
      .ftr__brand { grid-column: 1 / -1; }
    }
    @media (max-width: 440px) {
      .ftr__grid { grid-template-columns: 1fr; }
    }
  `],
})
export class Footer {
  readonly anio = new Date().getFullYear();
}
