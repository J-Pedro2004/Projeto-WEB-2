import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LivroService } from '../../../services/livro.service';
import { AutorService } from '../../../services/autor.service';
import { EditoraService } from '../../../services/editora.service';
import { CategoriaService } from '../../../services/categoria.service';
import { LivroCreate, LivroUpdate } from '../../../models/livro.model';
import { Autor } from '../../../models/autor.model';
import { Editora } from '../../../models/editora.model';
import { Categoria } from '../../../models/categoria.model';

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
                <div class="invalid-feedback" *ngIf="form.get('titulo')?.errors?.['required']">Título é obrigatório</div>
                <div class="invalid-feedback" *ngIf="form.get('titulo')?.errors?.['minlength']">Título deve ter no mínimo 2 caracteres</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Subtítulo</label>
                <input type="text" class="form-control" formControlName="subtitulo"
                  [class.is-invalid]="form.get('subtitulo')?.invalid && form.get('subtitulo')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('subtitulo')?.errors?.['minlength']">Subtítulo deve ter no mínimo 2 caracteres</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">ISBN</label>
                <input type="text" class="form-control" formControlName="isbn"
                  [class.is-invalid]="form.get('isbn')?.invalid && form.get('isbn')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('isbn')?.errors?.['minlength']">ISBN incompleto (mínimo 10 caracteres)</div>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Ano de Publicação</label>
                <input type="number" class="form-control" formControlName="anoPublicacao"
                  [class.is-invalid]="form.get('anoPublicacao')?.invalid && form.get('anoPublicacao')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('anoPublicacao')?.errors?.['min'] || form.get('anoPublicacao')?.errors?.['max']">Ano inválido</div>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Número de Páginas</label>
                <input type="number" class="form-control" formControlName="numeroPaginas"
                  [class.is-invalid]="form.get('numeroPaginas')?.invalid && form.get('numeroPaginas')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('numeroPaginas')?.errors?.['min']">Deve ser maior que 0</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Idioma</label>
                <input type="text" class="form-control" formControlName="idioma"
                  [class.is-invalid]="form.get('idioma')?.invalid && form.get('idioma')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('idioma')?.errors?.['minlength']">Idioma deve ter no mínimo 2 caracteres</div>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Preço</label>
                <input type="number" step="0.01" class="form-control" formControlName="preco"
                  [class.is-invalid]="form.get('preco')?.invalid && form.get('preco')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('preco')?.errors?.['min']">Preço não pode ser negativo</div>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Quantidade em Estoque</label>
                <input type="number" class="form-control" formControlName="quantidadeEstoque"
                  [class.is-invalid]="form.get('quantidadeEstoque')?.invalid && form.get('quantidadeEstoque')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('quantidadeEstoque')?.errors?.['min']">Estoque não pode ser negativo</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Autor *</label>
                <select class="form-select" formControlName="autorId"
                  [class.is-invalid]="form.get('autorId')?.invalid && form.get('autorId')?.touched">
                  <option [value]="null">Selecione um autor</option>
                  <option *ngFor="let autor of autores" [value]="autor.id">
                    {{ autor.nome }} {{ autor.sobrenome }}
                  </option>
                </select>
                <div class="invalid-feedback">Autor é obrigatório</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Editora *</label>
                <select class="form-select" formControlName="editoraId"
                  [class.is-invalid]="form.get('editoraId')?.invalid && form.get('editoraId')?.touched">
                  <option [value]="null">Selecione uma editora</option>
                  <option *ngFor="let editora of editoras" [value]="editora.id">
                    {{ editora.nome }}
                  </option>
                </select>
                <div class="invalid-feedback">Editora é obrigatória</div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Categorias *</label>
              <select multiple class="form-select" formControlName="categoriaIds" size="5"
                [class.is-invalid]="form.get('categoriaIds')?.invalid && form.get('categoriaIds')?.touched">
                <option *ngFor="let categoria of categorias" [value]="categoria.id">
                  {{ categoria.nome }}
                </option>
              </select>
              <div class="form-text">Segure Ctrl (Windows) ou Command (Mac) para selecionar múltiplas opções</div>
              <div class="invalid-feedback">Selecione pelo menos uma categoria</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Sinopse</label>
              <textarea class="form-control" formControlName="sinopse" rows="4"
                [class.is-invalid]="form.get('sinopse')?.invalid && form.get('sinopse')?.touched"></textarea>
              <div class="invalid-feedback" *ngIf="form.get('sinopse')?.errors?.['minlength']">Sinopse deve ter no mínimo 10 caracteres</div>
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
  categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private livroService: LivroService,
    private autorService: AutorService,
    private editoraService: EditoraService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarAutores();
    this.carregarEditoras();
    this.carregarCategorias();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.livroId = +id;
      this.carregarLivro(this.livroId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      subtitulo: ['', [Validators.minLength(2)]],
      isbn: ['', [Validators.minLength(10)]],
      anoPublicacao: [null, [Validators.min(1000), Validators.max(9999)]],
      numeroPaginas: [null, [Validators.min(1)]],
      idioma: ['', [Validators.minLength(2)]],
      preco: [null, [Validators.min(0)]],
      quantidadeEstoque: [0, [Validators.min(0)]],
      disponivel: [true],
      sinopse: ['', [Validators.minLength(10)]],
      autorId: [null, Validators.required],
      editoraId: [null, Validators.required],
      categoriaIds: [[], Validators.required]
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

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar categorias:', err);
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
          editoraId: livro.editora?.id,
          categoriaIds: livro.categorias?.map((c: Categoria) => c.id) || []
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
      editora: formValue.editoraId ? { id: formValue.editoraId } : null,
      categorias: formValue.categoriaIds ? formValue.categoriaIds.map((id: number) => ({ id })) : []
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
