import { Livro } from './livro.model';

export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  PREPARANDO = 'PREPARANDO',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}

export interface ItemPedido {
  id?: number;
  livro: Livro;
  quantidade: number;
  precoUnitario: number;
  subtotal?: number;
}

export interface Pedido {
  id: number;
  numero: string;
  dataPedido: string;
  dataEntregaPrevista: string;
  status: StatusPedido;
  nomeCliente: string;
  emailCliente?: string;
  telefoneCliente?: string;
  enderecoEntrega?: string;
  valorFrete: number;
  valorDesconto: number;
  valorTotal: number;
  observacoes?: string;
  itens: ItemPedido[];
}

export interface PedidoCreate {
  dataPedido: string;
  status: StatusPedido;
  nomeCliente: string;
  emailCliente?: string;
  enderecoEntrega?: string;
  observacoes?: string;
  itens: {
    livro: { id: number };
    quantidade: number;
    preco: number;
  }[];
}

export interface PedidoUpdate extends PedidoCreate {
  id: number;
}