package com.br.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.model.Autor;
import com.br.model.Categoria;
import com.br.model.Editora;
import com.br.model.Livro;
import com.br.repository.AutorRepository;
import com.br.repository.CategoriaRepository;
import com.br.repository.EditoraRepository;
import com.br.repository.LivroRepository;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private EditoraRepository editoraRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Livro> listar() {
        return livroRepository.findAllWithRelationships();
    }

    public List<Livro> listarDisponiveis() {
        return livroRepository.findByDisponivelTrue();
    }

    public List<Livro> buscarPorTitulo(String titulo) {
        return livroRepository.findByTituloContaining(titulo);
    }

    public List<Livro> buscarPorAutor(Long autorId) {
        return livroRepository.findByAutorId(autorId);
    }

    public Optional<Livro> consultar(Long id) {
        return livroRepository.findByIdWithRelationships(id);
    }

    @Transactional
    public Livro incluir(Livro livro) {
        // Garante que é uma inclusão
        livro.setId(null);

        // Validação e carregamento do Autor
        if (livro.getAutor() != null) {
            if (livro.getAutor().getId() != null) {
                Autor autor = autorRepository.findById(livro.getAutor().getId())
                    .orElseThrow(() -> new RuntimeException("Autor informado não existe."));
                livro.setAutor(autor);
            } else {
                livro.setAutor(null);
            }
        }

        // Validação e carregamento da Editora
        if (livro.getEditora() != null) {
            if (livro.getEditora().getId() != null) {
                Editora editora = editoraRepository.findById(livro.getEditora().getId())
                    .orElseThrow(() -> new RuntimeException("Editora informada não existe."));
                livro.setEditora(editora);
            } else {
                livro.setEditora(null);
            }
        }

        // Validação e carregamento das Categorias
        if (livro.getCategorias() != null && !livro.getCategorias().isEmpty()) {
            List<Long> ids = livro.getCategorias().stream()
                .filter(c -> c.getId() != null)
                .map(Categoria::getId)
                .collect(Collectors.toList());
            
            if (!ids.isEmpty()) {
                List<Categoria> categorias = categoriaRepository.findAllById(ids);
                livro.setCategorias(categorias);
            } else {
                livro.setCategorias(null);
            }
        }

        Livro salvo = livroRepository.save(livro);
        
        // Recarrega o livro com os relacionamentos
        return livroRepository.findByIdWithRelationships(salvo.getId())
                .orElse(salvo);
    }

    @Transactional
    public Livro alterar(Long id, Livro livro) {
        Livro livroExistente = livroRepository.findByIdWithRelationships(id)
            .orElseThrow(() -> new RuntimeException("Livro não encontrado para alteração."));

        livroExistente.setTitulo(livro.getTitulo());
        livroExistente.setSubtitulo(livro.getSubtitulo());
        livroExistente.setIsbn(livro.getIsbn());
        livroExistente.setAnoPublicacao(livro.getAnoPublicacao());
        livroExistente.setNumeroPaginas(livro.getNumeroPaginas());
        livroExistente.setIdioma(livro.getIdioma());
        livroExistente.setPreco(livro.getPreco());
        livroExistente.setQuantidadeEstoque(livro.getQuantidadeEstoque());
        livroExistente.setDisponivel(livro.isDisponivel());
        
        // Regra de Negócio: Se estoque for zero ou negativo, o livro fica indisponível automaticamente
        if (livroExistente.getQuantidadeEstoque() <= 0) {
            livroExistente.setDisponivel(false);
        }
        livroExistente.setSinopse(livro.getSinopse());
        
        // Atualiza Autor
        if (livro.getAutor() != null && livro.getAutor().getId() != null) {
            Autor autor = autorRepository.findById(livro.getAutor().getId()).orElse(null);
            livroExistente.setAutor(autor);
        } else {
            livroExistente.setAutor(null);
        }

        // Atualiza Editora
        if (livro.getEditora() != null && livro.getEditora().getId() != null) {
            Editora editora = editoraRepository.findById(livro.getEditora().getId()).orElse(null);
            livroExistente.setEditora(editora);
        } else {
            livroExistente.setEditora(null);
        }

        // Atualiza Categorias
        if (livro.getCategorias() != null) {
            List<Long> ids = livro.getCategorias().stream()
                .filter(c -> c.getId() != null)
                .map(Categoria::getId)
                .collect(Collectors.toList());
            
            if (!ids.isEmpty()) {
                List<Categoria> categorias = categoriaRepository.findAllById(ids);
                livroExistente.setCategorias(categorias);
            } else {
                livroExistente.setCategorias(null);
            }
        }
        
        Livro salvo = livroRepository.save(livroExistente);
        
        // Recarrega o livro com os relacionamentos para retornar completo
        return livroRepository.findByIdWithRelationships(salvo.getId())
                .orElse(salvo);
    }

    @Transactional
    public void excluir(Long id) {
        if (!livroRepository.existsById(id)) {
            throw new RuntimeException("Livro não encontrado para exclusão.");
        }

        try {
            livroRepository.deleteById(id);
            livroRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Não é possível excluir o livro pois ele possui registros associados (empréstimos ou pedidos). Tente inativá-lo.");
        }
    }
}
