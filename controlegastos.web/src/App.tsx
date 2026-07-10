import { useState, useEffect } from 'react';
import api from './api';
import FormularioPessoa from './components/FormularioPessoa';
import FormularioTransacao from './components/FormularioTransacao';
import './App.css';

function App() {

  // Cria uma variável mágica, ou seja, de estado, para guardar os dados que será buscados do C#.
  const [dados, setDados] = useState<any>(null);

  const carregarDados = () => {
      api.get('/consultar-totais') // Faz requisição GET para a rota '/consultar-totais' do Back-end, que retorna os totais de receitas, despesas e saldo líquido, bem como a lista de pessoas cadastradas.
        .then(response => {
          setDados(response.data);
        })
        .catch(error => {
          console.error("Ocorreu um erro ao buscar os dados:", error);
        });
    };

    // O useEffect chama a função carregarDados() para buscar os dados do Back-end assim que o componente é montado, ou seja, quando a página é carregada.
    useEffect(() => {
      carregarDados();
    }, []);

  return (
    <div>
      <h1>Sistema de Controle de Gastos</h1>

     
      {/* através de uma propriedade (prop) chamada 'onAdicionado' */} 
      <FormularioPessoa onAdicionado={carregarDados}/>
      <FormularioTransacao onAdicionado={carregarDados}/>
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
            {/* Renderiza a lista de pessoas cadastradas, mostrando o nome e o saldo de cada uma. */}
            {dados.pessoas.map((pessoa: any, index: number) => (
              <p key={index}>
                <strong>{pessoa.nome}(ID: {pessoa.id})</strong> - Saldo: R$ {pessoa.saldo}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;