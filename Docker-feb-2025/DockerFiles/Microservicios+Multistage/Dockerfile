# --------------------------------------------------
# Stage 1: API
# --------------------------------------------------
    FROM python:3.11-alpine AS api
    WORKDIR /app
    # Instalar dependencias de la API
    RUN pip install flask mysql-connector-python
    # Copiar el código fuente de la API
    COPY api.py /app
    # Exponer el puerto de la API
    EXPOSE 5000
    # Comando para correr la API
    CMD ["python", "api.py"]
    
    
    # --------------------------------------------------
    # Stage 2: Frontend
    # --------------------------------------------------
    FROM node:20-alpine AS frontend
    WORKDIR /app
    # Copiar y instalar dependencias del frontend
    COPY package*.json ./
    RUN npm install
    # Copiar el resto de archivos del frontend
    COPY . .
    # Exponer el puerto del Frontend
    EXPOSE 3000
    # Comando para correr el frontend
    CMD ["npm", "start"]
    