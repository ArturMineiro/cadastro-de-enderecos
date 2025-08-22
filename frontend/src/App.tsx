import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './index.css'; // <- importante para ativar Tailwind

import Home from "./pages/Home";
import Enderecos from "./pages/Enderecos";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();


const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
        <Route path="/home" element={<Home />} />
  <Route path="/" element={<Home />} />
  <Route path="/enderecos" element={<Enderecos />} />
</Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
