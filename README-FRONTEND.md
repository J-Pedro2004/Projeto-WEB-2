# Sistema de Gestão de Livros - Aplicação Completa

## 📚 Descrição
Sistema completo de gestão de livros desenvolvido com **Spring Boot 3.5.4** (backend) e **JavaScript/HTML/CSS** (frontend), incluindo relacionamentos entre entidades e funcionalidades CRUD completas.

## 🏗️ Arquitetura da Aplicação

### Backend (Spring Boot + PostgreSQL)
- **Framework**: Spring Boot 3.5.4
- **Banco de Dados**: PostgreSQL (com fallback H2 para desenvolvimento)
- **ORM**: Hibernate/JPA
- **API**: REST Controllers com documentação
- **Relacionamentos**: 1:1, 1:N, N:N implementados

### Frontend (JavaScript Vanilla)
- **Interface**: HTML5, CSS3, Bootstrap 5.3
- **JavaScript**: ES6+ com fetch API
- **Design**: Responsivo com Material Design principles
- **Funcionalidades**: SPA (Single Page Application)

## 📊 Modelo de Dados

### Entidades Principais

#### 1. Autor (1:N com Livro)
```java
- id: Long (PK)
- nome: String (required)
- sobrenome: String
- dataNascimento: LocalDate
- nacionalidade: String
- biografia: String (TEXT)
- ativo: Boolean
```

#### 2. Categoria (N:N com Livro)
```java
- id: Long (PK)
- nome: String (required, unique)
- descricao: String
- cor: String (hex color)
```

#### 3. Editora (1:1 com Livro)
```java
- id: Long (PK)
- razaoSocial: String (required)
- cnpj: String (required, unique)
- endereco: String
- telefone: String
- email: String
- site: String
```

#### 4. Livro (Entidade Central)
```java
- id: Long (PK)
- titulo: String (required)
- subtitulo: String
- isbn: String (unique)
- anoPublicacao: Integer
- numeroPaginas: Integer
- idioma: String
- preco: BigDecimal
- quantidadeEstoque: Integer
- disponivel: Boolean
- sinopse: String (TEXT)
- dataCadastro: LocalDate
- autor: Autor (ManyToOne)
- editora: Editora (OneToOne)
- categorias: Set<Categoria> (ManyToMany)
```

#### 5. Pedido (Master - Padrão Master-Detail)
```java
- id: Long (PK)
- dataPedido: LocalDateTime
- status: StatusPedido (ENUM)
- nomeCliente: String (required)
- emailCliente: String
- enderecoEntrega: String
- valorTotal: BigDecimal
- observacoes: String
- itens: List<ItemPedido> (OneToMany)
```

#### 6. ItemPedido (Detail - Padrão Master-Detail)
```java
- id: Long (PK)
- livro: Livro (ManyToOne)
- quantidade: Integer
- preco: BigDecimal
- subtotal: BigDecimal (calculado)
- pedido: Pedido (ManyToOne)
```

## 🚀 Funcionalidades Implementadas

### ✅ CRUD Completo para Todas as Entidades
- **Autores**: Listar, criar, editar, visualizar, inativar, excluir
- **Categorias**: Listar, criar, editar, visualizar, excluir
- **Editoras**: Listar, criar, editar, visualizar, excluir
- **Livros**: Listar, criar, editar, visualizar, excluir (com relacionamentos)
- **Pedidos**: Listar, criar, editar, visualizar, excluir (master-detail)

### ✅ Relacionamentos Implementados
- **1:N**: Autor → Livros
- **1:1**: Editora ↔ Livro
- **N:N**: Livro ↔ Categorias
- **Master-Detail**: Pedido → ItemPedido

### ✅ Funcionalidades Especiais
- **Busca**: Autores por nome, livros por título
- **Filtros**: Livros disponíveis, autores ativos
- **Validações**: Frontend e backend
- **Status Management**: Ativar/inativar entidades
- **Cálculos Automáticos**: Subtotais e totais em pedidos

## 📱 Interface do Usuário

### Dashboard
- Estatísticas em tempo real
- Cards informativos com contadores
- Navegação intuitiva

### Telas CRUD
- **Listagem**: Tabelas responsivas com ações
- **Formulários**: Validação em tempo real
- **Visualização**: Modais com detalhes completos
- **Busca**: Filtros dinâmicos

### Funcionalidades UX
- **Alerts**: Feedback visual para todas as ações
- **Loading**: Indicadores de carregamento
- **Confirmação**: Modais de confirmação para exclusões
- **Responsive**: Design adaptável para mobile

## 🛠️ Tecnologias Utilizadas

### Backend
```xml
- Spring Boot 3.5.4
- Spring Data JPA
- PostgreSQL Driver
- H2 Database (desenvolvimento)
- Jackson (JSON)
- Maven
```

### Frontend
```html
- HTML5 Semantic
- CSS3 + Bootstrap 5.3
- JavaScript ES6+
- Bootstrap Icons
- Fetch API
- Local Storage (cache)
```

## 📡 Endpoints da API

### Autores
```http
GET    /api/autores           # Listar todos
GET    /api/autores/ativos    # Listar ativos
GET    /api/autores/{id}      # Buscar por ID
GET    /api/autores/buscar    # Buscar por nome
POST   /api/autores           # Criar
PUT    /api/autores/{id}      # Atualizar
DELETE /api/autores/{id}      # Excluir
PATCH  /api/autores/{id}/inativar # Inativar
```

### Categorias
```http
GET    /api/categorias        # Listar todas
GET    /api/categorias/{id}   # Buscar por ID
POST   /api/categorias        # Criar
PUT    /api/categorias/{id}   # Atualizar
DELETE /api/categorias/{id}   # Excluir
```

### Editoras
```http
GET    /api/editoras          # Listar todas
GET    /api/editoras/{id}     # Buscar por ID
POST   /api/editoras          # Criar
PUT    /api/editoras/{id}     # Atualizar
DELETE /api/editoras/{id}     # Excluir
```

### Livros
```http
GET    /api/livros            # Listar todos
GET    /api/livros/disponiveis # Listar disponíveis
GET    /api/livros/{id}       # Buscar por ID
GET    /api/livros/buscar     # Buscar por título
GET    /api/livros/autor/{id} # Buscar por autor
POST   /api/livros            # Criar
PUT    /api/livros/{id}       # Atualizar
DELETE /api/livros/{id}       # Excluir
```

### Pedidos (Master-Detail)
```http
GET    /api/pedidos           # Listar todos
GET    /api/pedidos/{id}      # Buscar por ID
POST   /api/pedidos           # Criar com itens
PUT    /api/pedidos/{id}      # Atualizar com itens
DELETE /api/pedidos/{id}      # Excluir
PATCH  /api/pedidos/{id}/status # Alterar status
```

## 🗄️ Configuração do Banco de Dados

### PostgreSQL (Produção)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ueg202502
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

### H2 (Desenvolvimento)
```properties
# Profile: h2
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
```

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Maven 3.6+
- PostgreSQL 12+ (opcional, pode usar H2)

### Passos
1. **Clonar/Acessar** o projeto
2. **Configurar** o banco de dados no `application.properties`
3. **Executar** o backend:
   ```bash
   mvn spring-boot:run
   ```
4. **Acessar** a aplicação:
   - Frontend: http://localhost:8080/frontend/
   - API: http://localhost:8080/api/
   - H2 Console: http://localhost:8080/h2-console

## 📁 Estrutura do Projeto

```
BackendUEG202502/
├── src/main/java/com/br/
│   ├── controller/          # REST Controllers
│   │   ├── AutorController.java
│   │   ├── CategoriaController.java
│   │   ├── EditoraController.java
│   │   ├── LivroController.java
│   │   └── PedidoController.java
│   ├── model/              # Entidades JPA
│   │   ├── Autor.java
│   │   ├── Categoria.java
│   │   ├── Editora.java
│   │   ├── Livro.java
│   │   ├── Pedido.java
│   │   └── ItemPedido.java
│   ├── repository/         # Repositories JPA
│   │   ├── AutorRepository.java
│   │   ├── CategoriaRepository.java
│   │   ├── EditoraRepository.java
│   │   ├── LivroRepository.java
│   │   ├── PedidoRepository.java
│   │   └── ItemPedidoRepository.java
│   └── config/             # Configurações
│       └── CorsConfig.java
├── src/main/resources/
│   ├── application.properties
│   ├── application-h2.properties
│   └── static/
│       ├── index.html      # Frontend antigo
│       └── frontend/       # Nova aplicação frontend
│           ├── index.html
│           ├── styles.css
│           └── js/
│               ├── app.js
│               ├── autor.js
│               ├── categoria.js
│               ├── editora.js
│               ├── livro.js
│               └── pedido.js
└── pom.xml
```

## 🎯 Casos de Uso Implementados

### 1. Gestão de Autores
- ✅ Cadastrar autor com dados biográficos
- ✅ Listar autores ativos/inativos
- ✅ Buscar por nome
- ✅ Inativar/ativar autor
- ✅ Visualizar biografia completa

### 2. Gestão de Categorias
- ✅ Criar categorias com cores personalizadas
- ✅ Associar múltiplas categorias a livros
- ✅ Buscar por nome

### 3. Gestão de Editoras
- ✅ Cadastrar com CNPJ e dados de contato
- ✅ Relacionamento 1:1 com livro
- ✅ Validação de CNPJ

### 4. Gestão de Livros
- ✅ Cadastro completo com relacionamentos
- ✅ Seleção de autor, editora e categorias
- ✅ Controle de estoque
- ✅ Status disponível/indisponível
- ✅ Busca por título ou autor

### 5. Gestão de Pedidos (Master-Detail)
- ✅ Criar pedido com múltiplos itens
- ✅ Adicionar/remover itens dinamicamente
- ✅ Cálculo automático de subtotais e total
- ✅ Controle de status do pedido
- ✅ Gestão completa do ciclo de vida

## 📋 Validações Implementadas

### Frontend
- Campos obrigatórios
- Formatos de email, CNPJ, datas
- Valores numéricos mínimos/máximos
- Quantidade de itens em estoque

### Backend
- Validações JPA (@NotNull, @NotBlank)
- Constraints de banco (unique, foreign keys)
- Validações de negócio
- Tratamento de exceções

## 🔍 Recursos Adicionais

### Pesquisa e Filtros
- Busca de autores por nome
- Busca de livros por título
- Filtro de livros disponíveis
- Filtro de autores ativos

### Interface Responsiva
- Layout adaptável
- Tabelas responsivas
- Modais otimizados
- Navegação mobile-friendly

### Feedback do Usuário
- Alertas de sucesso/erro
- Confirmações para exclusões
- Loading indicators
- Validação em tempo real

## 🎨 Design Patterns Utilizados

- **MVC**: Separação clara de responsabilidades
- **Repository**: Acesso a dados padronizado
- **DTO**: Transferência de dados entre camadas
- **Master-Detail**: Gestão de pedidos e itens
- **SPA**: Single Page Application no frontend

## 🔒 Segurança

- **CORS**: Configurado para desenvolvimento
- **Validação**: Frontend e backend
- **SQL Injection**: Proteção via JPA
- **XSS**: Sanitização de dados

## 📊 Métricas da Aplicação

- **Entidades**: 6 principais
- **Relacionamentos**: 4 tipos implementados
- **Endpoints**: 25+ endpoints REST
- **Funcionalidades**: 20+ casos de uso
- **Telas**: 5 módulos principais
- **Validações**: 15+ regras de negócio

## 🚧 Futuras Melhorias

- [ ] Autenticação e autorização
- [ ] Relatórios em PDF
- [ ] Upload de imagens
- [ ] Integração com APIs externas
- [ ] Testes automatizados
- [ ] Deploy em nuvem
- [ ] Cache Redis
- [ ] Logs estruturados

---

## 👨‍💻 Desenvolvedor
Sistema desenvolvido como aplicação completa demonstrando:
- **Backend**: Spring Boot + PostgreSQL
- **Frontend**: JavaScript + Bootstrap
- **Arquitetura**: REST API + SPA
- **Padrões**: CRUD + Master-Detail
- **Relacionamentos**: 1:1, 1:N, N:N

**Data**: Outubro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Completo e Funcional