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

import com.br.model.Editora;
import com.br.repository.EditoraRepository;

/**
 * Controller responsável pelo CRUD da entidade Editora.
 */
@RestController
@RequestMapping("/api/editoras")
@CrossOrigin(origins="*")
public class EditoraController {

    @Autowired
    private EditoraRepository editoraRepository;

    @GetMapping
    public ResponseEntity<List<Editora>> listar() {
        List<Editora> editoras = editoraRepository.findAll();
        return ResponseEntity.ok(editoras);
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<Editora>> listarAtivas() {
        List<Editora> editoras = editoraRepository.findByAtivaTrue();
        return ResponseEntity.ok(editoras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        var opt = editoraRepository.findById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok((Object) opt.get());
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Editora não encontrada."));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Editora>> buscarPorRazaoSocial(@RequestParam String razaoSocial) {
        List<Editora> editoras = editoraRepository.findByRazaoSocialContainingIgnoreCase(razaoSocial);
        return ResponseEntity.ok(editoras);
    }

    @GetMapping("/cnpj")
    public ResponseEntity<?> buscarPorCnpj(@RequestParam String cnpj) {
        var opt = editoraRepository.findByCnpj(cnpj);
        if (opt.isPresent()) {
            return ResponseEntity.ok((Object) opt.get());
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Editora não encontrada."));
        }
    }

    @PostMapping
    public ResponseEntity<?> incluir(@RequestBody Editora editora) {
        try {
            // Validações de Unicidade
            if (editora.getCnpj() != null && !editora.getCnpj().isEmpty() && editoraRepository.existsByCnpj(editora.getCnpj())) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", "CNPJ já cadastrado."));
            }
            if (editora.getRazaoSocial() != null && !editora.getRazaoSocial().isEmpty() && editoraRepository.existsByRazaoSocial(editora.getRazaoSocial())) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", "Razão Social já cadastrada."));
            }
            if (editora.getTelefone() != null && !editora.getTelefone().isEmpty() && editoraRepository.existsByTelefone(editora.getTelefone())) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", "Telefone já cadastrado."));
            }

            Editora salva = editoraRepository.save(editora);
            return ResponseEntity.status(201).body((Object) salva);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @RequestBody Editora editora) {
        var opt = editoraRepository.findById(id);
        if (opt.isPresent()) {
            // Validações de Unicidade
            if (editora.getCnpj() != null && !editora.getCnpj().isEmpty() && editoraRepository.existsByCnpjAndIdNot(editora.getCnpj(), id)) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", "CNPJ já cadastrado para outra editora."));
            }
            if (editora.getRazaoSocial() != null && !editora.getRazaoSocial().isEmpty() && editoraRepository.existsByRazaoSocialAndIdNot(editora.getRazaoSocial(), id)) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", "Razão Social já cadastrada para outra editora."));
            }
            if (editora.getTelefone() != null && !editora.getTelefone().isEmpty() && editoraRepository.existsByTelefoneAndIdNot(editora.getTelefone(), id)) {
                return ResponseEntity.status(400).body(Collections.singletonMap("error", "Telefone já cadastrado para outra editora."));
            }

            var editoraExistente = opt.get();
            editoraExistente.setNome(editora.getNome());
            editoraExistente.setRazaoSocial(editora.getRazaoSocial());
            editoraExistente.setEndereco(editora.getEndereco());
            editoraExistente.setTelefone(editora.getTelefone());
            editoraExistente.setEmail(editora.getEmail());
            editoraExistente.setWebsite(editora.getWebsite());
            editoraExistente.setCnpj(editora.getCnpj());
            editoraExistente.setAtiva(editora.isAtiva());
            editoraExistente.setDataFundacao(editora.getDataFundacao());
            Editora salva = editoraRepository.save(editoraExistente);
            return ResponseEntity.ok((Object) salva);
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Editora não encontrada para alteração."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (editoraRepository.existsById(id)) {
            editoraRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Editora não encontrada para exclusão."));
        }
    }
}