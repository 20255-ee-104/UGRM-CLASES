var builder = WebApplication.CreateBuilder(args);

// Fuerza a la aplicación a escuchar en el puerto 8080 desde cualquier dirección IP
builder.WebHost.UseUrls("http://0.0.0.0:8080");

var app = builder.Build();

app.MapGet("/", () => "¡Hola Mundo desde Docker Multistage!");

app.Run();
