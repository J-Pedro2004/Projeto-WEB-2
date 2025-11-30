// Gestão de Livros

async function loadLivros() {
    showLoading('livros-tbody');
    
    try {
        const livros = await ApiService.get(API_ENDPOINTS.livros);
        AppState.livros = Array.isArray(livros) ? livros : [];
        displayLivros(AppState.livros);
    } catch (error) {
        document.getElementById('livros-tbody').innerHTML = 
            '<tr><td colspan="8" class="text-center text-muted">Erro ao carregar livros</td></tr>';
    }
}

function displayLivros(livros) {
    const tbody = document.getElementById('livros-tbody');
    
    if (!livros || livros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Nenhum livro encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = livros.map(livro => `
        <tr>
            <td>${livro.id}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor ? `${livro.autor.nome} ${livro.autor.sobrenome || ''}`.trim() : 'Não informado'}</td>
            <td>${livro.editora ? livro.editora.razaoSocial : 'Não informado'}</td>
            <td>${livro.preco ? formatCurrency(livro.preco) : 'Não informado'}</td>
            <td>${livro.quantidadeEstoque || 0}</td>
            <td>
                <span class="badge ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'}">
                    ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewLivro(${livro.id})" title="Visualizar">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="editLivro(${livro.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteLivro(${livro.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function showLivroForm(livroId = null) {
    const isEdit = livroId !== null;
    const title = isEdit ? 'Editar Livro' : 'Novo Livro';
    
    // Carregar dados para os selects
    await loadSelectData();
    
    const formContent = `
        <form id="livro-form">
            <div class="row">
                <div class="col-md-8">
                    <div class="mb-3">
                        <label for="livro-titulo" class="form-label">Título *</label>
                        <input type="text" class="form-control" id="livro-titulo" required>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-isbn" class="form-label">ISBN</label>
                        <input type="text" class="form-control" id="livro-isbn">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="mb-3">
                        <label for="livro-subtitulo" class="form-label">Subtítulo</label>
                        <input type="text" class="form-control" id="livro-subtitulo">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="livro-autor" class="form-label">Autor</label>
                        <select class="form-select" id="livro-autor">
                            <option value="">Selecione um autor</option>
                            ${AppState.autores.map(autor => 
                                `<option value="${autor.id}">${autor.nome} ${autor.sobrenome || ''}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="livro-editora" class="form-label">Editora</label>
                        <select class="form-select" id="livro-editora">
                            <option value="">Selecione uma editora</option>
                            ${AppState.editoras.map(editora => 
                                `<option value="${editora.id}">${editora.razaoSocial}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-ano-publicacao" class="form-label">Ano de Publicação</label>
                        <input type="number" class="form-control" id="livro-ano-publicacao" min="1900" max="${new Date().getFullYear()}">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-numero-paginas" class="form-label">Número de Páginas</label>
                        <input type="number" class="form-control" id="livro-numero-paginas" min="1">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-idioma" class="form-label">Idioma</label>
                        <input type="text" class="form-control" id="livro-idioma" value="Português">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-preco" class="form-label">Preço</label>
                        <input type="number" class="form-control" id="livro-preco" step="0.01" min="0">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-quantidade-estoque" class="form-label">Quantidade em Estoque</label>
                        <input type="number" class="form-control" id="livro-quantidade-estoque" min="0" value="0">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label for="livro-disponivel" class="form-label">Status</label>
                        <div class="form-check mt-2">
                            <input class="form-check-input" type="checkbox" id="livro-disponivel" checked>
                            <label class="form-check-label" for="livro-disponivel">
                                Disponível para venda
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="livro-categorias" class="form-label">Categorias</label>
                <div id="categorias-checkboxes" class="row">
                    ${AppState.categorias.map(categoria => `
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="${categoria.id}" id="categoria-${categoria.id}">
                                <label class="form-check-label" for="categoria-${categoria.id}">
                                    ${categoria.nome}
                                </label>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="mb-3">
                <label for="livro-sinopse" class="form-label">Sinopse</label>
                <textarea class="form-control" id="livro-sinopse" rows="4"></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    `;

    const modal = createModal('livro-modal', title, formContent, 'xl');
    
    // Se for edição, carregar dados do livro
    if (isEdit) {
        loadLivroData(livroId);
    }

    // Configurar submit do formulário
    document.getElementById('livro-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveLivro(livroId);
    });

    modal.show();
}

async function loadSelectData() {
    try {
        const [autores, editoras, categorias] = await Promise.all([
            ApiService.get(API_ENDPOINTS.autores),
            ApiService.get(API_ENDPOINTS.editoras),
            ApiService.get(API_ENDPOINTS.categorias)
        ]);

        AppState.autores = Array.isArray(autores) ? autores : [];
        AppState.editoras = Array.isArray(editoras) ? editoras : [];
        AppState.categorias = Array.isArray(categorias) ? categorias : [];
        
    } catch (error) {
        console.error('Erro ao carregar dados para os selects:', error);
        AppState.autores = [];
        AppState.editoras = [];
        AppState.categorias = [];
    }
}

async function loadLivroData(livroId) {
    try {
        const livro = await ApiService.get(`${API_ENDPOINTS.livros}/${livroId}`);
        
        document.getElementById('livro-titulo').value = livro.titulo || '';
        document.getElementById('livro-subtitulo').value = livro.subtitulo || '';
        document.getElementById('livro-isbn').value = livro.isbn || '';
        document.getElementById('livro-ano-publicacao').value = livro.anoPublicacao || '';
        document.getElementById('livro-numero-paginas').value = livro.numeroPaginas || '';
        document.getElementById('livro-idioma').value = livro.idioma || '';
        document.getElementById('livro-preco').value = livro.preco || '';
        document.getElementById('livro-quantidade-estoque').value = livro.quantidadeEstoque || 0;
        document.getElementById('livro-disponivel').checked = livro.disponivel;
        document.getElementById('livro-sinopse').value = livro.sinopse || '';

        // Selecionar autor
        if (livro.autor && livro.autor.id) {
            document.getElementById('livro-autor').value = livro.autor.id;
        }

        // Selecionar editora
        if (livro.editora && livro.editora.id) {
            document.getElementById('livro-editora').value = livro.editora.id;
        }

        // Selecionar categorias
        if (livro.categorias && livro.categorias.length > 0) {
            livro.categorias.forEach(categoria => {
                const checkbox = document.getElementById(`categoria-${categoria.id}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
    } catch (error) {
        showAlert('Erro ao carregar dados do livro', 'error');
    }
}

async function saveLivro(livroId = null) {
    const formData = {
        titulo: document.getElementById('livro-titulo').value.trim(),
        subtitulo: document.getElementById('livro-subtitulo').value.trim(),
        isbn: document.getElementById('livro-isbn').value.trim(),
        anoPublicacao: parseInt(document.getElementById('livro-ano-publicacao').value) || null,
        numeroPaginas: parseInt(document.getElementById('livro-numero-paginas').value) || null,
        idioma: document.getElementById('livro-idioma').value.trim(),
        preco: parseFloat(document.getElementById('livro-preco').value) || null,
        quantidadeEstoque: parseInt(document.getElementById('livro-quantidade-estoque').value) || 0,
        disponivel: document.getElementById('livro-disponivel').checked,
        sinopse: document.getElementById('livro-sinopse').value.trim(),
        dataCadastro: new Date().toISOString()
    };

    // Adicionar autor se selecionado
    const autorId = document.getElementById('livro-autor').value;
    if (autorId) {
        formData.autor = { id: parseInt(autorId) };
    }

    // Adicionar editora se selecionada
    const editoraId = document.getElementById('livro-editora').value;
    if (editoraId) {
        formData.editora = { id: parseInt(editoraId) };
    }

    // Adicionar categorias selecionadas
    const categoriasSelecionadas = [];
    AppState.categorias.forEach(categoria => {
        const checkbox = document.getElementById(`categoria-${categoria.id}`);
        if (checkbox && checkbox.checked) {
            categoriasSelecionadas.push({ id: categoria.id });
        }
    });
    formData.categorias = categoriasSelecionadas;

    // Validação
    if (!formData.titulo) {
        showAlert('Título é obrigatório', 'warning');
        return;
    }

    try {
        const button = document.querySelector('#livro-form button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

        if (livroId) {
            await ApiService.put(`${API_ENDPOINTS.livros}/${livroId}`, formData);
            showAlert('Livro atualizado com sucesso!', 'success');
        } else {
            await ApiService.post(API_ENDPOINTS.livros, formData);
            showAlert('Livro criado com sucesso!', 'success');
        }

        // Fechar modal e recarregar lista
        bootstrap.Modal.getInstance(document.getElementById('livro-modal')).hide();
        loadLivros();

    } catch (error) {
        showAlert('Erro ao salvar livro: ' + error.message, 'error');
    } finally {
        const button = document.querySelector('#livro-form button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = livroId ? '<i class="bi bi-check"></i> Atualizar' : '<i class="bi bi-check"></i> Salvar';
        }
    }
}

async function viewLivro(livroId) {
    try {
        const livro = await ApiService.get(`${API_ENDPOINTS.livros}/${livroId}`);
        
        const content = `
            <div class="row">
                <div class="col-md-8">
                    <h5>${livro.titulo}</h5>
                    ${livro.subtitulo ? `<h6 class="text-muted">${livro.subtitulo}</h6>` : ''}
                </div>
                <div class="col-md-4 text-end">
                    <span class="badge ${livro.disponivel ? 'status-disponivel' : 'status-indisponivel'} fs-6">
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Autor:</strong> ${livro.autor ? `${livro.autor.nome} ${livro.autor.sobrenome || ''}`.trim() : 'Não informado'}</p>
                    <p><strong>Editora:</strong> ${livro.editora ? livro.editora.razaoSocial : 'Não informado'}</p>
                    <p><strong>ISBN:</strong> ${livro.isbn || 'Não informado'}</p>
                    <p><strong>Ano de Publicação:</strong> ${livro.anoPublicacao || 'Não informado'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Número de Páginas:</strong> ${livro.numeroPaginas || 'Não informado'}</p>
                    <p><strong>Idioma:</strong> ${livro.idioma || 'Não informado'}</p>
                    <p><strong>Preço:</strong> ${livro.preco ? formatCurrency(livro.preco) : 'Não informado'}</p>
                    <p><strong>Estoque:</strong> ${livro.quantidadeEstoque || 0} unidades</p>
                </div>
            </div>
            ${livro.categorias && livro.categorias.length > 0 ? `
                <div class="mb-3">
                    <strong>Categorias:</strong><br>
                    ${livro.categorias.map(categoria => 
                        `<span class="badge me-1" style="background-color: ${categoria.cor || '#007bff'}; color: white;">${categoria.nome}</span>`
                    ).join('')}
                </div>
            ` : ''}
            ${livro.sinopse ? `
                <div class="mt-3">
                    <strong>Sinopse:</strong>
                    <p class="mt-2">${livro.sinopse}</p>
                </div>
            ` : ''}
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="editLivro(${livro.id}); bootstrap.Modal.getInstance(document.getElementById('view-livro-modal')).hide();">
                    <i class="bi bi-pencil"></i> Editar
                </button>
            </div>
        `;

        const modal = createModal('view-livro-modal', 'Detalhes do Livro', content, 'lg');
        modal.show();
        
    } catch (error) {
        showAlert('Erro ao carregar detalhes do livro', 'error');
    }
}

function editLivro(livroId) {
    showLivroForm(livroId);
}

function deleteLivro(livroId) {
    confirmAction(
        'Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.',
        async () => {
            try {
                await ApiService.delete(`${API_ENDPOINTS.livros}/${livroId}`);
                showAlert('Livro excluído com sucesso!', 'success');
                loadLivros();
                
            } catch (error) {
                showAlert('Erro ao excluir livro', 'error');
            }
        }
    );
}