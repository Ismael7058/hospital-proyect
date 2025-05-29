const Nacionalidad = require("../model/Nacionalidad");
const Paciente = require("../model/Paciente");
// Registrar Paciente Vista
async function formularioRegistro(req, res) {
  const nacionalidades = await Nacionalidad.findAll({
    attributes: ["id", "nombre"],
  });
  const errores = req.query.errores || {};
  res.render("recepcion/registrar", { nacionalidades, errores });
};

async function crearPaciente(req, res) {
  const paciente = {
    dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    genero: req.body.genero,
    fechaNacimiento: req.body.fechaNacimiento,
    idNacionalidad: req.body.nacionalidad,
    domicilio: req.body.domicilio,
    email: req.body.email,
    telefono: req.body.telefono
  };
  const errores = validarCamposPaciente(paciente);

  if (Object.keys(errores).length > 0) {
    const nacionalidades = await Nacionalidad.findAll({
      attributes: ["id", "nombre"],
    });
    return res.status(400).render("recepcion/registrar", { errores, nacionalidades });
  }
  try {
    console.log("Datos del paciente:", paciente);
    const pacienteExiste = await Paciente.findOne({ where: { dni: paciente.dni } });

    if (pacienteExiste) {
      const nacionalidades = await Nacionalidad.findAll({
        attributes: ["id", "nombre"],
      });
      return res.status(400).render("recepcion/registrar", {
        errores: { dni: "Ya existe un paciente con este DNI" },
        nacionalidades
      });
    }
    await Paciente.create(paciente);
    res.redirect("/internar");
  } catch (error) {
  console.error("Error al crear el paciente:", error);
  if (error.name === "SequelizeValidationError") {
    return res.status(400).send("Error de validación en los datos del paciente.");
  }
  res.status(500).send("Error al registrar el paciente.");
}

}

function validarCamposPaciente(datos) {
  const errores = {};
  if (!datos.dni) errores.dni = 'El campo DNI es obligatorio';
  if (!datos.nombre) errores.nombre = 'El campo Nombre es obligatorio';
  if (!datos.apellido) errores.apellido = 'El campo Apellido es obligatorio';
  if (!datos.genero) errores.genero = 'El campo Género es obligatorio';
  if (!datos.fechaNacimiento) errores.fechaNacimiento = 'La Fecha de Nacimiento es obligatoria';
  if (!datos.idNacionalidad) errores.idNacionalidad = 'La Nacionalidad es obligatoria';
  if (!datos.domicilio) errores.domicilio = 'El Domicilio es obligatorio';
  if (!datos.email) errores.email = 'El Email es obligatorio';
  if (!datos.telefono) errores.telefono = 'El Teléfono es obligatorio';
  return errores;
};

module.exports = {
  formularioRegistro,
  crearPaciente
};