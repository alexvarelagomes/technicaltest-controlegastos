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
    }, []); // O array vazio [] indica que o efeito só deve ser executado uma vez, quando o componente é montado.

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
    <div className="container">
      <h1 className="header-title">Sistema de Controle de Gastos</h1>

      <FormularioPessoa onAdicionado={carregarDados} />
      <FormularioTransacao onAdicionado={carregarDados} pessoas={dados? dados.pessoas: []} />

      {!dados ? (
        <p style={{ textAlign: 'center' }}>A carregar os dados do servidor...</p>
      ) : (
        <div>
          <div className="dashboard-summary">
            <div className="summary-card">
              <h3>Receitas Totais</h3>
              <p style={{ color: '#27ae60' }}>R$ {dados.totalGeral.receitas}</p>
            </div>
            <div className="summary-card">
              <h3>Despesas Totais</h3>
              <p style={{ color: '#e74c3c' }}>R$ {dados.totalGeral.despesas}</p>
            </div>
            <div className="summary-card">
              <h3>Saldo Líquido</h3>
              <p>R$ {dados.totalGeral.saldoLiquido}</p>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Pessoas Cadastradas:</h2>
          <ul className="lista-pessoas">
            {dados.pessoas.map((pessoa: any, index: number) => (
              <li key={index} className="pessoa-item">
                <div className="pessoa-info">
                  <strong>{pessoa.nome} (ID: {pessoa.id})</strong><br/>
                  <span style={{ fontSize: '14px', color: '#7f8c8d' }}>
                    Receitas: <span style={{ color: '#27ae60' }}>R$ {pessoa.receitas}</span> | 
                    Despesas: <span style={{ color: '#e74c3c' }}>R$ {pessoa.despesas}</span> | 
                    Saldo: <span style={{ color: '#2c3e50', marginLeft: '5px' }}>R$ {pessoa.saldo}</span>
                  </span>
                </div>
                <button className="btn btn-danger" onClick={() => deletarPessoa(pessoa.id)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;