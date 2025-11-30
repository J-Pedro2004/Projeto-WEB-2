# 🚀 Guia de Instalação e Execução - Sistema de Gerenciamento de Livros

## 📋 Pré-requisitos

- **Java 17+** instalado
- **Maven 3.6+** instalado
- **Navegador web** moderno

## 🛠️ Instalação e Execução

### 1. Clone ou baixe o projeto
```bash
# Se usar git
git clone [URL_DO_REPOSITORIO]

# Ou baixe e extraia o arquivo ZIP
```

### 2. Navegar para o diretório do projeto
```bash
cd BackendUEG202502
```

### 3. Escolher o banco de dados

#### Opção A: H2 Database (Recomendado para desenvolvimento)
```bash
# Renomear arquivo de configuração
mv src/main/resources/application.properties src/main/resources/application-postgresql.properties.backup
mv src/main/resources/application-h2.properties src/main/resources/application.properties
```

#### Opção B: PostgreSQL (Produção)
- Instale e configure o PostgreSQL
- Crie um banco chamado `ueg202502`
- Ajuste as credenciais em `application.properties`

### 4. Compilar e executar
```bash
# Compilar o projeto
mvn clean package -DskipTests

# Executar a aplicação
java -jar target/BackendUEG202502-0.0.1-SNAPSHOT.jar
```

### 5. Acessar a aplicação
Abra o navegador e acesse: **http://localhost:8080**

## 🎯 Testando o Sistema

### Frontend Web
1. Acesse `http://localhost:8080`
2. Use as abas para navegar:
   - **Listar Livros**: Ver todos os livros
   - **Adicionar Livro**: Criar novo livro
   - **Buscar Livro**: Encontrar por ID

### API REST (Insomnia/Postman)
Use os exemplos em `exemplos-requisicoes.md`

### H2 Console (se usando H2)
1. Acesse `http://localhost:8080/h2-console`
2. Use as configurações:
   - **JDBC URL**: `jdbc:h2:mem:testdb`
   - **User**: `sa`
   - **Password**: `password`

## 📱 Funcionalidades Implementadas

### ✅ 5 Operações CRUD Completas

1. **CREATE (Criar)** - POST /livro
   - Formulário no frontend
   - Validação de campos obrigatórios
   - Resposta com mensagem de sucesso

2. **READ (Listar)** - GET /livro
   - Lista todos os livros
   - Interface em cards responsivos
   - Atualização em tempo real

3. **READ (Consultar)** - GET /livro/{id}
   - Busca por ID específico
   - Campo de busca no frontend
   - Exibição detalhada

4. **UPDATE (Atualizar)** - PUT /livro/{id}
   - Botão "Editar" em cada livro
   - Formulário pré-preenchido
   - Confirmação de alteração

5. **DELETE (Excluir)** - DELETE /livro/{id}
   - Botão "Excluir" em cada livro
   - Modal de confirmação
   - Mensagem de sucesso

### 🎨 Frontend Features

- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Navegação por Abas**: Interface intuitiva
- **Validação de Formulário**: Campos obrigatórios
- **Notificações Toast**: Feedback visual
- **Modal de Confirmação**: Evita exclusões acidentais
- **Loading States**: Indicadores de carregamento
- **Error Handling**: Tratamento de erros amigável

### 🔧 Backend Features

- **API RESTful**: Padrões REST seguidos
- **Validação de Dados**: Entrada validada
- **Tratamento de Erros**: Respostas personalizadas
- **CORS Habilitado**: Frontend integrado
- **JPA/Hibernate**: Persistência de dados
- **Profiles**: PostgreSQL/H2 configuráveis

## 🧪 Exemplos de Teste

### 1. Teste Básico
1. Acesse `http://localhost:8080`
2. Clique em "Adicionar Livro"
3. Preencha:
   - Título: "Dom Casmurro"
   - Autor: "Machado de Assis"
   - Ano: 1899
   - Disponível: ✓
4. Clique "Salvar Livro"
5. Verifique na lista

### 2. Teste de Edição
1. Na lista, clique "Editar" em um livro
2. Altere o status para "Indisponível"
3. Clique "Atualizar Livro"
4. Verifique a alteração

### 3. Teste de Exclusão
1. Na lista, clique "Excluir"
2. Confirme no modal
3. Verifique que foi removido

### 4. Teste de Busca
1. Clique "Buscar Livro"
2. Digite um ID válido
3. Verifique os detalhes

## 📊 Estrutura do Projeto

```
BackendUEG202502/
├── src/main/java/com/br/
│   ├── config/
│   │   └── CorsConfig.java           # Configuração CORS
│   ├── controller/
│   │   └── LivroController.java      # REST Controller
│   ├── exception/
│   │   └── ResourceNotFoundException.java
│   ├── model/
│   │   └── Livro.java               # Entidade JPA
│   ├── repository/
│   │   └── LivroRepository.java     # Repository JPA
│   └── Projectueg2025Application.java
├── src/main/resources/
│   ├── static/                      # Frontend
│   │   ├── index.html              # Interface principal
│   │   ├── styles.css              # Estilos
│   │   └── script.js               # Lógica JavaScript
│   ├── application.properties       # Configurações
│   └── application-h2.properties   # Config H2
├── exemplos-requisicoes.md         # Exemplos API
├── README.md                       # Documentação principal
└── pom.xml                         # Dependências Maven
```

## 🔍 Solução de Problemas

### Servidor não inicia
```bash
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Recompilar
mvn clean package -DskipTests
```

### Porta 8080 ocupada
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# Ou alterar porta em application.properties
server.port=8081
```

### Frontend não carrega
1. Verifique se o backend está rodando
2. Acesse `http://localhost:8080`
3. Verifique console do navegador (F12)

### Erro de banco de dados
1. Use configuração H2 (mais simples)
2. Ou configure PostgreSQL corretamente
3. Verifique logs no terminal

## 📚 Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.5.4**
- **Spring Data JPA**
- **PostgreSQL / H2 Database**
- **Maven**

### Frontend
- **HTML5** semântico
- **CSS3** (Flexbox, Grid, Animations)
- **JavaScript ES6+** vanilla
- **Font Awesome** ícones
- **Responsive Design**

## 👨‍💻 Desenvolvido por

**Nome:** [Seu Nome]  
**Disciplina:** Backend UEG 2025  
**Data:** Outubro 2025  

## 📄 Licença

Projeto educacional - UEG 2025

---

**🎉 Sistema funcionando perfeitamente!**  
Todas as 5 operações CRUD implementadas e testadas.  
Frontend responsivo e backend robusto integrados.