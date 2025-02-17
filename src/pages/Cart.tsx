import React, { useState, ChangeEvent, useEffect } from "react";
import PedidoService from "../api/pedidoapi";
import { useCart } from "../components/CartContext";
import { Pedido } from "../types/Pedidotype";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ObjectId } from "mongodb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { SiPix } from "react-icons/si";
import { FaCcMastercard, FaUtensils, FaCarSide } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import logovanburger from "../assets/LogoClassyConceito.jpeg";
import {
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaCartArrowDown,
  FaInfoCircle,
  FaSearch,
  FaBars,
  FaLocationArrow,
  FaFacebook,
  FaTshirt,
} from "react-icons/fa";
import "../pages/stylesdetails.css";

// Tipagem para as sugestões de endereço
interface Suggestion {
  place_id: string;
  display_name: string;
  address: {
    road?: string; // Rua
    house_number?: string; // Número
    suburb?: string; // Bairro
    city?: string; // Cidade
    state?: string; // Estado
    country?: string; // País
  };
}

// Tipos para coordenadas e resultado da entrega
interface Coordenadas {
  lat: number;
  lon: number;
}

interface ResultadoEntrega {
  distancia: string; // Distância em km (com duas casas decimais)
  precoEntrega: string; // Preço da entrega formatado
}

const Carrinho: React.FC = () => {
  const [cliente, setCliente] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    email: "",
    observacoes: "",
  });

  const history = useNavigate();
  const navigate = useNavigate();
  const [modoEntrega, setModoEntrega] = useState<
    "entrega em casa" | "consumo no local"
  >("entrega em casa");
  const [mesa, setMesa] = useState<number | undefined>(undefined);
  const [formaPagamento, setFormaPagamento] = useState<
    "dinheiro" | "cartão" | "PIX" | "transferência" | "vale-presente"
  >("dinheiro");
  const { cart, clearCart, removeFromCart } = useCart();
  console.log("cart" + JSON.stringify(cart));
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const backmenu = () => history("/");
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Controlar a visibilidade do dropdown
  const [errorMessage, setErrorMessage] = useState(""); // Armazenar mensagem de erro
  const [entrega, setEntrega] = useState<ResultadoEntrega | null>(null);
  const [showInput, setShowInput] = useState(false); // Estado para controlar visibilidade do input
  const [showBars, setShowBars] = useState(false); // Estado para controlar visibilidade do input

  const irCart = () => {
    navigate("/Carrinho");
  };

  const irhome = (category: string) => {
    navigate("/");
    scrollToCategory(category);
  };

  // Rola para a categoria específica
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleInput = () => {
    setShowInput((prev) => !prev); // Alterna entre mostrar e esconder
  };

  const toggleBars = () => {
    setShowBars((prev) => !prev); // Alterna entre mostrar e esconder
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value; // Remove espaços em branco nas extremidades
    setCliente({ ...cliente, endereco: newQuery }); // Atualiza o estado do cliente

    if (newQuery.length > 3) {
      try {
        console.log(`Fazendo requisição para o endereço: ${newQuery}`);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${newQuery}, Ceará&addressdetails=1&limit=5`
        );

        console.log("Status da requisição:", response.status); // Verificar status da requisição

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data: Suggestion[] = await response.json();
        console.log("Dados retornados da API:", data); // Verificar dados retornados

        if (data.length > 0) {
          const numero =
            data[0]?.address?.house_number || "Número não encontrado";
          const enderecoCompleto = `${data[0].display_name}, ${numero}`;
          setSuggestions(data); // Atualiza sugestões com os dados recebidos
          setDropdownVisible(true); // Mostrar sugestões
          setErrorMessage("");
        } else {
          setSuggestions([]); // Limpar sugestões se nenhum dado for encontrado
          setDropdownVisible(false); // Esconder sugestões
        }
      } catch (error) {
        console.error("Erro ao buscar os endereços:", error);
        setErrorMessage(
          "Erro ao buscar endereços. Tente novamente mais tarde."
        );
        toast.error("Erro ao buscar endereços. Tente novamente mais tarde.");
      }

      // Limpar o intervalo se a pesquisa for desativada ou o componente for desmontado
    } else {
      setSuggestions([]); // Limpar sugestões se o campo for muito curto
      setDropdownVisible(false); // Esconder o dropdown
    }
  };

  // Função para validar se o endereço possui os campos necessários
  const isValidAddress = (address: Suggestion) => {
    return (
      address.address.road &&
      address.address.house_number &&
      address.address.city &&
      address.address.state
    );
  };

  // Função para lidar com a seleção de um endereço
  const handleSelectEndereco = (selectedAddress: Suggestion) => {
    // Verificar se o endereço contém os campos necessários
    if (isValidAddress(selectedAddress)) {
      // Formatar o endereço completo com os dados disponíveis
      const formattedAddress = [
        selectedAddress.address.road,
        selectedAddress.address.house_number,
        selectedAddress.address.suburb,
        selectedAddress.address.city,
        selectedAddress.address.state,
      ]
        .filter(Boolean) // Filtra valores nulos ou undefined
        .join(", "); // Junta as partes do endereço com uma vírgula

      setCliente({
        ...cliente,
        endereco: formattedAddress, // Preenche o campo de endereço com o formato completo
      });
      setSuggestions([]); // Limpar sugestões após a seleção
      setDropdownVisible(false); // Esconder sugestões
      setErrorMessage(""); // Limpar mensagem de erro
    } else {
      // Caso o endereço não tenha os campos necessários, exibir uma mensagem de erro
      toast.error(
        "Endereço inválido! Certifique-se de incluir rua, número, cidade e estado."
      );
    }
  };

  // Função para evitar o fechamento do dropdown quando o mouse estiver sobre ele
  const handleDropdownMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    e.preventDefault(); // Impede o fechamento imediato do dropdown
  };

  const buttonStyle = {
    backgroundColor: "#44362a", // Cor principal do botão
    color: "#e2bdb1", // Cor do texto
    border: "none", // Sem borda
    borderRadius: "25px", // Bordas arredondadas
    padding: "10px 20px", // Espaçamento interno
    fontSize: "16px", // Tamanho da fonte
    fontWeight: "bold", // Texto em negrito
    cursor: "pointer", // Alteração do cursor para pointer
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra leve
    transition: "all 0.3s ease", // Suavidade para o hover
  };

  const radioStyle = {
    appearance: "none", // Remove o estilo padrão
    width: "20px", // Tamanho do rádio
    height: "20px", // Tamanho do rádio
    borderRadius: "50%", // Forma circular
    border: "2px solid #ccc", // Cor de borda padrão
    backgroundColor: "#fff", // Fundo branco
    cursor: "pointer", // Cursor de pointer
    transition: "all 0.3s ease", // Transição suave
    display: "inline-block",
    position: "relative", // Para permitir o posicionamento do "check"
  };

  const inputStyle = {
    width: "80%", // Largura total do container pai
    padding: "12px 16px", // Espaçamento interno confortável
    fontSize: "16px", // Tamanho da fonte
    border: "1px solid #ccc", // Borda inicial

    outline: "none", // Remove o estilo padrão de foco
    transition: "all 0.3s ease", // Suavidade para o efeito de foco
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra leve
  };

  const handleremove = (id: ObjectId) => {
    removeFromCart(id);
    toast.success("Produto removido do carrinho!");
  };

  const calcularTotal = () => {
    const totalcart = cart.reduce(
      (total, item) => total + item.price * item.Quantity,
      0
    ); // Calcula o total do carrinho
    const precoEntrega = Number(entrega?.precoEntrega) + 9 || 0; // Converte precoEntrega para número, garantindo 0 se for undefined
    const total = totalcart + precoEntrega; // Soma o total do carrinho com o preço da entrega

    return total.toFixed(2); // Formata o total final com duas casas decimais
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
    setCliente({ ...cliente, telefone: valorFormatado });
  };

  // Validação de formato de telefone
  const validarTelefone = (telefone: string): boolean => {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/; // Exemplo: (99) 99999-9999
    return telefoneRegex.test(telefone);
  };

  const validarEndereco = (endereco: string): boolean => {
    // Regex para validar um endereço no formato básico
    const regex =
      /^[\w\sáàãâéèíóôúç,.-]+,\s?\d{1,5},\s?[\w\s]+,\s?[\w\s]+(?:,\s?[\w\s]+)?$/;
    return regex.test(endereco);
  };

  const validarDadosCliente = (): boolean => {
    if (!cliente.nome.trim()) {
      toast.error("Por favor, preencha o nome.");
      return false;
    }
    if (!cliente.nome.trim().includes(" ")) {
      toast.error("Por favor, preencha o nome completo.");
      return false;
    }
    if (
      !cliente.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)
    ) {
      toast.error("Por favor, insira um email válido.");
      return false;
    }
    if (modoEntrega === "entrega em casa") {
      if (!cliente.endereco.trim()) {
        toast.error("Por favor, preencha o endereço para entrega.");
        return false;
      }
      if (!validarEndereco(cliente.endereco.trim())) {
        toast.error(
          "Por favor, insira um endereço no formato: Rua, Número, Bairro, Cidade."
        );
        return false;
      }
    }
    if (modoEntrega === "consumo no local" && (!mesa || mesa <= 0)) {
      toast.error("Por favor, insira um número de mesa válido.");
      return false;
    }
    return true;
  };

  // Função para calcular a distância usando a fórmula de Haversine
  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Raio da Terra em quilômetros
    const rad = (grau: number) => (grau * Math.PI) / 180; // Converte graus para radianos

    const dLat = rad(lat2 - lat1); // Diferença de latitude
    const dLon = rad(lon2 - lon1); // Diferença de longitude

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em quilômetros
  };

  // Função para obter coordenadas usando a API Nominatim
  const obterCoordenadas = async (endereco: string): Promise<Coordenadas> => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      endereco
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error("Endereço não encontrado");
    }
  };

  // Função principal para calcular a distância e o preço da entrega
  const calcularEntrega = async (
    enderecoRestaurante: string,
    enderecoCliente: string,
    precoPorKm: number
  ): Promise<ResultadoEntrega> => {
    try {
      const coordRestaurante = await obterCoordenadas(enderecoRestaurante);
      const coordCliente = await obterCoordenadas(enderecoCliente);

      const distancia = calcularDistancia(
        coordRestaurante.lat,
        coordRestaurante.lon,
        coordCliente.lat,
        coordCliente.lon
      );

      const precoEntrega = distancia * precoPorKm;
      return {
        distancia: distancia.toFixed(2),
        precoEntrega: precoEntrega.toFixed(2),
      };
    } catch (error) {
      console.error("Erro ao calcular a entrega:", error);
      throw error;
    }
  };

  const handleCalcular = async () => {
    try {
      const resultado = await calcularEntrega(
        "Avenida Filomeno Gomes, 430, Jacarecanga, Fortaleza, Ceará",
        cliente.endereco,
        3
      );
      setEntrega(resultado);
      toast.success("entrega calculada com sucesso.");
      setDropdownVisible(false);
    } catch (error) {
      toast.error(
        "Não foi possível calcular a entrega. Verifique os endereços."
      );
    }
  };

  const finalizarPedido = async () => {
    if (!validarDadosCliente()) return;
    if (!validarTelefone(cliente.telefone)) return;

    const pedido: Pedido = {
      cliente,
      itens: cart.map((item) => ({
        name: item.name,
        category: item.category,
        description: item.description,
        Quantity: item.Quantity,
        price: item.price,
        observacao: item.observacao,
      })),
      modoEntrega,
      mesa: modoEntrega === "consumo no local" ? mesa : undefined,
      pagamento: {
        forma: formaPagamento,
        valorTotal: Number(calcularTotal()),
        valorPago: 0,
      },
      status: "pendente",
    };

    try {
      const novoPedido = await PedidoService.criarPedido(pedido);
      toast.success(`Pedido criado com sucesso! ID: ${novoPedido._id}`);

      // Preparar mensagem profissional para WhatsApp
      const mensagem = `
  📌 *Novo Pedido - Classy Conceito | Moda Femenina* 📌
  
  👤 *Cliente:* ${cliente.nome}
  📞 *Telefone:* ${cliente.telefone}
  📍 *Modo de Entrega:* ${modoEntrega}
  ${
    modoEntrega === "consumo no local"
      ? `🪑 *Mesa:* ${mesa}`
      : `🏠 *Endereço:* ${cliente.endereco || "Não informado"}`
  }
  
  🛒 *Itens do Pedido:*
  ${cart
    .map(
      (item) =>
        `- ${item.Quantity}x *${item.name}* ${item.color} ${item.Tamanho} (${
          item.category
        }) - R$ ${item.price.toFixed(2)}`
    )
    .join("\n")}
  
  💳 *Forma de Pagamento:* ${formaPagamento}
  💰 *Valor Total:* R$ ${calcularTotal()}
  
  📅 *Data do Pedido:* ${new Date().toLocaleString("pt-BR")}
  
  Obrigado pela preferência!
  `.trim();

      // Codificar mensagem e montar URL
      const numeroRestaurante = "5585982124626"; // Substitua pelo número do restaurante
      const urlWhatsApp = `https://wa.me/${numeroRestaurante}?text=${encodeURIComponent(
        mensagem
      )}`;

      // Abrir WhatsApp em uma nova aba
      window.open(urlWhatsApp, "_blank");

      // Limpar formulário e carrinho
      clearCart();
      setCliente({
        nome: "",
        telefone: "",
        endereco: "",
        email: "",
        observacoes: "",
      });
      setEntrega(null);
      setMesa(undefined);
      setFormaPagamento("dinheiro");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Mensagem de erro:", err.message);
      } else {
        console.error("Erro desconhecido:", err);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="Container-principal">
          <div className="header-buttons10">
            <button onClick={toggleInput} className="header-button">
              {showInput ? (
                <FaSearch color="#e2bdb1" />
              ) : (
                <FaSearch color="#e2bdb1" />
              )}
            </button>
          </div>
          <div className="header-buttons11">
            <button onClick={toggleBars} className="header-button">
              {showInput ? (
                <FaBars color="#e2bdb1" />
              ) : (
                <FaBars color="#e2bdb1" />
              )}
            </button>
          </div>
          <div className="logo-container">
            <img src={logovanburger} alt="Logo VanBurger" width={84} />
            <h3 className="header-title">Classy Conceito</h3>
          </div>
          <div className="header-buttons">
            <button onClick={irCart} className="header-button">
              <FaCartArrowDown color="#e2bdb1" />
            </button>
          </div>
        </div>
        <div className="Container-Menu">
          <nav className="Menunav">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                irhome("header");
              }}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                irhome("Categorias");
              }}
            >
              Categorias
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                irhome("endereco");
              }}
            >
              Endereços
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                irhome("contatos");
              }}
            >
              Contatos
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                irhome("SobreNós");
              }}
            >
              Sobre Nós
            </a>
          </nav>
        </div>
        {showBars && (
          <div className="Container-Menu11">
            <nav className="Menunav">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  irhome("header");
                }}
              >
                Home
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  irhome("Categorias");
                }}
              >
                Categorias
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  irhome("endereco");
                }}
              >
                Endereços
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  irhome("contatos");
                }}
              >
                Contatos
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  irhome("SobreNós");
                }}
              >
                Sobre Nós
              </a>
            </nav>
          </div>
        )}
        <input type="text" className="Searchmobile" placeholder="Pesquisar" />
        {showInput && (
          <input type="text" className="Search" placeholder="Pesquisar" />
        )}
      </header>
      {/* Lista de itens no carrinho */}
      <div className="mb-3">
        <h3 className="Categorias">Itens no Carrinho</h3>
        {cart.length > 0 ? (
          <ul className="list-group menu-list">
            {cart.map((item, index) => (
              <li
                key={index}
                className="list-group-item menu-item d-flex justify-content-between align-items-center"
              >
                <div className="menu-item-info">
                  <img src={item.images[0]} alt="" width={75} />
                  <strong>{item.name}</strong> x{item.Quantity}{" "}
                  <strong>
                    {item.Tamanho}
                    {item.color}
                  </strong>
                  <span className="menu-item-price">
                    R$ {item.price.toFixed(2)}
                  </span>
                </div>
                <button
                  className="btn btn-danger btn-sm menu-remove-btn"
                  style={buttonStyle}
                  onClick={() => handleremove(item._id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>O carrinho está vazio.</p>
        )}
        <div>
          <h2 className="Categorias">Resumo</h2>
          <h5>
            Entrega: R$
            {!entrega ? 0.0 : (Number(entrega.precoEntrega) + 9).toFixed(2)}
          </h5>
          <h3> Total: R${calcularTotal()}</h3>
        </div>
      </div>

      {/* Formulário de dados do cliente */}
      <div className="mb-3">
        <h3 className="Categorias">Dados do Cliente</h3>
        <form>
          <div className="form-group">
            <label>Nome*</label>
            <input
              style={inputStyle}
              type="text"
              className="form-control"
              value={cliente.nome}
              placeholder="Digite seu nome completo"
              onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Telefone*</label>
            <input
              style={inputStyle}
              type="text"
              className="form-control"
              value={cliente.telefone}
              placeholder="Digite seu telefone"
              onChange={(e) => handleTelefoneChange(e)}
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input
              style={inputStyle}
              type="email"
              className="form-control"
              value={cliente.email}
              placeholder="Digite seu email"
              onChange={(e) =>
                setCliente({ ...cliente, email: e.target.value })
              }
            />
          </div>
          {modoEntrega === "entrega em casa" && (
            <div className="form-group">
              <label>Endereço*</label>
              <input
                style={inputStyle}
                type="text"
                className="form-control"
                value={cliente.endereco}
                onChange={handleInputChange}
                placeholder="(Av/Rua, Numero, Bairro, Cidade)"
              />
              {/* Mostrar sugestões em uma lista */}
              {isDropdownVisible && suggestions.length > 0 && (
                <ul
                  className="list-group mt-2"
                  style={{
                    position: "absolute",
                    width: "80%",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    maxHeight: "150px",
                    overflowY: "auto",
                    marginTop: "5px",
                    textDecoration: "none",
                  }}
                  onMouseDown={handleDropdownMouseDown} // Impede o fechamento ao clicar na lista
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="list-group-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectEndereco(suggestion)} // Seleciona a sugestão
                    >
                      {/* Exibir o endereço completo (rua, número, bairro, cidade, estado, país) */}
                      {[
                        suggestion.address.road,
                        suggestion.address.house_number,
                        suggestion.address.suburb,
                        suggestion.address.city,
                      ]
                        .filter(Boolean) // Remove valores nulos ou indefinidos
                        .join(", ")}
                    </li>
                  ))}
                </ul>
              )}

              {/* Mensagem de erro */}
              {errorMessage && (
                <div className="alert alert-danger mt-2">{errorMessage}</div>
              )}
            </div>
          )}
          {modoEntrega === "consumo no local" && (
            <div className="form-group">
              <label>Codigo*</label>
              <input
                min={1}
                style={inputStyle}
                type="number"
                className="form-control"
                value={mesa || ""}
                placeholder={"Codigo (Min. 1)"}
                onChange={(e) => setMesa(Number(e.target.value))}
              />
            </div>
          )}
        </form>
        {modoEntrega === "entrega em casa" && (
          <button
            className="btn btn-secondary"
            style={buttonStyle}
            onClick={() => handleCalcular()}
          >
            Calcular Entrega
          </button>
        )}
      </div>

      {/* Tipo de entrega */}
      <div className="mb-3">
        <h3>Tipo de Entrega</h3>
        <label>
          <input
            type="radio"
            value="entrega em casa"
            checked={modoEntrega === "entrega em casa"}
            onChange={() => setModoEntrega("entrega em casa")}
          />
          <FaCarSide /> Entrega em Casa
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="consumo no local"
            checked={modoEntrega === "consumo no local"}
            onChange={() => setModoEntrega("consumo no local")}
          />
          <FaTshirt /> Retirada no Local
        </label>
      </div>

      {/* Forma de pagamento */}
      <div className="mb-3">
        <h3>Forma de Pagamento</h3>
        <label>
          <input
            type="radio"
            value="dinheiro"
            checked={formaPagamento === "dinheiro"}
            onChange={() => setFormaPagamento("dinheiro")}
          />
          <FaMoneyBillWave /> Dinheiro
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="cartão"
            checked={formaPagamento === "cartão"}
            onChange={() => setFormaPagamento("cartão")}
          />
          <FaCcMastercard title="Mastercard" /> Cartão
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="PIX"
            checked={formaPagamento === "PIX"}
            onChange={() => setFormaPagamento("PIX")}
          />
          <SiPix title="PIX" /> Pix
        </label>
        <br />
      </div>

      {/* Botões */}
      <div className="mb-3 d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          style={buttonStyle}
          onClick={backmenu}
        >
          <FaArrowLeft /> Voltar ao Menu
        </button>
        <button
          className="btn btn-primary"
          style={buttonStyle}
          disabled={cart.length === 0}
          onClick={finalizarPedido}
        >
          <FaCheckCircle /> Finalizar Pedido
        </button>
      </div>
      {/* Footer */}
      <footer
        className="footer"
        style={{
          marginTop: "15px",
          backgroundColor: "#44362a",
          color: "#e2bdb1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px",
          gap: "10px",
        }}
      >
        <div className="card-footer">
          <div className="card-itemfooter">
            <h4>Atendimentos</h4>
            <a href="https://wa.me/5585982124626?text=Quero%20fazer%20meu%20pedido%20na%20Classy%20Conceito">
              {" "}
              <FaWhatsapp size={15} /> Whatsapp Classy Conceito{" "}
            </a>
            <p>
              Segunda a sexta: 08h a 18h <br />
              sabado e domingo: 09h a 17h
            </p>
          </div>
          <div className="card-itemfooter">
            <p>Social</p>
            <a
              href="https://wa.me/5585982124626?text=Quero%20fazer%20meu%20pedido%20na%20Classy%20Conceito"
              style={{ textDecoration: "none", color: "#e2bdb1" }}
            >
              <FaWhatsapp size={15} />
            </a>
            <a
              href="https://www.instagram.com/classyconceito/"
              style={{ textDecoration: "none", color: "#e2bdb1" }}
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="https://www.instagram.com/vanbunguerlanches?igsh=MWh6amd0YndpMnZ5"
              style={{ textDecoration: "none", color: "#e2bdb1" }}
            >
              <FaFacebook size={15} />
            </a>
          </div>

          <div className="card-itemfooter">
            <a href="">Perguntas Frequentes (FAQ)</a>
            <a href="">Política de privacidade</a>
          </div>
        </div>
        <div className="imgfooter">
          <img src={logovanburger} alt="Logo VanBurger" width={77} />
          <p>&copy; 2024 Classy Conceito. Todos os direitos reservados.</p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default Carrinho;
