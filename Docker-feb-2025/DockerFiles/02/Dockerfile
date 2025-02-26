FROM debian:buster-slim


RUN apt-get update && apt-get install -y apache2 

VOLUME ["/var/www/html"]

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
