// src/types/Product.ts
import { ObjectId } from "mongodb"; // Importa o tipo ObjectId

// Tipo para produtos criados (sem _id)
export interface ProductWithoutId {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  observacao?: string;
  colors: string[];
  tamanhos: string[];
}

// Tipo para produtos carregados (com _id)
export interface Product extends ProductWithoutId {
  _id: ObjectId;
}

// Tipo para produtos carregados (com _id)
export interface Productcomquantity extends Product {
  Quantity: number;
  extras?: string[]; // Ingredientes ou complementos adicionais
  observacao?: string;
  color: string;
  Tamanho: string;
}
