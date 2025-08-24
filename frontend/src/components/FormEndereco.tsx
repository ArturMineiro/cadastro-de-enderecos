import React, { useState, useEffect } from "react";
import ModalMensagem from "./ModalMensagem";
import {
  enderecoSchema,
  validarCPF,
  type EnderecoFormData,
} from "../schemas/enderecoSchema";
import {
  useCreateEndereco,
  useUpdateEndereco,
  useCep,
} from "../hooks/useEndereco";
import { formatCEP, formatCPF } from "../utils/formatters";
import { ZodError } from "zod";
import type { Endereco } from "../types/Endereco";

interface FormEnderecoProps {
  enderecoInicial?: Endereco;
  onSaved?: () => void;
  onUpdated?: () => void;
}

const FormEndereco: React.FC<FormEnderecoProps> = ({
  enderecoInicial,
  onSaved,
  onUpdated,
}) => {
  const [form, setForm] = useState<EnderecoFormData>({
    nome: "",
    cpf: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalTipo, setModalTipo] = useState<"sucesso" | "erro" | "info">(
    "info"
  );

  const createMut = useCreateEndereco();
  const updateMut = useUpdateEndereco();
  const loading = createMut.isPending || updateMut.isPending;
  const { data: cepData, error } = useCep(form.cep.replace(/\D/g, ""));

  //busca os dados atraves do cep
  useEffect(() => {
    if (cepData) {
      if (!cepData.erro) {
        setForm((prev) => ({
          ...prev,
          logradouro: cepData.logradouro,
          bairro: cepData.bairro,
          cidade: cepData.localidade,
          estado: cepData.uf,
        }));
        setErrors((prev) => ({ ...prev, cep: "" }));
      } else {
        setForm((prev) => ({
          ...prev,
          logradouro: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));
        setErrors((prev) => ({ ...prev, cep: "CEP não encontrado" }));
      }
    } else if (error) {
      setErrors((prev) => ({ ...prev, cep: "Erro ao buscar CEP" }));
    }
  }, [cepData, error]);

  useEffect(() => {
    if (modalAberto) {
      const timer = setTimeout(() => setModalAberto(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modalAberto]);

  // preenche o formulario no modal de editar
  useEffect(() => {
    if (enderecoInicial) {
      setForm({
        nome: enderecoInicial.nome || "",
        cpf: enderecoInicial.cpf ? formatCPF(enderecoInicial.cpf) : "",
        cep: enderecoInicial.cep ? formatCEP(enderecoInicial.cep) : "",
        logradouro: enderecoInicial.logradouro || "",
        bairro: enderecoInicial.bairro || "",
        cidade: enderecoInicial.cidade || "",
        estado: enderecoInicial.estado || "",
      });
    }
  }, [enderecoInicial]);

  const abrirModalMensagem = (
    mensagem: string,
    tipo: "sucesso" | "erro" | "info" = "info"
  ) => {
    setModalMensagem(mensagem);
    setModalTipo(tipo);
    setModalAberto(true);
  };

  // atualiza qualquer campo do form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // atualiza e valida cpf

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = formatCPF(e.target.value);
    setForm((prev) => ({ ...prev, cpf: valor }));

    const cpfLimpo = valor.replace(/\D/g, "");
    if (cpfLimpo.length === 11) {
      setErrors((prev) => ({
        ...prev,
        cpf: validarCPF(cpfLimpo) ? "" : "CPF inválido",
      }));
    } else {
      setErrors((prev) => ({ ...prev, cpf: "" }));
    }
  };

  // atualiza cep e reseta campos relacionados caso incompleto

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = formatCEP(e.target.value);
    setForm((prev) => ({ ...prev, cep: valor }));

    if (valor.replace(/\D/g, "").length < 8) {
      setForm((prev) => ({
        ...prev,
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
      }));
      setErrors((prev) => ({ ...prev, cep: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsed = enderecoSchema.parse(form);
      setErrors({});

      if (enderecoInicial?.id) {
        await updateMut.mutateAsync({ id: enderecoInicial.id, ...parsed });
        abrirModalMensagem("Endereço atualizado com sucesso!", "sucesso");
        onUpdated?.();
      } else {
        await createMut.mutateAsync(parsed);
        abrirModalMensagem("Endereço salvo com sucesso!", "sucesso");
        setForm({
          nome: "",
          cpf: "",
          cep: "",
          logradouro: "",
          bairro: "",
          cidade: "",
          estado: "",
        });
      }

      onSaved?.();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fieldErrors = err.flatten().fieldErrors as Record<
          string,
          (string | undefined)[]
        >;
        const formatted: Record<string, string> = {};
        for (const key in fieldErrors) {
          if (fieldErrors[key]?.[0]) formatted[key] = fieldErrors[key]![0]!;
        }
        setErrors(formatted);
      } else if (
        err?.response?.status === 400 &&
        err.response?.data?.includes("CPF")
      ) {
        setErrors((prev) => ({ ...prev, cpf: "CPF já cadastrado" }));
        abrirModalMensagem("CPF já cadastrado", "erro");
      } else {
        console.error("Erro ao salvar:", err);
        abrirModalMensagem("Erro ao salvar endereço", "erro");
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
              Nome
            </label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              maxLength={30}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
              CPF
            </label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleCpfChange}
              maxLength={14}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
            CEP
          </label>
          <input
            name="cep"
            value={form.cep}
            onChange={handleCepChange}
            maxLength={9}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.cep && (
            <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["logradouro", "bairro", "cidade", "estado"].map((f) => (
            <div key={f} className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </label>
              <input
                name={f}
                value={(form as any)[f]}
                onChange={handleChange}
                readOnly={true}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors[f] && (
                <p className="text-red-500 text-sm mt-1">{errors[f]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading
            ? "Salvando..."
            : enderecoInicial?.id
            ? "Atualizar"
            : "Salvar"}
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
