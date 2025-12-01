package com.br.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

import com.br.model.Autor;
import com.br.service.AutorService;

import jakarta.validation.Valid;

/**
 * Controller responsável pelo CRUD da entidade Autor.
 * Expõe endpoints REST para gerenciar autores.
 */
@RestController
@RequestMapping("/api/autores")
@CrossOrigin(origins="*")
public class AutorController {

    @Autowired
    private AutorService autorService;

    /**
     * Lista todos os autores cadastrados.
     */
    @GetMapping
    public ResponseEntity<List<Autor>> listar() {
        return ResponseEntity.ok(autorService.listar());
    }

    /**
     * Lista apenas autores ativos.
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<Autor>> listarAtivos() {
        return ResponseEntity.ok(autorService.listarAtivos());
    }

    /**
     * Consulta um autor por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        java.util.Optional<Autor> autor = autorService.consultar(id);
        if (autor.isPresent()) {
            return ResponseEntity.ok(autor.get());
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Autor não encontrado."));
        }
    }

    /**
     * Busca autores por nome.
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Autor>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(autorService.buscarPorNome(nome));
    }

    /**
     * Inclui um novo autor.
     */
    @PostMapping
    public ResponseEntity<?> incluir(@Valid @RequestBody Autor autor) {
        try {
            Autor salvo = autorService.incluir(autor);
            return ResponseEntity.status(201).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    /**
     * Atualiza um autor existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody Autor autor) {
        try {
            Autor salvo = autorService.alterar(id, autor);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("não encontrado")) {
                return ResponseEntity.status(404).body(Collections.singletonMap("error", e.getMessage()));
            }
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erro ao atualizar autor: " + e.getMessage()));
        }
    }

    /**
     * Exclui um autor.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            autorService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("não encontrado")) {
                return ResponseEntity.status(404).body(Collections.singletonMap("error", e.getMessage()));
            }
            if (e.getMessage() != null && e.getMessage().contains("não é possível excluir")) {
                return ResponseEntity.status(409).body(Collections.singletonMap("error", e.getMessage()));
            }
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erro ao excluir autor: " + e.getMessage()));
        }
    }

    /**
     * Inativa um autor (soft delete).
     */
    @PatchMapping("/{id}/inativar")
    public ResponseEntity<?> inativar(@PathVariable Long id) {
        try {
            Autor salvo = autorService.inativar(id);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}