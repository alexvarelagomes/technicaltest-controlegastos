namespace controlegastos.api.Models

{ public class Transacao
    { 
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty; // Sempre que for string se usa o string.empty para não dar erro de null
        public decimal Valor { get; set; } // Usa decimal para valores monetários, pois é mais preciso que o float.
        public string Tipo { get; set; } = string.Empty; // Guardará "Receita" ou "Despesa"

        // Relacionamento com a tabela Pessoa (Chave estrangeira)
        public int PessoaId { get; set; } // Chave estrangeira para a tabela
        public Pessoa? Pessoa { get; set; }
    }
}