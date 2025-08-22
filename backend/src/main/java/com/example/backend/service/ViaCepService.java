package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ViaCepService {

    private static final String URL_VIACEP = "https://viacep.com.br/ws/%s/json/";

    public Map<String, Object> consultarCep(String cep) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format(URL_VIACEP, cep);
        return restTemplate.getForObject(url, Map.class);
    }
}
