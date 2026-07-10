import { useState } from 'react';
import api from '../api';

export default function FormularioTransacao() {
  // Definição dos Estados Individuais
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState('');
  const [pessoaId, setPessoaId] = useState<number | ''>('');

  // Função de Manipulação do Envio do Formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao || valor === '' || !tipo || pessoaId === '') {
      alert('Atenção: Preencha todos os campos da transação.');
      return;
    }

    try {
      // O api.post envia os dados para a rota '/adicionar-transacoes' do Back-end, que é responsável por cadastrar uma nova transação.
      await api.post('/adicionar-transacoes', {
        descricao: descricao,
        valor: Number(valor),
        tipo: tipo,
        pessoaId: Number(pessoaId)
      });
      
      alert('Transação cadastrada com sucesso!');
      
      // Reseta o formulário após o sucesso
      setDescricao('');
      setValor('');
      setTipo('');
      setPessoaId('');
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('Falha ao cadastrar. Verifique se o ID da pessoa existe ou se a regra de menor de idade (Receita) foi bloqueada pelo servidor.');
    }
  };

  // Renderização da Interface
  return (
    <div style={{ border: '1px solid #555', padding: '20px', marginBottom: '20px' }}>
      <h3>Cadastrar Nova Transação</h3>
      <form onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Descrição: </label>
          <input 
            type="text" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Valor (R$): </label>
          <input 
            type="number" 
            step="0.01" 
            value={valor} 
            onChange={(e) => setValor(Number(e.target.value))} 
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Tipo: </label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Selecione...</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>ID da Pessoa: </label>
          <input 
            type="number" 
            value={pessoaId} 
            onChange={(e) => setPessoaId(Number(e.target.value))} 
          />
        </div>

        <button type="submit">Salvar Transação</button>
      
      </form>
    </div>
  );
}