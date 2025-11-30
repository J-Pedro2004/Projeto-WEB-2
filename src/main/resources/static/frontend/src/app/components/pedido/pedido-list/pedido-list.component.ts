import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido, ItemPedido } from '../../../models/pedido.model';


@Component({
  selector: 'app-pedido-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-shopping-cart"></i> Lista de Pedidos</h2>
        <a routerLink="/pedidos/novo" class="btn btn-danger">
          <i class="fas fa-plus"></i> Novo Pedido
        </a>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-4">
              <h5 class="mb-0">Pedidos Cadastrados</h5>
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="statusFiltro" (change)="filtrarPorStatus()">
                <option value="">Todos os Status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="PREPARANDO">Em Preparação</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por cliente..."
                  [(ngModel)]="termoBusca"
                  (keyup.enter)="buscarPorCliente()"
                >
                <button class="btn btn-outline-secondary" (click)="buscarPorCliente()">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-body">
          <div *ngIf="carregando" class="text-center">
            <div class="spinner-border text-danger" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="!carregando && pedidos.length === 0" class="text-center text-muted">
            <i class="fas fa-shopping-cart fa-3x mb-3"></i>
            <p>Nenhum pedido encontrado.</p>
          </div>

          <div *ngIf="!carregando && pedidos.length > 0" class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Data Pedido</th>
                  <th>Status</th>
                  <th>Valor Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let pedido of pedidos" 
                    [class.table-warning]="pedido.status === 'PENDENTE'"
                    [class.table-success]="pedido.status === 'ENTREGUE'"
                    [class.table-danger]="pedido.status === 'CANCELADO'">
                  <td>
                    <strong>{{ pedido.numero }}</strong>
                  </td>
                  <td>
                    <div>{{ pedido.nomeCliente }}</div>
                    <small class="text-muted">{{ pedido.emailCliente }}</small>
                  </td>
                  <td>{{ pedido.dataPedido | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>
                    <span class="badge" [ngClass]="getStatusBadgeClass(pedido.status)">
                      {{ getStatusText(pedido.status) }}
                    </span>
                  </td>
                  <td>
                    <strong>{{ pedido.valorTotal | currency:'BRL':'symbol':'1.2-2' }}</strong>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-info" 
                        (click)="visualizarDetalhes(pedido)"
                        data-bs-toggle="modal" 
                        data-bs-target="#modalDetalhes"
                        title="Ver Detalhes"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-warning" 
                        (click)="editar(pedido.id)"
                        title="Editar"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-outline-danger" 
                        (click)="confirmarExclusao(pedido)"
                        title="Excluir"
                        [disabled]="pedido.status === 'ENTREGUE'"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido -->
    <div class="modal fade" id="modalDetalhes" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" *ngIf="pedidoSelecionado">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-shopping-cart"></i> 
              Pedido {{ pedidoSelecionado.numero }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Dados do Cliente -->
            <div class="row mb-3">
              <div class="col-md-6">
                <h6><i class="fas fa-user"></i> Dados do Cliente</h6>
                <p class="mb-1"><strong>Nome:</strong> {{ pedidoSelecionado.nomeCliente }}</p>
                <p class="mb-1"><strong>Email:</strong> {{ pedidoSelecionado.emailCliente }}</p>
                <p class="mb-1"><strong>Telefone:</strong> {{ pedidoSelecionado.telefoneCliente }}</p>
              </div>
              <div class="col-md-6">
                <h6><i class="fas fa-calendar"></i> Informações do Pedido</h6>
                <p class="mb-1"><strong>Data:</strong> {{ pedidoSelecionado.dataPedido | date:'dd/MM/yyyy HH:mm' }}</p>
                <p class="mb-1"><strong>Entrega Prevista:</strong> {{ pedidoSelecionado.dataEntregaPrevista | date:'dd/MM/yyyy' }}</p>
                <p class="mb-1">
                  <strong>Status:</strong> 
                  <span class="badge" [ngClass]="getStatusBadgeClass(pedidoSelecionado.status)">
                    {{ getStatusText(pedidoSelecionado.status) }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Endereço de Entrega -->
            <div class="row mb-3">
              <div class="col-12">
                <h6><i class="fas fa-map-marker-alt"></i> Endereço de Entrega</h6>
                <p>{{ pedidoSelecionado.enderecoEntrega }}</p>
              </div>
            </div>

            <!-- Itens do Pedido -->
            <div class="row mb-3">
              <div class="col-12">
                <h6><i class="fas fa-list"></i> Itens do Pedido</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Livro</th>
                        <th>Qtd</th>
                        <th>Preço Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of pedidoSelecionado.itens">
                        <td>{{ item.livro?.titulo }}</td>
                        <td>{{ item.quantidade }}</td>
                        <td>{{ item.precoUnitario | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ item.subtotal | currency:'BRL':'symbol':'1.2-2' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Totais -->
            <div class="row">
              <div class="col-md-6 offset-md-6">
                <table class="table table-sm">
                  <tr>
                    <td>Subtotal:</td>
                    <td class="text-end">{{ (pedidoSelecionado.valorTotal - pedidoSelecionado.valorFrete + pedidoSelecionado.valorDesconto) | currency:'BRL':'symbol':'1.2-2' }}</td>
                  </tr>
                  <tr>
                    <td>Frete:</td>
                    <td class="text-end">{{ pedidoSelecionado.valorFrete | currency:'BRL':'symbol':'1.2-2' }}</td>
                  </tr>
                  <tr *ngIf="pedidoSelecionado.valorDesconto > 0">
                    <td>Desconto:</td>
                    <td class="text-end text-success">-{{ pedidoSelecionado.valorDesconto | currency:'BRL':'symbol':'1.2-2' }}</td>
                  </tr>
                  <tr class="table-primary">
                    <td><strong>Total:</strong></td>
                    <td class="text-end"><strong>{{ pedidoSelecionado.valorTotal | currency:'BRL':'symbol':'1.2-2' }}</strong></td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Observações -->
            <div class="row" *ngIf="pedidoSelecionado.observacoes">
              <div class="col-12">
                <h6><i class="fas fa-comment"></i> Observações</h6>
                <p>{{ pedidoSelecionado.observacoes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }
    
    .fa-3x {
      font-size: 3rem;
    }
    
    .table-responsive {
      border-radius: 0.375rem;
    }

    .modal-header {
      background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important;
      color: #FFFFFF !important;
      border-bottom: none !important;
    }
    
    .modal-title {
      color: #FFFFFF !important;
      font-weight: 700 !important;
    }

    .modal-content {
      background-color: #FFFFFF !important;
      color: #1F2937 !important;
    }
    
    .modal-body {
      color: #1F2937 !important;
    }
  `]
})
export class PedidoListComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;
  carregando = false;
  termoBusca = '';
  statusFiltro = '';

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.pedidoService.listar().subscribe({
      next: (pedidos: any[]) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar pedidos:', error);
        this.carregando = false;
      }
    });
  }

  filtrarPorStatus(): void {
    if (this.statusFiltro) {
      this.carregando = true;
      this.pedidoService.buscarPorStatus(this.statusFiltro as any).subscribe({
        next: (pedidos: any[]) => {
          this.pedidos = pedidos;
          this.carregando = false;
        },
        error: (error: any) => {
          console.error('Erro ao filtrar pedidos:', error);
          this.carregando = false;
        }
      });
    } else {
      this.carregarPedidos();
    }
  }

  buscarPorCliente(): void {
    if (this.termoBusca.trim()) {
      this.carregando = true;
      this.pedidoService.buscarPorCliente(this.termoBusca).subscribe({
        next: (pedidos: any[]) => {
          this.pedidos = pedidos;
          this.carregando = false;
        },
        error: (error: any) => {
          console.error('Erro ao buscar pedidos:', error);
          this.carregando = false;
        }
      });
    } else {
      this.carregarPedidos();
    }
  }

  novoPedido(): void {
    console.log('Navegando para pedidos/novo');
    this.router.navigate(['pedidos/novo']).then(
      success => console.log('Navegação bem-sucedida:', success),
      error => console.error('Erro na navegação:', error)
    );
  }

  editar(id: number): void {
    this.router.navigate(['/pedidos/editar', id]);
  }

  visualizarDetalhes(pedido: Pedido): void {
    this.pedidoSelecionado = pedido;
    this.pedidoService.buscarPorId(pedido.id).subscribe({
      next: (pedidoCompleto) => {
        this.pedidoSelecionado = pedidoCompleto;
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do pedido:', error);
      }
    });
  }

  confirmarExclusao(pedido: Pedido): void {
    if (pedido.status === 'ENTREGUE') {
      alert('Não é possível excluir pedidos já entregues!');
      return;
    }

    if (confirm(`Deseja realmente excluir o pedido ${pedido.numero}?`)) {
      this.excluir(pedido.id);
    }
  }

  excluir(id: number): void {
    this.pedidoService.excluir(id).subscribe({
      next: () => {
        this.carregarPedidos();
        alert('Pedido excluído com sucesso!');
      },
      error: (error: any) => {
        console.error('Erro ao excluir pedido:', error);
        alert('Erro ao excluir pedido!');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'PENDENTE': 'bg-warning',
      'CONFIRMADO': 'bg-info',
      'PREPARANDO': 'bg-primary',
      'ENVIADO': 'bg-secondary',
      'ENTREGUE': 'bg-success',
      'CANCELADO': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'PENDENTE': 'Pendente',
      'CONFIRMADO': 'Confirmado',
      'PREPARANDO': 'Em Preparação',
      'ENVIADO': 'Enviado',
      'ENTREGUE': 'Entregue',
      'CANCELADO': 'Cancelado'
    };
    return texts[status] || status;
  }
}