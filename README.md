# Sistema de Controle de Gastos

Sistema Full-Stack completo para o gerenciamento de finanças pessoais, desenvolvido como resolução de um desafio técnico. O projeto permite o cadastro de pessoas e o controle de suas respectivas receitas e despesas.

---

## Acesso em Produção

O projeto está hospedado na nuvem e pode ser acessado através dos links abaixo:
* **Front-end (Interface):** https://sistema-controle-gastos-two.vercel.app
* **Back-end (API):** https://api-controle-gastos-si2n.onrender.com/lista-de-pessoas

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

**Infraestrutura e Deploy:**
* **Docker:** Utilizado para conteinerizar a API, garantindo um ambiente isolado e padronizado.
* **Render:** Plataforma em nuvem escolhida para hospedar o contêiner do Back-end.
* **Vercel:** Plataforma serverless otimizada para a hospedagem do Front-end em React.
* **CI/CD:** Deploy contínuo integrado diretamente à branch `main` do GitHub.

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

## Aprendizados e Decisões

Mais do que entregar um sistema funcional, esse projeto exigiu a superação de desafios reais de integração e arquitetura. Durante o desenvolvimento, as seguintes decisões e aprendizados foram consolidados:

* **Configuração de CORS:** Implementada no .NET para permitir que o React se comunicasse com a API sem bloqueios de segurança do navegador.
* **Arquitetura e Componentização (Lifting State Up):** A interface foi dividida em componentes independentes. Em vez de requisições duplicadas, aprendi a centralizar o estado no componente pai e injetar os dados via *Props*, tornando a aplicação mais eficiente e mantendo uma única fonte de verdade.
* **Gestão do Ciclo de Vida:** Utilização de `useEffect` para buscar os dados no momento correto, sem causar loops infinitos de renderização.
* **Tratamento de Erros Reais:** Abandonei os alertas genéricos. Configurei o Axios para capturar as mensagens reais de erro enviadas pelo Back-end (como o bloqueio de receitas para menores de idade), refletindo na interface exatamente o que o servidor recusou.
* **Gestão de Repositório (Git):** Perdi o medo de operar o histórico. Aprendi a usar ferramentas de recuperação e sobrescrita (`reset --hard`, `restore` e `push -f`) para limpar commits falhos e manter a integridade do código na branch principal.
* **Depuração e Análise:** Mudei minha postura diante de falhas. Passei a diagnosticar os erros lendo ativamente as mensagens do compilador no terminal e os retornos HTTP no console do navegador, deixando de focar apenas na quebra visual da interface.


