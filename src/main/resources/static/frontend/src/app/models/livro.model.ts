import { Autor } from './autor.model';
import { Categoria } from './categoria.model';
import { Editora } from './editora.model';

export interface Livro {
  id?: number;
  titulo: string;
  subtitulo?: string;
  isbn?: string;
  anoPublicacao?: number;
  numeroPaginas?: number;
  idioma?: string;
  preco?: number;
  quantidadeEstoque?: number;
  disponivel: boolean;
  sinopse?: string;
  dataCadastro?: string;
  autor?: Autor;
  editora?: Editora;
  categorias?: Categoria[];
}

export interface LivroCreate {
  titulo: string;
  subtitulo?: string;
  isbn?: string;
  anoPublicacao?: number;
  numeroPaginas?: number;
  idioma?: string;
  preco?: number;
  quantidadeEstoque?: number;
  disponivel: boolean;
  sinopse?: string;
  dataCadastro?: string;
  autor?: { id: number };
  editora?: { id: number };
  categorias?: { id: number }[];
}

export interface LivroUpdate extends LivroCreate {
  id: number;
}