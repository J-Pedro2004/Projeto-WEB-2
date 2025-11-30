# Sistema de Gerenciamento de Livros - Frontend Angular

Este é o frontend Angular para o Sistema de Gerenciamento de Livros, integrado com backend Spring Boot.

## 🚀 **Instalação e Configuração**

### Pré-requisitos
- Node.js 18+ ([Download](https://nodejs.org/))
- Angular CLI 17+ 
- Backend Spring Boot rodando na porta 8080

### 1. **Instalar Node.js e Angular CLI**

```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@17

# Verificar instalação
ng version
```

### 2. **Instalar Dependências do Projeto**

Navegue até a pasta do frontend:
```bash
cd src/main/resources/static/frontend
```

Instale as dependências:
```bash
npm install
```

### 3. **Executar a Aplicação**

#### Modo Desenvolvimento:
```bash
ng serve
```
A aplicação estará disponível em: `http://localhost:4200`

#### Build para Produção:
```bash
ng build --configuration production
```

### 4. **Estrutura do Projeto**

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   ├── autor/
│   │   │   │   ├── autor-list/
│   │   │   │   └── autor-form/
│   │   │   ├── categoria/
│   │   │   ├── editora/
│   │   │   ├── livro/
│   │   │   └── pedido/
│   │   ├── models/
│   │   │   ├── autor.model.ts
│   │   │   ├── categoria.model.ts
│   │   │   ├── editora.model.ts
│   │   │   ├── livro.model.ts
│   │   │   └── pedido.model.ts
│   │   ├── services/
│   │   │   ├── autor.service.ts
│   │   │   ├── categoria.service.ts
│   │   │   ├── editora.service.ts
│   │   │   ├── livro.service.ts
│   │   │   └── pedido.service.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎯 **Funcionalidades Implementadas**

### ✅ **CRUD Completo**
- **Autores**: Cadastro, edição, listagem, busca e exclusão
- **Categorias**: Gerenciamento com cores personalizadas
- **Editoras**: Dados completos com CNPJ, contato e endereço
- **Livros**: Relacionamentos com autores, editoras e categorias
- **Pedidos**: Sistema Master-Detail com itens

### ✅ **Relacionamentos**
- **1:1**: Livro ↔ Editora
- **1:N**: Autor → Livros  
- **N:N**: Livro ↔ Categorias
- **Master-Detail**: Pedido → Itens

### ✅ **Interface**
- Design responsivo com Bootstrap 5.3
- Ícones Font Awesome 6.5
- Navegação por rotas Angular
- Formulários reativos
- Feedback visual e validações

## 🔧 **Integração com Backend**

### URLs da API:
- **Autores**: `/api/autores`
- **Categorias**: `/api/categorias`  
- **Editoras**: `/api/editoras`
- **Livros**: `/api/livros`
- **Pedidos**: `/api/pedidos`

### Configuração do Proxy (se necessário):
Crie um arquivo `proxy.conf.json`:
```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": true,
    "changeOrigin": true
  }
}
```

Execute com proxy:
```bash
ng serve --proxy-config proxy.conf.json
```

## 📱 **Acesso à Aplicação**

### Desenvolvimento:
- Frontend Angular: `http://localhost:4200`
- Backend Spring Boot: `http://localhost:8080`

### Produção:
- Aplicação completa: `http://localhost:8080/frontend/`

## 🛠️ **Comandos Úteis**

```bash
# Gerar novo componente
ng generate component components/exemplo

# Gerar novo serviço  
ng generate service services/exemplo

# Executar testes
ng test

# Build otimizado
ng build --prod

# Verificar dependências
npm audit

# Atualizar dependências
npm update
```

## 🚨 **Solução de Problemas**

### Erro: "Cannot find module '@angular/core'"
```bash
npm install
```

### Erro: CORS
Configure o backend Spring Boot:
```java
@CrossOrigin(origins="http://localhost:4200")
```

### Erro: Porta em uso
```bash
ng serve --port 4201
```

## 📦 **Deploy para Produção**

1. **Build da aplicação:**
```bash
ng build --configuration production
```

2. **Copiar arquivos para Spring Boot:**
```bash
cp -r dist/* ../
```

3. **Restart do Spring Boot**

A aplicação estará disponível em: `http://localhost:8080/frontend/`

---

## 🎨 **Tecnologias Utilizadas**

- **Angular 17** - Framework principal
- **TypeScript** - Linguagem de programação
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.5** - Ícones
- **RxJS** - Programação reativa
- **Angular Router** - Navegação
- **Angular Forms** - Formulários reativos