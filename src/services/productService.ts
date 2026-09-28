import api from "../api/api";
import { Product, CreateProductDTO, UpdateProductDTO } from "../types/Product";

export const productService = {
  //Buscar todos os produtos
  async getProducts(): Promise<Product[]> {
    const response = await api.get("/products?limit=9999");

    //Array.isArray -> serve para descobrir se um valor ou objeto passado é
    //realmente um array
    // Verificações para diferentes estruturas de respostas
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data && Array.isArray(response.data.productos)) {
      return response.data.produtos;
    }

    return [];
  },

  //cadastrarumnovo produto
  async createProduct(productData: CreateProductDTO): Promise<Product> {
    const payload = {
      ...productData,
      preco: Number(productData.preco),
      quantidade_estoque: Number(productData.quantidade_estoque),
      quantidade: Number(productData.quantidade),
      categoria_id: productData.categoria_id || 1,
      status: productData.status ?? 1,
      destaque: productData.destaque ?? false,
    };
    const response = await api.post("/products", payload);
    return response.data;
  },

  // atualizar um produto
  async updateProduct(
    id: number | string,
    productData: UpdateProductDTO,
  ): Promise<Product> {
    const payload = {
      ...productData,
      preco: Number(productData.preco),
      quantidade_estoque: Number(productData.quantidade_estoque),
      quantidade: Number(productData.quantidade),
      categoria_id: productData.categoria_id || 1,
      status: productData.status ?? 1,
      destaque: productData.destaque ?? false,
    };
    const response = await api.put(`/products/${id}`, payload);
    return response.data;
  },

  //Excluir um producto  pelo id
  async deleteProduct(id: number | string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
