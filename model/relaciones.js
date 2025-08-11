const Paciente = require('./Paciente');
const Nacionalidad = require('./Nacionalidad');
const Admision = require('./Admision');
const SeguroMedico = require('./SeguroMedico');
const SeguroPaciente = require('./SeguroPaciente');
const TrasladoInternacion = require('./TrasladoInternacion');
const Cama = require('./Cama');
const Habitacion = require('./Habitacion');
const Ala = require('./Ala');
const AdmisionProv = require('./AdmisionProv');
const Turno = require('./Turno')
const Usuario = require('./Usuario');
const Persona = require('./Persona');
const Recepcion = require('./Recepcion');
const Medico = require('./Medico');
const Enfermero = require('./Enfermero');

// Usuario 1:1 Persona
Usuario.belongsTo(Persona, { foreignKey: 'idPersona', as: 'persona' });
Persona.hasOne(Usuario, { foreignKey: 'idPersona', as: 'usuario' });

// Recepcion 1:1 Usuario
Recepcion.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
Usuario.hasOne(Recepcion, { foreignKey: 'idUsuario', as: 'recepcion'});

// Enfermero 1:1 Usuario
Recepcion.belongsTo(Ala, { foreignKey: 'idAla', as: 'ala' });
Ala.hasOne(Recepcion, { foreignKey: 'idAla', as: 'recepcion'});

// Medico 1:1 Usuario
Medico.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
Usuario.hasOne(Medico, { foreignKey: 'idUsuario', as: 'medico'});;

// Enfermero 1:1 Usuario
Enfermero.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
Usuario.hasOne(Enfermero, { foreignKey: 'idUsuario', as: 'enfermero'});;

// Enfermero 1:1 Usuario
Enfermero.belongsTo(Ala, { foreignKey: 'idAla', as: 'ala' });
Ala.hasOne(Enfermero, { foreignKey: 'idAla', as: 'enfermero'});

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

// Paciente 1:N Turno
Turno.belongsTo(Paciente, {
  foreignKey: "idPaciente",
  as: "paciente",
});
Paciente.hasMany(Turno, {
  foreignKey: "idPaciente",
  as: "turnos",
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

// AdmisionProv 1:N TrasladoInternacion
TrasladoInternacion.belongsTo(AdmisionProv, {
  foreignKey: 'idAdmisionProvisional',
  as: 'admisionProvisional'
});
AdmisionProv.hasMany(TrasladoInternacion, {
  foreignKey: 'idAdmisionProvisional',
  as: 'traslados'
});


// Cama 1:N TrasladoInternacion
Cama.hasMany(TrasladoInternacion, {
  foreignKey: 'idCama',
  as: 'trasladosInternacion'
});
TrasladoInternacion.belongsTo(Cama, {
  foreignKey: 'idCama',
  as: 'cama'
});

// Habitacion 1:N Cama
Habitacion.hasMany(Cama, { foreignKey: 'idHabitacion', as: "camas" });
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
  Ala,
  Turno
};
