const express = require('express');
const router = express.Router();
const recepcionController = require('../controller/recepcionController');

router.get('/recepcion', recepcionController.renderHome);

module.exports = router;