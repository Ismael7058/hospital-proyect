const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Medico extends Model { }

Medico.init(
  {
    matricula: {
      type: DataTypes.STRING,
      allowNull: false
    },
    especialidad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
  sequelize,
  modelName: "Medico",
  tableName: "medico",
}
);

module.exports = Medico;