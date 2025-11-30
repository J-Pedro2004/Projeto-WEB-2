import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Editora, EditoraCreate, EditoraUpdate } from '../models/editora.model';

@Injectable({
  providedIn: 'root'
})
export class EditoraService {
  private baseUrl = '/api/editoras';

  constructor(private http: HttpClient) {}

  listar(): Observable<Editora[]> {
    return this.http.get<Editora[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Editora> {
    return this.http.get<Editora>(`${this.baseUrl}/${id}`);
  }

  buscarPorRazaoSocial(razaoSocial: string): Observable<Editora[]> {
    const params = new HttpParams().set('razaoSocial', razaoSocial);
    return this.http.get<Editora[]>(`${this.baseUrl}/buscar`, { params });
  }

  buscarPorCnpj(cnpj: string): Observable<Editora> {
    const params = new HttpParams().set('cnpj', cnpj);
    return this.http.get<Editora>(`${this.baseUrl}/cnpj`, { params });
  }

  criar(editora: EditoraCreate): Observable<any> {
    return this.http.post<any>(this.baseUrl, editora);
  }

  atualizar(id: number, editora: EditoraUpdate): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, editora);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}