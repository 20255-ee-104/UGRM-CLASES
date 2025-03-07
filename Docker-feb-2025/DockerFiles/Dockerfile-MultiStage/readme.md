# 🐳 Dockerfile Multistage con Ubuntu y CentOS

Este proyecto muestra cómo crear imágenes Docker usando múltiples etapas (**Multistage**) con diferentes distribuciones de Linux (Ubuntu y CentOS) dentro del mismo archivo Dockerfile.

---

## 📦 Contenido del Dockerfile

El Dockerfile contiene dos etapas separadas:

- **Etapa Ubuntu**: Basada en Ubuntu 22.04, instala `curl` y genera un archivo identificador.
- **Etapa CentOS**: Basada en CentOS 7, instala `curl` y genera un archivo identificador.

Cada etapa permite crear imágenes Docker independientes según la necesidad.

---

## 🚀 Construcción de las Imágenes

### Crear Imagen basada en Ubuntu:

```bash
docker build --target ubuntu-stage -t imagen-ubuntu .
```

### Crear Imagen basada en CentOS:

```bash
docker build --target centos-stage -t imagen-centos .
```

---

## ▶️ Ejecución de Contenedores

### Ejecutar contenedor Ubuntu:

```bash
docker run --rm -it imagen-ubuntu bash
```

Comprobación dentro del contenedor:

```bash
cat /ubuntu.txt
```

Deberías obtener:

```
Esta es una imagen basada en Ubuntu
```

---

### Ejecutar contenedor CentOS:

```bash
docker run --rm -it imagen-centos bash
```

Comprobación dentro del contenedor:

```bash
cat /centos.txt
```

Deberías obtener:

```
Esta es una imagen basada en CentOS
```

---

## 📌 Explicación pedagógica:

Este ejemplo demuestra cómo:

- Usar multistage builds para mantener varias configuraciones dentro de un único Dockerfile.
- Generar imágenes específicas según la etapa definida.
- Utilizar comandos Docker básicos para construir, ejecutar y verificar contenedores.



