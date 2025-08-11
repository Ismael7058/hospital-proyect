const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Recepcion extends Model { }

Recepcion.init(
  {
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
  modelName: "Recepcion",
  tableName: "recepcion",
}
);

module.exports = Recepcion;