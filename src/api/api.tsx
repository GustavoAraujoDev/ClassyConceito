import { ObjectId } from "mongodb";
import { Product } from "../types/Product";

// Função para buscar todos os produtos
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(
    "https://apicardapiovanburger.onrender.com/products"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: Product[] = await response.json();
  return data;
};

// Função para buscar um produto pelo ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(
    `https://apicardapiovanburger.onrender.com/products/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product with ID ${id}: ${response.statusText}`
    );
  }

  const data: Product = await response.json();
  return data;
};
