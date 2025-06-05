const Paciente = require('./Paciente');
const Nacionalidad = require('./Nacionalidad');
const Admision = require('./Admision');
const SeguroMedico = require('./SeguroMedico');
const SeguroPaciente = require('./SeguoPaciente'); // ¡Importante!
const TrasladoInternacion = require('./TrasladoInternacion');
const Cama = require('./Cama');
const Habitacion = require('./Habitacion');
const Ala = require('./Ala');
const AdmisionProv = require('./AdmisionProv');

// Nacionalidad 1:N Paciente
Nacionalidad.hasMany(Paciente, { foreignKey: 'idNacionalidad', as: 'pacientes' });
Paciente.belongsTo(Nacionalidad, { foreignKey: 'idNacionalidad', as: 'nacionalidad' });

// Paciente N:M SeguroMedico a través de SeguroPaciente
Paciente.belongsToMany(SeguroMedico, {
  through: SeguroPaciente,
  foreignKey: 'idPaciente',
  otherKey: 'idSeguroMedico',
  as: 'segurosMedicos'
});

SeguroMedico.belongsToMany(Paciente, {
  through: SeguroPaciente,
  foreignKey: 'idSeguroMedico',
  otherKey: 'idPaciente',
  as: 'pacientes'
});

SeguroMedico.hasMany(SeguroPaciente, { foreignKey: 'idSeguroMedico' });
SeguroPaciente.belongsTo(SeguroMedico, { foreignKey: 'idSeguroMedico' });

Paciente.hasMany(SeguroPaciente, { foreignKey: 'idPaciente' });
SeguroPaciente.belongsTo(Paciente, { foreignKey: 'idPaciente' });


// Paciente 1:N Admision
Paciente.hasMany(Admision, { foreignKey: 'idPaciente' });
Admision.belongsTo(Paciente, { foreignKey: 'idPaciente' });

// Admision 1:N TrasladoInternacion
Admision.hasMany(TrasladoInternacion, { foreignKey: 'idAdmision' });
TrasladoInternacion.belongsTo(Admision, { foreignKey: 'idAdmision' });

// Admision 1:N TrasladoInternacion
AdmisionProv.hasMany(TrasladoInternacion, { foreignKey: 'admisionProv' });
TrasladoInternacion.belongsTo(AdmisionProv, { foreignKey: 'admisionProv' });

// Cama 1:N TrasladoInternacion
Cama.hasMany(TrasladoInternacion, { foreignKey: 'idCama' });
TrasladoInternacion.belongsTo(Cama, { foreignKey: 'idCama' });

// Habitacion 1:N Cama
Habitacion.hasMany(Cama, { foreignKey: 'idHabitacion', as: "camas"});
Cama.belongsTo(Habitacion, { foreignKey: 'idHabitacion', as: "habitacion" });

// Ala 1:N Habitacion
Ala.hasMany(Habitacion, { foreignKey: 'idAla', as: "habitaciones" });
Habitacion.belongsTo(Ala, { foreignKey: 'idAla', as: "ala" });

module.exports = {
  Paciente,
  Nacionalidad,
  Admision,
  SeguroMedico,
  SeguroPaciente,
  TrasladoInternacion,
  Cama,
  Habitacion,
  Ala
};
