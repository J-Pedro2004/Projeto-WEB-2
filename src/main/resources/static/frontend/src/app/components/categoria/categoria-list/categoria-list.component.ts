import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-categoria-list',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-tags"></i> Lista de Categorias</h2>
        <button class="btn btn-success" (click)="novaCategoria()">
          <i class="fas fa-plus"></i> Nova Categoria
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-0">Categorias Cadastradas</h5>
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
            <div class="spinner-border text-success" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="!carregando && categorias.length === 0" class="text-center text-muted">
            <i class="fas fa-tags fa-3x mb-3"></i>
            <p>Nenhuma categoria encontrada.</p>
          </div>

          <div *ngIf="!carregando && categorias.length > 0">
            <div class="row">
              <div class="col-lg-4 col-md-6 mb-3" *ngFor="let categoria of categorias">
                <div class="card h-100 categoria-card" [style.border-left]="'4px solid ' + (categoria.cor || '#28a745')">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h6 class="card-title mb-0">{{ categoria.nome }}</h6>
                      <span class="badge" [class]="categoria.ativa ? 'bg-success' : 'bg-danger'">
                        {{ categoria.ativa ? 'Ativa' : 'Inativa' }}
                      </span>
                    </div>
                    
                    <p class="card-text text-muted small" *ngIf="categoria.descricao">
                      {{ categoria.descricao }}
                    </p>
                    
                    <div class="d-flex align-items-center mb-2" *ngIf="categoria.cor">
                      <div class="color-sample me-2" [style.background-color]="categoria.cor"></div>
                      <small class="text-muted">{{ categoria.cor }}</small>
                    </div>
                    
                    <small class="text-muted">
                      Cadastrada em: {{ categoria.dataCadastro | date:'dd/MM/yyyy' }}
                    </small>
                  </div>
                  
                  <div class="card-footer bg-transparent">
                    <div class="btn-group w-100" role="group">
                      <button 
                        class="btn btn-outline-warning btn-sm" 
                        (click)="editar(categoria.id)"
                        title="Editar"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-outline-danger btn-sm" 
                        (click)="confirmarExclusao(categoria)"
                        title="Excluir"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 2px solid #E5E7EB !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
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
    
    .categoria-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid #E5E7EB !important;
      background: #FFFFFF !important;
    }
    
    .categoria-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15) !important;
    }
    
    .color-sample {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #E5E7EB;
    }
    
    .fa-3x {
      font-size: 3rem;
    }
    
    .text-muted {
      color: #6B7280 !important;
    }
  `]
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  carregando = false;
  termoBusca = '';

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.carregando = true;
    this.categoriaService.listar().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        this.carregando = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar categorias:', error);
        this.carregando = false;
      }
    });
  }

  buscar(): void {
    if (this.termoBusca.trim()) {
      this.carregando = true;
      this.categoriaService.buscarPorNome(this.termoBusca).subscribe({
        next: (categorias: Categoria[]) => {
          this.categorias = categorias;
          this.carregando = false;
        },
        error: (error: any) => {
          console.error('Erro ao buscar categorias:', error);
          this.carregando = false;
        }
      });
    } else {
      this.carregarCategorias();
    }
  }

  novaCategoria(): void {
    this.router.navigate(['/categorias/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/categorias/editar', id]);
  }

  confirmarExclusao(categoria: Categoria): void {
    if (confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) {
      this.excluir(categoria.id);
    }
  }

  excluir(id: number): void {
    this.categoriaService.excluir(id).subscribe({
      next: () => {
        this.carregarCategorias();
        alert('Categoria excluída com sucesso!');
      },
      error: (error: any) => {
        console.error('Erro ao excluir categoria:', error);
        alert('Erro ao excluir categoria!');
      }
    });
  }
}