#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Memulai Proses Deploy Laravel di aaPanel ==="

# 1. Menentukan PHP Binary bawaan aaPanel jika ada, jika tidak pakai 'php' default
PHP_PATH="php"
if [ -f "/www/server/php/8.2/bin/php" ]; then
    PHP_PATH="/www/server/php/8.2/bin/php"
elif [ -f "/www/server/php/8.1/bin/php" ]; then
    PHP_PATH="/www/server/php/8.1/bin/php"
elif [ -f "/www/server/php/8.0/bin/php" ]; then
    PHP_PATH="/www/server/php/8.0/bin/php"
fi

echo "-> Menggunakan PHP: $PHP_PATH"
$PHP_PATH -v

# 2. Cek apakah berkas .env sudah disiapkan
if [ ! -f ".env" ]; then
    echo "WARNING: Berkas .env tidak ditemukan! Silakan salin .env.example dan sesuaikan kredensial database Anda."
    exit 1
fi

# 3. Sinkronisasi dependensi PHP (Composer)
echo "-> Menginstal dependensi PHP (Composer)..."
$PHP_PATH /usr/bin/composer install --no-dev --optimize-autoloader || composer install --no-dev --optimize-autoloader

# 4. Jalankan migrasi database
echo "-> Menjalankan migrasi database..."
$PHP_PATH artisan migrate --force

# 5. Build Aset Frontend (React & Vite)
echo "-> Menginstal dependensi JS & Build Aset produksi..."
if command -v npm &> /dev/null; then
    npm install
    npm run build
else
    echo "WARNING: npm tidak terpasang di server! Silakan build di lokal lalu unggah folder 'public/build'."
fi

# 6. Optimasi Cache Laravel
echo "-> Melakukan optimasi cache Laravel..."
$PHP_PATH artisan config:cache
$PHP_PATH artisan route:cache
$PHP_PATH artisan view:cache

# 7. Mengatur Hak Akses Direktori untuk aaPanel (Web server user: www)
echo "-> Menyesuaikan hak akses dan kepemilikan folder..."
chmod -R 775 storage bootstrap/cache
if [ "$(id -u)" -eq 0 ]; then
    # Hanya jalankan chown jika dijalankan sebagai root/sudo
    chown -R www:www storage bootstrap/cache public/build 2>/dev/null || true
fi

echo "=== PROSES DEPLOY SELESAI DENGAN SUKSES! ==="
