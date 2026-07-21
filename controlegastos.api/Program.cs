using controlegastos.api.Data;  
using Microsoft.EntityFrameworkCore;
using controlegastos.api.Models;

var builder = WebApplication.CreateBuilder(args);

// Adiciona o contexto do banco de dados usando SQLite como provedor de banco de dados.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona os serviços e endpoints da API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(); // Adiciona suporte a CORS (Cross-Origin Resource Sharing) para permitir e não bloquear requisições vindo do front-end.

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>(); 
    db.Database.EnsureCreated();
}

app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); // Configura o middleware de CORS para permitir qualquer origem, método e cabeçalho nas requisições da API.

// Ativação da interface gráfica do Swagger para documentação da API.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CONFIGURANDO ROTAS DE PESSOAS.

// Async e Operações Assíncronas serve para que a aplicação não fique bloqueada enquanto aguarda a resposta do banco de dados, permitindo que outras requisições sejam processadas simultaneamente.
// Await serve para que a aplicação aguarde a conclusão da operação assíncrona antes de prosseguir, garantindo que os dados sejam salvos corretamente no banco de dados.

// Cadastrar pessoa(POST)
app.MapPost("/adicionar-pessoas", async (AppDbContext db, Pessoa pessoa) =>
{
    db.Pessoas.Add(pessoa); // Adiciona a pessoa ao banco de dados.
    await db.SaveChangesAsync(); // Salva as alterações no banco de dados.
    return Results.Created($"/pessoas/{pessoa.Id}", pessoa); // Retorna o status 201 Created com a URL da nova pessoa criada.
});

// Listar pessoa(GET)
app.MapGet("/lista-de-pessoas", async (AppDbContext db) =>
{
    var pessoas = await db.Pessoas.ToListAsync(); // Mostra todas as pessoas cadastradas no banco de dados.
    return Results.Ok(pessoas); // Retorna o status 200 OK com a lista de pessoas.  
});

// Deletar pessoa(DELETE)
// O termo [FromRoute] indica que o parâmetro id será obtido da rota da URL, permitindo que a API identifique qual pessoa deve ser deletada com base no ID fornecido na requisição.
app.MapDelete("/deletar-pessoas/", async (int id, AppDbContext db) =>
{
    var pessoa = await db.Pessoas.FindAsync(id); // FindAsync encontra a pessoa pelo ID. Ele retorna a entidade encontrada ou null se não houver correspondência.
    
    if (pessoa is null) // Se a pessoa não for encontrada pelo ID.
        return Results.NotFound("Pessoa não encontrada."); // Retorna o status 404 Not Found.

    db.Pessoas.Remove(pessoa); // Remove a pessoa do banco de dados.
    await db.SaveChangesAsync(); // Salva as alterações no banco de dados.
    return Results.Ok("Pessoa e suas transações foram excluídas com sucesso."); // Retorna o status 200 OK com a mensagem de sucesso.
});


// CONFIGURANDO ROTAS DE TRANSAÇÕES.

// Cadastrar transação(POST)
app.MapPost("/adicionar-transacoes", async (AppDbContext db, Transacao transacao) =>
{   
    // Verifica se a pessoa existe no banco de dados.
    var pessoa = await db.Pessoas.FindAsync(transacao.PessoaId); 

    if (pessoa is null)
        return Results.NotFound("A pessoa informada não existe no cadastro.");

    // Validação de idade mínima para transações do tipo "Despesa".
    // Se a idade for menor que 18 anos e o tipo da transação for "Despesa", bloqueia.
    if (pessoa.Idade <18 && transacao.Tipo.Equals("Receita", StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest("Menores de 18 anos só podem cadastrar transações do tipo Despesa.");
    
    // Caso contrário, adiciona a transação ao banco de dados.
    db.Transacoes.Add(transacao); // Adiciona a transação ao banco de dados.
    await db.SaveChangesAsync(); // Salva as alterações no banco de dados.

    return Results.Created($"/transacoes/{transacao.Id}", transacao); // Retorna o status 201 Created com a URL da nova transação criada.
});

// Listar transações(GET)
app.MapGet("/lista-de-transacoes", async (AppDbContext db) =>
{   
    // O comando Include(t => t.Pessoa) faz um "JOIN" automático no banco de dados.
    var transacoes = await db.Transacoes.Include(t => t.Pessoa).ToListAsync(); // Mostra todas as transações cadastradas no banco de dados, incluindo os dados da pessoa relacionada.
    return Results.Ok(transacoes); // Retorna o status 200 OK com a lista de transações.  
});


// CONFIGURANDO CONSULTA DE TOTAIS.

// Consultar totais(GET)
app.MapGet("/consultar-totais", async (AppDbContext db) =>
{   
    // Busca todas as pessoas cadastradas e suas transações no banco de dados.
    var pessoas = await db.Pessoas.ToArrayAsync();
    var transacoes = await db.Transacoes.ToArrayAsync();

    // Seleciona cada pessoa e calcula os totais de receitas, despesas e saldo líquido.
    var resultadoPessoas = pessoas.Select(p =>
    {   
        // Filtra as transações da pessoa atual.
        var transacoesDestaPessoa = transacoes.Where(t => t.PessoaId == p.Id);
        
        // Soma separadamente as transações do tipo "Receita" e "Despesa".
        // Usa ToLower para evitar erros de comparação de maiúsculas e minúsculas.
        var totalReceitas = transacoesDestaPessoa.Where(t => t.Tipo.ToLower() == "receita").Sum(t => t.Valor);
        var totalDespesas = transacoesDestaPessoa.Where(t => t.Tipo.ToLower() == "despesa").Sum(t => t.Valor);

        // New cria um dicionário anônimo com os totais de receitas e despesas da pessoa.
        return new
        {   
            Id = p.Id,
            Nome = p.Nome,
            Receitas = totalReceitas,
            Despesas = totalDespesas,
            Saldo = totalReceitas - totalDespesas
        };
    }).ToList(); // ToList transforma o dicionário em uma lista.
    
    // Calcula o total geral de receitas e despesas.
    var totalReceitasGeral = resultadoPessoas.Sum(p => p.Receitas);
    var totalDespesasGeral = resultadoPessoas.Sum(p => p.Despesas);
    
    // Retorna a resposta estruturada com os totais para o front-end.
    return Results.Ok(new
    {
        Pessoas = resultadoPessoas,
        TotalGeral = new
        {
            Receitas = totalReceitasGeral,
            Despesas = totalDespesasGeral,
            SaldoLiquido = totalReceitasGeral - totalDespesasGeral
        }  

    });
});

app.Run();
