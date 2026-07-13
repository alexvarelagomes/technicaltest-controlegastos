import { useState} from 'react';
import api from '../api';

type Props = {
  onAdicionado: () => void; // Define uma propriedade chamada 'onAdicionado', que é uma função sem parâmetros e sem retorno.
  pessoas: any[]; // Adiciona lista de propriedades obrigatórias
};

export default function FormularioTransacao({ onAdicionado, pessoas }: Props) {
  // Estado lista dentro dos componentes
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
    
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      // Verifica se o servidor respondeu com uma mensagem de erro estruturada
      if (error.response && error.response.data) {
        // Se o C# retornar uma string simples
        if (typeof error.response.data === 'string') {
          alert(`Operação negada: ${error.response.data}`);
        } 
        // Se o C# retornar um objeto JSON com detalhes do erro
        else if (error.response.data.title || error.response.data.message) {
           alert(`Operação negada: ${error.response.data.message || error.response.data.title}`);
        } else {
           alert('Falha ao cadastrar: Dados inválidos processados pelo servidor.');
        }
      } else {
        alert('Falha ao cadastrar: Erro de comunicação com o servidor.');
    }
  }
  };

  // Renderização da Interface
  return (
    <div className="form-container">
      
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Cadastrar Nova Transação:</h3>
  
      <form onSubmit={handleSubmit}>
        
        {/* Etapa do formulário para informar a descrição do que foi gasto ou recebido */}
        <div className="form-group">
          <label>Descrição: </label>
          <input 
            className="form-control"
            type="text" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
          />
        </div>

        {/* Informa o valor gasto ou recebido */}
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

        {/* Informa se a transação foi de receita ou despesa */}
        <div className="form-group">
          <label>Tipo: </label>
          <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Selecione...</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </div>

        {/* Seleciona a pessoa com seu ID */}
        <div className="form-group">
          <label>Pessoa(ID): </label>
          <select
            value={pessoaId} 
            onChange={(e) => setPessoaId(Number(e.target.value))}
            required
            className="form-control"
          >
          <option value="">Selecione uma pessoa...</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}        
          </select>
        </div>

        <button className="btn" type="submit">Salvar Transação</button>
      
      </form>
    </div>
  );
}