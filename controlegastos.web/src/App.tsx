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

  const deletarPessoa = async (id: number) => {
    // Janela de segurança do navegador
    const confirmacao = window.confirm("Tem certeza que deseja apagar esta pessoa e todas as suas transações?");
    if (!confirmacao) return;

    try {

      await api.delete(`/deletar-pessoas?id=${id}`); // Faz requisição DELETE para a rota '/deletar-pessoas' do Back-end, que deleta a pessoa
      
      alert("Pessoa e suas transações foram apagadas com sucesso!");
      carregarDados(); // Recarrega a lista para a pessoa sumir da tela imediatamente
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Falha ao deletar a pessoa.");
    }
  };

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
          <div key={index} style={{ marginBottom: '15px' }}>
            <strong>{pessoa.nome} (ID: {pessoa.id})</strong> - Saldo: R$ {pessoa.saldo}
            
            {/* Botão de excluir */}
            <button 
              onClick={() => deletarPessoa(pessoa.id)}
              style={{ 
                marginLeft: '15px', 
                backgroundColor: '#d9534f', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                cursor: 'pointer',
                borderRadius: '4px'
              }}>
              Excluir
            </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;