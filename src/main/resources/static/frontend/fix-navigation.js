// Fix para navegação do botão Novo Pedido
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fix de navegação carregado');
    
    // Aguarda o Angular carregar
    setTimeout(function() {
        // Intercepta cliques em links com href vazio
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href="#"], a[routerlink], button');
            
            if (!target) return;
            
            // Verifica se é o botão de novo pedido
            const text = target.textContent || target.innerText;
            
            if (text.includes('Novo Pedido') || text.includes('Adicionar Novo Pedido')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Navegando para novo pedido...');
                
                // Navega manualmente
                window.location.href = '/frontend/#/pedidos/novo';
                
                return false;
            }
        }, true);
        
        console.log('Listener de navegação ativado');
    }, 1000);
});
