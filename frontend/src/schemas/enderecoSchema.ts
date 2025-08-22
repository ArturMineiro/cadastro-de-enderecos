import { z } from "zod"

export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "")
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  let soma = 0, resto
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf[9])) return false

  soma = 0
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(cpf[10])
}

export const enderecoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),

  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido" })
    .refine(val => validarCPF(val), { message: "CPF inválido" }),

  cep: z
    .string()
    .regex(/^\d{5}-\d{3}$/, { message: "CEP inválido" }),

  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
});

  

export type EnderecoFormData = z.infer<typeof enderecoSchema>
