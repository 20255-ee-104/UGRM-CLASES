# Usa una imagen base ligera de Python
FROM python:3.9-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de archivos (script y dataset si existe)
COPY . .

# Comando por defecto al ejecutar el contenedor
CMD ["python", "process_data.py"]
