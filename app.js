require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Sequelize: conexión
const sequelize = require('./model/db');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

const homeRouter = require("./router/homeRouter");
const medicoRouter = require('./router/medicoRouter');
const recepcionRouter = require('./router/recepcionRouter');
const enfermeroRouter = require('./router/enfermeroRouter');

app.use('/', homeRouter);
app.use('/medico', medicoRouter);
app.use('/recepcion', recepcionRouter);
app.use('/enfermero', enfermeroRouter);

app.use((req, res) => {
  res.status(404).render('error');
});

app.get("/ping", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send("Base de datos conectada correctamente 🚀");
  } catch (error) {
    res.status(500).send("Error conectando a la base de datos ❌: " + error);
  }
});

// Definir el puerto desde la variable de entorno
app.set("port", process.env.PORT || 3030);

module.exports = { app, sequelize }; // Exportamos sequelize también
