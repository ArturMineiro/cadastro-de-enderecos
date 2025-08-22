import React, { useState, useEffect } from "react";
import { createEndereco } from "../services/api";
import apiCep from "../services/apiCep";
import ModalMensagem from "./ModalMensagem";
import type { Endereco } from "../types/Endereco";
import { enderecoSchema, validarCPF } from "../schemas/enderecoSchema";
import { ZodError } from "zod";
import { formatCEP, formatCPF } from "../utils/formatters";

interface FormEnderecoProps {
  onSaved: () => void;
  enderecoInicial?: Endereco;
}

const FormEndereco: React.FC<FormEnderecoProps> = ({ onSaved, enderecoInicial }) => {
  const [form, setForm] = useState<Endereco>({
    id: enderecoInicial?.id || 0,
    nome: enderecoInicial?.nome || "",
    cpf: enderecoInicial?.cpf || "",
    cep: enderecoInicial?.cep || "",
    logradouro: enderecoInicial?.logradouro || "",
    bairro: enderecoInicial?.bairro || "",
    cidade: enderecoInicial?.cidade || "",
    estado: enderecoInicial?.estado || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalTipo, setModalTipo] = useState<"sucesso" | "erro" | "info">("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalAberto) {
      const timer = setTimeout(() => setModalAberto(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modalAberto]);

  const abrirModalMensagem = (mensagem: string, tipo: "sucesso" | "erro" | "info" = "info") => {
    setModalMensagem(mensagem);
    setModalTipo(tipo);
    setModalAberto(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nome" && value.length > 30) return;

    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = formatCEP(e.target.value);
    setForm(prev => ({ ...prev, cep: valor }));

    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const { data } = await apiCep.get(`/${cepLimpo}`);
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
          setErrors(prev => ({ ...prev, cep: "" }));
        } else {
          setErrors(prev => ({ ...prev, cep: "CEP não encontrado" }));
          setForm(prev => ({ ...prev, logradouro: "", bairro: "", cidade: "", estado: "" }));
        }
      } catch {
        setErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP" }));
      }
    } else {
      setForm(prev => ({ ...prev, logradouro: "", bairro: "", cidade: "", estado: "" }));
      setErrors(prev => ({ ...prev, cep: "" }));
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatCPF(e.target.value);
    setForm(prev => ({ ...prev, cpf: valorFormatado }));

    const cpfLimpo = valorFormatado.replace(/\D/g, "");
    if (cpfLimpo.length === 11) {
      if (!validarCPF(cpfLimpo)) {
        setErrors(prev => ({ ...prev, cpf: "CPF inválido" }));
      } else {
        setErrors(prev => ({ ...prev, cpf: "" }));
      }
    } else {
      setErrors(prev => ({ ...prev, cpf: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = enderecoSchema.parse(form);

      setErrors({});
      setLoading(true);

      await createEndereco(parsed); 

      abrirModalMensagem("Endereço salvo com sucesso!", "sucesso");
      onSaved();

      setForm({
        id: 0,
        nome: "",
        cpf: "",
        cep: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
      });
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fieldErrors = err.flatten().fieldErrors as Record<string, (string | undefined)[]>;
        const formattedErrors: Record<string, string> = {};
        for (const key in fieldErrors) {
          if (fieldErrors[key]?.[0]) formattedErrors[key] = fieldErrors[key]![0]!;
        }
        setErrors(formattedErrors);
      } else if (err.response?.status === 400 && err.response.data === "Já existe um usuário com este CPF.") {
        setErrors(prev => ({ ...prev, cpf: "CPF já cadastrado" }));
        abrirModalMensagem("CPF já cadastrado", "erro");
      } else {
        console.error("Erro ao salvar:", err);
        abrirModalMensagem("Erro ao salvar endereço", "erro");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nome</label>
            <input
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.nome ? "border-red-500" : "border-gray-300"
              } shadow-sm px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">CPF</label>
            <input
              name="cpf"
              type="text"
              value={form.cpf}
              onChange={handleCpfChange}
              maxLength={14}
              className={`mt-1 block w-full rounded-md border ${
                errors.cpf ? "border-red-500" : "border-gray-300"
              } shadow-sm px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600`}
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">CEP</label>
          <input
            name="cep"
            type="text"
            value={form.cep}
            onChange={handleCepChange}
            maxLength={9}
            className={`mt-1 block w-full rounded-md border ${
              errors.cep ? "border-red-500" : "border-gray-300"
            } shadow-sm px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600`}
          />
          {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["logradouro", "bairro", "cidade", "estado"].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                name={field}
                type="text"
                value={(form as any)[field]}
                onChange={handleChange}
                readOnly={!!(form as any)[field]}
                className={`mt-1 block w-full rounded-md border ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                } shadow-sm px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md transition-colors"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>

      <ModalMensagem
        aberto={modalAberto}
        mensagem={modalMensagem}
        tipo={modalTipo}
        onClose={() => setModalAberto(false)}
      />
    </>
  );
};

export default FormEndereco;
