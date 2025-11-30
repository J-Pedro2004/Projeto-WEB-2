import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PedidoCreate, PedidoUpdate, StatusPedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = '/api/pedidos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  buscarPorStatus(status: StatusPedido): Observable<Pedido[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Pedido[]>(`${this.baseUrl}/status`, { params });
  }

  buscarPorPeriodo(dataInicio: string, dataFim: string): Observable<Pedido[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<Pedido[]>(`${this.baseUrl}/periodo`, { params });
  }

  buscarPorCliente(nome: string): Observable<Pedido[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Pedido[]>(`${this.baseUrl}/cliente`, { params });
  }

  criar(pedido: PedidoCreate): Observable<any> {
    return this.http.post<any>(this.baseUrl, pedido);
  }

  atualizar(id: number, pedido: PedidoUpdate): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, pedido);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  alterarStatus(id: number, status: StatusPedido): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, {}, { params });
  }

  adicionarItem(pedidoId: number, item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${pedidoId}/itens`, item);
  }

  removerItem(pedidoId: number, itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${pedidoId}/itens/${itemId}`);
  }

  atualizarItem(pedidoId: number, itemId: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${pedidoId}/itens/${itemId}`, item);
  }
}