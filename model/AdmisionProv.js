/*
CREATE TABLE AdmisionProv (
    id_admisionprov BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE        NULL,
    fecha_hora       DATETIME    NOT NULL,
    motivo           VARCHAR(255) NOT NULL,
    datos_extra      VARCHAR(255) NULL
    -- aquí sólo guardas lo mínimo que obtienes en triage
);
*/
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class AdmisionProv extends Model { }

AdmisionProv.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Desconocido'
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Desconocido'
    },
    generoPaciente: {
      type: DataTypes.STRING,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
  sequelize,
  modelName: "AdmisionProv",
  tableName: "admisionProv",
}
);

module.exports = AdmisionProv;