Si quieres enseñar a tus alumnos cómo construir y ejecutar este **Dockerfile** basado en **Fedora con OpenJDK**, aquí tienes un paso a paso sencillo.

---

## **📌 Guía Rápida para Usar Fedora + OpenJDK en Docker**

### **1️⃣ Crear el archivo `Dockerfile`**
Crea un archivo llamado `Dockerfile` y copia el siguiente contenido:

```dockerfile
# Usa Fedora 34 como base
FROM fedora:34

LABEL org.opencontainers.image.description="Java + Fedora (OpenJDK)" \
      org.opencontainers.image.authors="Hari Sekhon (https://www.linkedin.com/in/HariSekhon)" \
      org.opencontainers.image.url="https://ghcr.io/HariSekhon/fedora-java" \
      org.opencontainers.image.documentation="https://hub.docker.com/r/harisekhon/fedora-java" \
      org.opencontainers.image.source="https://github.com/HariSekhon/Dockerfiles"

# Definir versión de Java
ARG JAVA_VERSION=8
ARG JAVA_RELEASE=JDK

# Variable de entorno para Java
ENV JAVA_HOME=/usr

# Instalar OpenJDK en Fedora
RUN set -eux && \
    pkg="java-1.$JAVA_VERSION.0-openjdk" && \
    if [ "$JAVA_RELEASE" = "JDK" ]; then \
        pkg="$pkg-devel"; \
    else \
        pkg="$pkg-headless"; \
    fi; \
    yum install -y "$pkg" && \
    yum clean all && \
    rm -rf /var/cache/yum

# Copiar archivo de configuración (opcional)
COPY profile.d/java.sh /etc/profile.d/

# Ejecutar un shell interactivo al iniciar el contenedor
CMD ["/bin/bash"]
```

---

### **2️⃣ Construir la imagen**
Ejecuta el siguiente comando en la terminal (en la misma carpeta donde guardaste el `Dockerfile`):

```sh
docker build -t fedora-java .
```

🔹 Esto creará una imagen de Docker llamada `fedora-java`.

---

### **3️⃣ Ejecutar el contenedor**
Para abrir una terminal en el contenedor con Fedora y Java, ejecuta:

```sh
docker run -it --rm fedora-java
```

🔹 Explicación:
- `-it`: Mantiene la terminal interactiva.
- `--rm`: Borra el contenedor cuando termina la sesión.

---

### **4️⃣ Verificar que Java está instalado**
Una vez dentro del contenedor, ejecuta:

```sh
java -version
```

🔹 Si todo está bien, verás algo como:

```
openjdk version "1.8.0_292"
OpenJDK Runtime Environment (build 1.8.0_292-b10)
OpenJDK 64-Bit Server VM (build 25.292-b10, mixed mode)
```

---

### **5️⃣ (Opcional) Modificar la versión de Java**
Si quieres instalar otra versión de Java, puedes modificar el `Dockerfile` cambiando:

```dockerfile
ARG JAVA_VERSION=11
```

Luego, reconstruye la imagen:

```sh
docker build -t fedora-java .
```

---

## **📌 Resumen**
1. **Crea el `Dockerfile`** con el código de arriba.
2. **Construye la imagen** con `docker build -t fedora-java .`
3. **Ejecuta el contenedor** con `docker run -it --rm fedora-java`
4. **Verifica Java** con `java -version`
5. **(Opcional) Cambia la versión de Java** editando el `Dockerfile`.

