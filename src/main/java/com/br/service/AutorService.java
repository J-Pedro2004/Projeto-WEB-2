package com.br.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.model.Autor;
import com.br.repository.AutorRepository;

@Service
public class AutorService {

    @Autowired
    private AutorRepository autorRepository;

    public List<Autor> listar() {
        return autorRepository.findAll();
    }

    public List<Autor> listarAtivos() {
        return autorRepository.findByAtivoTrue();
    }

    public Optional<Autor> consultar(Long id) {
        return autorRepository.findById(id);
    }

    public List<Autor> buscarPorNome(String nome) {
        return autorRepository.findByNomeContaining(nome);
    }

    @Transactional
    public Autor incluir(Autor autor) {
        return autorRepository.save(autor);
    }

    @Transactional
    public Autor alterar(Long id, Autor autor) {
        Autor autorExistente = autorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Autor não encontrado para alteração."));
        
        autorExistente.setNome(autor.getNome());
        autorExistente.setSobrenome(autor.getSobrenome());
        autorExistente.setDataNascimento(autor.getDataNascimento());
        autorExistente.setNacionalidade(autor.getNacionalidade());
        autorExistente.setBiografia(autor.getBiografia());
        autorExistente.setAtivo(autor.isAtivo());
        
        return autorRepository.save(autorExistente);
    }

    @Transactional
    public void excluir(Long id) {
        if (!autorRepository.existsById(id)) {
            throw new RuntimeException("Autor não encontrado para exclusão.");
        }
        try {
            autorRepository.deleteById(id);
            autorRepository.flush();
        } catch (Exception e) {
            // Captura qualquer erro de integridade (DataIntegrityViolationException, ConstraintViolationException, etc)
            throw new RuntimeException("Não é possível excluir o autor pois ele possui registros associados (livros). Tente inativá-lo.");
        }
    }

    @Transactional
    public Autor inativar(Long id) {
        Autor autor = autorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Autor não encontrado."));
        
        autor.setAtivo(false);
        return autorRepository.save(autor);
    }
}
