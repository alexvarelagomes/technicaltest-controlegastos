import { useState } from 'react';
import api from '../api';

type Props = {
  onAdicionado: () => void; // Define uma propriedade chamada 'onAdicionado', que é uma função sem parâmetros e sem retorno.
};

export default function FormularioTransacao({ onAdicionado }: Props) {
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
      // Chama a função passada como propriedade para atualizar a lista de transações.
      onAdicionado();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('Falha ao cadastrar. Verifique se o ID da pessoa existe ou se a regra de menor de idade (Receita) foi bloqueada pelo servidor.');
    }
  };

  // Renderização da Interface
  return (
    <div className="form-container">
      
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Cadastrar Nova Transação:</h3>
  
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Descrição: </label>
          <input 
            className="form-control"
            type="text" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Valor (R$): </label>
          <input 
            className="form-control"
            type="number" 
            step="0.01" 
            value={valor} 
            onChange={(e) => setValor(Number(e.target.value))} 
          />
        </div>

        <div className="form-group">
          <label>Tipo: </label>
          <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Selecione...</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </div>

        <div className="form-group">
          <label>ID da Pessoa: </label>
          <input 
            className="form-control"
            type="number" 
            value={pessoaId} 
            onChange={(e) => setPessoaId(Number(e.target.value))} 
          />
        </div>

        <button className="btn" type="submit">Salvar Transação</button>
      
      </form>
    </div>
  );
}