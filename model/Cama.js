const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");


class Cama extends Model { }

Cama.init(
  {
    numero:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    idHabitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Habitacion',
        key: 'id'
      }
    }
  }, {
  sequelize,
  modelName: "Cama",
  tableName: "cama",
}
);

module.exports = Cama;