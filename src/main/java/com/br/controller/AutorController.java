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
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.br.model.Autor;
import com.br.repository.AutorRepository;

/**
 * Controller responsável pelo CRUD da entidade Autor.
 * Expõe endpoints REST para gerenciar autores.
 */
@RestController
@RequestMapping("/api/autores")
@CrossOrigin(origins="*")
public class AutorController {

    @Autowired
    private AutorRepository autorRepository;

    /**
     * Lista todos os autores cadastrados.
     */
    @GetMapping
    public ResponseEntity<List<Autor>> listar() {
        List<Autor> autores = autorRepository.findAll();
        return ResponseEntity.ok(autores);
    }

    /**
     * Lista apenas autores ativos.
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<Autor>> listarAtivos() {
        List<Autor> autores = autorRepository.findByAtivoTrue();
        return ResponseEntity.ok(autores);
    }

    /**
     * Consulta um autor por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        var opt = autorRepository.findById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Autor não encontrado."));
        }
    }

    /**
     * Busca autores por nome.
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Autor>> buscarPorNome(@RequestParam String nome) {
        List<Autor> autores = autorRepository.findByNomeContaining(nome);
        return ResponseEntity.ok(autores);
    }

    /**
     * Inclui um novo autor.
     */
    @PostMapping
    public ResponseEntity<?> incluir(@Valid @RequestBody Autor autor) {
        try {
            Autor salvo = autorRepository.save(autor);
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
        var opt = autorRepository.findById(id);
        if (opt.isPresent()) {
            var autorExistente = opt.get();
            autorExistente.setNome(autor.getNome());
            autorExistente.setSobrenome(autor.getSobrenome());
            autorExistente.setDataNascimento(autor.getDataNascimento());
            autorExistente.setNacionalidade(autor.getNacionalidade());
            autorExistente.setBiografia(autor.getBiografia());
            autorExistente.setAtivo(autor.isAtivo());
            Autor salvo = autorRepository.save(autorExistente);
            return ResponseEntity.ok(salvo);
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Autor não encontrado para alteração."));
        }
    }

    /**
     * Exclui um autor.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (autorRepository.existsById(id)) {
            autorRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Autor não encontrado para exclusão."));
        }
    }

    /**
     * Inativa um autor (soft delete).
     */
    @PatchMapping("/{id}/inativar")
    public ResponseEntity<?> inativar(@PathVariable Long id) {
        var opt = autorRepository.findById(id);
        if (opt.isPresent()) {
            var autor = opt.get();
            autor.setAtivo(false);
            Autor salvo = autorRepository.save(autor);
            return ResponseEntity.ok(salvo);
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Autor não encontrado."));
        }
    }
}