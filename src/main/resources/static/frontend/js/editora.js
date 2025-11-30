// Gestão de Editoras

async function loadEditoras() {
    showLoading('editoras-tbody');
    
    try {
        const editoras = await ApiService.get(API_ENDPOINTS.editoras);
        AppState.editoras = Array.isArray(editoras) ? editoras : [];
        displayEditoras(AppState.editoras);
    } catch (error) {
        document.getElementById('editoras-tbody').innerHTML = 
            '<tr><td colspan="6" class="text-center text-muted">Erro ao carregar editoras</td></tr>';
    }
}

function displayEditoras(editoras) {
    const tbody = document.getElementById('editoras-tbody');
    
    if (!editoras || editoras.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma editora encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = editoras.map(editora => `
        <tr>
            <td>${editora.id}</td>
            <td>${editora.razaoSocial}</td>
            <td>${editora.cnpj}</td>
            <td>${editora.telefone || ''}</td>
            <td>${editora.email || ''}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewEditora(${editora.id})" title="Visualizar">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="editEditora(${editora.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteEditora(${editora.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showEditoraForm(editoraId = null) {
    const isEdit = editoraId !== null;
    const title = isEdit ? 'Editar Editora' : 'Nova Editora';
    
    const formContent = `
        <form id="editora-form">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="editora-razao-social" class="form-label">Razão Social *</label>
                        <input type="text" class="form-control" id="editora-razao-social" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="editora-cnpj" class="form-label">CNPJ *</label>
                        <input type="text" class="form-control" id="editora-cnpj" required maxlength="18" placeholder="00.000.000/0000-00">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="editora-telefone" class="form-label">Telefone</label>
                        <input type="text" class="form-control" id="editora-telefone" placeholder="(00) 0000-0000">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="editora-email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editora-email">
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="editora-endereco" class="form-label">Endereço</label>
                <textarea class="form-control" id="editora-endereco" rows="2"></textarea>
            </div>
            <div class="mb-3">
                <label for="editora-site" class="form-label">Website</label>
                <input type="url" class="form-control" id="editora-site" placeholder="https://www.exemplo.com">
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    `;

    const modal = createModal('editora-modal', title, formContent, 'lg');
    
    // Se for edição, carregar dados da editora
    if (isEdit) {
        loadEditoraData(editoraId);
    }

    // Configurar formatação do CNPJ
    setupCnpjMask();

    // Configurar submit do formulário
    document.getElementById('editora-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditora(editoraId);
    });

    modal.show();
}

function setupCnpjMask() {
    const cnpjInput = document.getElementById('editora-cnpj');
    cnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });
}

async function loadEditoraData(editoraId) {
    try {
        const editora = await ApiService.get(`${API_ENDPOINTS.editoras}/${editoraId}`);
        
        document.getElementById('editora-razao-social').value = editora.razaoSocial || '';
        document.getElementById('editora-cnpj').value = editora.cnpj || '';
        document.getElementById('editora-telefone').value = editora.telefone || '';
        document.getElementById('editora-email').value = editora.email || '';
        document.getElementById('editora-endereco').value = editora.endereco || '';
        document.getElementById('editora-site').value = editora.site || '';
        
    } catch (error) {
        showAlert('Erro ao carregar dados da editora', 'error');
    }
}

async function saveEditora(editoraId = null) {
    const formData = {
        razaoSocial: document.getElementById('editora-razao-social').value.trim(),
        cnpj: document.getElementById('editora-cnpj').value.trim(),
        telefone: document.getElementById('editora-telefone').value.trim(),
        email: document.getElementById('editora-email').value.trim(),
        endereco: document.getElementById('editora-endereco').value.trim(),
        site: document.getElementById('editora-site').value.trim()
    };

    // Validação
    if (!formData.razaoSocial) {
        showAlert('Razão Social é obrigatória', 'warning');
        return;
    }

    if (!formData.cnpj) {
        showAlert('CNPJ é obrigatório', 'warning');
        return;
    }

    // Validação básica de CNPJ
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
        showAlert('CNPJ deve ter 14 dígitos', 'warning');
        return;
    }

    try {
        const button = document.querySelector('#editora-form button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

        if (editoraId) {
            await ApiService.put(`${API_ENDPOINTS.editoras}/${editoraId}`, formData);
            showAlert('Editora atualizada com sucesso!', 'success');
        } else {
            await ApiService.post(API_ENDPOINTS.editoras, formData);
            showAlert('Editora criada com sucesso!', 'success');
        }

        // Fechar modal e recarregar lista
        bootstrap.Modal.getInstance(document.getElementById('editora-modal')).hide();
        loadEditoras();

    } catch (error) {
        showAlert('Erro ao salvar editora: ' + error.message, 'error');
    } finally {
        const button = document.querySelector('#editora-form button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = editoraId ? '<i class="bi bi-check"></i> Atualizar' : '<i class="bi bi-check"></i> Salvar';
        }
    }
}

async function viewEditora(editoraId) {
    try {
        const editora = await ApiService.get(`${API_ENDPOINTS.editoras}/${editoraId}`);
        
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Razão Social:</strong> ${editora.razaoSocial}</p>
                    <p><strong>CNPJ:</strong> ${editora.cnpj}</p>
                    <p><strong>Telefone:</strong> ${editora.telefone || 'Não informado'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Email:</strong> ${editora.email || 'Não informado'}</p>
                    <p><strong>Website:</strong> ${editora.site ? `<a href="${editora.site}" target="_blank">${editora.site}</a>` : 'Não informado'}</p>
                </div>
            </div>
            ${editora.endereco ? `
                <div class="mt-3">
                    <strong>Endereço:</strong>
                    <p class="mt-2">${editora.endereco}</p>
                </div>
            ` : ''}
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="editEditora(${editora.id}); bootstrap.Modal.getInstance(document.getElementById('view-editora-modal')).hide();">
                    <i class="bi bi-pencil"></i> Editar
                </button>
            </div>
        `;

        const modal = createModal('view-editora-modal', 'Detalhes da Editora', content, 'lg');
        modal.show();
        
    } catch (error) {
        showAlert('Erro ao carregar detalhes da editora', 'error');
    }
}

function editEditora(editoraId) {
    showEditoraForm(editoraId);
}

function deleteEditora(editoraId) {
    confirmAction(
        'Tem certeza que deseja excluir esta editora? Esta ação não pode ser desfeita.',
        async () => {
            try {
                await ApiService.delete(`${API_ENDPOINTS.editoras}/${editoraId}`);
                showAlert('Editora excluída com sucesso!', 'success');
                loadEditoras();
                
            } catch (error) {
                showAlert('Erro ao excluir editora', 'error');
            }
        }
    );
}