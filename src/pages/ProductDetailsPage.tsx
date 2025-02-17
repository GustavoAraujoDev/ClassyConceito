import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api/api";
import logovanburger from "../assets/LogoClassyConceito.jpeg";
import tabeladicas from "../assets/tabeladicas.jpeg";

import "bootstrap-icons/font/bootstrap-icons.css";
import { FaArrowLeft } from "react-icons/fa";
import { Productcomquantity, Product } from "../types/Product";
import { toast, ToastContainer } from "react-toastify"; // Importando Toastify
import "react-toastify/dist/ReactToastify.css"; // Estilos do Toanustify
import { useCart } from "../components/CartContext";
import { ObjectId } from "mongodb";
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
  FaCheckCircle,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
} from "react-icons/fa";
import "../pages/stylesdetails.css";

const ProductDetailsPage: React.FC = () => {
  const [product, setProduct] = useState<Product>();
  console.log(product);
  const [Quantity, setQuantity] = useState<number>(1);
  const [Observacao, setObservacao] = useState<string>("");
  const [Color, setColor] = useState<string>("");
  const [Tamanho, setTamanho] = useState<string>("");
  const { id } = useParams<{ id?: string }>(); // id pode ser string ou undefined
  const history = useNavigate();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false); // Estado para controlar visibilidade do input
  const [showBars, setShowBars] = useState(false); // Estado para controlar visibilidade do input

  const toggleInput = () => {
    setShowInput((prev) => !prev); // Alterna entre mostrar e esconder
  };

  const toggleBars = () => {
    setShowBars((prev) => !prev); // Alterna entre mostrar e esconder
  };

  // Estado para controlar a imagem atual
  const [imagemAtual, setImagemAtual] = useState(0);
  const imagesLength = product?.images ? product?.images.length : 0;

  // Função para avançar para a próxima imagem
  const proximaImagem = () => {
    setImagemAtual((prevImagem) => (prevImagem + 1) % imagesLength);
  };

  // Função para voltar para a imagem anterior
  const imagemAnterior = () => {
    setImagemAtual(
      (prevImagem) => (prevImagem - 1 + imagesLength) % imagesLength
    );
  };

  // Rola para a categoria específica
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const backmenu = () => {
    return history("/"); // Redireciona de volta ao menu
  };
  const irCart = () => {
    return history("/Carrinho"); // Redireciona de volta ao menu
  };
  const handleSelect = (product: Product) => {
    addToCart(product, Quantity, Observacao, Color, Tamanho);
    toast.success(`${Quantity}x ${product.name} adicionado(s) ao carrinho!`);
    setQuantity(1);
  };

  const handleselectchangetam = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTamanho(event.target.value);
  };

  const handleselectchangetcor = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setColor(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);

    // Garante que o valor seja um número válido e maior ou igual a 1
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const inputStyle = {
    width: "50px", // Largura total do container pai
    padding: "12px 16px", // Espaçamento interno confortável
    fontSize: "16px", // Tamanho da fonte
    border: "1px solid #e2bdb1", // Borda inicial
    outline: "none", // Remove o estilo padrão de foco
    transition: "all 0.3s ease", // Suavidade para o efeito de foco
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra leve
    marginBottom: "10px",
  };

  useEffect(() => {
    const loadProductDetails = async () => {
      if (id) {
        try {
          const data = await fetchProductById(id); // Tenta buscar o produto
          setProduct(data);
          toast.success("Produto carregado com sucesso!"); // Exibe toast de sucesso
        } catch (error) {
          console.error("Erro ao carregar o produto:", error);
          toast.error("Erro ao carregar o produto. Tente novamente!"); // Exibe toast de erro
        }
      } else {
        toast.error("ID do produto não fornecido."); // Exibe toast de erro caso o id seja undefined
      }
    };
    loadProductDetails();
  }, [id]); // Recarrega o produto se o ID mudar

  if (!product) return <div>Loading...</div>; // Exibe "Loading..." até o produto ser carregado

  return (
    <div>
      {/* Header */}
      <header className="header" id="header">
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
                scrollToCategory("header");
              }}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToCategory("Categorias");
              }}
            >
              Categorias
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToCategory("endereco");
              }}
            >
              Endereços
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToCategory("contatos");
              }}
            >
              Contatos
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToCategory("SobreNós");
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
                  scrollToCategory("header");
                }}
              >
                Home
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToCategory("Categorias");
                }}
              >
                Categorias
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToCategory("endereco");
                }}
              >
                Endereços
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToCategory("contatos");
                }}
              >
                Contatos
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToCategory("SobreNós");
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
      <div className="Titulo-details">
        <h2 className="Categorias">Detalhes do Produto</h2>
      </div>

      <div className="product-details1">
        <div className="logo-details">
          <img
            src={product.images[imagemAtual]}
            alt={product.name}
            width="300"
            style={{
              boxShadow:
                "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.3)", // Use camelCase para boxShadow
            }}
          />
          <div className="controle-galeria">
            <button className="btn-maps" onClick={imagemAnterior}>
              <FaArrowAltCircleLeft /> Anterior
            </button>
            <button className="btn-maps" onClick={proximaImagem}>
              Próxima <FaArrowAltCircleRight />
            </button>
          </div>
        </div>
        <div className="infodetais">
          <h2>{product.name}</h2>
          <h3>R${product.price}</h3>
          <h3>{product.category}</h3>
          <div className="Quantidades">
            <input
              className="Quantidades"
              id="quantityInput"
              type="number"
              style={inputStyle}
              value={Quantity}
              onChange={handleInputChange}
              placeholder="Quantidade"
              min="1"
            />
            <div className="Tamanhos">
              <h5>Tamanhos:</h5>
              <select
                name=""
                value={Tamanho}
                onChange={handleselectchangetam}
                id=""
              >
                {product.tamanhos.map((tamanho) => (
                  <option value={tamanho}>{tamanho}</option>
                ))}
              </select>
            </div>
            <div className="colors">
              <h5>Cores:</h5>
              <select
                name=""
                id=""
                value={Color}
                onChange={handleselectchangetcor}
              >
                {product.colors.map((tamanho) => (
                  <option value={tamanho}>{tamanho}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="container-btn-details">
            <button className="btn-maps" onClick={() => handleSelect(product)}>
              <FaCheckCircle /> Selecionar Ao Carrinho
            </button>
            <button onClick={backmenu} className="btn-maps">
              <FaArrowLeft size={15} /> voltar ao menu
            </button>
            {cart.length > 0 && (
              <button onClick={irCart} className="btn-maps">
                <FaArrowLeft size={15} /> ir ao Carrinho
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="Titulo-details">
        <div>
          <h2 className="Categorias">Descrição</h2>
        </div>
        <p>{product.description}</p>
      </div>
      <div className="Titulo-details">
        <div>
          <h2 className="Categorias">Dicas</h2>
        </div>
        <img src={tabeladicas} alt="" width={370} />
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

export default ProductDetailsPage;
