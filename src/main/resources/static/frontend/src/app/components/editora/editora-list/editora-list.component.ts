import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditoraService } from '../../../services/editora.service';
import { Editora } from '../../../models/editora.model';

@Component({
  selector: 'app-editora-list',
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h4 class="mb-0">
            <i class="fas fa-building"></i> Gerenciamento de Editoras
          </h4>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3">
            <button class="btn btn-primary" (click)="novo()">
              <i class="fas fa-plus"></i> Nova Editora
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
                  <th>Nome</th>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Cidade/UF</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="editoras.length === 0">
                  <td colspan="8" class="text-center">Nenhuma editora encontrada</td>
                </tr>
                <tr *ngFor="let editora of editoras">
                  <td>{{ editora.id }}</td>
                  <td>{{ editora.nome }}</td>
                  <td>{{ editora.razaoSocial }}</td>
                  <td>{{ editora.cnpj || '-' }}</td>
                  <td>{{ editora.endereco?.cidade || '-' }} / {{ editora.endereco?.uf || '-' }}</td>
                  <td>{{ editora.telefone || '-' }}</td>
                  <td>{{ editora.email || '-' }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning me-1" (click)="editar(editora.id!)" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="excluir(editora.id!)" title="Excluir">
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
export class EditoraListComponent implements OnInit {
  editoras: Editora[] = [];
  loading = false;
  error = '';

  constructor(
    private editoraService: EditoraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.error = '';
    this.editoraService.listar().subscribe({
      next: (data: Editora[]) => {
        this.editoras = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar editoras: ' + err.message;
        this.loading = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/editoras/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/editoras/editar', id]);
  }

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir esta editora?')) {
      this.editoraService.excluir(id).subscribe({
        next: () => {
          alert('Editora excluída com sucesso!');
          this.carregar();
        },
        error: (err: any) => {
          alert('Erro ao excluir editora: ' + err.message);
        }
      });
    }
  }
}
