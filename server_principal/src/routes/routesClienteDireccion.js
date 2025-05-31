const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerClienteDireccion'); 

// Obtener todas las relaciones cliente-dirección
router.get('/', controller.getAllClienteDirecciones);

// Obtener una relación cliente-dirección por ID de cliente y ID de dirección
router.get('/:clienteId/:direccionId', controller.getClienteDireccionByIds);

// Crear una nueva relación cliente-dirección
router.post('/', controller.createClienteDireccion);

// Actualizar el estado de una relación cliente-dirección
router.put('/:clienteId/:direccionId', controller.updateClienteDireccionEstado);

// Eliminar una relación cliente-dirección
router.delete('/:clienteId/:direccionId', controller.deleteClienteDireccion);

module.exports = router;