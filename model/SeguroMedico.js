const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class SeguroMedico extends Model {}

SeguroMedico.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "SeguroMedico",
  tableName: "seguromedico",
});

module.exports = SeguroMedico;
