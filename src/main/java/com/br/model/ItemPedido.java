package com.br.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entidade ItemPedido - representa um item de um pedido (DETALHE)
 * Relacionamento N:1 com Pedido e N:1 com Livro
 */
@Entity
@Table(name = "itens_pedido")
public class ItemPedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private int quantidade;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal percentualDesconto;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorDesconto;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(length = 200)
    private String observacoes;
    
    // Relacionamento N:1 com Pedido (Mestre-Detalhe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference
    private Pedido pedido;
    
    // Relacionamento N:1 com Livro
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livro_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "autor", "editora", "categorias"})
    private Livro livro;
    
    // Construtores
    public ItemPedido() {
        this.quantidade = 1;
        this.percentualDesconto = BigDecimal.ZERO;
        this.valorDesconto = BigDecimal.ZERO;
        this.subtotal = BigDecimal.ZERO;
    }
    
    public ItemPedido(Livro livro, int quantidade, BigDecimal precoUnitario) {
        this();
        this.livro = livro;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        this.subtotal = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public int getQuantidade() {
        return quantidade;
    }
    
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
        calcularSubtotal();
    }
    
    public BigDecimal getPrecoUnitario() {
        return precoUnitario;
    }
    
    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
        calcularSubtotal();
    }
    
    public BigDecimal getPercentualDesconto() {
        return percentualDesconto;
    }
    
    public void setPercentualDesconto(BigDecimal percentualDesconto) {
        this.percentualDesconto = percentualDesconto;
        calcularValorDesconto();
        calcularSubtotal();
    }
    
    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }
    
    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
        calcularSubtotal();
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    public Pedido getPedido() {
        return pedido;
    }
    
    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }
    
    public Livro getLivro() {
        return livro;
    }
    
    public void setLivro(Livro livro) {
        this.livro = livro;
    }
    
    // Métodos utilitários
    private void calcularValorDesconto() {
        if (precoUnitario != null && percentualDesconto != null) {
            BigDecimal valorBruto = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
            this.valorDesconto = valorBruto.multiply(percentualDesconto.divide(BigDecimal.valueOf(100)));
        }
    }
    
    public void calcularSubtotal() {
        if (precoUnitario != null) {
            BigDecimal valorBruto = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
            BigDecimal desconto = valorDesconto != null ? valorDesconto : BigDecimal.ZERO;
            this.subtotal = valorBruto.subtract(desconto);
        }
    }
    
    public String getTituloLivro() {
        return livro != null ? livro.getTitulo() : "";
    }
    
    public String getNomeAutorLivro() {
        return livro != null ? livro.getNomeAutor() : "";
    }
}