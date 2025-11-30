// Gestão de Pedidos (Master-Detail)

async function loadPedidos() {
    showLoading('pedidos-tbody');
    
    try {
        const pedidos = await ApiService.get(API_ENDPOINTS.pedidos);
        AppState.pedidos = Array.isArray(pedidos) ? pedidos : [];
        displayPedidos(AppState.pedidos);
    } catch (error) {
        document.getElementById('pedidos-tbody').innerHTML = 
            '<tr><td colspan="6" class="text-center text-muted">Erro ao carregar pedidos</td></tr>';
    }
}

function displayPedidos(pedidos) {
    const tbody = document.getElementById('pedidos-tbody');
    
    if (!pedidos || pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum pedido encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = pedidos.map(pedido => `
        <tr>
            <td>${pedido.id}</td>
            <td>${formatDate(pedido.dataPedido)}</td>
            <td>${pedido.nomeCliente}</td>
            <td>
                <span class="badge status-${pedido.status.toLowerCase()}">
                    ${getStatusLabel(pedido.status)}
                </span>
            </td>
            <td>${pedido.valorTotal ? formatCurrency(pedido.valorTotal) : 'R$ 0,00'}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewPedido(${pedido.id})" title="Visualizar">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="editPedido(${pedido.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="manageItems(${pedido.id})" title="Gerenciar Itens">
                        <i class="bi bi-list-ul"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deletePedido(${pedido.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusLabel(status) {
    const statusLabels = {
        'PENDENTE': 'Pendente',
        'CONFIRMADO': 'Confirmado',
        'ENVIADO': 'Enviado',
        'ENTREGUE': 'Entregue',
        'CANCELADO': 'Cancelado'
    };
    return statusLabels[status] || status;
}

async function showPedidoForm(pedidoId = null) {
    const isEdit = pedidoId !== null;
    const title = isEdit ? 'Editar Pedido' : 'Novo Pedido';
    
    const formContent = `
        <form id="pedido-form">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="pedido-nome-cliente" class="form-label">Nome do Cliente *</label>
                        <input type="text" class="form-control" id="pedido-nome-cliente" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="pedido-email-cliente" class="form-label">Email do Cliente</label>
                        <input type="email" class="form-control" id="pedido-email-cliente">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="pedido-data" class="form-label">Data do Pedido *</label>
                        <input type="date" class="form-control" id="pedido-data" required value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="pedido-status" class="form-label">Status</label>
                        <select class="form-select" id="pedido-status">
                            <option value="PENDENTE">Pendente</option>
                            <option value="CONFIRMADO">Confirmado</option>
                            <option value="ENVIADO">Enviado</option>
                            <option value="ENTREGUE">Entregue</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="pedido-endereco-entrega" class="form-label">Endereço de Entrega</label>
                <textarea class="form-control" id="pedido-endereco-entrega" rows="2"></textarea>
            </div>
            <div class="mb-3">
                <label for="pedido-observacoes" class="form-label">Observações</label>
                <textarea class="form-control" id="pedido-observacoes" rows="2"></textarea>
            </div>
            
            <!-- Seção de Itens do Pedido -->
            <div class="border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6>Itens do Pedido</h6>
                    <button type="button" class="btn btn-sm btn-success" onclick="addItemToPedido()">
                        <i class="bi bi-plus"></i> Adicionar Item
                    </button>
                </div>
                <div id="itens-container">
                    <!-- Itens serão adicionados aqui dinamicamente -->
                </div>
                <div class="text-end mt-3">
                    <h5>Total: <span id="valor-total-display">R$ 0,00</span></h5>
                </div>
            </div>
            
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    `;

    const modal = createModal('pedido-modal', title, formContent, 'xl');
    
    // Inicializar variáveis globais para itens
    window.pedidoItens = [];
    window.itemCounter = 0;

    // Carregar dados dos livros para os selects
    await loadLivrosForSelect();

    // Se for edição, carregar dados do pedido
    if (isEdit) {
        await loadPedidoData(pedidoId);
    } else {
        // Adicionar um item vazio para começar
        addItemToPedido();
    }

    // Configurar submit do formulário
    document.getElementById('pedido-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePedido(pedidoId);
    });

    modal.show();
}

async function loadLivrosForSelect() {
    try {
        const livros = await ApiService.get(`${API_ENDPOINTS.livros}/disponiveis`);
        AppState.livrosDisponiveis = Array.isArray(livros) ? livros : [];
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        AppState.livrosDisponiveis = [];
    }
}

function addItemToPedido() {
    const itemId = window.itemCounter++;
    const container = document.getElementById('itens-container');
    
    const itemHTML = `
        <div class="row mb-3 item-row" id="item-${itemId}">
            <div class="col-md-6">
                <label class="form-label">Livro</label>
                <select class="form-select livro-select" data-item-id="${itemId}" onchange="updateItemPrice(${itemId})">
                    <option value="">Selecione um livro</option>
                    ${AppState.livrosDisponiveis.map(livro => 
                        `<option value="${livro.id}" data-preco="${livro.preco || 0}">${livro.titulo} - ${formatCurrency(livro.preco || 0)}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Quantidade</label>
                <input type="number" class="form-control quantidade-input" data-item-id="${itemId}" min="1" value="1" onchange="updateItemTotal(${itemId})">
            </div>
            <div class="col-md-2">
                <label class="form-label">Preço Unit.</label>
                <input type="number" class="form-control preco-input" data-item-id="${itemId}" step="0.01" min="0" onchange="updateItemTotal(${itemId})">
            </div>
            <div class="col-md-1">
                <label class="form-label">Subtotal</label>
                <input type="text" class="form-control subtotal-display" id="subtotal-${itemId}" readonly value="R$ 0,00">
            </div>
            <div class="col-md-1">
                <label class="form-label">&nbsp;</label>
                <button type="button" class="btn btn-danger btn-sm d-block" onclick="removeItem(${itemId})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHTML);
    window.pedidoItens.push({ id: itemId, livroId: null, quantidade: 1, preco: 0 });
}

function updateItemPrice(itemId) {
    const select = document.querySelector(`select[data-item-id="${itemId}"]`);
    const precoInput = document.querySelector(`input.preco-input[data-item-id="${itemId}"]`);
    
    if (select && precoInput) {
        const selectedOption = select.options[select.selectedIndex];
        const preco = selectedOption.getAttribute('data-preco') || 0;
        precoInput.value = preco;
        
        // Atualizar item no array
        const item = window.pedidoItens.find(i => i.id === itemId);
        if (item) {
            item.livroId = select.value ? parseInt(select.value) : null;
            item.preco = parseFloat(preco);
        }
        
        updateItemTotal(itemId);
    }
}

function updateItemTotal(itemId) {
    const quantidadeInput = document.querySelector(`input.quantidade-input[data-item-id="${itemId}"]`);
    const precoInput = document.querySelector(`input.preco-input[data-item-id="${itemId}"]`);
    const subtotalDisplay = document.getElementById(`subtotal-${itemId}`);
    
    if (quantidadeInput && precoInput && subtotalDisplay) {
        const quantidade = parseInt(quantidadeInput.value) || 0;
        const preco = parseFloat(precoInput.value) || 0;
        const subtotal = quantidade * preco;
        
        subtotalDisplay.value = formatCurrency(subtotal);
        
        // Atualizar item no array
        const item = window.pedidoItens.find(i => i.id === itemId);
        if (item) {
            item.quantidade = quantidade;
            item.preco = preco;
        }
        
        updateTotalPedido();
    }
}

function updateTotalPedido() {
    let total = 0;
    window.pedidoItens.forEach(item => {
        total += (item.quantidade || 0) * (item.preco || 0);
    });
    
    document.getElementById('valor-total-display').textContent = formatCurrency(total);
}

function removeItem(itemId) {
    document.getElementById(`item-${itemId}`).remove();
    window.pedidoItens = window.pedidoItens.filter(item => item.id !== itemId);
    updateTotalPedido();
}

async function loadPedidoData(pedidoId) {
    try {
        const pedido = await ApiService.get(`${API_ENDPOINTS.pedidos}/${pedidoId}`);
        
        document.getElementById('pedido-nome-cliente').value = pedido.nomeCliente || '';
        document.getElementById('pedido-email-cliente').value = pedido.emailCliente || '';
        document.getElementById('pedido-data').value = pedido.dataPedido ? pedido.dataPedido.split('T')[0] : '';
        document.getElementById('pedido-status').value = pedido.status || 'PENDENTE';
        document.getElementById('pedido-endereco-entrega').value = pedido.enderecoEntrega || '';
        document.getElementById('pedido-observacoes').value = pedido.observacoes || '';

        // Limpar container de itens
        document.getElementById('itens-container').innerHTML = '';
        window.pedidoItens = [];

        // Carregar itens do pedido
        if (pedido.itens && pedido.itens.length > 0) {
            pedido.itens.forEach(item => {
                addItemToPedido();
                const currentItemId = window.itemCounter - 1;
                
                // Preencher dados do item
                const select = document.querySelector(`select[data-item-id="${currentItemId}"]`);
                const quantidadeInput = document.querySelector(`input.quantidade-input[data-item-id="${currentItemId}"]`);
                const precoInput = document.querySelector(`input.preco-input[data-item-id="${currentItemId}"]`);
                
                if (select && item.livro) {
                    select.value = item.livro.id;
                }
                if (quantidadeInput) {
                    quantidadeInput.value = item.quantidade;
                }
                if (precoInput) {
                    precoInput.value = item.preco;
                }
                
                updateItemTotal(currentItemId);
            });
        } else {
            // Se não há itens, adicionar um vazio
            addItemToPedido();
        }
        
    } catch (error) {
        showAlert('Erro ao carregar dados do pedido', 'error');
    }
}

async function savePedido(pedidoId = null) {
    const formData = {
        nomeCliente: document.getElementById('pedido-nome-cliente').value.trim(),
        emailCliente: document.getElementById('pedido-email-cliente').value.trim(),
        dataPedido: document.getElementById('pedido-data').value,
        status: document.getElementById('pedido-status').value,
        enderecoEntrega: document.getElementById('pedido-endereco-entrega').value.trim(),
        observacoes: document.getElementById('pedido-observacoes').value.trim(),
        itens: []
    };

    // Validação
    if (!formData.nomeCliente) {
        showAlert('Nome do cliente é obrigatório', 'warning');
        return;
    }

    if (!formData.dataPedido) {
        showAlert('Data do pedido é obrigatória', 'warning');
        return;
    }

    // Coletar itens válidos
    window.pedidoItens.forEach(item => {
        if (item.livroId && item.quantidade > 0 && item.preco >= 0) {
            formData.itens.push({
                livro: { id: item.livroId },
                quantidade: item.quantidade,
                preco: item.preco
            });
        }
    });

    if (formData.itens.length === 0) {
        showAlert('É necessário adicionar pelo menos um item ao pedido', 'warning');
        return;
    }

    try {
        const button = document.querySelector('#pedido-form button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

        if (pedidoId) {
            await ApiService.put(`${API_ENDPOINTS.pedidos}/${pedidoId}`, formData);
            showAlert('Pedido atualizado com sucesso!', 'success');
        } else {
            await ApiService.post(API_ENDPOINTS.pedidos, formData);
            showAlert('Pedido criado com sucesso!', 'success');
        }

        // Fechar modal e recarregar lista
        bootstrap.Modal.getInstance(document.getElementById('pedido-modal')).hide();
        loadPedidos();

    } catch (error) {
        showAlert('Erro ao salvar pedido: ' + error.message, 'error');
    } finally {
        const button = document.querySelector('#pedido-form button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = pedidoId ? '<i class="bi bi-check"></i> Atualizar' : '<i class="bi bi-check"></i> Salvar';
        }
    }
}

async function viewPedido(pedidoId) {
    try {
        const pedido = await ApiService.get(`${API_ENDPOINTS.pedidos}/${pedidoId}`);
        
        const content = `
            <div class="row">
                <div class="col-md-8">
                    <h5>Pedido #${pedido.id}</h5>
                    <p class="text-muted">Data: ${formatDate(pedido.dataPedido)}</p>
                </div>
                <div class="col-md-4 text-end">
                    <span class="badge status-${pedido.status.toLowerCase()} fs-6">
                        ${getStatusLabel(pedido.status)}
                    </span>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
                    <p><strong>Email:</strong> ${pedido.emailCliente || 'Não informado'}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Valor Total:</strong> ${formatCurrency(pedido.valorTotal || 0)}</p>
                </div>
            </div>
            ${pedido.enderecoEntrega ? `
                <div class="mb-3">
                    <strong>Endereço de Entrega:</strong>
                    <p>${pedido.enderecoEntrega}</p>
                </div>
            ` : ''}
            ${pedido.observacoes ? `
                <div class="mb-3">
                    <strong>Observações:</strong>
                    <p>${pedido.observacoes}</p>
                </div>
            ` : ''}
            <div class="mb-3">
                <strong>Itens do Pedido:</strong>
                <div class="table-responsive mt-2">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Livro</th>
                                <th>Quantidade</th>
                                <th>Preço Unit.</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pedido.itens ? pedido.itens.map(item => `
                                <tr>
                                    <td>${item.livro ? item.livro.titulo : 'N/A'}</td>
                                    <td>${item.quantidade}</td>
                                    <td>${formatCurrency(item.preco)}</td>
                                    <td>${formatCurrency(item.quantidade * item.preco)}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="4">Nenhum item</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="editPedido(${pedido.id}); bootstrap.Modal.getInstance(document.getElementById('view-pedido-modal')).hide();">
                    <i class="bi bi-pencil"></i> Editar
                </button>
            </div>
        `;

        const modal = createModal('view-pedido-modal', 'Detalhes do Pedido', content, 'lg');
        modal.show();
        
    } catch (error) {
        showAlert('Erro ao carregar detalhes do pedido', 'error');
    }
}

function editPedido(pedidoId) {
    showPedidoForm(pedidoId);
}

function manageItems(pedidoId) {
    // Esta função poderia abrir um modal específico para gestão de itens
    // Por simplicidade, vamos usar o formulário de edição
    editPedido(pedidoId);
}

function deletePedido(pedidoId) {
    confirmAction(
        'Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.',
        async () => {
            try {
                await ApiService.delete(`${API_ENDPOINTS.pedidos}/${pedidoId}`);
                showAlert('Pedido excluído com sucesso!', 'success');
                loadPedidos();
                
            } catch (error) {
                showAlert('Erro ao excluir pedido', 'error');
            }
        }
    );
}