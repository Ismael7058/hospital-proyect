const express = require('express');
const router = express.Router();
const enfermeroController = require('../controller/enfermeroController');

router.get('/', enfermeroController.renderHome);

module.exports = router;