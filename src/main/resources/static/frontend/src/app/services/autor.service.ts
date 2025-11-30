import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor, AutorCreate, AutorUpdate } from '../models/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private baseUrl = '/api/autores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.baseUrl);
  }

  listarAtivos(): Observable<Autor[]> {
    return this.http.get<Autor[]>(`${this.baseUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.baseUrl}/${id}`);
  }

  buscarPorNome(nome: string): Observable<Autor[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Autor[]>(`${this.baseUrl}/buscar`, { params });
  }

  criar(autor: AutorCreate): Observable<any> {
    return this.http.post<any>(this.baseUrl, autor);
  }

  atualizar(id: number, autor: AutorUpdate): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, autor);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  inativar(id: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/inativar`, {});
  }
}