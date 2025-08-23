package com.example.backend.repository;

import com.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByCpf(String cpf);
    boolean existsByCpfAndIdNot(String cpf, Long id);


    @Query("SELECT u FROM Usuario u ORDER BY u.dataAtualizacao DESC, u.id DESC")
    List<Usuario> findAllOrderByDataAtualizacaoDesc();
}
