**README – DEMO de Microservicios con Red Bridge en Docker**

Este repositorio contiene un ejemplo sencillo de cómo levantar tres contenedores Docker (Base de Datos, API y Frontend) dentro de la misma red bridge, de manera que:
- Solo el **Frontend** mapea un puerto al host y puede ser accedido desde el navegador.
- La **API** y la **Base de Datos** son accesibles únicamente en la red interna.

---

## 1. Clonar o preparar el proyecto
Asegúrate de tener en tu carpeta:
- **Dockerfile** y el archivo **api.py** para la API.
- **Dockerfile**, **package.json** e **index.js** para el Frontend (si usas Node, por ejemplo).
- Opcionalmente, un archivo `docker-compose.yml` (si quieres orquestar de forma centralizada).

Para este ejemplo usaremos comandos de Docker individuales.  

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

- `--name db` : nombra el contenedor como “db”.
- `--network app_network` : lo conecta a la red que creamos.
- `-e MYSQL_ROOT_PASSWORD=examplepass` : define una contraseña para el usuario root.
- `-e MYSQL_DATABASE=demo` : crea automáticamente una base de datos llamada “demo”.

---

## 4. Construir y levantar el contenedor de la API

1. **Dockerfile de la API (ejemplo Flask / Python)**

   ```dockerfile
   FROM python:3.11-alpine
   WORKDIR /app
   RUN pip install flask mysql-connector-python
   COPY api.py /app
   EXPOSE 5000
   CMD ["python", "api.py"]
   ```

2. **Archivo `api.py` (ejemplo de Flask)**

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

3. **Construir la imagen**  
   Desde la carpeta donde resides tu `Dockerfile` y `api.py`:

   ```bash
   docker build -t my_api .
   ```

4. **Ejecutar la imagen**:

   ```bash
   docker run -d --name api --network app_network my_api
   ```

Con esto, tu API correrá en el puerto `5000` **internamente** (solo accesible desde la misma red).

---

## 5. Construir y levantar el contenedor del Frontend

1. **Dockerfile del Frontend (ejemplo Node + Express)**

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Archivo `package.json` (ejemplo simple con Express y Axios)**

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

3. **Archivo `index.js` (simple petición a la API)**

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

4. **Construir la imagen del Frontend**  
   Desde la carpeta donde se ubican tu `Dockerfile`, `package.json` e `index.js`:

   ```bash
   docker build -t my_frontend .
   ```

5. **Ejecutar la imagen**:

   ```bash
   docker run -d --name frontend --network app_network -p 3000:3000 my_frontend
   ```

Con esto, el Frontend queda expuesto al host a través del puerto `3000`.  

---

## 6. Probar la aplicación

Abre tu navegador en:
```
http://localhost:3000
```
y deberías ver el mensaje:
```
Respuesta desde API: Conectado exitosamente a la base de datos!
```
Esto indica que:
- El **Frontend** pudo comunicarse con la **API**.
- La **API** a su vez pudo conectarse a la **Base de Datos** y devolvió la respuesta esperada.

---

## 7. Limpieza y/o detención de contenedores

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

## 8. Notas finales

- Este demo ilustra la comunicación interna entre contenedores (API ↔ DB) usando una red bridge.  
- Solo el Frontend expone un puerto al host, de modo que se puede acceder vía navegador, y el resto de los servicios permanecen aislados en la red interna.  
- Puedes expandir este ejemplo agregando tu lógica de negocio, endpoints adicionales, etc.

¡Listo! Con esto tienes un paso a paso para un entorno de microservicios sencillo con Docker.
