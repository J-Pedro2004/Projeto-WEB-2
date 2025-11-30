package com.br.repository;

import com.br.model.ItemPedido;
import com.br.model.Livro;
import com.br.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para operações CRUD da entidade ItemPedido (Detalhe).
 */
@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    
    List<ItemPedido> findByPedido(Pedido pedido);
    
    List<ItemPedido> findByLivro(Livro livro);
    
    @Query("SELECT i FROM ItemPedido i WHERE i.pedido.id = :pedidoId")
    List<ItemPedido> findByPedidoId(@Param("pedidoId") Long pedidoId);
    
    @Query("SELECT SUM(i.quantidade) FROM ItemPedido i WHERE i.livro.id = :livroId")
    Integer getTotalQuantidadeVendidaPorLivro(@Param("livroId") Long livroId);
}
