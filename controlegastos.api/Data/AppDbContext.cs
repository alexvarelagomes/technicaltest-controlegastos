using controlegastos.api.Models;
using Microsoft.EntityFrameworkCore;

namespace controlegastos.api.Data

{ // A classe herda de DbContext, que é a classe base do EF Core, e representa uma sessão com o banco de dados. 
 // Ela é usada para consultar e salvar instâncias das entidades no banco de dados.
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // Mapeia e cria as tabelas no banco de dados com base nas classes(Pessoa e Transacao)
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
    }
}