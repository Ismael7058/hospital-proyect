const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Turno extends Model { }

Turno.init(
  {
    fechaTurno: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idPaciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacientes',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
  sequelize,
  modelName: "Turno",
  tableName: "turno",
}
);

module.exports = Turno;