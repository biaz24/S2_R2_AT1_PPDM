//resposta da api quando recebemos um  produto

export interface Product {
  id?: number | string;
  nome: string;
  descricao: string;
  categoria?: string;
  preco: number;
  quantidade_estoque?: number;
  quantidade?: number;
  categoria_id?: number;
  status?: number;
  destaque?: boolean;
  marca?: string;
  modelo?: string;
  garantia_meses?: number;
}

//criando uma outra interface
// definindo quais dados nos vamos enviar em uma operação especifica
export interface CreateProductDTO {
  nome: string;
  descricao: string;
  categoria?: string;
  preco: number;
  quantidade_estoque?: number;
  quantidade?: number;
  categoria_id?: number;
  status?: number;
  destaque?: boolean;
}

export interface UpdateProductDTO {
  id?: number | string;
  nome: string;
  descricao: string;
  categoria?: string;
  preco: number;
  quantidade_estoque?: number;
  quantidade?: number;
  categoria_id?: number;
  status?: number;
  destaque?: boolean;
}
