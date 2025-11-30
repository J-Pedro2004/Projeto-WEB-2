import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro, LivroCreate, LivroUpdate } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = '/api/livros';

  constructor(private http: HttpClient) {}

  listar(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.baseUrl);
  }

  listarDisponiveis(): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.baseUrl}/disponiveis`);
  }

  buscarPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.baseUrl}/${id}`);
  }

  buscarPorTitulo(titulo: string): Observable<Livro[]> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.get<Livro[]>(`${this.baseUrl}/buscar`, { params });
  }

  buscarPorAutor(autorId: number): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.baseUrl}/autor/${autorId}`);
  }

  criar(livro: LivroCreate): Observable<any> {
    return this.http.post<any>(this.baseUrl, livro);
  }

  atualizar(id: number, livro: LivroUpdate): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, livro);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}