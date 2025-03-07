# Usar la imagen oficial de PHP con Apache
FROM php:8.1-apache

# Copiar los archivos del frontend al servidor Apache
COPY . /var/www/html/

# Exponer el puerto 80 para acceso web
EXPOSE 80

# Habilitar mod_rewrite para manejo de URLs en Apache
RUN a2enmod rewrite

# Configurar permisos para los archivos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Definir el comando de inicio del contenedor
CMD ["apache2-foreground"]
