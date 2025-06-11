const { render } = require("pug");
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
  AdmisionProv,
  Turno
} = require("../model");

const validar = require('./validarDatos')
const { Op } = require("sequelize");



async function formularioSeguro(req, res) {
  const id = req.params.id;
  try {
    const paciente = await Paciente.findByPk(id, {
      include: [{
        model: SeguroPaciente,
        include: [SeguroMedico]
      }]
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
        include: [{ model: SeguroMedico, attributes: ['id', 'nombre'] }]
      }]
    });
    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    const listaSeguros = await SeguroMedico.findAll({ attributes: ['id', 'nombre'] });

    const seguroExistente = paciente.SeguroPacientes
      .some(sp => String(sp.idSeguroMedico) === String(seguroNuevo))
    if (seguroExistente) {
      return res.status(400).render("recepcion/seguro", {
        errores: { seguro: "Ya existe ese seguro para este paciente." },
        paciente,
        seguroMedico: listaSeguros, erroresCreate: {}, erroresUpdate: {}
      });
    }

    const erroresCreate = {};
    validarDatosSeguro({ numeroAfiliadoNuevo, fechaVigenciaNuevo, fechaFinalizacionNuevo }, erroresCreate);
    if (Object.keys(erroresCreate).length > 0) {
      return res.status(400).render("recepcion/seguro", {
        erroresCreate,
        paciente,
        seguroMedico: listaSeguros,
        erroresUpdate: {}
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
    return res.redirect(`/recepcion/paciente/${pacienteId}/seguro/`);
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
  } else {
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
    validarDatosSeguroDos({ numeroAfiliadoEditar, fechaVigenciaEditar, fechaFinalizacionEditar }, erroresUpdate);
    if (Object.keys(erroresUpdate).length > 0) {
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
      return res.render("recepcion/seguro", { paciente, seguroMedico, erroresUpdate, erroresCreate: {} });
    }
    await seguroRegistro.update({
      numeroAfiliado: numeroAfiliadoEditar,
      fechaVigencia: fechaVigenciaEditar,
      fechaFinalizacion: fechaFinalizacionEditar
    });

    res.redirect(`/recepcion/paciente/${idPaciente}/seguro/`);
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
  } else {
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
  } else {
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
    res.render("recepcion/editar", { paciente, nacionalidades, errores: {}, fechaHoy });
  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

async function actualizarPaciente(req, res) {
  const idPaciente = req.params.id;
  let idNacionalidad = req.body.nacionalidad;
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

    if (!req.body.nacionalidad) {
      idNacionalidad = paciente.nacionalidad.id;
    }

    const nacionalidad = await Nacionalidad.findByPk(idNacionalidad);

    if (!nacionalidad) return res.status(404).send("Nacionalidad no encontrado");

    const errores = controlActualizaPaciente(datosActualizados, nacionalidad);
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

    res.redirect(`/recepcion/paciente/${idPaciente}`);
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
    let errores = {};
    let paciente = null;
    let turnoHoy = null;
    const hoy = new Date();
    const startOfDay = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
    if (idPaciente) {
      paciente = await Paciente.findByPk(idPaciente);

      if (!paciente) return res.status(404).send("Paciente no encontrado");

      const admisionActiva = await Admision.findOne({
        where: {
          idPaciente: paciente.id,
          fechaEgreso: null
        }
      });

      if (admisionActiva) {
        return res.redirect(`/recepcion/paciente/${idPaciente}/admitido`);
      }

      turnoHoy = await Turno.findOne({
        where: {
          idPaciente,
          fechaTurno: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
    }

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

    res.render("recepcion/admitir", { paciente, alas, turnoHoy, errores, dniNoEncontrado: null });
  } catch (error) {
    console.error("Error al obtener el paciente:", error.message, error.stack);
    res.status(500).send("Error interno del servidor");
  }
}

async function crearAdmision(req, res) {
  const idPacienteParam = req.params.id;
  const dni = req.body.dni;

  try {
    const errores = {};
    let paciente;
    if (idPacienteParam) {
      paciente = await Paciente.findByPk(idPacienteParam);
    } else if (dni) {
      paciente = await Paciente.findOne({ where: { dni } });
    } else {
      return res.status(400).send("Se requiere ID o DNI del paciente");
    }

    if (!paciente) {
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
      const dniNoEncontrado = dni;
      errores.dniError = "Paciente no encontrado";
      return res.status(404).render("recepcion/admitir", { paciente, alas, turnoHoy: null, errores, dniNoEncontrado });
    }

    const idPaciente = paciente.id;

    const admisionActiva = await Admision.findOne({
      where: {
        idPaciente,
        fechaEgreso: null
      }
    });

    if (admisionActiva) {
      return res.status(400).send("El paciente ya tiene una admisión activa.");
    }

    const fechaIngreso = new Date();


    const admisionSolapada = await Admision.findOne({
      where: {
        idPaciente,
        fechaEgreso: {
          [Op.gt]: fechaIngreso
        }
      }
    });

    if (admisionSolapada) {
      return res.status(400).send("Ya existe una admisión anterior con una fecha de finalización posterior a la fecha de ingreso.");
    }

    const cama = await Cama.findByPk(req.body.cama);
    if (!cama || cama.estado !== "Libre") {
      return res.status(400).send("La cama seleccionada no está disponible.");
    }

    const habitacion = await Habitacion.findByPk(cama.idHabitacion);
    if (!habitacion) {
      return res.status(400).send("Habitación no encontrada.");
    }


    if (habitacion.genero !== null && habitacion.genero !== paciente.genero) {
      return res.status(400)
        .send(`La habitación está reservada para género ${habitacion.genero} y el paciente es ${paciente.genero}.`);
    }

    const nuevaAdmision = await Admision.create({
      idPaciente,
      motivo: req.body.motivo,
      diagnosticoInicial: req.body.diagnosticoInicial,
      fechaIngreso,
      fechaEgreso: null
    });


    await TrasladoInternacion.create({
      fechaInicio: fechaIngreso,
      fechaFin: null,
      idAdmision: nuevaAdmision.id,
      idCama: cama.id,
      motivoCambio: null
    });


    await cama.update({ estado: "Ocupado" });

    if (habitacion.genero === null) {
      await Habitacion.update(
        { genero: genero },
        { where: { id: habitacion.id }, transaction: t }
      );
    }
    if (req.body.motivo === "Turno" && req.body.turnoId) {
      await Turno.update(
        { estado: false },
        { where: { id: req.body.turnoId } }
      );
    }

    res.redirect(`/recepcion/paciente/${idPaciente}/admitido`);

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
      where: { idPaciente, fechaEgreso: null },
      include: [{
        model: TrasladoInternacion,
        as: 'TrasladoInternacions',
        include: [{
          model: Cama,
          as: 'cama',
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

    if (!admisionActiva || !admisionActiva.TrasladoInternacions?.length) {
      return res.status(404).send("No se encontró información de cama asignada");
    }

    const ultimo = admisionActiva.TrasladoInternacions.slice(-1)[0];
    const cama = ultimo.cama;
    const habitacion = cama?.habitacion;
    const ala = habitacion?.ala;

    return res.render("recepcion/admitido", {
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
    console.error("Error en admicionVista:", error);
    res.status(500).send("Error interno del servidor");
  }
}



async function formularioEmergencia(req, res) {
  try {
    const errores = {};
    const alas = await Ala.findAll({
      include: [
        {
          model: Habitacion,
          as: 'habitaciones',
          attributes: ['id', 'numero', 'genero'],
          include: [
            {
              model: Cama,
              as: 'camas',
              attributes: ['id', 'numero', 'estado'],
              required: false,
              include: [
                {
                  model: TrasladoInternacion,
                  as: 'trasladosInternacion',
                  attributes: ['id'],
                  where: {
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
      alasEmergencia: alas,
      errores
    });
  } catch (error) {
    console.error('Error al cargar formulario emergencia:', error);
    res.status(500).send('Error interno al cargar el formulario');
  }
}

async function crearAdmisionEmergencia(req, res) {
  const t = await sequelize.transaction();
  try {
    const {
      dni,
      nombre,
      apellido,
      genero,
      ala: alaId,
      habitacion: habId,
      cama: camaId,
      diagnosticoInicial
    } = req.body;
    let errores = validar.controlDni(dni)
    if (Object.keys(errores).length > 0) {
      const alasE = await Ala.findAll({
        include: [
          {
            model: Habitacion,
            as: 'habitaciones',
            attributes: ['id', 'numero', 'genero'],
            include: [
              {
                model: Cama,
                as: 'camas',
                attributes: ['id', 'numero', 'estado'],
                required: false,
                include: [
                  {
                    model: TrasladoInternacion,
                    as: 'trasladosInternacion',
                    attributes: ['id'],
                    where: {
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
      return res.render("recepcion/admitirEmergencia", {
        alasEmergencia: alasE,
        errores
      });
    }
    if (!["Masculino", "Femenino"].includes(genero)) {
      return res.status(400).send("Género inválido");
    }

    const ala = await Ala.findByPk(alaId);
    if (!ala) {
      return res.status(400).send("Ala no encontrada");
    }

    const habitacion = await Habitacion.findOne({
      where: { id: habId, idAla: alaId },
      include: [
        {
          model: Cama,
          as: 'camas',
          include: [
            {
              model: TrasladoInternacion,
              as: 'trasladosInternacion',
              where: {
                fechaFin: null
              },
              required: false,
              include: [
                {
                  model: AdmisionProv,
                  as: 'admisionProvisional',
                  attributes: ['generoPaciente']
                },
                {
                  model: Admision,
                  include: [
                    {
                      model: Paciente,
                      attributes: ['genero']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!habitacion) {
      return res.status(400).send("Habitación no encontrada en el ala seleccionada");
    }

    if (habitacion.genero !== null && habitacion.genero !== genero) {
      return res.status(400).send(`La habitación es para pacientes de género ${habitacion.genero}`);
    }

    const cama = habitacion.camas.find(c =>
      c.id.toString() === camaId &&
      c.estado === "Libre" &&
      !c.trasladosInternacion.some(t => t.fechaFin === null)
    );

    if (!cama) {
      return res.status(400).send("La cama seleccionada no está disponible");
    }

    for (const c of habitacion.camas) {
      for (const traslado of c.trasladosInternacion || []) {
        if (traslado.admisionProvisional && traslado.admisionProvisional.generoPaciente !== genero) {
          return res.status(400).send(`Ya hay un paciente de género ${traslado.admisionProvisional.generoPaciente} en esta habitación`);
        }
        if (traslado.admision && traslado.admision.paciente && traslado.admision.paciente.genero !== genero) {
          return res.status(400).send(`Ya hay un paciente de género ${traslado.admision.paciente.genero} en esta habitación`);
        }
      }
    }

    const nuevaAdmisionProv = await AdmisionProv.create(
      {
        dni: dni || null,
        nombre: nombre || "Desconocido",
        apellido: apellido || "Desconocido",
        generoPaciente: genero,
        fechaIngreso: new Date(),
        motivo: diagnosticoInicial
      },
      { transaction: t }
    );

    await TrasladoInternacion.create(
      {
        idAdmisionProvisional: nuevaAdmisionProv.id,
        idCama: cama.id,
        fechaInicio: new Date(),
        fechaFin: null
      },
      { transaction: t }
    );
    if (habitacion.genero === null) {
      await Habitacion.update(
        { genero: genero },
        { where: { id: habitacion.id }, transaction: t }
      );
    }

    await Cama.update(
      { estado: "Ocupado" },
      { where: { id: cama.id }, transaction: t }
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



