FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev \
    sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache \
    && chmod -R 775 database database/database.sqlite

EXPOSE 8888

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8888"]
