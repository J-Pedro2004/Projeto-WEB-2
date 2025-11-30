import { Endereco } from './endereco.model';

export interface Editora {
  id?: number;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  endereco?: Endereco;
  telefone?: string;
  email?: string;
  website?: string;
  ativa?: boolean;
  dataFundacao?: Date;
}

export interface EditoraCreate {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  endereco?: Endereco;
  telefone?: string;
  email?: string;
  website?: string;
}

export interface EditoraUpdate extends EditoraCreate {
  id: number;
}