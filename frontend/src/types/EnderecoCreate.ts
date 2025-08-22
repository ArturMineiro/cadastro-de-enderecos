import type { Endereco } from "./Endereco";

export type EnderecoCreate = Omit<Endereco, "id" | "dataCriacao" | "dataAtualizacao">;
