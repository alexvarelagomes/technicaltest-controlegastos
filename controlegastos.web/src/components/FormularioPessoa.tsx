import { useState } from 'react';
import api from '../api'; // Importa a requisição para o Back-end, que está configurada no arquivo api.ts

type Props = {
  onAdicionado: () => void; // Define uma propriedade chamada 'onAdicionado', que é uma função sem parâmetros e sem retorno.
};

export default function FormularioPessoa({ onAdicionado }: Props) {
  // Criação de variáveis de estado para armazenar os valores dos campos do formulário.
  // <number | ''> significa que a variável pode ser um número ou uma string vazia, permitindo que o campo de idade seja limpo.
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');

  // handleSubmit é a função que será chamada quando o formulário for enviado.
  // FormEvent representa o envio do formulário.
  const handleSubmit = async (e: React.FormEvent) => {
    // preventDefault() impede que a página seja recarregada ao enviar o formulário, permitindo que a função continue sua execução.
    e.preventDefault();

    if (!nome || idade === '') {
      alert('Atenção: Preencha todos os campos antes de salvar.');
      return;
    }

    try {
      // Envia os dados do formulário para o Back-end usando uma requisição POST.
      // O api.post envia os dados para a rota '/adicionar-pessoas' do Back-end, que é responsável por cadastrar uma nova pessoa.
      await api.post('/adicionar-pessoas', {
        nome: nome,
        idade: Number(idade)
      });
      
      alert('Pessoa cadastrada com sucesso!');
      
      // Limpa os campos do formulário após o envio bem-sucedido.
      setNome('');
      setIdade('');
      // Chama a função passada como propriedade para atualizar a lista de pessoas.
      onAdicionado();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('Falha ao cadastrar. Inspecione o console para mais detalhes.');
    }
  };

  // Renderiza o formulário de cadastro de pessoa, ou seja , o que será exibido na tela.
  return (
    <div style={{ border: '1px solid #555', padding: '20px', marginBottom: '20px' }}>
      <h3>Cadastrar Nova Pessoa</h3>
      <form onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Nome: </label>
          {/* O "value" força o input a exibir o que está na variável.
            O "onChange" captura a tecla digitada em tempo real e atualiza a variável.
          */}
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Idade: </label>
          <input 
            type="number" 
            value={idade} 
            onChange={(e) => setIdade(Number(e.target.value))} 
          />
        </div>

        <button type="submit">Salvar Cadastro</button>
      
      </form>
    </div>
  );
}