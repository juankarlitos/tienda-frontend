import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Logo } from '../../shared/components/logo/logo';
import { mensajeDeError } from '../../core/utils/errores';

/** Inicio de sesión. */
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, Logo],
  templateUrl: './login.html',
  styleUrl: './auth.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  entrar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: (resp) => {
        this.toast.exito(`¡Bienvenido, ${resp.nombre}!`);
        this.router.navigate([resp.rol === 'ADMIN' ? '/admin' : '/']);
      },
      error: (err) => { this.error.set(mensajeDeError(err)); this.enviando.set(false); },
    });
  }
}
