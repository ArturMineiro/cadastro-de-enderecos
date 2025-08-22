package com.example.backend.controller;

import com.example.backend.service.ViaCepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cep")
public class CepController {

    @Autowired
    private ViaCepService viaCepService;

    @GetMapping("/{cep}")
    public Map<String, Object> buscarCep(@PathVariable String cep) {
        return viaCepService.consultarCep(cep);
    }
}
