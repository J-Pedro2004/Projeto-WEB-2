export interface Autor {
  id?: number;
  nome: string;
  sobrenome: string;
  dataNascimento?: string;
  nacionalidade?: string;
  biografia?: string;
  ativo: boolean;
}

export interface AutorCreate {
  nome: string;
  sobrenome: string;
  dataNascimento?: string;
  nacionalidade?: string;
  biografia?: string;
  ativo: boolean;
}

export interface AutorUpdate extends AutorCreate {
  id: number;
}