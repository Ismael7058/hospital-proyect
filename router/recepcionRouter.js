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


module.exports = router;

