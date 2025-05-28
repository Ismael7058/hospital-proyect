const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Nacionalidad extends Model { }

Nacionalidad.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
  sequelize,
  modelName: "Nacionalidad",
  tableName: "nacionalidad",
}
);

module.exports = Nacionalidad;