import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';

@Component({
  selector: 'app-autor-form',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-user"></i> 
          {{ isEditing ? 'Editar Autor' : 'Novo Autor' }}
        </h2>
        <button class="btn btn-secondary" (click)="voltar()">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Dados do Autor</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="autorForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome *</label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="nome"
                    formControlName="nome"
                    [class.is-invalid]="autorForm.get('nome')?.invalid && autorForm.get('nome')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="autorForm.get('nome')?.invalid && autorForm.get('nome')?.touched">
                    Nome é obrigatório
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="sobrenome" class="form-label">Sobrenome</label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="sobrenome"
                    formControlName="sobrenome"
                    [class.is-invalid]="autorForm.get('sobrenome')?.invalid && autorForm.get('sobrenome')?.touched"
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                  <input 
                    type="date" 
                    class="form-control"
                    id="dataNascimento"
                    formControlName="dataNascimento"
                  >
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="nacionalidade" class="form-label">Nacionalidade</label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="nacionalidade"
                    formControlName="nacionalidade"
                    placeholder="Ex: Brasileira"
                    [class.is-invalid]="autorForm.get('nacionalidade')?.invalid && autorForm.get('nacionalidade')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="autorForm.get('nacionalidade')?.errors?.['minlength']">
                    Nacionalidade muito curta
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="biografia" class="form-label">Biografia</label>
              <textarea 
                class="form-control"
                id="biografia"
                formControlName="biografia"
                rows="4"
                placeholder="Descreva a biografia do autor..."
              ></textarea>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="ativo"
                  formControlName="ativo"
                >
                <label class="form-check-label" for="ativo">
                  Autor Ativo
                </label>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="autorForm.invalid || salvando"
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
    .form-label {
      font-weight: 500;
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      display: block;
    }
  `]
})
export class AutorFormComponent implements OnInit {
  autorForm: FormGroup;
  isEditing = false;
  autorId: number | null = null;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.autorForm = this.createForm();
  }

  ngOnInit(): void {
    this.autorId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditing = !!this.autorId;

    if (this.isEditing) {
      this.carregarAutor();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      sobrenome: ['', [Validators.minLength(2)]],
      dataNascimento: [''],
      nacionalidade: ['', [Validators.minLength(3)]],
      biografia: [''],
      ativo: [true]
    });
  }

  carregarAutor(): void {
    if (this.autorId) {
      this.autorService.buscarPorId(this.autorId).subscribe({
        next: (autor: Autor) => {
          this.autorForm.patchValue({
            nome: autor.nome,
            sobrenome: autor.sobrenome,
            dataNascimento: autor.dataNascimento,
            nacionalidade: autor.nacionalidade,
            biografia: autor.biografia,
            ativo: autor.ativo
          });
        },
        error: (error) => {
          console.error('Erro ao carregar autor:', error);
          alert('Erro ao carregar dados do autor!');
          this.voltar();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.autorForm.valid) {
      this.salvando = true;
      const autorData = this.autorForm.value;

      if (this.isEditing && this.autorId) {
        autorData.id = this.autorId;
      }

      const operation = this.isEditing 
        ? this.autorService.atualizar(this.autorId!, autorData)
        : this.autorService.criar(autorData);

      operation.subscribe({
        next: () => {
          const mensagem = this.isEditing 
            ? 'Autor atualizado com sucesso!' 
            : 'Autor cadastrado com sucesso!';
          alert(mensagem);
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao salvar autor:', error);
          alert('Erro ao salvar autor!');
          this.salvando = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  inativar(): void {
    if (confirm('Tem certeza que deseja inativar este autor?')) {
      this.autorForm.patchValue({ ativo: false });
      this.onSubmit();
    }
  }

  resetForm(): void {
    this.autorForm.reset();
    this.autorForm.patchValue({ ativo: true });
  }

  voltar(): void {
    this.router.navigate(['/autores']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.autorForm.controls).forEach(key => {
      const control = this.autorForm.get(key);
      control?.markAsTouched();
    });
  }
}