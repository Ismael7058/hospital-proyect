const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class SeguroPaciente extends Model {}

SeguroPaciente.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idSeguroMedico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'seguroMedico', // nombre de la tabla
      key: 'id'
    }
  },
  idPaciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pacientes', // nombre de la tabla
      key: 'id'
    }
  },
  numeroAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaVigencia: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFinalizacion: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "SeguroPaciente",
  tableName: "seguroPaciente",
  timestamps: false
});

module.exports = SeguroPaciente;
