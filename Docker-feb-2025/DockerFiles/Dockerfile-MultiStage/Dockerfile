# Etapa 1: Imagen basada en Ubuntu
FROM ubuntu:22.04 AS ubuntu-stage

# Evita interacciones durante la instalación de paquetes
ENV DEBIAN_FRONTEND=noninteractive

# Actualiza repositorios e instala paquetes en Ubuntu
RUN apt-get update && apt-get install -y curl
RUN echo "Esta es una imagen basada en Ubuntu" > /ubuntu.txt

# Etapa 2: Imagen basada en CentOS
FROM centos:centos8 AS centos-stage

# Corrige repositorios y usa baseurl directa
RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-* && \
    dnf clean all && \
    dnf update -y && \
    dnf install -y curl && \
    dnf clean all

RUN echo "Esta es una imagen basada en CentOS Stream 8" > /centos.txt


