const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerTelefono'); // Asegúrate de que la ruta sea correcta

// GET /api/telefonos
router.get('/', controller.getAllTelefonos);

// GET /api/telefonos/:id
router.get('/:id', controller.getTelefonoById);

// POST /api/telefonos
router.post('/', controller.createTelefono);

// PUT /api/telefonos/:id
router.put('/:id', controller.updateTelefono);

// DELETE /api/telefonos/:id
router.delete('/:id', controller.deleteTelefono);

module.exports = router;