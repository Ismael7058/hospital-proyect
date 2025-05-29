const express = require('express');
const router = express.Router();
const recepcionController = require('../controller/recepcionController');

router.get('/', (req, res) => res.render('recepcion/home'));
router.get('/registrar', recepcionController.formularioRegistro);
router.post('/registrar', recepcionController.crearPaciente);

router.get('/buscar/:id', recepcionController.datosPaciente);


module.exports = router;

