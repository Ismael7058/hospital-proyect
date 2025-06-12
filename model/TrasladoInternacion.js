const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class TrasladoInternacion extends Model { }

TrasladoInternacion.init(
  {
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idAdmision: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admision',
        key: 'id'
      }
    },
    idAdmisionProvisional:{
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admisionprov',
        key: 'id'
      }
    },
    idCama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cama',
        key: 'id'
      }
    },
    motivoCambio: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
  sequelize,
  modelName: "TrasladoInternacion",
  tableName: "trasladointernacion",
}
);

module.exports = TrasladoInternacion;