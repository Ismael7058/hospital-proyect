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

const { Op } = require("sequelize");


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
  const dni = req.body.dni;
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
              attributes: ['id', 'nombre']
            }
          ]
        }
      ]
    });
    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    const todosSeguros = await SeguroMedico.findAll({
      attributes: ['id', 'nombre']
    });

    const segurosExistentesIds = new Set(
      paciente.SeguroPacientes.map(sp => sp.SeguroMedico.id)
    );

    const segurosDisponibles = todosSeguros.filter(
      sm => !segurosExistentesIds.has(sm.id)
    );

    res.render("recepcion/seguro", {
      paciente,
      seguroMedico: segurosDisponibles,
      erroresUpdate: {}, erroresCreate: {}
    });
  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}


async function crearSeguroPaciente(req, res) {
  const pacienteId = req.params.id;
const { seguroNuevo, numeroAfiliadoNuevo, fechaVigenciaNuevo, fechaFinalizacionNuevo } = req.body;
  
  try {
    const paciente = await Paciente.findByPk(pacienteId, {
      include: [{
        model: SeguroPaciente,
        include: [{ model: SeguroMedico, attributes: ['id','nombre'] }]
      }]
    });
    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    const listaSeguros = await SeguroMedico.findAll({ attributes: ['id','nombre'] });

    const seguroExistente = paciente.SeguroPacientes
      .some(sp => String(sp.idSeguroMedico) === String(seguroNuevo))
    if (seguroExistente) {
      return res.status(400).render("recepcion/seguro", {
        errores: { seguro: "Ya existe ese seguro para este paciente." },
        paciente,
        seguroMedico: listaSeguros, erroresCreate:{}, erroresUpdate: {}
      });
    }

    const erroresCreate = {};
    validarDatosSeguro({ numeroAfiliadoNuevo, fechaVigenciaNuevo, fechaFinalizacionNuevo}, erroresCreate);
    if (Object.keys(erroresCreate).length > 0) {
      return res.status(400).render("recepcion/seguro", {
        erroresCreate,
        paciente,
        seguroMedico: listaSeguros, 
        erroresUpdate:{}
      });
    }

    await SeguroPaciente.create(
      { 
        idSeguroMedico: seguroNuevo,
        idPaciente: pacienteId,
        numeroAfiliado: numeroAfiliadoNuevo,
        fechaVigencia: fechaVigenciaNuevo,
        fechaFinalizacion: fechaFinalizacionNuevo
      }
    );
    return res.redirect(`/recepcion/buscar/${pacienteId}/seguro`);
  }
  catch (error) {
    console.error("Error al crear el seguro del paciente:", error);
    return res.status(500).send("Error interno al crear el seguro del paciente.");
  }
}

function validarDatosSeguro({ numeroAfiliadoNuevo, fechaVigenciaNuevo, fechaFinalizacionNuevo }, erroresCreate = {}) {
  if (!/^\d{5,}$/.test(numeroAfiliadoNuevo)) {
    erroresCreate.numeroAfiliadoNuevo = "Número de afiliado debe tener al menos 5 dígitos y no contener letras.";
  }

  if (fechaVigenciaNuevo) {
    const [y, m, d] = fechaVigenciaNuevo.split('-').map(Number);
    const fv = new Date(y, m - 1, d);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fv.getTime()) || fv > hoy) {
      erroresCreate.fechaVigenciaNuevo = "La Fecha de Vigencia no puede ser mayor a hoy.";
    }
  }else {
    erroresCreate.fechaVigenciaNuevo = "La Fecha de Vigencia es obligatoria.";
  }

  if (fechaFinalizacionNuevo) {
    const [y2, m2, d2] = fechaFinalizacionNuevo.split('-').map(Number);
    const ff = new Date(y2, m2 - 1, d2);
    const [y1, m1, d1] = fechaVigenciaNuevo.split('-').map(Number);
    const fv = new Date(y1, m1 - 1, d1);
    if (isNaN(ff.getTime()) || ff <= fv) {
      erroresCreate.fechaFinalizacionNuevo = "Fecha de finalización debe ser mayor que fecha de vigencia.";
    }
  } else {
    erroresCreate.fechaFinalizacionNuevo = "La Fecha de Finalización es obligatoria.";
  }
  return erroresCreate;
}


async function editarSeguroPaciente(req, res) {
  const idPaciente = req.params.id;
  const { idSeguro, numeroAfiliadoEditar, fechaVigenciaEditar, fechaFinalizacionEditar } = req.body;
  try {
    const seguroRegistro = await SeguroPaciente.findByPk(idSeguro);
    if (!seguroRegistro) {
      return res.status(404).send("No se encontró el seguro para actualizar.");
    }
    let paciente = await Paciente.findByPk(idPaciente, {
        include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    let erroresUpdate = {};
    validarDatosSeguroDos({numeroAfiliadoEditar, fechaVigenciaEditar, fechaFinalizacionEditar}, erroresUpdate );
    if (Object.keys(erroresUpdate).length > 0){
      paciente = await Paciente.findByPk(idPaciente, {
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

      const seguroMedico = await SeguroMedico.findAll();
      return res.render("recepcion/seguro", { paciente, seguroMedico, erroresUpdate, erroresCreate:{} });
    }
    await seguroRegistro.update({
      numeroAfiliado: numeroAfiliadoEditar,
      fechaVigencia: fechaVigenciaEditar,
      fechaFinalizacion: fechaFinalizacionEditar
    });

    res.redirect(`/recepcion/buscar/${idPaciente}/seguro`);
  } catch (error) {
    console.error("Error al editar el seguro del paciente:", error);
    res.status(500).send("Error interno al editar el seguro del paciente.");
  }
}

function validarDatosSeguroDos({ numeroAfiliadoEditar, fechaVigenciaEditar, fechaFinalizacionEditar }, erroresUpdate = {}) {
  if (!/^\d{5,}$/.test(numeroAfiliadoEditar)) {
    erroresUpdate.numeroAfiliadoEditar = "Número de afiliado debe tener al menos 5 dígitos y no contener letras.";
  }

  if (fechaVigenciaEditar) {
    const [y, m, d] = fechaVigenciaEditar.split('-').map(Number);
    const fv = new Date(y, m - 1, d);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fv.getTime()) || fv > hoy) {
      erroresUpdate.fechaVigenciaEditar = "La Fecha de Vigencia no puede ser mayor a hoy.";
    }
  }else {
    erroresUpdate.fechaVigenciaEditar = "La Fecha de Vigencia es obligatoria.";
  }

  if (fechaFinalizacionEditar) {
    const [y2, m2, d2] = fechaFinalizacionEditar.split('-').map(Number);
    const ff = new Date(y2, m2 - 1, d2);
    const [y1, m1, d1] = fechaVigenciaEditar.split('-').map(Number);
    const fv = new Date(y1, m1 - 1, d1);

    if (isNaN(ff.getTime()) || ff <= fv) {
      erroresUpdate.fechaFinalizacionEditar = "La Fecha de Finalización debe ser posterior a la de Vigencia.";
    }
  }else {
    erroresUpdate.fechaFinalizacionEditar = "La Fecha de Finalización es obligatoria.";
  }

  return erroresUpdate;
}


async function formularioEditarPaciente(req, res) {
  const id = req.params.id;
  try {
    const paciente = await Paciente.findByPk(id, {
      include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    const nacionalidades = await Nacionalidad.findAll();
    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    res.render("recepcion/editar", { paciente, nacionalidades ,errores:{}, fechaHoy});
  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

async function actualizarPaciente(req, res) {
  const idPaciente = req.params.id;
  let idNacionalidad= req.body.nacionalidad;
  const datosActualizados = {
    nombre: req.body.nombre?.trim(),
    apellido: req.body.apellido?.trim(),
    genero: req.body.genero,
    fechaNacimiento: req.body.fechaNacimiento,
    idNacionalidad: req.body.nacionalidad,
    domicilio: req.body.domicilio?.trim(),
    email: req.body.email?.trim(),
    telefono: req.body.telefono?.trim()
  };

  
  try {
    const paciente = await Paciente.findByPk(idPaciente, {
        include: [{ model: Nacionalidad, as: 'nacionalidad', attributes: ['id', 'nombre'] }]
    });
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    if (!req.body.nacionalidad){
      idNacionalidad = paciente.nacionalidad.id;
    }

    const nacionalidad = await Nacionalidad.findByPk(idNacionalidad);

    if (!nacionalidad) return res.status(404).send("Nacionalidad no encontrado");

    const errores = controlActualizaPaciente(datosActualizados,nacionalidad);
    if (Object.keys(errores).length > 0) {
      const nacionalidades = await Nacionalidad.findAll();
      return res.status(400).render("recepcion/editar", { errores, paciente, nacionalidades });
    }

    const actualizado = await Paciente.update({
      nombre: datosActualizados.nombre,
      apellido: datosActualizados.apellido,
      genero: datosActualizados.genero,
      fechaNacimiento: datosActualizados.fechaNacimiento,
      idNacionalidad: datosActualizados.idNacionalidad,
      domicilio: datosActualizados.domicilio,
      email: datosActualizados.email,
      telefono: datosActualizados.telefono,
    }, {
      where: { id: idPaciente }
    });

    if (actualizado[0] === 0) {
      return res.status(404).send("Paciente no encontrado o sin cambios");
    }

    res.redirect(`/recepcion/buscar/${idPaciente}`);
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    res.status(500).send("Error al actualizar los datos del paciente.");
  }
}

function controlActualizaPaciente(datos) {
  const errores = {};

  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.nombre = 'El campo Nombre es obligatorio';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(datos.nombre.trim())) {
    errores.nombre = 'El Nombre debe tener al menos 3 letras y no contener números';
  }

  if (!datos.apellido || datos.apellido.trim() === '') {
    errores.apellido = 'El campo Apellido es obligatorio';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(datos.apellido.trim())) {
    errores.apellido = 'El Apellido debe tener al menos 3 letras y no contener números';
  }

  if (!datos.genero || !['Masculino', 'Femenino'].includes(datos.genero)) {
    errores.genero = 'El Género debe ser Masculino o Femenino';
  }

  if (!datos.fechaNacimiento) {
    errores.fechaNacimiento = 'La Fecha de Nacimiento es obligatoria';
  } else {
    const partesFecha = datos.fechaNacimiento.split('-'); // formato YYYY-MM-DD
    const fecha = new Date(parseInt(partesFecha[0]), parseInt(partesFecha[1]) - 1, parseInt(partesFecha[2]));

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime()) || fecha > hoy) {
      errores.fechaNacimiento = 'Fecha mayor a la de hoy';
    }
  }

  if (!datos.domicilio || datos.domicilio.trim().length < 10) {
    errores.domicilio = 'El Domicilio debe tener al menos 10 caracteres';
  }

  if (!datos.email) {
    errores.email = 'El Email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    errores.email = 'El formato del Email no es válido';
  }

  if (!datos.telefono) {
    errores.telefono = 'El Teléfono es obligatorio';
  } else if (!/^\d{10,}$/.test(datos.telefono)) {
    errores.telefono = 'El Teléfono debe contener solo números y tener al menos 10 dígitos';
  }
  return errores;
}




async function formularioAdmitir(req, res) {
  const idPaciente = req.params.id;
  try {
    const alas = await Ala.findAll({
      include: [{
        model: Habitacion,
        as: 'habitaciones',
        attributes: ['id', 'numero'],
        include: [{
          model: Cama,
          as: 'camas',
          attributes: ['id', 'numero', 'estado'],
          where: {
            estado: true
          },
          required: false
        }]
      }]
    });
    if (idPaciente != undefined) {
      const paciente = await Paciente.findByPk(idPaciente);
      if (!paciente) return res.status(404).send("Paciente no encontrado");

      // Buscar admisión activa (fechaEgreso = null)
      const admisionActiva = await Admision.findOne({
        where: {
          idPaciente: idPaciente,
          fechaEgreso: null
        }
      });

      if (admisionActiva) {
        return res.redirect(`/recepcion/buscar/${idPaciente}/admitido`);
      }
      res.render("recepcion/admitir", { paciente, alas });
    }else {
      res.render("recepcion/admitir", { paciente:{}, alas });
    }

  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

async function crearAdmision(req, res) {
  const idPacienteParam = req.params.id;
  const dni = req.body.dni;

  try {
    let paciente;
    if (idPacienteParam) {
      paciente = await Paciente.findByPk(idPacienteParam);
    } else if (dni) {
      paciente = await Paciente.findOne({ where: { dni: dni } });
    } else {
      return res.status(400).send("Se requiere ID o DNI del paciente");
    }

    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    const idPaciente = paciente.id;

    const seguroNuevo = {
      idSeguroMedico: req.body.idSeguroMedico,
      idPaciente: idPaciente,
      numeroAfiliado: req.body.numeroAfiliado,
      fechaVigencia: new Date(req.body.fechaVigencia),
      fechaFinalizacion: req.body.fechaFinalizacion ? new Date(req.body.fechaFinalizacion) : null
    };

    // 1️Buscar admisión activa (fechaEgreso = null)
    const admisionActiva = await Admision.findOne({
      where: {
        idPaciente: idPaciente,
        fechaEgreso: null
      }
    });

    if (admisionActiva) {
      return res.status(400).send("El paciente ya tiene una admisión activa.");
    }

    // Buscar admisión con fechas de finalizacion posterior a la fecha que se intenta ingresar
    const admisionSolapada = await Admision.findOne({
      where: {
        idPaciente: idPaciente,
        fechaEgreso: {
          [Op.gt]: seguroNuevo.fechaVigencia
        }
      }
    });

    if (admisionSolapada) {
      return res.status(400).send("Ya existe una admisión anterior con una fecha de finalización posterior a la fecha de vigencia solicitada.");
    }

    // Verifica que la cama no este ocupada
    const cama = await Cama.findByPk(req.body.cama);
    if (!cama || cama.ocupada) {
      return res.status(400).send("La cama seleccionada no está disponible.");
    }

    // Crear admisión
    const nuevaAdmision = await Admision.create({
      idPaciente: idPaciente,
      idSeguroMedico: seguroNuevo.idSeguroMedico,
      fechaIngreso: new Date(),
      fechaEgreso: null,
      diagnosticoInicial: req.body.diagnosticoInicial
    });

    if (nuevaAdmision) {
      // Crear TrasladoInternacion que registra los movimientos de traslado de cama del paciente
      const nuevaTrasladoInternacion = await TrasladoInternacion.create({
        fechaInicio: new Date(),
        idAdmision: nuevaAdmision.id,
        idCama: req.body.cama,
        motivoCambio: null
      });
      await cama.update({ ocupada: true });
    }

    res.redirect(`/recepcion/buscar/${idPaciente}/admitido`);

  } catch (error) {
    console.error("Error al crear admisión:", error.message);
    res.status(500).send("Error interno del servidor");
  }
}



async function admicionVista(req, res) {
  const idPaciente = req.params.id;

  try {
    const paciente = await Paciente.findByPk(idPaciente);
    if (!paciente) return res.status(404).send("Paciente no encontrado");

    const admisionActiva = await Admision.findOne({
      where: {
        idPaciente,
        fechaEgreso: null
      },
      include: [{
        model: TrasladoInternacion,
        include: [{
          model: Cama,
          include: [{
            model: Habitacion,
            as: 'habitacion',
            include: [{
              model: Ala,
              as: 'ala'
            }]
          }]
        }]
      }]
    });

    if (!admisionActiva || admisionActiva.TrasladoInternacions.length === 0) {
      return res.status(404).send("No se encontró información de cama asignada");
    }

    // Tomamos el último traslado (el más reciente)
    const ultimoTraslado = admisionActiva.TrasladoInternacions[admisionActiva.TrasladoInternacions.length - 1];
    const cama = ultimoTraslado.Cama;
    const habitacion = cama?.habitacion;
    const ala = habitacion?.ala;

    res.render("recepcion/admitido", {
      paciente,
      admisionActiva: {
        fechaIngreso: admisionActiva.fechaIngreso,
        diagnosticoInicial: admisionActiva.diagnosticoInicial,
        cama,
        habitacion,
        ala
      }
    });

  } catch (error) {
    console.error("Error en formularioAdmitido:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

async function formularioEmergencia(req, res) {
  try {
    const alas = await Ala.findAll({
      where: {
        id: 4
      },
      include: [
        {
          model: Habitacion,
          as: 'habitaciones',
          attributes: ['id', 'numero'],
          include: [
            {
              model: Cama,
              as: 'camas',
              attributes: ['id', 'numero', 'estado'],
              where: {
                estado: true
              },
              required: false,
              include: [
                {
                  model: TrasladoInternacion,
                  as: 'trasladosInternacion',
                  attributes: ['id'],
                  where:{
                    fechaFin: null 
                  },
                  required: false,
                  include: [
                    {
                      model: AdmisionProv,
                      as: 'admisionProvisional',
                      attributes: ['generoPaciente']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    res.render("recepcion/admitirEmergencia", {
      alasEmergencia: alas
    });
  } catch (error) {
    console.error('Error al cargar formulario emergencia:', error);
    res.status(500).send('Error interno al cargar el formulario');
  }
}

async function crearAdmisionEmergencia(req, res) {
  const t = await sequelize.transaction();

  try {
    const { nombre, apellido, genero, habitacion, cama, diagnosticoInicial } = req.body;

    const nuevaAdmisionProv = await AdmisionProv.create(
      {
        nombre: nombre || "Desconocido",
        apellido: apellido || "Desconocido",
        generoPaciente: genero,
        fechaIngreso: new Date(req.body.fechaVigencia),
        motivo: diagnosticoInicial
      },
      { transaction: t }
    );

    const nuevoTraslado = await TrasladoInternacion.create(
      {
        idAdmisionProvisional: nuevaAdmisionProv.id,
        idCama: cama,
        fechaInicio: new Date(),
        fechaFin: null
      },
      { transaction: t }
    );

    await Cama.update(
      { estado: false },
      {
        where: { id: cama },
        transaction: t
      }
    );

    await t.commit();

    return res.redirect(`/recepcion/emergencia/${nuevaAdmisionProv.id}`);
  } catch (error) {
    await t.rollback();
    console.error("Error al crear admisión de emergencia:", error);
    return res.status(500).send("Error interno al crear admisión de emergencia");
  }
}

async function listaEmergencia(req, res) {
  try {
    const admisiones = await AdmisionProv.findAll({
      include: [
        {
          model: TrasladoInternacion,
          as: 'traslados',
          required: true,
          include: [
            {
              model: Cama,
              as: 'cama',
              attributes: ['numero'],
              include: [
                {
                  model: Habitacion,
                  as: 'habitacion',
                  attributes: ['numero'],
                  include: [
                    {
                      model: Ala,
                      as: 'ala',
                      attributes: ['nombre']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      order: [[{ model: TrasladoInternacion, as: 'traslados' }, 'fechaInicio', 'DESC']]

    });


    res.render('recepcion/listaEmergencia', { admisiones });
  } catch (error) {
    console.error("Error al obtener la lista de emergencias:", error);
    res.status(500).send("Error interno al obtener la lista de emergencias.");
  }
}

async function verEmergencia(req, res) {
  const { id } = req.params;

  try {
    const adm = await AdmisionProv.findByPk(id, {
      include: [
        {
          model: TrasladoInternacion,
          as: 'traslados',
          include: [
            {
              model: Cama,
              as: 'cama',
              include: [
                {
                  model: Habitacion,
                  as: 'habitacion',
                  include: [
                    {
                      model: Ala,
                      as: 'ala'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!adm) {
      return res.status(404).send('Admisión no encontrada');
    }

    res.render('recepcion/verEmergencia', { adm });
  } catch (error) {
    console.error("Error al buscar la admisión:", error);
    res.status(500).send("Error interno al cargar el detalle de emergencia.");
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
  actualizarPaciente,
  formularioAdmitir,
  crearAdmision,
  admicionVista,
  formularioEmergencia,
  crearAdmisionEmergencia,
  listaEmergencia,
  verEmergencia
};



