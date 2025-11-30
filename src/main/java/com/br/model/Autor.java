package com.br.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import java.util.List;

/**
 * Entidade Autor - representa um autor de livros
 * Relacionamento 1:N com Livro (um autor pode ter vários livros)
 */
@Entity
@Table(name = "autores")
public class Autor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @Column(length = 200)
    private String sobrenome;
    
    @Temporal(TemporalType.DATE)
    private Date dataNascimento;
    
    @Column(length = 50)
    private String nacionalidade;
    
    @Column(columnDefinition = "TEXT")
    private String biografia;
    
    private boolean ativo = true;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCadastro;
    
    // Relacionamento 1:N com Livro
    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Livro> livros;
    
    // Construtores
    public Autor() {
        this.dataCadastro = new Date();
    }
    
    public Autor(String nome, String sobrenome) {
        this();
        this.nome = nome;
        this.sobrenome = sobrenome;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public String getSobrenome() {
        return sobrenome;
    }
    
    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }
    
    public Date getDataNascimento() {
        return dataNascimento;
    }
    
    public void setDataNascimento(Date dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    
    public String getNacionalidade() {
        return nacionalidade;
    }
    
    public void setNacionalidade(String nacionalidade) {
        this.nacionalidade = nacionalidade;
    }
    
    public String getBiografia() {
        return biografia;
    }
    
    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }
    
    public boolean isAtivo() {
        return ativo;
    }
    
    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
    
    public Date getDataCadastro() {
        return dataCadastro;
    }
    
    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
    
    public List<Livro> getLivros() {
        return livros;
    }
    
    public void setLivros(List<Livro> livros) {
        this.livros = livros;
    }
    
    // Método utilitário para obter nome completo
    public String getNomeCompleto() {
        return nome + (sobrenome != null ? " " + sobrenome : "");
    }
}