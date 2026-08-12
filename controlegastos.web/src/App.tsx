import { useState, useEffect } from 'react';
import api from './api';
import FormularioPessoa from './components/FormularioPessoa';
import FormularioTransacao from './components/FormularioTransacao';
import './App.css';

function App() {

  // Cria uma variável mágica, ou seja, de estado, para guardar os dados que será buscados do C#.
  const [dados, setDados] = useState<any>(null);

  const [pessoaExpandidaId, setPessoaExpandidaId] = useState<number | null>(null);

  const toggleExpandir = (id: number) => {setPessoaExpandidaId(pessoaExpandidaId === id ? null : id);};

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
              <p style={{ color: '#27ae60' }}>R$ {Number(dados.totalGeral.receitas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="summary-card">
              <h3>Despesas Totais</h3>
              <p style={{ color: '#e74c3c' }}>R$ {Number(dados.totalGeral.despesas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="summary-card">
              <h3>Saldo Líquido</h3>
              <p>R$ {Number(dados.totalGeral.saldoLiquido).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Pessoas Cadastradas:</h2>
          <ul className="lista-pessoas">
            {dados.pessoas.map((pessoa: any, index: number) => (
              <li key={index} className="pessoa-item">
                <div className="pessoa-info">
                  <strong>{pessoa.nome} - {pessoa.idade} anos (ID: {pessoa.id})</strong><br/>
                  <span style={{ fontSize: '14px', color: '#7f8c8d' }}>
                    Receitas: <span style={{ color: '#27ae60' }}>R$ {Number(pessoa.receitas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> | 
                    Despesas: <span style={{ color: '#e74c3c' }}>R$ {Number(pessoa.despesas).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> | 
                    Saldo: <span style={{ color: '#2c3e50', marginLeft: '5px' }}>R$ {Number(pessoa.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </span>
                </div>
                <button 
                  onClick={() => toggleExpandir(pessoa.id)}
                  style={{ marginRight: '10px', background: '#ecf0f1', border: '1px solid #bdc3c7', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer'}}>
                  {pessoaExpandidaId === pessoa.id ? '▲ Ocultar' : '▼ Detalhes'}
                </button>
                {pessoaExpandidaId === pessoa.id && (
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '5px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#34495e' }}>Histórico de Transações:</h4>
                    
                    {(!pessoa.transacoes || pessoa.transacoes.length === 0) ? (
                      <p style={{ margin: 0, fontSize: '13px', color: '#95a5a6' }}>Nenhuma transação cadastrada.</p>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {pessoa.transacoes.map((t: any) => (
                          <li key={t.id} style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #ddd' }}>
                            <span>{t.descricao}</span>
                            <strong style={{ color: t.tipo === 'Receita' ? '#27ae60' : '#e74c3c' }}>
                              {t.tipo === 'Receita' ? '+' : '-'} R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <button className="btn btn-danger" onClick={() => deletarPessoa(pessoa.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;