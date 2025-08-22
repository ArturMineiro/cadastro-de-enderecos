import type { Endereco } from "../types/Endereco";
import type { EnderecoCreate } from "../types/EnderecoCreate";
import { api } from "../lib/api";

export const fetchEnderecos = async (): Promise<Endereco[]> => {
  const res = await api.get("/api/usuarios");
  return res.data;
};

export const createEndereco = async (endereco: EnderecoCreate) => {
  return await api.post("/api/usuarios", endereco);
};

export const updateEndereco = async (endereco: Endereco) => {
  return await api.put(`/api/usuarios/${endereco.id}`, endereco);
};

export const patchEndereco = async (endereco: Partial<Endereco>) => {
  return await api.patch(`/api/usuarios/${endereco.id}`, endereco);
};

export const deleteEndereco = async (id: number): Promise<void> => {
  await api.delete(`/api/usuarios/${id}`);
};

// --- CEP ---
export interface CepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const fetchCep = async (cep: string): Promise<CepResponse> => {
  const res = await api.get(`/api/cep/${cep}`);
  return res.data;
};
