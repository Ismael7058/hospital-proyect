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
const AdmisionProv = require("./AdmisionProv");
const SeguroPaciente = require("./SeguroPaciente");
const Turno = require('./Turno');
// Relaciones
require("./relaciones");

// Exportar
module.exports = {
  sequelize,
  Nacionalidad,
  SeguroMedico,
  SeguroPaciente,
  Paciente,
  Admision,
  Ala,
  Habitacion,
  Cama,
  TrasladoInternacion,
  AdmisionProv,
  Turno
};
