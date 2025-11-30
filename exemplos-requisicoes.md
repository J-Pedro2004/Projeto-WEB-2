# Exemplos de Requisições para Teste da API

## Arquivo para uso com ferramentas como Insomnia, Postman ou cURL

### 1. LISTAR TODOS OS LIVROS
```http
GET http://localhost:8080/livro
```

### 2. BUSCAR LIVRO POR ID
```http
GET http://localhost:8080/livro/1
```

### 3. CRIAR NOVO LIVRO
```http
POST http://localhost:8080/livro
Content-Type: application/json

{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "anoPublicacao": 1899,
  "disponivel": true,
  "dataCadastro": "2025-10-05"
}
```

### 4. ATUALIZAR LIVRO EXISTENTE
```http
PUT http://localhost:8080/livro/1
Content-Type: application/json

{
  "titulo": "Dom Casmurro - Edição Especial",
  "autor": "Machado de Assis",
  "anoPublicacao": 1899,
  "disponivel": false,
  "dataCadastro": "2025-10-05"
}
```

### 5. EXCLUIR LIVRO
```http
DELETE http://localhost:8080/livro/1
```

## Exemplos com cURL

### Listar livros
```bash
curl -X GET http://localhost:8080/livro
```

### Criar livro
```bash
curl -X POST http://localhost:8080/livro \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "1984",
    "autor": "George Orwell",
    "anoPublicacao": 1949,
    "disponivel": true,
    "dataCadastro": "2025-10-05"
  }'
```

### Buscar livro
```bash
curl -X GET http://localhost:8080/livro/1
```

### Atualizar livro
```bash
curl -X PUT http://localhost:8080/livro/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "1984 - Edição Revisada",
    "autor": "George Orwell",
    "anoPublicacao": 1949,
    "disponivel": false,
    "dataCadastro": "2025-10-05"
  }'
```

### Excluir livro
```bash
curl -X DELETE http://localhost:8080/livro/1
```

## Respostas Esperadas

### Sucesso ao criar livro
```
Status: 200 OK
Body: "Livro cadastrado com sucesso! ID: 1"
```

### Sucesso ao atualizar livro
```
Status: 200 OK
Body: "Livro alterado com sucesso!"
```

### Sucesso ao excluir livro
```
Status: 200 OK
Body: "Livro excluído com sucesso!"
```

### Livro não encontrado
```
Status: 404 Not Found
Body: "Livro não encontrado"
```

### Lista vazia
```
Status: 200 OK
Body: "Nenhum livro cadastrado."
```

### Lista com livros
```json
Status: 200 OK
Body: [
  {
    "id": 1,
    "titulo": "Dom Casmurro",
    "autor": "Machado de Assis",
    "anoPublicacao": 1899,
    "disponivel": true,
    "dataCadastro": "2025-10-05"
  }
]
```