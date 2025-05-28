const sequelize = require("./db");

// Modelos
const Nacionalidad = require("./Nacionalidad");
const Paciente = require("./Paciente");
const SeguroMedico = require("./SeguroMedico");
const Admision = require("./Admision");
const Ala = require("./Ala");
const Habitacion = require("./Habitacion");
const Cama = require("./Cama");
const TrasladoInternacion = require("./TrasladoInternacion");

// Relaciones
require("./relaciones");

// Exportar
module.exports = {
  sequelize,
  Nacionalidad,
  SeguroMedico,
  Paciente,
  Admision,
  Ala,
  Habitacion,
  Cama,
  TrasladoInternacion,
};
