# Etapa 1 - Build del proyecto
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MiWebApp.csproj", "./"]
RUN dotnet restore "./MiWebApp.csproj"
COPY . .
RUN dotnet publish "./MiWebApp.csproj" -c Release -o /app/publish

# Etapa 2 - Imagen final de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "MiWebApp.dll"]

