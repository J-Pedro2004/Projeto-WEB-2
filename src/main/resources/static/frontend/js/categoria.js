// Gestão de Categorias

async function loadCategorias() {
    showLoading('categorias-tbody');
    
    try {
        const categorias = await ApiService.get(API_ENDPOINTS.categorias);
        AppState.categorias = Array.isArray(categorias) ? categorias : [];
        displayCategorias(AppState.categorias);
    } catch (error) {
        document.getElementById('categorias-tbody').innerHTML = 
            '<tr><td colspan="5" class="text-center text-muted">Erro ao carregar categorias</td></tr>';
    }
}

function displayCategorias(categorias) {
    const tbody = document.getElementById('categorias-tbody');
    
    if (!categorias || categorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma categoria encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = categorias.map(categoria => `
        <tr>
            <td>${categoria.id}</td>
            <td>${categoria.nome}</td>
            <td>${categoria.descricao || ''}</td>
            <td>
                ${categoria.cor ? 
                    `<span class="badge" style="background-color: ${categoria.cor}; color: white;">${categoria.cor}</span>` : 
                    '<span class="text-muted">-</span>'
                }
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewCategoria(${categoria.id})" title="Visualizar">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="editCategoria(${categoria.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteCategoria(${categoria.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showCategoriaForm(categoriaId = null) {
    const isEdit = categoriaId !== null;
    const title = isEdit ? 'Editar Categoria' : 'Nova Categoria';
    
    const formContent = `
        <form id="categoria-form">
            <div class="mb-3">
                <label for="categoria-nome" class="form-label">Nome *</label>
                <input type="text" class="form-control" id="categoria-nome" required>
            </div>
            <div class="mb-3">
                <label for="categoria-descricao" class="form-label">Descrição</label>
                <textarea class="form-control" id="categoria-descricao" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="categoria-cor" class="form-label">Cor</label>
                <input type="color" class="form-control form-control-color" id="categoria-cor" value="#007bff">
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    `;

    const modal = createModal('categoria-modal', title, formContent);
    
    // Se for edição, carregar dados da categoria
    if (isEdit) {
        loadCategoriaData(categoriaId);
    }

    // Configurar submit do formulário
    document.getElementById('categoria-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCategoria(categoriaId);
    });

    modal.show();
}

async function loadCategoriaData(categoriaId) {
    try {
        const categoria = await ApiService.get(`${API_ENDPOINTS.categorias}/${categoriaId}`);
        
        document.getElementById('categoria-nome').value = categoria.nome || '';
        document.getElementById('categoria-descricao').value = categoria.descricao || '';
        document.getElementById('categoria-cor').value = categoria.cor || '#007bff';
        
    } catch (error) {
        showAlert('Erro ao carregar dados da categoria', 'error');
    }
}

async function saveCategoria(categoriaId = null) {
    const formData = {
        nome: document.getElementById('categoria-nome').value.trim(),
        descricao: document.getElementById('categoria-descricao').value.trim(),
        cor: document.getElementById('categoria-cor').value
    };

    // Validação
    if (!formData.nome) {
        showAlert('Nome é obrigatório', 'warning');
        return;
    }

    try {
        const button = document.querySelector('#categoria-form button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

        if (categoriaId) {
            await ApiService.put(`${API_ENDPOINTS.categorias}/${categoriaId}`, formData);
            showAlert('Categoria atualizada com sucesso!', 'success');
        } else {
            await ApiService.post(API_ENDPOINTS.categorias, formData);
            showAlert('Categoria criada com sucesso!', 'success');
        }

        // Fechar modal e recarregar lista
        bootstrap.Modal.getInstance(document.getElementById('categoria-modal')).hide();
        loadCategorias();

    } catch (error) {
        showAlert('Erro ao salvar categoria: ' + error.message, 'error');
    } finally {
        const button = document.querySelector('#categoria-form button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = categoriaId ? '<i class="bi bi-check"></i> Atualizar' : '<i class="bi bi-check"></i> Salvar';
        }
    }
}

async function viewCategoria(categoriaId) {
    try {
        const categoria = await ApiService.get(`${API_ENDPOINTS.categorias}/${categoriaId}`);
        
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Nome:</strong> ${categoria.nome}</p>
                    <p><strong>Descrição:</strong> ${categoria.descricao || 'Não informada'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Cor:</strong> 
                        ${categoria.cor ? 
                            `<span class="badge" style="background-color: ${categoria.cor}; color: white;">${categoria.cor}</span>` : 
                            'Não definida'
                        }
                    </p>
                </div>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="editCategoria(${categoria.id}); bootstrap.Modal.getInstance(document.getElementById('view-categoria-modal')).hide();">
                    <i class="bi bi-pencil"></i> Editar
                </button>
            </div>
        `;

        const modal = createModal('view-categoria-modal', 'Detalhes da Categoria', content);
        modal.show();
        
    } catch (error) {
        showAlert('Erro ao carregar detalhes da categoria', 'error');
    }
}

function editCategoria(categoriaId) {
    showCategoriaForm(categoriaId);
}

function deleteCategoria(categoriaId) {
    confirmAction(
        'Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.',
        async () => {
            try {
                await ApiService.delete(`${API_ENDPOINTS.categorias}/${categoriaId}`);
                showAlert('Categoria excluída com sucesso!', 'success');
                loadCategorias();
                
            } catch (error) {
                showAlert('Erro ao excluir categoria', 'error');
            }
        }
    );
}