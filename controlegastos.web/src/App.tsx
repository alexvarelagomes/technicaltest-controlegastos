import { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {

  // Cria uma variável mágica, ou seja, de estado, para guardar os dados que será buscados do C#.
  const [dados, setDados] = useState<any>(null);

  // useEffect serve para executar o código assim que a página for carregada. É nesse momento que será feita a chamada para o C# buscar os dados.
  useEffect(() => {
    api.get('/totais')
      .then(response => {
        // Se der sucesso, será guardado o resultado na variável mágica 'dados' que fará com que a página seja redesenhada com os dados do C#.
        setDados(response.data);
      })
      .catch(error => {
        console.error("Ocorreu um erro ao buscar os dados:", error);
      });
  }, []); // O array vazio [] significa que o useEffect será executado apenas uma vez, quando o componente for montado.

  return (
    <div>
      <h1>Sistema de Controlo de Gastos</h1>

      {/*Se os dados ainda não estiverem carregados...*/}
      {!dados ? (
        <p>Carregando os dados do servidor...</p>
      ) : (
        /* Mostra os dados carregados */
        <div>
          <h2>Resumo Geral do Sistema</h2>
          <p><strong>Receitas Totais:</strong> R$ {dados.totalGeral.receitas}</p>
          <p><strong>Despesas Totais:</strong> R$ {dados.totalGeral.despesas}</p>
          <p><strong>Saldo Líquido:</strong> R$ {dados.totalGeral.saldoLiquido}</p>

          <h2>Pessoas Cadastradas</h2>
          <ul>
            {/* O .map funciona como um loop, percorrendo a lista e desenhando um <li> para cada pessoa */}
            {dados.pessoas.map((pessoa: any, index: number) => (
              <li key={index}>
                <strong>{pessoa.nome}</strong> - Saldo: R$ {pessoa.saldo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;