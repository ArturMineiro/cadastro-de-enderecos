// src/pages/Home.tsx
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        Bem-vindo ao Sistema de Endereços
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Use o menu para cadastrar ou listar endereços.
      </p>
    </div>
  );
};

export default Home;