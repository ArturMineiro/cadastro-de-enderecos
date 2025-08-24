package com.example.backend.controller;

import com.example.backend.dto.UsuarioRequestDTO;
import com.example.backend.dto.UsuarioResponseDTO;
import com.example.backend.model.Usuario;
import com.example.backend.service.UsuarioService;
import jakarta.validation.Valid;
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
    public ResponseEntity<?> createUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        try {
            Usuario saved = service.createUsuario(dto);
            return ResponseEntity.ok(new UsuarioResponseDTO(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

        @GetMapping
        public List<UsuarioResponseDTO> getAllUsuarios() {
            return service.getAllUsuariosDTO();
        }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDTO dto) {
        try {
            Usuario updated = service.updateUsuario(id, dto);
            return ResponseEntity.ok(new UsuarioResponseDTO(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
    try {
        service.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}
}
