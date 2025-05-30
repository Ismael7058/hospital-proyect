const Sequelize = require("sequelize");
const Nacionalidad = require("../model/Nacionalidad");
const Paciente = require("../model/Paciente");
// Registrar Paciente Vista
async function formularioRegistro(req, res) {
  const dni = req.query.dni || "";
  const nacionalidades = await Nacionalidad.findAll({
    attributes: ["id", "nombre"],
  });
  const errores = req.query.errores || {};

  
  res.render("recepcion/registrar", { nacionalidades, errores , dni});
  
};

async function formularioRegistro(req, res) {
  const dni = req.query.dni;
  const nacionalidades = await Nacionalidad.findAll({
    attributes: ["id", "nombre"],
  });
  const errores = req.query.errores || {};

  const datosParaRender = { nacionalidades, errores };

  if (dni && dni.trim().length > 0) {
    datosParaRender.dni = dni.trim();
  }

  res.render("recepcion/registrar", datosParaRender);
}


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
    const newPaciente = await Paciente.create(paciente);
    res.redirect(`/paciente/${newPaciente.id}`);
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

async function datosPaciente(req, res) {
  try {
    const id = req.params.id;
    const paciente = await Paciente.findByPk(id, {
      include: [{
        model: Nacionalidad,
        as: 'nacionalidad',
        attributes: ['id', 'nombre']
      }]
    });

    if (!paciente) return res.status(404).send("Paciente no encontrado");

    res.render("recepcion/paciente", { paciente });
  } catch (error) {
    console.error("Error al obtener el paciente:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function buscarPaciente(req, res) {
  const { dni } = req.body;
  try {
    const paciente = await Paciente.findOne({
      where: { dni },
      include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });

    if (!paciente) {
      const pacientes = await Paciente.findAll({
        include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
      });

      return res.render("recepcion/buscar", {
        pacientes,
        dniNoEncontrado: dni
      });
    }
    res.redirect("buscar/" + paciente.id);
  } catch (error) {
    console.error("Error al buscar el paciente:", error);
    res.status(500).send("Error al buscar el paciente.");
  }
}



async function buscarPacienteVista(req, res) {
  ;
  try {
    const pacientes = await Paciente.findAll({
      include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });
    res.render("recepcion/buscar", { pacientes, mensaje: ""});
  } catch (error) {
    console.error("Error al obtener los pacientes:", error);
    res.status(500).send("Error al obtener los pacientes.");
  }
}

module.exports = {
  formularioRegistro,
  crearPaciente,
  datosPaciente,
  buscarPaciente,
  buscarPacienteVista
};