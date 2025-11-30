// Gestão de Autores

async function loadAutores() {
    showLoading('autores-tbody');
    
    try {
        const autores = await ApiService.get(API_ENDPOINTS.autores);
        AppState.autores = Array.isArray(autores) ? autores : [];
        displayAutores(AppState.autores);
    } catch (error) {
        document.getElementById('autores-tbody').innerHTML = 
            '<tr><td colspan="6" class="text-center text-muted">Erro ao carregar autores</td></tr>';
    }
}

function displayAutores(autores) {
    const tbody = document.getElementById('autores-tbody');
    
    if (!autores || autores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum autor encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = autores.map(autor => `
        <tr>
            <td>${autor.id}</td>
            <td>${autor.nome}</td>
            <td>${autor.sobrenome || ''}</td>
            <td>${autor.nacionalidade || ''}</td>
            <td>
                <span class="badge ${autor.ativo ? 'status-ativo' : 'status-inativo'}">
                    ${autor.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewAutor(${autor.id})" title="Visualizar">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="editAutor(${autor.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="toggleAutorStatus(${autor.id}, ${autor.ativo})" title="${autor.ativo ? 'Inativar' : 'Ativar'}">
                        <i class="bi bi-${autor.ativo ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteAutor(${autor.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function buscarAutor() {
    const searchTerm = document.getElementById('search-autor').value.trim();
    
    if (!searchTerm) {
        loadAutores();
        return;
    }

    showLoading('autores-tbody');
    
    try {
        const autores = await ApiService.get(`${API_ENDPOINTS.autores}/buscar?nome=${encodeURIComponent(searchTerm)}`);
        const resultArray = Array.isArray(autores) ? autores : [];
        displayAutores(resultArray);
        
        if (resultArray.length === 0) {
            showAlert(`Nenhum autor encontrado com o nome "${searchTerm}"`, 'warning');
        }
    } catch (error) {
        displayAutores([]);
        showAlert('Erro ao buscar autores', 'error');
    }
}

function showAutorForm(autorId = null) {
    const isEdit = autorId !== null;
    const title = isEdit ? 'Editar Autor' : 'Novo Autor';
    
    const formContent = `
        <form id="autor-form">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="autor-nome" class="form-label">Nome *</label>
                        <input type="text" class="form-control" id="autor-nome" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="autor-sobrenome" class="form-label">Sobrenome</label>
                        <input type="text" class="form-control" id="autor-sobrenome">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="autor-data-nascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="autor-data-nascimento">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="autor-nacionalidade" class="form-label">Nacionalidade</label>
                        <input type="text" class="form-control" id="autor-nacionalidade">
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="autor-biografia" class="form-label">Biografia</label>
                <textarea class="form-control" id="autor-biografia" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="autor-ativo" checked>
                    <label class="form-check-label" for="autor-ativo">
                        Ativo
                    </label>
                </div>
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    `;

    const modal = createModal('autor-modal', title, formContent, 'lg');
    
    // Se for edição, carregar dados do autor
    if (isEdit) {
        loadAutorData(autorId);
    }

    // Configurar submit do formulário
    document.getElementById('autor-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAutor(autorId);
    });

    modal.show();
}

async function loadAutorData(autorId) {
    try {
        const autor = await ApiService.get(`${API_ENDPOINTS.autores}/${autorId}`);
        
        document.getElementById('autor-nome').value = autor.nome || '';
        document.getElementById('autor-sobrenome').value = autor.sobrenome || '';
        document.getElementById('autor-data-nascimento').value = autor.dataNascimento ? autor.dataNascimento.split('T')[0] : '';
        document.getElementById('autor-nacionalidade').value = autor.nacionalidade || '';
        document.getElementById('autor-biografia').value = autor.biografia || '';
        document.getElementById('autor-ativo').checked = autor.ativo;
        
    } catch (error) {
        showAlert('Erro ao carregar dados do autor', 'error');
    }
}

async function saveAutor(autorId = null) {
    const formData = {
        nome: document.getElementById('autor-nome').value.trim(),
        sobrenome: document.getElementById('autor-sobrenome').value.trim(),
        dataNascimento: document.getElementById('autor-data-nascimento').value || null,
        nacionalidade: document.getElementById('autor-nacionalidade').value.trim(),
        biografia: document.getElementById('autor-biografia').value.trim(),
        ativo: document.getElementById('autor-ativo').checked
    };

    // Validação
    if (!formData.nome) {
        showAlert('Nome é obrigatório', 'warning');
        return;
    }

    try {
        const button = document.querySelector('#autor-form button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

        if (autorId) {
            await ApiService.put(`${API_ENDPOINTS.autores}/${autorId}`, formData);
            showAlert('Autor atualizado com sucesso!', 'success');
        } else {
            await ApiService.post(API_ENDPOINTS.autores, formData);
            showAlert('Autor criado com sucesso!', 'success');
        }

        // Fechar modal e recarregar lista
        bootstrap.Modal.getInstance(document.getElementById('autor-modal')).hide();
        loadAutores();

    } catch (error) {
        showAlert('Erro ao salvar autor: ' + error.message, 'error');
    } finally {
        const button = document.querySelector('#autor-form button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = autorId ? '<i class="bi bi-check"></i> Atualizar' : '<i class="bi bi-check"></i> Salvar';
        }
    }
}

async function viewAutor(autorId) {
    try {
        const autor = await ApiService.get(`${API_ENDPOINTS.autores}/${autorId}`);
        
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Nome:</strong> ${autor.nome}</p>
                    <p><strong>Sobrenome:</strong> ${autor.sobrenome || 'Não informado'}</p>
                    <p><strong>Data de Nascimento:</strong> ${autor.dataNascimento ? formatDate(autor.dataNascimento) : 'Não informada'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Nacionalidade:</strong> ${autor.nacionalidade || 'Não informada'}</p>
                    <p><strong>Status:</strong> 
                        <span class="badge ${autor.ativo ? 'status-ativo' : 'status-inativo'}">
                            ${autor.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                    </p>
                </div>
            </div>
            ${autor.biografia ? `
                <div class="mt-3">
                    <strong>Biografia:</strong>
                    <p class="mt-2">${autor.biografia}</p>
                </div>
            ` : ''}
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="editAutor(${autor.id}); bootstrap.Modal.getInstance(document.getElementById('view-autor-modal')).hide();">
                    <i class="bi bi-pencil"></i> Editar
                </button>
            </div>
        `;

        const modal = createModal('view-autor-modal', 'Detalhes do Autor', content, 'lg');
        modal.show();
        
    } catch (error) {
        showAlert('Erro ao carregar detalhes do autor', 'error');
    }
}

function editAutor(autorId) {
    showAutorForm(autorId);
}

async function toggleAutorStatus(autorId, currentStatus) {
    const action = currentStatus ? 'inativar' : 'ativar';
    
    confirmAction(
        `Tem certeza que deseja ${action} este autor?`,
        async () => {
            try {
                if (!currentStatus) {
                    // Para ativar, fazer um PUT com ativo = true
                    const autor = AppState.autores.find(a => a.id === autorId);
                    if (autor) {
                        autor.ativo = true;
                        await ApiService.put(`${API_ENDPOINTS.autores}/${autorId}`, autor);
                    }
                } else {
                    // Para inativar, usar o endpoint específico
                    await ApiService.patch(`${API_ENDPOINTS.autores}/${autorId}/inativar`);
                }
                
                showAlert(`Autor ${action === 'inativar' ? 'inativado' : 'ativado'} com sucesso!`, 'success');
                loadAutores();
                
            } catch (error) {
                showAlert(`Erro ao ${action} autor`, 'error');
            }
        }
    );
}

function deleteAutor(autorId) {
    confirmAction(
        'Tem certeza que deseja excluir este autor? Esta ação não pode ser desfeita.',
        async () => {
            try {
                await ApiService.delete(`${API_ENDPOINTS.autores}/${autorId}`);
                showAlert('Autor excluído com sucesso!', 'success');
                loadAutores();
                
            } catch (error) {
                showAlert('Erro ao excluir autor', 'error');
            }
        }
    );
}