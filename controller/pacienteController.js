const {
  Nacionalidad,
  Paciente,
  Ala,
  Habitacion,
  Cama,
  Turno
} = require("../model");
const validar = require('./validarDatos')
const { Op } = require("sequelize");

async function formularioRegistro(req, res) {
  const dni = req.query.dni || req.body ||"";
  const nacionalidades = await Nacionalidad.findAll({
    attributes: ["id", "nombre"],
  });

  try {
    let errores = {};
    let dniNoEncontrado = null;
    let datos = {};
    const fechaHoy = new Date().toISOString().slice(0, 10); // "2025-06-13"
    if (dni) {
      errores = validar.controlDni(dni);
      if (Object.keys(errores).length === 0) {
        const paciente = await Paciente.findOne({ where: { dni } });
        if (paciente) {
          errores.existe = "Ya existe un paciente con ese DNI";

          datos = {
            nombre: req.query.nombre || "",
            apellido: req.query.apellido || "",
            fechaNacimiento: req.query.fechaNacimiento || "",
            genero: req.query.genero || "",
            nacionalidad: req.query.nacionalidad || "",
            domicilio: req.query.domicilio || "",
            email: req.query.email || "",
            telefono: req.query.telefono || "",
          };

          return res.render("recepcion/registrar", {
            nacionalidades,
            errores,
            dni,
            datos
          });
        } else {
          dniNoEncontrado = dni;
        }
      } else {
        dniNoEncontrado = dni;
      }
    }

    res.render("recepcion/registrar", {
      nacionalidades,
      errores,
      dni,
      datos: {},
      fechaHoy
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
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
  const fechaHoy = new Date().toISOString().slice(0, 10); // "2025-06-13"
  try {
    const errores = validar.validarCamposPaciente(paciente);
    
    if (Object.keys(errores).length > 0) {
      const nacionalidades = await Nacionalidad.findAll({
        attributes: ["id", "nombre"],
      });
      return res.status(400).render("recepcion/registrar", {
        errores,
        datos: paciente,
        nacionalidades,
      });
    }
    const pacienteExiste = await Paciente.findOne({ where: { dni: paciente.dni } });

    if (pacienteExiste) {
      const nacionalidades = await Nacionalidad.findAll({
        attributes: ["id", "nombre"],
      });
      return res.status(400).render("recepcion/registrar", {
        errores: { existe: "Ya existe un paciente con este DNI" },
        datos: paciente,
        dni: paciente.dni,
        id: pacienteExiste.id,
        nacionalidades,
        fechaHoy
      });
    }
    const newPaciente = await Paciente.create(paciente);
    res.redirect(`/recepcion/paciente/${newPaciente.id}`);
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    if (error.name === "SequelizeValidationError") {
      const nacionalidades = await Nacionalidad.findAll({
        attributes: ["id", "nombre"],
      });
      return res.status(400).render("recepcion/registrar", {
        errores: { existe: "Error de validación en la base de datos." },
        datos: paciente,
        nacionalidades,
        fechaHoy
      });
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

async function listarTurnos(req, res) {
  try {
    const turno = await Turno.findAll({
      where:{estado:true},
      include:[{
        model: Paciente,
        as: 'paciente'
      }]
    });

    const hoyISO = new Date().toISOString().slice(0, 10); // "2025-06-13"
    return res.render('recepcion/listaTurno',{turno, hoyISO});
  } catch (error) {
    console.error("Error al obtener la lista de turno:", error);
    res.status(500).send("Error interno del servidor");
  }
}


async function formularioAdmitir(req, res) {
  const idTurno = req.params.id
  try {
    const errores = {};
    if(!idTurno){
      return res.status(404).send("idTurno no existe")
    }
    const turnoHoy = await Turno.findByPk(idTurno,
      {include:[{
        model:Paciente,
        as: 'paciente'
      }]
    });
    const hoyISO = new Date().toISOString().slice(0, 10); // "2025-06-11"
    if(turnoHoy.fechaTurno > hoyISO){
      return res.status(404).send("No tiene turnos hoy");
    }
    const paciente = await Paciente.findByPk(turnoHoy.paciente.id)

    const generoFiltro = paciente
      ? { [Op.or]: [{ genero: paciente.genero }, { genero: null }] }
      : { genero: null };

    const alas = await Ala.findAll({
      include: [{
        model: Habitacion,
        where: generoFiltro,
        as: 'habitaciones',
        attributes: ['id', 'numero'],
        include: [{
          model: Cama,
          as: 'camas',
          attributes: ['id', 'numero', 'estado'],
          where: { estado: "Libre" },
          required: false
        }]
      }]
    });
    return res.render('recepcion/admitir', {paciente, alas, turnoHoy, errores:{}, dniNoEncontrado: null});
  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

module.exports = {
  formularioRegistro,
  crearPaciente,
  buscarPaciente,
  datosPaciente,
  listarTurnos,
  formularioAdmitir
};