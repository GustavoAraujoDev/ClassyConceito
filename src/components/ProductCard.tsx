import { FaInfoCircle } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom"; // Para navegação
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const history = useNavigate();

  const handleViewDetails = () => {
    history(`/product/${product._id}`);
  };

  return (
    <div
      className="product-card"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "25px",
        backgroundColor: "#ffff",
        color: "#44362a",
        justifyContent: "center",
        alignItems: "center",
        margin: "15px",
        padding: "10px",
        boxSizing: "border-box",
        flex: "1 1 28%",
      }}
    >
      <img
        src={product.images[0]}
        alt={product.name}
        width="50%"
        style={{
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.3)", // Use camelCase para boxShadow
        }}
      />
      <h2>{product.name}</h2>
      {product.colors.map((color) => (
        <p>{color}</p>
      ))}
      <h3>R${product.price}</h3>
      <button
        style={{
          borderRadius: "25px",
          height: "35px",
          width: "130px",
          backgroundColor: "#44362a",
          color: "#a2bdb1",
          border: "none",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.3)", // Use camelCase para boxShadow
        }}
        onClick={handleViewDetails}
      >
        <FaInfoCircle size={15} /> Ver Detalhes
      </button>
    </div>
  );
};

export default ProductCard;
