import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LivroService } from '../../../services/livro.service';
import { Livro } from '../../../models/livro.model';

@Component({
  selector: 'app-livro-list',
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h4 class="mb-0">
            <i class="fas fa-book"></i> Gerenciamento de Livros
          </h4>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3">
            <button class="btn btn-primary" (click)="novo()">
              <i class="fas fa-plus"></i> Novo Livro
            </button>
            <button class="btn btn-secondary" (click)="carregar()">
              <i class="fas fa-sync"></i> Atualizar
            </button>
          </div>

          <div *ngIf="loading" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div class="table-responsive" *ngIf="!loading">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Editora</th>
                  <th>ISBN</th>
                  <th>Ano</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="livros.length === 0">
                  <td colspan="10" class="text-center">Nenhum livro encontrado</td>
                </tr>
                <tr *ngFor="let livro of livros">
                  <td>{{ livro.id }}</td>
                  <td>{{ livro.titulo }}</td>
                  <td>{{ livro.autor?.nome }} {{ livro.autor?.sobrenome }}</td>
                  <td>{{ livro.editora?.nome }}</td>
                  <td>{{ livro.isbn || '-' }}</td>
                  <td>{{ livro.anoPublicacao || '-' }}</td>
                  <td>{{ livro.preco | currency:'BRL' }}</td>
                  <td>{{ livro.quantidadeEstoque }}</td>
                  <td>
                    <span class="badge" [class]="livro.disponivel ? 'bg-success' : 'bg-danger'">
                      {{ livro.disponivel ? 'Disponível' : 'Indisponível' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-warning me-1" (click)="editar(livro.id!)" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="excluir(livro.id!)" title="Excluir">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 2px solid #E5E7EB !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
      background: #FFFFFF !important;
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
    }
    
    .text-muted {
      color: #6B7280 !important;
    }
  `]
})
export class LivroListComponent implements OnInit {
  livros: Livro[] = [];
  loading = false;
  error = '';

  constructor(
    private livroService: LivroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.error = '';
    this.livroService.listar().subscribe({
      next: (data: Livro[]) => {
        this.livros = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar livros: ' + err.message;
        this.loading = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/livros/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/livros/editar', id]);
  }

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir este livro?')) {
      this.livroService.excluir(id).subscribe({
        next: () => {
          alert('Livro excluído com sucesso!');
          this.carregar();
        },
        error: (err: any) => {
          alert('Erro ao excluir livro: ' + err.message);
        }
      });
    }
  }
}
