# Hospital Horizon

Sistema de gestión hospitalaria para la administración de pacientes, admisiones, camas, emergencias y seguros médicos.

## Requisitos

- Node.js (v14 o superior)
- npm
- Base de datos MySQL (configurada en `.env`)

## Instalación

1. Clona el repositorio y entra en la carpeta del proyecto:

   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd hospital-proyect
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Configura el archivo `.env` con los datos de tu base de datos (puedes usar `.env.sample` como ejemplo).

## Scripts

- **Iniciar en modo producción:**

  ```sh
  npm start
  ```

- **Iniciar en modo desarrollo (con recarga automática):**

  ```sh
  npm run dev
  ```

## Estructura principal

- `app.js` — Configuración principal de Express y rutas.
- `server.js` — Arranque del servidor y sincronización de modelos.
- `model/` — Modelos Sequelize (Paciente, Admision, Cama, etc.).
- `controller/` — Lógica de negocio y controladores de rutas.
- `router/` — Definición de rutas Express.
- `view/` — Vistas Pug para la interfaz de usuario.
- `public/` — Archivos estáticos (CSS, JS, imágenes).

## Funcionalidades

- Registro y edición de pacientes.
- Gestión de admisiones y traslados.
- Registro y edición de seguros médicos de pacientes.
- Admisión de emergencias.
- Listado y búsqueda de pacientes y emergencias.

## Notas

- El sistema utiliza Sequelize para la gestión de la base de datos.
- Las vistas están construidas con Pug y Bootstrap.
- Para desarrollo, puedes modificar los modelos y ejecutar el servidor con `npm run dev` para recarga automática.

---

¡Contribuciones y sugerencias son bienvenidas!