const express = require('express');
const router = express.Router();
const recepcionController = require('../controller/recepcionController');
const Paciente = require('../model/Paciente');
const Nacionalidad = require('../model/Nacionalidad');

router.get('/', (req, res) => res.render('recepcion/home'));
router.get('/registrar', recepcionController.formularioRegistro);
router.post('/registrar', recepcionController.crearPaciente);

router.get('/buscar', recepcionController.buscarPacienteVista);
router.post('/buscar', recepcionController.buscarPaciente); 

router.get('/buscar/:id', recepcionController.datosPaciente);

// Ver - agregar - editar seguros medicos del paciente
router.get('/buscar/:id/seguro', recepcionController.formularioSeguro);
router.post('/buscar/:id/seguro', recepcionController.crearSeguroPaciente);
router.post('/buscar/:id/seguro/editar', recepcionController.editarSeguroPaciente);

// Editar datos del Paciente
router.get('/buscar/:id/editar', recepcionController.formularioEditarPaciente);
router.post('/buscar/:id/editar', recepcionController.actualizarPaciente);

// Admitir paciente
router.get('/buscar/:id/admitir', recepcionController.formularioAdmitir);
router.post ('/buscar/:id/admitir', recepcionController.crearAdmision);
router.get('/buscar/:id/admitido', recepcionController.admicionVista)

router.get('/admitir', recepcionController.formularioAdmitir)
router.post('/admitir', recepcionController.crearAdmision)

router.get('/emergencia', recepcionController.formularioEmergencia);
router.post('/emergencia', recepcionController.crearAdmisionEmergencia);

module.exports = router;

