
package com.br.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

/**
 * Entidade Livro representa um livro cadastrado no sistema.
 * Possui relacionamentos com Autor (N:1), Editora (1:1) e Categoria (N:N).
 */
@Entity
@Table(name = "livros")
public class Livro {
    /**
     * Identificador único do livro (chave primária).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título do livro.
     */
    @Column(nullable = false, length = 200)
    private String titulo;

    /**
     * Subtítulo do livro.
     */
    @Column(length = 200)
    private String subtitulo;

    /**
     * ISBN do livro.
     */
    @Column(length = 20, unique = true)
    private String isbn;

    /**
     * Ano de publicação do livro.
     */
    private int anoPublicacao;

    /**
     * Número de páginas do livro.
     */
    private int numeroPaginas;

    /**
     * Idioma do livro.
     */
    @Column(length = 50)
    private String idioma;

    /**
     * Preço do livro.
     */
    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    /**
     * Quantidade em estoque.
     */
    private int quantidadeEstoque;

    /**
     * Indica se o livro está disponível para empréstimo.
     */
    private boolean disponivel;

    /**
     * Sinopse/resumo do livro.
     */
    @Column(columnDefinition = "TEXT")
    private String sinopse;

    /**
     * Data de cadastro do livro no sistema.
     */
    @Temporal(TemporalType.DATE)
    private Date dataCadastro;

    /**
     * Relacionamento N:1 com Autor (muitos livros para um autor).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "livros"})
    private Autor autor;

    /**
     * Relacionamento N:1 com Editora (muitos livros para uma editora).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "editora_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Editora editora;

    /**
     * Relacionamento N:N com Categoria (um livro pode ter várias categorias).
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "livro_categoria",
        joinColumns = @JoinColumn(name = "livro_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "livros"})
    private List<Categoria> categorias;

    // Construtores
    public Livro() {
        this.dataCadastro = new Date();
        this.disponivel = true;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getSubtitulo() {
        return subtitulo;
    }

    public void setSubtitulo(String subtitulo) {
        this.subtitulo = subtitulo;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getAnoPublicacao() {
        return anoPublicacao;
    }

    public void setAnoPublicacao(int anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public int getNumeroPaginas() {
        return numeroPaginas;
    }

    public void setNumeroPaginas(int numeroPaginas) {
        this.numeroPaginas = numeroPaginas;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public int getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(int quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    public String getSinopse() {
        return sinopse;
    }

    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }

    public Date getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Autor getAutor() {
        return autor;
    }

    public void setAutor(Autor autor) {
        this.autor = autor;
    }

    public Editora getEditora() {
        return editora;
    }

    public void setEditora(Editora editora) {
        this.editora = editora;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<Categoria> categorias) {
        this.categorias = categorias;
    }

    // Métodos utilitários
    public String getNomeAutor() {
        return autor != null ? autor.getNomeCompleto() : "";
    }

    public String getNomeEditora() {
        return editora != null ? editora.getNome() : "";
    }
}