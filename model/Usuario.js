const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Usuario extends Model { }

Usuario.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM("admin", "medico", "recepcionista", "enfermeroClinica", "enfermeroTriage"),
      allowNull: false
    },
    session: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    idPersona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'persona',
        key: 'id'
      }
    }
  }, {
  sequelize,
  modelName: "Usuario",
  tableName: "usuario",
}
);

module.exports = Usuario;