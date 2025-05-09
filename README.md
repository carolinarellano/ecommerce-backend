# Proyecto: Tienda Online E-commerce

---

## 📋 Requisitos Previos

- Node.js instalado (https://nodejs.org/)
- MySQL instalado
- Un editor de código (recomendado: Visual Studio Code)

---

## 🚀 Instalación Rápida

1. Clona o descarga el proyecto en tu computadora.
2. Entra al directorio raíz del proyecto.
3. Ejecuta en terminal:

    ```bash
    npm install
    ```

✅ Esto instalará todas las dependencias necesarias.

---

## ⚙️ Configuración

1. Copia el archivo `.env.example` y renombralo como `.env`
2. Llena tus datos de conexión MySQL en el `.env`:

    ```env
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_NAME=nombre_base_datos
    ```

---

## 🛠 Base de Datos

1. Abre tu MySQL Workbench o CLI.
2. Ejecuta el script `database/productos_ejemplo.sql` incluido.
3. Esto creará la base de datos `ecommerce` y poblará productos de ejemplo.

---

## 🚀 Cómo correr el servidor

En terminal:

```bash
npm run dev
```
*(recomendado para desarrollo, con `nodemon`)*

o

    
    ```bash
    npm start
    ```
*(modo producción simple)*

---

## 🖥️ Navega a:

- Home: http://localhost:3000/
- Admin Panel: http://localhost:3000/admin
- Products: http://localhost:3000/store
- About Us: http://localhost:3000/about_us
- Shopping Cart: http://localhost:3000/shopping_cart

---

## 📦 Estructura de Carpetas

- `src/views/` ➔ Vistas (home, admin, categorías, carrito, etc.)
- `src/views/partials/` ➔ Header y Footer
- `src/app/controllers/` ➔ Controladores de lógica
- `src/app/routes/` ➔ Definición de rutas
- `src/app/config/` ➔ Configuración de la base de datos
- `public/` ➔ CSS, JS, imágenes públicas

---

## 🎯 Funcionalidades

- CRUD completo de productos en Admin.
- Conexión a base de datos MySQL.
- Vistas dinámicas con EJS.
- Panel de administrador para añadir, editar y eliminar productos.
- Confirmación antes de eliminar productos.
- Página de error 404 personalizada.

---
