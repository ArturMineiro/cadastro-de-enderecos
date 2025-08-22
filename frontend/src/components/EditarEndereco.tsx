import { useState, useEffect } from "react";
import { enderecoSchema, validarCPF, type EnderecoFormData } from "../schemas/enderecoSchema";
import type { Endereco } from "../types/Endereco";
import { formatCPF, formatCEP } from "../utils/formatters";
import { updateEndereco, fetchCep } from "../services/api";

interface Props {
  endereco: Endereco;
  onUpdated: () => void;
  onCancel: () => void;
  abrirModalMensagem: (
    mensagem: string,
    tipo?: "sucesso" | "erro" | "info"
  ) => void;
}

export default function EditarEndereco({
  endereco,
  onUpdated,
  onCancel,
  abrirModalMensagem,
}: Props) {
  const [form, setForm] = useState<Omit<EnderecoFormData, "cpf">>({
    nome: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [cpfRaw, setCpfRaw] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cpfError, setCpfError] = useState("");

  useEffect(() => {
    if (endereco) {
      setForm({
        nome: endereco.nome || "",
        cep: formatCEP(endereco.cep || ""),
        logradouro: endereco.logradouro || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || "",
        estado: endereco.estado || "",
      });
      setCpfRaw((endereco.cpf ?? "").replace(/\D/g, ""));
      setCpfError("");
      setErrors({});
    }
  }, [endereco]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "cpf") return;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorLimpo = e.target.value.replace(/\D/g, "");
    setCpfRaw(valorLimpo);

    if (valorLimpo.length === 11) {
      if (!validarCPF(valorLimpo)) {
        setCpfError("CPF inválido");
      } else {
        setCpfError("");
      }
    } else {
      setCpfError("");
    }

    setErrors(prev => ({ ...prev, cpf: "" }));
  }

  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = formatCEP(e.target.value);
    setForm(prev => ({ ...prev, cep: valor }));

    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const data = await fetchCep(cepLimpo); // ✅ Função centralizada
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            cep: valor,
          }));
        } else {
          limparEndereco(valor);
        }
      } catch {
        limparEndereco(valor);
      }
    } else {
      limparEndereco(valor);
    }
  }

  function limparEndereco(cep: string) {
    setForm(prev => ({
      ...prev,
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep,
    }));
  }

  async function handleUpdate() {
    const formCompleto: EnderecoFormData = {
      ...form,
      cpf: formatCPF(cpfRaw), 
      cep: form.cep,
    };

    if (cpfRaw.length !== 11 || !validarCPF(cpfRaw)) {
      setCpfError("CPF inválido");
      abrirModalMensagem("CPF inválido", "erro");
      return;
    }

    const resultado = enderecoSchema.safeParse(formCompleto);
    if (!resultado.success) {
      abrirModalMensagem(resultado.error.issues[0]?.message || "Erro desconhecido", "erro");
      return;
    }

    try {
      setLoading(true);
      await updateEndereco({ id: endereco.id, ...formCompleto }); // ✅ Função centralizada

      setErrors({});
      setCpfError("");
      onUpdated();
      abrirModalMensagem("Endereço atualizado com sucesso!", "sucesso");
    } catch (error: any) {
      let msg = "Erro ao atualizar endereço.";

      if (
        error?.response?.status === 400 &&
        ((typeof error.response.data === "string" && error.response.data.includes("CPF")) ||
          (error.response.data?.message && error.response.data.message.includes("CPF")))
      ) {
        setErrors(prev => ({ ...prev, cpf: "CPF já cadastrado" }));
        abrirModalMensagem("CPF já cadastrado", "erro");
        return;
      }

      if (error?.response?.data && typeof error.response.data === "string") msg = error.response.data;
      else if (error?.response?.data?.message) msg = error.response.data.message;

      abrirModalMensagem(msg, "erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow-md border dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Editar Endereço
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <input
          name="nome"
          value={form.nome}
          onChange={onChange}
          placeholder="Nome"
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          name="cpf"
          value={formatCPF(cpfRaw)}
          onChange={handleCpfChange}
          maxLength={14}
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {(cpfError || errors.cpf) && (
          <p className="text-red-500 text-sm mt-1">{cpfError || errors.cpf}</p>
        )}

        <input
          name="cep"
          value={form.cep}
          onChange={handleCepChange}
          placeholder="CEP"
          maxLength={9}
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          name="logradouro"
          value={form.logradouro}
          onChange={onChange}
          placeholder="Logradouro"
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          name="bairro"
          value={form.bairro}
          onChange={onChange}
          placeholder="Bairro"
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          name="cidade"
          value={form.cidade}
          onChange={onChange}
          placeholder="Cidade"
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          name="estado"
          value={form.estado}
          onChange={onChange}
          placeholder="Estado"
          className="px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
