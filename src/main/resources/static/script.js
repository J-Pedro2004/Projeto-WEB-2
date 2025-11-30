/**
 * Frontend JavaScript para Sistema de Gerenciamento de Livros
 * Implementa todas as operações CRUD: Criar, Ler, Atualizar, Deletar e Listar
 * Comunica com o backend Spring Boot através da API REST
 */

// URL base da API
const API_BASE_URL = 'http://localhost:8080/livro';

// Variáveis globais
let currentBookId = null;
let confirmCallback = null;

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    // Carregar lista de livros ao iniciar
    loadBooks();
    
    // Configurar data atual no campo de cadastro
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataCadastro').value = today;
    
    // Configurar evento do formulário
    document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
    
    // Configurar tecla Enter no campo de busca
    document.getElementById('search-id').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBook();
        }
    });
    
    console.log('Sistema de Gerenciamento de Livros inicializado!');
});

/**
 * OPERAÇÃO 1: LISTAR - Carrega e exibe todos os livros
 */
async function loadBooks() {
    const booksContainer = document.getElementById('books-list');
    
    try {
        // Mostrar loading
        booksContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando livros...</p>
            </div>
        `;
        
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar se retornou uma mensagem ou uma lista
        if (typeof data === 'string') {
            // Nenhum livro cadastrado
            booksContainer.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-book-open"></i>
                    <p>${data}</p>
                </div>
            `;
        } else if (Array.isArray(data) && data.length === 0) {
            // Lista vazia
            booksContainer.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-book-open"></i>
                    <p>Nenhum livro cadastrado ainda.</p>
                </div>
            `;
        } else {
            // Exibir livros
            displayBooks(data);
        }
        
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        booksContainer.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar livros. Verifique se o backend está rodando.</p>
            </div>
        `;
        showToast('Erro ao carregar livros', 'error');
    }
}

/**
 * Exibe a lista de livros na interface
 */
function displayBooks(books) {
    const booksContainer = document.getElementById('books-list');
    
    const booksHTML = books.map(book => `
        <div class="book-card">
            <h3>${escapeHtml(book.titulo)}</h3>
            <div class="book-info">
                <p><strong>Autor:</strong> ${escapeHtml(book.autor)}</p>
                <p><strong>Ano:</strong> ${book.anoPublicacao}</p>
                <p><strong>Cadastro:</strong> ${formatDate(book.dataCadastro)}</p>
                <p><strong>ID:</strong> ${book.id}</p>
            </div>
            <div class="book-status ${book.disponivel ? 'status-available' : 'status-unavailable'}">
                <i class="fas ${book.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${book.disponivel ? 'Disponível' : 'Indisponível'}
            </div>
            <div class="book-actions">
                <button onclick="editBook(${book.id})" class="btn btn-warning btn-small">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteBook(${book.id}, '${escapeHtml(book.titulo)}')" class="btn btn-danger btn-small">
                    <i class="fas fa-trash"></i> Excluir
                </button>
                <button onclick="viewBook(${book.id})" class="btn btn-primary btn-small">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
            </div>
        </div>
    `).join('');
    
    booksContainer.innerHTML = booksHTML;
}

/**
 * OPERAÇÃO 2: CRIAR/INCLUIR - Manipula o envio do formulário
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookData = {
        titulo: formData.get('titulo'),
        autor: formData.get('autor'),
        anoPublicacao: parseInt(formData.get('anoPublicacao')),
        disponivel: formData.get('disponivel') === 'on',
        dataCadastro: formData.get('dataCadastro')
    };
    
    const bookId = document.getElementById('book-id').value;
    
    if (bookId) {
        // Atualizar livro existente
        await updateBook(bookId, bookData);
    } else {
        // Criar novo livro
        await createBook(bookData);
    }
}

/**
 * Cria um novo livro
 */
async function createBook(bookData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.text();
        showToast(result || 'Livro criado com sucesso!', 'success');
        
        // Resetar formulário e voltar para lista
        resetForm();
        showSection('list');
        loadBooks();
        
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        showToast('Erro ao criar livro', 'error');
    }
}

/**
 * OPERAÇÃO 3: ATUALIZAR/ALTERAR - Atualiza um livro existente
 */
async function updateBook(id, bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.text();
        showToast(result || 'Livro atualizado com sucesso!', 'success');
        
        // Resetar formulário e voltar para lista
        resetForm();
        showSection('list');
        loadBooks();
        
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        showToast('Erro ao atualizar livro', 'error');
    }
}

/**
 * Carrega dados de um livro para edição
 */
async function editBook(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const book = await response.json();
        
        // Verificar se retornou um objeto livro
        if (typeof book === 'string') {
            showToast(book, 'error');
            return;
        }
        
        // Preencher formulário
        document.getElementById('book-id').value = book.id;
        document.getElementById('titulo').value = book.titulo;
        document.getElementById('autor').value = book.autor;
        document.getElementById('anoPublicacao').value = book.anoPublicacao;
        document.getElementById('disponivel').checked = book.disponivel;
        document.getElementById('dataCadastro').value = book.dataCadastro;
        
        // Atualizar interface
        document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Editar Livro';
        document.getElementById('btn-text').textContent = 'Atualizar Livro';
        
        showSection('create');
        
    } catch (error) {
        console.error('Erro ao carregar livro para edição:', error);
        showToast('Erro ao carregar dados do livro', 'error');
    }
}

/**
 * OPERAÇÃO 4: EXCLUIR/DELETAR - Remove um livro
 */
function deleteBook(id, titulo) {
    showConfirmModal(
        `Tem certeza que deseja excluir o livro "${titulo}"?`,
        () => confirmDeleteBook(id)
    );
}

/**
 * Confirma e executa a exclusão do livro
 */
async function confirmDeleteBook(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.text();
        showToast(result || 'Livro excluído com sucesso!', 'success');
        
        // Recarregar lista
        loadBooks();
        
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        showToast('Erro ao excluir livro', 'error');
    }
}

/**
 * OPERAÇÃO 5: CONSULTAR - Busca um livro específico por ID
 */
async function searchBook() {
    const searchId = document.getElementById('search-id').value;
    const resultContainer = document.getElementById('search-result');
    
    if (!searchId) {
        showToast('Digite um ID para buscar', 'warning');
        return;
    }
    
    try {
        // Mostrar loading
        resultContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Buscando livro...</p>
            </div>
        `;
        
        const response = await fetch(`${API_BASE_URL}/${searchId}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Verificar se retornou uma mensagem de erro ou um livro
        if (typeof result === 'string') {
            resultContainer.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-search"></i>
                    <p>${result}</p>
                </div>
            `;
        } else {
            // Exibir livro encontrado
            displaySingleBook(result);
        }
        
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        resultContainer.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao buscar livro</p>
            </div>
        `;
        showToast('Erro ao buscar livro', 'error');
    }
}

/**
 * Exibe um livro específico encontrado na busca
 */
function displaySingleBook(book) {
    const resultContainer = document.getElementById('search-result');
    
    resultContainer.innerHTML = `
        <div class="book-card">
            <h3>${escapeHtml(book.titulo)}</h3>
            <div class="book-info">
                <p><strong>Autor:</strong> ${escapeHtml(book.autor)}</p>
                <p><strong>Ano de Publicação:</strong> ${book.anoPublicacao}</p>
                <p><strong>Data de Cadastro:</strong> ${formatDate(book.dataCadastro)}</p>
                <p><strong>ID:</strong> ${book.id}</p>
            </div>
            <div class="book-status ${book.disponivel ? 'status-available' : 'status-unavailable'}">
                <i class="fas ${book.disponivel ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${book.disponivel ? 'Disponível' : 'Indisponível'}
            </div>
            <div class="book-actions">
                <button onclick="editBook(${book.id})" class="btn btn-warning btn-small">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteBook(${book.id}, '${escapeHtml(book.titulo)}')" class="btn btn-danger btn-small">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

/**
 * Visualiza um livro (mesmo que buscar, mas navegando para a seção de busca)
 */
function viewBook(id) {
    document.getElementById('search-id').value = id;
    showSection('search');
    searchBook();
}

/**
 * Navegação entre seções
 */
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(`${sectionName}-section`).classList.add('active');
    document.getElementById(`${sectionName}-btn`).classList.add('active');
    
    // Resetar formulário se mudando para criar
    if (sectionName === 'create') {
        resetForm();
    }
}

/**
 * Reseta o formulário para estado inicial
 */
function resetForm() {
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus"></i> Adicionar Novo Livro';
    document.getElementById('btn-text').textContent = 'Salvar Livro';
    
    // Definir data atual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataCadastro').value = today;
    document.getElementById('disponivel').checked = true;
}

/**
 * Modal de confirmação
 */
function showConfirmModal(message, callback) {
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-modal').style.display = 'block';
    confirmCallback = callback;
}

function closeModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    confirmCallback = null;
}

function confirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeModal();
}

/**
 * Sistema de notificações (Toast)
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/**
 * Utilitários
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('confirm-modal');
    if (event.target === modal) {
        closeModal();
    }
}