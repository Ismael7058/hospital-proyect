const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Admision extends Model { }

Admision.init(
  {
    fechaIngreso: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaEgreso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diagnosticoInicial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacientes',
        key: 'id'
      }
    }
  }, {
  sequelize,
  modelName: "Admision",
  tableName: "admision",
}
);

module.exports = Admision;