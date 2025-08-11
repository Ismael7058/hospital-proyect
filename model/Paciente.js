const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Paciente extends Model { }

Paciente.init(
  {
    idPersona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'persona',
        key: 'id'
      }
    }
  }, {
  sequelize,
  modelName: "Paciente",
  tableName: "pacientes",
}
);

module.exports = Paciente;