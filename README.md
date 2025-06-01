# TCG Tournament 🃏🔥⚫🔴⚪

Aplicación web para gestionar torneos de cartas estilo Magic: The Gathering, con autenticación, gestión de usuarios, mazos, recompensas y participación en foros.

---

## 🚀 Tecnologías utilizadas

- **Frontend**: React + Vite
  - Routing con `react-router-dom`
  - Bootstrap + estilos personalizados (tema Mardu: blanco, negro, rojo)
- **Backend**: Laravel 10
  - API RESTful
  - Autenticación de usuarios (registro/login)
  - Base de datos relacional con migraciones y modelos
- **Base de datos**: SQLite (modo local)

---

## ✅ Funcionalidades completadas

- [x] Configuración del entorno Laravel y React
- [x] Migraciones de base de datos completas
- [x] Modelos Eloquent con relaciones
- [x] Controladores API (CRUD básico)
- [x] Autenticación: Login y Registro en frontend
- [x] Protecciones de rutas con autenticación
- [x] Navegación con React Router y NavLink
- [x] Finalizar endpoints de autenticación (login, logout, tokens)
- [x] Validación en back de todos los formularios
- [x] Vista de perfil de usuario
- [x] Gestión de torneos desde el frontend (crear, listar, participar)
- [x] Sistema de recompensas y vinculación con torneos
- [x] Sistema de foros y comentarios
- [x] Dashboard de administración (Laravel o React)
- [x] Interfaz responsive + mejoras visuales (colores Mardu)
- [x] Logo final y diseño gráfico estilo medieval
- [x] Despliegue (Docker, Laravel Forge o Vercel)

---

## 🖼️ Estilo visual

- Colores de facción **Mardu**:
  - ⚪ Blanco (base)
  - ⚫ Negro (tipografía o acentos)
  - 🔴 Rojo (botones o llamadas a la acción)

---
Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js y npm](https://nodejs.org/) — para ejecutar React localmente si prefieres
- [Composer](https://getcomposer.org/) — para ejecutar Laravel localmente si prefieres

## 🐳 Cómo iniciar el proyecto con Docker

### Clonar el repositorio

<<<<<<< HEAD
3. Configurar Laravel
=======
## Configurar Laravel
>>>>>>> b7ba7d9b082f777419285b298cdeb5caa2a58893
Ejecuta estos comandos dentro del contenedor Laravel:

docker exec -it laravel-app bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

<<<<<<< HEAD
Frontend (React + Vite)
=======
## Frontend (React + Vite)
>>>>>>> b7ba7d9b082f777419285b298cdeb5caa2a58893

cd resources/js
npm install
npm run dev

Comandos útiles Laravel

Ejecutar migraciones:
php artisan migrate

Ejecutar seeds:
php artisan db:seed

Comandos útiles React
npm run build

<<<<<<< HEAD
Iniciar docker backend:
docker build -t laravel-backend .
docker run -d -p 8888:8888 --name laravel-container laravel-backend

Iniciar Frontend
docker build -t react-app .
docker run -d -p 5173:5173 --name react-app-container react-app
=======
# Iniciar docker backend:
1º-docker build -t laravel-backend .
2º-docker run -d -p 8888:8888 --name laravel-container laravel-backend

# Iniciar Frontend
1º- docker build -t react-app .
2º- docker run -d -p 5173:5173 --name react-app-container react-app
>>>>>>> b7ba7d9b082f777419285b298cdeb5caa2a58893
