const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Habitacion extends Model { }

Habitacion.init(
  {
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idAla: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Ala',
        key: 'id'
      }
    }
  }, {
  sequelize,
  modelName: "Habitacion",
  tableName: "habitacion",
}
);

module.exports = Habitacion;