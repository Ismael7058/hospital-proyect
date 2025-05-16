const express = require('express');
const router = express.Router();
const recepcionController = require('../controller/recepcionController');

router.get('/', recepcionController.renderHome);
router.get('/buscar', recepcionController.renderBuscarPaciente);

module.exports = router;