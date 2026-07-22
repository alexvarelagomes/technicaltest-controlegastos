# Etapa de Construção
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura as dependências
COPY ["controlegastos.api.csproj", "./"]
RUN dotnet restore "controlegastos.api.csproj"

# Copia todo o resto e publica a versão otimizada
COPY . .
RUN dotnet publish "controlegastos.api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa de Execução (Apenas o ambiente de execução, mais leve)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Configuração de portas para a nuvem
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

# Comando de inicialização
ENTRYPOINT ["dotnet", "controlegastos.api.dll"]