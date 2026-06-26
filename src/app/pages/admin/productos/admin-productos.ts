import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { ToastService } from '../../../core/services/toast.service';
import { Producto } from '../../../core/models/producto.model';
import { Spinner } from '../../../shared/components/spinner/spinner';
import { ClpPipe } from '../../../shared/pipes/clp.pipe';
import { mensajeDeError } from '../../../core/utils/errores';

interface OpcionCategoria { id: number; nombre: string; }

const MAX_IMAGENES = 10;

/** Administración de productos: tabla + alta/edición con galería de imágenes. */
@Component({
  selector: 'app-admin-productos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Spinner, ClpPipe],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
})
export class AdminProductos {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private toast = inject(ToastService);

  readonly maxImagenes = MAX_IMAGENES;

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  readonly modalAbierto = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly guardando = signal(false);
  readonly subiendoImagen = signal(false);

  /** Imágenes del producto en edición (la primera es la principal). */
  readonly imagenes = signal<string[]>([]);

  /** Categorías existentes derivadas de los productos (para el selector). */
  readonly categorias = computed<OpcionCategoria[]>(() => {
    const mapa = new Map<number, string>();
    for (const p of this.productos()) {
      if (p.categoriaId && p.categoriaNombre) mapa.set(p.categoriaId, p.categoriaNombre);
    }
    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  });

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [1, [Validators.required, Validators.min(0)]],
    categoriaId: [null as number | null],
    activo: [true],
  });

  constructor() { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.productoService.listar().subscribe({
      next: (data) => { this.productos.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.imagenes.set([]);
    this.form.reset({ nombre: '', descripcion: '', precio: 0, stock: 1, categoriaId: null, activo: true });
    this.modalAbierto.set(true);
  }

  abrirEdicion(p: Producto): void {
    this.editandoId.set(p.id);
    this.imagenes.set([...(p.imagenes ?? [])]);
    this.form.reset({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      precio: p.precio,
      stock: p.stock,
      categoriaId: p.categoriaId,
      activo: p.activo,
    });
    this.modalAbierto.set(true);
  }

  cerrarModal(): void { this.modalAbierto.set(false); }

  /** Sube uno o varios archivos y los agrega a la galería (hasta 10). */
  alSeleccionarArchivos(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivos = input.files ? Array.from(input.files) : [];
    if (!archivos.length) return;

    const disponibles = MAX_IMAGENES - this.imagenes().length;
    if (disponibles <= 0) {
      this.toast.error(`Máximo ${MAX_IMAGENES} imágenes por producto.`);
      input.value = '';
      return;
    }
    const aSubir = archivos.slice(0, disponibles);
    if (archivos.length > disponibles) {
      this.toast.info(`Solo se subirán ${disponibles}; el máximo es ${MAX_IMAGENES}.`);
    }

    this.subiendoImagen.set(true);
    this.productoService.subirImagenes(aSubir).subscribe({
      next: ({ urls }) => {
        this.imagenes.update((act) => [...act, ...urls].slice(0, MAX_IMAGENES));
        this.subiendoImagen.set(false);
        this.toast.exito(urls.length > 1 ? `${urls.length} imágenes subidas` : 'Imagen subida');
      },
      error: (err) => {
        this.subiendoImagen.set(false);
        this.toast.error(mensajeDeError(err, 'No se pudieron subir las imágenes.'));
      },
    });
    input.value = '';
  }

  quitarImagen(index: number): void {
    this.imagenes.update((act) => act.filter((_, i) => i !== index));
  }

  /** Mueve la imagen al inicio para que sea la principal. */
  hacerPrincipal(index: number): void {
    if (index === 0) return;
    this.imagenes.update((act) => {
      const copia = [...act];
      const [img] = copia.splice(index, 1);
      copia.unshift(img);
      return copia;
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    const v = this.form.getRawValue();
    const datos = {
      nombre: v.nombre!,
      descripcion: v.descripcion || null,
      precio: Number(v.precio),
      stock: Number(v.stock),
      categoriaId: v.categoriaId ? Number(v.categoriaId) : null,
      imagenes: this.imagenes(),
      activo: v.activo ?? true,
    };

    const id = this.editandoId();
    const obs = id
      ? this.productoService.actualizar(id, datos)
      : this.productoService.crear(datos);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        this.toast.exito(id ? 'Producto actualizado' : 'Producto creado');
        this.cargar();
      },
      error: (err) => {
        this.guardando.set(false);
        this.toast.error(mensajeDeError(err));
      },
    });
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"? Se ocultará del catálogo.`)) return;
    this.productoService.eliminar(p.id).subscribe({
      next: () => { this.toast.exito('Producto eliminado'); this.cargar(); },
      error: (err) => this.toast.error(mensajeDeError(err)),
    });
  }
}
