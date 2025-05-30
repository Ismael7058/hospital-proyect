const Paciente = require('./Paciente');
const Nacionalidad = require('./Nacionalidad');
const Admision = require('./Admision');
const SeguroMedico = require('./SeguroMedico');
const TrasladoInternacion = require('./TrasladoInternacion');
const Cama = require('./Cama');
const Habitacion = require('./Habitacion');
const Ala = require('./Ala');

// Nacionalidad 1:N Paciente
Nacionalidad.hasMany(Paciente, { foreignKey: 'idNacionalidad', as: 'pacientes' });
Paciente.belongsTo(Nacionalidad, { foreignKey: 'idNacionalidad', as: 'nacionalidad' });


// Paciente 1:N SeguroMedico
Paciente.hasMany(SeguroMedico, { foreignKey: 'idPaciente' });
SeguroMedico.belongsTo(Paciente, { foreignKey: 'idPaciente' });

// Paciente 1:N Admision
Paciente.hasMany(Admision, { foreignKey: 'idPaciente' });
Admision.belongsTo(Paciente, { foreignKey: 'idPaciente' });

// Admision 1:N TrasladoInternacion
Admision.hasMany(TrasladoInternacion, { foreignKey: 'idAdmision' });
TrasladoInternacion.belongsTo(Admision, { foreignKey: 'idAdmision' });

// Cama 1:N TrasladoInternacion
Cama.hasMany(TrasladoInternacion, { foreignKey: 'idCama' });
TrasladoInternacion.belongsTo(Cama, { foreignKey: 'idCama' });

// Habitacion 1:N Cama
Habitacion.hasMany(Cama, { foreignKey: 'idHabitacion' });
Cama.belongsTo(Habitacion, { foreignKey: 'idHabitacion' });

// Ala 1:N Habitacion
Ala.hasMany(Habitacion, { foreignKey: 'idAla' });
Habitacion.belongsTo(Ala, { foreignKey: 'idAla' });

module.exports = {Paciente, Nacionalidad, Admision, SeguroMedico, TrasladoInternacion, Cama, Habitacion, Ala};
