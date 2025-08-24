package com.example.backend.controller;

import com.example.backend.model.Usuario;
import com.example.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.UsuarioRequestDTO;
import com.example.backend.dto.UsuarioResponseDTO;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

  @PostMapping
public ResponseEntity<?> createUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
    if (service.existsByCpf(dto.getCpf())) {
        return ResponseEntity.badRequest().body("Já existe um usuário com este CPF.");
    }

    Usuario usuario = new Usuario();
    usuario.setNome(dto.getNome());
    usuario.setCpf(dto.getCpf());
    usuario.setCep(dto.getCep());
    usuario.setLogradouro(dto.getLogradouro());
    usuario.setBairro(dto.getBairro());
    usuario.setCidade(dto.getCidade());
    usuario.setEstado(dto.getEstado());

    Usuario saved = service.save(usuario);

    return ResponseEntity.ok(new UsuarioResponseDTO(saved));
}

    
@GetMapping
public List<UsuarioResponseDTO> getAllUsuarios() {
    return service.findAll()
                  .stream()
                  .map(UsuarioResponseDTO::new)
                  .toList();
}

  @PutMapping("/{id}")
public ResponseEntity<?> updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDTO dto) {
    return service.findById(id).map(existing -> {
        if (service.existsByCpfAndIdNot(dto.getCpf(), id)) {
            return ResponseEntity.badRequest().body("Já existe um usuário com este CPF.");
        }

        existing.setNome(dto.getNome());
        existing.setCpf(dto.getCpf());
        existing.setCep(dto.getCep());
        existing.setLogradouro(dto.getLogradouro());
        existing.setBairro(dto.getBairro());
        existing.setCidade(dto.getCidade());
        existing.setEstado(dto.getEstado());
        existing.setDataAtualizacao(java.time.LocalDateTime.now());

        Usuario updated = service.save(existing);
        return ResponseEntity.ok(new UsuarioResponseDTO(updated));
    }).orElse(ResponseEntity.notFound().build());
}

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
