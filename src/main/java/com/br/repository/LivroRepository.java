
package com.br.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.br.model.Autor;
import com.br.model.Categoria;
import com.br.model.Livro;

/**
 * Repositório para operações CRUD da entidade Livro.
 * Inclui consultas com relacionamentos para Autor, Editora e Categorias.
 */
@Repository
public interface LivroRepository extends JpaRepository<Livro,Long>{
    
    List<Livro> findByDisponivelTrue();
    
    List<Livro> findByAutor(Autor autor);
    
    @Query("SELECT l FROM Livro l WHERE l.titulo LIKE %:titulo%")
    List<Livro> findByTituloContaining(@Param("titulo") String titulo);
    
    List<Livro> findByAnoPublicacao(int ano);
    
    @Query("SELECT l FROM Livro l JOIN l.categorias c WHERE c = :categoria")
    List<Livro> findByCategoria(@Param("categoria") Categoria categoria);
    
    @Query("SELECT l FROM Livro l WHERE l.isbn = :isbn")
    Optional<Livro> findByIsbn(@Param("isbn") String isbn);
    
    @Query("SELECT l FROM Livro l LEFT JOIN FETCH l.autor LEFT JOIN FETCH l.editora LEFT JOIN FETCH l.categorias WHERE l.id = :id")
    Optional<Livro> findByIdWithRelationships(@Param("id") Long id);
    
    @Query("SELECT l FROM Livro l LEFT JOIN FETCH l.autor LEFT JOIN FETCH l.editora LEFT JOIN FETCH l.categorias")
    List<Livro> findAllWithRelationships();

    List<Livro> findByAutorId(Long autorId);
}