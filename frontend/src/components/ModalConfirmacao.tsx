import React from "react";

interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo?: string;
  mensagem: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  aberto,
  titulo = "Confirmação",
  mensagem,
  onConfirm,
  onCancel,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-40  bg-opacity-40 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-lg border border-gray-300 bg-white shadow-lg p-6 animate-fadeInUp">
        <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
        <p className="mb-6">{mensagem}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
