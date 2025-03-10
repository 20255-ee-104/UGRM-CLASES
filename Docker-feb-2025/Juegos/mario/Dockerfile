# Usa Debian como base
FROM debian:bullseye-slim

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    mupen64plus-ui-console \
    mupen64plus-data \
    libsdl2-2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Crear el directorio donde alojaremos el juego
WORKDIR /game

# Copiar la ROM al contenedor
COPY "supermario.n64" /game/supermario64.n64

# Comando para ejecutar el juego
CMD ["mupen64plus", "/game/supermario64.n64"]
