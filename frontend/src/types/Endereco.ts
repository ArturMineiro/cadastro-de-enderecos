export interface Endereco {
  id: number;
  nome: string;
  cpf: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}
