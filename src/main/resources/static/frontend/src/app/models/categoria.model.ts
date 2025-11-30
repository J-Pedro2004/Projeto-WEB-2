export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  cor?: string;
  ativa: boolean;
  dataCadastro: string;
}

export interface CategoriaCreate {
  nome: string;
  descricao?: string;
  cor?: string;
  ativa: boolean;
}

export interface CategoriaUpdate {
  nome: string;
  descricao?: string;
  cor?: string;
  ativa: boolean;
}