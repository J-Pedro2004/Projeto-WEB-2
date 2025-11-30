import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../../../services/pedido.service';
import { LivroService } from '../../../services/livro.service';
import { Pedido, PedidoCreate, PedidoUpdate, StatusPedido } from '../../../models/pedido.model';
import { Livro } from '../../../models/livro.model';

@Component({
  selector: 'app-pedido-form',
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-shopping-cart"></i> 
          {{ pedidoId ? 'Editar Pedido' : 'Novo Pedido' }}
        </h2>
        <button class="btn btn-secondary" (click)="voltar()">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Dados do Pedido</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="pedidoForm">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nome do Cliente *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="nomeCliente"
                    placeholder="Digite o nome do cliente"
                    [class.is-invalid]="pedidoForm.get('nomeCliente')?.invalid && pedidoForm.get('nomeCliente')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="pedidoForm.get('nomeCliente')?.errors?.['required']">
                    Nome é obrigatório
                  </div>
                  <div class="invalid-feedback" *ngIf="pedidoForm.get('nomeCliente')?.errors?.['minlength']">
                    Nome deve ter no mínimo 3 caracteres
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Email do Cliente</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    formControlName="emailCliente"
                    placeholder="email@exemplo.com"
                  >
                  <div class="text-danger" *ngIf="pedidoForm.get('emailCliente')?.invalid && pedidoForm.get('emailCliente')?.touched">
                    Email inválido
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Telefone do Cliente</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="telefoneCliente"
                    placeholder="(00) 00000-0000"
                    [class.is-invalid]="pedidoForm.get('telefoneCliente')?.invalid && pedidoForm.get('telefoneCliente')?.touched"
                  >
                  <div class="text-danger" *ngIf="pedidoForm.get('telefoneCliente')?.errors?.['minlength']">
                    Telefone incompleto (mínimo 10 dígitos)
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Status *</label>
                  <select class="form-control" formControlName="status">
                    <option value="PENDENTE">Pendente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="PREPARANDO">Em Preparação</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="ENTREGUE">Entregue</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Data do Pedido *</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    formControlName="dataPedido"
                  >
                </div>
              </div>

              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Endereço de Entrega</label>
                  <textarea 
                    class="form-control" 
                    formControlName="enderecoEntrega" 
                    rows="2"
                    placeholder="Rua, número, complemento, bairro, cidade, estado"
                    [class.is-invalid]="pedidoForm.get('enderecoEntrega')?.invalid && pedidoForm.get('enderecoEntrega')?.touched"
                  ></textarea>
                  <div class="invalid-feedback" *ngIf="pedidoForm.get('enderecoEntrega')?.errors?.['minlength']">
                    Endereço deve ter no mínimo 5 caracteres
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Observações</label>
                  <textarea 
                    class="form-control" 
                    formControlName="observacoes" 
                    rows="3"
                    placeholder="Observações sobre o pedido..."
                    [class.is-invalid]="pedidoForm.get('observacoes')?.invalid && pedidoForm.get('observacoes')?.touched"
                  ></textarea>
                  <div class="invalid-feedback" *ngIf="pedidoForm.get('observacoes')?.errors?.['minlength']">
                    Observações devem ter no mínimo 5 caracteres
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Seção de Itens do Pedido -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Itens do Pedido</h5>
        </div>
        <div class="card-body">
          <div class="row align-items-end mb-4">
            <div class="col-md-6">
              <label class="form-label">Livro</label>
              <select class="form-select" [(ngModel)]="livroSelecionadoId">
                <option [ngValue]="null">Selecione um livro...</option>
                <option *ngFor="let livro of livros" [value]="livro.id" [disabled]="!livro.disponivel">
                  {{ livro.titulo }} - {{ livro.preco | currency:'BRL':'symbol':'1.2-2' }} {{ !livro.disponivel ? '(Indisponível)' : '' }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Quantidade</label>
              <input type="number" class="form-control" [(ngModel)]="quantidadeSelecionada" min="1">
            </div>
            <div class="col-md-3">
              <button class="btn btn-success w-100" (click)="adicionarItem()" [disabled]="!livroSelecionadoId">
                <i class="fas fa-plus"></i> Adicionar Item
              </button>
            </div>
          </div>

          <div class="table-responsive" *ngIf="itensPedido.length > 0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Livro</th>
                  <th>Preço Unit.</th>
                  <th>Qtd</th>
                  <th>Subtotal</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of itensPedido; let i = index">
                  <td>{{ item.livroTitulo }}</td>
                  <td>{{ item.precoUnitario | currency:'BRL':'symbol':'1.2-2' }}</td>
                  <td>{{ item.quantidade }}</td>
                  <td>{{ (item.precoUnitario * item.quantidade) | currency:'BRL':'symbol':'1.2-2' }}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" (click)="removerItem(i)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="table-primary">
                  <td colspan="3" class="text-end"><strong>Total:</strong></td>
                  <td colspan="2"><strong>{{ calcularTotal() | currency:'BRL':'symbol':'1.2-2' }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div *ngIf="itensPedido.length === 0" class="text-center text-muted py-3">
            Nenhum item adicionado ao pedido.
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-end mb-5">
        <button type="button" class="btn btn-secondary" (click)="voltar()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" class="btn btn-primary" (click)="salvar()" [disabled]="pedidoForm.invalid || salvando || itensPedido.length === 0">
          <i class="fas fa-save"></i> {{ salvando ? 'Salvando...' : 'Salvar Pedido' }}
        </button>
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
  `]
})
export class PedidoFormComponent implements OnInit {
  pedidoForm!: FormGroup;
  pedidoId?: number;
  salvando = false;
  
  livros: Livro[] = [];
  itensPedido: any[] = [];
  livroSelecionadoId: number | null = null;
  quantidadeSelecionada: number = 1;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private livroService: LivroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('PedidoFormComponent inicializado');
    this.inicializarFormulario();
    this.carregarLivros();
    
    this.route.params.subscribe(params => {
      console.log('Parâmetros da rota:', params);
      if (params['id']) {
        this.pedidoId = +params['id'];
        this.carregarPedido(this.pedidoId);
      }
    });
  }

  inicializarFormulario(): void {
    const hoje = new Date().toISOString().split('T')[0];
    
    this.pedidoForm = this.fb.group({
      nomeCliente: ['', [Validators.required, Validators.minLength(3)]],
      emailCliente: ['', [Validators.email]],
      telefoneCliente: ['', [Validators.minLength(10)]],
      status: [StatusPedido.PENDENTE, Validators.required],
      dataPedido: [hoje, Validators.required],
      enderecoEntrega: ['', [Validators.minLength(5)]],
      observacoes: ['', [Validators.minLength(5)]]
    });
  }

  carregarLivros(): void {
    this.livroService.listar().subscribe({
      next: (livros) => {
        // Não filtramos mais, para mostrar todos e validar na seleção
        this.livros = livros;
      },
      error: (error) => {
        console.error('Erro ao carregar livros:', error);
      }
    });
  }

  carregarPedido(id: number): void {
    this.pedidoService.buscarPorId(id).subscribe({
      next: (pedido) => {
        this.pedidoForm.patchValue({
          nomeCliente: pedido.nomeCliente,
          emailCliente: pedido.emailCliente,
          telefoneCliente: pedido.telefoneCliente,
          status: pedido.status,
          dataPedido: pedido.dataPedido ? pedido.dataPedido.split('T')[0] : '',
          enderecoEntrega: pedido.enderecoEntrega,
          observacoes: pedido.observacoes
        });
        
        // Carregar itens existentes
        if (pedido.itens) {
          this.itensPedido = pedido.itens.map(item => ({
            livroId: item.livro.id,
            livroTitulo: item.livro.titulo,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario
          }));
        }
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        alert('Erro ao carregar pedido!');
        this.voltar();
      }
    });
  }

  adicionarItem(): void {
    if (!this.livroSelecionadoId || this.quantidadeSelecionada < 1) return;

    const livro = this.livros.find(l => l.id == this.livroSelecionadoId);
    if (livro) {
      // Validação de disponibilidade
      if (!livro.disponivel) {
        alert(`O livro "${livro.titulo}" não está disponível para venda.`);
        return;
      }

      // Verificar se já existe
      const itemExistente = this.itensPedido.find(i => i.livroId === livro.id);
      if (itemExistente) {
        itemExistente.quantidade += this.quantidadeSelecionada;
      } else {
        this.itensPedido.push({
          livroId: livro.id,
          livroTitulo: livro.titulo,
          quantidade: this.quantidadeSelecionada,
          precoUnitario: livro.preco
        });
      }
      
      // Resetar seleção
      this.livroSelecionadoId = null;
      this.quantidadeSelecionada = 1;
    }
  }

  removerItem(index: number): void {
    this.itensPedido.splice(index, 1);
  }

  calcularTotal(): number {
    return this.itensPedido.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
  }

  salvar(): void {
    if (this.pedidoForm.invalid) {
      Object.keys(this.pedidoForm.controls).forEach(key => {
        this.pedidoForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.itensPedido.length === 0) {
      alert('Adicione pelo menos um item ao pedido!');
      return;
    }

    this.salvando = true;
    const formValue = this.pedidoForm.value;

    const itensMapeados = this.itensPedido.map(item => ({
      livro: { id: item.livroId },
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario
    }));

    if (this.pedidoId) {
      const pedidoUpdate: PedidoUpdate = {
        id: this.pedidoId,
        dataPedido: formValue.dataPedido,
        status: formValue.status,
        nomeCliente: formValue.nomeCliente,
        emailCliente: formValue.emailCliente,
        telefoneCliente: formValue.telefoneCliente,
        enderecoEntrega: formValue.enderecoEntrega,
        observacoes: formValue.observacoes,
        itens: itensMapeados
      };
      
      this.pedidoService.atualizar(this.pedidoId, pedidoUpdate).subscribe({
        next: () => {
          alert('Pedido atualizado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao atualizar pedido:', error);
          const msg = error.error?.error || 'Erro ao atualizar pedido!';
          alert(msg);
          this.salvando = false;
        }
      });
    } else {
      const pedidoCreate: PedidoCreate = {
        dataPedido: formValue.dataPedido,
        status: formValue.status,
        nomeCliente: formValue.nomeCliente,
        emailCliente: formValue.emailCliente,
        telefoneCliente: formValue.telefoneCliente,
        enderecoEntrega: formValue.enderecoEntrega,
        observacoes: formValue.observacoes,
        itens: itensMapeados
      };
      
      this.pedidoService.criar(pedidoCreate).subscribe({
        next: () => {
          alert('Pedido criado com sucesso!');
          this.voltar();
        },
        error: (error) => {
          console.error('Erro ao criar pedido:', error);
          const msg = error.error?.error || 'Erro ao criar pedido!';
          alert(msg);
          this.salvando = false;
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/pedidos']);
  }
}
