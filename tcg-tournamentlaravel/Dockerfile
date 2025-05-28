FROM php:8.2-fpm

# Instala extensiones y dependencias necesarias
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establece directorio de trabajo
WORKDIR /var/www

# Copia todo el código del proyecto
COPY . .

# Instala dependencias PHP de Laravel
RUN composer install --optimize-autoloader --no-dev

# Ajusta permisos necesarios para Laravel
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www/storage /var/www/bootstrap/cache

# Expone el puerto 8888 para la app
EXPOSE 8888

# Comando para iniciar el servidor Laravel en el puerto 8888
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8888"]
