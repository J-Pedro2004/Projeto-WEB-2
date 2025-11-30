import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutorService } from './services/autor.service';
import { CategoriaService } from './services/categoria.service';
import { EditoraService } from './services/editora.service';
import { LivroService } from './services/livro.service';
import { PedidoService } from './services/pedido.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" routerLink="/">
            <i class="fas fa-book"></i> Sistema de Gerenciamento
          </a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                  <i class="fas fa-home"></i> Início
                </a>
              </li>
              <li class="nav-item dropdown" (mouseenter)="carregarAutores()">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user"></i> Autores
                </a>
                <ul class="dropdown-menu dropdown-menu-wide">
                  <li class="dropdown-header">
                    <div class="d-flex justify-content-between align-items-center">
                      <span><i class="fas fa-list"></i> Últimos Autores</span>
                      <a routerLink="/autores" class="btn btn-sm btn-primary">Ver Todos</a>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="autoresPreview.length === 0" class="dropdown-item-text text-muted">
                    <i class="fas fa-spinner fa-spin"></i> Carregando...
                  </li>
                  <li *ngFor="let autor of autoresPreview">
                    <a class="dropdown-item preview-item" [routerLink]="['/autores/editar', autor.id]">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <i class="fas fa-user-circle text-primary"></i>
                          <strong>{{ autor.nome }}</strong>
                        </div>
                        <small class="text-muted">{{ autor.nacionalidade }}</small>
                      </div>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-success" routerLink="/autores/novo">
                    <i class="fas fa-plus-circle"></i> Adicionar Novo Autor
                  </a></li>
                </ul>
              </li>
              <li class="nav-item dropdown" (mouseenter)="carregarCategorias()">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-tags"></i> Categorias
                </a>
                <ul class="dropdown-menu dropdown-menu-wide">
                  <li class="dropdown-header">
                    <div class="d-flex justify-content-between align-items-center">
                      <span><i class="fas fa-list"></i> Últimas Categorias</span>
                      <a routerLink="/categorias" class="btn btn-sm btn-primary">Ver Todas</a>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="categoriasPreview.length === 0" class="dropdown-item-text text-muted">
                    <i class="fas fa-spinner fa-spin"></i> Carregando...
                  </li>
                  <li *ngFor="let categoria of categoriasPreview">
                    <a class="dropdown-item preview-item" [routerLink]="['/categorias/editar', categoria.id]">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <i class="fas fa-tag text-warning"></i>
                          <strong>{{ categoria.nome }}</strong>
                        </div>
                        <small class="text-muted" *ngIf="categoria.descricao">
                          {{ categoria.descricao.substring(0, 30) }}{{ categoria.descricao.length > 30 ? '...' : '' }}
                        </small>
                      </div>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-success" routerLink="/categorias/novo">
                    <i class="fas fa-plus-circle"></i> Adicionar Nova Categoria
                  </a></li>
                </ul>
              </li>
              <li class="nav-item dropdown" (mouseenter)="carregarEditoras()">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-building"></i> Editoras
                </a>
                <ul class="dropdown-menu dropdown-menu-wide">
                  <li class="dropdown-header">
                    <div class="d-flex justify-content-between align-items-center">
                      <span><i class="fas fa-list"></i> Últimas Editoras</span>
                      <a routerLink="/editoras" class="btn btn-sm btn-primary">Ver Todas</a>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="editorasPreview.length === 0" class="dropdown-item-text text-muted">
                    <i class="fas fa-spinner fa-spin"></i> Carregando...
                  </li>
                  <li *ngFor="let editora of editorasPreview">
                    <a class="dropdown-item preview-item" [routerLink]="['/editoras/editar', editora.id]">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <i class="fas fa-building text-info"></i>
                          <strong>{{ editora.nome }}</strong>
                        </div>
                        <small class="text-muted" *ngIf="editora.cidade">{{ editora.cidade }}</small>
                      </div>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-success" routerLink="/editoras/novo">
                    <i class="fas fa-plus-circle"></i> Adicionar Nova Editora
                  </a></li>
                </ul>
              </li>
              <li class="nav-item dropdown" (mouseenter)="carregarLivros()">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-book"></i> Livros
                </a>
                <ul class="dropdown-menu dropdown-menu-wide">
                  <li class="dropdown-header">
                    <div class="d-flex justify-content-between align-items-center">
                      <span><i class="fas fa-list"></i> Últimos Livros</span>
                      <a routerLink="/livros" class="btn btn-sm btn-primary">Ver Todos</a>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="livrosPreview.length === 0" class="dropdown-item-text text-muted">
                    <i class="fas fa-spinner fa-spin"></i> Carregando...
                  </li>
                  <li *ngFor="let livro of livrosPreview">
                    <a class="dropdown-item preview-item" [routerLink]="['/livros/editar', livro.id]">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <i class="fas fa-book text-success"></i>
                          <strong>{{ livro.titulo }}</strong>
                        </div>
                        <small class="text-muted">{{ livro.autor?.nome }}</small>
                      </div>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-success" routerLink="/livros/novo">
                    <i class="fas fa-plus-circle"></i> Adicionar Novo Livro
                  </a></li>
                </ul>
              </li>
              <li class="nav-item dropdown" (mouseenter)="carregarPedidos()">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-shopping-cart"></i> Pedidos
                </a>
                <ul class="dropdown-menu dropdown-menu-wide">
                  <li class="dropdown-header">
                    <div class="d-flex justify-content-between align-items-center">
                      <span><i class="fas fa-list"></i> Últimos Pedidos</span>
                      <a routerLink="/pedidos" class="btn btn-sm btn-primary">Ver Todos</a>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li *ngIf="pedidosPreview.length === 0" class="dropdown-item-text text-muted">
                    <i class="fas fa-spinner fa-spin"></i> Carregando...
                  </li>
                  <li *ngFor="let pedido of pedidosPreview">
                    <a class="dropdown-item preview-item" [routerLink]="['/pedidos/editar', pedido.id]">
                      <div class="d-flex justify-content-between align-items-center gap-3">
                        <div>
                          <i class="fas fa-receipt text-danger"></i>
                          <strong>{{ pedido.nomeCliente }}</strong>
                        </div>
                        <span class="badge" [class.bg-success]="pedido.status === 'ENTREGUE'"
                              [class.bg-warning]="pedido.status === 'PENDENTE'"
                              [class.bg-info]="pedido.status === 'ENVIADO'"
                              [class.bg-primary]="pedido.status === 'CONFIRMADO'"
                              [class.bg-secondary]="pedido.status === 'CANCELADO'">
                          {{ pedido.status }}
                        </span>
                      </div>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item text-success" routerLink="/pedidos/novo">
                    <i class="fas fa-plus-circle"></i> Adicionar Novo Pedido
                  </a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <main class="container mt-4">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer mt-5 py-3 bg-light">
        <div class="container text-center">
          <span class="text-muted">© 2025 Sistema de Gerenciamento de Livros</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    main {
      flex: 1;
    }
    
    .navbar {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .navbar-brand {
      font-weight: bold;
      font-size: 1.3rem;
      transition: all 0.3s ease;
    }
    
    .navbar-brand:hover {
      transform: scale(1.05);
    }
    
    .nav-link {
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      padding: 0.5rem 1rem !important;
      border-radius: 5px;
      margin: 0 0.2rem;
    }
    
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 700;
    }
    
    /* Mostra dropdown no hover e click */
    .dropdown-menu {
      position: absolute;
    }
    
    .nav-item.dropdown:hover > .dropdown-menu,
    .nav-item.dropdown .dropdown-menu.show {
      display: block;
      animation: fadeInDown 0.3s ease-in-out;
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      padding: 0.5rem;
      min-width: 350px;
      margin-top: 0.5rem;
    }
    
    .dropdown-menu-wide {
      min-width: 400px;
      max-height: 500px;
      overflow-y: auto;
    }
    
    .dropdown-header {
      padding: 0.75rem 1rem;
      font-weight: bold;
      color: #1F2937;
    }
    
    .dropdown-header .btn-sm {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    
    .dropdown-item {
      border-radius: 5px;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .preview-item {
      padding: 0.75rem 1rem !important;
      border-bottom: 1px solid #E5E7EB;
    }
    
    .preview-item:last-of-type {
      border-bottom: none;
    }
    
    .preview-item:hover {
      background: #F0F9FF !important;
      color: #1F2937 !important;
      transform: translateX(5px);
    }
    
    .preview-item strong {
      font-size: 0.95rem;
      color: #1F2937;
    }
    
    .preview-item small {
      font-size: 0.8rem;
    }
    
    .preview-item .badge {
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
    }
    
    .dropdown-item.text-success:hover {
      background: #10B981 !important;
      color: white !important;
    }
    
    .dropdown-item-text {
      padding: 1rem;
      text-align: center;
    }
    
    .dropdown-divider {
      margin: 0.5rem 0;
    }
    
    .footer {
      margin-top: auto;
    }
    
    /* Scrollbar customizada para dropdown */
    .dropdown-menu-wide::-webkit-scrollbar {
      width: 8px;
    }
    
    .dropdown-menu-wide::-webkit-scrollbar-track {
      background: #F3F4F6;
      border-radius: 4px;
    }
    
    .dropdown-menu-wide::-webkit-scrollbar-thumb {
      background: #9CA3AF;
      border-radius: 4px;
    }
    
    .dropdown-menu-wide::-webkit-scrollbar-thumb:hover {
      background: #6B7280;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Sistema de Gerenciamento';
  
  autoresPreview: any[] = [];
  categoriasPreview: any[] = [];
  editorasPreview: any[] = [];
  livrosPreview: any[] = [];
  pedidosPreview: any[] = [];

  constructor(
    private autorService: AutorService,
    private categoriaService: CategoriaService,
    private editoraService: EditoraService,
    private livroService: LivroService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carrega dados iniciais
    this.carregarAutores();
    this.carregarCategorias();
    this.carregarEditoras();
    this.carregarLivros();
    this.carregarPedidos();
  }

  carregarAutores(): void {
    this.autorService.listar().subscribe({
      next: (autores) => {
        this.autoresPreview = autores.slice(0, 5); // Pega apenas os 5 primeiros
      },
      error: (error) => {
        console.error('Erro ao carregar autores:', error);
      }
    });
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categoriasPreview = categorias.slice(0, 5);
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  carregarEditoras(): void {
    this.editoraService.listar().subscribe({
      next: (editoras) => {
        this.editorasPreview = editoras.slice(0, 5);
      },
      error: (error) => {
        console.error('Erro ao carregar editoras:', error);
      }
    });
  }

  carregarLivros(): void {
    this.livroService.listar().subscribe({
      next: (livros) => {
        this.livrosPreview = livros.slice(0, 5);
      },
      error: (error) => {
        console.error('Erro ao carregar livros:', error);
      }
    });
  }

  carregarPedidos(): void {
    this.pedidoService.listar().subscribe({
      next: (pedidos) => {
        this.pedidosPreview = pedidos.slice(0, 5);
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    });
  }

  navegarParaNovoPedido(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Navegando para novo pedido...');
    this.router.navigate(['pedidos/novo']).then(success => {
      console.log('Navegação para pedidos/novo:', success ? 'sucesso' : 'falhou');
    });
  }
}