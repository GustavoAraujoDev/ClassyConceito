import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/api"; // Importando o tipo Product e a função fetchProducts
import logovanburger from "../assets/LogoClassyConceito.jpeg";
import "bootstrap-icons/font/bootstrap-icons.css";
import BannerHero from "../assets/BannerHero.png";
import BannerHeroMobile from "../assets/bannerheromobile.png";
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
} from "react-icons/fa";
import { Product } from "../types/Product";
import "../pages/stylesdetails.css";
const HomePage: React.FC = () => {
  // Estado para armazenar produtos e categoria selecionada
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  const [filtroNome, setFiltroNome] = useState("");
  const [showInput, setShowInput] = useState(false); // Estado para controlar visibilidade do input
  const [showBars, setShowBars] = useState(false); // Estado para controlar visibilidade do input

  const toggleInput = () => {
    setShowInput((prev) => !prev); // Alterna entre mostrar e esconder
  };

  const toggleBars = () => {
    setShowBars((prev) => !prev); // Alterna entre mostrar e esconder
  };

  // Rola para a categoria específica
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Carrega os produtos da API
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const irCart = () => {
    navigate("/Carrinho");
  };

  const irPhone = () => {
    navigate("/infoPhone");
  };

  const irSearch = () => {};

  // Agrupar produtos por categoria
  const groupByCategory = (products: Product[]): Record<string, Product[]> => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  };

  const filtrarProdutos = () => {
    return products.filter((produto) =>
      produto.name.toLowerCase().includes(filtroNome.toLowerCase())
    );
  };

  // Agrupar produtos por categoria
  const getCategoryImage = (category: string, products: Product[]): string => {
    // Encontrar o primeiro produto da categoria
    const product = products.find((product) => product.category === category);

    // Se o produto foi encontrado e tem a imagem, retorna a imagem da categoria
    return product ? product.images[0] : "default-image.jpg"; // Imagem padrão se não encontrar a categoria
  };

  const groupedProducts = groupByCategory(products);
  const [ListaFiltrada, setListaFiltrada] = useState<Record<string, Product[]>>(
    {}
  );

  // Função para filtrar os produtos com base no nome
  const filtrarLista = (termo: string) => {
    if (!termo) {
      // Se o termo estiver vazio, exibe todos os produtos agrupados
      setListaFiltrada(groupedProducts);
    } else {
      // Filtra os produtos por nome
      const result = Object.keys(groupedProducts).reduce((acc, category) => {
        // Filtra os produtos dentro de cada categoria
        const filteredProducts = groupedProducts[category].filter((product) =>
          product.name.toLowerCase().includes(termo.toLowerCase())
        );

        // Se houver produtos filtrados, adiciona a categoria ao resultado
        if (filteredProducts.length > 0) {
          acc[category] = filteredProducts;
        }
        return acc;
      }, {} as Record<string, Product[]>);

      // Atualiza o estado com os produtos filtrados
      setListaFiltrada(result);
    }
  };

  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory
    ? groupedProducts[selectedCategory] || []
    : products;

  useEffect(() => {
    loadProducts();
  }, []);

  // Atualiza ListaFiltrada quando os produtos mudarem
  useEffect(() => {
    if (products.length > 0) {
      const groupedProducts = groupByCategory(products);
      setListaFiltrada(groupedProducts);
    }
  }, [products]);

  return (
    <>
      {products ? (
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
            <input
              type="text"
              className="Searchmobile"
              placeholder="Pesquisar"
              value={filtroNome}
              onChange={(e) => {
                setFiltroNome(e.target.value);
                filtrarLista(e.target.value); // Chama a função de filtragem sempre que o texto mudar
              }}
            />
            {showInput && (
              <input
                type="text"
                className="Search"
                placeholder="Pesquisar"
                value={filtroNome}
                onChange={(e) => {
                  setFiltroNome(e.target.value);
                  filtrarLista(e.target.value); // Chama a função de filtragem sempre que o texto mudar
                }}
              />
            )}
          </header>

          {/* Hero Section */}
          <section className="hero">
            <img src={BannerHero} alt="" />
            <div className="mobilebanner">
              <img src={BannerHeroMobile} alt="" />
              <h4> Peças Unicas Para Cada Ocasião Classy Conceito</h4>
            </div>
            <div className="btn-hero">
              <button
                className="btn-esq"
                onClick={() => {
                  window.location.href =
                    "https://wa.me/5585982124626?text=Quero%20fazer%20meu%20pedido%20na%20Classy%20Conceito";
                }}
              >
                <FaWhatsapp /> compre agora
              </button>
              <button className="btn-dir">ver novidades</button>
            </div>
          </section>

          {/* Menu de Categorias */}
          <div className="tit1">
            <h1 className="Categorias" id="Categorias">
              Categorias
            </h1>
          </div>

          <nav
            className="category-menu"
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              alignItems: "center",
              justifyContent: "space-between",
              overflowX: "auto",
              height: "auto",
              margin: "15px",
              padding: "20px",
              border: "none",
            }}
          >
            {Object.keys(groupedProducts).map((category) => (
              <button
                className="btn-category"
                key={category}
                style={{}}
                onClick={() => scrollToCategory(category)}
              >
                <div className="logo-category">
                  <img
                    src={getCategoryImage(category, products)}
                    alt={category}
                    style={{
                      width: "80%",
                      height: "auto",
                      marginRight: "8px",
                      boxShadow:
                        "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.3)", // Use camelCase para boxShadow
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <span>{category}</span>
              </button>
            ))}
          </nav>

          {/* Lista de Produtos */}
          <section className="products">
            {Object.keys(ListaFiltrada).map((category) => (
              <div key={category} id={category}>
                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {category}
                </h2>
                <div className="product-list">
                  {ListaFiltrada[category].map((product) => (
                    <ProductCard
                      key={product._id.toString()}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/*endereços*/}

          <section className="endereco" id="endereco">
            <div className="tit1">
              <h1 className="Categorias">Endereços</h1>
            </div>
            <div className="Card-location">
              <h3>Loja Centro Fashion</h3>
              <p>
                Av Filomeno Gomes, 430 | Setor Verde - Rua Senador Jaguaribe,
                Loja 1140, Fortaleza, Brazil 60010280
              </p>
              <button className="btn-maps">
                <a href="https://www.google.com/maps/dir//Classy+Conceito+-+Rua+Senador+Jaguaribe+-+Jacarecanga,+Fortaleza+-+CE/@-3.7185984,-38.5830507,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x7c74921df0902ff:0x1f5b925adb8e0cdc!2m2!1d-38.5418506!2d-3.718685?entry=ttu&g_ep=EgoyMDI1MDIwMy4wIKXMDSoASAFQAw%3D%3D">
                  <FaLocationArrow /> Ver No Mapa
                </a>
              </button>
            </div>
          </section>

          {/*Contatos*/}

          <section className="contatos" id="contatos">
            <div className="tit1">
              <h1 className="Categorias">Contatos</h1>
            </div>
            <div className="Container-contatos">
              <div className="Card-location">
                <h3> Nosso Whatsapp</h3>
                <p>(85) 9 8212-4626</p>
                <button className="btn-maps">
                  <a href="https://wa.me/5585982124626?text=Quero%20fazer%20meu%20pedido%20na%20Classy%20Conceito">
                    <FaWhatsapp /> Ir Para Nosso Whatsapp
                  </a>
                </button>
              </div>
              <div className="Card-location">
                <h3>Nosso Instagram</h3>
                <p>@Classyconceito</p>
                <button className="btn-maps">
                  <a href="https://www.instagram.com/classyconceito/">
                    <FaInstagram /> Ir Para Nosso Instagram
                  </a>
                </button>
              </div>
              <div className="Card-location">
                <h3>Nosso Facebook</h3>
                <p>Classyconceito</p>
                <button className="btn-maps">
                  <a href="https://www.facebook.com/classyconceito">
                    <FaFacebook /> Ir Para Nosso Facebook
                  </a>
                </button>
              </div>
            </div>
          </section>

          {/*Sobre Nós*/}

          <section className="SobreNós" id="SobreNós">
            <div className="tit1">
              <h1 className="Categorias">Sobre Nós</h1>
            </div>
            <div className="Container-SobreNos">
              <div className="Card-SobreNos">
                <h3>Classy Conceito</h3>
                <p>
                  A Classy Conceito é uma empresa dedicada a oferecer soluções
                  criativas e personalizadas, com foco na qualidade e inovação.
                  Nosso compromisso é superar expectativas e construir
                  relacionamentos baseados em confiança e excelência. <br /> Com
                  uma equipe qualificada e apaixonada, trabalhamos para trazer
                  modernidade e eficiência em tudo o que fazemos. Buscamos
                  constantemente novas ideias para atender às necessidades dos
                  nossos clientes de forma única e profissional. <br /> Na
                  Classy Conceito, acreditamos que dedicação, visão de futuro e
                  respeito são a base do sucesso. Estamos prontos para
                  transformar suas ideias em realidade e proporcionar
                  experiências memoráveis.
                </p>
                <button className="btn-maps">
                  <a href="https://wa.me/5585982124626?text=Quero%20fazer%20meu%20pedido%20na%20Classy%20Conceito">
                    <FaWhatsapp /> Compre no Atacado
                  </a>
                </button>
              </div>
              <div className="Logo-Container">
                <img src={logovanburger} alt="" width={195} />
              </div>
            </div>
          </section>

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
                  href="https://www.facebook.com/classyconceito"
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
        </div>
      ) : (
        <h4>Carregando Progutos</h4>
      )}
    </>
  );
};

export default HomePage;
