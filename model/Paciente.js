const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Paciente extends Model { }

Paciente.init(
  {
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaNacimiento: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const raw = this.getDataValue('fechaNacimiento');
        return raw
          ? raw.toISOString().slice(0, 10)    // "YYYY-MM-DD"
          : null;
      }
    },
    idNacionalidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Nacionalidad',
        key: 'id'
      }
    },
    domicilio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
  sequelize,
  modelName: "Paciente",
  tableName: "pacientes",
}
);

module.exports = Paciente;