import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-tags"></i> 
          {{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}
        </h2>
        <button class="btn btn-secondary" (click)="voltar()">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Dados da Categoria</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="categoriaForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-8">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="nome"
                    formControlName="nome"
                    [class.is-invalid]="categoriaForm.get('nome')?.invalid && categoriaForm.get('nome')?.touched"
                    placeholder="Ex: Ficção Científica"
                  >
                  <div class="invalid-feedback" *ngIf="categoriaForm.get('nome')?.errors?.['required']">
                    Nome é obrigatório
                  </div>
                  <div class="invalid-feedback" *ngIf="categoriaForm.get('nome')?.errors?.['minlength']">
                    Nome deve ter no mínimo 3 caracteres
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="cor" class="form-label">Cor</label>
                  <div class="input-group">
                    <input 
                      type="color" 
                      class="form-control form-control-color"
                      id="cor"
                      formControlName="cor"
                      title="Escolha uma cor"
                    >
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="cor"
                      placeholder="#28a745"
                      maxlength="7"
                    >
                  </div>
                  <div class="form-text">Cor para identificação visual da categoria</div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="descricao" class="form-label">Descrição</label>
              <textarea 
                class="form-control"
                id="descricao"
                formControlName="descricao"
                [class.is-invalid]="categoriaForm.get('descricao')?.invalid && categoriaForm.get('descricao')?.touched"
                rows="3"
                placeholder="Descreva o tipo de livros desta categoria..."
              ></textarea>
              <div class="invalid-feedback" *ngIf="categoriaForm.get('descricao')?.errors?.['minlength']">
                Descrição deve ter no mínimo 5 caracteres
              </div>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="ativa"
                  formControlName="ativa"
                >
                <label class="form-check-label" for="ativa">
                  Categoria Ativa
                </label>
              </div>
            </div>

            <!-- Preview da categoria -->
            <div class="mb-3" *ngIf="categoriaForm.get('nome')?.value">
              <label class="form-label">Preview:</label>
              <div class="card categoria-preview" [style.border-left]="'4px solid ' + (categoriaForm.get('cor')?.value || '#28a745')">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <h6 class="card-title mb-0">{{ categoriaForm.get('nome')?.value }}</h6>
                    <span class="badge" [class]="categoriaForm.get('ativa')?.value ? 'bg-success' : 'bg-danger'">
                      {{ categoriaForm.get('ativa')?.value ? 'Ativa' : 'Inativa' }}
                    </span>
                  </div>
                  <p class="card-text text-muted small mt-2" *ngIf="categoriaForm.get('descricao')?.value">
                    {{ categoriaForm.get('descricao')?.value }}
                  </p>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button 
                type="submit" 
                class="btn btn-success"
                [disabled]="categoriaForm.invalid || salvando"
              >
                <span *ngIf="salvando" class="spinner-border spinner-border-sm me-2"></span>
                <i class="fas fa-save"></i> 
                {{ isEditing ? 'Atualizar' : 'Salvar' }}
              </button>
              
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="resetForm()"
              >
                <i class="fas fa-undo"></i> Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categoria-preview {
      max-width: 300px;
    }
    
    .form-control-color {
      width: 60px;
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      display: block;
    }
  `]
})
export class CategoriaFormComponent implements OnInit {
  categoriaForm: FormGroup;
  isEditing = false;
  categoriaId: number | null = null;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaForm = this.createForm();
  }

  ngOnInit(): void {
    this.categoriaId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditing = !!this.categoriaId;

    if (this.isEditing) {
      this.carregarCategoria();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.minLength(5)]],
      cor: ['#28a745'],
      ativa: [true]
    });
  }

  carregarCategoria(): void {
    if (this.categoriaId) {
      this.categoriaService.buscarPorId(this.categoriaId).subscribe({
        next: (categoria: Categoria) => {
          this.categoriaForm.patchValue({
            nome: categoria.nome,
            descricao: categoria.descricao,
            cor: categoria.cor || '#28a745',
            ativa: categoria.ativa
          });
        },
        error: (error: any) => {
          console.error('Erro ao carregar categoria:', error);
          alert('Erro ao carregar dados da categoria!');
          this.voltar();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      this.salvando = true;
      const categoriaData = this.categoriaForm.value;

      const operation = this.isEditing 
        ? this.categoriaService.atualizar(this.categoriaId!, categoriaData)
        : this.categoriaService.criar(categoriaData);

      operation.subscribe({
        next: () => {
          const mensagem = this.isEditing 
            ? 'Categoria atualizada com sucesso!' 
            : 'Categoria cadastrada com sucesso!';
          alert(mensagem);
          this.voltar();
        },
        error: (error: any) => {
          console.error('Erro ao salvar categoria:', error);
          alert('Erro ao salvar categoria!');
          this.salvando = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.categoriaForm.reset();
    this.categoriaForm.patchValue({ 
      ativa: true,
      cor: '#28a745'
    });
  }

  voltar(): void {
    this.router.navigate(['/categorias']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoriaForm.controls).forEach(key => {
      const control = this.categoriaForm.get(key);
      control?.markAsTouched();
    });
  }
}