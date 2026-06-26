import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Spinner } from '../../shared/components/spinner/spinner';
import { mensajeDeError } from '../../core/utils/errores';

/** Página principal: hero de bienvenida + buscador + filtro + grilla de productos. */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, ProductCard, Spinner],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  private productoService = inject(ProductoService);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  readonly busqueda = signal('');
  readonly categoriaSel = signal<string | null>(null);

  /** Categorías distintas derivadas de los productos cargados. */
  readonly categorias = computed(() => {
    const set = new Set<string>();
    for (const p of this.productos()) {
      if (p.categoriaNombre) set.add(p.categoriaNombre);
    }
    return Array.from(set).sort();
  });

  /** Productos tras aplicar búsqueda y filtro de categoría (en el cliente). */
  readonly filtrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const cat = this.categoriaSel();
    return this.productos().filter((p) => {
      const coincideTexto = !q || p.nombre.toLowerCase().includes(q)
        || (p.descripcion?.toLowerCase().includes(q) ?? false);
      const coincideCat = !cat || p.categoriaNombre === cat;
      return coincideTexto && coincideCat;
    });
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.productoService.listar().subscribe({
      next: (data) => { this.productos.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }

  seleccionarCategoria(cat: string | null): void {
    this.categoriaSel.set(cat);
  }

  irAProductos(): void {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  }
}
