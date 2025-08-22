import React from "react";

interface ModalMensagemProps {
  aberto: boolean;
  titulo?: string;
  mensagem: string;
  tipo?: "sucesso" | "erro" | "info";
  onClose: () => void;
}

const cores = {
  sucesso: "bg-green-50 border-green-400 text-green-700",
  erro: "bg-red-50 border-red-400 text-red-700",
  info: "bg-blue-50 border-blue-400 text-blue-700",
};

const icones = {
  sucesso: (
    <svg
      className="w-6 h-6 text-green-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  erro: (
    <svg
      className="w-6 h-6 text-red-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const ModalMensagem: React.FC<ModalMensagemProps> = ({
  aberto,
  titulo = "Mensagem",
  mensagem,
  tipo = "info",
  onClose,
}) => {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-40  bg-opacity-40 flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full rounded-lg border ${cores[tipo]} shadow-lg p-6 animate-fadeInUp`}
        role="alert"
      >
        <div className="flex items-center gap-3 mb-4">
          <div>{icones[tipo]}</div>
          <h2 className="text-xl font-semibold">{titulo}</h2>
        </div>
        <p className="text-gray-900 mb-6">{mensagem}</p>
        <div className="flex justify-end">
        <button
  onClick={onClose}
  style={{ backgroundColor: "#4F46E5", color: "#fff" }}
  className="inline-block px-5 py-2 font-semibold rounded hover:bg-indigo-700 transition"
>
  OK
</button>

        </div>
      </div>
    </div>
  );
};

export default ModalMensagem;
