FROM php:8.2-fpm

WORKDIR /var/www

COPY . .

EXPOSE 8888

CMD ["php", "-S", "0.0.0.0:8888", "-t", "public"]
