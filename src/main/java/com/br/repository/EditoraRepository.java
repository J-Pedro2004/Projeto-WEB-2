package com.br.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.model.Editora;

/**
 * Repositório para operações CRUD da entidade Editora.
 */
@Repository
public interface EditoraRepository extends JpaRepository<Editora, Long> {
    
    List<Editora> findByAtivaTrue();
    
    Optional<Editora> findByNome(String nome);
    
    Optional<Editora> findByCnpj(String cnpj);
    
    List<Editora> findByNomeContainingIgnoreCase(String nome);

    List<Editora> findByRazaoSocialContainingIgnoreCase(String razaoSocial);
}
