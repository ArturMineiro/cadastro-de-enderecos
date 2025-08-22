import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import EditarEndereco from "./EditarEndereco";
import ModalMensagem from "./ModalMensagem";
import ModalConfirmacao from "./ModalConfirmacao";
import type { Endereco } from "../types/Endereco";

interface ListaEnderecosProps {
  atualizar?: boolean;
}

const ListaEnderecos: React.FC<ListaEnderecosProps> = ({ atualizar }) => {
  const queryClient = useQueryClient();
  const { data: enderecos, isLoading, isError } = useQuery<Endereco[]>({
    queryKey: ["enderecos", atualizar],
    queryFn: async () => {
      const res = await api.get("");
      return res.data;
    },
  });

  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [editando, setEditando] = useState<Endereco | null>(null);

  // Modal de mensagem
  const [modalAberto, setModalAberto] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");
  const [modalTipo, setModalTipo] = useState<"sucesso" | "erro" | "info">("info");

  // Modal de confirmação
  const [confirmAberto, setConfirmAberto] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);

  const solicitarDelete = (id: number) => {
    setIdParaDeletar(id);
    setConfirmAberto(true);
  };

  const confirmarDelete = async () => {
    if (idParaDeletar === null) return;
    try {
      await api.delete(`/${idParaDeletar}`);
      queryClient.invalidateQueries({ queryKey: ["enderecos"] });
      abrirModalMensagem("Endereço excluído com sucesso!", "sucesso");
    } catch {
      abrirModalMensagem("Erro ao excluir endereço.", "erro");
    } finally {
      setIdParaDeletar(null);
      setConfirmAberto(false);
    }
  };

  const cancelarDelete = () => {
    setIdParaDeletar(null);
    setConfirmAberto(false);
  };

  const abrirModalMensagem = (
    mensagem: string | object,
    tipo: "sucesso" | "erro" | "info" = "info"
  ) => {
    const texto = typeof mensagem === "string" ? mensagem : JSON.stringify(mensagem);
    setModalMensagem(texto);
    setModalTipo(tipo);
    setModalAberto(true);
  };
  

  const fecharModalMensagem = () => setModalAberto(false);

  useEffect(() => {
    if (modalAberto) {
      const timer = setTimeout(() => {
        setModalAberto(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [modalAberto]);

  const handleActionClick = (id: number) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const handleEdit = (endereco: Endereco) => {
    setEditando(endereco);
    setOpenActionId(null);
  };

  // Botão Excluir agora abre o modal de confirmação
  const handleDelete = (id: number) => {
    solicitarDelete(id);
  };

  const fecharModal = () => setEditando(null);

  if (isLoading) return <p className="text-gray-500">Carregando...</p>;
  if (isError) return <p className="text-red-500">Erro ao carregar endereços</p>;

  return (
    <>
      <div className="space-y-4 relative">
        <div className="hidden md:block">
          {enderecos && enderecos.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
  <tr>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Nome</th>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">CPF</th>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">CEP</th>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Endereço</th>
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Ações</th>
  </tr>
</thead>

<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                {enderecos.map((e) => (
                  <tr key={e.id} className="">
<td className="px-4 py-2 text-gray-900 dark:text-white">{e.nome}</td>
                    <td className="px-4 py-2">{e.cpf}</td>
                    <td className="px-4 py-2">{e.cep}</td>
                    <td className="px-4 py-2">{`${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.estado}`}</td>
                    <td className="px-4 py-2 relative">
                      <button
                        onClick={() => handleActionClick(e.id)}
                        className="bg-indigo-600 text-white px-2 py-1 rounded"
                      >
                        Ações
                      </button>
                      {openActionId === e.id && (
                        <div className="absolute bg-white dark:bg-gray-800 border rounded shadow-md mt-1 right-0 z-10">
                          <button
                            onClick={() => handleEdit(e)}
                            className="block px-4 py-2 hover:bg-indigo-100 dark:hover:bg-gray-600 w-full text-left"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 w-full text-left text-red-600"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Nenhum endereço cadastrado.</p>
          )}
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          {enderecos && enderecos.length > 0 ? (
            enderecos.map((e) => (
              <div
              key={e.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white mt-3"
            >
            
                <p><strong>Nome:</strong> {e.nome}</p>
                <p><strong>CPF:</strong> {e.cpf}</p>
                <p><strong>CEP:</strong> {e.cep}</p>
                <p><strong>Endereço:</strong> {`${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.estado}`}</p>
                <div className="relative mt-2">
                  <button
                    onClick={() => handleActionClick(e.id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Ações
                  </button>
                  {openActionId === e.id && (
                    <div className="absolute bg-white dark:bg-gray-800 border rounded shadow-md mt-1 left-0 z-10 w-full">
                      <button
                        onClick={() => handleEdit(e)}
                        className="block px-4 py-2 hover:bg-indigo-100 dark:hover:bg-gray-600 w-full text-left"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 w-full text-left text-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum endereço cadastrado.</p>
          )}
        </div>

        {/* Modal de edição */}
        {editando && (
  <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-lg relative">
            <EditarEndereco
              endereco={editando}
              onUpdated={() => {
                queryClient.invalidateQueries({ queryKey: ["enderecos"] });
                fecharModal();
                abrirModalMensagem("Endereço atualizado com sucesso!", "sucesso");
              }}
              onCancel={fecharModal}
              abrirModalMensagem={abrirModalMensagem}
            />
            </div>
          </div>
        )}
      </div>

      {/* Modal de mensagem */}
      <ModalMensagem
        aberto={modalAberto}
        mensagem={modalMensagem}
        tipo={modalTipo}
        onClose={fecharModalMensagem}
      />

      {/* Modal de confirmação */}
      <ModalConfirmacao
        aberto={confirmAberto}
        mensagem="Tem certeza que deseja excluir este endereço?"
        onConfirm={confirmarDelete}
        onCancel={cancelarDelete}
      />
    </>
  );
};

export default ListaEnderecos;
