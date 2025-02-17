import { ObjectId } from "mongodb"; // Importa o tipo ObjectId
import { Productcomquantity } from "../types/Product";
export interface Cliente {
  nome: string;
  telefone: string;
  endereco?: string;
  email?: string;
}

export interface Item {
  name: string; // Nome do item (pizza, bebida, sobremesa, etc.)
  category: string; // Categoria do item (ex: 'pizza', 'bebida', 'sobremesa', etc.)
  description: string; // Descrição detalhada (opcional)
  Quantity: number;
  price: number; // Preço por unidade
  extras?: string[]; // Ingredientes ou complementos adicionais
  observacao?: string;
}

export interface Pagamento {
  forma: "dinheiro" | "cartão" | "PIX" | "transferência" | "vale-presente";
  valorTotal: number;
  valorPago: number;
  cupomDesconto?: string;
  valorDesconto?: number;
}

export interface Pedido {
  cliente: Cliente;
  itens: Item[];
  pagamento: Pagamento;
  status?:
    | "em preparo"
    | "pronto para servir"
    | "cancelado"
    | "entregue"
    | "pendente";
  modoEntrega: "entrega em casa" | "consumo no local";
  mesa?: number;
  dataPedido?: Date; // ISO Date String
  rastreamento?: {
    statusRastreamento: "aguardando" | "em preparo" | "pronto para servir";
    codigoRastreamento?: string;
  };
  horarioEntrega?: Date; // ISO Date String
  _id?: ObjectId;
}
