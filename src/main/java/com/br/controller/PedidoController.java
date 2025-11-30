package com.br.controller;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.br.model.ItemPedido;
import com.br.model.Pedido;
import com.br.model.StatusPedido;
import com.br.repository.ItemPedidoRepository;
import com.br.repository.LivroRepository;
import com.br.repository.PedidoRepository;

/**
 * Controller responsável pelo CRUD da entidade Pedido (Mestre-Detalhe).
 * Implementa operações completas de pedidos com seus itens.
 */
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins="*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private LivroRepository livroRepository;

    /**
     * Lista todos os pedidos.
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Pedido>> listar() {
        System.out.println("Listando pedidos...");
        List<Pedido> pedidos = pedidoRepository.findAll();
        System.out.println("Pedidos encontrados: " + pedidos.size());
        
        inicializarLazyLoading(pedidos);
        
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Consulta um pedido por ID com todos os itens (Mestre-Detalhe).
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        var opt = pedidoRepository.findById(id);
        if (opt.isPresent()) {
            Pedido p = opt.get();
            inicializarLazyLoading(Collections.singletonList(p));
            return ResponseEntity.ok((Object) p);
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Pedido não encontrado."));
        }
    }

    /**
     * Busca pedidos por status.
     */
    @GetMapping("/status")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Pedido>> buscarPorStatus(@RequestParam StatusPedido status) {
        List<Pedido> pedidos = pedidoRepository.findByStatus(status);
        inicializarLazyLoading(pedidos);
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Busca pedidos por período.
     */
    @GetMapping("/periodo")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Pedido>> buscarPorPeriodo(
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date inicio = sdf.parse(dataInicio);
            Date fim = sdf.parse(dataFim);
            List<Pedido> pedidos = pedidoRepository.findByDataPedidoBetween(inicio, fim);
            inicializarLazyLoading(pedidos);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Busca pedidos por nome do cliente.
     */
    @GetMapping("/cliente")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Pedido>> buscarPorCliente(@RequestParam String nome) {
        System.out.println("Buscando pedidos por cliente: " + nome);
        List<Pedido> pedidos = pedidoRepository.findByNomeClienteContainingIgnoreCase(nome);
        inicializarLazyLoading(pedidos);
        return ResponseEntity.ok(pedidos);
    }

    private void inicializarLazyLoading(List<Pedido> pedidos) {
        for (Pedido p : pedidos) {
            Hibernate.initialize(p.getItens());
            if (p.getItens() != null) {
                for (ItemPedido item : p.getItens()) {
                    Hibernate.initialize(item.getLivro());
                    if (item.getLivro() != null) {
                        Hibernate.initialize(item.getLivro().getAutor());
                        Hibernate.initialize(item.getLivro().getEditora());
                        Hibernate.initialize(item.getLivro().getCategorias());
                    }
                }
            }
        }
    }

    /**
     * Cria um novo pedido com itens (Transação Mestre-Detalhe).
     */
    @PostMapping
    @Transactional
    public ResponseEntity<?> incluir(@RequestBody Pedido pedido) {
        System.out.println("Tentando criar pedido para: " + pedido.getNomeCliente());
        try {
            // Gerar número único do pedido
            pedido.setNumero("PED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            
            // Processar itens do pedido (detalhe) ANTES de salvar
            if (pedido.getItens() != null && !pedido.getItens().isEmpty()) {
                for (ItemPedido item : pedido.getItens()) {
                    item.setPedido(pedido); // Vincula o item ao pedido
                    
                    // Validar se o livro existe e obter preço atualizado
                    if (item.getLivro() != null && item.getLivro().getId() != null) {
                        livroRepository.findById(item.getLivro().getId())
                            .ifPresent(livro -> {
                                item.setLivro(livro);
                                item.setPrecoUnitario(livro.getPreco()); // Garante preço do banco
                            });
                    }
                    
                    // Calcular valores do item
                    item.calcularSubtotal();
                }
                
                // Calcular valor total do pedido
                pedido.calcularValorTotal();
            }
            
            // Salvar o pedido (o CascadeType.ALL salvará os itens automaticamente)
            Pedido pedidoSalvo = pedidoRepository.save(pedido);
            System.out.println("Pedido salvo com sucesso. ID: " + pedidoSalvo.getId());
            
            // Inicializar lazy loading para retorno
            Hibernate.initialize(pedidoSalvo.getItens());
            if (pedidoSalvo.getItens() != null) {
                for (ItemPedido item : pedidoSalvo.getItens()) {
                    Hibernate.initialize(item.getLivro());
                    if (item.getLivro() != null) {
                        Hibernate.initialize(item.getLivro().getAutor());
                        Hibernate.initialize(item.getLivro().getEditora());
                        Hibernate.initialize(item.getLivro().getCategorias());
                    }
                }
            }
            
            return ResponseEntity.status(201).body((Object) pedidoSalvo);
            
        } catch (Exception e) {
            System.err.println("Erro ao criar pedido: " + e.getMessage());
            e.printStackTrace(); // Log do erro no console
            return ResponseEntity.status(500).body("Erro ao criar pedido: " + e.getMessage());
        }
    }

    /**
     * Atualiza um pedido existente com seus itens.
     */
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> alterar(@PathVariable Long id, @RequestBody Pedido pedido) {
        var opt = pedidoRepository.findById(id);
        if (opt.isPresent()) {
            var pedidoExistente = opt.get();
            try {
                // Atualizar dados do mestre
                pedidoExistente.setNomeCliente(pedido.getNomeCliente());
                pedidoExistente.setEmailCliente(pedido.getEmailCliente());
                pedidoExistente.setTelefoneCliente(pedido.getTelefoneCliente());
                pedidoExistente.setEnderecoEntrega(pedido.getEnderecoEntrega());
                pedidoExistente.setStatus(pedido.getStatus());
                pedidoExistente.setDataEntregaPrevista(pedido.getDataEntregaPrevista());
                pedidoExistente.setValorFrete(pedido.getValorFrete());
                pedidoExistente.setValorDesconto(pedido.getValorDesconto());
                pedidoExistente.setObservacoes(pedido.getObservacoes());
                
                // Atualizar itens
                pedidoExistente.getItens().clear();
                
                if (pedido.getItens() != null) {
                    for (ItemPedido item : pedido.getItens()) {
                        item.setPedido(pedidoExistente);
                        if (item.getLivro() != null && item.getLivro().getId() != null) {
                            livroRepository.findById(item.getLivro().getId())
                                .ifPresent(item::setLivro);
                        }
                        item.calcularSubtotal();
                        pedidoExistente.getItens().add(item);
                    }
                }
                
                // Recalcular totais
                pedidoExistente.calcularValorTotal();
                pedidoRepository.save(pedidoExistente);
                
                return ResponseEntity.ok((Object) pedidoExistente);
                
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
            }
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Pedido não encontrado para alteração."));
        }
    }

    /**
     * Atualiza apenas o status do pedido.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id, @RequestParam StatusPedido status) {
        var opt = pedidoRepository.findById(id);
        if (opt.isPresent()) {
            var pedido = opt.get();
            pedido.setStatus(status);
            pedidoRepository.save(pedido);
            return ResponseEntity.ok(Collections.singletonMap("status", status.getDescricao()));
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Pedido não encontrado."));
        }
    }

    /**
     * Exclui um pedido e todos os seus itens.
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        var opt = pedidoRepository.findById(id);
        if (opt.isPresent()) {
            var pedido = opt.get();
            pedidoRepository.delete(pedido);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Pedido não encontrado para exclusão."));
        }
    }

    /**
     * Lista itens de um pedido específico.
     */
    @GetMapping("/{id}/itens")
    public ResponseEntity<List<ItemPedido>> listarItens(@PathVariable Long id) {
        List<ItemPedido> itens = itemPedidoRepository.findByPedidoId(id);
        return ResponseEntity.ok(itens);
    }

    /**
     * Adiciona um item a um pedido existente.
     */
    @PostMapping("/{id}/itens")
    @Transactional
    public ResponseEntity<?> adicionarItem(@PathVariable Long id, @RequestBody ItemPedido item) {
        return pedidoRepository.findById(id)
            .map(pedido -> {
                try {
                    item.setPedido(pedido);
                    
                    if (item.getLivro() != null && item.getLivro().getId() != null) {
                        livroRepository.findById(item.getLivro().getId())
                            .ifPresent(item::setLivro);
                    }
                    
                    item.calcularSubtotal();
                    ItemPedido salvo = itemPedidoRepository.save(item);
                    
                    // Recalcular total do pedido
                    pedido.calcularValorTotal();
                    pedidoRepository.save(pedido);
                    
                    return ResponseEntity.status(201).body((Object) salvo);
                    
                } catch (Exception e) {
                    return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
                }
            })
            .orElseGet(() -> ResponseEntity.status(404).body(Collections.singletonMap("error", "Pedido não encontrado.")));
    }

    /**
     * Remove um item de um pedido.
     */
    @DeleteMapping("/{pedidoId}/itens/{itemId}")
    @Transactional
    public ResponseEntity<?> removerItem(@PathVariable Long pedidoId, @PathVariable Long itemId) {
        return itemPedidoRepository.findById(itemId)
            .filter(item -> item.getPedido().getId().equals(pedidoId))
            .map(item -> {
                Pedido pedido = item.getPedido();
                itemPedidoRepository.delete(item);
                
                // Recalcular total do pedido
                pedido.calcularValorTotal();
                pedidoRepository.save(pedido);
                
                return ResponseEntity.noContent().build();
            })
            .orElseGet(() -> ResponseEntity.status(404).body(Collections.singletonMap("error", "Item não encontrado no pedido especificado.")));
    }

    /**
     * Atualiza um item de um pedido.
     */
    @PutMapping("/{pedidoId}/itens/{itemId}")
    @Transactional
    public ResponseEntity<?> atualizarItem(@PathVariable Long pedidoId, @PathVariable Long itemId, @RequestBody ItemPedido itemAtualizado) {
        return itemPedidoRepository.findById(itemId)
            .filter(item -> item.getPedido().getId().equals(pedidoId))
            .map(item -> {
                try {
                    item.setQuantidade(itemAtualizado.getQuantidade());
                    // item.setPrecoUnitario(itemAtualizado.getPrecoUnitario()); // Preço vem do livro geralmente, mas pode ser override
                    
                    item.calcularSubtotal();
                    ItemPedido salvo = itemPedidoRepository.save(item);
                    
                    // Recalcular total do pedido
                    Pedido pedido = item.getPedido();
                    pedido.calcularValorTotal();
                    pedidoRepository.save(pedido);
                    
                    return ResponseEntity.ok((Object) salvo);
                } catch (Exception e) {
                    return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
                }
            })
            .orElseGet(() -> ResponseEntity.status(404).body(Collections.singletonMap("error", "Item não encontrado.")));
    }
}