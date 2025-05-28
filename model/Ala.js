const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Ala extends Model { }

Ala.init(
  {
    nombre:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
  sequelize,
  modelName: "Ala",
  tableName: "ala",
}
);

module.exports = Ala;