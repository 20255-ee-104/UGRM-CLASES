# README – DEMO de Microservicios con Red Bridge en Docker (usando Dockerfile Multi-Stage)

Este repositorio contiene un ejemplo sencillo de cómo levantar tres contenedores Docker (Base de Datos, API y Frontend) dentro de la misma red bridge, de manera que:  
- Solo el **Frontend** mapea un puerto al host y puede ser accedido desde el navegador.  
- La **API** y la **Base de Datos** son accesibles únicamente en la red interna.

La diferencia clave es que **API y Frontend** se construyen desde **un único Dockerfile** utilizando **Multi-Stage Builds**.

---

## 1. Clonar o preparar el proyecto

Asegúrate de tener en tu carpeta:
- **Dockerfile** (multi-stage), que contendrá la definición tanto para la API como para el Frontend.
- **api.py** (y cualquier requisito adicional) para la API en Python.
- **package.json**, **index.js** (y demás archivos) para el Frontend en Node.
- Opcionalmente, un archivo `docker-compose.yml` si quieres orquestar contenedores de forma centralizada.

En este ejemplo usaremos comandos de Docker individuales.

---

## 2. Crear la red bridge

```bash
docker network create app_network
```

Se crea una red de tipo `bridge` llamada `app_network` que usaremos para conectar nuestros contenedores.

---

## 3. Levantar el contenedor de Base de Datos

Ejemplo usando MySQL:

```bash
docker run -d --name db --network app_network -e MYSQL_ROOT_PASSWORD=examplepass -e MYSQL_DATABASE=demo mysql:latest
```

- `--name db`: nombra el contenedor como “db”.
- `--network app_network`: lo conecta a la red que creamos.
- `-e MYSQL_ROOT_PASSWORD=examplepass`: define la contraseña para el usuario root.
- `-e MYSQL_DATABASE=demo`: crea automáticamente una base de datos llamada “demo”.

---

## 4. Dockerfile Multi-Stage para API y Frontend

Crea (o actualiza) tu `Dockerfile` en la carpeta raíz, con dos stages:

```dockerfile
# ---------------------------------------------
# Stage 1: API (Python + Flask)
# ---------------------------------------------
FROM python:3.11-alpine AS api
WORKDIR /app
RUN pip install flask mysql-connector-python
COPY api.py /app
EXPOSE 5000
CMD ["python", "api.py"]

# ---------------------------------------------
# Stage 2: Frontend (Node + Express)
# ---------------------------------------------
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 4.1 Archivo `api.py` (ejemplo Flask)

```python
from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

@app.route('/')
def hello():
    # Conexión a la base de datos (nombre del contenedor = 'db')
    db = mysql.connector.connect(
        host='db',
        user='root',
        password='examplepass',
        database='demo'
    )
    cursor = db.cursor()
    cursor.execute('SELECT "Conectado exitosamente a la base de datos!"')
    result = cursor.fetchone()
    db.close()
    return jsonify({'mensaje': result[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### 4.2 Archivos para el Frontend

#### `package.json`
```json
{
  "name": "frontend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.7"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

#### `index.js`
```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', async (req, res) => {
  try {
    // Petición a la API interna (nombre del contenedor = 'api')
    const response = await axios.get('http://api:5000');
    res.send(`Respuesta desde API: ${response.data.mensaje}`);
  } catch (error) {
    res.send('Error conectándose a la API');
  }
});

app.listen(3000, () => console.log('Frontend corriendo en puerto 3000'));
```

---

## 5. Construir y levantar la API desde el Dockerfile Multi-Stage

1. **Construir la imagen de la API** (Stage `api`):
   ```bash
   docker build -t my_api --target api .
   ```
   - `--target api` indica que usaremos el bloque “FROM python…” del Dockerfile.

2. **Ejecutar la imagen**:
   ```bash
   docker run -d --name api --network app_network my_api
   ```
   - Correrá la API en el puerto `5000` (interno) dentro de la red `app_network`.

> **Ojo**: Si quieres exponer el puerto de la API al host (solo para debug), usa `-p 5000:5000`.  
> Para el escenario de “API interna” no es obligatorio hacerlo.

---

## 6. Construir y levantar el Frontend desde el mismo Dockerfile

1. **Construir la imagen del Frontend** (Stage `frontend`):
   ```bash
   docker build -t my_frontend --target frontend .
   ```
   - `--target frontend` indica que usaremos el bloque “FROM node…” del Dockerfile.

2. **Ejecutar la imagen**:
   ```bash
   docker run -d --name frontend --network app_network -p 3000:3000 my_frontend
   ```
   - Exponemos el puerto `3000` al host, para acceder desde el navegador.

---

## 7. Probar la aplicación

Abre tu navegador en:
```
http://localhost:3000
```
y deberías ver el mensaje:
```
Respuesta desde API: Conectado exitosamente a la base de datos!
```
Esto indica que:
- El **Frontend** pudo comunicarse con la **API** (contenedor `api` en la misma red).
- La **API** se conectó a la **Base de Datos** (contenedor `db`) y devolvió la respuesta esperada.

---

## 8. Limpieza y/o detención de contenedores

Para detener los contenedores sin borrarlos:
```bash
docker stop frontend api db
```

Para eliminarlos definitivamente (contenedores e imágenes):
```bash
docker rm -f frontend api db
docker rmi my_frontend my_api
docker network rm app_network
```

---
