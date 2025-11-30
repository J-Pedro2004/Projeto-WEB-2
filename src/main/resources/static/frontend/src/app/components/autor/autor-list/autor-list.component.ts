import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autor } from '../../../models/autor.model';
import { AutorService } from '../../../services/autor.service';

@Component({
  selector: 'app-autor-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-user"></i> Lista de Autores</h2>
        <button class="btn btn-primary" (click)="novoAutor()">
          <i class="fas fa-plus"></i> Novo Autor
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-0">Autores Cadastrados</h5>
            </div>
            <div class="col-md-6">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por nome..."
                  [(ngModel)]="termoBusca"
                  (keyup.enter)="buscar()"
                >
                <button class="btn btn-outline-secondary" (click)="buscar()">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-body">
          <div *ngIf="carregando" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="!carregando && autores.length === 0" class="text-center text-muted">
            <i class="fas fa-users fa-3x mb-3"></i>
            <p>Nenhum autor encontrado.</p>
          </div>

          <div *ngIf="!carregando && autores.length > 0" class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Nacionalidade</th>
                  <th>Data Nascimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let autor of autores">
                  <td>{{ autor.id }}</td>
                  <td>{{ autor.nome }} {{ autor.sobrenome }}</td>
                  <td>{{ autor.nacionalidade || '-' }}</td>
                  <td>{{ autor.dataNascimento | date:'dd/MM/yyyy' || '-' }}</td>
                  <td>
                    <span class="badge" [class]="autor.ativo ? 'bg-success' : 'bg-danger'">
                      {{ autor.ativo ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-primary" 
                        (click)="visualizar(autor)"
                        data-bs-toggle="modal" 
                        data-bs-target="#modalVisualizacao"
                        title="Visualizar"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-warning" 
                        (click)="editar(autor.id!)"
                        title="Editar"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-outline-danger" 
                        (click)="confirmarExclusao(autor)"
                        title="Excluir"
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

    <!-- Modal de Visualização -->
    <div class="modal fade" id="modalVisualizacao" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content" *ngIf="autorSelecionado">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user"></i> {{ autorSelecionado.nome }} {{ autorSelecionado.sobrenome }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <strong>ID:</strong> {{ autorSelecionado.id }}
              </div>
              <div class="col-md-6">
                <strong>Status:</strong> 
                <span class="badge" [class]="autorSelecionado.ativo ? 'bg-success' : 'bg-danger'">
                  {{ autorSelecionado.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-md-6">
                <strong>Nacionalidade:</strong> {{ autorSelecionado.nacionalidade || '-' }}
              </div>
              <div class="col-md-6">
                <strong>Data Nascimento:</strong> {{ autorSelecionado.dataNascimento | date:'dd/MM/yyyy' || '-' }}
              </div>
            </div>
            <hr>
            <div *ngIf="autorSelecionado.biografia">
              <strong>Biografia:</strong>
              <p class="mt-2">{{ autorSelecionado.biografia }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 2px solid #E5E7EB !important;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 1) !important;
    }
    
    .card-header {
      background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important;
      color: #FFFFFF !important;
      border-bottom: none !important;
      padding: 1.5rem !important;
    }
    
    .card-header h5 {
      color: #FFFFFF !important;
      font-weight: 700 !important;
    }
    
    .card-body {
      background: #FFFFFF !important;
      padding: 1.5rem !important;
    }
    
    .table {
      background: #FFFFFF !important;
      border: 2px solid #E5E7EB !important;
      margin-bottom: 0 !important;
    }
    
    .table thead {
      background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important;
    }
    
    .table th {
      background: transparent !important;
      color: #FFFFFF !important;
      border: none !important;
      border-top: none !important;
      font-weight: 700 !important;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      padding: 1rem 1.2rem !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .table tbody tr {
      background: #FFFFFF !important;
      border-bottom: 1px solid #E5E7EB !important;
      transition: all 0.3s ease;
    }
    
    .table tbody tr:nth-child(even) {
      background: #F9FAFB !important;
    }
    
    .table tbody tr:hover {
      background: #EFF6FF !important;
      transform: scale(1.001);
    }
    
    .table tbody td {
      color: #1F2937 !important;
      font-weight: 500;
      border-color: #E5E7EB !important;
      padding: 1rem 1.2rem !important;
    }
    
    .badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.85rem;
    }
    
    .badge.bg-success {
      background: #10B981 !important;
      color: #FFFFFF !important;
    }
    
    .badge.bg-danger {
      background: #EF4444 !important;
      color: #FFFFFF !important;
    }
    
    .btn-group-sm .btn {
      padding: 0.4rem 0.7rem;
      font-weight: 600;
    }
    
    .btn-outline-primary {
      border-color: #3B82F6 !important;
      color: #3B82F6 !important;
    }
    
    .btn-outline-primary:hover {
      background: #3B82F6 !important;
      color: #FFFFFF !important;
    }
    
    .btn-outline-warning {
      border-color: #F59E0B !important;
      color: #F59E0B !important;
    }
    
    .btn-outline-warning:hover {
      background: #F59E0B !important;
      color: #FFFFFF !important;
    }
    
    .btn-outline-danger {
      border-color: #EF4444 !important;
      color: #EF4444 !important;
    }
    
    .btn-outline-danger:hover {
      background: #EF4444 !important;
      color: #FFFFFF !important;
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
    
    .fa-3x {
      font-size: 3rem;
    }
    
    .text-muted {
      color: #6B7280 !important;
    }
  `]
})
export class AutorListComponent implements OnInit {
  autores: Autor[] = [];
  autorSelecionado: Autor | null = null;
  carregando = false;
  termoBusca = '';

  constructor(
    private autorService: AutorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAutores();
  }

  carregarAutores(): void {
    this.carregando = true;
    this.autorService.listar().subscribe({
      next: (autores) => {
        this.autores = autores;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar autores:', error);
        this.carregando = false;
      }
    });
  }

  buscar(): void {
    if (this.termoBusca.trim()) {
      this.carregando = true;
      this.autorService.buscarPorNome(this.termoBusca).subscribe({
        next: (autores) => {
          this.autores = autores;
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao buscar autores:', error);
          this.carregando = false;
        }
      });
    } else {
      this.carregarAutores();
    }
  }

  novoAutor(): void {
    this.router.navigate(['/autores/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/autores/editar', id]);
  }

  visualizar(autor: Autor): void {
    this.autorSelecionado = autor;
    // Abrir modal (requer Bootstrap JS)
  }

  confirmarExclusao(autor: Autor): void {
    if (confirm(`Deseja realmente excluir o autor ${autor.nome} ${autor.sobrenome}?`)) {
      this.excluir(autor.id!);
    }
  }

  excluir(id: number): void {
    this.autorService.excluir(id).subscribe({
      next: () => {
        this.carregarAutores();
        alert('Autor excluído com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao excluir autor:', error);
        alert('Erro ao excluir autor!');
      }
    });
  }
}