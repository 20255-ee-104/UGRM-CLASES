# 🌐 Docker Multistage con ASP.NET Core 9

En este ejemplo práctico aprenderás cómo crear y ejecutar una aplicación web con ASP.NET Core 9 utilizando Docker Multistage.

## 🛠️ Crear el proyecto desde cero

Abre tu terminal y ejecuta estos comandos:

```bash
dotnet new web -o MiWebApp
cd MiWebApp
```

## 📁 Estructura del proyecto

Tu proyecto debe tener esta estructura inicial:

```
MiWebApp/
├── Dockerfile
├── MiWebApp.csproj
└── Program.cs
```

## 🚀 Crear Dockerfile Multistage

Dentro de la carpeta `MiWebApp`, crea un archivo llamado `Dockerfile` con este contenido:

```dockerfile
# Etapa 1 - Build del proyecto
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MiWebApp.csproj", "./"]
RUN dotnet restore "./MiWebApp.csproj"
COPY . .
RUN dotnet publish "./MiWebApp.csproj" -c Release -o /app/publish

# Etapa 2 - Imagen final
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080
ENTRYPOINT ["dotnet", "MiWebApp.dll"]
```

## 🐳 Construir la imagen Docker

```bash
docker build -t miwebapp .
```

## ▶️ Ejecutar el contenedor Docker

```bash
docker run -d -p 8080:8080 --name miwebapp-container miwebapp
```

## 🌐 Probar la aplicación

Abre tu navegador y accede a:

```
http://localhost:8080
```

Deberías ver el mensaje:

```
Hello World!
```

## 📌 Explicación 

Este ejercicio práctico enseña cómo:

- Crear rápidamente una aplicación web con .NET 9.
- Implementar un Dockerfile 
- Ejecutar la aplicación de manera aislada y consistente con Docker.

¡Ahora estás listo para desarrollar aplicaciones modernas con Docker y .NET! 🎓🚀🐳

