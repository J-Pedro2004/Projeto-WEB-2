package com.br.controller;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.br.model.Livro;
import com.br.service.LivroService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins="*")
public class LivroController {

    private static final Logger logger = LoggerFactory.getLogger(LivroController.class);

    @Autowired
    private LivroService livroService;

    @GetMapping
    public ResponseEntity<List<Livro>> listar() {
        return ResponseEntity.ok(livroService.listar());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Livro>> listarDisponiveis() {
        return ResponseEntity.ok(livroService.listarDisponiveis());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Livro>> buscarPorTitulo(@RequestParam String titulo) {
        return ResponseEntity.ok(livroService.buscarPorTitulo(titulo));
    }

    @GetMapping("/autor/{autorId}")
    public ResponseEntity<List<Livro>> buscarPorAutor(@PathVariable Long autorId) {
        return ResponseEntity.ok(livroService.buscarPorAutor(autorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        var livro = livroService.consultar(id);
        if (livro.isPresent()) {
            return ResponseEntity.ok(livro.get());
        }
        return ResponseEntity.status(404).body(Collections.singletonMap("error", "Livro não encontrado."));
    }

    @PostMapping
    public ResponseEntity<?> incluir(@Valid @RequestBody Livro livro) {
        try {
            Livro salvo = livroService.incluir(livro);
            return ResponseEntity.status(201).body(salvo);
        } catch (Exception e) {
            logger.error("Erro ao criar livro", e);
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erro ao criar livro: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody Livro livro) {
        try {
            livroService.alterar(id, livro);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
             if (e.getMessage() != null && e.getMessage().contains("não encontrado")) {
                 return ResponseEntity.status(404).body(Collections.singletonMap("error", e.getMessage()));
             }
             logger.error("Erro ao alterar livro", e);
             return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erro ao alterar livro: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Erro ao alterar livro", e);
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erro ao alterar livro: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            livroService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
