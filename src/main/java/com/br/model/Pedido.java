package com.br.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

/**
 * Entidade Pedido - representa um pedido de compra de livros (MESTRE)
 * Relacionamento 1:N com ItemPedido (um pedido pode ter vários itens)
 */
@Entity
@Table(name = "pedidos")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 20)
    private String numero;
    
    @Column(nullable = false, length = 100)
    private String nomeCliente;
    
    @Column(length = 100)
    private String emailCliente;
    
    @Column(length = 15)
    private String telefoneCliente;
    
    @Column(length = 300)
    private String enderecoEntrega;
    
    @Enumerated(EnumType.STRING)
    private StatusPedido status;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataPedido;
    
    @Temporal(TemporalType.DATE)
    private Date dataEntregaPrevista;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorFrete;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorDesconto;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorTotal;
    
    @Column(length = 500)
    private String observacoes;
    
    // Relacionamento 1:N com ItemPedido (Mestre-Detalhe)
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<ItemPedido> itens;
    
    // Construtores
    public Pedido() {
        this.dataPedido = new Date();
        this.status = StatusPedido.PENDENTE;
        this.valorFrete = BigDecimal.ZERO;
        this.valorDesconto = BigDecimal.ZERO;
        this.valorTotal = BigDecimal.ZERO;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public String getNomeCliente() {
        return nomeCliente;
    }
    
    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }
    
    public String getEmailCliente() {
        return emailCliente;
    }
    
    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }
    
    public String getTelefoneCliente() {
        return telefoneCliente;
    }
    
    public void setTelefoneCliente(String telefoneCliente) {
        this.telefoneCliente = telefoneCliente;
    }
    
    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }
    
    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }
    
    public StatusPedido getStatus() {
        return status;
    }
    
    public void setStatus(StatusPedido status) {
        this.status = status;
    }
    
    public Date getDataPedido() {
        return dataPedido;
    }
    
    public void setDataPedido(Date dataPedido) {
        this.dataPedido = dataPedido;
    }
    
    public Date getDataEntregaPrevista() {
        return dataEntregaPrevista;
    }
    
    public void setDataEntregaPrevista(Date dataEntregaPrevista) {
        this.dataEntregaPrevista = dataEntregaPrevista;
    }
    
    public BigDecimal getValorFrete() {
        return valorFrete;
    }
    
    public void setValorFrete(BigDecimal valorFrete) {
        this.valorFrete = valorFrete;
    }
    
    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }
    
    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
    }
    
    public BigDecimal getValorTotal() {
        return valorTotal;
    }
    
    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    public List<ItemPedido> getItens() {
        return itens;
    }
    
    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
        // Atualizar referência bidirecional
        if (itens != null) {
            itens.forEach(item -> item.setPedido(this));
        }
    }
    
    // Métodos utilitários
    public void calcularValorTotal() {
        BigDecimal subtotal = BigDecimal.ZERO;
        if (itens != null) {
            subtotal = itens.stream()
                .map(ItemPedido::getSubtotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        BigDecimal frete = valorFrete != null ? valorFrete : BigDecimal.ZERO;
        BigDecimal desconto = valorDesconto != null ? valorDesconto : BigDecimal.ZERO;
        this.valorTotal = subtotal.add(frete).subtract(desconto);
    }
    
    @JsonIgnore
    public int getQuantidadeItens() {
        return itens != null ? itens.size() : 0;
    }
    
    @JsonIgnore
    public BigDecimal getSubtotal() {
        if (itens == null) return BigDecimal.ZERO;
        return itens.stream()
            .map(ItemPedido::getSubtotal)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}