export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA';
export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO';

export const ESTADOS_PEDIDO: EstadoPedido[] = [
  'PENDIENTE', 'CONFIRMADO', 'ENTREGADO', 'CANCELADO',
];

/** Línea de un pedido (respuesta del backend). */
export interface ItemPedido {
  id: number;
  productoId: number | null;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

/** Pedido tal como lo devuelve el backend. */
export interface Pedido {
  id: number;
  /** Número de pedido legible, ej: "#00123". */
  numeroPedido: string;
  nombreCliente: string;
  telefonoCliente: string;
  emailCliente: string | null;
  comentario: string | null;
  metodoPago: MetodoPago;
  estado: EstadoPedido;
  total: number;
  items: ItemPedido[];
  fechaCreacion: string;
}

/** Cuerpo para crear un pedido (checkout). */
export interface CrearPedidoRequest {
  nombreCliente: string;
  telefonoCliente: string;
  emailCliente?: string | null;
  comentario?: string | null;
  metodoPago: MetodoPago;
  items: { productoId: number; cantidad: number }[];
}
