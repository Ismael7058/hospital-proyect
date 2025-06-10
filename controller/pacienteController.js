const {
  sequelize,
  Nacionalidad,
  Paciente,
  SeguroPaciente,
  SeguroMedico,
  Admision,
  Ala,
  Habitacion,
  Cama,
  TrasladoInternacion,
  AdmisionProv
} = require("../model");
const validar = require('./validarDatos')
const { Op } = require("sequelize");


// Registrar Paciente Vista
async function formularioRegistro(req, res) {
  const dni = req.query.dni || "";
  try {
    let errores = {};
    let dniNoEncontrado = null;
    if (dni) {
      errores = validar.controlDni(dni);
      if (Object.keys(errores).length === 0) {
        const paciente = await Paciente.findOne({ where: { dni } });
        if (paciente) {
          errores.existe = "Ya existe un paciente con ese DNI";
          res.render("recepcion/registrar", { nacionalidades, errores, dni });
        } else {
          dniNoEncontrado = dni;
        }
      } else {
        dniNoEncontrado = dni;
      }
    }
    const nacionalidades = await Nacionalidad.findAll({
      attributes: ["id", "nombre"],
    });

    res.render("recepcion/registrar", { nacionalidades, errores, dni });
  } catch (error) {

  }







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
  const errores = validar.validarCamposPaciente(paciente);

  if (Object.keys(errores).length > 0) {
    const nacionalidades = await Nacionalidad.findAll({
      attributes: ["id", "nombre"],
    });
    return res.status(400).render("recepcion/registrar", { errores, nacionalidades });
  }
  try {
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
    res.redirect(`/recepcion/buscar/${newPaciente.id}`);
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).send("Error de validación en los datos del paciente.");
    }
    res.status(500).send("Error al registrar el paciente.");
  }
}


async function buscarPaciente(req, res) {
  const dni = req.query.dni || null;
  try {
    let errores = {};
    let dniNoEncontrado = null;

    if (dni) {
      errores = validar.controlDni(dni);
      if (Object.keys(errores).length === 0) {
        const paciente = await Paciente.findOne({
          where: { dni },
          include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
        });

        if (paciente) {
          return res.redirect("paciente/" + paciente.id);
        } else {
          dniNoEncontrado = dni;
        }
      } else {
        dniNoEncontrado = dni;
      }
    }

    // Si no hay dni o hubo error, mostrar todos
    const pacientes = await Paciente.findAll({
      include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });

    res.render("recepcion/buscar", {
      pacientes,
      mensaje: "",
      errores,
      dniNoEncontrado
    });

  } catch (error) {
    console.error("Error al buscar los pacientes:", error);
    res.status(500).send("Error al buscar los pacientes.");
  }
}

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



module.exports = {
  formularioRegistro,
  crearPaciente,
  buscarPaciente,
  datosPaciente,
  // crearSeguroPaciente,
  // editarSeguroPaciente,
  // formularioEditarPaciente,
  // actualizarPaciente,
  // formularioAdmitir,
  // crearAdmision,
  // admicionVista,
  // formularioEmergencia,
  // crearAdmisionEmergencia,
  // listaEmergencia,
  // verEmergencia
};