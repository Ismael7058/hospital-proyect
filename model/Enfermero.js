const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Enfermero extends Model { }

Enfermero.init(
  {
    matricula: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idAla: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ala',
        key: 'id'
      }
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
  modelName: "Enfermero",
  tableName: "enfermero",
}
);

module.exports = Enfermero;