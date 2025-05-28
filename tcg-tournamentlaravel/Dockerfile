FROM php:8.2-fpm

# Instala extensiones y dependencias necesarias
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Directorio de la aplicación
WORKDIR /var/www

# Copia todo el código del proyecto
COPY . .

# Instala dependencias de Laravel
RUN composer install --optimize-autoloader --no-dev

# Permisos
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
