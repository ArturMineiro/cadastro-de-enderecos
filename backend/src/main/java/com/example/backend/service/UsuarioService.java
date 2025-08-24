package com.example.backend.service;

import com.example.backend.model.Usuario;
import com.example.backend.repository.UsuarioRepository;
import com.example.backend.dto.UsuarioRequestDTO;
import org.springframework.stereotype.Service;
import com.example.backend.dto.UsuarioResponseDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario save(Usuario usuario) {
        return repository.save(usuario);
    }

    public List<Usuario> findAll() {
        return repository.findAllOrderByDataAtualizacaoDesc();
    }

    public Optional<Usuario> findById(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public boolean existsByCpf(String cpf) {
        return repository.existsByCpf(cpf);
    }

    public boolean existsByCpfAndIdNot(String cpf, Long id) {
        return repository.existsByCpfAndIdNot(cpf, id);
    }

    public Usuario updateUsuario(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (existsByCpfAndIdNot(dto.getCpf(), id)) {
            throw new RuntimeException("Já existe um usuário com este CPF.");
        }

        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setCep(dto.getCep());
        usuario.setLogradouro(dto.getLogradouro());
        usuario.setBairro(dto.getBairro());
        usuario.setCidade(dto.getCidade());
        usuario.setEstado(dto.getEstado());
        usuario.setDataAtualizacao(LocalDateTime.now());

        return repository.save(usuario);
    }

    public Usuario createUsuario(UsuarioRequestDTO dto) {
        if (existsByCpf(dto.getCpf())) {
            throw new RuntimeException("Já existe um usuário com este CPF.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setCep(dto.getCep());
        usuario.setLogradouro(dto.getLogradouro());
        usuario.setBairro(dto.getBairro());
        usuario.setCidade(dto.getCidade());
        usuario.setEstado(dto.getEstado());

        return repository.save(usuario);
    }

    public void deleteUsuario(Long id) {
    Usuario usuario = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    repository.delete(usuario);
}

public List<UsuarioResponseDTO> getAllUsuariosDTO() {
    return repository.findAllOrderByDataAtualizacaoDesc()
                     .stream()
                     .map(UsuarioResponseDTO::new)
                     .toList();
}
}
