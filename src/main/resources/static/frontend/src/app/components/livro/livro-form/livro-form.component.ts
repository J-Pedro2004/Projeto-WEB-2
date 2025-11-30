import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LivroService } from '../../../services/livro.service';
import { AutorService } from '../../../services/autor.service';
import { EditoraService } from '../../../services/editora.service';
import { LivroCreate, LivroUpdate } from '../../../models/livro.model';
import { Autor } from '../../../models/autor.model';
import { Editora } from '../../../models/editora.model';

@Component({
  selector: 'app-livro-form',
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">
            <i class="fas fa-book"></i> {{ isEditMode ? 'Editar' : 'Novo' }} Livro
          </h4>
        </div>
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="salvar()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Título *</label>
                <input type="text" class="form-control" formControlName="titulo"
                  [class.is-invalid]="form.get('titulo')?.invalid && form.get('titulo')?.touched">
                <div class="invalid-feedback">Título é obrigatório</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Subtítulo</label>
                <input type="text" class="form-control" formControlName="subtitulo">
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">ISBN</label>
                <input type="text" class="form-control" formControlName="isbn">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Ano de Publicação</label>
                <input type="number" class="form-control" formControlName="anoPublicacao">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Número de Páginas</label>
                <input type="number" class="form-control" formControlName="numeroPaginas">
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Idioma</label>
                <input type="text" class="form-control" formControlName="idioma">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Preço</label>
                <input type="number" step="0.01" class="form-control" formControlName="preco">
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Quantidade em Estoque</label>
                <input type="number" class="form-control" formControlName="quantidadeEstoque">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Autor</label>
                <select class="form-select" formControlName="autorId">
                  <option [value]="null">Selecione um autor</option>
                  <option *ngFor="let autor of autores" [value]="autor.id">
                    {{ autor.nome }} {{ autor.sobrenome }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Editora</label>
                <select class="form-select" formControlName="editoraId">
                  <option [value]="null">Selecione uma editora</option>
                  <option *ngFor="let editora of editoras" [value]="editora.id">
                    {{ editora.nome }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Sinopse</label>
              <textarea class="form-control" formControlName="sinopse" rows="4"></textarea>
            </div>

            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" formControlName="disponivel" id="disponivel">
              <label class="form-check-label" for="disponivel">Disponível</label>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" [disabled]="form.invalid || loading">
                <i class="fas fa-save"></i> {{ loading ? 'Salvando...' : 'Salvar' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="voltar()">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
  `]
})
export class LivroFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  livroId?: number;
  loading = false;
  autores: Autor[] = [];
  editoras: Editora[] = [];

  constructor(
    private fb: FormBuilder,
    private livroService: LivroService,
    private autorService: AutorService,
    private editoraService: EditoraService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarAutores();
    this.carregarEditoras();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.livroId = +id;
      this.carregarLivro(this.livroId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      subtitulo: [''],
      isbn: [''],
      anoPublicacao: [null],
      numeroPaginas: [null],
      idioma: [''],
      preco: [null],
      quantidadeEstoque: [0],
      disponivel: [true],
      sinopse: [''],
      autorId: [null],
      editoraId: [null]
    });
  }

  carregarAutores(): void {
    this.autorService.listar().subscribe({
      next: (data: Autor[]) => {
        this.autores = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar autores:', err);
      }
    });
  }

  carregarEditoras(): void {
    this.editoraService.listar().subscribe({
      next: (data: Editora[]) => {
        this.editoras = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar editoras:', err);
      }
    });
  }

  carregarLivro(id: number): void {
    this.livroService.buscarPorId(id).subscribe({
      next: (livro: any) => {
        this.form.patchValue({
          titulo: livro.titulo,
          subtitulo: livro.subtitulo,
          isbn: livro.isbn,
          anoPublicacao: livro.anoPublicacao,
          numeroPaginas: livro.numeroPaginas,
          idioma: livro.idioma,
          preco: livro.preco,
          quantidadeEstoque: livro.quantidadeEstoque,
          disponivel: livro.disponivel,
          sinopse: livro.sinopse,
          autorId: livro.autor?.id,
          editoraId: livro.editora?.id
        });
      },
      error: (err: any) => {
        alert('Erro ao carregar livro: ' + err.message);
        this.voltar();
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    
    const livro: any = {
      titulo: formValue.titulo,
      subtitulo: formValue.subtitulo,
      isbn: formValue.isbn,
      anoPublicacao: formValue.anoPublicacao,
      numeroPaginas: formValue.numeroPaginas,
      idioma: formValue.idioma,
      preco: formValue.preco,
      quantidadeEstoque: formValue.quantidadeEstoque,
      disponivel: formValue.disponivel,
      sinopse: formValue.sinopse,
      autor: formValue.autorId ? { id: formValue.autorId } : null,
      editora: formValue.editoraId ? { id: formValue.editoraId } : null
    };

    const request = this.isEditMode && this.livroId
      ? this.livroService.atualizar(this.livroId, livro)
      : this.livroService.criar(livro);

    request.subscribe({
      next: () => {
        alert(`Livro ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        this.voltar();
      },
      error: (err: any) => {
        alert(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} livro: ` + err.message);
        this.loading = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/livros']);
  }
}
