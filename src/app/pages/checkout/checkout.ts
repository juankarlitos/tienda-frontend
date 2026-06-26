import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { PedidoService } from '../../core/services/pedido.service';
import { PagoService } from '../../core/services/pago.service';
import { ConfigService } from '../../core/services/config.service';
import { ToastService } from '../../core/services/toast.service';
import { Pedido } from '../../core/models/pedido.model';
import { DatosTransferencia } from '../../core/models/varios.model';
import { ClpPipe } from '../../shared/pipes/clp.pipe';
import { mensajeDeError } from '../../core/utils/errores';

/** Checkout: formulario del pedido + comprobante con WhatsApp y transferencia. */
@Component({
  selector: 'app-checkout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, ClpPipe, DatePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private fb = inject(FormBuilder);
  cart = inject(CartService);
  private pedidoService = inject(PedidoService);
  private pagoService = inject(PagoService);
  private config = inject(ConfigService);
  private toast = inject(ToastService);

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly pedido = signal<Pedido | null>(null);
  readonly transferencia = signal<DatosTransferencia | null>(null);

  /** Link de WhatsApp con el detalle del pedido (se calcula al confirmar). */
  readonly whatsappUrl = computed(() => {
    const p = this.pedido();
    if (!p) return '';
    return this.construirLinkWhatsApp(p);
  });

  form = this.fb.group({
    nombreCliente: ['', [Validators.required]],
    telefonoCliente: ['', [Validators.required]],
    emailCliente: ['', [Validators.email]],
    metodoPago: ['EFECTIVO', [Validators.required]],
    comentario: [''],
  });

  constructor() {
    // Precarga los datos de transferencia para mostrarlos al confirmar.
    this.pagoService.obtenerTransferencia().subscribe({
      next: (d) => this.transferencia.set(d),
      error: () => { /* no es crítico para el checkout */ },
    });
  }

  esTransferencia(): boolean {
    return this.form.controls.metodoPago.value === 'TRANSFERENCIA';
  }

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.cart.items().length === 0) {
      this.error.set('Tu carrito está vacío.');
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    this.pedidoService.crear({
      nombreCliente: v.nombreCliente!,
      telefonoCliente: v.telefonoCliente!,
      emailCliente: v.emailCliente || null,
      comentario: v.comentario || null,
      metodoPago: v.metodoPago as 'EFECTIVO' | 'TRANSFERENCIA',
      items: this.cart.items().map((it) => ({ productoId: it.producto.id, cantidad: it.cantidad })),
    }).subscribe({
      next: (pedido) => {
        this.pedido.set(pedido);
        this.cart.vaciar();
        this.enviando.set(false);
        this.toast.exito('¡Pedido confirmado!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.enviando.set(false);
      },
    });
  }

  private construirLinkWhatsApp(p: Pedido): string {
    // Mensaje en texto plano (sin emojis) para que se vea limpio en cualquier
    // dispositivo. WhatsApp interpreta *texto* como negrita.
    const L: string[] = [];
    L.push(`*Pedido ${p.numeroPedido}* - InostraTech`);
    L.push('');
    L.push('*Productos:*');
    for (const it of p.items) {
      L.push(`- ${it.cantidad} x ${it.nombreProducto}`);
      L.push(`   ${this.clp(it.precioUnitario)} c/u = ${this.clp(it.subtotal)}`);
    }
    L.push('');
    L.push(`*TOTAL: ${this.clp(p.total)}*`);
    L.push(`Pago: ${p.metodoPago === 'TRANSFERENCIA' ? 'Transferencia' : 'Efectivo'}`);
    L.push('');
    L.push('*Mis datos:*');
    L.push(`Nombre: ${p.nombreCliente}`);
    L.push(`Telefono: ${p.telefonoCliente}`);
    if (p.emailCliente) L.push(`Email: ${p.emailCliente}`);
    if (p.comentario) L.push(`Comentario: ${p.comentario}`);
    L.push('');
    L.push('Quedo atento para coordinar lugar y hora de entrega. Gracias!');

    const texto = encodeURIComponent(L.join('\n'));
    return `https://wa.me/${this.config.whatsappVendedor()}?text=${texto}`;
  }

  private clp(valor: number): string {
    return '$ ' + Math.round(valor).toLocaleString('es-CL');
  }
}
