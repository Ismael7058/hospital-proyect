# Hospital Horizon

## Descripcion

Sistema de gestión hospitalaria para la administración de pacientes, admisiones, camas, emergencias y seguros médicos. Desarrollado en Node.js con Express, Sequelize y Pug como motor de vista

## Requisitos

- Node.js (v14 o superior)
- npm (Node Package MAnager)
- Base de datos Postgres (configurada en `.env`)

## Instalación

1. Clona el repositorio

   ```sh
   git clone https://github.com/Ismael7058/hospital-proyect.git
   ```

2. Entra en la carpeta del proyecto

   ```sh
   cd hospital-proyect
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

## Variables de entorno
Configura el archivo `.env` con los datos de tu base de datos (puedes usar `.env.sample` como ejemplo).
- DB_NAME — Nombre de la base de datos PostgreSQL utilizada por la aplicación.
- DB_USER — Usuario de la base de datos
- DB_PASSWORD — Contraseña del usuario de la base de datos
- DB_HOST — Host o dirección del servidor de la base de datos.
- DB_PORT — Puerto en el que escucha la base de datos.
- DB_DIALECT — Dialecto de la base de datos 
- DB_USE_SSL — Indica si la conexión a la base de datos debe usar SSL (true o false)
- PORT — Puerto en el que se ejecutará el servidor de la aplicación

## Comando sprincipales

- **Iniciar en modo producción:**

  ```sh
  npm start
  ```

- **Iniciar en modo desarrollo (con recarga automática):**

  ```sh
  npm run dev
  ```

- **Cargar datos para pruebas:**

  ```sh
  npm run cargar-datos
  ```

## Estructura principal

- `app.js` — Configuración principal de Express y rutas.
- `server.js` — Arranque del servidor y sincronización de modelos.
- `model/` — Modelos de datos con Sequelize.
- `controller/` — Lógica de negocio y controladores de rutas.
- `router/` — Definición de rutas Express.
- `view/` — Vistas Pug para la interfaz de usuario.
- `public/` — Archivos estáticos (CSS, JS, imágenes).

## Funcionalidades

- Registro y edición de pacientes.
- Gestión de admisiones y traslados.
- Registro y edición de seguros médicos de pacientes.
- Admisión de emergencias.
- Listado y búsqueda de pacientes de emergencias.
- Gestion de turnos.
- Gestion de camas.

## Tecnologías utilizadas

- **Node.js + Express:** Plataforma y framework principal para el desarrollo del backend y la API REST.
- **Sequelize:** ORM utilizado para definir los modelos, relaciones y realizar consultas a la base de datos PostgreSQL de forma sencilla y segura.
- **PostgreSQL:** Sistema de gestión de base de datos relacional donde se almacenan los datos de pacientes, admisiones, camas, etc.
- **Pug:** Motor de plantillas utilizado para generar las vistas HTML de la aplicación de manera dinámica y eficiente.
- **Bootstrap:** Framework CSS empleado para el diseño responsivo y la apariencia moderna de la interfaz de usuario.

## Notas

- El sistema utiliza Sequelize para la gestión de la base de datos.
- Las vistas están construidas con Pug y Bootstrap.
- Para desarrollo, puedes modificar los modelos y ejecutar el servidor con `npm run dev` para recarga automática.
