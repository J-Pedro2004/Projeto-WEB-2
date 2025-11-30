import { Component, OnInit } from '@angular/core';
import { AutorService } from '../../services/autor.service';
import { CategoriaService } from '../../services/categoria.service';
import { EditoraService } from '../../services/editora.service';
import { LivroService } from '../../services/livro.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <div class="jumbotron bg-primary text-white text-center p-5 rounded mb-4">
        <h1 class="display-4">
          <i class="fas fa-book"></i> Sistema de Gerenciamento de Livros
        </h1>
        <p class="lead">Sistema completo para gerenciamento de biblioteca com relacionamentos e master-detail</p>
      </div>

      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-user fa-3x text-primary mb-3"></i>
              <h5 class="card-title">Autores</h5>
              <p class="card-text">{{ totalAutores }} autores cadastrados</p>
              <a routerLink="/autores" class="btn btn-primary text-white">Gerenciar Autores</a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-tags fa-3x text-success mb-3"></i>
              <h5 class="card-title">Categorias</h5>
              <p class="card-text">{{ totalCategorias }} categorias disponíveis</p>
              <a routerLink="/categorias" class="btn btn-success text-white">Gerenciar Categorias</a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-building fa-3x text-info mb-3"></i>
              <h5 class="card-title">Editoras</h5>
              <p class="card-text">{{ totalEditoras }} editoras registradas</p>
              <a routerLink="/editoras" class="btn btn-info text-white">Gerenciar Editoras</a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-book fa-3x text-warning mb-3"></i>
              <h5 class="card-title">Livros</h5>
              <p class="card-text">{{ totalLivros }} livros no acervo</p>
              <a routerLink="/livros" class="btn btn-warning text-white">Gerenciar Livros</a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <i class="fas fa-shopping-cart fa-3x text-danger mb-3"></i>
              <h5 class="card-title">Pedidos</h5>
              <p class="card-text">{{ totalPedidos }} pedidos registrados</p>
              <a routerLink="/pedidos" class="btn btn-danger text-white">Gerenciar Pedidos</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jumbotron {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    }
    
    .card {
      transition: transform 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
    }
    
    .fa-3x {
      font-size: 3rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  totalAutores = 0;
  totalCategorias = 0;
  totalEditoras = 0;
  totalLivros = 0;
  totalPedidos = 0;

  constructor(
    private autorService: AutorService,
    private categoriaService: CategoriaService,
    private editoraService: EditoraService,
    private livroService: LivroService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.autorService.listar().subscribe(autores => {
      this.totalAutores = autores.length;
    });

    this.categoriaService.listar().subscribe(categorias => {
      this.totalCategorias = categorias.length;
    });

    this.editoraService.listar().subscribe(editoras => {
      this.totalEditoras = editoras.length;
    });

    this.livroService.listar().subscribe(livros => {
      this.totalLivros = livros.length;
    });

    this.pedidoService.listar().subscribe(pedidos => {
      this.totalPedidos = pedidos.length;
    });
  }
}