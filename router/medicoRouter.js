const express = require('express');
const router = express.Router();
const medicoController = require('../controller/medicoController');

router.get('/medico', medicoController.renderHome);

module.exports = router;