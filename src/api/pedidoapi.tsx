const BASE_URL = "https://apicardapiovanburger.onrender.com"; // URL da sua API
import { Pedido } from "../types/Pedidotype";
class PedidoService {
  // Função genérica para chamadas fetch
  async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao realizar a requisição");
      }

      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido");
    }
  }

  // Criar pedido
  async criarPedido(pedidoData: Pedido): Promise<Pedido> {
    return await this.fetchAPI<Pedido>("/pedidos", {
      method: "POST",
      body: JSON.stringify(pedidoData),
    });
  }

  // Encontrar pedido por ID
  async encontrarPorId(pedidoId: string): Promise<Pedido> {
    return await this.fetchAPI<Pedido>(`/pedidos/${pedidoId}`);
  }

  // Encontrar pedidos por telefone
  async encontrarPorTelefone(telefone: string): Promise<Pedido[]> {
    return await this.fetchAPI<Pedido[]>(`/pedidos/telefone/${telefone}`);
  }

  // Atualizar status do pedido
  async atualizarStatus(pedidoId: string, novoStatus: string): Promise<Pedido> {
    return await this.fetchAPI<Pedido>(`/pedidos/${pedidoId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: novoStatus }),
    });
  }

  // Cancelar pedido
  async cancelarPedido(pedidoId: string): Promise<Pedido> {
    return await this.fetchAPI<Pedido>(`/pedidos/${pedidoId}/cancelar`, {
      method: "PUT",
    });
  }

  // Deletar pedido
  async deletarPedido(pedidoId: string): Promise<Pedido> {
    return await this.fetchAPI<Pedido>(`/pedidos/${pedidoId}`, {
      method: "DELETE",
    });
  }

  // Encontrar todos os pedidos
  async encontrarTodos(): Promise<Pedido[]> {
    return await this.fetchAPI<Pedido[]>("/pedidos");
  }

  // Encontrar pedidos por status
  async encontrarPorStatus(status: string): Promise<Pedido[]> {
    return await this.fetchAPI<Pedido[]>(`/pedidos?status=${status}`);
  }
}

export default new PedidoService();
