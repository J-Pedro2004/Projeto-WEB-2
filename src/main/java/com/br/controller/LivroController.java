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

import com.br.model.Autor;
import com.br.model.Editora;
import com.br.model.Livro;
import com.br.repository.AutorRepository;
import com.br.repository.EditoraRepository;
import com.br.repository.LivroRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins="*")
public class LivroController {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private EditoraRepository editoraRepository;

    @GetMapping
    public ResponseEntity<List<Livro>> listar() {
        // Usa consulta com fetch dos relacionamentos para evitar LazyInitializationException
        List<Livro> livros = livroRepository.findAllWithRelationships();
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Livro>> listarDisponiveis() {
        List<Livro> livros = livroRepository.findByDisponivelTrue();
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Livro>> buscarPorTitulo(@RequestParam String titulo) {
        List<Livro> livros = livroRepository.findByTituloContaining(titulo);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/autor/{autorId}")
    public ResponseEntity<List<Livro>> buscarPorAutor(@PathVariable Long autorId) {
        List<Livro> livros = livroRepository.findByAutorId(autorId);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> consultar(@PathVariable Long id) {
        var opt = livroRepository.findByIdWithRelationships(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Livro não encontrado."));
        }
    }

    @PostMapping
    public ResponseEntity<?> incluir(@Valid @RequestBody Livro livro) {
        try {
            Livro salvo = livroRepository.save(livro);
            return ResponseEntity.status(201).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterar(@PathVariable Long id, @Valid @RequestBody Livro livro) {
        return livroRepository.findByIdWithRelationships(id)
            .map(livroExistente -> {
                try {
                    livroExistente.setTitulo(livro.getTitulo());
                    livroExistente.setSubtitulo(livro.getSubtitulo());
                    livroExistente.setIsbn(livro.getIsbn());
                    livroExistente.setAnoPublicacao(livro.getAnoPublicacao());
                    livroExistente.setNumeroPaginas(livro.getNumeroPaginas());
                    livroExistente.setIdioma(livro.getIdioma());
                    livroExistente.setPreco(livro.getPreco());
                    livroExistente.setQuantidadeEstoque(livro.getQuantidadeEstoque());
                    livroExistente.setDisponivel(livro.isDisponivel());
                    livroExistente.setSinopse(livro.getSinopse());
                    
                    // Atualiza Autor buscando do banco para evitar objeto parcial
                    if (livro.getAutor() != null && livro.getAutor().getId() != null) {
                        Autor autor = autorRepository.findById(livro.getAutor().getId()).orElse(null);
                        livroExistente.setAutor(autor);
                    } else {
                        livroExistente.setAutor(null);
                    }

                    // Atualiza Editora buscando do banco
                    if (livro.getEditora() != null && livro.getEditora().getId() != null) {
                        Editora editora = editoraRepository.findById(livro.getEditora().getId()).orElse(null);
                        livroExistente.setEditora(editora);
                    } else {
                        livroExistente.setEditora(null);
                    }

                    // Só atualiza categorias se for passado algo (evita limpar se vier null)
                    if (livro.getCategorias() != null) {
                        livroExistente.setCategorias(livro.getCategorias());
                    }
                    
                    livroRepository.save(livroExistente);
                    return ResponseEntity.ok().build();
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erro ao alterar livro: " + e.getMessage()));
                }
            })
        .orElseGet(() -> ResponseEntity.status(404).body(Collections.singletonMap("error", "Livro não encontrado para alteração.")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (livroRepository.existsById(id)) {
            livroRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(404).body(Collections.singletonMap("error", "Livro não encontrado para exclusão."));
        }
    }
}
