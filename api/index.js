// api/index.js
require('dotenv').config();             // Carga variables de entorno
const { app } = require('../app');      // Importa tu Express app
module.exports = app; 