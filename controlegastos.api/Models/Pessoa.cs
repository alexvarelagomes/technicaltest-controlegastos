namespace controlegastos.api.Models

{ public class Pessoa
    { 
        // O EF Code entende que a propriedade "Id" do tipo "int" é a chave primária da tabela
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }       
    }    
}