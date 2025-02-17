import React, { createContext, useContext, useState, ReactNode } from "react";
import { Productcomquantity, Product } from "../types/Product";
import { ObjectId } from "mongodb";

// Tipagem para o contexto do carrinho
interface CartContextType {
  cart: Productcomquantity[];
  addToCart: (
    product: Product,
    Quantity: number,
    observacao: string,
    color: string,
    Tamanho: string
  ) => void;
  clearCart: () => void;
  removeFromCart: (productId: ObjectId) => void; // Usamos ObjectId aqui
}

// Criação do contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Productcomquantity[]>([]);

  // Remove o produto do carrinho (ou decrementa a quantidade)
  const removeFromCart = (productId: ObjectId) => {
    setCart((prevCart) => {
      const productToRemove = prevCart.find(
        (item) => item._id.toString() === productId.toString()
      );

      if (productToRemove && productToRemove.Quantity > 1) {
        // Se a quantidade for maior que 1, diminui a quantidade
        return prevCart.map((item) =>
          item._id.toString() === productId.toString()
            ? { ...item, Quantity: item.Quantity - 1 }
            : item
        );
      }

      // Caso contrário, remove o produto do carrinho
      return prevCart.filter(
        (item) => item._id.toString() !== productId.toString()
      );
    });
  };

  const addToCart = (
    product: Product,
    Quantity: number,
    observacao: string,
    color: string,
    Tamanho: string
  ) => {
    const productWithQuantity: Productcomquantity = {
      ...product,
      Quantity,
      observacao,
      color,
      Tamanho,
    };
    console.log("prod" + productWithQuantity);
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item._id === productWithQuantity._id
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === productWithQuantity._id
            ? {
                ...item,
                Quantity: item.Quantity + productWithQuantity.Quantity,
              }
            : item
        );
      }

      return [...prevCart, productWithQuantity];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para acessar o contexto do carrinho
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
