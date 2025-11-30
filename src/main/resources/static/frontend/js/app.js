// Aplicação principal - Sistema de Gestão de Livros

// Configuração da API
const API_BASE_URL = '/api';
const API_ENDPOINTS = {
    autores: `${API_BASE_URL}/autores`,
    categorias: `${API_BASE_URL}/categorias`,
    editoras: `${API_BASE_URL}/editoras`,
    livros: `${API_BASE_URL}/livros`,
    pedidos: `${API_BASE_URL}/pedidos`
};

// Estado global da aplicação
const AppState = {
    currentSection: 'dashboard',
    autores: [],
    categorias: [],
    editoras: [],
    livros: [],
    pedidos: []
};

// Utilitários de API
class ApiService {
    static async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            showAlert('Erro na comunicação com o servidor: ' + error.message, 'error');
            throw error;
        }
    }

    static async get(url) {
        return this.request(url);
    }

    static async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }

    static async patch(url, data = {}) {
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
}

// Funções de navegação
function showSection(sectionName) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');

    // Mostrar seção selecionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        AppState.currentSection = sectionName;

        // Carregar dados da seção
        loadSectionData(sectionName);

        // Atualizar navegação ativa
        updateNavigation(sectionName);
    }
}

function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.onclick && link.onclick.toString().includes(activeSection)) {
            link.classList.add('active');
        }
    });
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'autores':
            loadAutores();
            break;
        case 'categorias':
            loadCategorias();
            break;
        case 'editoras':
            loadEditoras();
            break;
        case 'livros':
            loadLivros();
            break;
        case 'pedidos':
            loadPedidos();
            break;
    }
}

// Funções de dashboard
async function loadDashboard() {
    try {
        // Carregar estatísticas
        const [autores, categorias, livros, pedidos] = await Promise.all([
            ApiService.get(API_ENDPOINTS.autores),
            ApiService.get(API_ENDPOINTS.categorias),
            ApiService.get(API_ENDPOINTS.livros),
            ApiService.get(API_ENDPOINTS.pedidos)
        ]);

        // Atualizar contadores
        updateDashboardStats({
            autores: Array.isArray(autores) ? autores.length : 0,
            categorias: Array.isArray(categorias) ? categorias.length : 0,
            livros: Array.isArray(livros) ? livros.length : 0,
            pedidos: Array.isArray(pedidos) ? pedidos.length : 0
        });

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        updateDashboardStats({ autores: 0, categorias: 0, livros: 0, pedidos: 0 });
    }
}

function updateDashboardStats(stats) {
    document.getElementById('total-autores').textContent = stats.autores || 0;
    document.getElementById('total-categorias').textContent = stats.categorias || 0;
    document.getElementById('total-livros').textContent = stats.livros || 0;
    document.getElementById('total-pedidos').textContent = stats.pedidos || 0;
}

// Funções de utilidade
function showAlert(message, type = 'info') {
    const alertTypes = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    };

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertTypes[type]} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('loading');
        element.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border" role="status"></div></div>';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('loading');
    }
}

function createModal(id, title, content, size = '') {
    const sizeClass = size ? `modal-${size}` : '';
    
    const modalHTML = `
        <div class="modal fade" id="${id}" tabindex="-1">
            <div class="modal-dialog ${sizeClass}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal existente se houver
    const existingModal = document.getElementById(id);
    if (existingModal) {
        existingModal.remove();
    }

    // Adicionar novo modal
    document.getElementById('modal-container').insertAdjacentHTML('beforeend', modalHTML);
    
    return new bootstrap.Modal(document.getElementById(id));
}

function confirmAction(message, callback) {
    const modalId = 'confirm-modal';
    const modal = createModal(modalId, 'Confirmação', `
        <p>${message}</p>
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirm-action">Confirmar</button>
        </div>
    `);

    document.getElementById('confirm-action').addEventListener('click', () => {
        modal.hide();
        callback();
    });

    modal.show();
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar dashboard por padrão
    showSection('dashboard');
    
    // Configurar event listeners globais
    setupGlobalEventListeners();
});

function setupGlobalEventListeners() {
    // Enter key para busca
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.matches('[id^="search-"]')) {
            const searchType = e.target.id.replace('search-', '');
            if (window[`buscar${searchType.charAt(0).toUpperCase() + searchType.slice(1)}`]) {
                window[`buscar${searchType.charAt(0).toUpperCase() + searchType.slice(1)}`]();
            }
        }
    });

    // Fechar modais com escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            });
        }
    });
}