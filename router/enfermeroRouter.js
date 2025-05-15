const express = require('express');
const router = express.Router();
const enfermeroController = require('../controller/enfermeroController');

router.get('/enfermero', enfermeroController.renderHome);

module.exports = router;