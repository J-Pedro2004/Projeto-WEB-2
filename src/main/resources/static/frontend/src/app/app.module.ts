import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AutorListComponent } from './components/autor/autor-list/autor-list.component';
import { AutorFormComponent } from './components/autor/autor-form/autor-form.component';
import { CategoriaListComponent } from './components/categoria/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './components/categoria/categoria-form/categoria-form.component';
import { EditoraListComponent } from './components/editora/editora-list/editora-list.component';
import { EditoraFormComponent } from './components/editora/editora-form/editora-form.component';
import { LivroListComponent } from './components/livro/livro-list/livro-list.component';
import { LivroFormComponent } from './components/livro/livro-form/livro-form.component';
import { PedidoListComponent } from './components/pedido/pedido-list/pedido-list.component';
import { PedidoFormComponent } from './components/pedido/pedido-form/pedido-form.component';

// Services
import { AutorService } from './services/autor.service';
import { CategoriaService } from './services/categoria.service';
import { EditoraService } from './services/editora.service';
import { LivroService } from './services/livro.service';
import { PedidoService } from './services/pedido.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'autores', component: AutorListComponent },
  { path: 'autores/novo', component: AutorFormComponent },
  { path: 'autores/editar/:id', component: AutorFormComponent },
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categorias/novo', component: CategoriaFormComponent },
  { path: 'categorias/editar/:id', component: CategoriaFormComponent },
  { path: 'editoras', component: EditoraListComponent },
  { path: 'editoras/novo', component: EditoraFormComponent },
  { path: 'editoras/editar/:id', component: EditoraFormComponent },
  { path: 'livros', component: LivroListComponent },
  { path: 'livros/novo', component: LivroFormComponent },
  { path: 'livros/editar/:id', component: LivroFormComponent },
  { path: 'pedidos/novo', component: PedidoFormComponent },
  { path: 'pedidos/editar/:id', component: PedidoFormComponent },
  { path: 'pedidos', component: PedidoListComponent },
  { path: '**', redirectTo: '' }
];

console.log('Rotas configuradas:', routes);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AutorListComponent,
    AutorFormComponent,
    CategoriaListComponent,
    CategoriaFormComponent,
    EditoraListComponent,
    EditoraFormComponent,
    LivroListComponent,
    LivroFormComponent,
    PedidoListComponent,
    PedidoFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AutorService,
    CategoriaService,
    EditoraService,
    LivroService,
    PedidoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }