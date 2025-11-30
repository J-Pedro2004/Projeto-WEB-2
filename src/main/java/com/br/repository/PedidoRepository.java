package com.br.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.br.model.Pedido;
import com.br.model.StatusPedido;

/**
 * Repositório para operações CRUD da entidade Pedido (Mestre).
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    Optional<Pedido> findByNumero(String numero);
    
    @Query("SELECT DISTINCT p FROM Pedido p LEFT JOIN FETCH p.itens i LEFT JOIN FETCH i.livro WHERE p.status = :status")
    List<Pedido> findByStatus(@Param("status") StatusPedido status);
    
    @Query("SELECT DISTINCT p FROM Pedido p LEFT JOIN FETCH p.itens i LEFT JOIN FETCH i.livro WHERE UPPER(p.nomeCliente) LIKE UPPER(CONCAT('%', :nomeCliente, '%'))")
    List<Pedido> findByNomeClienteContainingIgnoreCase(@Param("nomeCliente") String nomeCliente);
    
    @Query("SELECT DISTINCT p FROM Pedido p LEFT JOIN FETCH p.itens i LEFT JOIN FETCH i.livro WHERE p.dataPedido BETWEEN :dataInicio AND :dataFim")
    List<Pedido> findByDataPedidoBetween(@Param("dataInicio") Date dataInicio, @Param("dataFim") Date dataFim);
    
    @Query("SELECT p FROM Pedido p JOIN FETCH p.itens i JOIN FETCH i.livro WHERE p.id = :id")
    Optional<Pedido> findByIdWithItens(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM Pedido p LEFT JOIN FETCH p.itens i LEFT JOIN FETCH i.livro")
    List<Pedido> findAllWithItens();

    boolean existsByTelefoneClienteAndNomeClienteNot(String telefoneCliente, String nomeCliente);
    
    boolean existsByTelefoneClienteAndNomeClienteNotAndIdNot(String telefoneCliente, String nomeCliente, Long id);

    boolean existsByEmailClienteAndNomeClienteNot(String emailCliente, String nomeCliente);
    
    boolean existsByEmailClienteAndNomeClienteNotAndIdNot(String emailCliente, String nomeCliente, Long id);
}
