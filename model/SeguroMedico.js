const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class SeguroMedico extends Model { }

SeguroMedico.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numerAfiliado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaVigencia: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaFinalizacion:{
      type: DataTypes.DATE,
      allowNull: false
    },

  }, {
  sequelize,
  modelName: "SeguroMedico",
  tableName: "seguroMedico",
}
);


module.exports = SeguroMedico;