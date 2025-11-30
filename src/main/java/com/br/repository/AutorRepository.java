package com.br.repository;

import com.br.model.Autor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para operações CRUD da entidade Autor.
 */
@Repository
public interface AutorRepository extends JpaRepository<Autor, Long> {
    
    List<Autor> findByAtivoTrue();
    
    @Query("SELECT a FROM Autor a WHERE a.nome LIKE %:nome% OR a.sobrenome LIKE %:nome%")
    List<Autor> findByNomeContaining(@Param("nome") String nome);
    
    List<Autor> findByNacionalidade(String nacionalidade);
}
