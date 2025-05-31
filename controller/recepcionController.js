const Sequelize = require("sequelize");
const Nacionalidad = require("../model/Nacionalidad");
const Paciente = require("../model/Paciente");
const SeguroPaciente = require("../model/SeguoPaciente");
const SeguroMedico = require("../model/SeguroMedico");
// Registrar Paciente Vista
async function formularioRegistro(req, res) {
  const dni = req.query.dni || "";
  const nacionalidades = await Nacionalidad.findAll({
    attributes: ["id", "nombre"],
  });
  const errores = req.query.errores || {};


  res.render("recepcion/registrar", { nacionalidades, errores, dni });

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
  const dni  = req.body.dni;
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
    res.render("recepcion/buscar", { pacientes, mensaje: "" });
  } catch (error) {
    console.error("Error al obtener los pacientes:", error);
    res.status(500).send("Error al obtener los pacientes.");
  }
}

// Controlador
async function formularioSeguro(req, res) {
  const id = req.params.id;
  try {
    const paciente = await Paciente.findByPk(id, {
      include: [
        {
          model: SeguroPaciente,
          include: [
            {
              model: SeguroMedico,
              attributes: ['nombre']
            }
          ]
        }
      ]
    });
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    const seguroMedico = await SeguroMedico.findAll();
    res.render("recepcion/seguro", { paciente, seguroMedico });

  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}
// Controlador para crear un nuevo SeguroPaciente
async function crearSeguroPaciente(req, res) {
  const pacienteId = req.params.id;
  const seguroPacienteData = {
    idSeguroMedico: req.body.seguroNuevo,              // select#seguroNuevo
    idPaciente: pacienteId,
    numeroAfiliado: req.body.numeroAfiliadoNuevo,      // input#numeroAfiliadoNuevo
    fechaVigencia: req.body.fechaVigenciaNuevo,        // input#fechaVigenciaNuevo
    fechaFinalizacion: req.body.fechaFinalizacionNuevo // input#fechaFinalizacionNuevo
  };

  try {
    // Verificar si ya existe ese seguro para el paciente
    const seguroExistente = await SeguroPaciente.findOne({
      where: {
        idSeguroMedico: seguroPacienteData.idSeguroMedico,
        idPaciente: pacienteId
      }
    });

    if (seguroExistente) {
      // Si ya existe, recargamos la vista con mensaje de error
      const [paciente, seguroMedico] = await Promise.all([
        Paciente.findByPk(pacienteId, {
          include: { model: SeguroPaciente, include: SeguroMedico }
        }),
        SeguroMedico.findAll()
      ]);

      return res.status(400).render("recepcion/seguro", {
        errores: { seguro: "Ya existe ese seguro médico para este paciente" },
        paciente,
        seguroMedico
      });
    }

    // Si no existe, lo creamos y redirigimos
    await SeguroPaciente.create(seguroPacienteData);
    res.redirect(`/seguro`);

  } catch (error) {
    console.error("Error al crear el seguro del paciente:", error);
    res.status(500).send("Error interno al crear el seguro del paciente.");
  }
}


// Controlador para editar un SeguroPaciente existente
async function editarSeguroPaciente(req, res) {
  const pacienteId = req.params.id;
  const {
    idSeguro,                     // hidden input#idSeguro
    numeroAfiliadoEditar,         // input#numeroAfiliadoEditar
    fechaVigenciaEditar,          // input#fechaVigenciaEditar
    fechaFinalizacionEditar       // input#fechaFinalizacionEditar
  } = req.body;
  try {
    // Buscamos el registro por PK
    const seguroRegistro = await SeguroPaciente.findByPk(idSeguro);

    if (!seguroRegistro) {
      return res.status(404).send("No se encontró el seguro para actualizar.");
    }

    // Actualizamos los campos
    await seguroRegistro.update({
      numeroAfiliado: numeroAfiliadoEditar,
      fechaVigencia: fechaVigenciaEditar,
      fechaFinalizacion: fechaFinalizacionEditar
    });

    // Redirigimos de vuelta a la gestión de seguros
    res.redirect(`/recepcion/buscar/${pacienteId}/seguro`);

  } catch (error) {
    console.error("Error al editar el seguro del paciente:", error);
    res.status(500).send("Error interno al editar el seguro del paciente.");
  }
}

async function formularioEditarPaciente(req, res) {
  const id = req.params.id;
  try {
    const paciente = await Paciente.findByPk(id, {
      include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    const nacionalidades = await Nacionalidad.findAll();
    res.render("recepcion/editar", { paciente, nacionalidades });
  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

async function actualizarPaciente(req, res) {
  const idPaciente = req.params.id;

  const datosActualizados = {
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

  try {


    const actualizado = await Paciente.update(datosActualizados, {
      where: { id: idPaciente }
    });

    if (actualizado[0] === 0) {
      return res.status(404).send("Paciente no encontrado.");
    }

    res.redirect(`/recepcion/buscar/${idPaciente}`);
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    res.status(500).send("Error al actualizar los datos del paciente.");
  }
}
module.exports = {
  formularioRegistro,
  crearPaciente,
  datosPaciente,
  buscarPaciente,
  buscarPacienteVista,
  formularioSeguro,
  crearSeguroPaciente,
  editarSeguroPaciente,
  formularioEditarPaciente,
  actualizarPaciente
};