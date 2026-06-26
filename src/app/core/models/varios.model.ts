import { Producto } from './producto.model';

/** Datos de transferencia del vendedor. */
export interface DatosTransferencia {
  bancoNombre: string | null;
  tipoCuenta: string | null;
  numeroCuenta: string | null;
  rutTitular: string | null;
  nombreTitular: string | null;
  emailTitular: string | null;
}

/** Métricas del dashboard admin. */
export interface Dashboard {
  totalVentas: number;
  totalPedidos: number;
  ingresosDelMes: number;
  pedidosPorEstado: Record<string, number>;
  productosMasVendidos: { nombre: string; cantidadVendida: number }[];
}

/** Ítem del carrito (estado solo del frontend). */
export interface CartItem {
  producto: Producto;
  cantidad: number;
}
