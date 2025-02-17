import React, { useState } from "react";
import PedidoService from "../api/pedidoapi"; // Substitua pelo caminho correto
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../pages/styleinfo.css";
import { FaArrowLeft } from "react-icons/fa";
import logovanburger from "../assets/logovanburger.jpeg";
import { Item, Pedido } from "../types/Pedidotype";

const BuscarPedidos: React.FC = () => {
  const [telefone, setTelefone] = useState("");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const history = useNavigate();
  const backmenu = () => history("/");

  const buttonStyle = {
    backgroundColor: "#f8ae30", // Cor principal do botão
    color: "#000", // Cor do texto
    border: "none", // Sem borda
    borderRadius: "25px", // Bordas arredondadas
    padding: "10px 20px", // Espaçamento interno
    fontSize: "16px", // Tamanho da fonte
    fontWeight: "bold", // Texto em negrito
    cursor: "pointer", // Alteração do cursor para pointer
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra leve
    transition: "all 0.3s ease", // Suavidade para o hover
    width: "80%",
  };

  const inputStyle = {
    width: "80%", // Largura total do container pai
    padding: "12px 16px", // Espaçamento interno confortável
    fontSize: "16px", // Tamanho da fonte
    border: "1px solid #ccc", // Borda inicial
    borderRadius: "25px", // Bordas arredondadas
    outline: "none", // Remove o estilo padrão de foco
    transition: "all 0.3s ease", // Suavidade para o efeito de foco
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra leve
    marginBottom: "10px",
  };

  // Função para aplicar máscara progressiva
  const formatarTelefoneProgressivo = (valor: string): string => {
    const somenteNumeros = valor.replace(/\D/g, ""); // Remove tudo que não é número

    if (somenteNumeros.length === 0) return ""; // Nenhum número
    if (somenteNumeros.length <= 2) return `(${somenteNumeros}`; // Formato: (XX
    if (somenteNumeros.length <= 6)
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2)}`; // Formato: (XX) XXXX
    if (somenteNumeros.length <= 10)
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
        2,
        6
      )}-${somenteNumeros.slice(6)}`; // Formato: (XX) XXXX-XXXX
    return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
      2,
      7
    )}-${somenteNumeros.slice(7, 11)}`; // Formato: (XX) XXXXX-XXXX
  };

  // Atualizar o valor do telefone
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarTelefoneProgressivo(e.target.value);
    setTelefone(valorFormatado);
  };

  // Validação de formato de telefone
  const validarTelefone = (telefone: string): boolean => {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/; // Exemplo: (99) 99999-9999
    return telefoneRegex.test(telefone);
  };

  const cancelarPedido = async (pedidoId: string, pedidoDetalhado: Pedido) => {
    try {
      const cancelarpedido = await PedidoService.cancelarPedido(pedidoId);
      toast.success(`Pedido cancelado com sucesso! id ${cancelarpedido}`);
      buscarPedidos();
      // Envia mensagem para o WhatsApp com mais detalhes
      const mensagem = `
           📌 *Atualização de Pedido - Vanburguer Pizzaria e Lanchonete* 📌
           
           🆔 *ID do Pedido:* ${pedidoId}
           📅 *Status Atualizado:* Cancelado
           
           👤 *Cliente:* ${pedidoDetalhado.cliente.nome}
           📞 *Telefone:* ${pedidoDetalhado.cliente.telefone}
           📍 *Modo de Entrega:* ${pedidoDetalhado.modoEntrega}
           ${
             pedidoDetalhado.modoEntrega === "consumo no local"
               ? `🪑 *Mesa:* ${pedidoDetalhado.mesa}`
               : `🏠 *Endereço:* ${
                   pedidoDetalhado.cliente.endereco || "Não informado"
                 }`
           }
           
           🛒 *Itens do Pedido:*
           ${pedidoDetalhado.itens
             .map(
               (item) =>
                 `- ${item.Quantity}x *${item.name}* (${
                   item.category
                 }) - R$ ${item.price.toFixed(2)} ${
                   item.observacao ? `(Obs: ${item.observacao})` : ""
                 }`
             )
             .join("\n")}
           
           💳 *Forma de Pagamento:* ${pedidoDetalhado.pagamento.forma}
           💰 *Valor Total:* R$ ${pedidoDetalhado.pagamento.valorTotal.toFixed(
             2
           )}
           
           Obrigado por escolher a Vanburguer Pizzaria e Lanchonete! Estamos à disposição para atender você. 🍕🍔
           `.trim();

      // Codificar mensagem e montar URL
      const numeroRestaurante = "5585985192579"; // Substitua pelo número do restaurante
      const urlWhatsApp = `https://wa.me/${numeroRestaurante}?text=${encodeURIComponent(
        mensagem
      )}`;

      // Abrir WhatsApp em uma nova aba
      window.open(urlWhatsApp, "_blank");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Mensagem de erro:", err.message);
      } else {
        console.error("Erro desconhecido:", err);
      }
    }
  };

  // Função para exibir os itens como uma string
  const exibirItens = (itens: Item[]) => {
    return itens.map((item) => (
      <div key={item.name}>
        <strong>{item.name}</strong>
        <br />
        <span>Categoria: {item.category}</span>
        <br />
        <span>Descrição: {item.description}</span>
        <br />
        <span>Quantidade: {item.Quantity}</span>
        <br />
        <span>Preço: R$ {item.price.toFixed(2)}</span>
        <br />
        <span>Observação: {item.observacao}</span>
        <br />
        <br />
      </div>
    ));
  };

  // Wrapping em uma função síncrona para evitar o erro de `Promise<void>`
  const handleCancelar = (pedidoId: string, pedidoDetalhado: Pedido) => {
    cancelarPedido(pedidoId, pedidoDetalhado).catch((err) => {
      console.error("Erro inesperado ao cancelar o pedido:", err);
      toast.error("Erro inesperado ao cancelar o pedido.");
    });
  };

  const buscarPedidos = async () => {
    if (!telefone) {
      toast.error("Por favor, insira o número de telefone.");
      return;
    }

    if (!validarTelefone(telefone)) {
      toast.error("Telefone inválido. Use o formato: (99) 99999-9999.");
      return;
    }

    try {
      const pedidosEncontrados = await PedidoService.encontrarPorTelefone(
        telefone
      );

      if (pedidosEncontrados.length === 0) {
        toast.info("Nenhum pedido encontrado para este número de telefone.");
      } else {
        setPedidos(pedidosEncontrados);
        toast.success(`${pedidosEncontrados.length} pedido(s) encontrado(s).`);
      }
    } catch (error) {
      toast.error("Erro ao buscar pedidos. Tente novamente mais tarde.");
      console.error(error);
    }
  };

  return (
    <div className="containermt-5">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={logovanburger} alt="Logo VanBurger" width={95} />
        <h1>Buscar Pedidos</h1>
      </div>

      {/* Campo para número de telefone */}
      <div className="mb-3">
        <label htmlFor="telefone">Número de Telefone</label>
        <input
          style={inputStyle}
          type="text"
          id="telefone"
          className="form-control"
          placeholder="(99) 99999-9999"
          value={telefone}
          onChange={handleTelefoneChange} // Aplicando a máscara progressiva
          maxLength={15} // Limita a quantidade máxima de caracteres
        />
      </div>

      {/* Botão de buscar */}
      <button
        className="btn btn-primary mb-3"
        style={buttonStyle}
        onClick={buscarPedidos}
      >
        Buscar Pedidos
      </button>

      {/* Lista de pedidos encontrados */}
      <div>
        <h3>Resultados</h3>
        {pedidos.length > 0 ? (
          <ul className="list-group menu-list">
            {pedidos.map((pedido, index) => (
              <li key={index} className="list-group-item menu-item">
                <p>
                  <strong>Data do Pedido:</strong>
                  {pedido.dataPedido
                    ? new Date(pedido.dataPedido).toLocaleString("pt-BR", {
                        weekday: "long", // Opcional: dia da semana (ex: "segunda-feira")
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      })
                    : "Data não informada"}
                </p>
                <p>
                  <strong>ID do Pedido:</strong> {pedido._id}
                </p>
                <p>
                  <strong>Cliente:</strong> {pedido.cliente.nome}
                </p>
                <p>
                  <strong>Telefone:</strong> {pedido.cliente.telefone}
                </p>
                <p>
                  <strong>Status:</strong> {pedido.status}
                </p>
                <p>
                  <strong>Observação:</strong>
                  {exibirItens(pedido.itens)}{" "}
                </p>
                <p>
                  <strong>Total:</strong> R${" "}
                  {pedido.pagamento.valorTotal.toFixed(2)}
                </p>
                <button
                  className="btn btn-primary"
                  style={buttonStyle}
                  disabled={
                    pedido.status === "pronto para servir" ||
                    pedido.status === "entregue" ||
                    pedido.status === "cancelado"
                  }
                  onClick={() => handleCancelar(pedido._id, pedido)}
                >
                  <FaTrash /> Cancelar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum pedido listado.</p>
        )}
      </div>
      <button
        className="btn btn-secondary"
        style={buttonStyle}
        onClick={backmenu}
      >
        <FaArrowLeft /> Voltar ao Menu
      </button>

      <footer
        className="footercart"
        style={{
          marginTop: "5px",
          color: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "9px",
        }}
      >
        <p>
          &copy; 2024 Van Burger Pizzaria e Lanchonete. Todos os direitos
          reservados.
        </p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default BuscarPedidos;
