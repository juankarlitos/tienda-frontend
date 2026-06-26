import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PagoService } from '../../../core/services/pago.service';
import { ToastService } from '../../../core/services/toast.service';
import { Spinner } from '../../../shared/components/spinner/spinner';
import { mensajeDeError } from '../../../core/utils/errores';

/** Edición de los datos de transferencia del vendedor. */
@Component({
  selector: 'app-admin-pago',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './admin-pago.html',
  styleUrl: './admin-pago.css',
})
export class AdminPago {
  private fb = inject(FormBuilder);
  private pagoService = inject(PagoService);
  private toast = inject(ToastService);

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  form = this.fb.group({
    bancoNombre: [''],
    tipoCuenta: [''],
    numeroCuenta: [''],
    rutTitular: [''],
    nombreTitular: [''],
    emailTitular: [''],
  });

  constructor() {
    this.pagoService.obtenerTransferencia().subscribe({
      next: (d) => {
        this.form.patchValue({
          bancoNombre: d.bancoNombre ?? '',
          tipoCuenta: d.tipoCuenta ?? '',
          numeroCuenta: d.numeroCuenta ?? '',
          rutTitular: d.rutTitular ?? '',
          nombreTitular: d.nombreTitular ?? '',
          emailTitular: d.emailTitular ?? '',
        });
        this.cargando.set(false);
      },
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }

  guardar(): void {
    this.guardando.set(true);
    this.pagoService.actualizarTransferencia(this.form.getRawValue()).subscribe({
      next: () => { this.guardando.set(false); this.toast.exito('Datos de transferencia guardados'); },
      error: (err) => { this.guardando.set(false); this.toast.error(mensajeDeError(err)); },
    });
  }
}
