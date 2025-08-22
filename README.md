
Gerenciador de Endereços

Este projeto é um sistema para gerenciamento de endereços, com frontend em React + Vite, backend em Java + Spring Boot, e banco de dados PostgreSQL. Ele utiliza Docker para facilitar a execução local.

🚀 Rodando o Projeto com Docker
✅ Pré-requisitos

Docker: https://docs.docker.com/get-docker/

Docker Compose (v2 ou superior)

8 GB de RAM (recomendado)

Acesso à internet para baixar imagens

📁 Estrutura do Projeto
desafio_junior/
├── backend/       # Java + Spring Boot
├── frontend/      # React + TypeScript (Vite)
├── docker-compose.yml

🔧 Primeira execução com Docker

Recomenda-se limpar imagens antigas antes da primeira execução:

docker compose down --rmi all

📦 Build e execução completa:
docker compose up -d --build


Isso irá:

Baixar as imagens necessárias (openjdk, gradle, node, nginx, postgres)

Buildar o backend via Gradle (./gradlew build)

Buildar o frontend via Vite (npm run build)

Subir os containers: backend, frontend e banco de dados

🌐 Acessando os serviços

Frontend → http://localhost:5173

Backend (API) → http://localhost:8080

📚 Bibliotecas e Tecnologias Utilizadas
Frontend

React com TypeScript

Vite (build e desenvolvimento)

Twind – Estilização utilitária (runtime)

@tanstack/react-query – Fetch e cache de dados assíncronos

axios – Requisições HTTP

react-router-dom – Roteamento de páginas

@shadcn/ui – Componentes de UI modernos e acessíveis

Backend

Spring Boot + Java 21

Gradle – Gerenciador de build

PostgreSQL – Banco de dados relacional

TELAS  : 

