FROM php:8.2-apache

# Enable Apache rewrite (optional but nice)
RUN a2enmod rewrite

# Copy your website into web root
COPY . /var/www/html/

# Fix permissions (classic Eierschiss prevention)
RUN chown -R www-data:www-data /var/www/html