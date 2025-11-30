import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaCreate, CategoriaUpdate } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private baseUrl = '/api/categorias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/${id}`);
  }

  buscarPorNome(nome: string): Observable<Categoria[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Categoria[]>(`${this.baseUrl}/buscar`, { params });
  }

  criar(categoria: CategoriaCreate): Observable<any> {
    return this.http.post<any>(this.baseUrl, categoria);
  }

  atualizar(id: number, categoria: CategoriaUpdate): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, categoria);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}