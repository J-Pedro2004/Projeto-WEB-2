package com.br.repository;

import com.br.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações CRUD da entidade Categoria.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    List<Categoria> findByAtivaTrue();
    
    Optional<Categoria> findByNome(String nome);
    
    List<Categoria> findByNomeContainingIgnoreCase(String nome);
}
