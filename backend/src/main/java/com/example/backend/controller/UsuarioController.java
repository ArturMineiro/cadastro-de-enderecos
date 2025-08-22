package com.example.backend.controller;

import com.example.backend.model.Usuario;
import com.example.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        if (service.existsByCpf(usuario.getCpf())) {
            return ResponseEntity.badRequest().body("Já existe um usuário com este CPF.");
        }
        Usuario saved = service.save(usuario);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return service.findAll();
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        // Validação dos campos obrigatórios
        if (usuario.getNome() == null || usuario.getNome().isBlank() ||
            usuario.getCpf() == null || usuario.getCpf().isBlank() ||
            usuario.getCep() == null || usuario.getCep().isBlank() ||
            usuario.getLogradouro() == null || usuario.getLogradouro().isBlank() ||
            usuario.getBairro() == null || usuario.getBairro().isBlank() ||
            usuario.getCidade() == null || usuario.getCidade().isBlank() ||
            usuario.getEstado() == null || usuario.getEstado().isBlank()) {
            return ResponseEntity.badRequest().body("Preencha todos os campos obrigatórios.");
        }
    
        return service.findById(id).map(existing -> {
            if (service.existsByCpfAndIdNot(usuario.getCpf(), id)) {
                return ResponseEntity.badRequest().body("Já existe um usuário com este CPF.");
            }
    
            existing.setNome(usuario.getNome());
            existing.setCpf(usuario.getCpf());
            existing.setCep(usuario.getCep());
            existing.setLogradouro(usuario.getLogradouro());
            existing.setBairro(usuario.getBairro());
            existing.setCidade(usuario.getCidade());
            existing.setEstado(usuario.getEstado());
    
            Usuario updated = service.save(existing);
            return ResponseEntity.ok(updated);
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
