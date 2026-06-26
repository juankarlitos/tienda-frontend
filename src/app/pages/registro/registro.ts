import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Logo } from '../../shared/components/logo/logo';
import { mensajeDeError } from '../../core/utils/errores';

/** Registro de nuevo usuario (rol USER). */
@Component({
  selector: 'app-registro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, Logo],
  templateUrl: './registro.html',
  styleUrl: '../login/auth.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registrar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando.set(true);
    this.error.set(null);

    const { nombre, email, password } = this.form.getRawValue();
    this.auth.registrar({ nombre: nombre!, email: email!, password: password! }).subscribe({
      next: (resp) => {
        this.toast.exito(`¡Cuenta creada! Bienvenido, ${resp.nombre}.`);
        this.router.navigate(['/']);
      },
      error: (err) => { this.error.set(mensajeDeError(err)); this.enviando.set(false); },
    });
  }
}
