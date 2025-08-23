import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEnderecos,
  createEndereco,
  updateEndereco,
  deleteEndereco,
  fetchCep,
} from "../services/enderecoService";
import type { Endereco } from "../types/Endereco";
import type { EnderecoCreate } from "../types/EnderecoCreate";
import type { CepResponse } from "../types/Cep";

const keys = {
  all: ["enderecos"] as const,
  byId: (id: number) => ["enderecos", id] as const,
};

// listar
export function useEnderecos() {
  return useQuery({
    queryKey: keys.all,
    queryFn: fetchEnderecos,
  });
}

// criar
export function useCreateEndereco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EnderecoCreate) => createEndereco(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

//atualizar
export function useUpdateEndereco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Endereco) => updateEndereco(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: keys.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: keys.byId(variables.id) });
      }
    },
  });
}

// deletar
export function useDeleteEndereco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEndereco(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

//cep
export const useCep = (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, "");
  return useQuery<CepResponse, Error>({
    queryKey: ["cep", cepLimpo],
    queryFn: () => fetchCep(cepLimpo),
    enabled: cepLimpo.length === 8,
  });
};
