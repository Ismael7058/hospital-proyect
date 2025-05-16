const express = require('express');
const router = express.Router();
const recepcionController = require('../controller/recepcionController');

router.get('/', recepcionController.renderHome);
router.get('/buscar', recepcionController.renderBuscarPaciente);
router.post('/buscar', recepcionController.buscarPacienteFiltrado);
router.get('/registrar', recepcionController.renderRegistrarPaciente);
router.post('/registrar', recepcionController.crearPaciente);
router.get('/internar', recepcionController.renderInternarPaciente);
router.post('/internar', recepcionController.internarPaciente);

module.exports = router;