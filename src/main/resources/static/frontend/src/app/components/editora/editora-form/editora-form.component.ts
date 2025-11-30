import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditoraService } from '../../../services/editora.service';
import { EditoraCreate } from '../../../models/editora.model';

@Component({
  selector: 'app-editora-form',
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">
            <i class="fas fa-building"></i> {{ isEditMode ? 'Editar' : 'Nova' }} Editora
          </h4>
        </div>
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="salvar()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nome *</label>
                <input type="text" class="form-control" formControlName="nome"
                  [class.is-invalid]="form.get('nome')?.invalid && form.get('nome')?.touched">
                <div class="invalid-feedback">Nome é obrigatório</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Razão Social *</label>
                <input type="text" class="form-control" formControlName="razaoSocial"
                  [class.is-invalid]="form.get('razaoSocial')?.invalid && form.get('razaoSocial')?.touched">
                <div class="invalid-feedback">Razão Social é obrigatória</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">CNPJ *</label>
                <input type="text" class="form-control" formControlName="cnpj"
                  [class.is-invalid]="form.get('cnpj')?.invalid && form.get('cnpj')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('cnpj')?.errors?.['required']">CNPJ é obrigatório</div>
                <div class="invalid-feedback" *ngIf="form.get('cnpj')?.errors?.['minlength']">CNPJ incompleto (mínimo 14 dígitos)</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Telefone</label>
                <input type="text" class="form-control" formControlName="telefone"
                  [class.is-invalid]="form.get('telefone')?.invalid && form.get('telefone')?.touched">
                <div class="invalid-feedback" *ngIf="form.get('telefone')?.errors?.['minlength']">Telefone incompleto (mínimo 10 dígitos)</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email"
                  [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched">
                <div class="invalid-feedback">Email inválido</div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Website</label>
                <input type="text" class="form-control" formControlName="website">
              </div>
            </div>

            <hr>
            <div formGroupName="endereco">
              <h5 class="mb-3">Endereço</h5>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Logradouro</label>
                  <input type="text" class="form-control" formControlName="logradouro">
                </div>
                <div class="col-md-2 mb-3">
                  <label class="form-label">Número</label>
                  <input type="text" class="form-control" formControlName="numero">
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Bairro</label>
                  <input type="text" class="form-control" formControlName="bairro">
                </div>
              </div>
              <div class="row">
                <div class="col-md-5 mb-3">
                  <label class="form-label">Cidade</label>
                  <input type="text" class="form-control" formControlName="cidade">
                </div>
                <div class="col-md-2 mb-3">
                  <label class="form-label">UF</label>
                  <input type="text" class="form-control" formControlName="uf">
                </div>
                <div class="col-md-5 mb-3">
                  <label class="form-label">CEP</label>
                  <input type="text" class="form-control" formControlName="cep"
                    [class.is-invalid]="form.get('endereco.cep')?.invalid && form.get('endereco.cep')?.touched">
                  <div class="invalid-feedback" *ngIf="form.get('endereco.cep')?.errors?.['minlength']">CEP incompleto (mínimo 8 dígitos)</div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 mt-3">
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
export class EditoraFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  editoraId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editoraId = +id;
      this.carregarEditora(this.editoraId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      telefone: ['', [Validators.minLength(10)]],
      email: ['', [Validators.email]],
      website: [''],
      endereco: this.fb.group({
        logradouro: [''],
        numero: [''],
        bairro: [''],
        cidade: [''],
        uf: [''],
        cep: ['', [Validators.minLength(8)]]
      })
    });
  }

  carregarEditora(id: number): void {
    this.editoraService.buscarPorId(id).subscribe({
      next: (editora: any) => {
        this.form.patchValue({
          nome: editora.nome,
          razaoSocial: editora.razaoSocial,
          cnpj: editora.cnpj,
          telefone: editora.telefone,
          email: editora.email,
          website: editora.website,
          endereco: editora.endereco || {}
        });
      },
      error: (err: any) => {
        alert('Erro ao carregar editora: ' + err.message);
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
    const editora: any = this.form.value;
    editora.ativa = true;

    const request = this.isEditMode && this.editoraId
      ? this.editoraService.atualizar(this.editoraId, editora)
      : this.editoraService.criar(editora);

    request.subscribe({
      next: () => {
        alert(`Editora ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
        this.voltar();
      },
      error: (err: any) => {
        console.error('Erro detalhado:', err);
        let msg = 'Erro desconhecido';
        
        // Tenta extrair a mensagem de erro de várias formas
        if (err.error) {
          if (typeof err.error === 'object' && err.error.error) {
            msg = err.error.error; // Formato { "error": "Mensagem" }
          } else if (typeof err.error === 'string') {
            msg = err.error; // Backend retornou string direta
          } else {
             // Tenta ver se tem message dentro do objeto de erro (padrão Spring Boot as vezes)
             msg = err.error.message || JSON.stringify(err.error);
          }
        } else if (err.message) {
          msg = err.message;
        }

        alert(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} editora: ` + msg);
        this.loading = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/editoras']);
  }
}
