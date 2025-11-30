package com.br.controller;

import java.util.Collections;
import java.util.List;

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

import com.br.model.Categoria;
import com.br.repository.CategoriaRepository;

/**
 * Controller responsável pelo CRUD da entidade Categoria.
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins="*")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<List<Categoria>> listar() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<Categoria>> listarAtivas() {
        List<Categoria> categorias = categoriaRepository.findByAtivaTrue();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Categoria>> buscarPorNome(@RequestParam String nome) {
        List<Categoria> categorias = categoriaRepository.findByNomeContainingIgnoreCase(nome);
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        var opt = categoriaRepository.findById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Categoria não encontrada."));
        }
    }

    @PostMapping
    public ResponseEntity<?> incluir(@RequestBody Categoria categoria) {
        try {
            Categoria salva = categoriaRepository.save(categoria);
            return ResponseEntity.status(201).body(salva);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @RequestBody Categoria categoria) {
        var opt = categoriaRepository.findById(id);
        if (opt.isPresent()) {
            var categoriaExistente = opt.get();
            categoriaExistente.setNome(categoria.getNome());
            categoriaExistente.setDescricao(categoria.getDescricao());
            categoriaExistente.setCor(categoria.getCor());
            categoriaExistente.setAtiva(categoria.isAtiva());
            Categoria salva = categoriaRepository.save(categoriaExistente);
            return ResponseEntity.ok(salva);
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Categoria não encontrada para alteração."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Categoria não encontrada para exclusão."));
        }
    }
}