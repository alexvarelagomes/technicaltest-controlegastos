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

var app = builder.Build();

// Ativação da interface gráfica do Swagger para documentação da API.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// CONFIGURANDO ROTAS DE PESSOAS.

// Async serve para que a aplicação não fique bloqueada enquanto aguarda a resposta do banco de dados, permitindo que outras requisições sejam processadas simultaneamente.
// Await serve para que a aplicação aguarde a conclusão da operação assíncrona antes de prosseguir, garantindo que os dados sejam salvos corretamente no banco de dados.
// Operações Assíncronas evita que a aplicação não fique bloqueada enquanto aguarda a resposta do banco de dados, permitindo que outras requisições sejam processadas simultaneamente.

// Cadastrar pessoa(POST)
app.MapPost("/pessoas", async (AppDbContext db, Pessoa pessoa) =>
{
    db.Pessoas.Add(pessoa); // Adiciona a pessoa ao banco de dados.
    await db.SaveChangesAsync(); // Salva as alterações no banco de dados.
    return Results.Created($"/pessoas/{pessoa.Id}", pessoa); // Retorna o status 201 Created com a URL da nova pessoa criada.
});

// Listar pessoa(GET)
app.MapGet("/pessoas", async (AppDbContext db) =>
{
    var pessoas = await db.Pessoas.ToListAsync(); // Mostra todas as pessoas cadastradas no banco de dados.
    return Results.Ok(pessoas); // Retorna o status 200 OK com a lista de pessoas.  
});

// Deletar pessoa(DELETE)
app.MapDelete("/pessoas/{id}", async (AppDbContext db, int id) =>
{
    var pessoa = await db.Pessoas.FindAsync(id); // FindAsyncencontra a pessoa pelo ID. Ele retorna a entidade encontrada ou null se não houver correspondência.
    
    if (pessoa is null) // Se a pessoa não for encontrada pelo ID.
        return Results.NotFound("Pessoa não encontrada."); // Retorna o status 404 Not Found.

    db.Pessoas.Remove(pessoa); // Remove a pessoa do banco de dados.S
    await db.SaveChangesAsync(); // Salva as alterações no banco de dados.
    return Results.Ok("Pessoa e suas transações foram excluídas com sucesso."); // Retorna o status 200 OK com a mensagem de sucesso.
});

app.Run();
