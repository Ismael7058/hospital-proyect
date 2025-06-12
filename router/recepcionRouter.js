const express = require('express');
const router = express.Router();
const recepcionController = require('../controller/recepcionController');
const pacienteController = require('../controller/pacienteController');
const camaController = require('../controller/camaController')

router.get('/', (req, res) => res.render('recepcion/home'));
router.get('/registrar', pacienteController.formularioRegistro);
router.post('/registrar', pacienteController.crearPaciente);


router.get('/buscar', pacienteController.buscarPaciente);
router.get('/paciente/:id', pacienteController.datosPaciente);

// Ver - agregar - editar seguros medicos del paciente
router.get('/paciente/:id/seguro', recepcionController.formularioSeguro);
router.post('/paciente/:id/seguro/', recepcionController.crearSeguroPaciente);
router.post('/paciente/:id/seguro/editar', recepcionController.editarSeguroPaciente);

// Editar datos del Paciente
router.get('/paciente/:id/editar', recepcionController.formularioEditarPaciente);
router.post('/paciente/:id/editar', recepcionController.actualizarPaciente);

// Admitir paciente
router.get('/paciente/:id/admitir', recepcionController.formularioAdmitir);
router.post ('/paciente/:id/admitir', recepcionController.crearAdmision);
router.get('/paciente/:id/admitido', recepcionController.admicionVista);

router.get('/admitir', recepcionController.formularioAdmitir);
router.post('/admitir', recepcionController.crearAdmision);

router.get('/emergencia', recepcionController.formularioEmergencia);
router.post('/emergencia', recepcionController.crearAdmisionEmergencia);
router.get('/emergencia/:id', recepcionController.verEmergencia);

router.get('/listEmergencia', recepcionController.listaEmergencia);
router.get('/listEmergencia/:id', recepcionController.verEmergencia);

router.get('/camas', camaController.verCamas)
router.get('/turnos', pacienteController.listarTurnos)
router.get('/turnos/:id', pacienteController.formularioAdmitir)
module.exports = router;