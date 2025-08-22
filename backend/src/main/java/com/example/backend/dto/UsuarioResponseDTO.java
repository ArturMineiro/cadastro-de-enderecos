package com.example.backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String cep;
    private String logradouro;
    private String bairro;
    private String cidade;
    private String estado;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public UsuarioResponseDTO(com.example.backend.model.Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.cpf = usuario.getCpf();
        this.cep = usuario.getCep();
        this.logradouro = usuario.getLogradouro();
        this.bairro = usuario.getBairro();
        this.cidade = usuario.getCidade();
        this.estado = usuario.getEstado();
        this.dataCriacao = usuario.getDataCriacao();
        this.dataAtualizacao = usuario.getDataAtualizacao();
    }

    
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCpf() { return cpf; }
    public String getCep() { return cep; }
    public String getLogradouro() { return logradouro; }
    public String getBairro() { return bairro; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
}
