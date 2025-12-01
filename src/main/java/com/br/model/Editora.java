package com.br.model;

import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

/**
 * Entidade Editora - representa as editoras dos livros
 * Relacionamento 1:N com Livro (uma editora pode ter vários livros)
 */
@Entity
@Table(name = "editoras")
public class Editora {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 150)
    private String nome;
    
    @Column(nullable = false, length = 150)
    private String razaoSocial;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;
    
    @Column(length = 15)
    private String telefone;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 200)
    private String website;
    
    @Column(length = 18)
    private String cnpj;
    
    private boolean ativa = true;
    
    @Temporal(TemporalType.DATE)
    private Date dataFundacao;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCadastro;
    
    // Construtores
    public Editora() {
        this.dataCadastro = new Date();
    }
    
    public Editora(String nome, String razaoSocial) {
        this();
        this.nome = nome;
        this.razaoSocial = razaoSocial;
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
    
    public String getRazaoSocial() {
        return razaoSocial;
    }
    
    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }
    
    public Endereco getEndereco() {
        return endereco;
    }
    
    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }
    
    public String getTelefone() {
        return telefone;
    }
    
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getWebsite() {
        return website;
    }
    
    public void setWebsite(String website) {
        this.website = website;
    }
    
    public String getCnpj() {
        return cnpj;
    }
    
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
    
    public boolean isAtiva() {
        return ativa;
    }
    
    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }
    
    public Date getDataFundacao() {
        return dataFundacao;
    }
    
    public void setDataFundacao(Date dataFundacao) {
        this.dataFundacao = dataFundacao;
    }
    
    public Date getDataCadastro() {
        return dataCadastro;
    }
    
    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}