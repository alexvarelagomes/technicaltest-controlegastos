# Sistema de Controle de Gastos

Sistema Full-Stack completo para o gerenciamento de finanças pessoais, desenvolvido como resolução de um desafio técnico. O projeto permite o cadastro de pessoas e o controle de suas respectivas receitas e despesas.

---

## Finalidade do Projeto

O objetivo desta aplicação é demonstrar a construção de uma arquitetura limpa e funcional, integrando Back-end e Front-end moderno e reativo. 

O sistema aplica regras de negócio, como:
* Bloqueio de cadastro de "Receitas" para menores de 18 anos.
* Exclusão em cascata (ao deletar uma pessoa, todas as suas transações são apagadas automaticamente para manter a integridade do banco de dados).
* Atualização de dados em tempo real na interface através do gerenciamento de estados.

---

## Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas:

**Back-end:**
* **C# / .NET 8:** Linguagem e framework principais (usando Minimal APIs).
* **Entity Framework Core:** ORM utilizado para mapeamento e comunicação com o banco.
* **SQLite:** Banco de dados relacional leve e embutido (os dados não se perdem ao reiniciar).
* **Swagger:** Documentação interativa e automatizada das rotas da API.

**Front-end:**
* **React:** Biblioteca para a construção da interface do usuário.
* **TypeScript:** Adiciona tipagem estática ao JavaScript, garantindo segurança na passagem de dados.
* **Vite:** Ferramenta de construção e empacotamento ultrarrápida para o React.
* **Axios:** Biblioteca para realizar as requisições HTTP e conectar o Front-end ao Back-end.
* **CSS Nativo:** Estilização desenvolvida do zero com variáveis de tema e Flexbox.

---

## Como executar o projeto localmente

Para rodar o projeto na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) e o [.NET 8 SDK](https://dotnet.microsoft.com/download) instalados.

### 1. Clonar o repositório
```bash
git clone https://github.com/alexvarelagomes/technicaltest-controlegastos.git
cd technicaltest-controlegastos
```
### 2. Rodar o Back-end (API)
Abra um terminal e acesse a pasta da API:
```bash
cd controlegastos.api
dotnet run
```
A API iniciará na porta http://localhost:5055.   
Você pode acessar a documentação do Swagger acessando http://localhost:5055/swagger no seu navegador.

### 3. Rodar o Front-end (Interface)
Abra um novo terminal (mantenha o da API rodando) e acesse a pasta do Front-end:
```bash
cd controlegastos.web
npm install
npm run dev
```
O servidor Front-end iniciará na porta http://localhost:5173.        
Acesse esse link no navegador para usar o sistema.

---

## Aprendizados e Decisões de Engenharia

Durante o desenvolvimento deste projeto, alguns desafios de integração foram superados:

Configuração de CORS: Implementada no .NET para permitir que o React se comunicasse com a API sem bloqueios de segurança do navegador.
Componentização: A interface foi dividida em componentes independentes, utilizando Props para realizar a comunicação entre componentes pais e filhos.
Gestão do Ciclo de Vida: Utilização de useEffect para buscar os dados no momento correto sem causar loops infinitos de renderização.


