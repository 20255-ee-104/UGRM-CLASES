### 📌 **Guía para Construir y Ejecutar un Contenedor con Jenkins y Plugins en Docker**  

Este `Dockerfile` configura **Jenkins** con el plugin **workflow-aggregator**, ideal para ejecutar pipelines de CI/CD.  

---

## **1️⃣ Crear el `Dockerfile`**  
Crea un archivo llamado `Dockerfile` y copia este contenido:

```dockerfile
# Usar la imagen oficial de Jenkins LTS
FROM jenkins/jenkins:lts

# Instalar plugin para gestionar pipelines en Jenkins
RUN /bin/jenkins-plugin-cli --plugins workflow-aggregator:2.6
```

---

## **2️⃣ Construir la imagen**
Ejecuta en la terminal:

```sh
docker build -t jenkins-custom .
```

🔹 Esto creará una imagen llamada **`jenkins-custom`** con el plugin `workflow-aggregator`.

---

## **3️⃣ Ejecutar el Contenedor**
Para iniciar **Jenkins**, usa este comando:

```sh
docker run -d -p 8080:8080 -p 50000:50000 --name my-jenkins jenkins-custom
```

🔹 Explicación:  
- `-d` → Ejecuta en modo **detached** (en segundo plano).  
- `-p 8080:8080` → Expone el puerto de **Jenkins** en `http://localhost:8080`.  
- `-p 50000:50000` → Expone el puerto para **agentes remotos de Jenkins**.  
- `--name my-jenkins` → Asigna el nombre **my-jenkins** al contenedor.  
- `jenkins-custom` → Nombre de la imagen creada.  

---

## **4️⃣ Obtener la Clave de Administrador**
Cuando **Jenkins** inicia por primera vez, necesitarás una clave para desbloquearlo.  

Para obtenerla, usa:

```sh
docker logs my-jenkins
```

🔹 Busca una línea como esta:

```
*************************************************************
Jenkins initial setup is required. An admin user has been created
and a password generated.
Please use the following password to proceed to installation:

abcd1234efgh5678ijkl90
*************************************************************
```

🔹 Copia la clave y pégala en la página web de **Jenkins** en `http://localhost:8080`.

---

## **5️⃣ (Opcional) Usar Volumen para Persistencia**
Si quieres que **Jenkins** guarde datos entre reinicios, crea un volumen:

```sh
docker run -d -p 8080:8080 -p 50000:50000 \
    -v jenkins_home:/var/jenkins_home \
    --name my-jenkins jenkins-custom
```

🔹 Esto asegurará que **las configuraciones y los jobs** no se pierdan.

---

## **📌 Resumen Rápido**
1️⃣ **Crear el `Dockerfile`** y copiar el contenido.  
2️⃣ **Construir la imagen** con `docker build -t jenkins-custom .`  
3️⃣ **Ejecutar Jenkins** con `docker run -d -p 8080:8080 -p 50000:50000 --name my-jenkins jenkins-custom`  
4️⃣ **Ver la clave de administrador** con `docker logs my-jenkins`  
5️⃣ **(Opcional) Usar volumen para persistencia** con `-v jenkins_home:/var/jenkins_home`

docker exec -it my-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
